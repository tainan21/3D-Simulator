import { DEFAULT_DEBUG_OVERLAYS } from "../domain/debug";
import { createUniverseState, materializeUniverseRegion } from "../domain/universe";
import { materializeRuntimeSession, type RuntimeBakeArtifact } from "../runtime/materialize";
import { computeWorldAnalysis } from "../simulation/analysis";
import { DEFAULT_AI_POLICY } from "../simulation/aiPolicy";
import { createReplayState } from "../simulation/replay";
import { editorFromWorld, createPhaseWorld } from "../simulation/worldState";
import { createStudioSession } from "../studio/session";
import type {
  AppStores,
  CameraStateSeed,
  HarnessState,
  PerformancePreset,
  PhasesWorkspaceState,
  ReplayRecord,
  ReplayStoreState,
  RuntimeWorkspaceState,
  SettingsState,
  StudioWorkspaceState
} from "./contracts";
import { createStore } from "./store";

const STORAGE_KEYS = {
  settings: "rogue-shell-settings",
  runtimeArtifact: "rogue-shell-runtime-artifact",
  replayRecords: "rogue-shell-replays"
} as const;

const DEFAULT_CAMERA: CameraStateSeed = {
  mode: "inspection",
  yaw: Math.PI * 0.62,
  pitch: -0.42,
  distance: 10.8,
  eyeHeight: 1,
  focusTarget: "core",
  panOffset: { x: 0, z: 0 }
};

const DEFAULT_STUDIO_CAMERA: CameraStateSeed = {
  mode: "inspection",
  yaw: Math.PI * 0.64,
  pitch: -0.48,
  distance: 12.5,
  eyeHeight: 1,
  focusTarget: "selected",
  panOffset: { x: 0, z: 0 }
};

function cloneDefaultDebugOverlays() {
  return {
    ...DEFAULT_DEBUG_OVERLAYS,
    enabled: false,
    endpoints: false,
    sockets: false,
    bounds: false,
    colliders: false,
    nearest: false,
    axes: false,
    pivots: false,
    facing: false,
    routes: false,
    targets: false,
    navigation: false,
    influence: false,
    damage: false,
    diagnostics: false
  };
}

function readJson<T>(key: string): T | undefined {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

function writeJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore persistence failures.
  }
}

function detectMobile(): boolean {
  return window.matchMedia("(max-width: 720px)").matches;
}

function initialPreset(isMobile: boolean): PerformancePreset {
  return isMobile ? "performance" : "balanced";
}

function loadSettings(): SettingsState {
  const isMobile = detectMobile();
  const stored = readJson<Partial<SettingsState>>(STORAGE_KEYS.settings);
  return {
    preset: stored?.preset ?? initialPreset(isMobile),
    isMobile
  };
}

function loadRuntimeArtifact(): RuntimeBakeArtifact | undefined {
  return readJson<RuntimeBakeArtifact>(STORAGE_KEYS.runtimeArtifact);
}

function loadReplayRecords(): ReplayStoreState {
  const records = readJson<ReplayRecord[]>(STORAGE_KEYS.replayRecords) ?? [];
  return { records };
}

export function persistRuntimeArtifact(artifact?: RuntimeBakeArtifact): void {
  if (!artifact) return;
  writeJson(STORAGE_KEYS.runtimeArtifact, artifact);
}

export function persistReplayRecords(records: ReplayRecord[]): void {
  writeJson(STORAGE_KEYS.replayRecords, records);
}

export function createAppStores(): AppStores {
  const settings = loadSettings();
  const universe = createUniverseState(101);
  const phasesMaterialized = materializeUniverseRegion(universe);
  const phasesWorld = phasesMaterialized.world;
  const studioSession = createStudioSession();
  const storedArtifact = loadRuntimeArtifact();
  const runtime = storedArtifact ? materializeRuntimeSession(storedArtifact) : undefined;

  const settingsStore = createStore<SettingsState>(settings);
  settingsStore.subscribe((next) => writeJson(STORAGE_KEYS.settings, next));

  const studioStore = createStore<StudioWorkspaceState>({
    session: studioSession,
    view: "25d",
    tool: "fence",
    debugOverlays: cloneDefaultDebugOverlays(),
    camera3D: { ...DEFAULT_STUDIO_CAMERA }
  });

  const harnessStore = createStore<HarnessState>({
    debugOverlays: { ...cloneDefaultDebugOverlays(), enabled: true, diagnostics: true, bounds: true },
    camera3D: { ...DEFAULT_STUDIO_CAMERA },
    show2D: !settings.isMobile,
    show25D: true,
    show3D: true
  });

  const phasesStore = createStore<PhasesWorkspaceState>({
    universe,
    universeTickSummaries: [],
    scenarioId: phasesMaterialized.region.scenarioId,
    seed: phasesMaterialized.region.seed,
    world: phasesWorld,
    editor: editorFromWorld(phasesWorld),
    analysis: computeWorldAnalysis(phasesWorld, createReplayState(), DEFAULT_AI_POLICY),
    mode: "25d",
    tool: "fence",
    debugOverlays: cloneDefaultDebugOverlays(),
    camera3D: { ...DEFAULT_CAMERA }
  });

  const runtimeStore = createStore<RuntimeWorkspaceState>({
    artifact: storedArtifact,
    session: runtime,
    mode: "3d",
    debugOverlays: cloneDefaultDebugOverlays(),
    camera3D: { ...DEFAULT_CAMERA },
    replaySession: undefined
  });

  runtimeStore.subscribe((state) => {
    if (state.artifact) persistRuntimeArtifact(state.artifact);
  });

  const replayStore = createStore(loadReplayRecords());
  replayStore.subscribe((state) => persistReplayRecords(state.records));

  return {
    settingsStore,
    studioStore,
    harnessStore,
    phasesStore,
    runtimeStore,
    replayStore
  };
}
