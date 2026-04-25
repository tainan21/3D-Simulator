# Orientacao Canonica 3D

Este documento fixa o contrato de orientacao usado pelo validador 3D. O renderer 3D nao inventa eixos: ele le a mesma geometria canonica usada por editor, simulacao, 2D e 2.5D.

## Eixos globais

- `x`: direita do mundo
- `y`: altura
- `z`: frente global

Logo:

- `WORLD_RIGHT = (1, 0, 0)`
- `WORLD_UP = (0, 1, 0)`
- `WORLD_FORWARD = (0, 0, 1)`

## Regra geral

Todo objeto com orientacao usa um `OrientationFrame = { origin, axes }`, onde:

- `origin` e o pivot canonico
- `axes.forward` vem da geometria horizontal real
- `axes.right = cross(WORLD_UP, forward)`
- `axes.up = WORLD_UP`

Isso impede roll arbitrario e mantem a altura sempre como `y`.

## Pecas estruturais

### Cerca comum

- geometria: segmento `A -> B`
- pivot: midpoint `A/B` em `y=0`
- forward: direcao `A -> B`
- right: perpendicular horizontal
- up: vertical global

### Cerca TL

- mesmo footprint da cerca comum
- mesmo pivot horizontal
- mesma orientacao planar da cerca base
- socket superior: `midpoint(A,B)` em `y=height`
- top socket herda os mesmos eixos da cerca

### Torre

- nasce no `topSocket` da Cerca TL
- pivot: `tower.anchor`
- forward/right/up: herdados da Cerca TL
- torre nao muda `A`, `B`, thickness, bounds nem collider da TL

### Portao

- pivot: midpoint `A/B`
- forward: direcao `A -> B`
- right: perpendicular horizontal
- up: vertical global
- abrir/fechar altera apenas passagem visual/mecanica, nunca footprint

## Atores

### Personagem, inimigo e boss

- pivot: centro horizontal do circulo/capsula em `y=0`
- forward: `actor.facing`
- right/up: derivados por frame canonico

## O que o 3D valida

- pivot correto
- socket correto
- orientacao local coerente
- altura em `y`
- footprint em `x/z`
- volume nascido da geometria canonica
- mesh sem escala arbitraria
- camera sem alterar dimensao real

## O que o 3D nao pode fazer

- corrigir orientacao com rotacoes escondidas por mesh
- inflar volume para “parecer melhor”
- comprimir collider para facilitar passagem
- improvisar socket superior
- recalcular tamanho por viewport, responsividade ou modo de camera
