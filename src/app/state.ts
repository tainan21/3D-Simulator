import { DEFAULT_DEBUG_OVERLAYS } from "../domain/debug";
import { createUniverseState, materializeUniverseRegion } from "../domain/universe";
import { DEFAULT_CHARACTER_ARCHETYPE, type CharacterArchetype } from "../domain/entityArchetype";
import { materializeRuntimeSession, type RuntimeBakeArtifact } from "../runtime/materialize";
import { computeWorldAnalysis } from "../simulation/analysis";
import { DEFAULT_AI_POLICY } from "../simulation/aiPolicy";
import { createReplayState } from "../simulation/replay";
import { editorFromWorld } from "../simulation/worldState";
import { createStudioSession } from "../studio/session";
import { archetypeRepository } from "../infrastructure/repo/archetypeRepository";
import { mobRepository } from "../infrastructure/repo/mobRepository";
import {
  runtimeArtifactRepository,
  readLatestRuntimeArtifact,
} from "../infrastructure/repo/runtimeArtifactRepository";
import { replayRepository } from "../infrastructure/repo/replayRepository";
import { readSetting, writeSetting } from "../infrastructure/repo/settingsRepository";
import type {
  AppStores,
  CharacterStudioState,
  CameraStateSeed,
  HarnessState,
  PerformancePreset,
  PhasesWorkspaceState,
  ReplayRecord,
  ReplayStoreState,
  RuntimeWorkspaceState,
  SettingsState,
  StudioWorkspaceState,
} from "./contracts";
import { createStore } from "./store";

// Chaves canônicas em settingsRepository (sucessoras das antigas chaves de localStorage).
// A migração one-shot já populou estas chaves a partir dos saves legados.
const SETTING_KEYS = {
  preset: "settings:preset",
  charactersUi: "characters:ui",
} as const;

interface CharactersUiPrefs {
  selectedId?: string;
  view?: CharacterStudioState["view"];
  camera3D?: CameraStateSeed;
  archetypeId?: string;
}

const DEFAULT_CAMERA: CameraStateSeed = {
  mode: "inspection",
  yaw: Math.PI * 0.62,
  pitch: -0.42,
  distance: 10.8,
  eyeHeight: 1,
  focusTarget: "core",
  panOffset: { x: 0, z: 0 },
};

const DEFAULT_STUDIO_CAMERA: CameraStateSeed = {
  mode: "inspection",
  yaw: Math.PI * 0.64,
  pitch: -0.48,
  distance: 12.5,
  eyeHeight: 1,
  focusTarget: "selected",
  panOffset: { x: 0, z: 0 },
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
    diagnostics: false,
  };
}

function detectMobile(): boolean {
  return window.matchMedia("(max-width: 720px)").matches;
}

function initialPreset(isMobile: boolean): PerformancePreset {
  return isMobile ? "performance" : "balanced";
}

function loadSettings(): SettingsState {
  const isMobile = detectMobile();
  const storedPreset = readSetting<PerformancePreset>(SETTING_KEYS.preset);
  return {
    preset: storedPreset ?? initialPreset(isMobile),
    isMobile,
  };
}

function loadRuntimeArtifact(): RuntimeBakeArtifact | undefined {
  return readLatestRuntimeArtifact();
}

function loadReplayRecords(): ReplayStoreState {
  const records = replayRepository()
    .snapshot()
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);
  return { records };
}

function loadCharacters(): CharacterStudioState {
  const ui = readSetting<CharactersUiPrefs>(SETTING_KEYS.charactersUi);
  const storedArchetypes = archetypeRepository().snapshot();
  const cachedMobs = mobRepository()
    .snapshot()
    .map((record) => record.archetype);

  // Library: mobs do Forge primeiro, depois archetypes salvos, depois DEFAULT
  // como fallback. Dedupe por id preservando a ordem original.
  const library: CharacterArchetype[] = [];
  const seen = new Set<string>();
  for (const entry of [...cachedMobs, ...storedArchetypes, DEFAULT_CHARACTER_ARCHETYPE]) {
    if (!seen.has(entry.id)) {
      seen.add(entry.id);
      library.push(entry);
    }
  }

  // Archetype selecionado: ID das prefs → fallback library[0] → default.
  const archetype =
    library.find((entry) => entry.id === ui?.archetypeId) ??
    library[0] ??
    DEFAULT_CHARACTER_ARCHETYPE;

  return {
    archetype,
    library,
    selectedId: ui?.selectedId ?? archetype.id,
    view: ui?.view ?? "25d",
    camera3D: ui?.camera3D ?? { ...DEFAULT_STUDIO_CAMERA },
  };
}

export function persistRuntimeArtifact(artifact?: RuntimeBakeArtifact): void {
  if (!artifact) return;
  // Repository é sync para o cache em memória; flush é diferido (idle + debounce).
  runtimeArtifactRepository().upsert(artifact);
}

export function persistReplayRecords(records: ReplayRecord[]): void {
  const repo = replayRepository();
  const desired = new Map(records.filter((r) => r?.id).map((r) => [r.id, r]));
  const current = new Map(repo.snapshot().map((r) => [r.id, r]));

  // Remove os que sumiram.
  for (const id of current.keys()) {
    if (!desired.has(id)) repo.remove(id);
  }
  // Upsert todos os atuais (dedupe interno via equals).
  for (const record of desired.values()) {
    repo.upsert(record);
  }
}

function persistCharactersUi(state: CharacterStudioState): void {
  // Archetype atual e library inteira: deixa o repo dedupe via equals.
  archetypeRepository().upsert(state.archetype);
  for (const entry of state.library) {
    archetypeRepository().upsert(entry);
  }
  writeSetting<CharactersUiPrefs>(SETTING_KEYS.charactersUi, {
    selectedId: state.selectedId,
    view: state.view,
    camera3D: state.camera3D,
    archetypeId: state.archetype.id,
  });
}

export function createAppStores(): AppStores {
  const settings = loadSettings();
  const universe = createUniverseState(101);
  const phasesMaterialized = materializeUniverseRegion(universe);
  const phasesWorld = phasesMaterialized.world;
  const studioSession = createStudioSession();
  const characters = loadCharacters();
  const storedArtifact = loadRuntimeArtifact();
  const runtime = storedArtifact ? materializeRuntimeSession(storedArtifact) : undefined;

  const settingsStore = createStore<SettingsState>(settings);
  settingsStore.subscribe((next) => writeSetting(SETTING_KEYS.preset, next.preset));

  const studioStore = createStore<StudioWorkspaceState>({
    session: studioSession,
    view: "25d",
    tool: "fence",
    debugOverlays: cloneDefaultDebugOverlays(),
    camera3D: { ...DEFAULT_STUDIO_CAMERA },
  });

  const characterStudioStore = createStore<CharacterStudioState>(characters);
  characterStudioStore.subscribe(persistCharactersUi);

  const harnessStore = createStore<HarnessState>({
    debugOverlays: { ...cloneDefaultDebugOverlays(), enabled: true, diagnostics: true, bounds: true },
    camera3D: { ...DEFAULT_STUDIO_CAMERA },
    show2D: !settings.isMobile,
    show25D: true,
    show3D: true,
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
    camera3D: { ...DEFAULT_CAMERA },
  });

  const runtimeStore = createStore<RuntimeWorkspaceState>({
    artifact: storedArtifact,
    session: runtime,
    mode: "3d",
    debugOverlays: cloneDefaultDebugOverlays(),
    camera3D: { ...DEFAULT_CAMERA },
    replaySession: undefined,
  });

  runtimeStore.subscribe((state) => {
    if (state.artifact) persistRuntimeArtifact(state.artifact);
  });

  const replayStore = createStore(loadReplayRecords());
  replayStore.subscribe((state) => persistReplayRecords(state.records));

  return {
    settingsStore,
    studioStore,
    characterStudioStore,
    harnessStore,
    phasesStore,
    runtimeStore,
    replayStore,
  };
}
