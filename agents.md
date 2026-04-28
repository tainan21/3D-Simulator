# Agents Guide

Este arquivo orienta qualquer agente ou colaborador que toque neste repo.

## Prioridade absoluta

Preservar o algoritmo geometrico unico entre `2D`, `2.5D` e `3D`.

## Como trabalhar

1. Ler `world.md` antes de mexer em simulacao, render ou editor.
2. Tratar Three, Phaser, HUD e overlays como adapters.
3. Nunca mover regra canonicamente para dentro de mesh, material, camera ou efeito visual.
4. Sempre que adicionar comportamento, perguntar: isso altera a assinatura geometrica ou apenas sua leitura?
5. Sempre que tocar UI do Studio, manter o centro focado no mundo e o chrome fora do caminho.
6. UI nunca toca storage. Toda persistencia passa por `src/infrastructure/repo/*` (snapshot sincrono em memoria; flush diferido). Ler `docs/PERSISTENCE.md` e `docs/PERFORMANCE.md` antes de criar repository novo.
7. Nada de `localStorage.getItem/setItem` direto fora de `src/app/state.ts` legacy e da camada `repo/`. Use `settingsRepository`, `mobRepository`, etc.
8. Animacoes do Forge sao data-first: lem `motionProfile.simulationSteps` via `src/runtime/forgeAnimator.ts`. Nao introduzir keyframes hardcoded sem checar se o profile ja cobre.

## Arquivos-chave

- `src/domain/canonical.ts`
  Contrato matematico de pecas, atores, medidas e propriedades.
- `src/simulation/worldState.ts`
  Estado local persistivel de uma regiao.
- `src/domain/universe.ts`
  Orquestracao de campanha, seeds, deltas e materializacao regional.
- `src/simulation/analysis.ts`
  Snapshot derivado de topologia, validacao, influencia, replay e AI debug.
- `src/render/contracts.ts`
  Contrato unico consumido por Phaser e Three.
- `src/render/threeValidationRenderer.ts`
  Validador volumetrico 3D.
- `src/app/controllers/studioController.ts`
  Shell e interacao do Studio.
- `src/infrastructure/repo/createRepository.ts`
  Factory generica de repositorios reativos (cache em memoria + pub/sub + flushScheduler).
- `src/infrastructure/storage/{local,remote,hybrid,select}Adapter.ts`
  Adapters de storage. `local` = IndexedDB; `remote` = `/api/*` Edge; `hybrid` = local-first com sync.
- `src/runtime/forgeAnimator.ts`
  Animator data-first do Character Forge. Le `motionProfile.simulationSteps` e publica CSS variables.
- `api/`
  Vercel Edge Functions. Metadata em Neon, payload em Vercel Blob. Ver `docs/API.md`.

## O que evitar

- Fork de regra por renderer.
- Correcoes visuais locais que escondem erro canonicamente.
- Rebuild completo da cena quando apenas camera ou overlay mudou.
- Persistir snapshots enormes quando seed + deltas bastam.
- Criar novos objetos de v1 sem atualizar `world.md`.
- `JSON.parse`/`JSON.stringify` de mundo, mob ou replay dentro de `renderFrame`/`tick`/handlers de UI continuos. Use cache memoizado ou referencial.
- `loadCreatedMobCache()` no caminho quente. Use `subscribeCreatedMobCache()` ou snapshot cacheado em campo da classe.
- `localStorage` direto. Use os repositorios; migracao automatica do legacy ja roda no boot.
- Re-render de innerHTML completo a cada keystroke. Prefira update parcial mais `idleDebounce` para reflows caros.

## Definition of done

- build verde
- testes principais verdes
- Studio abre e edita o mundo canonico
- Runtime joga o mesmo mundo
- Fases materializa regioes do mesmo universo
- `canonicalGeometrySignature` coerente entre vistas
