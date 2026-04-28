// KV de settings.
//   GET    /api/settings         -> { items: [{key, value, updatedAt}] }
//   GET    /api/settings?key=X   -> { item }
//   PUT    /api/settings         -> upsert {key, value}
//   DELETE /api/settings?key=X
//
// Tudo inline em JSONB. Settings é pequeno e raramente muda.

import { handlePreflight } from "./_lib/cors.ts";
import { sql } from "./_lib/db.ts";
import { json, jsonError, readJson } from "./_lib/json.ts";

export const config = { runtime: "edge" };

interface SettingRowDB {
  key: string;
  value_json: unknown;
  updated_at: string;
}

interface SettingRow {
  key: string;
  value: unknown;
  updatedAt: string;
}

interface UpsertBody {
  key: string;
  value: unknown;
}

function rowToApi(r: SettingRowDB): SettingRow {
  return { key: r.key, value: r.value_json, updatedAt: r.updated_at };
}

export default async function handler(req: Request): Promise<Response> {
  const pre = handlePreflight(req);
  if (pre) return pre;

  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  try {
    if (req.method === "GET") {
      if (key) {
        const rows = (await sql()`
          SELECT key, value_json, updated_at FROM settings WHERE key = ${key} LIMIT 1
        `) as SettingRowDB[];
        if (!rows[0]) return jsonError(req, 404, "setting_not_found");
        return json(req, { item: rowToApi(rows[0]) });
      }
      const rows = (await sql()`
        SELECT key, value_json, updated_at FROM settings ORDER BY key ASC
      `) as SettingRowDB[];
      return json(req, { items: rows.map(rowToApi) });
    }

    if (req.method === "PUT" || req.method === "POST") {
      const body = await readJson<UpsertBody>(req);
      if (!body.key) return jsonError(req, 400, "key_required");
      const rows = (await sql()`
        INSERT INTO settings (key, value_json)
        VALUES (${body.key}, ${JSON.stringify(body.value)}::jsonb)
        ON CONFLICT (key) DO UPDATE SET value_json = EXCLUDED.value_json
        RETURNING key, value_json, updated_at
      `) as SettingRowDB[];
      return json(req, { item: rowToApi(rows[0]) });
    }

    if (req.method === "DELETE") {
      if (!key) return jsonError(req, 400, "key_required");
      const rows = (await sql()`
        DELETE FROM settings WHERE key = ${key} RETURNING key
      `) as Array<{ key: string }>;
      if (rows.length === 0) return jsonError(req, 404, "setting_not_found");
      return json(req, { ok: true });
    }

    return jsonError(req, 405, "method_not_allowed");
  } catch (err) {
    return jsonError(req, 500, (err as Error).message);
  }
}
