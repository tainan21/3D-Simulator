import type { BaseCore, BasePiece, TowerPiece } from "../domain/canonical";
import type { Vec2 } from "../kernel/vector";

export type StructureIntegrity = "intact" | "pressured" | "damaged" | "destroyed";
export type StructureKind = "piece" | "tower" | "base-core";

export type StructureState = Readonly<{
  id: string;
  kind: StructureKind;
  maxHp: number;
  hp: number;
  pressure: number;
  integrity: StructureIntegrity;
  lastImpactPoint?: Vec2;
  lastAttackerId?: string;
}>;

export type StructureMap = Readonly<Record<string, StructureState>>;

export type CombatEvent = Readonly<{
  id: string;
  tick: number;
  attackerId: string;
  targetId: string;
  point: Vec2;
  amount: number;
  kind: "impact" | "destroyed";
}>;

export type RuntimeMeta = Readonly<{
  source: "scenario" | "studio-bake";
  label: string;
  artifactId: string;
  bakedFromTick: number;
  bakedFromScenarioId?: string;
}>;

function pieceMaxHp(piece: BasePiece): number {
  if (piece.properties.maxHp > 0) return piece.properties.maxHp;
  if (piece.kind === "fence-tl") return 24;
  if (piece.kind === "gate") return 18;
  return 14;
}

function pieceIntegrity(hp: number, maxHp: number, pressure: number): StructureIntegrity {
  if (hp <= 0.001) return "destroyed";
  const ratio = hp / maxHp;
  if (ratio <= 0.42) return "damaged";
  if (pressure >= Math.max(2.4, maxHp * 0.12)) return "pressured";
  return "intact";
}

function towerMaxHp(tower: TowerPiece): number {
  return tower.properties.maxHp > 0 ? tower.properties.maxHp : 10;
}

function defaultBaseCoreMaxHp(baseCore?: BaseCore): number {
  return baseCore?.properties.maxHp ?? 30;
}

export function createStructureMap(pieces: BasePiece[], towers: TowerPiece[], baseCore: BaseCore, baseCoreHp = defaultBaseCoreMaxHp(baseCore)): StructureMap {
  const entries: Array<[string, StructureState]> = pieces.map((piece) => {
    const maxHp = pieceMaxHp(piece);
    return [
      piece.id,
      {
        id: piece.id,
        kind: "piece",
        maxHp,
        hp: maxHp,
        pressure: 0,
        integrity: "intact"
      }
    ];
  });

  for (const tower of towers) {
    const maxHp = towerMaxHp(tower);
    entries.push([
      tower.id,
      {
        id: tower.id,
        kind: "tower",
        maxHp,
        hp: maxHp,
        pressure: 0,
        integrity: "intact"
      }
    ]);
  }

  const coreHp = baseCoreHp;
  entries.push([
    baseCore.id,
    {
      id: baseCore.id,
      kind: "base-core",
      maxHp: coreHp,
      hp: coreHp,
      pressure: 0,
      integrity: "intact"
    }
  ]);

  return Object.fromEntries(entries);
}

export function structureState(structures: StructureMap | undefined, id: string): StructureState | undefined {
  return structures?.[id];
}

export function isStructureDestroyed(structures: StructureMap | undefined, id: string): boolean {
  return (structures?.[id]?.integrity ?? "intact") === "destroyed";
}

export function activePieces(pieces: BasePiece[], structures: StructureMap | undefined): BasePiece[] {
  return pieces.filter((piece) => !isStructureDestroyed(structures, piece.id));
}

export function activeTowers(towers: TowerPiece[], structures: StructureMap | undefined): TowerPiece[] {
  return towers.filter((tower) => !isStructureDestroyed(structures, tower.id));
}

export function withPressureDecay(structures: StructureMap, dt: number): StructureMap {
  return Object.fromEntries(
    Object.entries(structures).map(([id, state]) => {
      const pressure = Math.max(0, state.pressure - dt * 1.2);
      return [
        id,
        {
          ...state,
          pressure,
          integrity: pieceIntegrity(state.hp, state.maxHp, pressure)
        }
      ];
    })
  );
}

export function applyStructureDamage(
  structures: StructureMap,
  targetId: string,
  amount: number,
  point: Vec2,
  attackerId: string
): StructureMap {
  const state = structures[targetId];
  if (!state || state.integrity === "destroyed") return structures;
  const hp = Math.max(0, state.hp - amount);
  const pressure = state.pressure + amount;
  return {
    ...structures,
    [targetId]: {
      ...state,
      hp,
      pressure,
      lastImpactPoint: point,
      lastAttackerId: attackerId,
      integrity: pieceIntegrity(hp, state.maxHp, pressure)
    }
  };
}

export function splashTowerDamage(structures: StructureMap, towers: TowerPiece[], pieceId: string, amount: number, point: Vec2, attackerId: string): StructureMap {
  const linkedTower = towers.find((tower) => tower.fenceId === pieceId);
  if (!linkedTower) return structures;
  return applyStructureDamage(structures, linkedTower.id, amount * 0.4, point, attackerId);
}

export function structureWeaknessScore(structures: StructureMap | undefined, id: string): number {
  const state = structures?.[id];
  if (!state) return 0;
  const hpLoss = 1 - state.hp / state.maxHp;
  const pressure = Math.min(1, state.pressure / Math.max(2, state.maxHp * 0.18));
  const destroyed = state.integrity === "destroyed" ? -1.4 : 0;
  return hpLoss * 2.2 + pressure * 1.35 + destroyed;
}

export function structureTintFactor(state: StructureState | undefined): number {
  if (!state) return 1;
  if (state.integrity === "destroyed") return 0.24;
  if (state.integrity === "damaged") return 0.55;
  if (state.integrity === "pressured") return 0.82;
  return 1;
}
