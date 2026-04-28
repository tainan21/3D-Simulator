// Helpers para respostas JSON consistentes com cabeçalhos de cache controlados.

import { corsHeaders } from "./cors.ts";

export function json(
  req: Request,
  body: unknown,
  init: { status?: number; etag?: string } = {},
): Response {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...corsHeaders(req.headers.get("origin")),
  });
  if (init.etag) headers.set("etag", init.etag);
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers,
  });
}

export function jsonError(
  req: Request,
  status: number,
  message: string,
): Response {
  return json(req, { error: message }, { status });
}

export async function readJson<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Error("invalid_json_body");
  }
}
