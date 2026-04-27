import { BaseEditor } from "../editor/baseEditor";
import type { ChunkDescriptor, ChunkGenerationReport, ChunkSeed } from "../domain/analysis";
import { createActor, createBaseCore, createTower, type HeightConnector, type TowerPiece } from "../domain/canonical";
import type { WorldState } from "./worldState";
import { createRogueRun } from "./roguelite";
import { createStructureMap } from "./structures";

type Rng = () => number;

function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function chunkBounds(origin: { x: number; z: number }) {
  return {
    min: { x: origin.x - 6, z: origin.z - 6 },
    max: { x: origin.x + 6, z: origin.z + 6 }
  };
}

export function generateProceduralChunks(seed: ChunkSeed, chunkCount = 2): ChunkGenerationReport {
  const rng = createRng(seed);
  const chunks: ChunkDescriptor[] = [];
  for (let index = 0; index < chunkCount; index += 1) {
    const editor = new BaseEditor();
    const origin = { x: index * 12 + Math.round((rng() - 0.5) * 2), z: Math.round((rng() - 0.5) * 3) };
    const width = 4 + Math.round(rng() * 2);
    const height = 4 + Math.round(rng() * 2);
    editor.placeSegment("fence", { x: origin.x - width, z: origin.z - height }, { x: origin.x + width, z: origin.z - height });
    const tl = editor.placeSegment("fence-tl", { x: origin.x + width, z: origin.z - height }, { x: origin.x + width, z: origin.z + height }, "closed", {
      heightLayer: index % 2 === 0 ? 0 : 1
    });
    editor.attachTowerToFenceTL(tl.id);
    editor.placeSegment("gate", { x: origin.x + width, z: origin.z + height }, { x: origin.x - width, z: origin.z + height }, rng() > 0.45 ? "open" : "closed");
    editor.placeSegment("fence", { x: origin.x - width, z: origin.z + height }, { x: origin.x - width, z: origin.z - height });
    if (index % 2 === 1) {
      editor.placeConnector("ramp", { x: origin.x - width, z: origin.z }, { x: origin.x - width - 2, z: origin.z + 2 }, 0, 1);
    }
    chunks.push({
      id: `chunk-${index + 1}`,
      seed,
      origin,
      bounds: chunkBounds(origin),
      pieces: editor.pieces,
      towers: editor.towers.map((tower) => ({ id: tower.id, fenceId: tower.fenceId })),
      connectors: editor.connectors,
      suggestedSpawns: [{ x: origin.x + width + 3, z: origin.z }]
    });
  }
  return {
    seed,
    chunks,
    signature: JSON.stringify(
      chunks.map((chunk) => ({
        id: chunk.id,
        pieces: chunk.pieces.map((piece) => ({
          id: piece.id,
          kind: piece.kind,
          a: piece.a,
          b: piece.b,
          heightLayer: piece.heightLayer
        })),
        connectors: chunk.connectors.map((connector) => ({
          id: connector.id,
          kind: connector.kind,
          from: connector.from.position,
          to: connector.to.position
        }))
      }))
    )
  };
}

export function createProceduralWorld(seed: ChunkSeed): WorldState {
  const report = generateProceduralChunks(seed, 3);
  const pieces = report.chunks.flatMap((chunk) => chunk.pieces);
  const connectors = report.chunks.flatMap((chunk) => chunk.connectors as HeightConnector[]);
  const baseCore = createBaseCore({ x: 0, z: 0 });
  const run = createRogueRun();
  const towers = report.chunks.flatMap((chunk) =>
    chunk.towers
      .map((tower) => pieces.find((piece) => piece.id === tower.fenceId && piece.kind === "fence-tl"))
      .filter((piece): piece is Extract<(typeof pieces)[number], { kind: "fence-tl" }> => Boolean(piece))
      .map((piece, index) => ({ ...createTower(`proc-tower-${index + 1}`, piece), fenceId: piece.id }))
  );
  return {
    pieces,
    towers,
    connectors,
    baseCore,
    actors: [createActor("player", "player", { x: -2, z: 0 }), createActor("enemy-proc", "enemy", { x: 7, z: 0 }), createActor("boss-proc", "boss", { x: 15, z: 2 })],
    run,
    aiMemory: {},
    worldSeed: seed,
    tick: 0,
    combatLog: [],
    structures: createStructureMap(pieces, towers, baseCore, run.baseCoreMaxHp)
  };
}
