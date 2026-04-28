// mobRepository — fonte canônica em memória para CreatedMobRecord.
//
// Local: IndexedDB store `created_mobs` (record completo).
// Remote: /api/mobs (metadata em Neon, package em Blob). PUT recebe o pacote
// completo (`package` = CreatedMobPackage); GET lista retorna metadata.
//
// Para a Fase 3 deixamos `local` como modo default (preserva o comportamento
// atual e zera I/O do hot path). Hybrid/remote ficam opt-in via env var.

import { createCreatedMobPackage, createdMobRecordFromPackage, type CreatedMobRecord } from "../../domain/createdMob";
import { createRepository } from "./createRepository";
import { createLocalAdapter } from "../storage/localAdapter";
import { createRemoteAdapter } from "../storage/remoteAdapter";
import { createHybridAdapter } from "../storage/hybridAdapter";
import { getStorageMode } from "../storage/selectAdapter";
import type { Repository, StorageAdapter } from "./types";

interface MobApiRow {
  id: string;
  dnaCode: string;
  label: string;
  kind: string;
  attackId: string | null;
  behaviorId: string | null;
  hash: string;
  schemaVersion: number;
  blobKey: string;
  blobUrl: string;
  package?: unknown;
}

function serializeForApi(record: CreatedMobRecord): unknown {
  // O endpoint /api/mobs PUT espera estes campos + `package` para subir
  // ao Blob. Reconstrói o package determinístico a partir do build/source.
  const mobPackage = createCreatedMobPackage(record.build, "character-forge");
  return {
    id: record.id,
    dnaCode: record.dnaCode,
    label: record.label,
    kind: record.archetype.kind,
    attackId: record.archetype.attackId,
    behaviorId: record.archetype.behaviorId,
    hash: record.blob.checksum,
    schemaVersion: 1,
    package: mobPackage,
  };
}

function deserializeFromApi(row: unknown): CreatedMobRecord {
  // Em listagens, o endpoint só devolve metadata (sem package). Sintetizamos
  // um record stub a partir disso. O hot path nunca chama isso; é só para
  // alinhamento de schema. Repos completos virão do local.
  const r = row as Partial<MobApiRow> & { package?: unknown };
  if (r.package && typeof r.package === "object") {
    // Variação retornada por GET ?id=
    return createdMobRecordFromPackage(r.package as Parameters<typeof createdMobRecordFromPackage>[0]);
  }
  // Fallback metadata-only (não é usado para preview/runtime).
  throw new Error("[mobRepository] remote list retornou metadata; hidratação completa requer local cache.");
}

function buildAdapter(): StorageAdapter<CreatedMobRecord> {
  const mode = getStorageMode();
  const local = createLocalAdapter<CreatedMobRecord>("created_mobs");
  if (mode === "local") return local;

  const remote = createRemoteAdapter<CreatedMobRecord>({
    endpoint: "/api/mobs",
    serialize: serializeForApi,
    deserialize: deserializeFromApi,
  });
  if (mode === "remote") return remote;

  return createHybridAdapter<CreatedMobRecord>({ local, remote });
}

let instance: Repository<CreatedMobRecord> | undefined;

export function mobRepository(): Repository<CreatedMobRecord> {
  if (!instance) {
    instance = createRepository<CreatedMobRecord>({
      name: "mobs",
      adapter: buildAdapter(),
      // Igualdade barata por hash do blob (já é fnv1a). Evita flush ruidoso.
      equals: (a, b) => a.blob.checksum === b.blob.checksum && a.label === b.label,
    });
  }
  return instance;
}
