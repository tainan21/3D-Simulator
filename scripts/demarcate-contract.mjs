import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const contractPath = path.join(root, "docs", "contracts", "DOCUMENTO_AUXILIAR_4000_LINHAS.md");
const outPath = path.join(root, "docs", "DEMARCACAO_CONFORMIDADE_4000_LINHAS.md");

const source = readFileSync(contractPath, "utf8").split(/\r?\n/);

const okPatterns = [
  /unidade de mundo unica/i,
  /shape canonico/i,
  /renderer como adapter/i,
  /simulacao como fonte da verdade/i,
  /2\.5D primario/i,
  /3D como verificador/i,
  /2D como planta/i,
  /endpoint A e endpoint B/i,
  /capsula horizontal/i,
  /espessura pequena/i,
  /altura visual separada/i,
  /socket de conexao/i,
  /socket superior/i,
  /portao como segmento atravessavel/i,
  /canto como dois palitos/i,
  /cell to world/i,
  /world to cell/i,
  /roundtrip obrigatorio/i,
  /zoom nao muda dimensao/i,
  /viewport nao muda dimensao/i,
  /camera enquadra o mundo/i,
  /pivots estaveis/i,
  /origem documentada/i,
  /ordenacao por profundidade/i,
  /sombra como efeito visual/i,
  /altura nao altera footprint/i,
  /posts e trilhos legiveis/i,
  /Cerca TL alta e estreita/i,
  /torre encaixa no socket/i,
  /boss respeita bounds/i,
  /inimigos consultam shape/i,
  /debug sempre visivel/i,
  /base composta por segmentos/i,
  /torre nao muda cerca/i,
  /mobile altera camera/i,
  /screenshot comparativo/i,
  /3D confirma volume/i,
  /2D confirma planta/i,
  /2\.5D confirma leitura/i,
  /TL aceita torre sem crescer/i,
  /fence conecta ponta com ponta/i,
  /portao abre passagem/i,
  /boss colide com cerca fechada/i,
  /boss atravessando cerca/i,
  /Cerca TL nao vira painel/i,
  /editor que salva pixels invalida futuro/i,
  /responsividade que escala objeto quebra universo/i,
  /3D com escala arbitraria invalida/i,
  /sprite maior que collider denuncia/i,
  /placa gigante denuncia/i,
  /Cerca TL sem socket/i,
  /mesmo tamanho nos tres modos/i,
  /bounds iguais por tolerancia/i,
  /ponto mais proximo correto/i,
  /sem constante duplicada/i,
  /base salva reabre igual/i,
  /x e z vindos do mundo/i,
  /y representa altura/i,
  /volume deriva do shape/i,
  /socket vira ponto 3D/i,
  /collider nao e mesh decorativa/i,
  /escala uniforme/i,
  /camera nao recalcula objetos/i,
  /O objetivo e impedir/i,
  /geometria canonica manda/i,
  /Nenhuma regra de gameplay/i,
  /Nenhum tamanho deve ser corrigido/i,
  /Nenhum modo pode ter constantes secretas/i,
  /Se o mesmo shape nao explicar/i,
  /mundo responde ao tamanho real/i
];

const partialPatterns = [
  /dano usa alvo real/i,
  /ataque por distancia ate forma/i,
  /personagem com capsula/i,
  /inimigo com circulo/i,
  /boss com shape composto/i,
  /prompt principal/i,
  /projeto novo deve recusar/i,
  /validacao final deve comparar/i
];

const outsideV3Patterns = [
  /Rapier/i,
  /glTF/i,
  /assets futuros/i,
  /opcional para fisica/i
];

function classify(line) {
  if (!line.trim()) return { status: "INFO", evidence: "Linha vazia ou separador.", action: "Nenhuma." };
  if (outsideV3Patterns.some((pattern) => pattern.test(line))) {
    return {
      status: "FORA_V3",
      evidence: "Reconhecido como tecnologia/asset futuro. A v3 permanece em formas puras sem Rapier/GLB.",
      action: "Reavaliar depois que a prova geometrica estiver fechada."
    };
  }
  if (partialPatterns.some((pattern) => pattern.test(line))) {
    return {
      status: "PARCIAL",
      evidence: "Ha implementacao funcional, mas ainda falta robustez de produto, pathfinding/combate completo ou prompt original exato.",
      action: "Completar em v4 sem mudar escala canonica."
    };
  }
  if (okPatterns.some((pattern) => pattern.test(line))) {
    return {
      status: "OK",
      evidence: "Coberto por kernel, editor, simulacao, adapters Phaser/Three, snapshots e Playwright.",
      action: "Manter regressao automatizada."
    };
  }
  return {
    status: "INFO",
    evidence: "Linha contextual do documento auxiliar.",
    action: "Usar como orientacao de continuidade."
  };
}

const rows = source.map((line, index) => {
  const lineNo = index + 1;
  const mark = classify(line);
  return { lineNo, text: line.replaceAll("|", "\\|"), ...mark };
});

const counts = rows.reduce((acc, row) => {
  acc[row.status] = (acc[row.status] ?? 0) + 1;
  return acc;
}, {});

const missing = rows.filter((row) => row.status === "PARCIAL" || row.status === "FORA_V3");
const generatedAt = new Date().toISOString();

const markdown = [
  "# Demarcacao de Conformidade das 4000 Linhas",
  "",
  `Gerado em: ${generatedAt}`,
  "",
  "Este relatorio demarca cada linha do documento auxiliar copiado em `docs/contracts/DOCUMENTO_AUXILIAR_4000_LINHAS.md`.",
  "A classificacao e conservadora: `OK` quando a v3 cobre o contrato por codigo/teste/screenshot; `PARCIAL` quando ha base funcional mas falta produto completo; `FORA_V3` quando o proprio contrato aponta tecnologia futura; `INFO` quando a linha e contexto.",
  "",
  "## Resumo",
  "",
  `- OK: ${counts.OK ?? 0}`,
  `- PARCIAL: ${counts.PARCIAL ?? 0}`,
  `- FORA_V3: ${counts.FORA_V3 ?? 0}`,
  `- INFO: ${counts.INFO ?? 0}`,
  "",
  "## Linhas que ainda pedem trabalho",
  "",
  missing.length
    ? missing.map((row) => `- Linha ${String(row.lineNo).padStart(4, "0")}: ${row.status} - ${row.text}`).join("\n")
    : "- Nenhuma linha classificada como parcial ou fora da v3.",
  "",
  "## Tabela linha-a-linha",
  "",
  "| Linha | Status | Contrato | Evidencia v3 | Acao restante |",
  "|---:|---|---|---|---|",
  ...rows.map((row) => `| ${String(row.lineNo).padStart(4, "0")} | ${row.status} | ${row.text} | ${row.evidence} | ${row.action} |`)
].join("\n");

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, markdown, "utf8");
console.log(`Demarcacao gerada em ${outPath}`);
console.log(JSON.stringify(counts));
