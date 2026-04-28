# API — Endpoints serverless

> Camada Edge Function. Vive em `api/*.ts`. Em produção é deploy Vercel; em dev,
> `scripts/vite/apiDevPlugin.ts` serve os mesmos handlers via plugin Vite.
> Os mesmos arquivos rodam nos dois lugares — sem `vercel dev`.

## 1. Convenções globais

- Runtime: **Edge** (`export const config = { runtime: "edge" }`).
- Signature: `Request → Response | Promise<Response>` (web standard).
- Content-Type: `application/json` em request e response.
- CORS: `OPTIONS` é tratado por `api/_lib/cors.ts`. Mesma origem permite tudo.
- Erros: corpo `{ "error": string }` + status apropriado (`400`, `404`, `500`).

## 2. Variáveis de ambiente

| Variável                  | Onde se usa                           |
|---------------------------|---------------------------------------|
| `DATABASE_URL`            | `api/_lib/db.ts` (Neon serverless)    |
| `BLOB_READ_WRITE_TOKEN`   | `api/_lib/blob.ts` (Vercel Blob)      |
| `VITE_STORAGE_MODE`       | client; `local` (default) / `hybrid` / `remote` |

Todas as três já estão configuradas no projeto Vercel conectado a este chat.

## 3. Endpoints

### 3.1 — `/api/health`

Smoke test usado para validar pipeline em CI. Não requer payload.

```http
GET /api/health
→ 200 { "ok": true, "neon": true, "blob": true, "ts": "2026-04-28T..." }
```

### 3.2 — `/api/mobs`

| Verbo  | Caminho                  | Corpo                                       | Retorno                          |
|--------|--------------------------|---------------------------------------------|----------------------------------|
| GET    | `/api/mobs`              | —                                           | `{ mobs: MobRow[] }` (metadata)  |
| GET    | `/api/mobs?id=<id>`      | —                                           | `{ mob: MobRow & { package } }`  |
| PUT    | `/api/mobs?id=<id>`      | `MobRow & { package: CreatedMobPackage }`   | `{ ok: true }`                   |
| DELETE | `/api/mobs?id=<id>`      | —                                           | `{ ok: true }`                   |

`MobRow` campos: `id, dnaCode, label, kind, attackId, behaviorId, hash, schemaVersion, blobKey, blobUrl, createdAt, updatedAt`. Em `PUT`, o payload (`package`) é gravado no Vercel Blob; o servidor preenche `blobKey`/`blobUrl` na linha do Postgres.

### 3.3 — `/api/archetypes`

`CharacterArchetype` é pequeno; armazenado inline em `archetypes.body_json` (jsonb).

| Verbo  | Caminho                       | Corpo                | Retorno                      |
|--------|-------------------------------|----------------------|------------------------------|
| GET    | `/api/archetypes`             | —                    | `{ archetypes: Archetype[] }`|
| PUT    | `/api/archetypes?id=<id>`     | `CharacterArchetype` | `{ ok: true }`               |
| DELETE | `/api/archetypes?id=<id>`     | —                    | `{ ok: true }`               |

### 3.4 — `/api/runtime`

`RuntimeArtifact` (mundo bakado). Metadata leve em Neon, `worldJson` em Blob.

| Verbo  | Caminho                    | Corpo                                     | Retorno                                |
|--------|----------------------------|-------------------------------------------|----------------------------------------|
| GET    | `/api/runtime`             | —                                         | `{ artifacts: RuntimeArtifactRow[] }`  |
| GET    | `/api/runtime?id=<id>`     | —                                         | `{ artifact: ... & { worldJson } }`    |
| PUT    | `/api/runtime?id=<id>`     | `{ source, label, signature, worldJson }` | `{ ok: true }`                         |
| DELETE | `/api/runtime?id=<id>`     | —                                         | `{ ok: true }`                         |

### 3.5 — `/api/replays`

`ReplayRecord`. Metadata em Neon, `sessionJson` em Blob.

| Verbo  | Caminho                    | Corpo                                    | Retorno                       |
|--------|----------------------------|------------------------------------------|-------------------------------|
| GET    | `/api/replays`             | —                                        | `{ replays: ReplayRow[] }`    |
| GET    | `/api/replays?id=<id>`     | —                                        | `{ replay: ... & { sessionJson } }` |
| PUT    | `/api/replays?id=<id>`     | `{ source, label, sessionJson }`         | `{ ok: true }`                |
| DELETE | `/api/replays?id=<id>`     | —                                        | `{ ok: true }`                |

### 3.6 — `/api/settings`

KV tipado, `value_json` jsonb. Tudo inline; sem Blob.

| Verbo  | Caminho                       | Corpo               | Retorno                          |
|--------|-------------------------------|---------------------|----------------------------------|
| GET    | `/api/settings`               | —                   | `{ settings: { key, valueJson, updatedAt }[] }` |
| GET    | `/api/settings?key=<key>`     | —                   | `{ setting: { key, valueJson, updatedAt } }`    |
| PUT    | `/api/settings?key=<key>`     | `unknown` (jsonb)   | `{ ok: true }`                   |
| DELETE | `/api/settings?key=<key>`     | —                   | `{ ok: true }`                   |

## 4. Schema do banco

`scripts/db/v1_init.sql` é a fonte da verdade. Tabelas (resumo):

- `created_mobs` — id, dna_code (unique), label, kind, attack_id, behavior_id, hash, schema_version, blob_key, blob_url, created_at, updated_at
- `archetypes` — id, label, kind, body_json (jsonb), updated_at
- `runtime_artifacts` — id, source, label, signature, blob_key, blob_url, updated_at
- `replay_records` — id, source, label, blob_key, blob_url, created_at
- `settings` — key, value_json (jsonb), updated_at
- `universe_seeds` — id, seed (bigint), deltas_json (jsonb), updated_at

Trigger `touch_updated_at()` mantém `updated_at` automático em UPDATE.

## 5. Como adicionar uma rota nova

1. Crie `api/<nome>.ts` exportando `default async function handler(req: Request)`.
2. Use `api/_lib/db.ts`, `api/_lib/blob.ts`, `api/_lib/json.ts`, `api/_lib/cors.ts`.
3. Adicione coluna ou tabela em `scripts/db/v<N>_<nome>.sql` e execute via `neon_run_sql_transaction`.
4. Documente aqui (regras de URL/verbos/payload).
5. (Opcional) Crie um repository concreto em `src/infrastructure/repo/` se a entidade precisar entrar no caminho da UI.

## 6. Como reverter o servidor

Se o backend ficar instável, basta setar `VITE_STORAGE_MODE=local` no projeto. A UI passa a ler/escrever só no IndexedDB; nenhum endpoint é chamado. Os dados continuam preservados localmente; quando o servidor voltar, `hybrid` reconcilia em background.

## 7. Limites conhecidos

- Edge runtime: **sem Node.js APIs** (`fs`, `path`, etc.). Use Web APIs puras.
- Tamanho máx de payload por request Edge: 4MB. Mob packages e replays bem dentro do limite.
- Vercel Blob: chaves precisam ser únicas globalmente; usamos `mob/<id>.json`, `runtime/<id>.json`, `replay/<id>.json`.
