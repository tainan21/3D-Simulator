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

## O que evitar

- Fork de regra por renderer.
- Correcoes visuais locais que escondem erro canonicamente.
- Rebuild completo da cena quando apenas camera ou overlay mudou.
- Persistir snapshots enormes quando seed + deltas bastam.
- Criar novos objetos de v1 sem atualizar `world.md`.

## Definition of done

- build verde
- testes principais verdes
- Studio abre e edita o mundo canonico
- Runtime joga o mesmo mundo
- Fases materializa regioes do mesmo universo
- `canonicalGeometrySignature` coerente entre vistas
