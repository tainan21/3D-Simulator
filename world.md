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
- `surface-tile`
- `actor-visual`
- `character-archetype`
- `attack-pattern`
- `behavior-pattern`
- `character-forge-dna`
- `forge-motion-profile`
- `created-mob-package`

## Camadas editaveis da v1

- `surface-tile` eh textura canonica leve do chao: material, intensidade e layer existem no `WorldState` e devem ser lidos por `2D`, `2.5D` e `3D`.
- `actor-visual` eh perfil visual canonico de personagem/mob: cor, silhueta e acento pertencem ao ator, mas nao alteram raio, altura, HP ou colisao.
- `character-archetype` descreve corpo, visual, faccao, ataque e comportamento antes de virar ator no mundo.
- `attack-pattern` e `behavior-pattern` sao catalogos geometricos: range, forma, cooldown, objetivo e tags devem existir antes de qualquer efeito visual.
- `Actor.combatProfile` carrega ataque e padrao escolhidos para runtime/snapshot; dano e alcance podem ser lidos pela simulacao sem depender de renderer.
- `character-forge-dna` eh a identidade visual/funcional de alto nivel: especie, classe, traits, paleta, skills, stats, tags e compatibilidade futura existem antes de qualquer render 2D, 2.5D ou 3D.
- `forge-motion-profile` eh o contrato funcional de movimento criado no Character Forge: dash, blink, roll, speed, distancia, cooldown, burst e timeline simulada pertencem ao DNA exportavel antes de qualquer animacao, SVG ou renderer.
- `created-mob-package` eh o envelope exportavel/importavel de um mob: carrega Forge DNA, archetype canonico, mock de linha Postgres, mock de objeto Blob e politica de spawn Runtime.
- Chao visual pode sugerir fluxo/custo leve, mas nao pode corrigir pathfinding, collider, socket ou bounds dentro do renderer.

## Separacao de estudios

- Studio da base (`/studio`) constroi o Rogue Geometric Shell: cercas, gates, torres, altura, chao e bake.
- Studio de personagens (`/characters`) constroi entidades, mobs, boss, ataques, padroes e encounters.
- Character Forge (`/character-forge`) cria apego visual e DNA funcional de personagens sem misturar a interface tecnica de personagens ou a base.
- Character Studio possui biblioteca local de archetypes e pode bakear um encounter isolado para Runtime.
- Runtime puxa automaticamente os mobs criados do cache local mockado quando materializa cenarios ou bakes do Studio.
- Ambos precisam provar `2D`, `2.5D` e `3D` lendo a mesma geometria canonica.

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
