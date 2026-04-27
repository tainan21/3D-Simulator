# World Truth

Este projeto existe para provar um universo matematico unico.

## Regra central

Tudo nasce no estado canonico e so depois eh adaptado para render.

- `2D` eh leitura tecnica e editorial.
- `2.5D` eh a leitura principal de jogo.
- `3D` eh auditor volumetrico e prova espacial.
- Nenhum renderer pode corrigir regra, escala, colisao, socket, bounds ou altura.

## Objetos oficiais da v1

- `player`
- `enemy`
- `dwarf`
- `boss`
- `base-core`
- `fence`
- `fence-tl`
- `gate`
- `tower`
- `ramp`
- `platform-link`
- `top-socket-link`

## Escala

- jogador: `1.0m`
- cerca: `1.5m`
- cerca TL: `4.0m`
- inimigo: `2.0m`
- anao: `0.5m`
- boss: `4.0m`

Metros e centimetros sao o idioma humano da edicao. World units continuam sendo a representacao matematica interna.

## Contrato de simulacao

- `WorldState` eh a verdade local da regiao.
- `UniverseState` organiza regioes, seeds, descoberta e progresso.
- topologia, influencia, validacao, replay e AI debug sao derivados.
- `canonicalGeometrySignature` eh a assinatura de equivalencia entre vistas.

## Contrato de combate

- player pode abrir `gate` por proximidade com `E`.
- `base-core`, cercas, gates e torres podem ser destruidos.
- boss prioriza pressao estrutural antes de perseguir o player.
- replay deterministico eh obrigatorio para comparar versoes.

## Corte de v1

- Studio como superficie principal.
- Fases como navegador do mesmo universo.
- Roguelite simples no runtime.
- Altura discreta por layers e conectores.
- Procedural controlado por seed, nunca caos livre.

## Regra de beleza

A aplicacao pode ficar mais bonita a cada rodada, mas a beleza nunca pode inventar uma segunda realidade.
