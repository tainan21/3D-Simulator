import { BaseEditor } from "../../editor/baseEditor";
import { pieceHorizontalBounds, pieceSockets, type BasePiece, type HeightLayer, type HeightConnector, type TowerPiece } from "../../domain/canonical";
import { buildBaseGraph } from "../../domain/baseGraph";
import type { DebugOverlayOptions } from "../../domain/debug";
import { canonicalGeometrySignature } from "../../kernel/adapterSnapshot";
import { clamp, distance, type Vec2 } from "../../kernel/vector";
import { WORLD_UNIT_LABEL } from "../../kernel/worldUnits";
import { PhaserGeometryRenderer } from "../../render/phaserGeometryRenderer";
import type { CameraMode3D, RenderDataProvider, ThreeCameraState, ViewportCamera2D } from "../../render/contracts";
import { ThreeValidationRenderer } from "../../render/threeValidationRenderer";
import { createRuntimeBakeArtifact, materializeRuntimeSession } from "../../runtime/materialize";
import { FIXED_TIMESTEP } from "../../simulation/replay";
import { DEFAULT_AI_POLICY } from "../../simulation/aiPolicy";
import { createStructureMap } from "../../simulation/structures";
import { enemyPreviewSvg } from "../../studio/enemies";
import { STUDIO_SCENARIOS } from "../../studio/scenarios";
import {
  materializeStudioTimelineWorld,
  replayStudioSession,
  replaceStudioWorld,
  scrubStudioTimeline,
  setStudioAiPolicy,
  setStudioCompareTick,
  setStudioEnemySeed,
  setStudioHeatmapLayer,
  setStudioScenario,
  setStudioSelection,
  startStudioReplayRecording,
  stepStudioSession,
  stopStudioReplayRecording,
  type HeatmapLayer,
  type StudioSelection
} from "../../studio/session";
import type { AppRoute, AppSurfaceContext, SurfaceHandle, ToolMode } from "../contracts";
import { createCleanupBag, createKeyboardState, type RendererHandle, updatePerformanceSnapshot } from "./common";

const TOOLS: ToolMode[] = ["fence", "fence-tl", "gate", "tower", "erase"];
const STUDIO_CAMERA_MODES: CameraMode3D[] = ["tactical", "inspection"];
const OVERLAY_KEYS: Array<Exclude<keyof DebugOverlayOptions, "enabled">> = [
  "endpoints",
  "sockets",
  "bounds",
  "colliders",
  "nearest",
  "axes",
  "pivots",
  "facing",
  "routes",
  "targets",
  "navigation",
  "influence",
  "damage",
  "diagnostics"
];

type LayerFilter = "all" | HeightLayer;

export class StudioSurfaceController {
  private readonly cleanups = createCleanupBag();
  private readonly keyboard = createKeyboardState();
  private readonly renderers = new Map<string, RendererHandle>();
  private readonly rendererCanvasCleanups: Array<() => void> = [];
  private raf = 0;
  private paused = false;
  private lastTick = performance.now();
  private accumulator = 0;
  private hudStamp = 0;
  private frameMs = 0;
  private simMs = 0;
  private isDraggingCamera = false;
  private lastPointer?: { x: number; y: number };
  private layerFilter: LayerFilter = "all";
  private isolateSelection = false;
  private ghostPreviousFrame = false;
  private issueCursor = -1;

  constructor(
    private readonly host: HTMLElement,
    private readonly context: AppSurfaceContext
  ) {}

  mount(): SurfaceHandle {
    const loopCleanup = this.context.performance.trackLoop("studio:loop");
    this.cleanups.add(loopCleanup);
    this.keyboard.attach(this.cleanups);
    this.renderFrame();
    this.attachEvents();
    this.mountRenderers();
    this.updateHud(true);
    this.raf = requestAnimationFrame(this.loop);
    this.cleanups.add(() => cancelAnimationFrame(this.raf));
    return {
      dispose: () => this.dispose(),
      pause: () => {
        this.paused = true;
        this.renderers.forEach((renderer) => renderer.pause?.());
      },
      resume: () => {
        this.paused = false;
        this.renderers.forEach((renderer) => renderer.resume?.());
      },
      collectDiagnostics: () => ({
        surfaceId: "studio",
        snapshot: this.context.performance.getSnapshot()
      })
    };
  }

  private dispose(): void {
    while (this.rendererCanvasCleanups.length > 0) this.rendererCanvasCleanups.pop()?.();
    this.renderers.forEach((renderer) => renderer.destroy());
    this.renderers.clear();
    this.cleanups.dispose();
    this.host.innerHTML = "";
  }

  private get state() {
    return this.context.stores.studioStore.getState();
  }

  private setState(updater: Parameters<typeof this.context.stores.studioStore.setState>[0]) {
    return this.context.stores.studioStore.setState(updater);
  }

  private get session() {
    return this.state.session;
  }

  private renderFrame(): void {
    this.host.innerHTML = `
      <section class="studio-shell" data-testid="studio-shell">
        <div class="hud app-menu" data-testid="workspace-menu">
          <button data-route="/studio">Studio</button>
          <button data-route="/phases">Fases</button>
          <button data-route="/runtime">Runtime</button>
        </div>
        <header class="studio-topbar hud">
          <div class="brand">Studio Geometrico</div>
          <div id="studio-status" class="status-line"></div>
          <div class="studio-toolbar" data-testid="studio-toolbar">
            <label>Scenario
              <select data-studio-field="scenario">
                ${STUDIO_SCENARIOS.map((scenario) => `<option value="${scenario.id}" ${scenario.id === this.session.scenarioId ? "selected" : ""}>${scenario.name}</option>`).join("")}
              </select>
            </label>
            <label>Heatmap
              <select data-studio-field="heatmap">
                ${(["pressure", "coverage", "chokepoint", "vulnerability", "dead-zone", "flow"] as const)
                  .map((entry) => `<option value="${entry}" ${entry === this.session.heatmapLayer ? "selected" : ""}>${entry}</option>`)
                  .join("")}
              </select>
            </label>
            <label>Layer
              <select data-studio-field="layer-filter">
                <option value="all" ${this.layerFilter === "all" ? "selected" : ""}>all</option>
                <option value="0" ${this.layerFilter === 0 ? "selected" : ""}>0</option>
                <option value="1" ${this.layerFilter === 1 ? "selected" : ""}>1</option>
                <option value="2" ${this.layerFilter === 2 ? "selected" : ""}>2+</option>
              </select>
            </label>
            <button data-studio-action="play">${this.session.timeline.playing ? "Pause" : "Play"}</button>
            <button data-studio-action="step">Step</button>
            <button data-studio-action="record">${this.session.replay.session?.status === "recording" ? "Stop Rec" : "Record"}</button>
            <button data-studio-action="replay">Replay</button>
            <button data-studio-action="snapshot">Snapshot</button>
            <button data-studio-action="bake-runtime">Bake Runtime</button>
            <button data-studio-action="toggle-gate">Gate</button>
            <button data-studio-action="jump-issue">Jump issue</button>
            <button data-studio-action="ghost-frame" class="${this.ghostPreviousFrame ? "active" : ""}">Ghost</button>
            <button data-studio-action="isolate-selection" class="${this.isolateSelection ? "active" : ""}">Isolar</button>
          </div>
        </header>
        <section class="studio-layout">
          <section class="studio-center">
            <div class="studio-harness" data-testid="studio-harness">
              <article class="studio-view-card">
                <div class="studio-view-meta"><strong>2D</strong><span>debug/editor</span></div>
                <div id="studio-host-2d" class="studio-canvas-host" data-testid="studio-host-2d"></div>
              </article>
              <article class="studio-view-card">
                <div class="studio-view-meta"><strong>2.5D</strong><span>modo principal</span></div>
                <div id="studio-host-25d" class="studio-canvas-host" data-testid="studio-host-25d"></div>
              </article>
              <article class="studio-view-card">
                <div class="studio-view-meta">
                  <strong>3D</strong>
                  <span>validador espacial</span>
                  <div class="studio-inline-buttons">
                    ${STUDIO_CAMERA_MODES.map((mode) => `<button data-studio-camera="${mode}">${this.cameraModeLabel(mode)}</button>`).join("")}
                    <button data-studio-focus="player">Player</button>
                    <button data-studio-focus="selected">Selected</button>
                    <button data-studio-focus="core">Core</button>
                  </div>
                </div>
                <div id="studio-host-3d" class="studio-canvas-host" data-testid="studio-host-3d"></div>
              </article>
            </div>
            <div id="studio-bottom" class="studio-bottom-panel" data-testid="studio-bottom"></div>
          </section>
          <aside id="studio-side" class="studio-side-panel" data-testid="studio-side"></aside>
        </section>
        <pre id="studio-signature" class="sr-only" data-testid="canonical-signature"></pre>
      </section>
    `;
  }

  private attachEvents(): void {
    const onClick = (event: Event) => this.handleClick(event as MouseEvent);
    const onChange = (event: Event) => this.handleChange(event);
    const onInput = (event: Event) => this.handleInput(event);
    const onWheel = (event: WheelEvent) => {
      if (this.state.camera3D.mode === "first-person") return;
      event.preventDefault();
      this.setState((current) => ({
        ...current,
        camera3D: { ...current.camera3D, distance: clamp(current.camera3D.distance + Math.sign(event.deltaY) * 0.8, 4.5, 20) }
      }));
      this.updateHud(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      this.isDraggingCamera = true;
      this.lastPointer = { x: event.clientX, y: event.clientY };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!this.isDraggingCamera || !this.lastPointer) return;
      const dx = event.clientX - this.lastPointer.x;
      const dy = event.clientY - this.lastPointer.y;
      this.lastPointer = { x: event.clientX, y: event.clientY };
      this.setState((current) => ({
        ...current,
        camera3D: {
          ...current.camera3D,
          yaw: current.camera3D.yaw + dx * 0.008,
          pitch: clamp(current.camera3D.pitch - dy * 0.006, -1.1, 0.72)
        }
      }));
    };
    const onPointerUp = () => {
      this.isDraggingCamera = false;
      this.lastPointer = undefined;
    };

    this.host.addEventListener("click", onClick);
    this.host.addEventListener("change", onChange);
    this.host.addEventListener("input", onInput);
    this.host.querySelector("#studio-host-3d")?.addEventListener("wheel", onWheel as EventListener, { passive: false });
    this.host.querySelector("#studio-host-3d")?.addEventListener("pointerdown", onPointerDown as EventListener);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    this.cleanups.add(() => this.host.removeEventListener("click", onClick));
    this.cleanups.add(() => this.host.removeEventListener("change", onChange));
    this.cleanups.add(() => this.host.removeEventListener("input", onInput));
    this.cleanups.add(() => this.host.querySelector("#studio-host-3d")?.removeEventListener("wheel", onWheel as EventListener));
    this.cleanups.add(() => this.host.querySelector("#studio-host-3d")?.removeEventListener("pointerdown", onPointerDown as EventListener));
    this.cleanups.add(() => window.removeEventListener("pointermove", onPointerMove));
    this.cleanups.add(() => window.removeEventListener("pointerup", onPointerUp));
  }

  private provider(): RenderDataProvider {
    const ghostWorld = this.filteredGhostWorld();
    return {
      getWorld: () => this.filteredStudioWorld(),
      getGhostWorld: ghostWorld ? () => ghostWorld : undefined,
      getDebugOptions: () => this.state.debugOverlays,
      getDebugContacts: () => this.session.analysis.debugContacts,
      getAiDebug: () => this.session.analysis.aiDebug,
      getValidationIssues: () => this.session.analysis.validationIssues,
      getInfluenceField: () => this.session.analysis.influenceField,
      getReplayState: () => this.session.replay.state
    };
  }

  private mountRenderers(): void {
    while (this.rendererCanvasCleanups.length > 0) this.rendererCanvasCleanups.pop()?.();
    this.renderers.forEach((renderer) => renderer.destroy());
    this.renderers.clear();

    const provider = this.provider();
    const host2D = this.host.querySelector<HTMLElement>("#studio-host-2d");
    const host25D = this.host.querySelector<HTMLElement>("#studio-host-25d");
    const host3D = this.host.querySelector<HTMLElement>("#studio-host-3d");

    if (host2D) {
      const renderer = new PhaserGeometryRenderer({
        ...provider,
        parent: host2D,
        mode: "2d",
        getCamera: () => this.studioCamera2D("2d"),
        getDraftSegment: () => this.draftSegment(),
        onWorldClick: (point) => this.handleWorldClick(point),
        onWorldHover: (point) => this.setState((current) => ({ ...current, hoverPoint: point })),
        interactionEnabled: true
      }) as unknown as RendererHandle;
      (renderer as unknown as PhaserGeometryRenderer).mount();
      this.renderers.set("2d", renderer);
      const canvas = host2D.querySelector("canvas");
      if (canvas) this.rendererCanvasCleanups.push(this.context.performance.trackCanvas("studio:2d"));
    }

    if (host25D) {
      const renderer = new PhaserGeometryRenderer({
        ...provider,
        parent: host25D,
        mode: "25d",
        getCamera: () => this.studioCamera2D("25d"),
        getDraftSegment: () => this.draftSegment(),
        onWorldClick: (point) => this.handleWorldClick(point),
        onWorldHover: (point) => this.setState((current) => ({ ...current, hoverPoint: point })),
        interactionEnabled: true
      }) as unknown as RendererHandle;
      (renderer as unknown as PhaserGeometryRenderer).mount();
      this.renderers.set("25d", renderer);
      const canvas = host25D.querySelector("canvas");
      if (canvas) this.rendererCanvasCleanups.push(this.context.performance.trackCanvas("studio:25d"));
    }

    if (host3D) {
      const renderer = new ThreeValidationRenderer({
        ...provider,
        parent: host3D,
        getCameraState: () => this.state.camera3D
      }) as unknown as RendererHandle;
      (renderer as unknown as ThreeValidationRenderer).mount();
      this.renderers.set("3d", renderer);
      const canvas = host3D.querySelector("canvas");
      if (canvas) this.rendererCanvasCleanups.push(this.context.performance.trackCanvas("studio:3d"));
    }
  }

  private readonly loop = (time: number): void => {
    const dt = Math.min(0.05, (time - this.lastTick) / 1000);
    this.lastTick = time;
    if (!this.paused) {
      const frameStart = performance.now();
      if (this.session.timeline.playing) {
        this.accumulator += dt;
        while (this.accumulator >= FIXED_TIMESTEP) {
          const simStart = performance.now();
          const session = stepStudioSession(this.session, this.inputState(), []);
          this.simMs = performance.now() - simStart;
          this.setState((current) => ({ ...current, session }));
          this.accumulator -= FIXED_TIMESTEP;
        }
      }
      this.frameMs = performance.now() - frameStart;
      this.updateHud();
      updatePerformanceSnapshot(this.context, "studio", this.frameMs, this.simMs, this.session.analysis, this.session.world, this.renderers.get("3d"));
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  private updateHud(force = false): void {
    const now = performance.now();
    if (!force && now - this.hudStamp < 120) return;
    this.hudStamp = now;
    this.host.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((button) => button.classList.toggle("active", button.dataset.tool === this.state.tool));
    this.host.querySelectorAll<HTMLButtonElement>("[data-studio-camera]").forEach((button) => button.classList.toggle("active", button.dataset.studioCamera === this.state.camera3D.mode));
    this.host.querySelectorAll<HTMLButtonElement>("[data-studio-focus]").forEach((button) => button.classList.toggle("active", button.dataset.studioFocus === this.state.camera3D.focusTarget));
    const status = this.host.querySelector<HTMLElement>("#studio-status");
    const side = this.host.querySelector<HTMLElement>("#studio-side");
    const bottom = this.host.querySelector<HTMLElement>("#studio-bottom");
    const signature = this.host.querySelector<HTMLElement>("#studio-signature");
    const sig = canonicalGeometrySignature(this.session.world);
    if (signature) signature.textContent = sig;
    if (status) status.textContent = `${WORLD_UNIT_LABEL} | scenario ${this.session.scenarioId} | tick ${this.session.timeline.tick} | frames ${this.session.timeline.frames.length}`;
    if (side) side.innerHTML = this.sideHtml();
    if (bottom) bottom.innerHTML = this.bottomHtml();
  }

  private sideHtml(): string {
    const graph = buildBaseGraph(this.session.world.pieces);
    const selected = this.session.selection;
    const selectedPiece = selected?.kind === "piece" ? this.session.world.pieces.find((piece) => piece.id === selected.id) : undefined;
    const selectedTower = selected?.kind === "tower" ? this.session.world.towers.find((tower) => tower.id === selected.id) : undefined;
    const selectedActor = selected?.kind === "actor" ? this.session.world.actors.find((actor) => actor.id === selected.id) : undefined;
    const currentFrame = this.session.timeline.frames.find((frame) => frame.tick === this.session.timeline.tick) ?? this.session.timeline.frames.at(-1);
    const enemy = this.session.enemyWorkbench.archetype;
    return `
      <section class="studio-panel-block">
        <h2>Inspector canonico</h2>
        <div class="workspace-button-grid">
          ${TOOLS.map((tool) => `<button data-tool="${tool}" class="${this.state.tool === tool ? "active" : ""}">${this.toolLabel(tool)}</button>`).join("")}
        </div>
        <div class="studio-selection-list">
          ${this.session.world.pieces.map((piece) => `<button data-select-kind="piece" data-select-id="${piece.id}">${piece.id}</button>`).join("")}
          ${this.session.world.towers.map((tower) => `<button data-select-kind="tower" data-select-id="${tower.id}">${tower.id}</button>`).join("")}
          ${this.session.world.actors.map((actor) => `<button data-select-kind="actor" data-select-id="${actor.id}">${actor.id}</button>`).join("")}
          <button data-select-kind="base-core" data-select-id="base-core">base-core</button>
        </div>
        <dl>
          <dt>Selection</dt><dd>${selected ? `${selected.kind}:${selected.id}` : "none"}</dd>
          <dt>A/B</dt><dd>${selectedPiece ? `A(${selectedPiece.a.x},${selectedPiece.a.z}) B(${selectedPiece.b.x},${selectedPiece.b.z})` : "-"}</dd>
          <dt>Bounds</dt><dd>${selectedPiece ? JSON.stringify(pieceHorizontalBounds(selectedPiece)) : selectedActor ? `r=${selectedActor.radius} h=${selectedActor.height}` : "-"}</dd>
          <dt>Sockets</dt><dd>${selectedPiece ? pieceSockets(selectedPiece).map((socket) => `${socket.kind}@${socket.position.y.toFixed(1)}`).join(" | ") : selectedTower ? `anchor=(${selectedTower.anchor.x.toFixed(2)},${selectedTower.anchor.y.toFixed(2)},${selectedTower.anchor.z.toFixed(2)})` : "-"}</dd>
          <dt>Layer</dt><dd>${this.layerFilter}</dd>
          <dt>Ghost</dt><dd>${this.ghostPreviousFrame ? "on" : "off"}</dd>
          <dt>Snapshot</dt><dd><pre class="studio-pre">${currentFrame ? JSON.stringify(currentFrame.canonicalSnapshot, null, 2).slice(0, 1200) : ""}</pre></dd>
        </dl>
      </section>
      <section class="studio-panel-block">
        <h2>Validador + grafo</h2>
        <dl>
          <dt>Nodes/edges</dt><dd>${graph.nodes.length} / ${graph.edges.length}</dd>
          <dt>Sockets</dt><dd>${graph.sockets.length}</dd>
          <dt>Issues</dt><dd>${this.session.analysis.validationIssues.map((issue) => `${issue.severity}:${issue.kind}`).join(" | ") || "sem issues"}</dd>
          <dt>Dirty</dt><dd>${Object.entries(this.session.analysis.cache.dirty).filter(([, value]) => value).map(([key]) => key).join(" | ") || "reused"}</dd>
        </dl>
      </section>
      <section class="studio-panel-block">
        <h2>Workbench AI</h2>
        <div class="studio-slider-list">
          ${this.policySlider("fovDegrees", "FOV", this.session.aiWorkbench.policy.fovDegrees, 60, 160, 1)}
          ${this.policySlider("visionRange", "Vision", this.session.aiWorkbench.policy.visionRange, 3, 14, 0.5)}
          ${this.policySlider("openGateBias", "Open gate", this.session.aiWorkbench.policy.openGateBias, -3, 1, 0.1)}
          ${this.policySlider("closedGateBias", "Closed gate", this.session.aiWorkbench.policy.closedGateBias, -1, 3, 0.1)}
        </div>
        <dl>
          <dt>Targets</dt><dd>${this.session.analysis.aiDebug.map((entry) => `${entry.actorId}:${entry.objective}`).join(" | ") || "-"}</dd>
          <dt>LOS/FOV</dt><dd>${this.session.analysis.aiDebug.map((entry) => `${entry.actorId}:${entry.perception.visible ? "vis" : "hidden"}/${entry.perception.withinFov ? "fov" : "out"}`).join(" | ") || "-"}</dd>
        </dl>
      </section>
      <section class="studio-panel-block">
        <h2>Enemy generator</h2>
        <label>Seed <input type="number" data-studio-field="enemy-seed" value="${this.session.enemyWorkbench.seed}" /></label>
        <div class="enemy-preview-grid" data-testid="enemy-previews">
          <div class="enemy-preview-card"><span>2D</span>${enemyPreviewSvg(enemy, "2d")}</div>
          <div class="enemy-preview-card"><span>2.5D</span>${enemyPreviewSvg(enemy, "25d")}</div>
          <div class="enemy-preview-card"><span>3D</span>${enemyPreviewSvg(enemy, "3d")}</div>
        </div>
      </section>
    `;
  }

  private bottomHtml(): string {
    const currentFrame = this.session.timeline.frames.find((frame) => frame.tick === this.session.timeline.tick) ?? this.session.timeline.frames.at(-1);
    const profiler = currentFrame?.profilerSample;
    const spark = this.session.timeline.frames.slice(-18).map((frame) => Math.round(Math.min(9, frame.profilerSample.analysisMs + frame.profilerSample.stepMs))).join(" ");
    return `
      <section class="studio-bottom-grid">
        <div class="studio-panel-block">
          <h2>Timeline + replay</h2>
          <label>Tick
            <input type="range" min="0" max="${Math.max(0, this.session.timeline.frames.at(-1)?.tick ?? 0)}" value="${this.session.timeline.tick}" data-studio-field="timeline" />
          </label>
          <label>Compare
            <input type="range" min="0" max="${Math.max(0, this.session.timeline.frames.at(-1)?.tick ?? 0)}" value="${this.session.timeline.compareTick}" data-studio-field="compare" />
          </label>
          <dl>
            <dt>Replay</dt><dd>${this.session.replay.state.status} seed=${this.session.replay.state.seed} total=${this.session.replay.state.totalFrames}</dd>
            <dt>Divergence</dt><dd>${this.session.replay.session?.divergence ?? "-"}</dd>
            <dt>Checkpoint</dt><dd>${currentFrame?.checkpointJson ? "full" : "delta"}</dd>
          </dl>
        </div>
        <div class="studio-panel-block">
          <h2>Profiler geometrico</h2>
          <dl>
            <dt>Step ms</dt><dd>${profiler?.stepMs.toFixed(3) ?? "0.000"}</dd>
            <dt>Analysis ms</dt><dd>${profiler?.analysisMs.toFixed(3) ?? "0.000"}</dd>
            <dt>AI ms</dt><dd>${this.session.analysis.timings.aiMs.toFixed(3)}</dd>
            <dt>Nav samples</dt><dd>${profiler?.navigationSamples ?? 0}</dd>
            <dt>Spark</dt><dd>${spark || "-"}</dd>
          </dl>
        </div>
        <div class="studio-panel-block">
          <h2>Quick tools</h2>
          <dl>
            <dt>Layer filter</dt><dd>${this.layerFilter}</dd>
            <dt>Isolate selection</dt><dd>${this.isolateSelection ? "on" : "off"}</dd>
            <dt>Ghost prev frame</dt><dd>${this.ghostPreviousFrame ? "on" : "off"}</dd>
            <dt>Heatmap</dt><dd>${this.session.heatmapLayer}</dd>
          </dl>
        </div>
      </section>
    `;
  }

  private handleClick(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLElement>("button");
    if (!button) return;
    if (button.dataset.route) {
      this.context.navigate(button.dataset.route as AppRoute);
      return;
    }
    if (button.dataset.tool) {
      this.setState((current) => ({ ...current, tool: button.dataset.tool as ToolMode, pendingPoint: undefined }));
      this.updateHud(true);
      return;
    }
    if (button.dataset.studioCamera) {
      this.setState((current) => ({ ...current, camera3D: { ...current.camera3D, mode: button.dataset.studioCamera as CameraMode3D } }));
      this.updateHud(true);
      return;
    }
    if (button.dataset.studioFocus) {
      this.setState((current) => ({ ...current, camera3D: { ...current.camera3D, focusTarget: button.dataset.studioFocus as ThreeCameraState["focusTarget"] } }));
      this.updateHud(true);
      return;
    }
    if (button.dataset.selectKind && button.dataset.selectId) {
      const selection =
        button.dataset.selectKind === "base-core"
          ? ({ kind: "base-core", id: "base-core" } as const)
          : ({ kind: button.dataset.selectKind as Exclude<StudioSelection["kind"], "base-core">, id: button.dataset.selectId } as const);
      this.applySelection(selection);
      return;
    }
    switch (button.dataset.studioAction) {
      case "play":
        this.setState((current) => ({ ...current, session: { ...current.session, timeline: { ...current.session.timeline, playing: !current.session.timeline.playing } } }));
        this.updateHud(true);
        return;
      case "step":
        this.setState((current) => ({ ...current, session: stepStudioSession(current.session, this.inputState(), []) }));
        this.mountRenderers();
        this.updateHud(true);
        return;
      case "record":
        this.setState((current) => ({
          ...current,
          session:
            current.session.replay.session?.status === "recording" ? stopStudioReplayRecording(current.session) : startStudioReplayRecording(current.session)
        }));
        this.updateHud(true);
        return;
      case "replay":
        this.setState((current) => ({ ...current, session: replayStudioSession(current.session) }));
        this.mountRenderers();
        this.updateHud(true);
        return;
      case "snapshot":
        this.setState((current) => ({ ...current, session: replaceStudioWorld(current.session, current.session.world, []) }));
        this.updateHud(true);
        return;
      case "bake-runtime":
        this.bakeRuntime();
        return;
      case "toggle-gate":
        this.toggleSelectedGate();
        return;
      case "jump-issue":
        this.jumpToIssue();
        return;
      case "ghost-frame":
        this.ghostPreviousFrame = !this.ghostPreviousFrame;
        this.mountRenderers();
        this.updateHud(true);
        return;
      case "isolate-selection":
        this.isolateSelection = !this.isolateSelection;
        this.mountRenderers();
        this.updateHud(true);
        return;
      default:
        break;
    }
    if (button.dataset.overlay) {
      const key = button.dataset.overlay as Exclude<keyof DebugOverlayOptions, "enabled">;
      this.setState((current) => ({ ...current, debugOverlays: { ...current.debugOverlays, [key]: !current.debugOverlays[key] } }));
      this.mountRenderers();
      this.updateHud(true);
    }
  }

  private handleChange(event: Event): void {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLSelectElement && target.dataset.studioField === "scenario") {
      this.setState((current) => ({ ...current, session: setStudioScenario(current.session, target.value), pendingPoint: undefined, hoverPoint: undefined }));
      this.mountRenderers();
      this.updateHud(true);
      return;
    }
    if (target instanceof HTMLSelectElement && target.dataset.studioField === "heatmap") {
      this.setState((current) => ({ ...current, session: setStudioHeatmapLayer(current.session, target.value as HeatmapLayer) }));
      this.updateHud(true);
      return;
    }
    if (target instanceof HTMLSelectElement && target.dataset.studioField === "layer-filter") {
      this.layerFilter = target.value === "all" ? "all" : (Number(target.value) as HeightLayer);
      this.mountRenderers();
      this.updateHud(true);
    }
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLInputElement && target.dataset.studioField === "timeline") {
      this.setState((current) => ({ ...current, session: scrubStudioTimeline(current.session, Number(target.value)) }));
      this.mountRenderers();
      this.updateHud(true);
      return;
    }
    if (target instanceof HTMLInputElement && target.dataset.studioField === "compare") {
      this.setState((current) => ({ ...current, session: setStudioCompareTick(current.session, Number(target.value)) }));
      this.updateHud(true);
      return;
    }
    if (target instanceof HTMLInputElement && target.dataset.studioField === "enemy-seed") {
      this.setState((current) => ({ ...current, session: setStudioEnemySeed(current.session, Number(target.value)) }));
      this.updateHud(true);
      return;
    }
    if (target instanceof HTMLInputElement && target.dataset.studioPolicy) {
      const key = target.dataset.studioPolicy as keyof typeof DEFAULT_AI_POLICY;
      this.setState((current) => ({ ...current, session: setStudioAiPolicy(current.session, { [key]: Number(target.value) } as Partial<typeof DEFAULT_AI_POLICY>) }));
      this.updateHud(true);
    }
  }

  private studioCamera2D(mode: "2d" | "25d"): ViewportCamera2D {
    const target = this.resolveFocusPoint(this.filteredStudioWorld(), this.session.selection, this.state.camera3D.focusTarget);
    return {
      target: { x: target.x, z: target.z },
      zoom: mode === "2d" ? 0.54 : 0.5
    };
  }

  private resolveFocusPoint(world: typeof this.session.world, selection: StudioSelection | undefined, focusTarget: ThreeCameraState["focusTarget"]) {
    if (focusTarget === "player") {
      const player = world.actors.find((actor) => actor.kind === "player");
      if (player) return { x: player.position.x, y: player.baseY + 1, z: player.position.z };
    }
    if (focusTarget === "selected" && selection) {
      if (selection.kind === "piece") {
        const piece = world.pieces.find((entry) => entry.id === selection.id);
        if (piece) return { x: (piece.a.x + piece.b.x) * 0.5, y: piece.baseY + piece.height * 0.5, z: (piece.a.z + piece.b.z) * 0.5 };
      }
      if (selection.kind === "tower") {
        const tower = world.towers.find((entry) => entry.id === selection.id);
        if (tower) return { x: tower.anchor.x, y: tower.anchor.y + tower.height * 0.5, z: tower.anchor.z };
      }
      if (selection.kind === "actor") {
        const actor = world.actors.find((entry) => entry.id === selection.id);
        if (actor) return { x: actor.position.x, y: actor.baseY + actor.height * 0.5, z: actor.position.z };
      }
    }
    return { x: world.baseCore.position.x, y: world.baseCore.baseY + world.baseCore.height, z: world.baseCore.position.z };
  }

  private draftSegment() {
    if (!this.state.pendingPoint || !this.state.hoverPoint || this.state.tool === "tower" || this.state.tool === "erase") return undefined;
    return this.state.session.world.selectedId ? this.editorForSession().previewSegment(this.state.tool, this.state.pendingPoint, this.state.hoverPoint) : this.editorForSession().previewSegment(this.state.tool, this.state.pendingPoint, this.state.hoverPoint);
  }

  private editorForSession(): BaseEditor {
    return new BaseEditor({ version: 2, pieces: this.session.world.pieces, towers: this.session.world.towers, connectors: this.session.world.connectors });
  }

  private handleWorldClick(point: Vec2): void {
    if (this.state.tool === "tower") {
      const fence = this.findNearestTL(point);
      if (!fence || fence.kind !== "fence-tl" || fence.towerId) return;
      const editor = this.editorForSession();
      const tower = editor.attachTowerToFenceTL(fence.id);
      const world = {
        ...this.session.world,
        pieces: editor.pieces,
        towers: editor.towers,
        connectors: editor.connectors,
        selectedId: tower.fenceId,
        structures: createStructureMap(editor.pieces, editor.towers, this.session.world.baseCore, this.session.world.run.baseCoreMaxHp)
      };
      this.setState((current) => ({
        ...current,
        session: setStudioSelection(replaceStudioWorld(current.session, world), { kind: "piece", id: tower.fenceId })
      }));
      this.mountRenderers();
      this.updateHud(true);
      return;
    }
    if (this.state.tool === "erase") {
      const editor = this.editorForSession();
      editor.deleteNear(point, 0.45);
      const world = {
        ...this.session.world,
        pieces: editor.pieces,
        towers: editor.towers,
        connectors: editor.connectors,
        selectedId: undefined,
        structures: createStructureMap(editor.pieces, editor.towers, this.session.world.baseCore, this.session.world.run.baseCoreMaxHp)
      };
      this.setState((current) => ({ ...current, session: replaceStudioWorld(current.session, world), pendingPoint: undefined, hoverPoint: undefined }));
      this.mountRenderers();
      this.updateHud(true);
      return;
    }
    if (!this.state.pendingPoint) {
      this.setState((current) => ({ ...current, pendingPoint: point }));
      this.updateHud(true);
      return;
    }
    const editor = this.editorForSession();
    const piece = editor.placeSegment(this.state.tool, this.state.pendingPoint, point);
    const world = {
      ...this.session.world,
      pieces: editor.pieces,
      towers: editor.towers,
      connectors: editor.connectors,
      selectedId: piece.id,
      structures: createStructureMap(editor.pieces, editor.towers, this.session.world.baseCore, this.session.world.run.baseCoreMaxHp)
    };
    this.setState((current) => ({
      ...current,
      session: setStudioSelection(replaceStudioWorld(current.session, world), { kind: "piece", id: piece.id }),
      pendingPoint: undefined,
      hoverPoint: undefined
    }));
    this.mountRenderers();
    this.updateHud(true);
  }

  private applySelection(selection: StudioSelection): void {
    const selectedId =
      selection.kind === "piece"
        ? selection.id
        : selection.kind === "tower"
          ? this.session.world.towers.find((tower) => tower.id === selection.id)?.fenceId
          : undefined;
    const world = { ...this.session.world, selectedId };
    this.setState((current) => ({
      ...current,
      session: setStudioSelection(replaceStudioWorld(current.session, world), selection),
      camera3D: {
        ...current.camera3D,
        focusTarget: selection.kind === "base-core" ? "core" : "selected"
      }
    }));
    this.mountRenderers();
    this.updateHud(true);
  }

  private toggleSelectedGate(): void {
    const selectedPieceId = this.session.selection?.kind === "piece" ? this.session.selection.id : undefined;
    const gate =
      (selectedPieceId ? this.session.world.pieces.find((piece) => piece.id === selectedPieceId && piece.kind === "gate") : undefined) ??
      this.session.world.pieces.find((piece) => piece.kind === "gate");
    if (!gate || gate.kind !== "gate") return;
    const editor = this.editorForSession();
    editor.setGateState(gate.id, gate.state === "open" ? "closed" : "open");
    const world = { ...this.session.world, pieces: editor.pieces, towers: editor.towers, connectors: editor.connectors, selectedId: gate.id };
    this.setState((current) => ({ ...current, session: setStudioSelection(replaceStudioWorld(current.session, world), { kind: "piece", id: gate.id }) }));
    this.mountRenderers();
    this.updateHud(true);
  }

  private jumpToIssue(): void {
    const issues = this.session.analysis.validationIssues;
    if (issues.length === 0) return;
    this.issueCursor = (this.issueCursor + 1) % issues.length;
    const issue = issues[this.issueCursor];
    const relatedId = issue.relatedIds[0];
    if (relatedId) {
      const piece = this.session.world.pieces.find((entry) => entry.id === relatedId);
      if (piece) {
        this.applySelection({ kind: "piece", id: piece.id });
        return;
      }
      const tower = this.session.world.towers.find((entry) => entry.id === relatedId);
      if (tower) {
        this.applySelection({ kind: "tower", id: tower.id });
        return;
      }
    }
    this.setState((current) => ({ ...current, camera3D: { ...current.camera3D, focusTarget: "core", panOffset: { x: issue.position.x - this.session.world.baseCore.position.x, z: issue.position.z - this.session.world.baseCore.position.z } } }));
    this.updateHud(true);
  }

  private bakeRuntime(): void {
    const artifact = createRuntimeBakeArtifact(this.session.world, "studio", `Studio ${this.session.scenarioId}`, this.session.timeline.tick, this.session.scenarioId);
    const session = materializeRuntimeSession(artifact);
    this.context.stores.runtimeStore.setState((current) => ({ ...current, artifact, session, replaySession: undefined }));
    this.context.navigate("/runtime");
  }

  private findNearestTL(point: Vec2): BasePiece | undefined {
    return this.session.world.pieces
      .filter((piece) => piece.kind === "fence-tl")
      .map((piece) => ({ piece, d: distance(point, { x: (piece.a.x + piece.b.x) * 0.5, z: (piece.a.z + piece.b.z) * 0.5 }) }))
      .sort((a, b) => a.d - b.d)[0]?.piece;
  }

  private inputState() {
    return {
      move: { x: 0, z: 0 },
      attack: false
    };
  }

  private filteredStudioWorld() {
    const world = this.session.world;
    const selectedId = this.isolateSelection ? this.session.selection?.id : undefined;
    const pieces = world.pieces.filter((piece) => this.matchesLayer(piece.heightLayer) && this.matchesSelection(piece.id));
    const towers = world.towers.filter((tower) => this.matchesLayer(tower.heightLayer) && this.matchesSelection(tower.id, tower.fenceId));
    const connectors = world.connectors.filter((connector) => this.matchesConnector(connector));
    const actors = world.actors.filter((actor) => this.matchesLayer(actor.heightLayer) && this.matchesSelection(actor.id));
    const baseCore = this.matchesLayer(world.baseCore.heightLayer) && (!selectedId || this.session.selection?.kind === "base-core") ? world.baseCore : { ...world.baseCore };
    return {
      ...world,
      pieces,
      towers,
      connectors,
      actors,
      baseCore
    };
  }

  private filteredGhostWorld() {
    if (!this.ghostPreviousFrame || this.session.timeline.tick <= 0) return undefined;
    const ghost = materializeStudioTimelineWorld(this.session.timeline.frames, Math.max(0, this.session.timeline.tick - 1));
    if (!ghost) return undefined;
    const original = this.session.world;
    const tempSession = { ...this.session, world: ghost };
    return {
      ...ghost,
      pieces: ghost.pieces.filter((piece) => this.matchesLayer(piece.heightLayer) && this.matchesSelection(piece.id)),
      towers: ghost.towers.filter((tower) => this.matchesLayer(tower.heightLayer) && this.matchesSelection(tower.id, tower.fenceId)),
      connectors: ghost.connectors.filter((connector) => this.matchesConnector(connector)),
      actors: ghost.actors.filter((actor) => this.matchesLayer(actor.heightLayer) && this.matchesSelection(actor.id)),
      baseCore: this.matchesLayer(ghost.baseCore.heightLayer) && (!this.isolateSelection || tempSession.selection?.kind === "base-core") ? ghost.baseCore : original.baseCore
    };
  }

  private matchesLayer(layer: HeightLayer): boolean {
    if (this.layerFilter === "all") return true;
    if (this.layerFilter === 2) return layer >= 2;
    return layer === this.layerFilter;
  }

  private matchesSelection(id: string, fallbackId?: string): boolean {
    if (!this.isolateSelection || !this.session.selection) return true;
    if (this.session.selection.kind === "piece") return this.session.selection.id === id || this.session.selection.id === fallbackId;
    if (this.session.selection.kind === "tower") return this.session.selection.id === id;
    if (this.session.selection.kind === "actor") return this.session.selection.id === id;
    return false;
  }

  private matchesConnector(connector: HeightConnector): boolean {
    const matchesLayer = this.layerFilter === "all" || connector.from.layer === this.layerFilter || connector.to.layer === this.layerFilter || (this.layerFilter === 2 && (connector.from.layer >= 2 || connector.to.layer >= 2));
    if (!matchesLayer) return false;
    if (!this.isolateSelection || !this.session.selection) return true;
    return this.matchesSelection(connector.from.pieceId ?? "", connector.to.pieceId ?? "") || this.matchesSelection(connector.to.pieceId ?? "", connector.from.pieceId ?? "");
  }

  private toolLabel(tool: ToolMode): string {
    if (tool === "fence") return "Cerca";
    if (tool === "fence-tl") return "Cerca TL";
    if (tool === "gate") return "Portao";
    if (tool === "tower") return "Torre";
    return "Apagar";
  }

  private cameraModeLabel(mode: CameraMode3D): string {
    return mode === "tactical" ? "Tactical" : "Inspect";
  }

  private policySlider(key: keyof typeof DEFAULT_AI_POLICY, label: string, value: number, min: number, max: number, step: number): string {
    return `<label>${label}<input type="range" data-studio-policy="${key}" min="${min}" max="${max}" step="${step}" value="${value}" /><span>${value}</span></label>`;
  }
}
