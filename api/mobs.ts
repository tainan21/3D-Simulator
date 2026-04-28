// CRUD de created_mobs.
//   GET    /api/mobs            -> lista metadata (sem payload do Blob)
//   GET    /api/mobs?id=X       -> metadata + payload (segue blob_url)
//   PUT    /api/mobs            -> upsert {id, dnaCode, label, ..., package}
//   DELETE /api/mobs?id=X       -> remove row + tenta apagar blob
//
// Nada aqui consulta o cliente; é o RemoteAdapter que chama estes endpoints.

import { handlePreflight } from "./_lib/cors.ts";
import { sql } from "./_lib/db.ts";
import { putJson, deleteBlob, getJson } from "./_lib/blob.ts";
import { json, jsonError, readJson } from "./_lib/json.ts";

export const config = { runtime: "edge" };

interface MobRowDB {
  id: string;
  dna_code: string;
  label: string;
  kind: string;
  attack_id: string | null;
  behavior_id: string | null;
  hash: string;
  schema_version: number;
  blob_key: string;
  blob_url: string;
  created_at: string;
  updated_at: string;
}

interface MobRow {
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
  createdAt: string;
  updatedAt: string;
}

interface UpsertBody {
  id: string;
  dnaCode: string;
  label: string;
  kind: string;
  attackId?: string | null;
  behaviorId?: string | null;
  hash: string;
  schemaVersion?: number;
  // payload completo do package (.rogue-mob.json)
  package: unknown;
}

function rowToApi(r: MobRowDB): MobRow {
  return {
    id: r.id,
    dnaCode: r.dna_code,
    label: r.label,
    kind: r.kind,
    attackId: r.attack_id,
    behaviorId: r.behavior_id,
    hash: r.hash,
    schemaVersion: r.schema_version,
    blobKey: r.blob_key,
    blobUrl: r.blob_url,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export default async function handler(req: Request): Promise<Response> {
  const pre = handlePreflight(req);
  if (pre) return pre;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    if (req.method === "GET") {
      if (id) return await handleGetOne(req, id);
      return await handleList(req);
    }
    if (req.method === "PUT" || req.method === "POST") {
      return await handleUpsert(req);
    }
    if (req.method === "DELETE") {
      if (!id) return jsonError(req, 400, "id_required");
      return await handleDelete(req, id);
    }
    return jsonError(req, 405, "method_not_allowed");
  } catch (err) {
    return jsonError(req, 500, (err as Error).message);
  }
}

async function handleList(req: Request): Promise<Response> {
  const rows = (await sql()`
    SELECT id, dna_code, label, kind, attack_id, behavior_id, hash,
           schema_version, blob_key, blob_url, created_at, updated_at
    FROM created_mobs
    ORDER BY updated_at DESC
    LIMIT 500
  `) as MobRowDB[];
  return json(req, { items: rows.map(rowToApi) });
}

async function handleGetOne(req: Request, id: string): Promise<Response> {
  const rows = (await sql()`
    SELECT id, dna_code, label, kind, attack_id, behavior_id, hash,
           schema_version, blob_key, blob_url, created_at, updated_at
    FROM created_mobs
    WHERE id = ${id}
    LIMIT 1
  `) as MobRowDB[];
  const row = rows[0];
  if (!row) return jsonError(req, 404, "mob_not_found");

  // Carrega o package completo do Blob.
  const pkg = await getJson<unknown>(row.blob_url);
  return json(req, { item: rowToApi(row), package: pkg });
}

async function handleUpsert(req: Request): Promise<Response> {
  const body = await readJson<UpsertBody>(req);
  if (!body.id || !body.dnaCode || !body.hash) {
    return jsonError(req, 400, "missing_fields");
  }
  const blobPath = `mobs/${body.id}.rogue-mob.json`;
  const blob = await putJson(blobPath, body.package);

  const rows = (await sql()`
    INSERT INTO created_mobs
      (id, dna_code, label, kind, attack_id, behavior_id,
       hash, schema_version, blob_key, blob_url)
    VALUES
      (${body.id}, ${body.dnaCode}, ${body.label}, ${body.kind},
       ${body.attackId ?? null}, ${body.behaviorId ?? null},
       ${body.hash}, ${body.schemaVersion ?? 1},
       ${blob.key}, ${blob.url})
    ON CONFLICT (id) DO UPDATE SET
      dna_code       = EXCLUDED.dna_code,
      label          = EXCLUDED.label,
      kind           = EXCLUDED.kind,
      attack_id      = EXCLUDED.attack_id,
      behavior_id    = EXCLUDED.behavior_id,
      hash           = EXCLUDED.hash,
      schema_version = EXCLUDED.schema_version,
      blob_key       = EXCLUDED.blob_key,
      blob_url       = EXCLUDED.blob_url
    RETURNING id, dna_code, label, kind, attack_id, behavior_id, hash,
              schema_version, blob_key, blob_url, created_at, updated_at
  `) as MobRowDB[];

  return json(req, { item: rowToApi(rows[0]) });
}

async function handleDelete(req: Request, id: string): Promise<Response> {
  const rows = (await sql()`
    DELETE FROM created_mobs WHERE id = ${id}
    RETURNING blob_url
  `) as Array<{ blob_url: string }>;
  if (rows.length === 0) return jsonError(req, 404, "mob_not_found");
  // Best-effort: limpa blob, mas não falha se Blob estiver instável.
  try {
    await deleteBlob(rows[0].blob_url);
  } catch {
    /* ignored */
  }
  return json(req, { ok: true });
}
