// CRUD de replay_records.
//   GET    /api/replays          -> lista metadata
//   GET    /api/replays?id=X     -> metadata + sessionJson (do Blob)
//   PUT    /api/replays          -> upsert {id, source, label, sessionJson}
//   DELETE /api/replays?id=X

import { handlePreflight } from "./_lib/cors.ts";
import { sql } from "./_lib/db.ts";
import { putJson, deleteBlob, getJson } from "./_lib/blob.ts";
import { json, jsonError, readJson } from "./_lib/json.ts";

export const config = { runtime: "edge" };

interface ReplayRowDB {
  id: string;
  source: string;
  label: string;
  blob_key: string;
  blob_url: string;
  created_at: string;
}

interface ReplayRow {
  id: string;
  source: string;
  label: string;
  blobKey: string;
  blobUrl: string;
  createdAt: string;
}

interface UpsertBody {
  id: string;
  source: string;
  label: string;
  sessionJson: unknown;
}

function rowToApi(r: ReplayRowDB): ReplayRow {
  return {
    id: r.id,
    source: r.source,
    label: r.label,
    blobKey: r.blob_key,
    blobUrl: r.blob_url,
    createdAt: r.created_at,
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
          SELECT id, source, label, blob_key, blob_url, created_at
          FROM replay_records WHERE id = ${id} LIMIT 1
        `) as ReplayRowDB[];
        const row = rows[0];
        if (!row) return jsonError(req, 404, "replay_not_found");
        const sessionJson = await getJson<unknown>(row.blob_url);
        return json(req, { item: rowToApi(row), sessionJson });
      }
      const rows = (await sql()`
        SELECT id, source, label, blob_key, blob_url, created_at
        FROM replay_records ORDER BY created_at DESC LIMIT 200
      `) as ReplayRowDB[];
      return json(req, { items: rows.map(rowToApi) });
    }

    if (req.method === "PUT" || req.method === "POST") {
      const body = await readJson<UpsertBody>(req);
      if (!body.id || !body.source) {
        return jsonError(req, 400, "missing_fields");
      }
      const blob = await putJson(`replays/${body.id}.session.json`, body.sessionJson);
      const rows = (await sql()`
        INSERT INTO replay_records (id, source, label, blob_key, blob_url)
        VALUES (${body.id}, ${body.source}, ${body.label}, ${blob.key}, ${blob.url})
        ON CONFLICT (id) DO UPDATE SET
          source   = EXCLUDED.source,
          label    = EXCLUDED.label,
          blob_key = EXCLUDED.blob_key,
          blob_url = EXCLUDED.blob_url
        RETURNING id, source, label, blob_key, blob_url, created_at
      `) as ReplayRowDB[];
      return json(req, { item: rowToApi(rows[0]) });
    }

    if (req.method === "DELETE") {
      if (!id) return jsonError(req, 400, "id_required");
      const rows = (await sql()`
        DELETE FROM replay_records WHERE id = ${id} RETURNING blob_url
      `) as Array<{ blob_url: string }>;
      if (rows.length === 0) return jsonError(req, 404, "replay_not_found");
      try { await deleteBlob(rows[0].blob_url); } catch { /* ignored */ }
      return json(req, { ok: true });
    }

    return jsonError(req, 405, "method_not_allowed");
  } catch (err) {
    return jsonError(req, 500, (err as Error).message);
  }
}
