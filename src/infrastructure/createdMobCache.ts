// createdMobCache — FACHADA sobre mobRepository.
//
// API mantida 100% compatível com os callsites existentes (characterForge,
// studio, characterStudio, materialize). Internamente passa por mobRepository:
//
//   - leitura (loadCreatedMobCache, createdMobSyncStatus): O(1), Map em
//     memória. Zero JSON.parse, zero localStorage no hot path.
//   - mutação (upsert*, save*, importCreatedMobPayload, exportCreatedMobPayload):
//     atualiza Map sincrono + agenda flush diferido (idle + debounce).
//
// O comportamento legado de "limite de 48 records" é preservado por
// truncamento explícito em normalizeCacheView().

import {
  createCreatedMobPackage,
  createdMobRecordFromPackage,
  parseCreatedMobPackage,
  type CreatedMobPackage,
  type CreatedMobRecord,
} from "../domain/createdMob";
import type { ForgeBuild } from "../domain/characterForge";
import { mobRepository } from "./repo/mobRepository";

const MAX_CACHED = 48;

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

let lastSyncAt: number | undefined;

function normalizeCacheView(records: CreatedMobRecord[]): CreatedMobCache {
  // Ordena por cachedAt desc e trunca para o limite legado.
  const sorted = [...records]
    .sort((a, b) => (b.cachedAt ?? 0) - (a.cachedAt ?? 0))
    .slice(0, MAX_CACHED);
  return {
    version: 1,
    records: sorted,
    lastSyncAt,
    postgresCache: sorted.map((r) => r.postgres),
    blobCache: sorted.map((r) => r.blob),
  };
}

/** Snapshot síncrono do cache. Lê do Map em memória; nunca toca storage. */
export function loadCreatedMobCache(): CreatedMobCache {
  const repo = mobRepository();
  return normalizeCacheView(repo.snapshot() as CreatedMobRecord[]);
}

/**
 * Compatível com a API antiga: substitui o cache inteiro pelo `cache.records`.
 * Em prática o Studio só usa upsert/import; mantemos por segurança.
 */
export function saveCreatedMobCache(cache: CreatedMobCache): CreatedMobCache {
  const repo = mobRepository();
  const incomingIds = new Set(cache.records.map((r) => r.id));
  // Remove os que sumiram.
  for (const existing of repo.snapshot()) {
    if (!incomingIds.has(existing.id)) repo.remove(existing.id);
  }
  // Upsert dos novos.
  for (const record of cache.records) repo.upsert(record);
  lastSyncAt = cache.lastSyncAt ?? Date.now();
  return normalizeCacheView(repo.snapshot() as CreatedMobRecord[]);
}

export function upsertForgeBuildIntoMobCache(build: ForgeBuild): CreatedMobRecord {
  const record = createdMobRecordFromPackage(createCreatedMobPackage(build));
  upsertCreatedMobRecord(record);
  return record;
}

export function upsertCreatedMobRecord(record: CreatedMobRecord): CreatedMobCache {
  const repo = mobRepository();
  // Dedup por dnaCode: se houver outro record com mesmo dnaCode mas id diferente,
  // remove o antigo (preserva semântica do cache legado que usava filter
  // por id E dnaCode).
  for (const existing of repo.snapshot()) {
    if (existing.id !== record.id && existing.dnaCode === record.dnaCode) {
      repo.remove(existing.id);
    }
  }
  repo.upsert(record);
  lastSyncAt = Date.now();
  return normalizeCacheView(repo.snapshot() as CreatedMobRecord[]);
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
    lastSyncLabel: cache.lastSyncAt
      ? new Date(cache.lastSyncAt).toLocaleTimeString()
      : "cold cache",
  };
}

/**
 * Inscreve um listener para reagir a mutações do cache de mobs sem polling.
 * Substitui o padrão atual de chamar loadCreatedMobCache() em todo renderFrame.
 *
 * Uso (controllers):
 *   const off = subscribeCreatedMobCache(() => requestRender());
 *   onDispose(() => off());
 */
export function subscribeCreatedMobCache(listener: () => void): () => void {
  return mobRepository().subscribe(() => listener());
}
