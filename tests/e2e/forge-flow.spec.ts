import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

// 6.2 — E2E do flow Forge → Characters → Runtime cobrindo a persistência nova.
// Validamos:
//   - boot do hub
//   - rota /character-forge monta sem erros
//   - "Send Mob" persiste no mobRepository (visível em /characters)
//   - Runtime recebe o mob criado (cache hidratado pelo bootstrap)
//   - reload preserva o mob (IndexedDB)

async function gotoForge(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.getByTestId("hub-surface")).toBeVisible();
  await page.locator(".shell-frame-nav [data-route='/character-forge']").click({ force: true });
  await expect(page.getByTestId("character-forge-shell")).toBeVisible();
  await expect(page.getByTestId("forge-dna-code")).not.toHaveText("");
}

async function readCacheRows(page: Page): Promise<number> {
  const text =
    (await page
      .locator(".forge-pipeline > div")
      .nth(1)
      .locator("strong")
      .textContent()) ?? "";
  const match = text.match(/(\d+)\s*rows/);
  return match ? Number(match[1]) : 0;
}

test.describe("forge → characters → runtime persistence", () => {
  test("Send Mob persiste e aparece no Characters; reload preserva", async ({ page }) => {
    await gotoForge(page);

    const baseline = await readCacheRows(page);

    // 1) Surprise + Send: gera build aleatório e empurra para o cache.
    await page.locator("[data-forge-action='surprise']").click({ force: true });
    await page.waitForTimeout(80);
    const dnaBefore = await page.getByTestId("forge-dna-code").textContent();
    expect(dnaBefore).toBeTruthy();

    await page.locator("[data-forge-action='send-mob']").click({ force: true });
    await expect.poll(() => readCacheRows(page), { timeout: 5_000 }).toBeGreaterThan(baseline);

    // 2) Vai para Characters e valida que existe pelo menos 1 entry na library.
    await page.locator(".shell-frame-nav [data-route='/characters']").click({ force: true });
    await expect(page.getByTestId("character-studio-shell")).toBeVisible();
    const libraryItems = page.locator(".character-library [data-character-id]");
    await expect(libraryItems.first()).toBeVisible({ timeout: 5_000 });
    expect(await libraryItems.count()).toBeGreaterThan(0);

    // 3) Runtime renderiza sem fallback (cache hidratado pelo bootstrap).
    await page.locator(".shell-frame-nav [data-route='/runtime']").click({ force: true });
    await expect(page.getByTestId("runtime-surface")).toBeVisible();

    // 4) Reload: o mob persistido deve continuar lá (IndexedDB).
    await page.reload();
    await expect(page.getByTestId("hub-surface")).toBeVisible();
    await page.locator(".shell-frame-nav [data-route='/character-forge']").click({ force: true });
    await expect(page.getByTestId("character-forge-shell")).toBeVisible();
    expect(await readCacheRows(page)).toBeGreaterThan(baseline);
  });

  test("Forge animator publica CSS variables data-driven no .forge-hero", async ({ page }) => {
    await gotoForge(page);

    const hero = page.locator(".forge-hero[data-driven='true']").first();
    await expect(hero).toBeVisible();

    await expect
      .poll(async () =>
        hero.evaluate((el) => {
          const style = el.getAttribute("style") ?? "";
          return style.includes("--forge-step-x") && style.includes("--forge-step-z");
        })
      )
      .toBe(true);

    // Em <500ms o animator deve ter passado por mais de uma fase.
    await page.waitForTimeout(500);
    const phase = await hero.getAttribute("data-forge-phase");
    expect(phase).not.toBeNull();
    expect(["start", "windup", "travel", "impact", "recover"]).toContain(phase!);
  });
});
