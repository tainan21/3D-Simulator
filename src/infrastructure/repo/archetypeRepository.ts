// archetypeRepository — biblioteca canônica de CharacterArchetype.
//
// Local: IDB store `archetypes`. Remote: /api/archetypes (jsonb direto, sem blob).

import type { CharacterArchetype } from "../../domain/entityArchetype";
import { createRepository } from "./createRepository";
import { createLocalAdapter } from "../storage/localAdapter";
import { createRemoteAdapter } from "../storage/remoteAdapter";
import { createHybridAdapter } from "../storage/hybridAdapter";
import { getStorageMode } from "../storage/selectAdapter";
import type { Repository, StorageAdapter } from "./types";

interface ArchetypeApiRow {
  id: string;
  label: string;
  kind: string;
  body: CharacterArchetype;
}

function serializeForApi(item: CharacterArchetype): unknown {
  return { id: item.id, label: item.label, kind: item.kind, body: item };
}

function deserializeFromApi(row: unknown): CharacterArchetype {
  const r = row as Partial<ArchetypeApiRow>;
  if (r.body && typeof r.body === "object") return r.body as CharacterArchetype;
  throw new Error("[archetypeRepository] row sem body");
}

function buildAdapter(): StorageAdapter<CharacterArchetype> {
  const mode = getStorageMode();
  const local = createLocalAdapter<CharacterArchetype>("archetypes");
  if (mode === "local") return local;
  const remote = createRemoteAdapter<CharacterArchetype>({
    endpoint: "/api/archetypes",
    serialize: serializeForApi,
    deserialize: deserializeFromApi,
  });
  if (mode === "remote") return remote;
  return createHybridAdapter<CharacterArchetype>({ local, remote });
}

let instance: Repository<CharacterArchetype> | undefined;

export function archetypeRepository(): Repository<CharacterArchetype> {
  if (!instance) {
    instance = createRepository<CharacterArchetype>({
      name: "archetypes",
      adapter: buildAdapter(),
    });
  }
  return instance;
}
