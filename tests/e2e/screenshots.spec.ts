import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const screenshotDir = path.join(process.cwd(), "artifacts", "screenshots");

type CanonicalSnapshot = {
  pieces: Array<{
    id: string;
    kind: string;
    a: { x: number; z: number };
    b: { x: number; z: number };
    baseY: number;
    height: number;
    bounds: unknown;
    sockets: unknown;
    colliderRadius: number;
    state?: string;
  }>;
  towers: Array<{ id: string; fenceId: string }>;
  connectors: Array<{ id: string; kind: string }>;
  baseCore: { radius: number; baseY: number };
};

async function expectCanvasHasCanonicalInk(canvas: Locator): Promise<void> {
  let stats:
    | {
        brightPixels: number;
        ratio: number;
        saturatedPixels: number;
        spanX: number;
        spanY: number;
      }
    | undefined;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    stats = await canvas.evaluate((node) => {
      const source = node as HTMLCanvasElement;
      const sample = document.createElement("canvas");
      sample.width = Math.min(240, Math.max(1, source.width));
      sample.height = Math.min(180, Math.max(1, source.height));

      const context = sample.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("2D canvas context unavailable for pixel validation.");
      context.drawImage(source, 0, 0, sample.width, sample.height);

      const { data } = context.getImageData(0, 0, sample.width, sample.height);
      let visiblePixels = 0;
      let brightPixels = 0;
      let saturatedPixels = 0;
      let minX = sample.width;
      let minY = sample.height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < sample.height; y += 1) {
        for (let x = 0; x < sample.width; x += 1) {
          const i = (y * sample.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
          const saturation = Math.max(r, g, b) - Math.min(r, g, b);
          const visible = a > 0 && (luma > 50 || saturation > 28);

          if (visible) {
            visiblePixels += 1;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
          if (luma > 120) brightPixels += 1;
          if (saturation > 45) saturatedPixels += 1;
        }
      }

      return {
        brightPixels,
        ratio: visiblePixels / (sample.width * sample.height),
        saturatedPixels,
        spanX: maxX >= minX ? maxX - minX : 0,
        spanY: maxY >= minY ? maxY - minY : 0
      };
    });

    if (
      stats.ratio > 0.003 &&
      stats.spanX > 24 &&
      stats.spanY > 24 &&
      stats.brightPixels > 10 &&
      stats.saturatedPixels > 10
    ) {
      break;
    }
    await canvas.page().waitForTimeout(180);
  }

  if (!stats) throw new Error("Canvas stats unavailable.");
  expect(stats.ratio, JSON.stringify(stats)).toBeGreaterThan(0.003);
  expect(stats.spanX, JSON.stringify(stats)).toBeGreaterThan(24);
  expect(stats.spanY, JSON.stringify(stats)).toBeGreaterThan(24);
  expect(stats.brightPixels, JSON.stringify(stats)).toBeGreaterThan(10);
  expect(stats.saturatedPixels, JSON.stringify(stats)).toBeGreaterThan(10);
}

async function readCanonical(page: Page): Promise<CanonicalSnapshot> {
  const raw = (await page.getByTestId("canonical-signature").textContent()) ?? "";
  return JSON.parse(raw) as CanonicalSnapshot;
}

function structuralSnapshot(snapshot: CanonicalSnapshot) {
  return {
    pieces: snapshot.pieces,
    towers: snapshot.towers,
    connectors: snapshot.connectors,
    baseCore: snapshot.baseCore
  };
}

async function openStudio(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.getByTestId("hub-surface")).toBeVisible();
  await page.getByRole("button", { name: "Abrir Studio" }).click({ force: true });
  await expect(page.getByTestId("workspace-menu")).toContainText("Studio");
  await expect(page.getByTestId("workspace-menu")).toContainText("Fases");
  await expect(page.getByTestId("workspace-menu")).toContainText("Runtime");
  await expect(page.getByTestId("studio-shell")).toBeVisible();
  await expect(page.getByTestId("studio-harness")).toBeVisible();
  await expect(page.locator("[data-testid='studio-host-2d'] canvas")).toHaveCount(1);
  await expect(page.locator("[data-testid='studio-host-25d'] canvas")).toHaveCount(1);
  await expect(page.locator("[data-testid='studio-host-3d'] canvas")).toHaveCount(1);
  await page.waitForTimeout(350);
}

test.describe("studio geometric harness", () => {
  test.describe.configure({ timeout: 120_000 });

  test("opens Studio by default with synchronized 2D, 2.5D and 3D hosts", async ({ page }, testInfo) => {
    test.slow();
    mkdirSync(screenshotDir, { recursive: true });
    await openStudio(page);

    await expect(page.getByTestId("studio-side")).toContainText("Inspector canonico");
    await expect(page.getByTestId("studio-side")).toContainText("Workbench AI");
    await expect(page.getByTestId("studio-bottom")).toContainText("Timeline + replay");
    await expect(page.getByTestId("studio-bottom")).toContainText("Profiler geometrico");

    const baseline = await readCanonical(page);
    expect(baseline.connectors.length).toBeGreaterThan(0);
    expect(baseline.pieces.some((piece) => piece.kind === "gate")).toBe(true);

    await expectCanvasHasCanonicalInk(page.locator("[data-testid='studio-host-2d'] canvas"));
    await expectCanvasHasCanonicalInk(page.locator("[data-testid='studio-host-25d'] canvas"));
    await expectCanvasHasCanonicalInk(page.locator("[data-testid='studio-host-3d'] canvas"));

    await page.locator("[data-studio-camera='tactical']").evaluate((element) => (element as HTMLButtonElement).click());
    await page.waitForTimeout(120);
    await page.locator("[data-studio-camera='inspection']").evaluate((element) => (element as HTMLButtonElement).click());
    await page.waitForTimeout(120);

    const afterCamera = await readCanonical(page);
    expect(structuralSnapshot(afterCamera)).toEqual(structuralSnapshot(baseline));

    await page.getByTestId("studio-shell").screenshot({
      path: path.join(screenshotDir, `${testInfo.project.name}-studio-harness.png`),
      animations: "disabled"
    });
  });

  test("records, replays and toggles gate flow without mutating canonical geometry", async ({ page }, testInfo) => {
    mkdirSync(screenshotDir, { recursive: true });
    await openStudio(page);

    const before = await readCanonical(page);
    const gateBefore = before.pieces.find((piece) => piece.kind === "gate");
    if (!gateBefore) throw new Error("Expected a gate in the Studio baseline.");

    await page.locator("[data-testid='studio-toolbar'] [data-studio-action='toggle-gate']").click({ force: true });
    await page.waitForTimeout(220);

    const afterGate = await readCanonical(page);
    const gateAfter = afterGate.pieces.find((piece) => piece.id === gateBefore.id);
    if (!gateAfter) throw new Error("Expected toggled gate to remain in canonical signature.");

    expect(gateAfter.state).not.toBe(gateBefore.state);
    expect(gateAfter.a).toEqual(gateBefore.a);
    expect(gateAfter.b).toEqual(gateBefore.b);
    expect(gateAfter.baseY).toBe(gateBefore.baseY);
    expect(gateAfter.height).toBe(gateBefore.height);
    expect(gateAfter.bounds).toEqual(gateBefore.bounds);
    expect(gateAfter.sockets).toEqual(gateBefore.sockets);
    expect(gateAfter.colliderRadius).toBe(gateBefore.colliderRadius);

    await page.locator("[data-testid='studio-toolbar'] [data-studio-action='record']").click({ force: true });
    await expect(page.getByTestId("studio-bottom")).toContainText("recording");
    await page.locator("[data-testid='studio-toolbar'] [data-studio-action='step']").click({ force: true });
    await page.waitForTimeout(180);
    await page.locator("[data-testid='studio-toolbar'] [data-studio-action='replay']").click({ force: true });
    await page.waitForTimeout(240);
    await expect(page.getByTestId("studio-bottom")).toContainText("Divergence");

    await expect(page.getByTestId("studio-side")).toContainText("Enemy generator");

    await page.getByTestId("studio-shell").screenshot({
      path: path.join(screenshotDir, `${testInfo.project.name}-studio-replay-gate.png`),
      animations: "disabled"
    });
  });

  test("bakes Studio into Runtime and keeps combat/debug geometry alive", async ({ page }, testInfo) => {
    mkdirSync(screenshotDir, { recursive: true });
    await openStudio(page);

    const studioBefore = await readCanonical(page);
    await page.locator("[data-testid='studio-toolbar'] [data-studio-action='bake-runtime']").click({ force: true });
    await expect(page.getByTestId("debug-panel")).toContainText("Runtime");
    await expect(page.getByTestId("canvas-host")).toBeVisible();
    await expect(page.locator("[data-testid='canvas-host'] canvas")).toHaveCount(1);
    await page.waitForTimeout(350);

    const runtimeAfter = await readCanonical(page);
    expect(structuralSnapshot(runtimeAfter)).toEqual(structuralSnapshot(studioBefore));
    await expectCanvasHasCanonicalInk(page.locator("[data-testid='canvas-host'] canvas"));

    await page.locator("[data-action='runtime-record']").click({ force: true });
    await page.waitForTimeout(250);
    await page.locator("[data-action='runtime-replay']").click({ force: true });
    await page.waitForTimeout(250);
    await expect(page.getByTestId("debug-panel")).toContainText("Performance");
    await expect(page.getByTestId("debug-panel")).toContainText("Debug");

    await page.screenshot({
      path: path.join(screenshotDir, `${testInfo.project.name}-runtime-vertical-slice.png`),
      animations: "disabled"
    });
  });

  test("navigates Fases scenarios, modes and seeds while keeping canonical output alive", async ({ page }, testInfo) => {
    test.slow();
    mkdirSync(screenshotDir, { recursive: true });
    await openStudio(page);

    await page.locator("[data-testid='workspace-menu'] [data-route='/phases']").click({ force: true });
    await expect(page.getByTestId("canvas-host")).toBeVisible();
    await expect(page.getByTestId("debug-panel")).toContainText("Universo");
    await expect(page.locator("[data-phase-field='region']")).toBeVisible();
    await expect(page.locator("[data-testid='canvas-host'] canvas")).toHaveCount(1);

    const regionOptions = await page.locator("[data-phase-field='region'] option").evaluateAll((options) =>
      options.map((option) => ({ value: (option as HTMLOptionElement).value, text: option.textContent ?? "" }))
    );
    if (regionOptions.length < 2) throw new Error("Expected at least two universe regions.");
    await page.locator("[data-phase-field='region']").selectOption(regionOptions[1].value);
    await page.waitForTimeout(350);
    await expect(page.getByTestId("debug-panel")).toContainText(regionOptions[1].text);
    let canonical = await readCanonical(page);
    expect(canonical.pieces.length).toBeGreaterThan(0);

    await page.locator("[data-mode='2d']").click({ force: true });
    await page.waitForTimeout(150);
    await page.locator("[data-mode='25d']").click({ force: true });
    await page.waitForTimeout(150);
    await page.locator("[data-mode='3d']").click({ force: true });
    await page.waitForTimeout(200);
    await page.locator("[data-camera-mode='first-person']").click({ force: true });
    await page.waitForTimeout(120);
    await page.locator("[data-camera-mode='inspection']").click({ force: true });
    await page.waitForTimeout(120);
    await expectCanvasHasCanonicalInk(page.locator("[data-testid='canvas-host'] canvas"));

    await page.locator("[data-phase-field='region']").selectOption(regionOptions.at(-1)!.value);
    await page.waitForTimeout(350);
    canonical = await readCanonical(page);
    await expect(page.getByTestId("debug-panel")).toContainText(regionOptions.at(-1)!.text);
    await expect(page.getByTestId("debug-panel")).toContainText("Universo");
    expect(canonical.connectors.length).toBeGreaterThan(0);
    expect(canonical.pieces.length).toBeGreaterThan(0);
    expect(canonical.baseCore.radius).toBeGreaterThan(0);

    await page.screenshot({
      path: path.join(screenshotDir, `${testInfo.project.name}-fases-chunks.png`),
      animations: "disabled"
    });
  });
});
