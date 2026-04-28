import { canonicalGeometrySignature } from "../kernel/adapterSnapshot";
import { cloneWorld, type WorldState } from "../simulation/worldState";
import { createReplayState } from "../simulation/replay";
import { createWorldAnalysisCache, type WorldAnalysisSnapshot } from "../simulation/analysis";
import { DEFAULT_AI_POLICY } from "../simulation/aiPolicy";
import { createStructureMap, type RuntimeMeta, type StructureMap } from "../simulation/structures";

export type RuntimeBakeArtifact = Readonly<{
  id: string;
  source: "studio" | "scenario";
  label: string;
  bakedFromTick: number;
  sourceScenarioId?: string;
  canonicalSignature: string;
  worldJson: string;
}>;

export type RuntimeSession = Readonly<{
  artifact: RuntimeBakeArtifact;
  world: WorldState;
  analysis: WorldAnalysisSnapshot;
}>;

const runtimeAnalysisCache = createWorldAnalysisCache();

function ensureBakedStructures(world: WorldState): StructureMap {
  return Object.keys(world.structures ?? {}).length > 0 ? world.structures : createStructureMap(world.pieces, world.towers, world.baseCore, world.run.baseCoreMaxHp);
}

export function createRuntimeBakeArtifact(
  world: WorldState,
  source: RuntimeBakeArtifact["source"],
  label: string,
  bakedFromTick: number,
  sourceScenarioId?: string
): RuntimeBakeArtifact {
  const prepared: WorldState = {
    ...cloneWorld(world),
    surfaceTiles: world.surfaceTiles ?? [],
    tick: 0,
    combatLog: [],
    structures: ensureBakedStructures(world),
    runtime: {
      source: source === "studio" ? "studio-bake" : "scenario",
      label,
      artifactId: `runtime-${Date.now()}-${Math.round(Math.random() * 9999)}`,
      bakedFromTick,
      bakedFromScenarioId: sourceScenarioId
    } satisfies RuntimeMeta
  };
  return {
    id: prepared.runtime!.artifactId,
    source,
    label,
    bakedFromTick,
    sourceScenarioId,
    canonicalSignature: canonicalGeometrySignature(prepared),
    worldJson: JSON.stringify(prepared)
  };
}

export function materializeRuntimeSession(artifact: RuntimeBakeArtifact): RuntimeSession {
  const world = JSON.parse(artifact.worldJson) as WorldState;
  const prepared: WorldState = {
    ...world,
    surfaceTiles: world.surfaceTiles ?? [],
    structures: ensureBakedStructures(world),
    combatLog: world.combatLog ?? [],
    tick: world.tick ?? 0,
    runtime:
      world.runtime ??
      ({
        source: artifact.source === "studio" ? "studio-bake" : "scenario",
        label: artifact.label,
        artifactId: artifact.id,
        bakedFromTick: artifact.bakedFromTick,
        bakedFromScenarioId: artifact.sourceScenarioId
      } satisfies RuntimeMeta)
  };
  return {
    artifact,
    world: prepared,
    analysis: runtimeAnalysisCache.compute(prepared, createReplayState(), DEFAULT_AI_POLICY)
  };
}
