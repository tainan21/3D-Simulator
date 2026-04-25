import type { InfluenceCell, InfluenceField } from "../domain/analysis";
import type { Actor, BaseCore, BasePiece, TowerPiece } from "../domain/canonical";
import { mergeBounds } from "../kernel/shapes";
import { distance, type Vec2 } from "../kernel/vector";

const CELL_SIZE = 1;

function worldBounds(pieces: BasePiece[], baseCore: BaseCore): InfluenceField["bounds"] {
  const pieceBounds = pieces.length
    ? pieces.map((piece) => ({
        min: { x: Math.min(piece.a.x, piece.b.x) - 2, z: Math.min(piece.a.z, piece.b.z) - 2 },
        max: { x: Math.max(piece.a.x, piece.b.x) + 2, z: Math.max(piece.a.z, piece.b.z) + 2 }
      }))
    : [{ min: { x: baseCore.position.x - 8, z: baseCore.position.z - 8 }, max: { x: baseCore.position.x + 8, z: baseCore.position.z + 8 } }];
  return mergeBounds(pieceBounds);
}

function defenseAt(cell: Vec2, towers: TowerPiece[], pieces: BasePiece[]): number {
  const towerDefense = towers.reduce((total, tower) => total + Math.max(0, 3.8 - distance(cell, { x: tower.anchor.x, z: tower.anchor.z })) * 0.9, 0);
  const wallDefense = pieces.reduce((total, piece) => total + Math.max(0, 2.5 - distance(cell, { x: (piece.a.x + piece.b.x) * 0.5, z: (piece.a.z + piece.b.z) * 0.5 })) * 0.2, 0);
  return towerDefense + wallDefense;
}

function pressureAt(cell: Vec2, actors: Actor[]): number {
  return actors.reduce((total, actor) => {
    if (actor.kind === "player") return total;
    const factor = actor.kind === "boss" ? 1.6 : 0.8;
    return total + Math.max(0, 4.8 - distance(cell, actor.position)) * factor;
  }, 0);
}

function exposureAt(cell: Vec2, baseCore: BaseCore, pieces: BasePiece[]): number {
  const gateExposure = pieces.reduce((total, piece) => {
    if (piece.kind !== "gate") return total;
    const gateCenter = { x: (piece.a.x + piece.b.x) * 0.5, z: (piece.a.z + piece.b.z) * 0.5 };
    const openness = piece.state === "open" ? 0.9 : 0.35;
    return total + Math.max(0, 4 - distance(cell, gateCenter)) * openness;
  }, 0);
  const coreExposure = Math.max(0, 5 - distance(cell, baseCore.position)) * 0.4;
  return gateExposure + coreExposure;
}

export function computeInfluenceField(
  pieces: BasePiece[],
  towers: TowerPiece[],
  actors: Actor[],
  baseCore: BaseCore
): InfluenceField {
  const bounds = worldBounds(pieces, baseCore);
  const cells: InfluenceCell[] = [];
  for (let x = Math.floor(bounds.min.x); x <= Math.ceil(bounds.max.x); x += CELL_SIZE) {
    for (let z = Math.floor(bounds.min.z); z <= Math.ceil(bounds.max.z); z += CELL_SIZE) {
      const center = { x: x + CELL_SIZE * 0.5, z: z + CELL_SIZE * 0.5 };
      const defense = defenseAt(center, towers, pieces);
      const pressure = pressureAt(center, actors);
      const exposure = exposureAt(center, baseCore, pieces);
      const score = pressure + exposure - defense;
      cells.push({
        id: `cell-${x}:${z}`,
        center,
        defense,
        pressure,
        exposure,
        score,
        deadZone: defense < 0.4 && distance(center, baseCore.position) <= 6,
        vulnerable: score > 1.1
      });
    }
  }
  return { bounds, cellSize: CELL_SIZE, cells };
}
