# PERFORMANCE — Regras e técnicas

> Documento canônico. Antes de otimizar qualquer surface, leia este arquivo.

## 1. Regra de ouro

**UI nunca toca storage.**
**Hot path nunca aloca payload grande.**

Se essas duas frases não forem verdade num diff, ele não pode mergear.

## 2. O que é "hot path"

- `requestAnimationFrame` em loop de renderização.
- `simulation.tick()` (60Hz fixos via `FIXED_TIMESTEP`).
- `renderFrame()` dos controllers de surface.
- Handlers contínuos: `pointermove`, `mousemove`, `wheel`, `input` em sliders.

Tudo que executa nesses contextos:

- ❌ não pode fazer `JSON.parse` ou `JSON.stringify` de payload > 10KB.
- ❌ não pode tocar `localStorage`, `IndexedDB`, `fetch`.
- ❌ não pode reescrever `innerHTML` de subárvores grandes (use update parcial).
- ✅ pode ler caches em memória (`Repository.snapshot()`, `WeakMap`).
- ✅ pode publicar CSS variables (`element.style.setProperty(...)`).
- ✅ pode emitir evento síncrono que outros componentes consomem.

## 3. Técnicas aplicadas no projeto

### 3.1 — `dirtyFlags` memoizado por referência (`src/render/dirtyFlags.ts`)

`computeRenderDirtyFlags` é chamado por frame. Hashes (`geometryKey`, `simulationKey`, `cameraKey`) são cacheados em `WeakMap<World, string>`. Como o sistema canônico cria nova referência a cada step da simulação, **referência igual ⇒ chave igual** sem custo. Frames sem step novo (camera ou hover mudou) pulam o `JSON.stringify` do mundo.

### 3.2 — Repository com flush diferido (`src/infrastructure/repo/`)

Mutações são síncronas em memória (`Map`), mas o `adapter.put()` só roda em `requestIdleCallback` após 400ms de debounce. Múltiplos `upsert(x)` do mesmo id coalesem em 1 escrita. Detalhes em `docs/PERSISTENCE.md`.

### 3.3 — `rafThrottle` em handlers contínuos (`src/app/utils/rafThrottle.ts`)

`pointermove`/`mousemove`/`wheel` são coalesidos em 1 disparo por animation frame. Em monitores 144Hz isso elimina 2-3 setStates por frame de simulação. Aplicado em `studioController.ts` (drag de câmera 3D, look-around first-person).

### 3.4 — `idleDebounce` em escritas caras (`src/app/utils/idleDebounce.ts`)

Slider `palette-search` (que reescrevia o painel esquerdo inteiro) e sliders `panel-size` (que escreviam no localStorage) usam debounce + idle (180/220ms). Feedback visual imediato; persistência adiada.

### 3.5 — `IntersectionObserver` pausa renderers fora da viewport (`src/app/utils/visibilityPause.ts`)

Os 3 hosts do Studio (2D, 2.5D, 3D) ganham `attachVisibilityPause`. Quando o viewport encolhe e o host sai de tela, o `renderer.pause()` é chamado; ao reentrar, `resume()`. Mesma técnica usada no `forgeAnimator` quando o palco do Forge sai de tela.

### 3.6 — Forge animator data-first (`src/runtime/forgeAnimator.ts`)

Em vez de keyframes CSS rolando 60fps independente da simulação, o animator publica CSS variables (`--forge-step-x|z|t|progress`) lendo `motionProfile.simulationSteps`. RAF próprio do Forge, ativo só com aba visível, alinhado com `FIXED_TIMESTEP` (1/12s por step). Respeita `prefers-reduced-motion`.

### 3.7 — Reatividade via `subscribeCreatedMobCache`

Forge não chama `loadCreatedMobCache()` em `renderFrame()`. Cacheia o status uma vez no mount; o `mobRepository` notifica mudanças (Send Mob, Export DNA, mob criado em outra surface). `refreshSyncIndicators()` faz **update parcial** do rodapé, sem reescrever a UI.

### 3.8 — Preservação de foco entre re-renders (`captureFocus`/`restoreFocus`)

Quando o controller regrava `innerHTML`, foco e seleção de inputs eram perdidos. Agora a chave estável vem dos `data-*` já existentes; após o re-render, restauramos foco + `selectionStart/End` + `scrollTop`.

## 4. SLAs alvo

| Métrica                                  | Alvo            | Hoje (baseline a medir) |
|------------------------------------------|-----------------|--------------------------|
| Boot até `/hub` interativo               | < 500 ms        | a registrar              |
| Troca de surface (`/studio` → `/forge`)  | < 200 ms        | a registrar              |
| FPS Studio com 3 views ativas (desktop)  | ≥ 55            | a registrar              |
| FPS Forge enquanto digita slider         | ≥ 55            | a registrar              |
| Tempo de flush (mob 80KB)                | < 50 ms         | a registrar              |

`/performance` (rota interna) expõe contadores em runtime via `PerformanceRegistry`.

## 5. Como diagnosticar regressões

1. Abrir `/performance`. Verificar canvas count e loops por surface.
2. Habilitar `Performance Insights` do Chrome com a aba alvo.
3. Procurar long tasks > 50ms no main thread. 99% das vezes serão:
   - `JSON.stringify` em hot path (procurar em `dirtyFlags`, fingerprints).
   - `innerHTML = ...` reescrevendo subárvore grande.
   - Loop síncrono em handler de input contínuo.
4. Se a long task vier de storage, é violação direta da regra de ouro — corrigir antes de medir.

## 6. Não fazer

- Não rodar `requestAnimationFrame` paralelo desnecessário em surfaces que não estão visíveis.
- Não destruir e recriar Phaser/Three em troca de view; só esconder/mostrar.
- Não passar `world` por valor (sempre por referência) — quebra os WeakMaps.
- Não inserir `setTimeout(..., 0)` em handlers de input para "diluir trabalho"; use `idleDebounce`.

## 7. Próximas otimizações candidatas

- Pool de meshes Three.js no Studio para `previewWorld` grande (Character Studio).
- Reuso de `Phaser.Game` entre views compatíveis.
- Worker para `JSON.stringify` quando world > 200KB.
- Hash incremental do mundo no `simulation.step()` — substituir o `JSON.stringify` que sobra dentro do `geometryKey` quando não houver cache hit.
