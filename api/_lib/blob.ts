// Wrappers leves do Vercel Blob para JSON.
// Toda chamada usa BLOB_READ_WRITE_TOKEN do servidor.

import { put, del } from "@vercel/blob";

const TOKEN_KEY = "BLOB_READ_WRITE_TOKEN";

function token(): string {
  const t = process.env[TOKEN_KEY];
  if (!t) throw new Error(`${TOKEN_KEY} is not set`);
  return t;
}

export interface PutJsonResult {
  key: string;
  url: string;
  size: number;
}

export async function putJson(
  pathname: string,
  payload: unknown,
): Promise<PutJsonResult> {
  const body = JSON.stringify(payload);
  const result = await put(pathname, body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: token(),
  });
  return { key: result.pathname, url: result.url, size: body.length };
}

export async function getJson<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`blob fetch failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function deleteBlob(url: string): Promise<void> {
  await del(url, { token: token() });
}
