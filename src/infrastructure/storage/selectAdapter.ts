// Seletor de modo de storage.
//
// Lê VITE_STORAGE_MODE em build/dev:
//  - "remote" → só remoto (Neon/Blob via /api). Ideal em produção/online.
//  - "local"  → só IndexedDB. Ideal offline ou para devs sem credenciais.
//  - "hybrid" → local-first + push remoto (default).
//
// Importante: a UI nunca importa adapters direto. Ela só conhece o Repository.

export type StorageMode = "remote" | "local" | "hybrid";

const FALLBACK: StorageMode = "hybrid";

export function getStorageMode(): StorageMode {
  const env = (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }).env;
  const raw = env?.VITE_STORAGE_MODE;
  if (raw === "remote" || raw === "local" || raw === "hybrid") return raw;
  return FALLBACK;
}
