import { BaseEditor } from "../editor/baseEditor";
import type { PhaseScenarioId } from "../app/contracts";
import { createActor, createBaseCore, type BasePiece, type HeightConnector, type TowerPiece } from "../domain/canonical";
import type { AiMemoryState } from "./aiTypes";
import { createProceduralWorld } from "./procedural";
import { createRogueRun, spawnWaveActors, type RogueRunState } from "./roguelite";
import { createStructureMap, type CombatEvent, type RuntimeMeta, type StructureMap } from "./structures";

export type WorldState = {
  pieces: BasePiece[];
  towers: TowerPiece[];
  connectors: HeightConnector[];
  actors: ReturnType<typeof createActor>[];
  baseCore: ReturnType<typeof createBaseCore>;
  run: RogueRunState;
  aiMemory: AiMemoryState;
  worldSeed: number;
  tick: number;
  structures: StructureMap;
  combatLog: CombatEvent[];
  runtime?: RuntimeMeta;
  selectedId?: string;
  phaseScenarioId?: PhaseScenarioId;
};

export function cloneWorld<T>(world: T): T {
  return JSON.parse(JSON.stringify(world)) as T;
}

function createWorldState(base: Omit<WorldState, "structures" | "combatLog" | "tick"> & Partial<Pick<WorldState, "structures" | "combatLog" | "tick">>): WorldState {
  const initialStructures = base.structures ?? createStructureMap(base.pieces, base.towers, base.baseCore, base.run.baseCoreMaxHp);
  return {
    ...base,
    tick: base.tick ?? 0,
    combatLog: base.combatLog ?? [],
    structures: initialStructures
  };
}

export function createCanonicalValidationWorld(seed = 42): WorldState {
  const editor = new BaseEditor();
  const north = editor.placeSegment("fence", { x: -5, z: -4 }, { x: -2, z: -4 });
  editor.placeSegment("fence-tl", north.b, { x: 2, z: -4 });
  const tl = editor.pieces.find((piece) => piece.kind === "fence-tl");
  if (tl) editor.attachTowerToFenceTL(tl.id);
  editor.placeSegment("fence", { x: 2, z: -4 }, { x: 5, z: -4 });
  editor.placeSegment("fence", { x: 5, z: -4 }, { x: 5, z: -1.5 });
  editor.placeSegment("gate", { x: 5, z: -1.5 }, { x: 5, z: 2.5 }, "closed");
  editor.placeSegment("fence", { x: 5, z: 2.5 }, { x: 5, z: 5 });
  editor.placeSegment("fence", { x: 5, z: 5 }, { x: -5, z: 5 });
  editor.placeSegment("fence", { x: -5, z: 5 }, { x: -5, z: -4 });
  editor.placeSegment("fence", { x: -5, z: -4 }, { x: -6.5, z: -5.5 });

  return createWorldState({
    pieces: editor.pieces,
    towers: editor.towers,
    connectors: editor.connectors,
    baseCore: createBaseCore({ x: 0, z: 1 }),
    run: createRogueRun(),
    actors: [createActor("player", "player", { x: 0, z: -0.8 }), ...spawnWaveActors(1)],
    aiMemory: {},
    worldSeed: seed,
    selectedId: tl?.id
  });
}

export function createHeightLabWorld(seed = 77): WorldState {
  const editor = new BaseEditor();
  editor.placeSegment("fence", { x: -6, z: -2 }, { x: -1, z: -2 });
  const raised = editor.placeSegment("fence-tl", { x: -1, z: -2 }, { x: 3, z: -2 }, "closed", { heightLayer: 1 });
  editor.attachTowerToFenceTL(raised.id);
  editor.placeSegment("gate", { x: 3, z: -2 }, { x: 3, z: 2 }, "open", { heightLayer: 1 });
  editor.placeSegment("fence", { x: 3, z: 2 }, { x: -6, z: 2 });
  editor.placeConnector("ramp", { x: -1, z: -2 }, { x: -3, z: 0 }, 0, 1);
  editor.placeConnector("platform-link", { x: 3, z: 2 }, { x: 6, z: 2 }, 1, 1);

  return createWorldState({
    pieces: editor.pieces,
    towers: editor.towers,
    connectors: editor.connectors,
    baseCore: createBaseCore({ x: 0, z: 0 }, { heightLayer: 1 }),
    run: createRogueRun(),
    actors: [createActor("player", "player", { x: -5, z: 0 }), createActor("enemy-h1", "enemy", { x: 6, z: 1 }), createActor("boss-h1", "boss", { x: 8, z: 0 })],
    aiMemory: {},
    worldSeed: seed,
    phaseScenarioId: "height-lab",
    selectedId: raised.id
  });
}

export function createSiegeLabWorld(seed = 99): WorldState {
  const editor = new BaseEditor();
  editor.placeSegment("fence", { x: -6, z: -5 }, { x: 5, z: -5 });
  const tl = editor.placeSegment("fence-tl", { x: 5, z: -5 }, { x: 5, z: -1 });
  editor.attachTowerToFenceTL(tl.id);
  editor.placeSegment("gate", { x: 5, z: -1 }, { x: 5, z: 2.5 }, "closed");
  editor.placeSegment("gate", { x: 5, z: 2.5 }, { x: 5, z: 5 }, "open");
  editor.placeSegment("fence", { x: 5, z: 5 }, { x: -6, z: 5 });
  editor.placeSegment("fence", { x: -6, z: 5 }, { x: -6, z: -5 });

  return createWorldState({
    pieces: editor.pieces,
    towers: editor.towers,
    connectors: editor.connectors,
    baseCore: createBaseCore({ x: 0, z: 0 }),
    run: createRogueRun(),
    actors: [createActor("player", "player", { x: -2, z: 0 }), createActor("enemy-siege", "enemy", { x: 7, z: -2 }), createActor("boss-siege", "boss", { x: 8, z: 3 })],
    aiMemory: {},
    worldSeed: seed,
    phaseScenarioId: "siege-lab",
    selectedId: tl.id
  });
}

export function createPhaseWorld(scenarioId: PhaseScenarioId, seed = 101): WorldState {
  if (scenarioId === "height-lab") return createHeightLabWorld(seed);
  if (scenarioId === "siege-lab") return createSiegeLabWorld(seed);
  if (scenarioId === "chunks-101") return createWorldState({ ...createProceduralWorld(seed), phaseScenarioId: scenarioId });
  return createWorldState({ ...createCanonicalValidationWorld(seed), phaseScenarioId: "baseline" });
}

export function createSampleWorld(): WorldState {
  return createCanonicalValidationWorld();
}

export function createStudioWorld(): WorldState {
  return createCanonicalValidationWorld();
}

export function editorFromWorld(world: WorldState): BaseEditor {
  return new BaseEditor({ version: 2, pieces: world.pieces, towers: world.towers, connectors: world.connectors });
}

export function resetSampleBase(): Pick<WorldState, "pieces" | "towers" | "connectors"> {
  const sample = createSampleWorld();
  return { pieces: sample.pieces, towers: sample.towers, connectors: sample.connectors };
}
