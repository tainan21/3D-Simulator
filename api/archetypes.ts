// CRUD de archetypes.
//   GET    /api/archetypes        -> lista completa (body inline em JSONB)
//   GET    /api/archetypes?id=X   -> 1 archetype
//   PUT    /api/archetypes        -> upsert {id, label, kind, body}
//   DELETE /api/archetypes?id=X
//
// archetypes não tem payload pesado, então fica tudo em Postgres.

import { handlePreflight } from "./_lib/cors.ts";
import { sql } from "./_lib/db.ts";
import { json, jsonError, readJson } from "./_lib/json.ts";

export const config = { runtime: "edge" };

interface ArchetypeRowDB {
  id: string;
  label: string;
  kind: string;
  body_json: unknown;
  updated_at: string;
}

interface ArchetypeRow {
  id: string;
  label: string;
  kind: string;
  body: unknown;
  updatedAt: string;
}

interface UpsertBody {
  id: string;
  label: string;
  kind: string;
  body: unknown;
}

function rowToApi(r: ArchetypeRowDB): ArchetypeRow {
  return {
    id: r.id,
    label: r.label,
    kind: r.kind,
    body: r.body_json,
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
          SELECT id, label, kind, body_json, updated_at
          FROM archetypes WHERE id = ${id} LIMIT 1
        `) as ArchetypeRowDB[];
        if (!rows[0]) return jsonError(req, 404, "archetype_not_found");
        return json(req, { item: rowToApi(rows[0]) });
      }
      const rows = (await sql()`
        SELECT id, label, kind, body_json, updated_at
        FROM archetypes ORDER BY updated_at DESC LIMIT 1000
      `) as ArchetypeRowDB[];
      return json(req, { items: rows.map(rowToApi) });
    }

    if (req.method === "PUT" || req.method === "POST") {
      const body = await readJson<UpsertBody>(req);
      if (!body.id || !body.label || !body.kind) {
        return jsonError(req, 400, "missing_fields");
      }
      const rows = (await sql()`
        INSERT INTO archetypes (id, label, kind, body_json)
        VALUES (${body.id}, ${body.label}, ${body.kind}, ${JSON.stringify(body.body)}::jsonb)
        ON CONFLICT (id) DO UPDATE SET
          label = EXCLUDED.label,
          kind  = EXCLUDED.kind,
          body_json = EXCLUDED.body_json
        RETURNING id, label, kind, body_json, updated_at
      `) as ArchetypeRowDB[];
      return json(req, { item: rowToApi(rows[0]) });
    }

    if (req.method === "DELETE") {
      if (!id) return jsonError(req, 400, "id_required");
      const rows = (await sql()`
        DELETE FROM archetypes WHERE id = ${id} RETURNING id
      `) as Array<{ id: string }>;
      if (rows.length === 0) return jsonError(req, 404, "archetype_not_found");
      return json(req, { ok: true });
    }

    return jsonError(req, 405, "method_not_allowed");
  } catch (err) {
    return jsonError(req, 500, (err as Error).message);
  }
}
