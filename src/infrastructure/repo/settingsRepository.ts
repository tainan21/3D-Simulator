// settingsRepository — KV tipado de settings da app.
//
// Cada entrada é { id: key, value: T }. Endpoint /api/settings, store IDB
// `settings`. Substitui readJson/writeJson em src/app/state.ts sem mudar
// a API exposta para a UI.

import { createRepository } from "./createRepository";
import { createLocalAdapter } from "../storage/localAdapter";
import { createRemoteAdapter } from "../storage/remoteAdapter";
import { createHybridAdapter } from "../storage/hybridAdapter";
import { getStorageMode } from "../storage/selectAdapter";
import type { Repository, StorageAdapter } from "./types";

export interface SettingsEntry<T = unknown> {
  id: string;
  value: T;
}

interface SettingsApiRow {
  key: string;
  value: unknown;
}

function serializeForApi(item: SettingsEntry): unknown {
  return { key: item.id, value: item.value };
}

function deserializeFromApi(row: unknown): SettingsEntry {
  const r = row as Partial<SettingsApiRow>;
  if (typeof r.key !== "string") throw new Error("[settingsRepository] row sem key");
  return { id: r.key, value: r.value ?? null };
}

function buildAdapter(): StorageAdapter<SettingsEntry> {
  const mode = getStorageMode();
  const local = createLocalAdapter<SettingsEntry>("settings");
  if (mode === "local") return local;
  const remote = createRemoteAdapter<SettingsEntry>({
    endpoint: "/api/settings",
    idParam: "key",
    serialize: serializeForApi,
    deserialize: deserializeFromApi,
  });
  if (mode === "remote") return remote;
  return createHybridAdapter<SettingsEntry>({ local, remote });
}

let instance: Repository<SettingsEntry> | undefined;

export function settingsRepository(): Repository<SettingsEntry> {
  if (!instance) {
    instance = createRepository<SettingsEntry>({
      name: "settings",
      adapter: buildAdapter(),
    });
  }
  return instance;
}

/** Helpers tipados para uso direto. Só leitura — UI não toca storage. */
export function readSetting<T>(key: string): T | undefined {
  const entry = settingsRepository().get(key);
  return entry ? (entry.value as T) : undefined;
}

export function writeSetting<T>(key: string, value: T): void {
  settingsRepository().upsert({ id: key, value });
}
