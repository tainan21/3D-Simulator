import type { AnalysisDirtyFlags, InfluenceField, ReplayState, ValidationIssue, WorldTopology } from "../domain/analysis";
import type { AiDebugState } from "./aiTypes";
import { computeAiDebug } from "./ai";
import type { AiPolicyConfig } from "./aiPolicy";
import { computeInfluenceField } from "./influence";
import { buildWorldTopology } from "./topology";
import { computeValidationIssues } from "./validation";
import { computeDebugContacts } from "./simulation";
import type { WorldState } from "./worldState";
import { activePieces, activeTowers } from "./structures";

export type AnalysisCacheDiagnostics = Readonly<{
  dirty: AnalysisDirtyFlags;
  reused: Readonly<{
    topology: boolean;
    validation: boolean;
    influence: boolean;
    aiDebug: boolean;
    debugContacts: boolean;
  }>;
}>;

export type WorldAnalysisSnapshot = Readonly<{
  topology: WorldTopology;
  validationIssues: ValidationIssue[];
  influenceField: InfluenceField;
  aiDebug: AiDebugState[];
  replayState: ReplayState;
  debugContacts: ReturnType<typeof computeDebugContacts>;
  cache: AnalysisCacheDiagnostics;
  timings: Readonly<{
    topologyMs: number;
    validationMs: number;
    influenceMs: number;
    aiMs: number;
    contactsMs: number;
    totalMs: number;
  }>;
}>;

type AnalysisFingerprint = Readonly<{
  geometryKey: string;
  actorKey: string;
  structureKey: string;
  replayKey: string;
  policyKey: string;
}>;

type CachedAnalysis = Readonly<{
  fingerprint: AnalysisFingerprint;
  topology: WorldTopology;
  validationIssues: ValidationIssue[];
  influenceField: InfluenceField;
  aiDebug: AiDebugState[];
  debugContacts: ReturnType<typeof computeDebugContacts>;
}>;

function geometryKey(world: WorldState): string {
  return JSON.stringify({
    pieces: world.pieces,
    towers: world.towers,
    connectors: world.connectors,
    baseCore: world.baseCore
  });
}

function actorKey(world: WorldState): string {
  return JSON.stringify(world.actors);
}

function structureKey(world: WorldState): string {
  return JSON.stringify({
    tick: world.tick,
    structures: world.structures,
    combatLog: world.combatLog,
    run: {
      phase: world.run.phase,
      wave: world.run.wave,
      baseCoreHp: world.run.baseCoreHp
    },
    aiMemory: world.aiMemory
  });
}

function replayKey(replayState: ReplayState): string {
  return JSON.stringify(replayState);
}

function policyKey(aiPolicy?: AiPolicyConfig): string {
  return JSON.stringify(aiPolicy ?? {});
}

function createFingerprint(world: WorldState, replayState: ReplayState, aiPolicy?: AiPolicyConfig): AnalysisFingerprint {
  return {
    geometryKey: geometryKey(world),
    actorKey: actorKey(world),
    structureKey: structureKey(world),
    replayKey: replayKey(replayState),
    policyKey: policyKey(aiPolicy)
  };
}

export function computeAnalysisDirtyFlags(previous: AnalysisFingerprint | undefined, next: AnalysisFingerprint): AnalysisDirtyFlags {
  return {
    geometry: !previous || previous.geometryKey !== next.geometryKey,
    actors: !previous || previous.actorKey !== next.actorKey,
    structures: !previous || previous.structureKey !== next.structureKey,
    replay: !previous || previous.replayKey !== next.replayKey,
    policy: !previous || previous.policyKey !== next.policyKey
  };
}

export class WorldAnalysisCache {
  private cached?: CachedAnalysis;

  compute(world: WorldState, replayState: ReplayState, aiPolicy?: AiPolicyConfig): WorldAnalysisSnapshot {
    const totalStart = performance.now();
    const previous = this.cached;
    const fingerprint = createFingerprint(world, replayState, aiPolicy);
    const dirty = computeAnalysisDirtyFlags(previous?.fingerprint, fingerprint);
    const livePieces = activePieces(world.pieces, world.structures);
    const liveTowers = activeTowers(world.towers, world.structures);

    let topologyMs = 0;
    let validationMs = 0;
    let influenceMs = 0;
    let aiMs = 0;
    let contactsMs = 0;

    const topology =
      !previous || dirty.geometry
        ? (() => {
            const start = performance.now();
            const result = buildWorldTopology(livePieces, world.connectors, world.baseCore);
            topologyMs = performance.now() - start;
            return result;
          })()
        : previous.topology;
    const validationIssues =
      !previous || dirty.geometry
        ? (() => {
            const start = performance.now();
            const result = computeValidationIssues(world.pieces, world.towers, world.connectors, world.baseCore);
            validationMs = performance.now() - start;
            return result;
          })()
        : previous.validationIssues;
    const influenceField =
      !previous || dirty.geometry || dirty.actors
        ? (() => {
            const start = performance.now();
            const result = computeInfluenceField(livePieces, liveTowers, world.actors, world.baseCore);
            influenceMs = performance.now() - start;
            return result;
          })()
        : previous.influenceField;
    const aiDebug =
      !previous || dirty.geometry || dirty.actors || dirty.structures || dirty.policy
        ? (() => {
            const start = performance.now();
            const result = computeAiDebug(world, { policy: aiPolicy, livePieces, liveTowers, topology, influenceField });
            aiMs = performance.now() - start;
            return result;
          })()
        : previous.aiDebug;
    const debugContacts =
      !previous || dirty.geometry || dirty.actors || dirty.structures || dirty.policy
        ? (() => {
            const start = performance.now();
            const result = computeDebugContacts(world, aiPolicy, aiDebug);
            contactsMs = performance.now() - start;
            return result;
          })()
        : previous.debugContacts;

    this.cached = {
      fingerprint,
      topology,
      validationIssues,
      influenceField,
      aiDebug,
      debugContacts
    };

    return {
      topology,
      validationIssues,
      influenceField,
      aiDebug,
      replayState,
      debugContacts,
      cache: {
        dirty,
        reused: {
          topology: Boolean(previous && !dirty.geometry),
          validation: Boolean(previous && !dirty.geometry),
          influence: Boolean(previous && !dirty.geometry && !dirty.actors),
          aiDebug: Boolean(previous && !dirty.geometry && !dirty.actors && !dirty.structures && !dirty.policy),
          debugContacts: Boolean(previous && !dirty.geometry && !dirty.actors && !dirty.structures && !dirty.policy)
        }
      },
      timings: {
        topologyMs,
        validationMs,
        influenceMs,
        aiMs,
        contactsMs,
        totalMs: performance.now() - totalStart
      }
    };
  }
}

const sharedAnalysisCache = new WorldAnalysisCache();

export function createWorldAnalysisCache(): WorldAnalysisCache {
  return new WorldAnalysisCache();
}

export function computeWorldAnalysis(world: WorldState, replayState: ReplayState, aiPolicy?: AiPolicyConfig): WorldAnalysisSnapshot {
  return sharedAnalysisCache.compute(world, replayState, aiPolicy);
}
