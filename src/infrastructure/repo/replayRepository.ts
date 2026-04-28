// replayRepository — armazena ReplayRecord com session JSON.
//
// Local: IDB store `replay_records`. Remote: /api/replays (metadata + blob).

import type { ReplayRecord } from "../../app/contracts";
import { createRepository } from "./createRepository";
import { createLocalAdapter } from "../storage/localAdapter";
import { createRemoteAdapter } from "../storage/remoteAdapter";
import { createHybridAdapter } from "../storage/hybridAdapter";
import { getStorageMode } from "../storage/selectAdapter";
import type { Repository, StorageAdapter } from "./types";

interface ReplayApiRow {
  id: string;
  source: string;
  label: string;
  createdAt?: number | string;
  sessionJson?: ReplayRecord["session"];
  // Variantes possíveis dependendo do endpoint (item completo vs row na lista).
  session?: ReplayRecord["session"];
}

function serializeForApi(item: ReplayRecord): unknown {
  return {
    id: item.id,
    source: item.source,
    label: item.label,
    createdAt: item.createdAt,
    // Endpoint /api/replays espera "sessionJson".
    sessionJson: item.session,
  };
}

function deserializeFromApi(row: unknown): ReplayRecord {
  const r = row as Partial<ReplayApiRow>;
  const session = r.sessionJson ?? r.session;
  if (!session) {
    throw new Error("[replayRepository] payload ausente; row provavelmente é metadata-only");
  }
  return {
    id: r.id ?? "",
    source: (r.source as ReplayRecord["source"]) ?? "studio",
    label: r.label ?? "Untitled replay",
    createdAt: typeof r.createdAt === "number" ? r.createdAt : Date.now(),
    session,
  };
}

function buildAdapter(): StorageAdapter<ReplayRecord> {
  const mode = getStorageMode();
  const local = createLocalAdapter<ReplayRecord>("replay_records");
  if (mode === "local") return local;
  const remote = createRemoteAdapter<ReplayRecord>({
    endpoint: "/api/replays",
    serialize: serializeForApi,
    deserialize: deserializeFromApi,
  });
  if (mode === "remote") return remote;
  return createHybridAdapter<ReplayRecord>({ local, remote });
}

let instance: Repository<ReplayRecord> | undefined;

export function replayRepository(): Repository<ReplayRecord> {
  if (!instance) {
    instance = createRepository<ReplayRecord>({
      name: "replays",
      adapter: buildAdapter(),
      equals: (a, b) => a.id === b.id && a.label === b.label,
    });
  }
  return instance;
}
