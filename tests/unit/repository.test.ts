import { describe, expect, it, vi } from "vitest";
import { createRepository } from "../../src/infrastructure/repo/createRepository";
import { createFlushScheduler } from "../../src/infrastructure/repo/flushScheduler";
import type { StorageAdapter } from "../../src/infrastructure/repo/types";

// 6.1 — Testes do Repository<T>: contrato de hot path zero-IO + flush diferido.

interface Mob {
  id: string;
  label: string;
  hash: string;
}

function createMemoryAdapter(): StorageAdapter<Mob> & {
  putCalls: number;
  deleteCalls: number;
  data: Map<string, Mob>;
} {
  const data = new Map<string, Mob>();
  return {
    data,
    putCalls: 0,
    deleteCalls: 0,
    async list() {
      return [...data.values()];
    },
    async get(id) {
      return data.get(id);
    },
    async put(item) {
      this.putCalls++;
      data.set(item.id, { ...item });
    },
    async delete(id) {
      this.deleteCalls++;
      data.delete(id);
    }
  };
}

describe("Repository<T>", () => {
  it("snapshot é síncrono e retorna lista hidratada após ready()", async () => {
    const adapter = createMemoryAdapter();
    adapter.data.set("a", { id: "a", label: "Alpha", hash: "h1" });

    const repo = createRepository<Mob>({ name: "mobs", adapter });
    expect(repo.snapshot()).toEqual([]);

    await repo.ready();
    expect(repo.snapshot().map((m) => m.id)).toEqual(["a"]);
  });

  it("upsert é síncrono na leitura e dispara evento, mas não chama adapter no hot path", async () => {
    const adapter = createMemoryAdapter();
    const repo = createRepository<Mob>({ name: "mobs", adapter });
    await repo.ready();

    const events: string[] = [];
    repo.subscribe((event) => events.push(event.kind));

    repo.upsert({ id: "a", label: "Alpha", hash: "h1" });
    expect(repo.get("a")?.label).toBe("Alpha");
    // adapter ainda não foi chamado: flush é diferido.
    expect(adapter.putCalls).toBe(0);
    expect(events).toContain("upserted");

    await repo.flushNow();
    expect(adapter.putCalls).toBe(1);
    expect(adapter.data.get("a")?.label).toBe("Alpha");
  });

  it("upsert idempotente (mesmo conteúdo) não emite nem agenda flush", async () => {
    const adapter = createMemoryAdapter();
    const repo = createRepository<Mob>({ name: "mobs", adapter });
    await repo.ready();
    repo.upsert({ id: "a", label: "Alpha", hash: "h1" });
    await repo.flushNow();

    const events: string[] = [];
    repo.subscribe((event) => events.push(event.kind));
    repo.upsert({ id: "a", label: "Alpha", hash: "h1" });
    await repo.flushNow();

    // hydrated event é entregue ao subscribe, depois nada mais.
    expect(events.filter((e) => e === "upserted")).toHaveLength(0);
    expect(adapter.putCalls).toBe(1);
  });

  it("upserts coalescem: múltiplas mutações = 1 escrita por id no flush", async () => {
    const adapter = createMemoryAdapter();
    const repo = createRepository<Mob>({ name: "mobs", adapter });
    await repo.ready();

    repo.upsert({ id: "a", label: "v1", hash: "h1" });
    repo.upsert({ id: "a", label: "v2", hash: "h2" });
    repo.upsert({ id: "a", label: "v3", hash: "h3" });
    await repo.flushNow();

    expect(adapter.putCalls).toBe(1);
    expect(adapter.data.get("a")?.label).toBe("v3");
  });

  it("remove cancela upsert pendente do mesmo id", async () => {
    const adapter = createMemoryAdapter();
    const repo = createRepository<Mob>({ name: "mobs", adapter });
    await repo.ready();
    repo.upsert({ id: "a", label: "Alpha", hash: "h1" });
    await repo.flushNow();

    repo.upsert({ id: "a", label: "Beta", hash: "h2" });
    repo.remove("a");
    await repo.flushNow();

    expect(adapter.data.has("a")).toBe(false);
    expect(repo.snapshot()).toEqual([]);
  });

  it("hydrate falho não trava UI; snapshot fica vazio e emite hydrated", async () => {
    const failing: StorageAdapter<Mob> = {
      async list() {
        throw new Error("io down");
      },
      async get() {
        return undefined;
      },
      async put() {
        return;
      },
      async delete() {
        return;
      }
    };
    const repo = createRepository<Mob>({ name: "mobs", adapter: failing });
    const events: string[] = [];
    repo.subscribe((event) => events.push(event.kind));

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    await repo.ready();
    warnSpy.mockRestore();

    expect(repo.snapshot()).toEqual([]);
    expect(events).toContain("hydrated");
  });
});

describe("FlushScheduler", () => {
  it("debounce coalesce schedules consecutivos em uma única execução", async () => {
    const scheduler = createFlushScheduler(20);
    let runs = 0;
    scheduler.schedule(() => {
      runs++;
    });
    scheduler.schedule(() => {
      runs++;
    });
    scheduler.schedule(() => {
      runs++;
    });
    await scheduler.flushNow();

    // Última task vence; só ela executa.
    expect(runs).toBe(1);
  });

  it("flushNow executa imediatamente sem esperar debounce", async () => {
    const scheduler = createFlushScheduler(5_000);
    let executed = false;
    scheduler.schedule(() => {
      executed = true;
    });
    expect(executed).toBe(false);
    await scheduler.flushNow();
    expect(executed).toBe(true);
  });

  it("falha de task não derruba scheduler; próximo schedule continua funcionando", async () => {
    const scheduler = createFlushScheduler(5);
    let secondRan = false;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    scheduler.schedule(() => {
      throw new Error("boom");
    });
    await scheduler.flushNow();

    scheduler.schedule(() => {
      secondRan = true;
    });
    await scheduler.flushNow();
    warnSpy.mockRestore();

    expect(secondRan).toBe(true);
  });
});
