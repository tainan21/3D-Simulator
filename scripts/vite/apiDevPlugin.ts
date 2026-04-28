// Plugin Vite para servir handlers Edge-style em /api/* durante dev.
//
// Em produção, /api/*.ts são Vercel Edge Functions servidas pela Vercel.
// Em dev, este plugin importa os mesmos arquivos via Vite SSR e converte
// node http req/res <-> Web Request/Response, mantendo o mesmo contrato.

import type { Plugin, ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

type EdgeHandler = (req: Request) => Promise<Response> | Response;

interface EdgeModule {
  default: EdgeHandler;
  config?: { runtime?: string };
}

const API_PREFIX = "/api/";

function projectRoot(): string {
  return fileURLToPath(new URL("../../", import.meta.url));
}

function resolveHandlerPath(urlPath: string): string | null {
  // /api/foo        -> api/foo.ts
  // /api/foo/bar    -> api/foo/bar.ts
  // /api/foo?x=1    -> api/foo.ts
  if (!urlPath.startsWith(API_PREFIX)) return null;
  const clean = urlPath.split("?")[0].slice(API_PREFIX.length);
  if (!clean || clean.includes("..")) return null;
  if (clean.startsWith("_")) return null; // /api/_lib/* não é endpoint

  const apiRoot = path.join(projectRoot(), "api");
  const candidates = [
    path.join(apiRoot, `${clean}.ts`),
    path.join(apiRoot, clean, "index.ts"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function nodeReqToWebRequest(
  req: IncomingMessage,
  baseOrigin: string,
): Promise<Request> {
  const url = new URL(req.url ?? "/", baseOrigin);
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === "string") headers.set(k, v);
    else if (Array.isArray(v)) headers.set(k, v.join(", "));
  }
  let body: BodyInit | undefined;
  const method = (req.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    if (chunks.length > 0) {
      body = Buffer.concat(chunks);
    }
  }
  return new Request(url.toString(), { method, headers, body });
}

async function webResponseToNodeRes(
  webRes: Response,
  res: ServerResponse,
): Promise<void> {
  res.statusCode = webRes.status;
  webRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  if (!webRes.body) {
    res.end();
    return;
  }
  const buffer = Buffer.from(await webRes.arrayBuffer());
  res.end(buffer);
}

export function apiDevPlugin(): Plugin {
  return {
    name: "rogue-api-dev",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith(API_PREFIX)) return next();

        const handlerPath = resolveHandlerPath(url);
        if (!handlerPath) {
          res.statusCode = 404;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ error: "api_route_not_found", url }));
          return;
        }

        try {
          const mod = (await server.ssrLoadModule(handlerPath)) as EdgeModule;
          if (typeof mod.default !== "function") {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json");
            res.end(
              JSON.stringify({
                error: "missing_default_handler",
                handlerPath,
              }),
            );
            return;
          }
          const baseOrigin = `http://${req.headers.host ?? "localhost"}`;
          const webReq = await nodeReqToWebRequest(req, baseOrigin);
          const webRes = await mod.default(webReq);
          await webResponseToNodeRes(webRes, res);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("[api-dev] handler error", err);
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.end(
            JSON.stringify({
              error: "handler_threw",
              message: (err as Error).message,
            }),
          );
        }
      });
    },
  };
}
