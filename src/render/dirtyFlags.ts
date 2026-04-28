import type { ReplayState, ValidationIssue, InfluenceField } from "../domain/analysis";
import type { DebugContact, DebugOverlayOptions } from "../domain/debug";
import type { WorldState } from "../simulation/worldState";
import type { AiDebugState } from "../simulation/aiTypes";
import type { ThreeCameraState } from "./contracts";

export type RenderDirtyFlags = Readonly<{
  geometry: boolean;
  simulation: boolean;
  camera: boolean;
  overlays: boolean;
}>;

export type RenderFingerprint = Readonly<{
  geometryKey: string;
  simulationKey: string;
  cameraKey: string;
  overlayKey: string;
}>;

export type RenderFingerprintInput = Readonly<{
  world: WorldState;
  debug: DebugOverlayOptions;
  aiDebug: AiDebugState[];
  contacts: DebugContact[];
  validationIssues: ValidationIssue[];
  influenceField: InfluenceField;
  replayState: ReplayState;
  camera: ThreeCameraState;
  ghostWorld?: WorldState;
}>;

function geometryKey(world: WorldState): string {
  return JSON.stringify({
    pieces: world.pieces,
    towers: world.towers,
    connectors: world.connectors,
    surfaceTiles: world.surfaceTiles ?? [],
    baseCore: world.baseCore
  });
}

function simulationKey(world: WorldState): string {
  return JSON.stringify({
    actors: world.actors,
    run: {
      phase: world.run.phase,
      wave: world.run.wave,
      baseCoreHp: world.run.baseCoreHp
    },
    structures: world.structures,
    combatLog: world.combatLog,
    tick: world.tick,
    selectedId: world.selectedId
  });
}

function overlayKey(
  debug: DebugOverlayOptions,
  aiDebug: AiDebugState[],
  contacts: DebugContact[],
  validationIssues: ValidationIssue[],
  influenceField: InfluenceField,
  replayState: ReplayState,
  ghostWorld?: WorldState
): string {
  return JSON.stringify({
    debug,
    aiDebug,
    contacts,
    validationIssues,
    influenceField,
    replayState,
    ghost: ghostWorld ? geometryKey(ghostWorld) + simulationKey(ghostWorld) : undefined
  });
}

export function createRenderFingerprint(input: RenderFingerprintInput): RenderFingerprint {
  return {
    geometryKey: geometryKey(input.world),
    simulationKey: simulationKey(input.world),
    cameraKey: JSON.stringify(input.camera),
    overlayKey: overlayKey(
      input.debug,
      input.aiDebug,
      input.contacts,
      input.validationIssues,
      input.influenceField,
      input.replayState,
      input.ghostWorld
    )
  };
}

export function computeRenderDirtyFlags(previous: RenderFingerprint | undefined, next: RenderFingerprint): RenderDirtyFlags {
  return {
    geometry: !previous || previous.geometryKey !== next.geometryKey,
    simulation: !previous || previous.simulationKey !== next.simulationKey,
    camera: !previous || previous.cameraKey !== next.cameraKey,
    overlays: !previous || previous.overlayKey !== next.overlayKey
  };
}
