// LocalAdapter — IndexedDB via `idb`.
//
// Mesmas stores do schema Postgres (created_mobs, archetypes, etc).
// Async, async, async — nunca sincrono. Usado:
//  - como fallback offline quando RemoteAdapter falha;
//  - como cache rápido pelo HybridAdapter;
//  - como destino primário quando VITE_STORAGE_MODE=local.

import { openDB, type IDBPDatabase } from "idb";
import type { Identifiable, StorageAdapter } from "../repo/types";

const DB_NAME = "rogue-3d-simulator";
const DB_VERSION = 1;

export type LocalStoreName =
  | "created_mobs"
  | "archetypes"
  | "runtime_artifacts"
  | "replay_records"
  | "settings"
  | "universe_seeds";

const STORE_NAMES: readonly LocalStoreName[] = [
  "created_mobs",
  "archetypes",
  "runtime_artifacts",
  "replay_records",
  "settings",
  "universe_seeds",
];

let dbPromise: Promise<IDBPDatabase> | undefined;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        for (const name of STORE_NAMES) {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath: "id" });
          }
        }
      },
    });
  }
  return dbPromise;
}

export function createLocalAdapter<T extends Identifiable>(
  storeName: LocalStoreName,
): StorageAdapter<T> {
  return {
    async list(): Promise<T[]> {
      const db = await getDb();
      return (await db.getAll(storeName)) as T[];
    },
    async put(item: T): Promise<T> {
      const db = await getDb();
      await db.put(storeName, item);
      return item;
    },
    async delete(id: string): Promise<void> {
      const db = await getDb();
      await db.delete(storeName, id);
    },
  };
}

/** Acesso direto ao DB para migrações e housekeeping (settings, seeds). */
export async function localStoreClear(name: LocalStoreName): Promise<void> {
  const db = await getDb();
  await db.clear(name);
}
