import type { ValidationIssue } from "../domain/analysis";
import { createGeometryAdapterSnapshot, type GeometryAdapterSnapshot } from "../kernel/adapterSnapshot";
import { createReplayState, FIXED_TIMESTEP, pushReplayFrame, replayStateFromSession, resetReplayToInitialWorld, runtimeReplaySignature, startReplayRecording } from "../simulation/replay";
import type { AiPolicyConfig } from "../simulation/aiPolicy";
import { DEFAULT_AI_POLICY } from "../simulation/aiPolicy";
import { computeWorldAnalysis, createWorldAnalysisCache, type WorldAnalysisSnapshot } from "../simulation/analysis";
import { stepSimulation, type InputState } from "../simulation/simulation";
import type { WorldState } from "../simulation/worldState";
import { cloneWorld, editorFromWorld } from "../simulation/worldState";
import { loadScenarioPreset } from "./scenarios";
import { createEnemyArchetype, exportEnemyBakeArtifact, type EnemyArchetype, type EnemyBakeArtifact } from "./enemies";
import type { ReplayCommand, ReplaySession, ReplayState } from "../domain/analysis";

export type HeatmapLayer = "pressure" | "coverage" | "chokepoint" | "vulnerability" | "dead-zone" | "flow";

export type CanonicalSnapshot = GeometryAdapterSnapshot;

export type ProfilerSample = Readonly<{
  tick: number;
  stepMs: number;
  analysisMs: number;
  pathActors: number;
  navigationSamples: number;
  blockers: number;
  validationCount: number;
}>;

export type WorldFrameDelta = Readonly<
  Partial<
    Pick<
      WorldState,
      "pieces" | "towers" | "connectors" | "surfaceTiles" | "actors" | "baseCore" | "run" | "aiMemory" | "worldSeed" | "tick" | "structures" | "combatLog" | "runtime" | "selectedId" | "phaseScenarioId"
    >
  >
>;

export type TimelineFrame = Readonly<{
  tick: number;
  checkpointJson?: string;
  delta?: WorldFrameDelta;
  worldHash: string;
  canonicalSnapshot: CanonicalSnapshot;
  profilerSample: ProfilerSample;
  validationIssues: ValidationIssue[];
}>;

export type StudioSelection =
  | Readonly<{ kind: "piece" | "tower" | "actor"; id: string }>
  | Readonly<{ kind: "base-core"; id: "base-core" }>
  | Readonly<{ kind: "snapshot"; id: string }>;

export type StudioDiff = Readonly<{
  changedPieceIds: string[];
  changedActorIds: string[];
  issueDelta: number;
  changedHash: boolean;
}>;

export type StudioSession = Readonly<{
  world: WorldState;
  selection?: StudioSelection;
  scenarioId: string;
  timeline: {
    playing: boolean;
    tick: number;
    frames: TimelineFrame[];
    compareTick: number;
  };
  replay: {
    session?: ReplaySession;
    state: ReplayState;
  };
  analysis: WorldAnalysisSnapshot;
  aiWorkbench: {
    policy: AiPolicyConfig;
  };
  enemyWorkbench: {
    seed: number;
    archetype: EnemyArchetype;
    exports: EnemyBakeArtifact[];
  };
  heatmapLayer: HeatmapLayer;
  diff: StudioDiff;
}>;

const TIMELINE_CHECKPOINT_INTERVAL = 8;
const WORLD_DELTA_FIELDS: Array<keyof WorldFrameDelta> = [
  "pieces",
  "towers",
  "connectors",
  "surfaceTiles",
  "actors",
  "baseCore",
  "run",
  "aiMemory",
  "worldSeed",
  "tick",
  "structures",
  "combatLog",
  "runtime",
  "selectedId",
  "phaseScenarioId"
];
const studioAnalysisCache = createWorldAnalysisCache();

export function createProfilerSample(tick: number, stepMs: number, analysisMs: number, analysis: WorldAnalysisSnapshot): ProfilerSample {
  return {
    tick,
    stepMs,
    analysisMs,
    pathActors: analysis.aiDebug.length,
    navigationSamples: analysis.aiDebug.reduce((total, entry) => total + entry.navigationSamples.length, 0),
    blockers: analysis.aiDebug.reduce((total, entry) => total + entry.blockingPieceIds.length, 0),
    validationCount: analysis.validationIssues.length
  };
}

function changed<T>(current: T, previous: T): boolean {
  return JSON.stringify(current) !== JSON.stringify(previous);
}

function createWorldDelta(previousWorld: WorldState, nextWorld: WorldState): WorldFrameDelta {
  const delta: Record<string, unknown> = {};
  for (const field of WORLD_DELTA_FIELDS) {
    if (changed(nextWorld[field], previousWorld[field])) {
      delta[field] = cloneWorld(nextWorld[field]);
    }
  }
  return delta as WorldFrameDelta;
}

function applyWorldDelta(world: WorldState, delta: WorldFrameDelta): WorldState {
  return {
    ...world,
    ...cloneWorld(delta)
  };
}

function createFrame(
  world: WorldState,
  tick: number,
  analysis: WorldAnalysisSnapshot,
  profiler: ProfilerSample,
  previousWorld?: WorldState
): TimelineFrame {
  const useCheckpoint = !previousWorld || tick % TIMELINE_CHECKPOINT_INTERVAL === 0;
  return {
    tick,
    checkpointJson: useCheckpoint ? JSON.stringify(cloneWorld(world)) : undefined,
    delta: useCheckpoint || !previousWorld ? undefined : createWorldDelta(previousWorld, world),
    worldHash: JSON.stringify(createGeometryAdapterSnapshot(world, "3d")),
    canonicalSnapshot: createGeometryAdapterSnapshot(world, "3d"),
    profilerSample: profiler,
    validationIssues: analysis.validationIssues
  };
}

export function materializeStudioTimelineWorld(frames: TimelineFrame[], tick: number): WorldState | undefined {
  const targetIndex = frames.findIndex((frame) => frame.tick === tick);
  if (targetIndex < 0) return undefined;

  let checkpointIndex = targetIndex;
  while (checkpointIndex >= 0 && !frames[checkpointIndex].checkpointJson) {
    checkpointIndex -= 1;
  }
  if (checkpointIndex < 0) return undefined;

  let world = JSON.parse(frames[checkpointIndex].checkpointJson!) as WorldState;
  for (let index = checkpointIndex + 1; index <= targetIndex; index += 1) {
    const delta = frames[index].delta;
    if (delta) world = applyWorldDelta(world, delta);
  }
  return world;
}

function computeDiff(frames: TimelineFrame[], compareTick: number, currentTick: number): StudioDiff {
  const current = frames.find((frame) => frame.tick === currentTick);
  const compare = frames.find((frame) => frame.tick === compareTick) ?? frames[0];
  if (!current || !compare) {
    return { changedPieceIds: [], changedActorIds: [], issueDelta: 0, changedHash: false };
  }
  const currentPiecesById = new Map(current.canonicalSnapshot.pieces.map((piece) => [piece.id, piece] as const));
  const comparePiecesById = new Map(compare.canonicalSnapshot.pieces.map((piece) => [piece.id, piece] as const));
  const changedPieceIds = current.canonicalSnapshot.pieces
    .filter((piece) => JSON.stringify(piece) !== JSON.stringify(comparePiecesById.get(piece.id)))
    .map((piece) => piece.id);
  const currentActorsById = new Map(current.canonicalSnapshot.actors.map((actor) => [actor.id, actor] as const));
  const compareActorsById = new Map(compare.canonicalSnapshot.actors.map((actor) => [actor.id, actor] as const));
  const changedActorIds = current.canonicalSnapshot.actors
    .filter((actor) => JSON.stringify(actor) !== JSON.stringify(compareActorsById.get(actor.id)))
    .map((actor) => actor.id);
  return {
    changedPieceIds: changedPieceIds.filter((id) => currentPiecesById.has(id)),
    changedActorIds: changedActorIds.filter((id) => currentActorsById.has(id)),
    issueDelta: current.validationIssues.length - compare.validationIssues.length,
    changedHash: current.worldHash !== compare.worldHash
  };
}

function buildEnemyWorkbench(seed: number) {
  const archetype = createEnemyArchetype(seed);
  return {
    seed,
    archetype,
    exports: [
      exportEnemyBakeArtifact(archetype, "procedural"),
      exportEnemyBakeArtifact(archetype, "bake"),
      exportEnemyBakeArtifact(archetype, "hybrid-placeholder")
    ]
  };
}

export function createStudioSession(scenarioId = "baseline", seed = 101): StudioSession {
  const world = loadScenarioPreset(scenarioId, seed);
  const replayState = createReplayState();
  const analysis = studioAnalysisCache.compute(world, replayState, DEFAULT_AI_POLICY);
  const profiler = createProfilerSample(0, 0, 0, analysis);
  const initialFrame = createFrame(world, 0, analysis, profiler);
  return {
    world,
    selection: world.selectedId ? { kind: "piece", id: world.selectedId } : undefined,
    scenarioId,
    timeline: {
      playing: false,
      tick: 0,
      frames: [initialFrame],
      compareTick: 0
    },
    replay: {
      state: replayState
    },
    analysis,
    aiWorkbench: {
      policy: DEFAULT_AI_POLICY
    },
    enemyWorkbench: buildEnemyWorkbench(seed),
    heatmapLayer: "pressure",
    diff: { changedPieceIds: [], changedActorIds: [], issueDelta: 0, changedHash: false }
  };
}

export function setStudioSelection(session: StudioSession, selection?: StudioSelection): StudioSession {
  return { ...session, selection };
}

export function setStudioScenario(session: StudioSession, scenarioId: string, seed = session.world.worldSeed || 101): StudioSession {
  return createStudioSession(scenarioId, seed);
}

export function setStudioHeatmapLayer(session: StudioSession, heatmapLayer: HeatmapLayer): StudioSession {
  return { ...session, heatmapLayer };
}

export function setStudioAiPolicy(session: StudioSession, policy: Partial<AiPolicyConfig>): StudioSession {
  const nextPolicy = { ...session.aiWorkbench.policy, ...policy };
  const analysis = studioAnalysisCache.compute(session.world, session.replay.state, nextPolicy);
  return {
    ...session,
    analysis,
    aiWorkbench: {
      policy: nextPolicy
    }
  };
}

export function setStudioEnemySeed(session: StudioSession, seed: number): StudioSession {
  return {
    ...session,
    enemyWorkbench: buildEnemyWorkbench(seed)
  };
}

export function startStudioReplayRecording(session: StudioSession): StudioSession {
  const replaySession = startReplayRecording(session.world);
  return {
    ...session,
    replay: {
      session: replaySession,
      state: replayStateFromSession(replaySession)
    }
  };
}

export function stopStudioReplayRecording(session: StudioSession): StudioSession {
  if (!session.replay.session) return session;
  const replaySession = { ...session.replay.session, status: "paused" as const };
  return {
    ...session,
    replay: {
      session: replaySession,
      state: replayStateFromSession(replaySession)
    }
  };
}

export function scrubStudioTimeline(session: StudioSession, tick: number): StudioSession {
  const world = materializeStudioTimelineWorld(session.timeline.frames, tick);
  if (!world) return session;
  const replayState = replayStateFromSession(session.replay.session);
  const analysis = studioAnalysisCache.compute(world, replayState, session.aiWorkbench.policy);
  return {
    ...session,
    world,
    analysis,
    timeline: {
      ...session.timeline,
      tick,
      playing: false
    },
    diff: computeDiff(session.timeline.frames, session.timeline.compareTick, tick)
  };
}

export function setStudioCompareTick(session: StudioSession, compareTick: number): StudioSession {
  return {
    ...session,
    timeline: {
      ...session.timeline,
      compareTick
    },
    diff: computeDiff(session.timeline.frames, compareTick, session.timeline.tick)
  };
}

export function replaceStudioWorld(session: StudioSession, world: WorldState, commands: ReplayCommand[] = []): StudioSession {
  const analysis = studioAnalysisCache.compute(world, session.replay.state, session.aiWorkbench.policy);
  const tick = session.timeline.tick + 1;
  const profiler = createProfilerSample(tick, 0, 0, analysis);
  const frame = createFrame(world, tick, analysis, profiler, session.world);
  const frames = [...session.timeline.frames.slice(-(180 - 1)), frame];
  const replaySession =
    session.replay.session?.status === "recording"
      ? pushReplayFrame(session.replay.session, tick, { move: { x: 0, z: 0 } }, commands, world)
      : session.replay.session;
  return {
    ...session,
    world,
    analysis,
    timeline: {
      ...session.timeline,
      tick,
      frames
    },
    replay: {
      session: replaySession,
      state: replayStateFromSession(replaySession)
    },
    diff: computeDiff(frames, session.timeline.compareTick, tick)
  };
}

export function stepStudioSession(session: StudioSession, input: InputState, commands: ReplayCommand[] = []): StudioSession {
  const stepStart = performance.now();
  const steppedWorld = stepSimulation(session.world, input, FIXED_TIMESTEP, session.aiWorkbench.policy);
  const stepMs = performance.now() - stepStart;
  const analysisStart = performance.now();
  const replayState = replayStateFromSession(session.replay.session);
  const analysis = studioAnalysisCache.compute(steppedWorld, replayState, session.aiWorkbench.policy);
  const analysisMs = performance.now() - analysisStart;
  const tick = session.timeline.tick + 1;
  const profiler = createProfilerSample(tick, stepMs, analysisMs, analysis);
  const frame = createFrame(steppedWorld, tick, analysis, profiler, session.world);
  const frames = [...session.timeline.frames.slice(-(180 - 1)), frame];
  const replaySession =
    session.replay.session?.status === "recording"
      ? pushReplayFrame(session.replay.session, tick, input, commands, steppedWorld)
      : session.replay.session;
  return {
    ...session,
    world: steppedWorld,
    analysis,
    timeline: {
      ...session.timeline,
      tick,
      frames
    },
    replay: {
      session: replaySession,
      state: replayStateFromSession(replaySession)
    },
    diff: computeDiff(frames, session.timeline.compareTick, tick)
  };
}

function applyReplayCommand(world: WorldState, command: ReplayCommand): WorldState {
  if (command.kind === "reset-studio") return loadScenarioPreset(world.phaseScenarioId ?? "baseline", world.worldSeed);
  const editorWorld = cloneWorld(world);
  const editor = editorFromWorld(editorWorld);
  if (command.kind === "toggle-gate") {
    const gate = world.pieces.find((piece) => piece.id === command.gateId && piece.kind === "gate");
    if (gate?.kind === "gate") editor.setGateState(gate.id, gate.state === "open" ? "closed" : "open");
  } else if (command.kind === "attach-tower") {
    editor.attachTowerToFenceTL(command.fenceId);
  } else if (command.kind === "erase-near") {
    editor.deleteNear(command.point, 0.4);
  } else if (command.kind === "place-segment") {
    editor.placeSegment(command.tool, command.a, command.b, command.state, { heightLayer: command.heightLayer });
  } else if (command.kind === "load-phase-scenario") {
    return loadScenarioPreset(command.scenarioId, command.seed);
  }
  return { ...world, pieces: editor.pieces, towers: editor.towers, connectors: editor.connectors };
}

export function replayStudioSession(session: StudioSession): StudioSession {
  const replaySession = session.replay.session;
  if (!replaySession) return session;
  let world = resetReplayToInitialWorld(replaySession);
  for (const frame of replaySession.frames) {
    for (const command of frame.commands) {
      world = applyReplayCommand(world, command);
    }
    world = stepSimulation(world, frame.input, FIXED_TIMESTEP, session.aiWorkbench.policy);
  }
  const finalSignature = runtimeReplaySignature(world);
  const recordedSignature = replaySession.frames.at(-1)?.signature;
  const nextReplay = {
    ...replaySession,
    status: "paused" as const,
    divergence: recordedSignature && recordedSignature !== finalSignature ? `expected ${recordedSignature} got ${finalSignature}` : undefined
  };
  const analysis = studioAnalysisCache.compute(world, replayStateFromSession(nextReplay), session.aiWorkbench.policy);
  return {
    ...session,
    world,
    analysis,
    replay: {
      session: nextReplay,
      state: replayStateFromSession(nextReplay)
    }
  };
}
