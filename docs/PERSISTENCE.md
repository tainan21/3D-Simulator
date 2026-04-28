# PERSISTENCE — Contrato de armazenamento

> Documento canônico. Toda dúvida sobre "onde fica o dado X?" deve ser resolvida aqui.
> Se o código discordar deste documento, é o código que está errado.

## 1. Princípios invioláveis

1. **UI nunca toca storage.** Surfaces, controllers e renderers leem só de `Repository.snapshot()` (memória) ou se inscrevem via `Repository.subscribe()`.
2. **Domínio não conhece persistência.** `src/domain/`, `src/kernel/`, `src/simulation/` continuam puros.
3. **Hot path zero I/O.** `renderFrame()` e o `simulation.tick()` jamais executam `JSON.parse`/`JSON.stringify` de payloads grandes nem leituras de storage.
4. **Flush é diferido.** Toda escrita passa pelo `flushScheduler`: debounce 400ms + `requestIdleCallback`.
5. **Migração é one-shot.** O localStorage legado é lido e copiado para os repositórios na primeira vez; depois disso, nunca mais.

## 2. Topologia de camadas

```
UI (controllers, surfaces)
  ↑ snapshot() / subscribe()    ↓ upsert() / remove()
Repository<T>                   src/infrastructure/repo/
  ↑ list()                      ↓ put() / delete()
StorageAdapter<T>               src/infrastructure/storage/
  ├─ LocalAdapter   → IndexedDB (idb)
  ├─ RemoteAdapter  → fetch /api/* (Edge Functions + Neon + Blob)
  └─ HybridAdapter  → local-first; reconcile remoto em background
```

A escolha do adapter é feita por `selectAdapter()` lendo `VITE_STORAGE_MODE`:

- `local` — default. IndexedDB apenas. Offline-first; zero rede.
- `hybrid` — IndexedDB sincroniza com `/api/*` em idle. Recomendado para multi-device futuro.
- `remote` — fetch direto para `/api/*` sem IndexedDB. Útil para servidores headless.

## 3. Mapa de entidades

| Entidade            | Repository               | Tabela Neon         | Blob? | Tamanho típico |
|---------------------|--------------------------|---------------------|-------|----------------|
| CreatedMobRecord    | `mobRepository`          | `created_mobs`      | sim   | 1–4 KB metadata + 30–80 KB payload |
| CharacterArchetype  | `archetypeRepository`    | `archetypes`        | não   | < 4 KB         |
| RuntimeArtifact     | `runtimeArtifactRepository` | `runtime_artifacts` | sim   | 5–200 KB world json |
| ReplayRecord        | `replayRepository`       | `replay_records`    | sim   | 50–800 KB sessão |
| Settings KV         | `settingsRepository`     | `settings`          | não   | < 2 KB por chave |
| UniverseSeed        | `universeSeedRepository` | `universe_seeds`    | não   | < 8 KB         |

**Regra do Blob.** Quando o payload pode crescer linearmente com o tempo de jogo (mundo, replay, mob package completo), separamos:

- **Metadata em Neon** (id, dna_code, label, hash, blob_key, updated_at) — rápido para listar e indexar.
- **Payload em Blob** (`*.rogue-mob.json`, world JSON, session JSON) — barato para armazenar, raramente lido inteiro.

## 4. APIs do Repository

```ts
interface Repository<T extends Identifiable> {
  // Hot path: SEMPRE síncrono. Nunca dispara I/O.
  snapshot(): T[];
  get(id: EntityId): T | undefined;

  // Eventos: hydrated | upserted | removed.
  subscribe(listener: RepoListener<T>): Unsubscribe;

  // Mutações: cache em memória atualizado sync; flush é diferido.
  upsert(item: T): T;
  remove(id: EntityId): void;

  // Ciclo de vida.
  ready(): Promise<void>;     // hidrata do adapter (chamado 1x no bootstrap)
  flushNow(): Promise<void>;  // força flush (usado em export/teste)
}
```

**Idempotência.** `upsert(x)` com payload igual ao já cacheado é no-op silencioso (não emite evento, não agenda flush). A comparação default usa `JSON.stringify`; cada repo concreto pode passar um `equals` mais barato (ex: comparar `hash`).

## 5. Fluxo de uma mutação

```
1. Forge.handleAction("send-mob") → upsertForgeBuildIntoMobCache(build)
2. createdMobCache.ts (fachada) → mobRepository().upsert(record)
3. Map em memória atualizado SYNCRONO
4. Evento "upserted" disparado → Forge.refreshSyncIndicators() (update parcial)
5. flushScheduler agendado (400ms idle)
6. flush dispara: HybridAdapter.put(record)
   ├─ LocalAdapter.put: IndexedDB write (não bloqueia main)
   └─ RemoteAdapter.put: fetch /api/mobs (em segundo plano)
```

A UI **nunca** espera pelo flush. Mesmo se a aba fechar antes, o IndexedDB write é async-mas-rápido (~1ms) e quase sempre completa.

## 6. Migração legacy → repositórios

`src/infrastructure/migration/fromLocalStorage.ts` roda **uma única vez** no bootstrap (idempotente via flag `migration:fromLocalStorageV1` em settings).

Chaves migradas:

| localStorage                    | Repositório                    |
|---------------------------------|--------------------------------|
| `rogue-shell-settings`          | `settingsRepository` (chave a chave) |
| `rogue-shell-characters`        | `archetypeRepository` + `settings:characters:ui` |
| `rogue-shell-runtime-artifact`  | `runtimeArtifactRepository`    |
| `rogue-shell-replays`           | `replayRepository`              |
| `rogue-created-mob-cache-v1`    | `mobRepository`                 |

**Importante.** Os callsites continuam usando as fachadas existentes (`loadCreatedMobCache`, `persistRuntimeArtifact`, `loadCharacters`, …). Nada precisou mudar fora de `src/infrastructure/`.

## 7. Endpoints `/api/*` (modo remote/hybrid)

| Rota                  | Métodos                | Notas                                    |
|-----------------------|------------------------|------------------------------------------|
| `/api/health`         | GET                    | smoke test (Neon ping + Blob list)       |
| `/api/mobs`           | GET, GET?id, PUT, DELETE | metadata em Neon; payload em Blob       |
| `/api/archetypes`     | GET, GET?id, PUT, DELETE | jsonb inline                             |
| `/api/runtime`        | GET, GET?id, PUT, DELETE | metadata + Blob                          |
| `/api/replays`        | GET, GET?id, PUT, DELETE | metadata + Blob                          |
| `/api/settings`       | GET, GET?key, PUT, DELETE | KV jsonb inline                          |

Runtime: **Edge** (`Request → Response`). Em dev, `scripts/vite/apiDevPlugin.ts` serve os mesmos handlers convertendo `node http` ↔ web fetch. Detalhes em `docs/API.md`.

## 8. Falha graciosa

- Hidratação falha → repo libera UI com lista vazia, log de warn.
- Flush falha → log de warn, mutação fica em memória; próximo flush tentará de novo.
- Adapter remoto offline (`hybrid`) → escritas locais continuam; reconcile na próxima janela online.
- `localStorage` indisponível (Safari modo privado) → migração é skipada; repos partem do zero.

## 9. Não fazer

- Não chamar `await mobRepository().something()` em `renderFrame()` ou em handlers de input contínuo.
- Não importar `idb` ou `@neondatabase/serverless` em `src/domain/`, `src/kernel/`, `src/simulation/` ou em controllers de UI.
- Não criar novos `localStorage.setItem` no código de aplicação. Use `settingsRepository`.
- Não desligar o `bootstrap` em `main.ts`. A primeira pintura precisa dos snapshots hidratados.

## 10. Próximas evoluções

- **Universe seeds + deltas** já tem tabela; falta repositório dedicado quando o roguelite progression entrar.
- **Worker para flush** caso `JSON.stringify` de mundos grandes apareça no profiler.
- **CRDT/last-write-wins** quando o `hybrid` virar default em produção e múltiplos devices puderem editar o mesmo mob.
