import { BaseEditor } from "../editor/baseEditor";
import type { ReplaySession } from "../domain/analysis";
import { createBaseCore, createActor } from "../domain/canonical";
import { createProceduralWorld } from "../simulation/procedural";
import { createRogueRun } from "../simulation/roguelite";
import { createCanonicalValidationWorld, createHeightLabWorld, createSiegeLabWorld, type WorldState } from "../simulation/worldState";
import { createStructureMap } from "../simulation/structures";

export type ScenarioPreset = Readonly<{
  id: string;
  name: string;
  description: string;
  create: (seed: number) => WorldState;
  replayTape?: ReplaySession;
}>;

function openFieldWorld(seed: number): WorldState {
  const baseCore = createBaseCore({ x: 0, z: 0 });
  const run = createRogueRun();
  const pieces: WorldState["pieces"] = [];
  const towers: WorldState["towers"] = [];
  return {
    pieces,
    towers,
    connectors: [],
    actors: [createActor("player", "player", { x: 0, z: 0 }), createActor("enemy-open", "enemy", { x: 4, z: -1 }), createActor("boss-open", "boss", { x: 7, z: 2 })],
    baseCore,
    run,
    aiMemory: {},
    worldSeed: seed
    ,
    tick: 0,
    combatLog: [],
    structures: createStructureMap(pieces, towers, baseCore, run.baseCoreMaxHp)
  };
}

function gateFlowWorld(seed: number): WorldState {
  return createSiegeLabWorld(seed);
}

function cornersWorld(seed: number): WorldState {
  const editor = new BaseEditor();
  editor.placeSegment("fence", { x: -5, z: -4 }, { x: -1, z: -4 });
  editor.placeSegment("fence", { x: -1, z: -4 }, { x: -1, z: 1 });
  editor.placeSegment("fence-tl", { x: -1, z: 1 }, { x: 3, z: 1 });
  const tl = editor.pieces.find((piece) => piece.kind === "fence-tl");
  if (tl) editor.attachTowerToFenceTL(tl.id);
  const baseCore = createBaseCore({ x: -2, z: -1 });
  const run = createRogueRun();
  return {
    pieces: editor.pieces,
    towers: editor.towers,
    connectors: editor.connectors,
    actors: [createActor("player", "player", { x: -4, z: -1 }), createActor("enemy-corner", "enemy", { x: 2, z: 3 })],
    baseCore,
    run,
    aiMemory: {},
    worldSeed: seed,
    selectedId: tl?.id,
    tick: 0,
    combatLog: [],
    structures: createStructureMap(editor.pieces, editor.towers, baseCore, run.baseCoreMaxHp)
  };
}

function gapsWorld(seed: number): WorldState {
  const editor = new BaseEditor();
  editor.placeSegment("fence", { x: -5, z: -3 }, { x: -1, z: -3 });
  editor.placeSegment("fence", { x: 1, z: -3 }, { x: 5, z: -3 });
  editor.placeSegment("fence-tl", { x: 5, z: -3 }, { x: 5, z: 3 });
  editor.placeSegment("fence", { x: 5, z: 3 }, { x: -5, z: 3 });
  const baseCore = createBaseCore({ x: 2, z: 0 });
  const run = createRogueRun();
  return {
    pieces: editor.pieces,
    towers: editor.towers,
    connectors: editor.connectors,
    actors: [createActor("player", "player", { x: 0, z: 0 }), createActor("enemy-gap", "enemy", { x: -7, z: 0 })],
    baseCore,
    run,
    aiMemory: {},
    worldSeed: seed,
    tick: 0,
    combatLog: [],
    structures: createStructureMap(editor.pieces, editor.towers, baseCore, run.baseCoreMaxHp)
  };
}

function weakStructureWorld(seed: number): WorldState {
  const world = createCanonicalValidationWorld(seed);
  return {
    ...world,
    pieces: world.pieces.map((piece) => (piece.kind === "gate" ? { ...piece, state: "open" } : piece))
  };
}

function denseBaseWorld(seed: number): WorldState {
  const editor = new BaseEditor();
  for (let row = -2; row <= 2; row += 2) {
    editor.placeSegment("fence", { x: -5, z: row }, { x: 5, z: row });
  }
  const tl = editor.placeSegment("fence-tl", { x: 0, z: -5 }, { x: 0, z: 5 });
  editor.attachTowerToFenceTL(tl.id);
  editor.placeSegment("gate", { x: 5, z: -2 }, { x: 5, z: 2 }, "closed");
  const baseCore = createBaseCore({ x: -1, z: 0 });
  const run = createRogueRun();
  return {
    pieces: editor.pieces,
    towers: editor.towers,
    connectors: editor.connectors,
    actors: [createActor("player", "player", { x: -4, z: -4 }), createActor("enemy-dense", "enemy", { x: 7, z: 0 }), createActor("boss-dense", "boss", { x: 9, z: 1 })],
    baseCore,
    run,
    aiMemory: {},
    worldSeed: seed,
    selectedId: tl.id,
    tick: 0,
    combatLog: [],
    structures: createStructureMap(editor.pieces, editor.towers, baseCore, run.baseCoreMaxHp)
  };
}

export const STUDIO_SCENARIOS: ScenarioPreset[] = [
  { id: "baseline", name: "Baseline", description: "Base canonica principal com TL, torre e portao.", create: createCanonicalValidationWorld },
  { id: "tl-tower", name: "TL + tower", description: "Stress de TL com socket superior e torre encaixada.", create: createCanonicalValidationWorld },
  { id: "gate-flow", name: "Gate flow", description: "Fluxo por portao aberto/fechado.", create: gateFlowWorld },
  { id: "boss-pressure", name: "Boss pressure", description: "Boss pressionando a estrutura principal.", create: createSiegeLabWorld },
  { id: "corners", name: "Corners", description: "Cantos como segmentos conectados por endpoint.", create: cornersWorld },
  { id: "gaps", name: "Gaps", description: "Brechas reais e caminho alternativo.", create: gapsWorld },
  { id: "weak-structure", name: "Weak structure", description: "Estrutura vulneravel para AI priorizar.", create: weakStructureWorld },
  { id: "dense-base", name: "Dense base", description: "Base densa para profiling estrutural.", create: denseBaseWorld },
  { id: "open-field", name: "Open field", description: "Campo aberto sem blockers estruturais.", create: openFieldWorld },
  { id: "chunks-101", name: "Chunks", description: "Mundo procedural controlado por chunks.", create: createProceduralWorld },
  { id: "height-lab", name: "Height lab", description: "Camadas de altura e conectores.", create: createHeightLabWorld }
];

export function loadScenarioPreset(id: string, seed = 101): WorldState {
  const preset = STUDIO_SCENARIOS.find((entry) => entry.id === id) ?? STUDIO_SCENARIOS[0];
  return preset.create(seed);
}
