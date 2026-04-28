import { createCreatedMobPackage, createdMobRecordFromPackage, parseCreatedMobPackage, type CreatedMobPackage, type CreatedMobRecord } from "../domain/createdMob";
import type { ForgeBuild } from "../domain/characterForge";

export type CreatedMobCache = Readonly<{
  version: 1;
  records: CreatedMobRecord[];
  lastSyncAt?: number;
  postgresCache: CreatedMobRecord["postgres"][];
  blobCache: CreatedMobRecord["blob"][];
}>;

export type CreatedMobSyncStatus = Readonly<{
  postgresReady: boolean;
  blobReady: boolean;
  cachedRows: number;
  cachedBlobs: number;
  lastSyncLabel: string;
}>;

const STORAGE_KEY = "rogue-created-mob-cache-v1";

export function loadCreatedMobCache(): CreatedMobCache {
  if (!canUseStorage()) return emptyCache();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCache();
    const parsed = JSON.parse(raw) as Partial<CreatedMobCache>;
    const records = Array.isArray(parsed.records) ? parsed.records.map(rehydrateRecord) : [];
    return normalizeCache({
      version: 1,
      records,
      lastSyncAt: parsed.lastSyncAt,
      postgresCache: parsed.postgresCache ?? records.map((record) => record.postgres),
      blobCache: parsed.blobCache ?? records.map((record) => record.blob)
    });
  } catch {
    return emptyCache();
  }
}

export function saveCreatedMobCache(cache: CreatedMobCache): CreatedMobCache {
  const normalized = normalizeCache(cache);
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function upsertForgeBuildIntoMobCache(build: ForgeBuild): CreatedMobRecord {
  const record = createdMobRecordFromPackage(createCreatedMobPackage(build));
  upsertCreatedMobRecord(record);
  return record;
}

export function upsertCreatedMobRecord(record: CreatedMobRecord): CreatedMobCache {
  const cache = loadCreatedMobCache();
  return saveCreatedMobCache({
    version: 1,
    records: [record, ...cache.records.filter((entry) => entry.id !== record.id && entry.dnaCode !== record.dnaCode)].slice(0, 48),
    lastSyncAt: Date.now(),
    postgresCache: [record.postgres, ...cache.postgresCache.filter((entry) => entry.id !== record.postgres.id)].slice(0, 48),
    blobCache: [record.blob, ...cache.blobCache.filter((entry) => entry.key !== record.blob.key)].slice(0, 48)
  });
}

export function importCreatedMobPayload(raw: string): CreatedMobRecord {
  const record = createdMobRecordFromPackage(parseCreatedMobPackage(raw));
  upsertCreatedMobRecord(record);
  return record;
}

export function exportCreatedMobPayload(build: ForgeBuild): string {
  const mobPackage: CreatedMobPackage = createCreatedMobPackage(build);
  const record = createdMobRecordFromPackage(mobPackage);
  upsertCreatedMobRecord(record);
  return record.packageJson;
}

export function createdMobSyncStatus(cache = loadCreatedMobCache()): CreatedMobSyncStatus {
  return {
    postgresReady: true,
    blobReady: true,
    cachedRows: cache.postgresCache.length,
    cachedBlobs: cache.blobCache.length,
    lastSyncLabel: cache.lastSyncAt ? new Date(cache.lastSyncAt).toLocaleTimeString() : "cold cache"
  };
}

function normalizeCache(cache: CreatedMobCache): CreatedMobCache {
  const byId = new Map<string, CreatedMobRecord>();
  for (const record of cache.records) byId.set(record.id, rehydrateRecord(record));
  const records = [...byId.values()];
  return {
    version: 1,
    records,
    lastSyncAt: cache.lastSyncAt,
    postgresCache: records.map((record) => record.postgres),
    blobCache: records.map((record) => record.blob)
  };
}

function emptyCache(): CreatedMobCache {
  return {
    version: 1,
    records: [],
    postgresCache: [],
    blobCache: []
  };
}

function rehydrateRecord(record: CreatedMobRecord): CreatedMobRecord {
  const mobPackage = createCreatedMobPackage(record.build, "import");
  return {
    ...createdMobRecordFromPackage(mobPackage, record.cachedAt),
    cachedAt: record.cachedAt ?? Date.now()
  };
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}
