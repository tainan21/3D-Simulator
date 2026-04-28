// CORS minimal para a SPA Vite (dev e preview Vercel).
// Mesmo origin em produção, mas mantemos cabeçalhos permissivos para preview.

const ALLOWED_HEADERS = "content-type, x-rogue-key, if-none-match";
const ALLOWED_METHODS = "GET, PUT, POST, DELETE, OPTIONS";

export function corsHeaders(origin: string | null): HeadersInit {
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-headers": ALLOWED_HEADERS,
    "access-control-allow-methods": ALLOWED_METHODS,
    "access-control-max-age": "600",
    vary: "origin",
  };
}

export function handlePreflight(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export function withCors(req: Request, res: Response): Response {
  const headers = new Headers(res.headers);
  const cors = corsHeaders(req.headers.get("origin"));
  for (const [k, v] of Object.entries(cors)) headers.set(k, String(v));
  return new Response(res.body, { status: res.status, headers });
}
