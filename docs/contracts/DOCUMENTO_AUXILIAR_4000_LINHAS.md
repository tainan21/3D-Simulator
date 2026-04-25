Documento Auxiliar: Prova e Especificacao da POC de Universo Geometrico Puro
Linha 0002: Este documento consolida a intencao de uma POC nova, limpa e matematicamente governada.
Linha 0003: O objetivo e impedir que 2D, 2.5D e 3D reinventem a escala dos mesmos objetos.
Linha 0004: O modo primario e 2.5D, porque ele combina leitura de jogo, profundidade visual e baixo custo de producao.
Linha 0005: 2D existe como vista tecnica e editor/debug.
Linha 0006: 3D existe como validacao volumetrica e opcao futura de experiencia.
Linha 0007: A regra suprema e que a geometria canonica manda no renderer, nunca o contrario.
Linha 0008: Referencias tecnicas: Phaser docs https://docs.phaser.io, Three.js docs https://threejs.org/docs, Rapier docs https://rapier.rs/docs, glTF 2.0 https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html, Red Blob hex grids https://www.redblobgames.com/grids/hexagons-v1/ e Real-Time Collision Detection https://realtimecollisiondetection.net/.
Linha 0009: Phaser e adequado para 2D e 2.5D porque cenas e cameras desenham bem sem carregar as regras do jogo.
Linha 0010: Three.js e adequado para validacao 3D porque Object3D e BufferGeometry permitem representar a mesma geometria em volume.
Linha 0011: Rapier e opcional para fisica, mas a prova matematica deve existir antes de qualquer motor fisico.
Linha 0012: glTF e relevante para assets futuros, mas a POC deve nascer com formas puras.
Linha 0013: A Cerca TL e o caso de teste principal porque combina segmento, altura, socket e torre.
Linha 0014: A Cerca TL nao e uma placa gigante, nem uma textura, nem um tile decorativo.
Linha 0015: A Cerca TL e uma cerca alta com footprint horizontal de palito e socket superior.
Linha 0016: O personagem, inimigos, base e boss devem usar shapes puros e declarados.
Linha 0017: Toda decisao abaixo existe para proteger a POC contra contaminacao renderer-first.
Linha 0018: Nenhuma regra de gameplay deve depender da aparencia final.
Linha 0019: Nenhum tamanho deve ser corrigido visualmente sem atualizar a dimensao canonica.
Linha 0020: Nenhum modo pode ter constantes secretas de escala.
Linha 0021: Axioma 1: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0022: Cerca 1: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0023: Projecao 1: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0024: 2.5D 1: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0025: 3D 1: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0026: Editor 1: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0027: Gameplay 1: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0028: Teste 1: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0029: Falha 1: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0030: Aceite 1: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0031: Axioma 1: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0032: Cerca 1: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0033: Projecao 1: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0034: 2.5D 1: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0035: 3D 1: y representa altura prova volume real e impede escalas independentes.
Linha 0036: Editor 1: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0037: Gameplay 1: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0038: Teste 1: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0039: Falha 1: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0040: Aceite 1: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0041: Axioma 1: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0042: Cerca 1: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0043: Projecao 1: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0044: 2.5D 1: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0045: 3D 1: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0046: Editor 1: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0047: Gameplay 1: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0048: Teste 1: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0049: Falha 1: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0050: Aceite 1: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0051: Axioma 1: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0052: Cerca 1: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0053: Projecao 1: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0054: 2.5D 1: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0055: 3D 1: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0056: Editor 1: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0057: Gameplay 1: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0058: Teste 1: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0059: Falha 1: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0060: Aceite 1: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0061: Axioma 1: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0062: Cerca 1: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0063: Projecao 1: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0064: 2.5D 1: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0065: 3D 1: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0066: Editor 1: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0067: Gameplay 1: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0068: Teste 1: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0069: Falha 1: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0070: Aceite 1: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0071: Axioma 1: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0072: Cerca 1: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0073: Projecao 1: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0074: 2.5D 1: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0075: 3D 1: escala uniforme prova volume real e impede escalas independentes.
Linha 0076: Editor 1: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0077: Gameplay 1: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0078: Teste 1: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0079: Falha 1: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0080: Aceite 1: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0081: Axioma 1: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0082: Cerca 1: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0083: Projecao 1: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0084: 2.5D 1: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0085: 3D 1: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0086: Editor 1: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0087: Gameplay 1: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0088: Teste 1: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0089: Falha 1: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0090: Aceite 1: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0091: Axioma 1: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0092: Cerca 1: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0093: Projecao 1: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0094: 2.5D 1: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0095: 3D 1: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0096: Editor 1: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0097: Gameplay 1: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0098: Teste 1: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0099: Falha 1: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0100: Aceite 1: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0101: Axioma 2: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0102: Cerca 2: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0103: Projecao 2: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0104: 2.5D 2: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0105: 3D 2: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0106: Editor 2: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0107: Gameplay 2: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0108: Teste 2: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0109: Falha 2: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0110: Aceite 2: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0111: Axioma 2: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0112: Cerca 2: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0113: Projecao 2: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0114: 2.5D 2: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0115: 3D 2: y representa altura prova volume real e impede escalas independentes.
Linha 0116: Editor 2: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0117: Gameplay 2: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0118: Teste 2: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0119: Falha 2: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0120: Aceite 2: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0121: Axioma 2: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0122: Cerca 2: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0123: Projecao 2: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0124: 2.5D 2: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0125: 3D 2: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0126: Editor 2: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0127: Gameplay 2: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0128: Teste 2: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0129: Falha 2: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0130: Aceite 2: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0131: Axioma 2: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0132: Cerca 2: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0133: Projecao 2: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0134: 2.5D 2: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0135: 3D 2: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0136: Editor 2: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0137: Gameplay 2: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0138: Teste 2: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0139: Falha 2: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0140: Aceite 2: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0141: Axioma 2: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0142: Cerca 2: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0143: Projecao 2: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0144: 2.5D 2: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0145: 3D 2: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0146: Editor 2: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0147: Gameplay 2: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0148: Teste 2: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0149: Falha 2: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0150: Aceite 2: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0151: Axioma 2: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0152: Cerca 2: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0153: Projecao 2: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0154: 2.5D 2: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0155: 3D 2: escala uniforme prova volume real e impede escalas independentes.
Linha 0156: Editor 2: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0157: Gameplay 2: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0158: Teste 2: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0159: Falha 2: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0160: Aceite 2: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0161: Axioma 2: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0162: Cerca 2: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0163: Projecao 2: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0164: 2.5D 2: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0165: 3D 2: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0166: Editor 2: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0167: Gameplay 2: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0168: Teste 2: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0169: Falha 2: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0170: Aceite 2: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0171: Axioma 2: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0172: Cerca 2: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0173: Projecao 2: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0174: 2.5D 2: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0175: 3D 2: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0176: Editor 2: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0177: Gameplay 2: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0178: Teste 2: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0179: Falha 2: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0180: Aceite 2: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0181: Axioma 3: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0182: Cerca 3: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0183: Projecao 3: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0184: 2.5D 3: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0185: 3D 3: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0186: Editor 3: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0187: Gameplay 3: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0188: Teste 3: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0189: Falha 3: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0190: Aceite 3: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0191: Axioma 3: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0192: Cerca 3: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0193: Projecao 3: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0194: 2.5D 3: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0195: 3D 3: y representa altura prova volume real e impede escalas independentes.
Linha 0196: Editor 3: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0197: Gameplay 3: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0198: Teste 3: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0199: Falha 3: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0200: Aceite 3: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0201: Axioma 3: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0202: Cerca 3: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0203: Projecao 3: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0204: 2.5D 3: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0205: 3D 3: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0206: Editor 3: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0207: Gameplay 3: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0208: Teste 3: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0209: Falha 3: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0210: Aceite 3: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0211: Axioma 3: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0212: Cerca 3: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0213: Projecao 3: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0214: 2.5D 3: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0215: 3D 3: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0216: Editor 3: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0217: Gameplay 3: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0218: Teste 3: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0219: Falha 3: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0220: Aceite 3: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0221: Axioma 3: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0222: Cerca 3: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0223: Projecao 3: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0224: 2.5D 3: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0225: 3D 3: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0226: Editor 3: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0227: Gameplay 3: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0228: Teste 3: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0229: Falha 3: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0230: Aceite 3: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0231: Axioma 3: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0232: Cerca 3: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0233: Projecao 3: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0234: 2.5D 3: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0235: 3D 3: escala uniforme prova volume real e impede escalas independentes.
Linha 0236: Editor 3: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0237: Gameplay 3: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0238: Teste 3: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0239: Falha 3: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0240: Aceite 3: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0241: Axioma 3: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0242: Cerca 3: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0243: Projecao 3: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0244: 2.5D 3: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0245: 3D 3: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0246: Editor 3: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0247: Gameplay 3: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0248: Teste 3: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0249: Falha 3: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0250: Aceite 3: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0251: Axioma 3: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0252: Cerca 3: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0253: Projecao 3: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0254: 2.5D 3: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0255: 3D 3: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0256: Editor 3: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0257: Gameplay 3: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0258: Teste 3: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0259: Falha 3: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0260: Aceite 3: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0261: Axioma 4: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0262: Cerca 4: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0263: Projecao 4: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0264: 2.5D 4: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0265: 3D 4: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0266: Editor 4: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0267: Gameplay 4: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0268: Teste 4: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0269: Falha 4: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0270: Aceite 4: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0271: Axioma 4: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0272: Cerca 4: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0273: Projecao 4: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0274: 2.5D 4: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0275: 3D 4: y representa altura prova volume real e impede escalas independentes.
Linha 0276: Editor 4: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0277: Gameplay 4: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0278: Teste 4: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0279: Falha 4: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0280: Aceite 4: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0281: Axioma 4: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0282: Cerca 4: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0283: Projecao 4: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0284: 2.5D 4: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0285: 3D 4: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0286: Editor 4: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0287: Gameplay 4: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0288: Teste 4: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0289: Falha 4: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0290: Aceite 4: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0291: Axioma 4: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0292: Cerca 4: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0293: Projecao 4: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0294: 2.5D 4: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0295: 3D 4: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0296: Editor 4: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0297: Gameplay 4: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0298: Teste 4: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0299: Falha 4: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0300: Aceite 4: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0301: Axioma 4: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0302: Cerca 4: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0303: Projecao 4: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0304: 2.5D 4: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0305: 3D 4: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0306: Editor 4: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0307: Gameplay 4: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0308: Teste 4: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0309: Falha 4: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0310: Aceite 4: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0311: Axioma 4: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0312: Cerca 4: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0313: Projecao 4: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0314: 2.5D 4: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0315: 3D 4: escala uniforme prova volume real e impede escalas independentes.
Linha 0316: Editor 4: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0317: Gameplay 4: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0318: Teste 4: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0319: Falha 4: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0320: Aceite 4: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0321: Axioma 4: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0322: Cerca 4: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0323: Projecao 4: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0324: 2.5D 4: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0325: 3D 4: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0326: Editor 4: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0327: Gameplay 4: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0328: Teste 4: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0329: Falha 4: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0330: Aceite 4: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0331: Axioma 4: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0332: Cerca 4: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0333: Projecao 4: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0334: 2.5D 4: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0335: 3D 4: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0336: Editor 4: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0337: Gameplay 4: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0338: Teste 4: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0339: Falha 4: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0340: Aceite 4: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0341: Axioma 5: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0342: Cerca 5: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0343: Projecao 5: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0344: 2.5D 5: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0345: 3D 5: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0346: Editor 5: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0347: Gameplay 5: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0348: Teste 5: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0349: Falha 5: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0350: Aceite 5: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0351: Axioma 5: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0352: Cerca 5: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0353: Projecao 5: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0354: 2.5D 5: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0355: 3D 5: y representa altura prova volume real e impede escalas independentes.
Linha 0356: Editor 5: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0357: Gameplay 5: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0358: Teste 5: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0359: Falha 5: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0360: Aceite 5: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0361: Axioma 5: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0362: Cerca 5: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0363: Projecao 5: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0364: 2.5D 5: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0365: 3D 5: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0366: Editor 5: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0367: Gameplay 5: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0368: Teste 5: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0369: Falha 5: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0370: Aceite 5: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0371: Axioma 5: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0372: Cerca 5: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0373: Projecao 5: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0374: 2.5D 5: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0375: 3D 5: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0376: Editor 5: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0377: Gameplay 5: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0378: Teste 5: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0379: Falha 5: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0380: Aceite 5: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0381: Axioma 5: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0382: Cerca 5: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0383: Projecao 5: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0384: 2.5D 5: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0385: 3D 5: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0386: Editor 5: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0387: Gameplay 5: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0388: Teste 5: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0389: Falha 5: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0390: Aceite 5: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0391: Axioma 5: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0392: Cerca 5: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0393: Projecao 5: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0394: 2.5D 5: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0395: 3D 5: escala uniforme prova volume real e impede escalas independentes.
Linha 0396: Editor 5: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0397: Gameplay 5: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0398: Teste 5: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0399: Falha 5: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0400: Aceite 5: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0401: Axioma 5: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0402: Cerca 5: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0403: Projecao 5: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0404: 2.5D 5: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0405: 3D 5: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0406: Editor 5: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0407: Gameplay 5: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0408: Teste 5: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0409: Falha 5: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0410: Aceite 5: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0411: Axioma 5: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0412: Cerca 5: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0413: Projecao 5: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0414: 2.5D 5: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0415: 3D 5: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0416: Editor 5: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0417: Gameplay 5: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0418: Teste 5: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0419: Falha 5: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0420: Aceite 5: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0421: Axioma 6: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0422: Cerca 6: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0423: Projecao 6: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0424: 2.5D 6: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0425: 3D 6: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0426: Editor 6: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0427: Gameplay 6: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0428: Teste 6: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0429: Falha 6: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0430: Aceite 6: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0431: Axioma 6: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0432: Cerca 6: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0433: Projecao 6: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0434: 2.5D 6: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0435: 3D 6: y representa altura prova volume real e impede escalas independentes.
Linha 0436: Editor 6: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0437: Gameplay 6: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0438: Teste 6: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0439: Falha 6: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0440: Aceite 6: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0441: Axioma 6: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0442: Cerca 6: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0443: Projecao 6: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0444: 2.5D 6: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0445: 3D 6: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0446: Editor 6: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0447: Gameplay 6: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0448: Teste 6: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0449: Falha 6: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0450: Aceite 6: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0451: Axioma 6: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0452: Cerca 6: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0453: Projecao 6: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0454: 2.5D 6: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0455: 3D 6: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0456: Editor 6: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0457: Gameplay 6: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0458: Teste 6: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0459: Falha 6: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0460: Aceite 6: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0461: Axioma 6: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0462: Cerca 6: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0463: Projecao 6: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0464: 2.5D 6: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0465: 3D 6: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0466: Editor 6: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0467: Gameplay 6: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0468: Teste 6: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0469: Falha 6: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0470: Aceite 6: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0471: Axioma 6: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0472: Cerca 6: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0473: Projecao 6: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0474: 2.5D 6: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0475: 3D 6: escala uniforme prova volume real e impede escalas independentes.
Linha 0476: Editor 6: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0477: Gameplay 6: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0478: Teste 6: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0479: Falha 6: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0480: Aceite 6: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0481: Axioma 6: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0482: Cerca 6: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0483: Projecao 6: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0484: 2.5D 6: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0485: 3D 6: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0486: Editor 6: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0487: Gameplay 6: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0488: Teste 6: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0489: Falha 6: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0490: Aceite 6: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0491: Axioma 6: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0492: Cerca 6: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0493: Projecao 6: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0494: 2.5D 6: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0495: 3D 6: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0496: Editor 6: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0497: Gameplay 6: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0498: Teste 6: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0499: Falha 6: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0500: Aceite 6: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0501: Axioma 7: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0502: Cerca 7: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0503: Projecao 7: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0504: 2.5D 7: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0505: 3D 7: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0506: Editor 7: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0507: Gameplay 7: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0508: Teste 7: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0509: Falha 7: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0510: Aceite 7: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0511: Axioma 7: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0512: Cerca 7: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0513: Projecao 7: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0514: 2.5D 7: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0515: 3D 7: y representa altura prova volume real e impede escalas independentes.
Linha 0516: Editor 7: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0517: Gameplay 7: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0518: Teste 7: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0519: Falha 7: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0520: Aceite 7: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0521: Axioma 7: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0522: Cerca 7: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0523: Projecao 7: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0524: 2.5D 7: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0525: 3D 7: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0526: Editor 7: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0527: Gameplay 7: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0528: Teste 7: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0529: Falha 7: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0530: Aceite 7: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0531: Axioma 7: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0532: Cerca 7: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0533: Projecao 7: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0534: 2.5D 7: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0535: 3D 7: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0536: Editor 7: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0537: Gameplay 7: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0538: Teste 7: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0539: Falha 7: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0540: Aceite 7: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0541: Axioma 7: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0542: Cerca 7: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0543: Projecao 7: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0544: 2.5D 7: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0545: 3D 7: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0546: Editor 7: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0547: Gameplay 7: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0548: Teste 7: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0549: Falha 7: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0550: Aceite 7: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0551: Axioma 7: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0552: Cerca 7: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0553: Projecao 7: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0554: 2.5D 7: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0555: 3D 7: escala uniforme prova volume real e impede escalas independentes.
Linha 0556: Editor 7: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0557: Gameplay 7: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0558: Teste 7: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0559: Falha 7: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0560: Aceite 7: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0561: Axioma 7: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0562: Cerca 7: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0563: Projecao 7: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0564: 2.5D 7: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0565: 3D 7: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0566: Editor 7: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0567: Gameplay 7: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0568: Teste 7: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0569: Falha 7: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0570: Aceite 7: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0571: Axioma 7: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0572: Cerca 7: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0573: Projecao 7: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0574: 2.5D 7: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0575: 3D 7: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0576: Editor 7: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0577: Gameplay 7: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0578: Teste 7: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0579: Falha 7: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0580: Aceite 7: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0581: Axioma 8: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0582: Cerca 8: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0583: Projecao 8: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0584: 2.5D 8: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0585: 3D 8: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0586: Editor 8: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0587: Gameplay 8: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0588: Teste 8: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0589: Falha 8: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0590: Aceite 8: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0591: Axioma 8: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0592: Cerca 8: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0593: Projecao 8: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0594: 2.5D 8: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0595: 3D 8: y representa altura prova volume real e impede escalas independentes.
Linha 0596: Editor 8: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0597: Gameplay 8: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0598: Teste 8: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0599: Falha 8: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0600: Aceite 8: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0601: Axioma 8: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0602: Cerca 8: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0603: Projecao 8: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0604: 2.5D 8: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0605: 3D 8: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0606: Editor 8: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0607: Gameplay 8: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0608: Teste 8: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0609: Falha 8: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0610: Aceite 8: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0611: Axioma 8: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0612: Cerca 8: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0613: Projecao 8: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0614: 2.5D 8: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0615: 3D 8: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0616: Editor 8: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0617: Gameplay 8: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0618: Teste 8: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0619: Falha 8: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0620: Aceite 8: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0621: Axioma 8: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0622: Cerca 8: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0623: Projecao 8: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0624: 2.5D 8: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0625: 3D 8: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0626: Editor 8: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0627: Gameplay 8: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0628: Teste 8: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0629: Falha 8: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0630: Aceite 8: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0631: Axioma 8: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0632: Cerca 8: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0633: Projecao 8: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0634: 2.5D 8: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0635: 3D 8: escala uniforme prova volume real e impede escalas independentes.
Linha 0636: Editor 8: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0637: Gameplay 8: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0638: Teste 8: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0639: Falha 8: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0640: Aceite 8: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0641: Axioma 8: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0642: Cerca 8: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0643: Projecao 8: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0644: 2.5D 8: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0645: 3D 8: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0646: Editor 8: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0647: Gameplay 8: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0648: Teste 8: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0649: Falha 8: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0650: Aceite 8: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0651: Axioma 8: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0652: Cerca 8: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0653: Projecao 8: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0654: 2.5D 8: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0655: 3D 8: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0656: Editor 8: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0657: Gameplay 8: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0658: Teste 8: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0659: Falha 8: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0660: Aceite 8: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0661: Axioma 9: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0662: Cerca 9: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0663: Projecao 9: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0664: 2.5D 9: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0665: 3D 9: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0666: Editor 9: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0667: Gameplay 9: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0668: Teste 9: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0669: Falha 9: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0670: Aceite 9: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0671: Axioma 9: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0672: Cerca 9: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0673: Projecao 9: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0674: 2.5D 9: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0675: 3D 9: y representa altura prova volume real e impede escalas independentes.
Linha 0676: Editor 9: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0677: Gameplay 9: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0678: Teste 9: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0679: Falha 9: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0680: Aceite 9: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0681: Axioma 9: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0682: Cerca 9: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0683: Projecao 9: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0684: 2.5D 9: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0685: 3D 9: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0686: Editor 9: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0687: Gameplay 9: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0688: Teste 9: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0689: Falha 9: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0690: Aceite 9: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0691: Axioma 9: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0692: Cerca 9: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0693: Projecao 9: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0694: 2.5D 9: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0695: 3D 9: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0696: Editor 9: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0697: Gameplay 9: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0698: Teste 9: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0699: Falha 9: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0700: Aceite 9: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0701: Axioma 9: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0702: Cerca 9: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0703: Projecao 9: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0704: 2.5D 9: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0705: 3D 9: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0706: Editor 9: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0707: Gameplay 9: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0708: Teste 9: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0709: Falha 9: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0710: Aceite 9: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0711: Axioma 9: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0712: Cerca 9: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0713: Projecao 9: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0714: 2.5D 9: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0715: 3D 9: escala uniforme prova volume real e impede escalas independentes.
Linha 0716: Editor 9: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0717: Gameplay 9: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0718: Teste 9: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0719: Falha 9: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0720: Aceite 9: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0721: Axioma 9: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0722: Cerca 9: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0723: Projecao 9: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0724: 2.5D 9: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0725: 3D 9: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0726: Editor 9: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0727: Gameplay 9: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0728: Teste 9: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0729: Falha 9: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0730: Aceite 9: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0731: Axioma 9: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0732: Cerca 9: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0733: Projecao 9: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0734: 2.5D 9: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0735: 3D 9: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0736: Editor 9: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0737: Gameplay 9: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0738: Teste 9: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0739: Falha 9: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0740: Aceite 9: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0741: Axioma 10: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0742: Cerca 10: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0743: Projecao 10: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0744: 2.5D 10: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0745: 3D 10: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0746: Editor 10: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0747: Gameplay 10: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0748: Teste 10: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0749: Falha 10: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0750: Aceite 10: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0751: Axioma 10: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0752: Cerca 10: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0753: Projecao 10: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0754: 2.5D 10: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0755: 3D 10: y representa altura prova volume real e impede escalas independentes.
Linha 0756: Editor 10: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0757: Gameplay 10: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0758: Teste 10: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0759: Falha 10: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0760: Aceite 10: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0761: Axioma 10: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0762: Cerca 10: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0763: Projecao 10: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0764: 2.5D 10: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0765: 3D 10: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0766: Editor 10: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0767: Gameplay 10: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0768: Teste 10: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0769: Falha 10: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0770: Aceite 10: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0771: Axioma 10: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0772: Cerca 10: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0773: Projecao 10: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0774: 2.5D 10: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0775: 3D 10: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0776: Editor 10: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0777: Gameplay 10: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0778: Teste 10: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0779: Falha 10: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0780: Aceite 10: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0781: Axioma 10: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0782: Cerca 10: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0783: Projecao 10: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0784: 2.5D 10: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0785: 3D 10: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0786: Editor 10: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0787: Gameplay 10: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0788: Teste 10: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0789: Falha 10: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0790: Aceite 10: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0791: Axioma 10: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0792: Cerca 10: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0793: Projecao 10: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0794: 2.5D 10: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0795: 3D 10: escala uniforme prova volume real e impede escalas independentes.
Linha 0796: Editor 10: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0797: Gameplay 10: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0798: Teste 10: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0799: Falha 10: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0800: Aceite 10: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0801: Axioma 10: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0802: Cerca 10: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0803: Projecao 10: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0804: 2.5D 10: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0805: 3D 10: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0806: Editor 10: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0807: Gameplay 10: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0808: Teste 10: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0809: Falha 10: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0810: Aceite 10: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0811: Axioma 10: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0812: Cerca 10: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0813: Projecao 10: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0814: 2.5D 10: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0815: 3D 10: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0816: Editor 10: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0817: Gameplay 10: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0818: Teste 10: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0819: Falha 10: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0820: Aceite 10: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0821: Axioma 11: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0822: Cerca 11: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0823: Projecao 11: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0824: 2.5D 11: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0825: 3D 11: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0826: Editor 11: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0827: Gameplay 11: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0828: Teste 11: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0829: Falha 11: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0830: Aceite 11: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0831: Axioma 11: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0832: Cerca 11: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0833: Projecao 11: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0834: 2.5D 11: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0835: 3D 11: y representa altura prova volume real e impede escalas independentes.
Linha 0836: Editor 11: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0837: Gameplay 11: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0838: Teste 11: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0839: Falha 11: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0840: Aceite 11: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0841: Axioma 11: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0842: Cerca 11: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0843: Projecao 11: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0844: 2.5D 11: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0845: 3D 11: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0846: Editor 11: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0847: Gameplay 11: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0848: Teste 11: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0849: Falha 11: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0850: Aceite 11: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0851: Axioma 11: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0852: Cerca 11: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0853: Projecao 11: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0854: 2.5D 11: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0855: 3D 11: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0856: Editor 11: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0857: Gameplay 11: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0858: Teste 11: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0859: Falha 11: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0860: Aceite 11: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0861: Axioma 11: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0862: Cerca 11: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0863: Projecao 11: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0864: 2.5D 11: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0865: 3D 11: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0866: Editor 11: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0867: Gameplay 11: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0868: Teste 11: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0869: Falha 11: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0870: Aceite 11: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0871: Axioma 11: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0872: Cerca 11: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0873: Projecao 11: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0874: 2.5D 11: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0875: 3D 11: escala uniforme prova volume real e impede escalas independentes.
Linha 0876: Editor 11: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0877: Gameplay 11: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0878: Teste 11: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0879: Falha 11: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0880: Aceite 11: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0881: Axioma 11: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0882: Cerca 11: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0883: Projecao 11: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0884: 2.5D 11: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0885: 3D 11: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0886: Editor 11: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0887: Gameplay 11: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0888: Teste 11: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0889: Falha 11: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0890: Aceite 11: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0891: Axioma 11: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0892: Cerca 11: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0893: Projecao 11: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0894: 2.5D 11: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0895: 3D 11: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0896: Editor 11: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0897: Gameplay 11: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0898: Teste 11: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0899: Falha 11: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0900: Aceite 11: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0901: Axioma 12: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0902: Cerca 12: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0903: Projecao 12: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0904: 2.5D 12: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0905: 3D 12: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0906: Editor 12: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0907: Gameplay 12: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0908: Teste 12: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0909: Falha 12: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0910: Aceite 12: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0911: Axioma 12: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0912: Cerca 12: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0913: Projecao 12: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0914: 2.5D 12: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0915: 3D 12: y representa altura prova volume real e impede escalas independentes.
Linha 0916: Editor 12: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0917: Gameplay 12: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0918: Teste 12: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0919: Falha 12: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0920: Aceite 12: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 0921: Axioma 12: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 0922: Cerca 12: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0923: Projecao 12: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0924: 2.5D 12: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0925: 3D 12: volume deriva do shape prova volume real e impede escalas independentes.
Linha 0926: Editor 12: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 0927: Gameplay 12: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0928: Teste 12: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0929: Falha 12: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 0930: Aceite 12: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 0931: Axioma 12: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 0932: Cerca 12: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0933: Projecao 12: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0934: 2.5D 12: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0935: 3D 12: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 0936: Editor 12: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 0937: Gameplay 12: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0938: Teste 12: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0939: Falha 12: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 0940: Aceite 12: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 0941: Axioma 12: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 0942: Cerca 12: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0943: Projecao 12: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0944: 2.5D 12: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0945: 3D 12: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 0946: Editor 12: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 0947: Gameplay 12: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0948: Teste 12: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0949: Falha 12: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 0950: Aceite 12: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 0951: Axioma 12: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 0952: Cerca 12: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0953: Projecao 12: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0954: 2.5D 12: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0955: 3D 12: escala uniforme prova volume real e impede escalas independentes.
Linha 0956: Editor 12: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 0957: Gameplay 12: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0958: Teste 12: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0959: Falha 12: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 0960: Aceite 12: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 0961: Axioma 12: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 0962: Cerca 12: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0963: Projecao 12: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0964: 2.5D 12: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0965: 3D 12: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 0966: Editor 12: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 0967: Gameplay 12: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0968: Teste 12: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0969: Falha 12: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 0970: Aceite 12: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 0971: Axioma 12: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 0972: Cerca 12: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0973: Projecao 12: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0974: 2.5D 12: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0975: 3D 12: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 0976: Editor 12: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 0977: Gameplay 12: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0978: Teste 12: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0979: Falha 12: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 0980: Aceite 12: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 0981: Axioma 13: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 0982: Cerca 13: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0983: Projecao 13: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0984: 2.5D 13: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0985: 3D 13: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 0986: Editor 13: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 0987: Gameplay 13: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0988: Teste 13: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0989: Falha 13: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 0990: Aceite 13: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 0991: Axioma 13: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 0992: Cerca 13: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 0993: Projecao 13: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 0994: 2.5D 13: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 0995: 3D 13: y representa altura prova volume real e impede escalas independentes.
Linha 0996: Editor 13: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 0997: Gameplay 13: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 0998: Teste 13: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 0999: Falha 13: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1000: Aceite 13: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1001: Axioma 13: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1002: Cerca 13: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1003: Projecao 13: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1004: 2.5D 13: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1005: 3D 13: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1006: Editor 13: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1007: Gameplay 13: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1008: Teste 13: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1009: Falha 13: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1010: Aceite 13: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1011: Axioma 13: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1012: Cerca 13: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1013: Projecao 13: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1014: 2.5D 13: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1015: 3D 13: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1016: Editor 13: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1017: Gameplay 13: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1018: Teste 13: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1019: Falha 13: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1020: Aceite 13: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1021: Axioma 13: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1022: Cerca 13: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1023: Projecao 13: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1024: 2.5D 13: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1025: 3D 13: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1026: Editor 13: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1027: Gameplay 13: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1028: Teste 13: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1029: Falha 13: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1030: Aceite 13: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1031: Axioma 13: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1032: Cerca 13: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1033: Projecao 13: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1034: 2.5D 13: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1035: 3D 13: escala uniforme prova volume real e impede escalas independentes.
Linha 1036: Editor 13: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1037: Gameplay 13: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1038: Teste 13: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1039: Falha 13: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1040: Aceite 13: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1041: Axioma 13: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1042: Cerca 13: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1043: Projecao 13: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1044: 2.5D 13: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1045: 3D 13: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1046: Editor 13: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1047: Gameplay 13: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1048: Teste 13: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1049: Falha 13: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1050: Aceite 13: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1051: Axioma 13: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1052: Cerca 13: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1053: Projecao 13: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1054: 2.5D 13: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1055: 3D 13: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1056: Editor 13: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1057: Gameplay 13: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1058: Teste 13: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1059: Falha 13: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1060: Aceite 13: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1061: Axioma 14: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1062: Cerca 14: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1063: Projecao 14: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1064: 2.5D 14: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1065: 3D 14: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1066: Editor 14: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1067: Gameplay 14: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1068: Teste 14: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1069: Falha 14: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1070: Aceite 14: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1071: Axioma 14: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1072: Cerca 14: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1073: Projecao 14: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1074: 2.5D 14: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1075: 3D 14: y representa altura prova volume real e impede escalas independentes.
Linha 1076: Editor 14: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1077: Gameplay 14: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1078: Teste 14: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1079: Falha 14: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1080: Aceite 14: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1081: Axioma 14: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1082: Cerca 14: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1083: Projecao 14: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1084: 2.5D 14: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1085: 3D 14: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1086: Editor 14: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1087: Gameplay 14: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1088: Teste 14: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1089: Falha 14: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1090: Aceite 14: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1091: Axioma 14: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1092: Cerca 14: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1093: Projecao 14: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1094: 2.5D 14: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1095: 3D 14: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1096: Editor 14: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1097: Gameplay 14: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1098: Teste 14: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1099: Falha 14: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1100: Aceite 14: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1101: Axioma 14: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1102: Cerca 14: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1103: Projecao 14: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1104: 2.5D 14: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1105: 3D 14: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1106: Editor 14: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1107: Gameplay 14: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1108: Teste 14: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1109: Falha 14: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1110: Aceite 14: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1111: Axioma 14: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1112: Cerca 14: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1113: Projecao 14: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1114: 2.5D 14: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1115: 3D 14: escala uniforme prova volume real e impede escalas independentes.
Linha 1116: Editor 14: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1117: Gameplay 14: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1118: Teste 14: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1119: Falha 14: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1120: Aceite 14: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1121: Axioma 14: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1122: Cerca 14: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1123: Projecao 14: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1124: 2.5D 14: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1125: 3D 14: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1126: Editor 14: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1127: Gameplay 14: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1128: Teste 14: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1129: Falha 14: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1130: Aceite 14: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1131: Axioma 14: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1132: Cerca 14: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1133: Projecao 14: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1134: 2.5D 14: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1135: 3D 14: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1136: Editor 14: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1137: Gameplay 14: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1138: Teste 14: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1139: Falha 14: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1140: Aceite 14: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1141: Axioma 15: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1142: Cerca 15: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1143: Projecao 15: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1144: 2.5D 15: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1145: 3D 15: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1146: Editor 15: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1147: Gameplay 15: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1148: Teste 15: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1149: Falha 15: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1150: Aceite 15: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1151: Axioma 15: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1152: Cerca 15: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1153: Projecao 15: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1154: 2.5D 15: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1155: 3D 15: y representa altura prova volume real e impede escalas independentes.
Linha 1156: Editor 15: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1157: Gameplay 15: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1158: Teste 15: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1159: Falha 15: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1160: Aceite 15: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1161: Axioma 15: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1162: Cerca 15: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1163: Projecao 15: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1164: 2.5D 15: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1165: 3D 15: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1166: Editor 15: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1167: Gameplay 15: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1168: Teste 15: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1169: Falha 15: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1170: Aceite 15: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1171: Axioma 15: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1172: Cerca 15: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1173: Projecao 15: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1174: 2.5D 15: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1175: 3D 15: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1176: Editor 15: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1177: Gameplay 15: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1178: Teste 15: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1179: Falha 15: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1180: Aceite 15: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1181: Axioma 15: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1182: Cerca 15: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1183: Projecao 15: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1184: 2.5D 15: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1185: 3D 15: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1186: Editor 15: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1187: Gameplay 15: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1188: Teste 15: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1189: Falha 15: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1190: Aceite 15: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1191: Axioma 15: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1192: Cerca 15: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1193: Projecao 15: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1194: 2.5D 15: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1195: 3D 15: escala uniforme prova volume real e impede escalas independentes.
Linha 1196: Editor 15: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1197: Gameplay 15: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1198: Teste 15: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1199: Falha 15: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1200: Aceite 15: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1201: Axioma 15: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1202: Cerca 15: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1203: Projecao 15: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1204: 2.5D 15: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1205: 3D 15: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1206: Editor 15: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1207: Gameplay 15: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1208: Teste 15: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1209: Falha 15: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1210: Aceite 15: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1211: Axioma 15: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1212: Cerca 15: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1213: Projecao 15: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1214: 2.5D 15: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1215: 3D 15: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1216: Editor 15: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1217: Gameplay 15: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1218: Teste 15: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1219: Falha 15: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1220: Aceite 15: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1221: Axioma 16: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1222: Cerca 16: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1223: Projecao 16: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1224: 2.5D 16: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1225: 3D 16: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1226: Editor 16: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1227: Gameplay 16: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1228: Teste 16: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1229: Falha 16: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1230: Aceite 16: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1231: Axioma 16: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1232: Cerca 16: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1233: Projecao 16: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1234: 2.5D 16: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1235: 3D 16: y representa altura prova volume real e impede escalas independentes.
Linha 1236: Editor 16: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1237: Gameplay 16: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1238: Teste 16: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1239: Falha 16: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1240: Aceite 16: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1241: Axioma 16: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1242: Cerca 16: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1243: Projecao 16: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1244: 2.5D 16: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1245: 3D 16: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1246: Editor 16: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1247: Gameplay 16: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1248: Teste 16: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1249: Falha 16: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1250: Aceite 16: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1251: Axioma 16: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1252: Cerca 16: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1253: Projecao 16: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1254: 2.5D 16: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1255: 3D 16: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1256: Editor 16: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1257: Gameplay 16: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1258: Teste 16: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1259: Falha 16: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1260: Aceite 16: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1261: Axioma 16: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1262: Cerca 16: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1263: Projecao 16: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1264: 2.5D 16: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1265: 3D 16: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1266: Editor 16: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1267: Gameplay 16: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1268: Teste 16: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1269: Falha 16: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1270: Aceite 16: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1271: Axioma 16: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1272: Cerca 16: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1273: Projecao 16: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1274: 2.5D 16: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1275: 3D 16: escala uniforme prova volume real e impede escalas independentes.
Linha 1276: Editor 16: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1277: Gameplay 16: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1278: Teste 16: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1279: Falha 16: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1280: Aceite 16: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1281: Axioma 16: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1282: Cerca 16: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1283: Projecao 16: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1284: 2.5D 16: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1285: 3D 16: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1286: Editor 16: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1287: Gameplay 16: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1288: Teste 16: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1289: Falha 16: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1290: Aceite 16: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1291: Axioma 16: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1292: Cerca 16: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1293: Projecao 16: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1294: 2.5D 16: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1295: 3D 16: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1296: Editor 16: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1297: Gameplay 16: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1298: Teste 16: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1299: Falha 16: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1300: Aceite 16: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1301: Axioma 17: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1302: Cerca 17: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1303: Projecao 17: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1304: 2.5D 17: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1305: 3D 17: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1306: Editor 17: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1307: Gameplay 17: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1308: Teste 17: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1309: Falha 17: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1310: Aceite 17: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1311: Axioma 17: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1312: Cerca 17: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1313: Projecao 17: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1314: 2.5D 17: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1315: 3D 17: y representa altura prova volume real e impede escalas independentes.
Linha 1316: Editor 17: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1317: Gameplay 17: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1318: Teste 17: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1319: Falha 17: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1320: Aceite 17: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1321: Axioma 17: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1322: Cerca 17: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1323: Projecao 17: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1324: 2.5D 17: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1325: 3D 17: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1326: Editor 17: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1327: Gameplay 17: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1328: Teste 17: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1329: Falha 17: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1330: Aceite 17: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1331: Axioma 17: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1332: Cerca 17: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1333: Projecao 17: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1334: 2.5D 17: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1335: 3D 17: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1336: Editor 17: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1337: Gameplay 17: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1338: Teste 17: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1339: Falha 17: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1340: Aceite 17: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1341: Axioma 17: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1342: Cerca 17: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1343: Projecao 17: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1344: 2.5D 17: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1345: 3D 17: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1346: Editor 17: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1347: Gameplay 17: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1348: Teste 17: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1349: Falha 17: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1350: Aceite 17: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1351: Axioma 17: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1352: Cerca 17: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1353: Projecao 17: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1354: 2.5D 17: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1355: 3D 17: escala uniforme prova volume real e impede escalas independentes.
Linha 1356: Editor 17: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1357: Gameplay 17: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1358: Teste 17: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1359: Falha 17: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1360: Aceite 17: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1361: Axioma 17: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1362: Cerca 17: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1363: Projecao 17: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1364: 2.5D 17: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1365: 3D 17: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1366: Editor 17: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1367: Gameplay 17: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1368: Teste 17: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1369: Falha 17: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1370: Aceite 17: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1371: Axioma 17: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1372: Cerca 17: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1373: Projecao 17: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1374: 2.5D 17: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1375: 3D 17: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1376: Editor 17: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1377: Gameplay 17: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1378: Teste 17: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1379: Falha 17: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1380: Aceite 17: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1381: Axioma 18: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1382: Cerca 18: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1383: Projecao 18: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1384: 2.5D 18: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1385: 3D 18: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1386: Editor 18: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1387: Gameplay 18: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1388: Teste 18: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1389: Falha 18: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1390: Aceite 18: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1391: Axioma 18: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1392: Cerca 18: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1393: Projecao 18: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1394: 2.5D 18: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1395: 3D 18: y representa altura prova volume real e impede escalas independentes.
Linha 1396: Editor 18: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1397: Gameplay 18: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1398: Teste 18: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1399: Falha 18: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1400: Aceite 18: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1401: Axioma 18: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1402: Cerca 18: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1403: Projecao 18: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1404: 2.5D 18: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1405: 3D 18: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1406: Editor 18: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1407: Gameplay 18: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1408: Teste 18: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1409: Falha 18: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1410: Aceite 18: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1411: Axioma 18: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1412: Cerca 18: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1413: Projecao 18: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1414: 2.5D 18: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1415: 3D 18: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1416: Editor 18: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1417: Gameplay 18: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1418: Teste 18: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1419: Falha 18: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1420: Aceite 18: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1421: Axioma 18: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1422: Cerca 18: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1423: Projecao 18: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1424: 2.5D 18: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1425: 3D 18: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1426: Editor 18: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1427: Gameplay 18: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1428: Teste 18: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1429: Falha 18: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1430: Aceite 18: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1431: Axioma 18: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1432: Cerca 18: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1433: Projecao 18: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1434: 2.5D 18: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1435: 3D 18: escala uniforme prova volume real e impede escalas independentes.
Linha 1436: Editor 18: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1437: Gameplay 18: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1438: Teste 18: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1439: Falha 18: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1440: Aceite 18: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1441: Axioma 18: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1442: Cerca 18: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1443: Projecao 18: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1444: 2.5D 18: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1445: 3D 18: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1446: Editor 18: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1447: Gameplay 18: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1448: Teste 18: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1449: Falha 18: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1450: Aceite 18: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1451: Axioma 18: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1452: Cerca 18: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1453: Projecao 18: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1454: 2.5D 18: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1455: 3D 18: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1456: Editor 18: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1457: Gameplay 18: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1458: Teste 18: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1459: Falha 18: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1460: Aceite 18: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1461: Axioma 19: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1462: Cerca 19: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1463: Projecao 19: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1464: 2.5D 19: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1465: 3D 19: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1466: Editor 19: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1467: Gameplay 19: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1468: Teste 19: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1469: Falha 19: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1470: Aceite 19: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1471: Axioma 19: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1472: Cerca 19: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1473: Projecao 19: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1474: 2.5D 19: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1475: 3D 19: y representa altura prova volume real e impede escalas independentes.
Linha 1476: Editor 19: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1477: Gameplay 19: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1478: Teste 19: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1479: Falha 19: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1480: Aceite 19: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1481: Axioma 19: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1482: Cerca 19: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1483: Projecao 19: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1484: 2.5D 19: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1485: 3D 19: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1486: Editor 19: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1487: Gameplay 19: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1488: Teste 19: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1489: Falha 19: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1490: Aceite 19: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1491: Axioma 19: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1492: Cerca 19: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1493: Projecao 19: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1494: 2.5D 19: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1495: 3D 19: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1496: Editor 19: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1497: Gameplay 19: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1498: Teste 19: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1499: Falha 19: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1500: Aceite 19: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1501: Axioma 19: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1502: Cerca 19: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1503: Projecao 19: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1504: 2.5D 19: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1505: 3D 19: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1506: Editor 19: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1507: Gameplay 19: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1508: Teste 19: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1509: Falha 19: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1510: Aceite 19: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1511: Axioma 19: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1512: Cerca 19: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1513: Projecao 19: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1514: 2.5D 19: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1515: 3D 19: escala uniforme prova volume real e impede escalas independentes.
Linha 1516: Editor 19: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1517: Gameplay 19: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1518: Teste 19: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1519: Falha 19: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1520: Aceite 19: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1521: Axioma 19: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1522: Cerca 19: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1523: Projecao 19: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1524: 2.5D 19: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1525: 3D 19: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1526: Editor 19: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1527: Gameplay 19: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1528: Teste 19: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1529: Falha 19: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1530: Aceite 19: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1531: Axioma 19: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1532: Cerca 19: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1533: Projecao 19: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1534: 2.5D 19: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1535: 3D 19: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1536: Editor 19: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1537: Gameplay 19: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1538: Teste 19: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1539: Falha 19: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1540: Aceite 19: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1541: Axioma 20: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1542: Cerca 20: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1543: Projecao 20: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1544: 2.5D 20: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1545: 3D 20: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1546: Editor 20: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1547: Gameplay 20: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1548: Teste 20: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1549: Falha 20: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1550: Aceite 20: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1551: Axioma 20: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1552: Cerca 20: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1553: Projecao 20: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1554: 2.5D 20: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1555: 3D 20: y representa altura prova volume real e impede escalas independentes.
Linha 1556: Editor 20: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1557: Gameplay 20: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1558: Teste 20: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1559: Falha 20: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1560: Aceite 20: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1561: Axioma 20: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1562: Cerca 20: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1563: Projecao 20: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1564: 2.5D 20: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1565: 3D 20: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1566: Editor 20: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1567: Gameplay 20: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1568: Teste 20: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1569: Falha 20: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1570: Aceite 20: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1571: Axioma 20: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1572: Cerca 20: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1573: Projecao 20: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1574: 2.5D 20: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1575: 3D 20: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1576: Editor 20: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1577: Gameplay 20: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1578: Teste 20: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1579: Falha 20: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1580: Aceite 20: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1581: Axioma 20: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1582: Cerca 20: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1583: Projecao 20: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1584: 2.5D 20: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1585: 3D 20: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1586: Editor 20: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1587: Gameplay 20: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1588: Teste 20: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1589: Falha 20: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1590: Aceite 20: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1591: Axioma 20: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1592: Cerca 20: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1593: Projecao 20: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1594: 2.5D 20: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1595: 3D 20: escala uniforme prova volume real e impede escalas independentes.
Linha 1596: Editor 20: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1597: Gameplay 20: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1598: Teste 20: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1599: Falha 20: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1600: Aceite 20: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1601: Axioma 20: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1602: Cerca 20: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1603: Projecao 20: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1604: 2.5D 20: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1605: 3D 20: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1606: Editor 20: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1607: Gameplay 20: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1608: Teste 20: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1609: Falha 20: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1610: Aceite 20: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1611: Axioma 20: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1612: Cerca 20: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1613: Projecao 20: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1614: 2.5D 20: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1615: 3D 20: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1616: Editor 20: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1617: Gameplay 20: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1618: Teste 20: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1619: Falha 20: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1620: Aceite 20: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1621: Axioma 21: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1622: Cerca 21: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1623: Projecao 21: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1624: 2.5D 21: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1625: 3D 21: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1626: Editor 21: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1627: Gameplay 21: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1628: Teste 21: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1629: Falha 21: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1630: Aceite 21: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1631: Axioma 21: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1632: Cerca 21: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1633: Projecao 21: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1634: 2.5D 21: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1635: 3D 21: y representa altura prova volume real e impede escalas independentes.
Linha 1636: Editor 21: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1637: Gameplay 21: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1638: Teste 21: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1639: Falha 21: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1640: Aceite 21: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1641: Axioma 21: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1642: Cerca 21: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1643: Projecao 21: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1644: 2.5D 21: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1645: 3D 21: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1646: Editor 21: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1647: Gameplay 21: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1648: Teste 21: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1649: Falha 21: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1650: Aceite 21: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1651: Axioma 21: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1652: Cerca 21: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1653: Projecao 21: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1654: 2.5D 21: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1655: 3D 21: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1656: Editor 21: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1657: Gameplay 21: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1658: Teste 21: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1659: Falha 21: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1660: Aceite 21: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1661: Axioma 21: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1662: Cerca 21: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1663: Projecao 21: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1664: 2.5D 21: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1665: 3D 21: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1666: Editor 21: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1667: Gameplay 21: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1668: Teste 21: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1669: Falha 21: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1670: Aceite 21: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1671: Axioma 21: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1672: Cerca 21: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1673: Projecao 21: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1674: 2.5D 21: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1675: 3D 21: escala uniforme prova volume real e impede escalas independentes.
Linha 1676: Editor 21: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1677: Gameplay 21: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1678: Teste 21: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1679: Falha 21: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1680: Aceite 21: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1681: Axioma 21: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1682: Cerca 21: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1683: Projecao 21: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1684: 2.5D 21: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1685: 3D 21: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1686: Editor 21: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1687: Gameplay 21: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1688: Teste 21: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1689: Falha 21: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1690: Aceite 21: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1691: Axioma 21: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1692: Cerca 21: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1693: Projecao 21: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1694: 2.5D 21: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1695: 3D 21: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1696: Editor 21: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1697: Gameplay 21: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1698: Teste 21: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1699: Falha 21: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1700: Aceite 21: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1701: Axioma 22: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1702: Cerca 22: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1703: Projecao 22: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1704: 2.5D 22: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1705: 3D 22: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1706: Editor 22: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1707: Gameplay 22: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1708: Teste 22: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1709: Falha 22: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1710: Aceite 22: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1711: Axioma 22: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1712: Cerca 22: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1713: Projecao 22: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1714: 2.5D 22: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1715: 3D 22: y representa altura prova volume real e impede escalas independentes.
Linha 1716: Editor 22: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1717: Gameplay 22: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1718: Teste 22: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1719: Falha 22: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1720: Aceite 22: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1721: Axioma 22: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1722: Cerca 22: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1723: Projecao 22: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1724: 2.5D 22: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1725: 3D 22: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1726: Editor 22: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1727: Gameplay 22: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1728: Teste 22: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1729: Falha 22: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1730: Aceite 22: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1731: Axioma 22: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1732: Cerca 22: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1733: Projecao 22: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1734: 2.5D 22: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1735: 3D 22: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1736: Editor 22: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1737: Gameplay 22: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1738: Teste 22: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1739: Falha 22: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1740: Aceite 22: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1741: Axioma 22: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1742: Cerca 22: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1743: Projecao 22: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1744: 2.5D 22: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1745: 3D 22: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1746: Editor 22: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1747: Gameplay 22: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1748: Teste 22: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1749: Falha 22: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1750: Aceite 22: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1751: Axioma 22: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1752: Cerca 22: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1753: Projecao 22: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1754: 2.5D 22: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1755: 3D 22: escala uniforme prova volume real e impede escalas independentes.
Linha 1756: Editor 22: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1757: Gameplay 22: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1758: Teste 22: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1759: Falha 22: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1760: Aceite 22: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1761: Axioma 22: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1762: Cerca 22: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1763: Projecao 22: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1764: 2.5D 22: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1765: 3D 22: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1766: Editor 22: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1767: Gameplay 22: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1768: Teste 22: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1769: Falha 22: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1770: Aceite 22: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1771: Axioma 22: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1772: Cerca 22: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1773: Projecao 22: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1774: 2.5D 22: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1775: 3D 22: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1776: Editor 22: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1777: Gameplay 22: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1778: Teste 22: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1779: Falha 22: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1780: Aceite 22: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1781: Axioma 23: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1782: Cerca 23: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1783: Projecao 23: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1784: 2.5D 23: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1785: 3D 23: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1786: Editor 23: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1787: Gameplay 23: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1788: Teste 23: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1789: Falha 23: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1790: Aceite 23: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1791: Axioma 23: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1792: Cerca 23: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1793: Projecao 23: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1794: 2.5D 23: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1795: 3D 23: y representa altura prova volume real e impede escalas independentes.
Linha 1796: Editor 23: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1797: Gameplay 23: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1798: Teste 23: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1799: Falha 23: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1800: Aceite 23: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1801: Axioma 23: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1802: Cerca 23: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1803: Projecao 23: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1804: 2.5D 23: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1805: 3D 23: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1806: Editor 23: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1807: Gameplay 23: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1808: Teste 23: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1809: Falha 23: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1810: Aceite 23: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1811: Axioma 23: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1812: Cerca 23: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1813: Projecao 23: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1814: 2.5D 23: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1815: 3D 23: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1816: Editor 23: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1817: Gameplay 23: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1818: Teste 23: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1819: Falha 23: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1820: Aceite 23: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1821: Axioma 23: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1822: Cerca 23: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1823: Projecao 23: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1824: 2.5D 23: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1825: 3D 23: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1826: Editor 23: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1827: Gameplay 23: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1828: Teste 23: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1829: Falha 23: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1830: Aceite 23: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1831: Axioma 23: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1832: Cerca 23: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1833: Projecao 23: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1834: 2.5D 23: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1835: 3D 23: escala uniforme prova volume real e impede escalas independentes.
Linha 1836: Editor 23: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1837: Gameplay 23: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1838: Teste 23: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1839: Falha 23: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1840: Aceite 23: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1841: Axioma 23: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1842: Cerca 23: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1843: Projecao 23: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1844: 2.5D 23: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1845: 3D 23: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1846: Editor 23: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1847: Gameplay 23: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1848: Teste 23: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1849: Falha 23: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1850: Aceite 23: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1851: Axioma 23: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1852: Cerca 23: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1853: Projecao 23: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1854: 2.5D 23: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1855: 3D 23: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1856: Editor 23: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1857: Gameplay 23: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1858: Teste 23: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1859: Falha 23: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1860: Aceite 23: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1861: Axioma 24: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1862: Cerca 24: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1863: Projecao 24: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1864: 2.5D 24: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1865: 3D 24: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1866: Editor 24: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1867: Gameplay 24: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1868: Teste 24: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1869: Falha 24: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1870: Aceite 24: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1871: Axioma 24: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1872: Cerca 24: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1873: Projecao 24: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1874: 2.5D 24: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1875: 3D 24: y representa altura prova volume real e impede escalas independentes.
Linha 1876: Editor 24: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1877: Gameplay 24: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1878: Teste 24: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1879: Falha 24: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1880: Aceite 24: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1881: Axioma 24: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1882: Cerca 24: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1883: Projecao 24: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1884: 2.5D 24: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1885: 3D 24: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1886: Editor 24: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1887: Gameplay 24: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1888: Teste 24: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1889: Falha 24: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1890: Aceite 24: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1891: Axioma 24: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1892: Cerca 24: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1893: Projecao 24: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1894: 2.5D 24: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1895: 3D 24: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1896: Editor 24: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1897: Gameplay 24: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1898: Teste 24: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1899: Falha 24: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1900: Aceite 24: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1901: Axioma 24: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1902: Cerca 24: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1903: Projecao 24: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1904: 2.5D 24: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1905: 3D 24: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1906: Editor 24: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1907: Gameplay 24: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1908: Teste 24: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1909: Falha 24: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1910: Aceite 24: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1911: Axioma 24: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1912: Cerca 24: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1913: Projecao 24: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1914: 2.5D 24: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1915: 3D 24: escala uniforme prova volume real e impede escalas independentes.
Linha 1916: Editor 24: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1917: Gameplay 24: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1918: Teste 24: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1919: Falha 24: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 1920: Aceite 24: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 1921: Axioma 24: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 1922: Cerca 24: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1923: Projecao 24: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1924: 2.5D 24: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1925: 3D 24: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 1926: Editor 24: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 1927: Gameplay 24: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1928: Teste 24: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1929: Falha 24: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 1930: Aceite 24: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 1931: Axioma 24: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 1932: Cerca 24: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1933: Projecao 24: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1934: 2.5D 24: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1935: 3D 24: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 1936: Editor 24: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 1937: Gameplay 24: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1938: Teste 24: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1939: Falha 24: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 1940: Aceite 24: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 1941: Axioma 25: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 1942: Cerca 25: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1943: Projecao 25: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1944: 2.5D 25: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1945: 3D 25: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 1946: Editor 25: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 1947: Gameplay 25: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1948: Teste 25: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1949: Falha 25: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 1950: Aceite 25: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 1951: Axioma 25: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 1952: Cerca 25: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1953: Projecao 25: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1954: 2.5D 25: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1955: 3D 25: y representa altura prova volume real e impede escalas independentes.
Linha 1956: Editor 25: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 1957: Gameplay 25: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1958: Teste 25: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1959: Falha 25: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1960: Aceite 25: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 1961: Axioma 25: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 1962: Cerca 25: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1963: Projecao 25: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1964: 2.5D 25: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1965: 3D 25: volume deriva do shape prova volume real e impede escalas independentes.
Linha 1966: Editor 25: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 1967: Gameplay 25: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1968: Teste 25: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1969: Falha 25: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 1970: Aceite 25: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 1971: Axioma 25: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 1972: Cerca 25: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1973: Projecao 25: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1974: 2.5D 25: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1975: 3D 25: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 1976: Editor 25: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 1977: Gameplay 25: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1978: Teste 25: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1979: Falha 25: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 1980: Aceite 25: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 1981: Axioma 25: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 1982: Cerca 25: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1983: Projecao 25: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1984: 2.5D 25: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1985: 3D 25: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 1986: Editor 25: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 1987: Gameplay 25: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1988: Teste 25: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1989: Falha 25: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 1990: Aceite 25: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 1991: Axioma 25: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 1992: Cerca 25: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 1993: Projecao 25: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 1994: 2.5D 25: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 1995: 3D 25: escala uniforme prova volume real e impede escalas independentes.
Linha 1996: Editor 25: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 1997: Gameplay 25: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 1998: Teste 25: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 1999: Falha 25: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2000: Aceite 25: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2001: Axioma 25: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2002: Cerca 25: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2003: Projecao 25: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2004: 2.5D 25: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2005: 3D 25: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2006: Editor 25: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2007: Gameplay 25: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2008: Teste 25: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2009: Falha 25: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2010: Aceite 25: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2011: Axioma 25: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2012: Cerca 25: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2013: Projecao 25: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2014: 2.5D 25: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2015: 3D 25: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2016: Editor 25: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2017: Gameplay 25: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2018: Teste 25: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2019: Falha 25: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2020: Aceite 25: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2021: Axioma 26: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2022: Cerca 26: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2023: Projecao 26: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2024: 2.5D 26: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2025: 3D 26: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2026: Editor 26: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2027: Gameplay 26: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2028: Teste 26: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2029: Falha 26: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2030: Aceite 26: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2031: Axioma 26: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2032: Cerca 26: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2033: Projecao 26: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2034: 2.5D 26: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2035: 3D 26: y representa altura prova volume real e impede escalas independentes.
Linha 2036: Editor 26: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2037: Gameplay 26: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2038: Teste 26: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2039: Falha 26: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2040: Aceite 26: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2041: Axioma 26: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2042: Cerca 26: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2043: Projecao 26: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2044: 2.5D 26: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2045: 3D 26: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2046: Editor 26: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2047: Gameplay 26: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2048: Teste 26: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2049: Falha 26: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2050: Aceite 26: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2051: Axioma 26: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2052: Cerca 26: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2053: Projecao 26: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2054: 2.5D 26: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2055: 3D 26: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2056: Editor 26: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2057: Gameplay 26: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2058: Teste 26: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2059: Falha 26: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2060: Aceite 26: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2061: Axioma 26: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2062: Cerca 26: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2063: Projecao 26: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2064: 2.5D 26: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2065: 3D 26: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2066: Editor 26: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2067: Gameplay 26: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2068: Teste 26: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2069: Falha 26: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2070: Aceite 26: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2071: Axioma 26: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2072: Cerca 26: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2073: Projecao 26: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2074: 2.5D 26: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2075: 3D 26: escala uniforme prova volume real e impede escalas independentes.
Linha 2076: Editor 26: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2077: Gameplay 26: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2078: Teste 26: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2079: Falha 26: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2080: Aceite 26: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2081: Axioma 26: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2082: Cerca 26: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2083: Projecao 26: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2084: 2.5D 26: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2085: 3D 26: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2086: Editor 26: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2087: Gameplay 26: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2088: Teste 26: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2089: Falha 26: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2090: Aceite 26: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2091: Axioma 26: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2092: Cerca 26: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2093: Projecao 26: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2094: 2.5D 26: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2095: 3D 26: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2096: Editor 26: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2097: Gameplay 26: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2098: Teste 26: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2099: Falha 26: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2100: Aceite 26: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2101: Axioma 27: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2102: Cerca 27: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2103: Projecao 27: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2104: 2.5D 27: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2105: 3D 27: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2106: Editor 27: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2107: Gameplay 27: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2108: Teste 27: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2109: Falha 27: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2110: Aceite 27: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2111: Axioma 27: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2112: Cerca 27: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2113: Projecao 27: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2114: 2.5D 27: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2115: 3D 27: y representa altura prova volume real e impede escalas independentes.
Linha 2116: Editor 27: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2117: Gameplay 27: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2118: Teste 27: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2119: Falha 27: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2120: Aceite 27: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2121: Axioma 27: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2122: Cerca 27: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2123: Projecao 27: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2124: 2.5D 27: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2125: 3D 27: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2126: Editor 27: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2127: Gameplay 27: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2128: Teste 27: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2129: Falha 27: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2130: Aceite 27: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2131: Axioma 27: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2132: Cerca 27: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2133: Projecao 27: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2134: 2.5D 27: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2135: 3D 27: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2136: Editor 27: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2137: Gameplay 27: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2138: Teste 27: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2139: Falha 27: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2140: Aceite 27: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2141: Axioma 27: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2142: Cerca 27: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2143: Projecao 27: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2144: 2.5D 27: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2145: 3D 27: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2146: Editor 27: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2147: Gameplay 27: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2148: Teste 27: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2149: Falha 27: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2150: Aceite 27: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2151: Axioma 27: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2152: Cerca 27: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2153: Projecao 27: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2154: 2.5D 27: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2155: 3D 27: escala uniforme prova volume real e impede escalas independentes.
Linha 2156: Editor 27: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2157: Gameplay 27: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2158: Teste 27: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2159: Falha 27: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2160: Aceite 27: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2161: Axioma 27: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2162: Cerca 27: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2163: Projecao 27: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2164: 2.5D 27: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2165: 3D 27: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2166: Editor 27: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2167: Gameplay 27: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2168: Teste 27: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2169: Falha 27: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2170: Aceite 27: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2171: Axioma 27: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2172: Cerca 27: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2173: Projecao 27: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2174: 2.5D 27: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2175: 3D 27: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2176: Editor 27: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2177: Gameplay 27: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2178: Teste 27: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2179: Falha 27: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2180: Aceite 27: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2181: Axioma 28: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2182: Cerca 28: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2183: Projecao 28: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2184: 2.5D 28: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2185: 3D 28: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2186: Editor 28: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2187: Gameplay 28: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2188: Teste 28: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2189: Falha 28: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2190: Aceite 28: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2191: Axioma 28: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2192: Cerca 28: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2193: Projecao 28: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2194: 2.5D 28: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2195: 3D 28: y representa altura prova volume real e impede escalas independentes.
Linha 2196: Editor 28: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2197: Gameplay 28: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2198: Teste 28: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2199: Falha 28: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2200: Aceite 28: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2201: Axioma 28: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2202: Cerca 28: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2203: Projecao 28: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2204: 2.5D 28: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2205: 3D 28: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2206: Editor 28: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2207: Gameplay 28: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2208: Teste 28: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2209: Falha 28: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2210: Aceite 28: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2211: Axioma 28: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2212: Cerca 28: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2213: Projecao 28: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2214: 2.5D 28: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2215: 3D 28: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2216: Editor 28: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2217: Gameplay 28: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2218: Teste 28: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2219: Falha 28: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2220: Aceite 28: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2221: Axioma 28: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2222: Cerca 28: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2223: Projecao 28: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2224: 2.5D 28: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2225: 3D 28: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2226: Editor 28: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2227: Gameplay 28: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2228: Teste 28: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2229: Falha 28: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2230: Aceite 28: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2231: Axioma 28: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2232: Cerca 28: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2233: Projecao 28: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2234: 2.5D 28: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2235: 3D 28: escala uniforme prova volume real e impede escalas independentes.
Linha 2236: Editor 28: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2237: Gameplay 28: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2238: Teste 28: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2239: Falha 28: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2240: Aceite 28: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2241: Axioma 28: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2242: Cerca 28: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2243: Projecao 28: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2244: 2.5D 28: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2245: 3D 28: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2246: Editor 28: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2247: Gameplay 28: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2248: Teste 28: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2249: Falha 28: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2250: Aceite 28: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2251: Axioma 28: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2252: Cerca 28: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2253: Projecao 28: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2254: 2.5D 28: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2255: 3D 28: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2256: Editor 28: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2257: Gameplay 28: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2258: Teste 28: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2259: Falha 28: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2260: Aceite 28: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2261: Axioma 29: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2262: Cerca 29: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2263: Projecao 29: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2264: 2.5D 29: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2265: 3D 29: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2266: Editor 29: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2267: Gameplay 29: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2268: Teste 29: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2269: Falha 29: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2270: Aceite 29: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2271: Axioma 29: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2272: Cerca 29: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2273: Projecao 29: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2274: 2.5D 29: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2275: 3D 29: y representa altura prova volume real e impede escalas independentes.
Linha 2276: Editor 29: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2277: Gameplay 29: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2278: Teste 29: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2279: Falha 29: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2280: Aceite 29: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2281: Axioma 29: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2282: Cerca 29: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2283: Projecao 29: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2284: 2.5D 29: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2285: 3D 29: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2286: Editor 29: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2287: Gameplay 29: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2288: Teste 29: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2289: Falha 29: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2290: Aceite 29: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2291: Axioma 29: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2292: Cerca 29: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2293: Projecao 29: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2294: 2.5D 29: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2295: 3D 29: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2296: Editor 29: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2297: Gameplay 29: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2298: Teste 29: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2299: Falha 29: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2300: Aceite 29: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2301: Axioma 29: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2302: Cerca 29: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2303: Projecao 29: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2304: 2.5D 29: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2305: 3D 29: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2306: Editor 29: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2307: Gameplay 29: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2308: Teste 29: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2309: Falha 29: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2310: Aceite 29: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2311: Axioma 29: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2312: Cerca 29: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2313: Projecao 29: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2314: 2.5D 29: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2315: 3D 29: escala uniforme prova volume real e impede escalas independentes.
Linha 2316: Editor 29: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2317: Gameplay 29: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2318: Teste 29: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2319: Falha 29: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2320: Aceite 29: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2321: Axioma 29: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2322: Cerca 29: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2323: Projecao 29: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2324: 2.5D 29: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2325: 3D 29: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2326: Editor 29: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2327: Gameplay 29: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2328: Teste 29: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2329: Falha 29: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2330: Aceite 29: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2331: Axioma 29: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2332: Cerca 29: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2333: Projecao 29: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2334: 2.5D 29: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2335: 3D 29: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2336: Editor 29: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2337: Gameplay 29: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2338: Teste 29: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2339: Falha 29: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2340: Aceite 29: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2341: Axioma 30: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2342: Cerca 30: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2343: Projecao 30: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2344: 2.5D 30: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2345: 3D 30: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2346: Editor 30: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2347: Gameplay 30: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2348: Teste 30: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2349: Falha 30: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2350: Aceite 30: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2351: Axioma 30: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2352: Cerca 30: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2353: Projecao 30: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2354: 2.5D 30: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2355: 3D 30: y representa altura prova volume real e impede escalas independentes.
Linha 2356: Editor 30: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2357: Gameplay 30: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2358: Teste 30: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2359: Falha 30: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2360: Aceite 30: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2361: Axioma 30: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2362: Cerca 30: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2363: Projecao 30: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2364: 2.5D 30: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2365: 3D 30: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2366: Editor 30: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2367: Gameplay 30: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2368: Teste 30: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2369: Falha 30: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2370: Aceite 30: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2371: Axioma 30: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2372: Cerca 30: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2373: Projecao 30: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2374: 2.5D 30: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2375: 3D 30: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2376: Editor 30: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2377: Gameplay 30: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2378: Teste 30: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2379: Falha 30: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2380: Aceite 30: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2381: Axioma 30: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2382: Cerca 30: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2383: Projecao 30: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2384: 2.5D 30: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2385: 3D 30: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2386: Editor 30: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2387: Gameplay 30: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2388: Teste 30: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2389: Falha 30: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2390: Aceite 30: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2391: Axioma 30: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2392: Cerca 30: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2393: Projecao 30: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2394: 2.5D 30: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2395: 3D 30: escala uniforme prova volume real e impede escalas independentes.
Linha 2396: Editor 30: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2397: Gameplay 30: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2398: Teste 30: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2399: Falha 30: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2400: Aceite 30: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2401: Axioma 30: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2402: Cerca 30: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2403: Projecao 30: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2404: 2.5D 30: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2405: 3D 30: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2406: Editor 30: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2407: Gameplay 30: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2408: Teste 30: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2409: Falha 30: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2410: Aceite 30: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2411: Axioma 30: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2412: Cerca 30: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2413: Projecao 30: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2414: 2.5D 30: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2415: 3D 30: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2416: Editor 30: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2417: Gameplay 30: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2418: Teste 30: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2419: Falha 30: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2420: Aceite 30: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2421: Axioma 31: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2422: Cerca 31: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2423: Projecao 31: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2424: 2.5D 31: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2425: 3D 31: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2426: Editor 31: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2427: Gameplay 31: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2428: Teste 31: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2429: Falha 31: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2430: Aceite 31: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2431: Axioma 31: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2432: Cerca 31: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2433: Projecao 31: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2434: 2.5D 31: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2435: 3D 31: y representa altura prova volume real e impede escalas independentes.
Linha 2436: Editor 31: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2437: Gameplay 31: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2438: Teste 31: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2439: Falha 31: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2440: Aceite 31: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2441: Axioma 31: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2442: Cerca 31: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2443: Projecao 31: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2444: 2.5D 31: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2445: 3D 31: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2446: Editor 31: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2447: Gameplay 31: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2448: Teste 31: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2449: Falha 31: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2450: Aceite 31: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2451: Axioma 31: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2452: Cerca 31: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2453: Projecao 31: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2454: 2.5D 31: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2455: 3D 31: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2456: Editor 31: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2457: Gameplay 31: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2458: Teste 31: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2459: Falha 31: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2460: Aceite 31: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2461: Axioma 31: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2462: Cerca 31: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2463: Projecao 31: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2464: 2.5D 31: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2465: 3D 31: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2466: Editor 31: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2467: Gameplay 31: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2468: Teste 31: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2469: Falha 31: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2470: Aceite 31: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2471: Axioma 31: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2472: Cerca 31: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2473: Projecao 31: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2474: 2.5D 31: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2475: 3D 31: escala uniforme prova volume real e impede escalas independentes.
Linha 2476: Editor 31: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2477: Gameplay 31: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2478: Teste 31: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2479: Falha 31: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2480: Aceite 31: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2481: Axioma 31: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2482: Cerca 31: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2483: Projecao 31: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2484: 2.5D 31: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2485: 3D 31: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2486: Editor 31: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2487: Gameplay 31: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2488: Teste 31: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2489: Falha 31: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2490: Aceite 31: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2491: Axioma 31: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2492: Cerca 31: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2493: Projecao 31: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2494: 2.5D 31: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2495: 3D 31: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2496: Editor 31: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2497: Gameplay 31: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2498: Teste 31: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2499: Falha 31: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2500: Aceite 31: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2501: Axioma 32: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2502: Cerca 32: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2503: Projecao 32: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2504: 2.5D 32: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2505: 3D 32: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2506: Editor 32: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2507: Gameplay 32: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2508: Teste 32: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2509: Falha 32: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2510: Aceite 32: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2511: Axioma 32: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2512: Cerca 32: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2513: Projecao 32: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2514: 2.5D 32: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2515: 3D 32: y representa altura prova volume real e impede escalas independentes.
Linha 2516: Editor 32: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2517: Gameplay 32: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2518: Teste 32: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2519: Falha 32: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2520: Aceite 32: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2521: Axioma 32: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2522: Cerca 32: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2523: Projecao 32: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2524: 2.5D 32: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2525: 3D 32: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2526: Editor 32: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2527: Gameplay 32: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2528: Teste 32: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2529: Falha 32: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2530: Aceite 32: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2531: Axioma 32: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2532: Cerca 32: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2533: Projecao 32: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2534: 2.5D 32: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2535: 3D 32: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2536: Editor 32: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2537: Gameplay 32: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2538: Teste 32: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2539: Falha 32: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2540: Aceite 32: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2541: Axioma 32: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2542: Cerca 32: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2543: Projecao 32: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2544: 2.5D 32: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2545: 3D 32: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2546: Editor 32: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2547: Gameplay 32: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2548: Teste 32: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2549: Falha 32: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2550: Aceite 32: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2551: Axioma 32: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2552: Cerca 32: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2553: Projecao 32: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2554: 2.5D 32: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2555: 3D 32: escala uniforme prova volume real e impede escalas independentes.
Linha 2556: Editor 32: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2557: Gameplay 32: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2558: Teste 32: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2559: Falha 32: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2560: Aceite 32: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2561: Axioma 32: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2562: Cerca 32: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2563: Projecao 32: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2564: 2.5D 32: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2565: 3D 32: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2566: Editor 32: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2567: Gameplay 32: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2568: Teste 32: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2569: Falha 32: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2570: Aceite 32: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2571: Axioma 32: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2572: Cerca 32: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2573: Projecao 32: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2574: 2.5D 32: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2575: 3D 32: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2576: Editor 32: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2577: Gameplay 32: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2578: Teste 32: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2579: Falha 32: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2580: Aceite 32: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2581: Axioma 33: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2582: Cerca 33: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2583: Projecao 33: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2584: 2.5D 33: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2585: 3D 33: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2586: Editor 33: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2587: Gameplay 33: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2588: Teste 33: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2589: Falha 33: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2590: Aceite 33: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2591: Axioma 33: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2592: Cerca 33: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2593: Projecao 33: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2594: 2.5D 33: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2595: 3D 33: y representa altura prova volume real e impede escalas independentes.
Linha 2596: Editor 33: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2597: Gameplay 33: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2598: Teste 33: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2599: Falha 33: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2600: Aceite 33: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2601: Axioma 33: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2602: Cerca 33: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2603: Projecao 33: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2604: 2.5D 33: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2605: 3D 33: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2606: Editor 33: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2607: Gameplay 33: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2608: Teste 33: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2609: Falha 33: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2610: Aceite 33: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2611: Axioma 33: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2612: Cerca 33: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2613: Projecao 33: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2614: 2.5D 33: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2615: 3D 33: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2616: Editor 33: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2617: Gameplay 33: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2618: Teste 33: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2619: Falha 33: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2620: Aceite 33: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2621: Axioma 33: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2622: Cerca 33: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2623: Projecao 33: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2624: 2.5D 33: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2625: 3D 33: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2626: Editor 33: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2627: Gameplay 33: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2628: Teste 33: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2629: Falha 33: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2630: Aceite 33: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2631: Axioma 33: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2632: Cerca 33: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2633: Projecao 33: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2634: 2.5D 33: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2635: 3D 33: escala uniforme prova volume real e impede escalas independentes.
Linha 2636: Editor 33: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2637: Gameplay 33: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2638: Teste 33: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2639: Falha 33: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2640: Aceite 33: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2641: Axioma 33: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2642: Cerca 33: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2643: Projecao 33: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2644: 2.5D 33: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2645: 3D 33: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2646: Editor 33: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2647: Gameplay 33: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2648: Teste 33: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2649: Falha 33: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2650: Aceite 33: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2651: Axioma 33: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2652: Cerca 33: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2653: Projecao 33: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2654: 2.5D 33: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2655: 3D 33: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2656: Editor 33: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2657: Gameplay 33: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2658: Teste 33: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2659: Falha 33: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2660: Aceite 33: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2661: Axioma 34: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2662: Cerca 34: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2663: Projecao 34: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2664: 2.5D 34: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2665: 3D 34: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2666: Editor 34: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2667: Gameplay 34: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2668: Teste 34: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2669: Falha 34: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2670: Aceite 34: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2671: Axioma 34: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2672: Cerca 34: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2673: Projecao 34: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2674: 2.5D 34: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2675: 3D 34: y representa altura prova volume real e impede escalas independentes.
Linha 2676: Editor 34: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2677: Gameplay 34: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2678: Teste 34: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2679: Falha 34: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2680: Aceite 34: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2681: Axioma 34: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2682: Cerca 34: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2683: Projecao 34: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2684: 2.5D 34: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2685: 3D 34: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2686: Editor 34: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2687: Gameplay 34: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2688: Teste 34: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2689: Falha 34: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2690: Aceite 34: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2691: Axioma 34: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2692: Cerca 34: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2693: Projecao 34: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2694: 2.5D 34: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2695: 3D 34: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2696: Editor 34: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2697: Gameplay 34: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2698: Teste 34: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2699: Falha 34: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2700: Aceite 34: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2701: Axioma 34: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2702: Cerca 34: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2703: Projecao 34: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2704: 2.5D 34: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2705: 3D 34: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2706: Editor 34: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2707: Gameplay 34: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2708: Teste 34: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2709: Falha 34: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2710: Aceite 34: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2711: Axioma 34: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2712: Cerca 34: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2713: Projecao 34: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2714: 2.5D 34: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2715: 3D 34: escala uniforme prova volume real e impede escalas independentes.
Linha 2716: Editor 34: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2717: Gameplay 34: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2718: Teste 34: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2719: Falha 34: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2720: Aceite 34: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2721: Axioma 34: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2722: Cerca 34: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2723: Projecao 34: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2724: 2.5D 34: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2725: 3D 34: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2726: Editor 34: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2727: Gameplay 34: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2728: Teste 34: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2729: Falha 34: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2730: Aceite 34: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2731: Axioma 34: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2732: Cerca 34: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2733: Projecao 34: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2734: 2.5D 34: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2735: 3D 34: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2736: Editor 34: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2737: Gameplay 34: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2738: Teste 34: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2739: Falha 34: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2740: Aceite 34: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2741: Axioma 35: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2742: Cerca 35: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2743: Projecao 35: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2744: 2.5D 35: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2745: 3D 35: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2746: Editor 35: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2747: Gameplay 35: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2748: Teste 35: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2749: Falha 35: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2750: Aceite 35: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2751: Axioma 35: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2752: Cerca 35: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2753: Projecao 35: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2754: 2.5D 35: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2755: 3D 35: y representa altura prova volume real e impede escalas independentes.
Linha 2756: Editor 35: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2757: Gameplay 35: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2758: Teste 35: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2759: Falha 35: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2760: Aceite 35: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2761: Axioma 35: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2762: Cerca 35: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2763: Projecao 35: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2764: 2.5D 35: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2765: 3D 35: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2766: Editor 35: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2767: Gameplay 35: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2768: Teste 35: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2769: Falha 35: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2770: Aceite 35: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2771: Axioma 35: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2772: Cerca 35: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2773: Projecao 35: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2774: 2.5D 35: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2775: 3D 35: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2776: Editor 35: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2777: Gameplay 35: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2778: Teste 35: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2779: Falha 35: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2780: Aceite 35: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2781: Axioma 35: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2782: Cerca 35: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2783: Projecao 35: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2784: 2.5D 35: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2785: 3D 35: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2786: Editor 35: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2787: Gameplay 35: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2788: Teste 35: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2789: Falha 35: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2790: Aceite 35: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2791: Axioma 35: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2792: Cerca 35: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2793: Projecao 35: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2794: 2.5D 35: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2795: 3D 35: escala uniforme prova volume real e impede escalas independentes.
Linha 2796: Editor 35: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2797: Gameplay 35: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2798: Teste 35: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2799: Falha 35: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2800: Aceite 35: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2801: Axioma 35: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2802: Cerca 35: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2803: Projecao 35: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2804: 2.5D 35: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2805: 3D 35: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2806: Editor 35: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2807: Gameplay 35: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2808: Teste 35: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2809: Falha 35: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2810: Aceite 35: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2811: Axioma 35: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2812: Cerca 35: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2813: Projecao 35: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2814: 2.5D 35: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2815: 3D 35: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2816: Editor 35: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2817: Gameplay 35: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2818: Teste 35: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2819: Falha 35: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2820: Aceite 35: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2821: Axioma 36: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2822: Cerca 36: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2823: Projecao 36: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2824: 2.5D 36: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2825: 3D 36: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2826: Editor 36: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2827: Gameplay 36: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2828: Teste 36: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2829: Falha 36: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2830: Aceite 36: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2831: Axioma 36: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2832: Cerca 36: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2833: Projecao 36: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2834: 2.5D 36: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2835: 3D 36: y representa altura prova volume real e impede escalas independentes.
Linha 2836: Editor 36: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2837: Gameplay 36: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2838: Teste 36: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2839: Falha 36: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2840: Aceite 36: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2841: Axioma 36: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2842: Cerca 36: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2843: Projecao 36: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2844: 2.5D 36: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2845: 3D 36: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2846: Editor 36: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2847: Gameplay 36: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2848: Teste 36: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2849: Falha 36: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2850: Aceite 36: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2851: Axioma 36: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2852: Cerca 36: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2853: Projecao 36: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2854: 2.5D 36: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2855: 3D 36: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2856: Editor 36: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2857: Gameplay 36: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2858: Teste 36: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2859: Falha 36: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2860: Aceite 36: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2861: Axioma 36: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2862: Cerca 36: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2863: Projecao 36: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2864: 2.5D 36: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2865: 3D 36: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2866: Editor 36: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2867: Gameplay 36: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2868: Teste 36: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2869: Falha 36: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2870: Aceite 36: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2871: Axioma 36: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2872: Cerca 36: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2873: Projecao 36: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2874: 2.5D 36: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2875: 3D 36: escala uniforme prova volume real e impede escalas independentes.
Linha 2876: Editor 36: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2877: Gameplay 36: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2878: Teste 36: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2879: Falha 36: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2880: Aceite 36: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2881: Axioma 36: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2882: Cerca 36: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2883: Projecao 36: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2884: 2.5D 36: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2885: 3D 36: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2886: Editor 36: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2887: Gameplay 36: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2888: Teste 36: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2889: Falha 36: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2890: Aceite 36: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2891: Axioma 36: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2892: Cerca 36: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2893: Projecao 36: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2894: 2.5D 36: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2895: 3D 36: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2896: Editor 36: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2897: Gameplay 36: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2898: Teste 36: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2899: Falha 36: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2900: Aceite 36: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2901: Axioma 37: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2902: Cerca 37: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2903: Projecao 37: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2904: 2.5D 37: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2905: 3D 37: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2906: Editor 37: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2907: Gameplay 37: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2908: Teste 37: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2909: Falha 37: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2910: Aceite 37: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2911: Axioma 37: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2912: Cerca 37: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2913: Projecao 37: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2914: 2.5D 37: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2915: 3D 37: y representa altura prova volume real e impede escalas independentes.
Linha 2916: Editor 37: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2917: Gameplay 37: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2918: Teste 37: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2919: Falha 37: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2920: Aceite 37: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 2921: Axioma 37: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 2922: Cerca 37: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2923: Projecao 37: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2924: 2.5D 37: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2925: 3D 37: volume deriva do shape prova volume real e impede escalas independentes.
Linha 2926: Editor 37: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 2927: Gameplay 37: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2928: Teste 37: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2929: Falha 37: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 2930: Aceite 37: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 2931: Axioma 37: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 2932: Cerca 37: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2933: Projecao 37: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2934: 2.5D 37: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2935: 3D 37: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 2936: Editor 37: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 2937: Gameplay 37: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2938: Teste 37: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2939: Falha 37: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 2940: Aceite 37: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 2941: Axioma 37: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 2942: Cerca 37: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2943: Projecao 37: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2944: 2.5D 37: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2945: 3D 37: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 2946: Editor 37: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 2947: Gameplay 37: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2948: Teste 37: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2949: Falha 37: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 2950: Aceite 37: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 2951: Axioma 37: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 2952: Cerca 37: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2953: Projecao 37: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2954: 2.5D 37: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2955: 3D 37: escala uniforme prova volume real e impede escalas independentes.
Linha 2956: Editor 37: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 2957: Gameplay 37: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2958: Teste 37: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2959: Falha 37: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 2960: Aceite 37: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 2961: Axioma 37: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 2962: Cerca 37: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2963: Projecao 37: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2964: 2.5D 37: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2965: 3D 37: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 2966: Editor 37: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 2967: Gameplay 37: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2968: Teste 37: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2969: Falha 37: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 2970: Aceite 37: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 2971: Axioma 37: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 2972: Cerca 37: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2973: Projecao 37: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2974: 2.5D 37: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2975: 3D 37: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 2976: Editor 37: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 2977: Gameplay 37: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2978: Teste 37: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2979: Falha 37: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 2980: Aceite 37: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 2981: Axioma 38: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 2982: Cerca 38: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2983: Projecao 38: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2984: 2.5D 38: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2985: 3D 38: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 2986: Editor 38: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 2987: Gameplay 38: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2988: Teste 38: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2989: Falha 38: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 2990: Aceite 38: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 2991: Axioma 38: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 2992: Cerca 38: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 2993: Projecao 38: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 2994: 2.5D 38: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 2995: 3D 38: y representa altura prova volume real e impede escalas independentes.
Linha 2996: Editor 38: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 2997: Gameplay 38: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 2998: Teste 38: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 2999: Falha 38: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3000: Aceite 38: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3001: Axioma 38: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3002: Cerca 38: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3003: Projecao 38: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3004: 2.5D 38: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3005: 3D 38: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3006: Editor 38: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3007: Gameplay 38: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3008: Teste 38: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3009: Falha 38: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3010: Aceite 38: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3011: Axioma 38: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3012: Cerca 38: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3013: Projecao 38: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3014: 2.5D 38: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3015: 3D 38: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3016: Editor 38: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3017: Gameplay 38: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3018: Teste 38: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3019: Falha 38: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3020: Aceite 38: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3021: Axioma 38: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3022: Cerca 38: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3023: Projecao 38: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3024: 2.5D 38: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3025: 3D 38: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3026: Editor 38: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3027: Gameplay 38: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3028: Teste 38: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3029: Falha 38: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3030: Aceite 38: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3031: Axioma 38: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3032: Cerca 38: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3033: Projecao 38: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3034: 2.5D 38: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3035: 3D 38: escala uniforme prova volume real e impede escalas independentes.
Linha 3036: Editor 38: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3037: Gameplay 38: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3038: Teste 38: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3039: Falha 38: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3040: Aceite 38: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3041: Axioma 38: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3042: Cerca 38: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3043: Projecao 38: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3044: 2.5D 38: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3045: 3D 38: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3046: Editor 38: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3047: Gameplay 38: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3048: Teste 38: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3049: Falha 38: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3050: Aceite 38: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3051: Axioma 38: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3052: Cerca 38: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3053: Projecao 38: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3054: 2.5D 38: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3055: 3D 38: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3056: Editor 38: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3057: Gameplay 38: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3058: Teste 38: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3059: Falha 38: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3060: Aceite 38: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3061: Axioma 39: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3062: Cerca 39: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3063: Projecao 39: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3064: 2.5D 39: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3065: 3D 39: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3066: Editor 39: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3067: Gameplay 39: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3068: Teste 39: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3069: Falha 39: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3070: Aceite 39: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3071: Axioma 39: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3072: Cerca 39: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3073: Projecao 39: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3074: 2.5D 39: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3075: 3D 39: y representa altura prova volume real e impede escalas independentes.
Linha 3076: Editor 39: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3077: Gameplay 39: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3078: Teste 39: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3079: Falha 39: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3080: Aceite 39: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3081: Axioma 39: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3082: Cerca 39: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3083: Projecao 39: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3084: 2.5D 39: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3085: 3D 39: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3086: Editor 39: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3087: Gameplay 39: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3088: Teste 39: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3089: Falha 39: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3090: Aceite 39: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3091: Axioma 39: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3092: Cerca 39: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3093: Projecao 39: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3094: 2.5D 39: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3095: 3D 39: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3096: Editor 39: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3097: Gameplay 39: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3098: Teste 39: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3099: Falha 39: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3100: Aceite 39: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3101: Axioma 39: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3102: Cerca 39: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3103: Projecao 39: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3104: 2.5D 39: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3105: 3D 39: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3106: Editor 39: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3107: Gameplay 39: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3108: Teste 39: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3109: Falha 39: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3110: Aceite 39: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3111: Axioma 39: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3112: Cerca 39: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3113: Projecao 39: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3114: 2.5D 39: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3115: 3D 39: escala uniforme prova volume real e impede escalas independentes.
Linha 3116: Editor 39: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3117: Gameplay 39: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3118: Teste 39: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3119: Falha 39: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3120: Aceite 39: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3121: Axioma 39: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3122: Cerca 39: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3123: Projecao 39: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3124: 2.5D 39: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3125: 3D 39: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3126: Editor 39: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3127: Gameplay 39: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3128: Teste 39: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3129: Falha 39: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3130: Aceite 39: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3131: Axioma 39: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3132: Cerca 39: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3133: Projecao 39: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3134: 2.5D 39: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3135: 3D 39: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3136: Editor 39: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3137: Gameplay 39: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3138: Teste 39: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3139: Falha 39: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3140: Aceite 39: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3141: Axioma 40: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3142: Cerca 40: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3143: Projecao 40: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3144: 2.5D 40: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3145: 3D 40: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3146: Editor 40: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3147: Gameplay 40: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3148: Teste 40: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3149: Falha 40: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3150: Aceite 40: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3151: Axioma 40: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3152: Cerca 40: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3153: Projecao 40: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3154: 2.5D 40: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3155: 3D 40: y representa altura prova volume real e impede escalas independentes.
Linha 3156: Editor 40: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3157: Gameplay 40: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3158: Teste 40: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3159: Falha 40: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3160: Aceite 40: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3161: Axioma 40: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3162: Cerca 40: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3163: Projecao 40: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3164: 2.5D 40: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3165: 3D 40: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3166: Editor 40: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3167: Gameplay 40: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3168: Teste 40: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3169: Falha 40: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3170: Aceite 40: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3171: Axioma 40: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3172: Cerca 40: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3173: Projecao 40: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3174: 2.5D 40: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3175: 3D 40: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3176: Editor 40: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3177: Gameplay 40: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3178: Teste 40: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3179: Falha 40: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3180: Aceite 40: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3181: Axioma 40: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3182: Cerca 40: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3183: Projecao 40: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3184: 2.5D 40: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3185: 3D 40: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3186: Editor 40: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3187: Gameplay 40: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3188: Teste 40: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3189: Falha 40: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3190: Aceite 40: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3191: Axioma 40: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3192: Cerca 40: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3193: Projecao 40: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3194: 2.5D 40: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3195: 3D 40: escala uniforme prova volume real e impede escalas independentes.
Linha 3196: Editor 40: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3197: Gameplay 40: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3198: Teste 40: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3199: Falha 40: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3200: Aceite 40: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3201: Axioma 40: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3202: Cerca 40: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3203: Projecao 40: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3204: 2.5D 40: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3205: 3D 40: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3206: Editor 40: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3207: Gameplay 40: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3208: Teste 40: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3209: Falha 40: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3210: Aceite 40: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3211: Axioma 40: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3212: Cerca 40: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3213: Projecao 40: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3214: 2.5D 40: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3215: 3D 40: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3216: Editor 40: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3217: Gameplay 40: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3218: Teste 40: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3219: Falha 40: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3220: Aceite 40: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3221: Axioma 41: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3222: Cerca 41: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3223: Projecao 41: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3224: 2.5D 41: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3225: 3D 41: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3226: Editor 41: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3227: Gameplay 41: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3228: Teste 41: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3229: Falha 41: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3230: Aceite 41: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3231: Axioma 41: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3232: Cerca 41: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3233: Projecao 41: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3234: 2.5D 41: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3235: 3D 41: y representa altura prova volume real e impede escalas independentes.
Linha 3236: Editor 41: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3237: Gameplay 41: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3238: Teste 41: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3239: Falha 41: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3240: Aceite 41: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3241: Axioma 41: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3242: Cerca 41: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3243: Projecao 41: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3244: 2.5D 41: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3245: 3D 41: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3246: Editor 41: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3247: Gameplay 41: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3248: Teste 41: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3249: Falha 41: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3250: Aceite 41: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3251: Axioma 41: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3252: Cerca 41: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3253: Projecao 41: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3254: 2.5D 41: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3255: 3D 41: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3256: Editor 41: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3257: Gameplay 41: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3258: Teste 41: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3259: Falha 41: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3260: Aceite 41: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3261: Axioma 41: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3262: Cerca 41: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3263: Projecao 41: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3264: 2.5D 41: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3265: 3D 41: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3266: Editor 41: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3267: Gameplay 41: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3268: Teste 41: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3269: Falha 41: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3270: Aceite 41: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3271: Axioma 41: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3272: Cerca 41: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3273: Projecao 41: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3274: 2.5D 41: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3275: 3D 41: escala uniforme prova volume real e impede escalas independentes.
Linha 3276: Editor 41: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3277: Gameplay 41: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3278: Teste 41: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3279: Falha 41: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3280: Aceite 41: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3281: Axioma 41: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3282: Cerca 41: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3283: Projecao 41: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3284: 2.5D 41: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3285: 3D 41: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3286: Editor 41: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3287: Gameplay 41: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3288: Teste 41: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3289: Falha 41: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3290: Aceite 41: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3291: Axioma 41: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3292: Cerca 41: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3293: Projecao 41: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3294: 2.5D 41: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3295: 3D 41: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3296: Editor 41: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3297: Gameplay 41: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3298: Teste 41: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3299: Falha 41: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3300: Aceite 41: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3301: Axioma 42: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3302: Cerca 42: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3303: Projecao 42: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3304: 2.5D 42: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3305: 3D 42: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3306: Editor 42: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3307: Gameplay 42: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3308: Teste 42: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3309: Falha 42: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3310: Aceite 42: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3311: Axioma 42: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3312: Cerca 42: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3313: Projecao 42: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3314: 2.5D 42: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3315: 3D 42: y representa altura prova volume real e impede escalas independentes.
Linha 3316: Editor 42: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3317: Gameplay 42: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3318: Teste 42: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3319: Falha 42: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3320: Aceite 42: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3321: Axioma 42: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3322: Cerca 42: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3323: Projecao 42: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3324: 2.5D 42: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3325: 3D 42: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3326: Editor 42: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3327: Gameplay 42: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3328: Teste 42: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3329: Falha 42: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3330: Aceite 42: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3331: Axioma 42: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3332: Cerca 42: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3333: Projecao 42: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3334: 2.5D 42: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3335: 3D 42: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3336: Editor 42: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3337: Gameplay 42: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3338: Teste 42: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3339: Falha 42: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3340: Aceite 42: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3341: Axioma 42: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3342: Cerca 42: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3343: Projecao 42: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3344: 2.5D 42: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3345: 3D 42: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3346: Editor 42: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3347: Gameplay 42: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3348: Teste 42: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3349: Falha 42: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3350: Aceite 42: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3351: Axioma 42: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3352: Cerca 42: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3353: Projecao 42: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3354: 2.5D 42: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3355: 3D 42: escala uniforme prova volume real e impede escalas independentes.
Linha 3356: Editor 42: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3357: Gameplay 42: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3358: Teste 42: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3359: Falha 42: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3360: Aceite 42: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3361: Axioma 42: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3362: Cerca 42: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3363: Projecao 42: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3364: 2.5D 42: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3365: 3D 42: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3366: Editor 42: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3367: Gameplay 42: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3368: Teste 42: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3369: Falha 42: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3370: Aceite 42: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3371: Axioma 42: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3372: Cerca 42: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3373: Projecao 42: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3374: 2.5D 42: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3375: 3D 42: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3376: Editor 42: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3377: Gameplay 42: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3378: Teste 42: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3379: Falha 42: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3380: Aceite 42: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3381: Axioma 43: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3382: Cerca 43: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3383: Projecao 43: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3384: 2.5D 43: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3385: 3D 43: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3386: Editor 43: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3387: Gameplay 43: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3388: Teste 43: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3389: Falha 43: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3390: Aceite 43: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3391: Axioma 43: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3392: Cerca 43: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3393: Projecao 43: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3394: 2.5D 43: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3395: 3D 43: y representa altura prova volume real e impede escalas independentes.
Linha 3396: Editor 43: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3397: Gameplay 43: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3398: Teste 43: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3399: Falha 43: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3400: Aceite 43: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3401: Axioma 43: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3402: Cerca 43: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3403: Projecao 43: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3404: 2.5D 43: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3405: 3D 43: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3406: Editor 43: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3407: Gameplay 43: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3408: Teste 43: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3409: Falha 43: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3410: Aceite 43: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3411: Axioma 43: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3412: Cerca 43: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3413: Projecao 43: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3414: 2.5D 43: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3415: 3D 43: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3416: Editor 43: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3417: Gameplay 43: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3418: Teste 43: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3419: Falha 43: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3420: Aceite 43: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3421: Axioma 43: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3422: Cerca 43: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3423: Projecao 43: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3424: 2.5D 43: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3425: 3D 43: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3426: Editor 43: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3427: Gameplay 43: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3428: Teste 43: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3429: Falha 43: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3430: Aceite 43: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3431: Axioma 43: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3432: Cerca 43: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3433: Projecao 43: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3434: 2.5D 43: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3435: 3D 43: escala uniforme prova volume real e impede escalas independentes.
Linha 3436: Editor 43: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3437: Gameplay 43: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3438: Teste 43: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3439: Falha 43: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3440: Aceite 43: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3441: Axioma 43: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3442: Cerca 43: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3443: Projecao 43: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3444: 2.5D 43: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3445: 3D 43: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3446: Editor 43: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3447: Gameplay 43: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3448: Teste 43: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3449: Falha 43: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3450: Aceite 43: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3451: Axioma 43: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3452: Cerca 43: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3453: Projecao 43: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3454: 2.5D 43: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3455: 3D 43: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3456: Editor 43: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3457: Gameplay 43: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3458: Teste 43: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3459: Falha 43: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3460: Aceite 43: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3461: Axioma 44: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3462: Cerca 44: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3463: Projecao 44: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3464: 2.5D 44: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3465: 3D 44: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3466: Editor 44: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3467: Gameplay 44: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3468: Teste 44: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3469: Falha 44: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3470: Aceite 44: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3471: Axioma 44: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3472: Cerca 44: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3473: Projecao 44: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3474: 2.5D 44: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3475: 3D 44: y representa altura prova volume real e impede escalas independentes.
Linha 3476: Editor 44: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3477: Gameplay 44: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3478: Teste 44: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3479: Falha 44: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3480: Aceite 44: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3481: Axioma 44: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3482: Cerca 44: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3483: Projecao 44: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3484: 2.5D 44: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3485: 3D 44: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3486: Editor 44: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3487: Gameplay 44: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3488: Teste 44: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3489: Falha 44: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3490: Aceite 44: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3491: Axioma 44: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3492: Cerca 44: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3493: Projecao 44: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3494: 2.5D 44: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3495: 3D 44: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3496: Editor 44: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3497: Gameplay 44: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3498: Teste 44: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3499: Falha 44: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3500: Aceite 44: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3501: Axioma 44: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3502: Cerca 44: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3503: Projecao 44: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3504: 2.5D 44: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3505: 3D 44: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3506: Editor 44: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3507: Gameplay 44: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3508: Teste 44: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3509: Falha 44: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3510: Aceite 44: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3511: Axioma 44: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3512: Cerca 44: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3513: Projecao 44: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3514: 2.5D 44: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3515: 3D 44: escala uniforme prova volume real e impede escalas independentes.
Linha 3516: Editor 44: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3517: Gameplay 44: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3518: Teste 44: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3519: Falha 44: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3520: Aceite 44: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3521: Axioma 44: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3522: Cerca 44: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3523: Projecao 44: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3524: 2.5D 44: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3525: 3D 44: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3526: Editor 44: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3527: Gameplay 44: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3528: Teste 44: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3529: Falha 44: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3530: Aceite 44: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3531: Axioma 44: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3532: Cerca 44: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3533: Projecao 44: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3534: 2.5D 44: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3535: 3D 44: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3536: Editor 44: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3537: Gameplay 44: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3538: Teste 44: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3539: Falha 44: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3540: Aceite 44: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3541: Axioma 45: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3542: Cerca 45: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3543: Projecao 45: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3544: 2.5D 45: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3545: 3D 45: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3546: Editor 45: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3547: Gameplay 45: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3548: Teste 45: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3549: Falha 45: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3550: Aceite 45: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3551: Axioma 45: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3552: Cerca 45: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3553: Projecao 45: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3554: 2.5D 45: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3555: 3D 45: y representa altura prova volume real e impede escalas independentes.
Linha 3556: Editor 45: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3557: Gameplay 45: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3558: Teste 45: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3559: Falha 45: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3560: Aceite 45: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3561: Axioma 45: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3562: Cerca 45: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3563: Projecao 45: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3564: 2.5D 45: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3565: 3D 45: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3566: Editor 45: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3567: Gameplay 45: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3568: Teste 45: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3569: Falha 45: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3570: Aceite 45: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3571: Axioma 45: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3572: Cerca 45: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3573: Projecao 45: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3574: 2.5D 45: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3575: 3D 45: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3576: Editor 45: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3577: Gameplay 45: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3578: Teste 45: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3579: Falha 45: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3580: Aceite 45: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3581: Axioma 45: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3582: Cerca 45: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3583: Projecao 45: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3584: 2.5D 45: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3585: 3D 45: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3586: Editor 45: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3587: Gameplay 45: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3588: Teste 45: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3589: Falha 45: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3590: Aceite 45: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3591: Axioma 45: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3592: Cerca 45: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3593: Projecao 45: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3594: 2.5D 45: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3595: 3D 45: escala uniforme prova volume real e impede escalas independentes.
Linha 3596: Editor 45: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3597: Gameplay 45: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3598: Teste 45: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3599: Falha 45: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3600: Aceite 45: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3601: Axioma 45: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3602: Cerca 45: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3603: Projecao 45: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3604: 2.5D 45: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3605: 3D 45: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3606: Editor 45: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3607: Gameplay 45: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3608: Teste 45: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3609: Falha 45: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3610: Aceite 45: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3611: Axioma 45: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3612: Cerca 45: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3613: Projecao 45: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3614: 2.5D 45: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3615: 3D 45: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3616: Editor 45: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3617: Gameplay 45: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3618: Teste 45: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3619: Falha 45: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3620: Aceite 45: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3621: Axioma 46: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3622: Cerca 46: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3623: Projecao 46: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3624: 2.5D 46: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3625: 3D 46: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3626: Editor 46: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3627: Gameplay 46: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3628: Teste 46: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3629: Falha 46: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3630: Aceite 46: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3631: Axioma 46: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3632: Cerca 46: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3633: Projecao 46: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3634: 2.5D 46: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3635: 3D 46: y representa altura prova volume real e impede escalas independentes.
Linha 3636: Editor 46: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3637: Gameplay 46: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3638: Teste 46: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3639: Falha 46: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3640: Aceite 46: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3641: Axioma 46: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3642: Cerca 46: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3643: Projecao 46: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3644: 2.5D 46: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3645: 3D 46: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3646: Editor 46: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3647: Gameplay 46: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3648: Teste 46: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3649: Falha 46: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3650: Aceite 46: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3651: Axioma 46: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3652: Cerca 46: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3653: Projecao 46: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3654: 2.5D 46: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3655: 3D 46: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3656: Editor 46: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3657: Gameplay 46: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3658: Teste 46: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3659: Falha 46: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3660: Aceite 46: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3661: Axioma 46: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3662: Cerca 46: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3663: Projecao 46: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3664: 2.5D 46: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3665: 3D 46: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3666: Editor 46: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3667: Gameplay 46: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3668: Teste 46: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3669: Falha 46: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3670: Aceite 46: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3671: Axioma 46: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3672: Cerca 46: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3673: Projecao 46: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3674: 2.5D 46: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3675: 3D 46: escala uniforme prova volume real e impede escalas independentes.
Linha 3676: Editor 46: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3677: Gameplay 46: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3678: Teste 46: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3679: Falha 46: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3680: Aceite 46: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3681: Axioma 46: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3682: Cerca 46: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3683: Projecao 46: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3684: 2.5D 46: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3685: 3D 46: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3686: Editor 46: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3687: Gameplay 46: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3688: Teste 46: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3689: Falha 46: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3690: Aceite 46: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3691: Axioma 46: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3692: Cerca 46: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3693: Projecao 46: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3694: 2.5D 46: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3695: 3D 46: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3696: Editor 46: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3697: Gameplay 46: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3698: Teste 46: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3699: Falha 46: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3700: Aceite 46: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3701: Axioma 47: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3702: Cerca 47: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3703: Projecao 47: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3704: 2.5D 47: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3705: 3D 47: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3706: Editor 47: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3707: Gameplay 47: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3708: Teste 47: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3709: Falha 47: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3710: Aceite 47: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3711: Axioma 47: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3712: Cerca 47: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3713: Projecao 47: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3714: 2.5D 47: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3715: 3D 47: y representa altura prova volume real e impede escalas independentes.
Linha 3716: Editor 47: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3717: Gameplay 47: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3718: Teste 47: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3719: Falha 47: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3720: Aceite 47: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3721: Axioma 47: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3722: Cerca 47: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3723: Projecao 47: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3724: 2.5D 47: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3725: 3D 47: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3726: Editor 47: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3727: Gameplay 47: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3728: Teste 47: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3729: Falha 47: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3730: Aceite 47: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3731: Axioma 47: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3732: Cerca 47: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3733: Projecao 47: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3734: 2.5D 47: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3735: 3D 47: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3736: Editor 47: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3737: Gameplay 47: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3738: Teste 47: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3739: Falha 47: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3740: Aceite 47: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3741: Axioma 47: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3742: Cerca 47: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3743: Projecao 47: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3744: 2.5D 47: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3745: 3D 47: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3746: Editor 47: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3747: Gameplay 47: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3748: Teste 47: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3749: Falha 47: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3750: Aceite 47: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3751: Axioma 47: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3752: Cerca 47: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3753: Projecao 47: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3754: 2.5D 47: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3755: 3D 47: escala uniforme prova volume real e impede escalas independentes.
Linha 3756: Editor 47: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3757: Gameplay 47: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3758: Teste 47: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3759: Falha 47: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3760: Aceite 47: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3761: Axioma 47: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3762: Cerca 47: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3763: Projecao 47: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3764: 2.5D 47: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3765: 3D 47: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3766: Editor 47: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3767: Gameplay 47: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3768: Teste 47: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3769: Falha 47: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3770: Aceite 47: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3771: Axioma 47: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3772: Cerca 47: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3773: Projecao 47: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3774: 2.5D 47: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3775: 3D 47: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3776: Editor 47: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3777: Gameplay 47: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3778: Teste 47: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3779: Falha 47: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3780: Aceite 47: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3781: Axioma 48: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3782: Cerca 48: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3783: Projecao 48: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3784: 2.5D 48: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3785: 3D 48: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3786: Editor 48: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3787: Gameplay 48: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3788: Teste 48: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3789: Falha 48: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3790: Aceite 48: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3791: Axioma 48: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3792: Cerca 48: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3793: Projecao 48: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3794: 2.5D 48: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3795: 3D 48: y representa altura prova volume real e impede escalas independentes.
Linha 3796: Editor 48: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3797: Gameplay 48: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3798: Teste 48: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3799: Falha 48: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3800: Aceite 48: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3801: Axioma 48: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3802: Cerca 48: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3803: Projecao 48: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3804: 2.5D 48: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3805: 3D 48: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3806: Editor 48: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3807: Gameplay 48: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3808: Teste 48: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3809: Falha 48: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3810: Aceite 48: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3811: Axioma 48: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3812: Cerca 48: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3813: Projecao 48: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3814: 2.5D 48: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3815: 3D 48: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3816: Editor 48: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3817: Gameplay 48: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3818: Teste 48: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3819: Falha 48: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3820: Aceite 48: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3821: Axioma 48: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3822: Cerca 48: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3823: Projecao 48: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3824: 2.5D 48: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3825: 3D 48: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3826: Editor 48: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3827: Gameplay 48: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3828: Teste 48: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3829: Falha 48: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3830: Aceite 48: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3831: Axioma 48: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3832: Cerca 48: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3833: Projecao 48: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3834: 2.5D 48: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3835: 3D 48: escala uniforme prova volume real e impede escalas independentes.
Linha 3836: Editor 48: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3837: Gameplay 48: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3838: Teste 48: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3839: Falha 48: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3840: Aceite 48: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3841: Axioma 48: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3842: Cerca 48: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3843: Projecao 48: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3844: 2.5D 48: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3845: 3D 48: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3846: Editor 48: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3847: Gameplay 48: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3848: Teste 48: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3849: Falha 48: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3850: Aceite 48: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3851: Axioma 48: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3852: Cerca 48: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3853: Projecao 48: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3854: 2.5D 48: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3855: 3D 48: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3856: Editor 48: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3857: Gameplay 48: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3858: Teste 48: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3859: Falha 48: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3860: Aceite 48: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3861: Axioma 49: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3862: Cerca 49: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3863: Projecao 49: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3864: 2.5D 49: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3865: 3D 49: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3866: Editor 49: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3867: Gameplay 49: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3868: Teste 49: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3869: Falha 49: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3870: Aceite 49: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3871: Axioma 49: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3872: Cerca 49: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3873: Projecao 49: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3874: 2.5D 49: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3875: 3D 49: y representa altura prova volume real e impede escalas independentes.
Linha 3876: Editor 49: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3877: Gameplay 49: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3878: Teste 49: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3879: Falha 49: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3880: Aceite 49: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3881: Axioma 49: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3882: Cerca 49: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3883: Projecao 49: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3884: 2.5D 49: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3885: 3D 49: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3886: Editor 49: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3887: Gameplay 49: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3888: Teste 49: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3889: Falha 49: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3890: Aceite 49: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3891: Axioma 49: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3892: Cerca 49: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3893: Projecao 49: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3894: 2.5D 49: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3895: 3D 49: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3896: Editor 49: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3897: Gameplay 49: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3898: Teste 49: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3899: Falha 49: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3900: Aceite 49: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3901: Axioma 49: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3902: Cerca 49: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3903: Projecao 49: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3904: 2.5D 49: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3905: 3D 49: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3906: Editor 49: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3907: Gameplay 49: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3908: Teste 49: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3909: Falha 49: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3910: Aceite 49: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3911: Axioma 49: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3912: Cerca 49: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3913: Projecao 49: camera enquadra o mundo garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3914: 2.5D 49: torre encaixa no socket protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3915: 3D 49: escala uniforme prova volume real e impede escalas independentes.
Linha 3916: Editor 49: rotacionar por eixo canonico torna a base reproduzivel, auditavel e independente do desenho.
Linha 3917: Gameplay 49: portao muda bloqueio conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3918: Teste 49: sem constante duplicada deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3919: Falha 49: responsividade que escala objeto quebra universo e sinal de que renderer e simulacao voltaram a divergir.
Linha 3920: Aceite 49: 3D confirma volume e evidencia de que a POC preserva dimensao entre modos.
Linha 3921: Axioma 49: 3D como verificador deve ser tratado como contrato permanente da POC.
Linha 3922: Cerca 49: portao como segmento atravessavel descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3923: Projecao 49: pivots estaveis garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3924: 2.5D 49: boss respeita bounds protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3925: 3D 49: camera nao recalcula objetos prova volume real e impede escalas independentes.
Linha 3926: Editor 49: snap por conexao torna a base reproduzivel, auditavel e independente do desenho.
Linha 3927: Gameplay 49: torre nao muda cerca conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3928: Teste 49: screenshot comparativo deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3929: Falha 49: boss atravessando cerca invalida shape e sinal de que renderer e simulacao voltaram a divergir.
Linha 3930: Aceite 49: 2D confirma planta e evidencia de que a POC preserva dimensao entre modos.
Linha 3931: Axioma 49: 2D como planta tecnica deve ser tratado como contrato permanente da POC.
Linha 3932: Cerca 49: canto como dois palitos conectados descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3933: Projecao 49: origem documentada garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3934: 2.5D 49: inimigos consultam shape protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3935: 3D 49: Cerca TL nao vira painel prova volume real e impede escalas independentes.
Linha 3936: Editor 49: debug sempre visivel torna a base reproduzivel, auditavel e independente do desenho.
Linha 3937: Gameplay 49: dano usa alvo real conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3938: Teste 49: mobile altera camera deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3939: Falha 49: Cerca TL sem socket invalida conceito e sinal de que renderer e simulacao voltaram a divergir.
Linha 3940: Aceite 49: 2.5D confirma leitura e evidencia de que a POC preserva dimensao entre modos.
Linha 3941: Axioma 50: unidade de mundo unica deve ser tratado como contrato permanente da POC.
Linha 3942: Cerca 50: endpoint A e endpoint B descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3943: Projecao 50: cell to world por matriz garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3944: 2.5D 50: ordenacao por profundidade protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3945: 3D 50: x e z vindos do mundo prova volume real e impede escalas independentes.
Linha 3946: Editor 50: salvar geometria pura torna a base reproduzivel, auditavel e independente do desenho.
Linha 3947: Gameplay 50: personagem com capsula conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3948: Teste 50: mesmo tamanho nos tres modos deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3949: Falha 50: placa gigante denuncia altura errada e sinal de que renderer e simulacao voltaram a divergir.
Linha 3950: Aceite 50: base salva reabre igual e evidencia de que a POC preserva dimensao entre modos.
Linha 3951: Axioma 50: shape canonico antes do render deve ser tratado como contrato permanente da POC.
Linha 3952: Cerca 50: capsula horizontal descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3953: Projecao 50: world to cell por matriz inversa garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3954: 2.5D 50: sombra como efeito visual protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3955: 3D 50: y representa altura prova volume real e impede escalas independentes.
Linha 3956: Editor 50: validar sockets torna a base reproduzivel, auditavel e independente do desenho.
Linha 3957: Gameplay 50: inimigo com circulo conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3958: Teste 50: Cerca TL comparada em 2.5D e 3D deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3959: Falha 50: sprite maior que collider denuncia contaminacao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3960: Aceite 50: fence conecta ponta com ponta e evidencia de que a POC preserva dimensao entre modos.
Linha 3961: Axioma 50: responsividade por camera deve ser tratado como contrato permanente da POC.
Linha 3962: Cerca 50: espessura pequena descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3963: Projecao 50: roundtrip obrigatorio garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3964: 2.5D 50: altura nao altera footprint protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3965: 3D 50: volume deriva do shape prova volume real e impede escalas independentes.
Linha 3966: Editor 50: mostrar endpoints torna a base reproduzivel, auditavel e independente do desenho.
Linha 3967: Gameplay 50: boss com shape composto conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3968: Teste 50: roundtrip de coordenadas deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3969: Falha 50: 3D com escala arbitraria invalida a prova e sinal de que renderer e simulacao voltaram a divergir.
Linha 3970: Aceite 50: TL aceita torre sem crescer e evidencia de que a POC preserva dimensao entre modos.
Linha 3971: Axioma 50: renderer como adapter deve ser tratado como contrato permanente da POC.
Linha 3972: Cerca 50: altura visual separada descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3973: Projecao 50: zoom nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3974: 2.5D 50: posts e trilhos legiveis protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3975: 3D 50: socket vira ponto 3D prova volume real e impede escalas independentes.
Linha 3976: Editor 50: mostrar bounds torna a base reproduzivel, auditavel e independente do desenho.
Linha 3977: Gameplay 50: ataque por distancia ate forma conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3978: Teste 50: bounds iguais por tolerancia deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3979: Falha 50: 2.5D sem shape invalida colisao e sinal de que renderer e simulacao voltaram a divergir.
Linha 3980: Aceite 50: portao abre passagem sem mudar tamanho e evidencia de que a POC preserva dimensao entre modos.
Linha 3981: Axioma 50: simulacao como fonte da verdade deve ser tratado como contrato permanente da POC.
Linha 3982: Cerca 50: socket de conexao descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3983: Projecao 50: viewport nao muda dimensao garante que 2D, 2.5D e 3D leiam a mesma posicao canonica.
Linha 3984: 2.5D 50: Cerca TL alta e estreita protege a leitura primaria sem adulterar tamanho, forma ou collider.
Linha 3985: 3D 50: collider nao e mesh decorativa prova volume real e impede escalas independentes.
Linha 3986: Editor 50: apagar sem deixar lixo torna a base reproduzivel, auditavel e independente do desenho.
Linha 3987: Gameplay 50: base composta por segmentos conecta personagem, inimigos, base e boss ao mesmo kernel geometrico.
Linha 3988: Teste 50: ponto mais proximo correto deve aparecer como criterio objetivo antes da POC ser considerada valida.
Linha 3989: Falha 50: editor que salva pixels invalida futuro e sinal de que renderer e simulacao voltaram a divergir.
Linha 3990: Aceite 50: boss colide com cerca fechada e evidencia de que a POC preserva dimensao entre modos.
Linha 3991: Axioma 50: 2.5D primario deve ser tratado como contrato permanente da POC.
Linha 3992: Cerca 50: socket superior na Cerca TL descreve o palito conectavel e evita que a cerca vire tile decorativo.
Linha 3993: O prompt principal deve ser usado como contrato de construcao da nova POC.
Linha 3994: Este documento deve acompanhar qualquer agente, pessoa ou equipe que implemente a prova.
Linha 3995: O projeto novo deve recusar atalhos visuais que escondam divergencia de escala.
Linha 3996: A Cerca TL deve ser o teste de stress porque mistura altura, conexao e suporte de torre.
Linha 3997: A validacao final deve comparar 2D, 2.5D e 3D lado a lado com bounds e sockets visiveis.
Linha 3998: Se o mesmo shape nao explicar editor, simulacao e renderer, a implementacao ainda nao esta correta.
Linha 3999: A prova termina quando o mundo responde ao tamanho real, nao ao desenho do frame atual.
Linha 4000: Vamos pra cima: um universo geometrico puro nasce de uma regra unica e tres projecoes fieis.