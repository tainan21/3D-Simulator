import type { PhaseScenarioId } from "../app/contracts";
import type { BasePiece, GateState, HeightConnector, TowerPiece } from "./canonical";
import { canonicalGeometrySignature } from "../kernel/adapterSnapshot";
import type { WorldState } from "../simulation/worldState";
import { editorFromWorld, type WorldState as WorldStateType } from "../simulation/worldState";
import { createPhaseWorld } from "../simulation/worldState";
import { createStructureMap, type StructureIntegrity, type StructureMap } from "../simulation/structures";

export type UniverseRegionRole = "hub" | "frontier" | "defense" | "boss";
export type UniverseEncounterType = "hub" | "siege" | "height" | "procedural";

export type UniverseRegion = Readonly<{
  id: string;
  name: string;
  scenarioId: PhaseScenarioId;
  seed: number;
  role: UniverseRegionRole;
  grammar: string;
  functionTag: string;
  encounterType: UniverseEncounterType;
  risk: number;
}>;

export type UniverseRegionLink = Readonly<{
  id: string;
  fromRegionId: string;
  toRegionId: string;
  travelCost: number;
}>;

export type UniverseStructureOverride = Readonly<{
  hp: number;
  pressure: number;
  integrity?: StructureIntegrity;
}>;

export type UniverseRegionDelta = Readonly<{
  regionId: string;
  removedPieceIds: string[];
  placedPieces: BasePiece[];
  placedTowers: TowerPiece[];
  placedConnectors: HeightConnector[];
  gateStates: Readonly<Record<string, GateState>>;
  destroyedTowerIds: string[];
  structureOverrides: Readonly<Record<string, UniverseStructureOverride>>;
  pressureDelta: number;
  threatDelta: number;
  unlocked: boolean;
}>;

export type UniverseState = Readonly<{
  regions: UniverseRegion[];
  regionLinks: UniverseRegionLink[];
  campaignSeed: number;
  discoveredState: Readonly<Record<string, boolean>>;
  threatState: Readonly<Record<string, number>>;
  resourceState: Readonly<Record<string, number>>;
  lastSimulatedTick: Readonly<Record<string, number>>;
  activeRegionId: string;
  deltas: Readonly<Record<string, UniverseRegionDelta>>;
}>;

export type UniverseCampaignSave = Readonly<{
  version: 1;
  campaignSeed: number;
  activeRegionId: string;
  discoveredState: UniverseState["discoveredState"];
  threatState: UniverseState["threatState"];
  resourceState: UniverseState["resourceState"];
  lastSimulatedTick: UniverseState["lastSimulatedTick"];
  deltas: UniverseState["deltas"];
}>;

export type UniverseTickSummary = Readonly<{
  regionId: string;
  previousTick: number;
  nextTick: number;
  threat: number;
  resources: number;
  structuralDrift: number;
}>;

export type MaterializedRegion = Readonly<{
  region: UniverseRegion;
  world: WorldState;
  report: RegionMaterializationReport;
}>;

export type RegionMaterializationReport = Readonly<{
  regionId: string;
  scenarioId: PhaseScenarioId;
  seed: number;
  canonicalSignature: string;
  removedPieceCount: number;
  placedPieceCount: number;
  changedGateCount: number;
  destroyedTowerCount: number;
  structureOverrideCount: number;
}>;

const REGION_SEED_STEP = 17;

function defaultRegions(campaignSeed: number): UniverseRegion[] {
  return [
    {
      id: "region-hub",
      name: "Hub Canonico",
      scenarioId: "baseline",
      seed: campaignSeed,
      role: "hub",
      grammar: "baseline-ring",
      functionTag: "staging",
      encounterType: "hub",
      risk: 1
    },
    {
      id: "region-gate-flow",
      name: "Gate Flow",
      scenarioId: "siege-lab",
      seed: campaignSeed + REGION_SEED_STEP,
      role: "defense",
      grammar: "gate-corridor",
      functionTag: "funnel-test",
      encounterType: "siege",
      risk: 2
    },
    {
      id: "region-height-lab",
      name: "Height Lab",
      scenarioId: "height-lab",
      seed: campaignSeed + REGION_SEED_STEP * 2,
      role: "frontier",
      grammar: "raised-platform",
      functionTag: "elevation-proof",
      encounterType: "height",
      risk: 3
    },
    {
      id: "region-frontier-chunks",
      name: "Frontier Chunks",
      scenarioId: "chunks-101",
      seed: campaignSeed + REGION_SEED_STEP * 3,
      role: "frontier",
      grammar: "procedural-chunk",
      functionTag: "expansion",
      encounterType: "procedural",
      risk: 4
    },
    {
      id: "region-boss-breach",
      name: "Boss Breach",
      scenarioId: "siege-lab",
      seed: campaignSeed + REGION_SEED_STEP * 4,
      role: "boss",
      grammar: "reinforced-gate",
      functionTag: "boss-finale",
      encounterType: "siege",
      risk: 5
    }
  ];
}

function defaultLinks(): UniverseRegionLink[] {
  return [
    { id: "hub-gate", fromRegionId: "region-hub", toRegionId: "region-gate-flow", travelCost: 1 },
    { id: "hub-height", fromRegionId: "region-hub", toRegionId: "region-height-lab", travelCost: 1 },
    { id: "gate-frontier", fromRegionId: "region-gate-flow", toRegionId: "region-frontier-chunks", travelCost: 2 },
    { id: "height-frontier", fromRegionId: "region-height-lab", toRegionId: "region-frontier-chunks", travelCost: 2 },
    { id: "frontier-boss", fromRegionId: "region-frontier-chunks", toRegionId: "region-boss-breach", travelCost: 3 }
  ];
}

function emptyDelta(regionId: string): UniverseRegionDelta {
  return {
    regionId,
    removedPieceIds: [],
    placedPieces: [],
    placedTowers: [],
    placedConnectors: [],
    gateStates: {},
    destroyedTowerIds: [],
    structureOverrides: {},
    pressureDelta: 0,
    threatDelta: 0,
    unlocked: regionId === "region-hub"
  };
}

function applyStructureOverrides(base: StructureMap, overrides: UniverseRegionDelta["structureOverrides"]): StructureMap {
  const nextEntries = Object.entries(base).map(([id, state]) => {
    const override = overrides[id];
    if (!override) return [id, state] as const;
    return [
      id,
      {
        ...state,
        hp: override.hp,
        pressure: override.pressure,
        integrity: override.integrity ?? state.integrity
      }
    ] as const;
  });
  return Object.fromEntries(nextEntries);
}

export function createUniverseState(campaignSeed = 101): UniverseState {
  const regions = defaultRegions(campaignSeed);
  return {
    regions,
    regionLinks: defaultLinks(),
    campaignSeed,
    discoveredState: Object.fromEntries(regions.map((region) => [region.id, region.role === "hub"])),
    threatState: Object.fromEntries(regions.map((region) => [region.id, region.risk * 0.8])),
    resourceState: Object.fromEntries(regions.map((region) => [region.id, region.role === "hub" ? 3 : 1])),
    lastSimulatedTick: Object.fromEntries(regions.map((region) => [region.id, 0])),
    activeRegionId: "region-hub",
    deltas: Object.fromEntries(regions.map((region) => [region.id, emptyDelta(region.id)]))
  };
}

export function captureUniverseCampaignSave(universe: UniverseState): UniverseCampaignSave {
  return {
    version: 1,
    campaignSeed: universe.campaignSeed,
    activeRegionId: universe.activeRegionId,
    discoveredState: universe.discoveredState,
    threatState: universe.threatState,
    resourceState: universe.resourceState,
    lastSimulatedTick: universe.lastSimulatedTick,
    deltas: universe.deltas
  };
}

export function restoreUniverseCampaignSave(save: UniverseCampaignSave): UniverseState {
  const base = createUniverseState(save.campaignSeed);
  return {
    ...base,
    activeRegionId: save.activeRegionId,
    discoveredState: save.discoveredState,
    threatState: save.threatState,
    resourceState: save.resourceState,
    lastSimulatedTick: save.lastSimulatedTick,
    deltas: save.deltas
  };
}

export function getUniverseRegion(universe: UniverseState, regionId = universe.activeRegionId): UniverseRegion {
  return universe.regions.find((region) => region.id === regionId) ?? universe.regions[0];
}

export function setActiveUniverseRegion(universe: UniverseState, regionId: string): UniverseState {
  const region = getUniverseRegion(universe, regionId);
  return {
    ...universe,
    activeRegionId: region.id,
    discoveredState: {
      ...universe.discoveredState,
      [region.id]: true
    }
  };
}

export function updateUniverseRegionDelta(universe: UniverseState, regionId: string, updater: (delta: UniverseRegionDelta) => UniverseRegionDelta): UniverseState {
  const current = universe.deltas[regionId] ?? emptyDelta(regionId);
  return {
    ...universe,
    deltas: {
      ...universe.deltas,
      [regionId]: updater(current)
    }
  };
}

export function rerollUniverseRegionSeed(universe: UniverseState, regionId: string): UniverseState {
  return {
    ...universe,
    regions: universe.regions.map((region) => (region.id === regionId ? { ...region, seed: region.seed + REGION_SEED_STEP } : region))
  };
}

export function materializeUniverseRegion(universe: UniverseState, regionId = universe.activeRegionId): MaterializedRegion {
  const region = getUniverseRegion(universe, regionId);
  const delta = universe.deltas[region.id] ?? emptyDelta(region.id);
  const seed = region.seed;
  const baseWorld = createPhaseWorld(region.scenarioId, seed);
  const editor = editorFromWorld(baseWorld);

  const removedPieceIds = new Set(delta.removedPieceIds);
  for (const piece of baseWorld.pieces) {
    const gateState = delta.gateStates[piece.id];
    if (gateState && piece.kind === "gate") {
      editor.setGateState(piece.id, gateState);
    }
  }

  let pieces = editor.pieces.filter((piece) => !removedPieceIds.has(piece.id));
  let towers = editor.towers.filter((tower) => !delta.destroyedTowerIds.includes(tower.id) && !removedPieceIds.has(tower.fenceId));
  let connectors = editor.connectors.filter(
    (connector) => !removedPieceIds.has(connector.from.pieceId ?? "") && !removedPieceIds.has(connector.to.pieceId ?? "")
  );

  pieces = [...pieces, ...delta.placedPieces];
  towers = [...towers, ...delta.placedTowers];
  connectors = [...connectors, ...delta.placedConnectors];

  const structures = applyStructureOverrides(
    createStructureMap(pieces, towers, baseWorld.baseCore, baseWorld.run.baseCoreMaxHp),
    delta.structureOverrides
  );

  const world: WorldStateType = {
    ...baseWorld,
    pieces,
    towers,
    connectors,
    phaseScenarioId: region.scenarioId,
    worldSeed: seed,
    structures
  };

  return {
    region,
    world,
    report: {
      regionId: region.id,
      scenarioId: region.scenarioId,
      seed,
      canonicalSignature: canonicalGeometrySignature(world),
      removedPieceCount: delta.removedPieceIds.length,
      placedPieceCount: delta.placedPieces.length,
      changedGateCount: Object.keys(delta.gateStates).length,
      destroyedTowerCount: delta.destroyedTowerIds.length,
      structureOverrideCount: Object.keys(delta.structureOverrides).length
    }
  };
}

export function advanceUniverseOffscreen(universe: UniverseState, elapsedTicks = 12): Readonly<{ universe: UniverseState; summaries: UniverseTickSummary[] }> {
  const summaries: UniverseTickSummary[] = [];
  let nextUniverse = universe;

  for (const region of universe.regions) {
    if (region.id === universe.activeRegionId) continue;
    const previousTick = universe.lastSimulatedTick[region.id] ?? 0;
    const nextTick = previousTick + elapsedTicks;
    const drift = Number((elapsedTicks * (0.04 + region.risk * 0.01)).toFixed(3));
    const threat = Number(Math.max(0, (universe.threatState[region.id] ?? region.risk) + drift * 0.5).toFixed(3));
    const resources = Number(Math.max(0, (universe.resourceState[region.id] ?? 0) + (region.role === "hub" ? 0.2 : 0.08) * elapsedTicks).toFixed(3));

    summaries.push({
      regionId: region.id,
      previousTick,
      nextTick,
      threat,
      resources,
      structuralDrift: drift
    });

    nextUniverse = {
      ...nextUniverse,
      threatState: {
        ...nextUniverse.threatState,
        [region.id]: threat
      },
      resourceState: {
        ...nextUniverse.resourceState,
        [region.id]: resources
      },
      lastSimulatedTick: {
        ...nextUniverse.lastSimulatedTick,
        [region.id]: nextTick
      }
    };

    nextUniverse = updateUniverseRegionDelta(nextUniverse, region.id, (delta) => ({
      ...delta,
      threatDelta: Number((delta.threatDelta + drift).toFixed(3)),
      pressureDelta: Number((delta.pressureDelta + drift * 0.5).toFixed(3))
    }));
  }

  return { universe: nextUniverse, summaries };
}
