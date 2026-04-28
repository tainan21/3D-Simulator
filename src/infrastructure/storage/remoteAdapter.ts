// RemoteAdapter — fala com /api/* (Edge Functions).
//
// Genérico: cada repositório concreto fornece o `endpoint` ('/api/mobs', etc.)
// e a função `serialize` que converte o item interno para o body esperado
// pelo endpoint (ex: para mobs, anexa `package` se existir).

import type { Identifiable, StorageAdapter } from "../repo/types";

export interface RemoteAdapterOptions<T extends Identifiable> {
  endpoint: string;
  /** Chave do parâmetro `?id=` ou `?key=` no endpoint. */
  idParam?: string;
  /** Como o endpoint expõe a lista no GET (campo). Default: "items". */
  listField?: string;
  /** Como o endpoint expõe o item single no GET. Default: "item". */
  itemField?: string;
  /** Mapeia item interno para body do PUT. Default: identidade. */
  serialize?: (item: T) => unknown;
  /** Mapeia row vinda da API para item interno. Default: identidade. */
  deserialize?: (row: unknown) => T;
}

async function jsonFetch<R>(input: RequestInfo, init?: RequestInit): Promise<R> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} @ ${input}`);
  }
  return (await res.json()) as R;
}

export function createRemoteAdapter<T extends Identifiable>(
  opts: RemoteAdapterOptions<T>,
): StorageAdapter<T> {
  const idParam = opts.idParam ?? "id";
  const listField = opts.listField ?? "items";
  const itemField = opts.itemField ?? "item";
  const serialize = opts.serialize ?? ((item: T) => item);
  const deserialize = opts.deserialize ?? ((row: unknown) => row as T);

  return {
    async list(): Promise<T[]> {
      const data = await jsonFetch<Record<string, unknown>>(opts.endpoint);
      const rows = (data[listField] as unknown[] | undefined) ?? [];
      return rows.map(deserialize);
    },
    async put(item: T): Promise<T> {
      const data = await jsonFetch<Record<string, unknown>>(opts.endpoint, {
        method: "PUT",
        body: JSON.stringify(serialize(item)),
      });
      const row = data[itemField];
      return row !== undefined ? deserialize(row) : item;
    },
    async delete(id: string): Promise<void> {
      const url = `${opts.endpoint}?${idParam}=${encodeURIComponent(id)}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok && res.status !== 404) {
        throw new Error(`HTTP ${res.status} ${res.statusText} @ ${url}`);
      }
    },
  };
}
