// runtimeArtifactRepository — armazena bakes do runtime (mundo serializado).
//
// Local: IDB store `runtime_artifacts` (artifact completo com worldJson).
// Remote: /api/runtime — metadata + worldJson como blob.
//
// Esta camada substitui o uso de localStorage["rogue-shell-runtime-artifact"]
// no src/app/state.ts. A UI não muda; só ganha I/O assíncrono e diferido.

import type { RuntimeBakeArtifact } from "../../runtime/materialize";
import { createRepository } from "./createRepository";
import { createLocalAdapter } from "../storage/localAdapter";
import { createRemoteAdapter } from "../storage/remoteAdapter";
import { createHybridAdapter } from "../storage/hybridAdapter";
import { getStorageMode } from "../storage/selectAdapter";
import type { Repository, StorageAdapter } from "./types";

interface RuntimeApiRow {
  id: string;
  source: string;
  label: string;
  signature: string;
  bakedFromTick?: number;
  sourceScenarioId?: string;
  worldJson?: string;
}

function serializeForApi(item: RuntimeBakeArtifact): unknown {
  return {
    id: item.id,
    source: item.source,
    label: item.label,
    signature: item.canonicalSignature,
    bakedFromTick: item.bakedFromTick,
    sourceScenarioId: item.sourceScenarioId,
    worldJson: item.worldJson,
  };
}

function deserializeFromApi(row: unknown): RuntimeBakeArtifact {
  const r = row as Partial<RuntimeApiRow>;
  if (typeof r.worldJson !== "string") {
    throw new Error("[runtimeArtifactRepository] row sem worldJson");
  }
  return {
    id: r.id ?? "",
    source: (r.source as RuntimeBakeArtifact["source"]) ?? "studio",
    label: r.label ?? "Untitled bake",
    bakedFromTick: r.bakedFromTick ?? 0,
    sourceScenarioId: r.sourceScenarioId,
    canonicalSignature: r.signature ?? "",
    worldJson: r.worldJson,
  };
}

function buildAdapter(): StorageAdapter<RuntimeBakeArtifact> {
  const mode = getStorageMode();
  const local = createLocalAdapter<RuntimeBakeArtifact>("runtime_artifacts");
  if (mode === "local") return local;
  const remote = createRemoteAdapter<RuntimeBakeArtifact>({
    endpoint: "/api/runtime",
    serialize: serializeForApi,
    deserialize: deserializeFromApi,
  });
  if (mode === "remote") return remote;
  return createHybridAdapter<RuntimeBakeArtifact>({ local, remote });
}

let instance: Repository<RuntimeBakeArtifact> | undefined;

export function runtimeArtifactRepository(): Repository<RuntimeBakeArtifact> {
  if (!instance) {
    instance = createRepository<RuntimeBakeArtifact>({
      name: "runtime-artifacts",
      adapter: buildAdapter(),
      // Signature já identifica unicamente o estado bakado.
      equals: (a, b) =>
        a.canonicalSignature === b.canonicalSignature && a.label === b.label,
    });
  }
  return instance;
}

/** Helper compatível com state.ts atual: retorna o último artifact gravado. */
export function readLatestRuntimeArtifact(): RuntimeBakeArtifact | undefined {
  const all = runtimeArtifactRepository().snapshot();
  if (all.length === 0) return undefined;
  // Ordem por id (timestamp embutido). Mais recente primeiro.
  return [...all].sort((a, b) => (a.id < b.id ? 1 : -1))[0];
}
