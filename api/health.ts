// Healthcheck simples: confirma que /api/* está vivo, banco responde,
// e Blob token está configurado. Útil em smoke test e CI.

import { handlePreflight } from "./_lib/cors.ts";
import { sql } from "./_lib/db.ts";
import { json, jsonError } from "./_lib/json.ts";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const pre = handlePreflight(req);
  if (pre) return pre;

  if (req.method !== "GET") {
    return jsonError(req, 405, "method_not_allowed");
  }

  try {
    const rows = (await sql()`SELECT 1 AS ok`) as Array<{ ok: number }>;
    const dbOk = rows[0]?.ok === 1;
    const blobOk = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    return json(req, {
      status: "ok",
      db: dbOk ? "ok" : "fail",
      blob: blobOk ? "ok" : "missing_token",
      now: new Date().toISOString(),
    });
  } catch (err) {
    return jsonError(req, 500, (err as Error).message);
  }
}
