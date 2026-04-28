// Factory genérica de Repository<T>.
//
// Map em memória como fonte de leitura; mutações sincronas;
// flush diferido para o adapter. Eventos via subscribe.

import { createFlushScheduler } from "./flushScheduler";
import type {
  EntityId,
  Identifiable,
  RepoEvent,
  RepoListener,
  Repository,
  StorageAdapter,
  Unsubscribe,
} from "./types";

interface PendingOp<T extends Identifiable> {
  upserts: Map<EntityId, T>;
  deletes: Set<EntityId>;
}

function emptyPending<T extends Identifiable>(): PendingOp<T> {
  return { upserts: new Map(), deletes: new Set() };
}

export interface CreateRepositoryOptions<T extends Identifiable> {
  name: string;
  adapter: StorageAdapter<T>;
  /** Compara se um item é igual a outro para evitar flush ruidoso. */
  equals?: (a: T, b: T) => boolean;
}

export function createRepository<T extends Identifiable>(
  opts: CreateRepositoryOptions<T>,
): Repository<T> {
  const { name, adapter } = opts;
  const equals = opts.equals ?? ((a, b) => JSON.stringify(a) === JSON.stringify(b));

  const items = new Map<EntityId, T>();
  const listeners = new Set<RepoListener<T>>();
  const scheduler = createFlushScheduler();

  let pending: PendingOp<T> = emptyPending<T>();
  let hydrated = false;
  let hydratePromise: Promise<void> | undefined;

  function emit(event: RepoEvent<T>): void {
    for (const listener of listeners) {
      try {
        listener(event);
      } catch (err) {
        console.warn(`[repo:${name}] listener error:`, (err as Error).message);
      }
    }
  }

  async function hydrate(): Promise<void> {
    try {
      const list = await adapter.list();
      items.clear();
      for (const item of list) items.set(item.id, item);
      hydrated = true;
      emit({ kind: "hydrated", items: [...items.values()] });
    } catch (err) {
      hydrated = true; // Mesmo em falha, libera a UI; ela continua vazia.
      console.warn(`[repo:${name}] hydrate failed:`, (err as Error).message);
      emit({ kind: "hydrated", items: [] });
    }
  }

  function schedulePendingFlush(): void {
    scheduler.schedule(async () => {
      const ops = pending;
      pending = emptyPending<T>();
      // Primeiro deletes para evitar conflito com upserts subsequentes.
      for (const id of ops.deletes) {
        try {
          await adapter.delete(id);
        } catch (err) {
          console.warn(`[repo:${name}] delete ${id} failed:`, (err as Error).message);
        }
      }
      for (const item of ops.upserts.values()) {
        try {
          await adapter.put(item);
        } catch (err) {
          console.warn(`[repo:${name}] put ${item.id} failed:`, (err as Error).message);
        }
      }
    });
  }

  return {
    snapshot() {
      return [...items.values()];
    },
    get(id) {
      return items.get(id);
    },
    subscribe(listener) {
      listeners.add(listener);
      if (hydrated) listener({ kind: "hydrated", items: [...items.values()] });
      const unsubscribe: Unsubscribe = () => {
        listeners.delete(listener);
      };
      return unsubscribe;
    },
    upsert(item) {
      const prev = items.get(item.id);
      if (prev && equals(prev, item)) return prev; // No-op silencioso.
      items.set(item.id, item);
      pending.upserts.set(item.id, item);
      pending.deletes.delete(item.id);
      emit({ kind: "upserted", item });
      schedulePendingFlush();
      return item;
    },
    remove(id) {
      if (!items.has(id)) return;
      items.delete(id);
      pending.deletes.add(id);
      pending.upserts.delete(id);
      emit({ kind: "removed", id });
      schedulePendingFlush();
    },
    async ready() {
      if (!hydratePromise) hydratePromise = hydrate();
      await hydratePromise;
    },
    async flushNow() {
      await scheduler.flushNow();
    },
  };
}
