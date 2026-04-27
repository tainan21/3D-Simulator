import type { RuntimeBakeArtifact, RuntimeSession } from "../runtime/materialize";
import type { DebugOverlayOptions } from "../domain/debug";
import type { CameraMode3D, ThreeCameraState } from "../render/contracts";
import type { ReplaySession } from "../domain/analysis";
import type { Store } from "./store";
import type { PerformanceRegistry, PerformanceSnapshot, PerformancePresetConfig } from "./performance";
import type { BaseEditor, PlacementTool } from "../editor/baseEditor";
import type { StudioSession } from "../studio/session";
import type { WorldAnalysisSnapshot } from "../simulation/analysis";
import type { WorldState } from "../simulation/worldState";
import type { UniverseState, UniverseTickSummary } from "../domain/universe";

export type SurfaceId =
  | "hub"
  | "studio"
  | "runtime"
  | "phases"
  | "harness"
  | "replay"
  | "settings"
  | "debug"
  | "performance";

export type AppRoute = "/hub" | "/studio" | "/runtime" | "/phases" | "/harness" | "/replay" | "/settings" | "/debug" | "/performance";

export type SurfaceRole = "hub" | "editing" | "game" | "experiment" | "validation" | "diagnostic";

export type PerformancePreset = "quality" | "balanced" | "performance" | "debug-heavy";
export type ViewMode = "2d" | "25d" | "3d";
export type ToolMode = PlacementTool | "tower" | "erase" | "ramp" | "platform-link" | "player" | "enemy" | "dwarf" | "boss";
export type PhaseScenarioId = "baseline" | "height-lab" | "siege-lab" | "chunks-101";

export type SettingsState = Readonly<{
  preset: PerformancePreset;
  isMobile: boolean;
}>;

export type StudioWorkspaceState = Readonly<{
  session: StudioSession;
  view: ViewMode;
  tool: ToolMode;
  pendingPoint?: { x: number; z: number };
  hoverPoint?: { x: number; z: number };
  debugOverlays: DebugOverlayOptions;
  camera3D: ThreeCameraState;
}>;

export type HarnessState = Readonly<{
  debugOverlays: DebugOverlayOptions;
  camera3D: ThreeCameraState;
  show2D: boolean;
  show25D: boolean;
  show3D: boolean;
}>;

export type PhasesWorkspaceState = Readonly<{
  universe: UniverseState;
  universeTickSummaries: UniverseTickSummary[];
  scenarioId: string;
  seed: number;
  world: WorldState;
  editor: BaseEditor;
  analysis: WorldAnalysisSnapshot;
  mode: ViewMode;
  tool: ToolMode;
  pendingPoint?: { x: number; z: number };
  hoverPoint?: { x: number; z: number };
  debugOverlays: DebugOverlayOptions;
  camera3D: ThreeCameraState;
}>;

export type RuntimeWorkspaceState = Readonly<{
  artifact?: RuntimeBakeArtifact;
  session?: RuntimeSession;
  mode: ViewMode;
  debugOverlays: DebugOverlayOptions;
  camera3D: ThreeCameraState;
  replaySession?: ReplaySession;
}>;

export type ReplayRecord = Readonly<{
  id: string;
  label: string;
  source: "studio" | "runtime";
  createdAt: number;
  session: ReplaySession;
}>;

export type ReplayStoreState = Readonly<{
  records: ReplayRecord[];
  selectedId?: string;
}>;

export type AppStores = Readonly<{
  settingsStore: Store<SettingsState>;
  studioStore: Store<StudioWorkspaceState>;
  harnessStore: Store<HarnessState>;
  phasesStore: Store<PhasesWorkspaceState>;
  runtimeStore: Store<RuntimeWorkspaceState>;
  replayStore: Store<ReplayStoreState>;
}>;

export type SurfaceDiagnostics = Readonly<{
  surfaceId: SurfaceId;
  snapshot: PerformanceSnapshot;
}>;

export type SurfaceHandle = Readonly<{
  dispose: () => void;
  pause?: () => void;
  resume?: () => void;
  collectDiagnostics?: () => SurfaceDiagnostics;
}>;

export type AppShellBindings = Readonly<{
  root: HTMLElement;
  host: HTMLElement;
  status: HTMLElement;
  nav: HTMLElement;
}>;

export type AppSurfaceContext = Readonly<{
  route: AppRoute;
  surfaceId: SurfaceId;
  stores: AppStores;
  performance: PerformanceRegistry;
  shell: AppShellBindings;
  navigate: (route: AppRoute, options?: { replace?: boolean }) => void;
  getPresetConfig: () => PerformancePresetConfig;
}>;

export type AppSurfaceModule = Readonly<{
  mount: (host: HTMLElement, context: AppSurfaceContext) => SurfaceHandle | Promise<SurfaceHandle>;
}>;

export type SurfaceMeta = Readonly<{
  id: SurfaceId;
  route: AppRoute;
  title: string;
  shortTitle: string;
  role: SurfaceRole;
  description: string;
}>;

export type SurfaceLoader = () => Promise<AppSurfaceModule>;

export type CameraStateSeed = Readonly<{
  mode: CameraMode3D;
  yaw: number;
  pitch: number;
  distance: number;
  eyeHeight: number;
  focusTarget: "player" | "selected" | "core";
  panOffset: { x: number; z: number };
}>;
