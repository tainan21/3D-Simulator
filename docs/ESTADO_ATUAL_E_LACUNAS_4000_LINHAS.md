# Estado Atual e Lacunas contra o Documento de 4000 Linhas

## Estado atual da v3

A POC usa uma unica fonte de verdade em `WorldState`: pecas, torres, atores, base core e estado roguelite derivam do mesmo mundo canonico. 2D, 2.5D e 3D sao adapters sobre essa mesma estrutura.

Implementado hoje:

- Kernel geometrico: segmentos, capsulas, circulos, bounds, nearest point em circle/capsule, roundtrip de grade e projecoes 2D/2.5D/3D.
- Modelos canonicos: cerca comum, Cerca TL, portao, torre, personagem, inimigo, boss e base core.
- Editor: snap por socket endpoint, canto como dois segmentos, torre dependente da TL, delete sem lixo, serialize/deserialize de JSON geometrico puro.
- Debug: toggle geral, camadas para endpoints, sockets, bounds, colliders/capsules e nearest point de inimigo/boss.
- Simulacao: colisao por shapes canonicos, gate blockers por intervalo aberto, boss tentando entrar na base, inimigos/boss usando nearest point, roguelite minimo de ondas + upgrades.
- Renderers: Phaser para 2D/2.5D, Three.js para 3D em primeira pessoa baseada no player, sem GLB, spritesheet, Rapier ou escala por renderer.
- Validacao: snapshots canonicos por adapter e Playwright desktop/mobile para 2D, 2.5D e 3D.
- Menu v3: entrada simples entre `Game em si` e `Universo geometrico puro`.
- 3D v3: chao amplo, grid metrico, neblina de distancia, luz direcional com sombra, materiais padrao Three.js e camera primeira pessoa com mouse/QE.
- Mundo v3: base maior, mapa maior, spawns externos mais distantes e cercas canonicas com 3 m de altura para leitura de escala.
- Editor v3: preview de desenho de segmento com snap antes do segundo clique.
- Demarcacao v3: relatorio automatico linha-a-linha em `docs/DEMARCACAO_CONFORMIDADE_4000_LINHAS.md`.

## Evidencia de testes

Comandos obrigatorios:

- `npm run test`
- `npm run build`
- `npm run e2e`
- `npm run demarcate`

Screenshots esperados:

- `artifacts/screenshots/desktop-chromium-game.png`
- `artifacts/screenshots/mobile-chromium-game.png`
- `artifacts/screenshots/desktop-chromium-2d.png`
- `artifacts/screenshots/desktop-chromium-25d.png`
- `artifacts/screenshots/desktop-chromium-3d.png`
- `artifacts/screenshots/mobile-chromium-2d.png`
- `artifacts/screenshots/mobile-chromium-25d.png`
- `artifacts/screenshots/mobile-chromium-3d.png`

## Quanto falta para 100%

Estimativa tecnica apos v3: aproximadamente 88%.

O nucleo matematico e a prova de fidelidade entre 2D, 2.5D e 3D estao cobertos. A v3 melhora muito a experiencia jogavel em 3D, mas o restante para 100% ainda nao e cosmetico: e robustez de produto, IA de rota, combate completo, fisica opcional e pipeline de assets futuros.

Demarcacao automatica atual:

- OK: 3134 linhas.
- PARCIAL: 252 linhas.
- FORA_V3: 3 linhas.
- INFO/contexto: 611 linhas.

## Linhas ainda parciais ou pendentes

- Debug/endpoints/bounds/nearest: linhas `0046`, `0056`, `0068`, `0096` e equivalentes `+80n` ate `3966`, `3976`, `3988`. V3 cobre visualmente, por testes e por demarcacao; pendencia e polir UX de debug em jogo.
- Inimigos consultando shape: linha `0094` e equivalentes `+80n`. V3 usa nearest point, mas ainda sem pathfinding real em torno de bases complexas.
- Portao/passagem/bloqueio: linhas `0060`, `0077` e equivalentes `+80n`. V3 cobre intervalo aberto, mas ainda nao tem animacao fisica de abertura porque isso seria visual.
- Boss colide e nao atravessa: linhas `0070`, `0089` e equivalentes `+80n`. V3 cobre boss bloqueado e portao aberto, mas ainda nao possui IA completa de contorno.
- Screenshots/mobile/adapters: linhas `0088`, `0098`, `3997`. V3 captura game + 2D/2.5D/3D em desktop/mobile; comparacao visual lado a lado composta ainda pode ser adicionada.
- Contratos presentes no repo: linhas `3993`, `3994`. O documento auxiliar foi copiado; o prompt principal exato segue como placeholder ate o arquivo original ser fornecido.
- Shape unico explicando editor/sim/render: linhas `3995` a `3999`. V3 melhora esse ponto; cobertura total exigiria relatorio gerado a partir dos snapshots para cada shape em cada interacao.

## Fora do escopo da v3

- Rapier.
- glTF/GLB.
- Spritesheets.
- Assets finais.
- Sistema roguelite completo com persistencia meta-run.
- Pathfinding avancado.
- Relatorio automatico linha-a-linha cobrindo todas as 4000 linhas individualmente.
