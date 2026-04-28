// Cobertura da migração one-shot localStorage → Repositories.
//
// Valida:
//  - cada uma das 7 categorias (settings, characters, runtime, replays, mobs,
//    studio-ui, forge) é lida e gravada nos repositórios corretos.
//  - flag `migration:fromLocalStorageV1` é gravada após sucesso.
//  - segunda chamada é no-op (idempotente).
//  - localStorage corrompido em uma chave não invalida as outras.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mocka window.localStorage antes de importar a migration. Como vitest roda
// em Node (config atual), `window` precisa ser instalada manualmente.
class MemStore {
  private map = new Map<string, string>();
  getItem(k: string): string | null {
    return this.map.has(k) ? this.map.get(k)! : null;
  }
  setItem(k: string, v: string): void {
    this.map.set(k, v);
  }
  removeItem(k: string): void {
    this.map.delete(k);
  }
  clear(): void {
    this.map.clear();
  }
}

const localStorage = new MemStore();
// @ts-expect-error: vitest sem jsdom; instalamos minimal stub.
globalThis.window = { localStorage };
// @ts-expect-error
globalThis.localStorage = localStorage;

// Mocka os 5 repositórios para capturar upserts. Cada factory retorna sempre
// o mesmo handle (singleton), que é o que a migration espera.
const upserts: Record<string, unknown[]> = {
  mob: [],
  archetype: [],
  runtimeArtifact: [],
  replay: [],
  settings: [],
};
const settingsStore = new Map<string, unknown>();

vi.mock("../../src/infrastructure/repo/mobRepository", () => ({
  mobRepository: () => ({ upsert: (item: unknown) => upserts.mob.push(item) }),
}));
vi.mock("../../src/infrastructure/repo/archetypeRepository", () => ({
  archetypeRepository: () => ({ upsert: (item: unknown) => upserts.archetype.push(item) }),
}));
vi.mock("../../src/infrastructure/repo/runtimeArtifactRepository", () => ({
  runtimeArtifactRepository: () => ({ upsert: (item: unknown) => upserts.runtimeArtifact.push(item) }),
}));
vi.mock("../../src/infrastructure/repo/replayRepository", () => ({
  replayRepository: () => ({ upsert: (item: unknown) => upserts.replay.push(item) }),
}));
vi.mock("../../src/infrastructure/repo/settingsRepository", () => ({
  settingsRepository: () => ({
    get: (id: string) => (settingsStore.has(id) ? { id, value: settingsStore.get(id) } : undefined),
    upsert: (item: { id: string; value: unknown }) => {
      settingsStore.set(item.id, item.value);
      upserts.settings.push(item);
    },
  }),
}));

import { migrateFromLocalStorageOnce } from "../../src/infrastructure/migration/fromLocalStorage";

beforeEach(() => {
  localStorage.clear();
  settingsStore.clear();
  for (const k of Object.keys(upserts)) upserts[k] = [];
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("migrateFromLocalStorageOnce", () => {
  it("migra todas as 7 categorias quando o legacy está populado", async () => {
    localStorage.setItem(
      "rogue-shell-settings",
      JSON.stringify({ preset: "performance", isMobile: true })
    );
    localStorage.setItem(
      "rogue-shell-characters",
      JSON.stringify({
        archetype: { id: "vanguard", label: "Vanguard", kind: "ally" },
        library: [
          { id: "vanguard", label: "Vanguard", kind: "ally" },
          { id: "scout", label: "Scout", kind: "ally" },
        ],
        selectedId: "vanguard",
        view: "3d",
      })
    );
    localStorage.setItem(
      "rogue-shell-runtime-artifact",
      JSON.stringify({
        id: "bake-1",
        source: "studio",
        label: "Test Bake",
        signature: "sig",
        worldJson: "{}",
        updatedAt: 1,
      })
    );
    localStorage.setItem(
      "rogue-shell-replays",
      JSON.stringify([
        { id: "rep-1", source: "studio", label: "Run A", session: { steps: [] }, createdAt: 2 },
        { id: "rep-2", source: "runtime", label: "Run B", session: { steps: [] }, createdAt: 3 },
      ])
    );
    localStorage.setItem(
      "rogue-created-mob-cache-v1",
      JSON.stringify({
        records: [
          {
            id: "mob-1",
            build: { dnaCode: "AAA" },
            archetype: { id: "mob-1", label: "Beast", kind: "enemy" },
          },
        ],
      })
    );
    localStorage.setItem("rogue-shell-studio-ui", JSON.stringify({ leftPanelWidth: 320 }));
    localStorage.setItem(
      "rogue-character-forge",
      JSON.stringify({ current: { dnaCode: "ZZZ" }, favorites: [] })
    );

    await migrateFromLocalStorageOnce();

    expect(upserts.archetype).toHaveLength(2);
    expect(upserts.runtimeArtifact).toHaveLength(1);
    expect(upserts.replay).toHaveLength(2);
    expect(upserts.mob).toHaveLength(1);
    // settings: preset + isMobile + characters:ui + studio-ui + forge + flag
    const ids = upserts.settings.map((entry) => (entry as { id: string }).id);
    expect(ids).toContain("settings:preset");
    expect(ids).toContain("settings:isMobile");
    expect(ids).toContain("characters:ui");
    expect(ids).toContain("rogue-shell-studio-ui");
    expect(ids).toContain("rogue-character-forge");
    expect(ids).toContain("migration:fromLocalStorageV1");
  });

  it("é idempotente: segunda chamada não re-migra", async () => {
    localStorage.setItem("rogue-shell-settings", JSON.stringify({ preset: "balanced" }));
    await migrateFromLocalStorageOnce();
    const firstCount = upserts.settings.length;
    await migrateFromLocalStorageOnce();
    expect(upserts.settings.length).toBe(firstCount);
  });

  it("ignora chave corrompida sem invalidar as outras", async () => {
    localStorage.setItem("rogue-shell-settings", "{not json");
    localStorage.setItem(
      "rogue-shell-replays",
      JSON.stringify([
        { id: "rep-ok", source: "studio", label: "OK", session: { steps: [] }, createdAt: 1 },
      ])
    );
    await migrateFromLocalStorageOnce();
    // settings corrompido: nenhum upsert preset/isMobile.
    const ids = upserts.settings.map((entry) => (entry as { id: string }).id);
    expect(ids).not.toContain("settings:preset");
    // replays válido continuou migrando.
    expect(upserts.replay).toHaveLength(1);
    // flag final ainda é gravada.
    expect(ids).toContain("migration:fromLocalStorageV1");
  });

  it("é no-op quando localStorage está vazio", async () => {
    await migrateFromLocalStorageOnce();
    // Apenas a flag é gravada.
    expect(upserts.settings).toHaveLength(1);
    expect((upserts.settings[0] as { id: string }).id).toBe("migration:fromLocalStorageV1");
    expect(upserts.archetype).toHaveLength(0);
    expect(upserts.mob).toHaveLength(0);
    expect(upserts.replay).toHaveLength(0);
    expect(upserts.runtimeArtifact).toHaveLength(0);
  });

  it("filtra mobs e replays inválidos", async () => {
    localStorage.setItem(
      "rogue-created-mob-cache-v1",
      JSON.stringify({
        records: [
          { id: "valid", build: { dnaCode: "X" }, archetype: { id: "valid" } },
          { id: "no-build" }, // sem build → ignorado
          { build: { dnaCode: "Y" }, archetype: { id: "z" } }, // sem id → ignorado
        ],
      })
    );
    localStorage.setItem(
      "rogue-shell-replays",
      JSON.stringify([
        { id: "ok", source: "studio", label: "Run", session: { steps: [] }, createdAt: 1 },
        { id: "bad" }, // sem session → ignorado
      ])
    );
    await migrateFromLocalStorageOnce();
    expect(upserts.mob).toHaveLength(1);
    expect(upserts.replay).toHaveLength(1);
  });
});
