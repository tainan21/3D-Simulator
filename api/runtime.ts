// CRUD de runtime_artifacts.
//   GET    /api/runtime          -> lista metadata
//   GET    /api/runtime?id=X     -> metadata + worldJson (do Blob)
//   PUT    /api/runtime          -> upsert {id, source, label, signature, worldJson}
//   DELETE /api/runtime?id=X
//
// O worldJson pode ser grande (mundo serializado); fica no Blob.

import { handlePreflight } from "./_lib/cors.ts";
import { sql } from "./_lib/db.ts";
import { putJson, deleteBlob, getJson } from "./_lib/blob.ts";
import { json, jsonError, readJson } from "./_lib/json.ts";

export const config = { runtime: "edge" };

interface RuntimeRowDB {
  id: string;
  source: string;
  label: string;
  signature: string;
  blob_key: string;
  blob_url: string;
  updated_at: string;
}

interface RuntimeRow {
  id: string;
  source: string;
  label: string;
  signature: string;
  blobKey: string;
  blobUrl: string;
  updatedAt: string;
}

interface UpsertBody {
  id: string;
  source: string;
  label: string;
  signature: string;
  worldJson: unknown;
}

function rowToApi(r: RuntimeRowDB): RuntimeRow {
  return {
    id: r.id,
    source: r.source,
    label: r.label,
    signature: r.signature,
    blobKey: r.blob_key,
    blobUrl: r.blob_url,
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
      if (id) {
        const rows = (await sql()`
          SELECT id, source, label, signature, blob_key, blob_url, updated_at
          FROM runtime_artifacts WHERE id = ${id} LIMIT 1
        `) as RuntimeRowDB[];
        const row = rows[0];
        if (!row) return jsonError(req, 404, "artifact_not_found");
        const worldJson = await getJson<unknown>(row.blob_url);
        return json(req, { item: rowToApi(row), worldJson });
      }
      const rows = (await sql()`
        SELECT id, source, label, signature, blob_key, blob_url, updated_at
        FROM runtime_artifacts ORDER BY updated_at DESC LIMIT 200
      `) as RuntimeRowDB[];
      return json(req, { items: rows.map(rowToApi) });
    }

    if (req.method === "PUT" || req.method === "POST") {
      const body = await readJson<UpsertBody>(req);
      if (!body.id || !body.source || !body.signature) {
        return jsonError(req, 400, "missing_fields");
      }
      const blob = await putJson(`runtime/${body.id}.world.json`, body.worldJson);
      const rows = (await sql()`
        INSERT INTO runtime_artifacts
          (id, source, label, signature, blob_key, blob_url)
        VALUES
          (${body.id}, ${body.source}, ${body.label}, ${body.signature},
           ${blob.key}, ${blob.url})
        ON CONFLICT (id) DO UPDATE SET
          source    = EXCLUDED.source,
          label     = EXCLUDED.label,
          signature = EXCLUDED.signature,
          blob_key  = EXCLUDED.blob_key,
          blob_url  = EXCLUDED.blob_url
        RETURNING id, source, label, signature, blob_key, blob_url, updated_at
      `) as RuntimeRowDB[];
      return json(req, { item: rowToApi(rows[0]) });
    }

    if (req.method === "DELETE") {
      if (!id) return jsonError(req, 400, "id_required");
      const rows = (await sql()`
        DELETE FROM runtime_artifacts WHERE id = ${id} RETURNING blob_url
      `) as Array<{ blob_url: string }>;
      if (rows.length === 0) return jsonError(req, 404, "artifact_not_found");
      try { await deleteBlob(rows[0].blob_url); } catch { /* ignored */ }
      return json(req, { ok: true });
    }

    return jsonError(req, 405, "method_not_allowed");
  } catch (err) {
    return jsonError(req, 500, (err as Error).message);
  }
}
