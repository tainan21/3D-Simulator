import { BaseEditor, type PlacementTool } from "../../editor/baseEditor";
import {
  createActor,
  pieceHorizontalBounds,
  pieceSockets,
  type Actor,
  type ActorKind,
  type BaseCore,
  type BasePiece,
  type HeightConnector,
  type HeightLayer,
  type TowerPiece
} from "../../domain/canonical";
import { buildBaseGraph } from "../../domain/baseGraph";
import type { DebugOverlayOptions } from "../../domain/debug";
import { canonicalGeometrySignature } from "../../kernel/adapterSnapshot";
import { clamp, distance, normalize, type Vec2 } from "../../kernel/vector";
import { formatMeters, WORLD_UNIT_LABEL } from "../../kernel/worldUnits";
import { PhaserGeometryRenderer } from "../../render/phaserGeometryRenderer";
import type { CameraMode3D, RenderDataProvider, ThreeCameraState, ViewportCamera2D } from "../../render/contracts";
import { ThreeValidationRenderer } from "../../render/threeValidationRenderer";
import { createRuntimeBakeArtifact, materializeRuntimeSession } from "../../runtime/materialize";
import { FIXED_TIMESTEP } from "../../simulation/replay";
import { DEFAULT_AI_POLICY } from "../../simulation/aiPolicy";
import { createStructureMap } from "../../simulation/structures";
import { enemyPreviewSvg } from "../../studio/enemies";
import { createGeometryParityReport } from "../../studio/geometryParity";
import { applyStudioRecipe, STUDIO_RECIPES, type StudioRecipeId } from "../../studio/recipes";
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
import type { AppRoute, AppSurfaceContext, SurfaceHandle, ToolMode, ViewMode } from "../contracts";
import { createCleanupBag, createKeyboardState, type RendererHandle, updatePerformanceSnapshot } from "./common";

const BASE_TOOLS: ToolMode[] = ["fence", "fence-tl", "gate", "tower", "ramp", "platform-link", "erase"];
const ACTOR_TOOLS: ToolMode[] = ["player", "enemy", "dwarf", "boss"];
const STUDIO_CAMERA_MODES: CameraMode3D[] = ["tactical", "inspection", "first-person"];
const STUDIO_VIEWS: ViewMode[] = ["2d", "25d", "3d"];
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
  "diagnostics",
  "shadows",
  "fog",
  "grid",
  "lighting",
  "effects"
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
      <section class="studio-shell studio-view-${this.state.view}" data-testid="studio-shell">
        <nav class="studio-route-tabs" data-testid="workspace-menu">
          <button data-route="/studio">Studio</button>
          <button data-route="/phases">Fases</button>
          <button data-route="/runtime">Runtime</button>
        </nav>
        <header class="studio-topbar">
          <div class="studio-title-block">
            <div class="brand">Studio Geometrico</div>
            <div id="studio-status" class="status-line"></div>
          </div>
          <div class="studio-view-switch" aria-label="Studio view switch">
            ${STUDIO_VIEWS.map((view) => `<button data-studio-view="${view}" class="${this.state.view === view ? "active" : ""}">${this.viewLabel(view)}</button>`).join("")}
          </div>
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
            <button data-studio-action="bake-runtime">Bake</button>
            <button data-studio-action="toggle-gate">Gate</button>
          </div>
        </header>
        <section class="studio-layout">
          <aside id="studio-left" class="studio-left-panel" data-testid="studio-left">
            <section class="studio-panel-block">
              <h2>Menu da base</h2>
              <div class="studio-palette-grid">
                ${BASE_TOOLS.map((tool) => this.toolPaletteButton(tool)).join("")}
              </div>
            </section>
            <section class="studio-panel-block">
              <h2>Menu do Studio</h2>
              <p class="muted">Adicionar mobs e validar escala/altura no mesmo mundo canonico.</p>
              <div class="studio-palette-grid">
                ${ACTOR_TOOLS.map((tool) => this.toolPaletteButton(tool)).join("")}
              </div>
            </section>
            <section class="studio-panel-block">
              <details>
                <summary>Objetos</summary>
              <div class="studio-selection-list compact">
                ${this.session.world.pieces.map((piece) => `<button data-select-kind="piece" data-select-id="${piece.id}">${piece.properties.displayName} ${piece.id}</button>`).join("")}
                ${this.session.world.towers.map((tower) => `<button data-select-kind="tower" data-select-id="${tower.id}">${tower.properties.displayName} ${tower.id}</button>`).join("")}
                ${this.session.world.actors.map((actor) => `<button data-select-kind="actor" data-select-id="${actor.id}">${actor.properties.displayName} ${actor.id}</button>`).join("")}
                <button data-select-kind="base-core" data-select-id="base-core">${this.session.world.baseCore.properties.displayName}</button>
              </div>
              </details>
            </section>
          </aside>
          <section class="studio-center">
            <div class="studio-harness" data-testid="studio-harness">
              <article class="studio-view-card ${this.state.view === "2d" ? "active-view" : "mini-view"}" data-studio-view-card="2d">
                <div class="studio-view-meta"><strong>2D</strong><span>debug/editor</span></div>
                <div id="studio-host-2d" class="studio-canvas-host" data-testid="studio-host-2d"></div>
              </article>
              <article class="studio-view-card ${this.state.view === "25d" ? "active-view" : "mini-view"}" data-studio-view-card="25d">
                <div class="studio-view-meta"><strong>2.5D</strong><span>modo principal</span></div>
                <div id="studio-host-25d" class="studio-canvas-host" data-testid="studio-host-25d"></div>
              </article>
              <article class="studio-view-card ${this.state.view === "3d" ? "active-view" : "mini-view"}" data-studio-view-card="3d">
                <div class="studio-view-meta">
                  <strong>3D</strong>
                  <span>${this.state.camera3D.mode === "first-person" ? "FPS play" : "validador espacial"}</span>
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
      if (this.state.view !== "3d" || this.state.camera3D.mode === "first-person") return;
      event.preventDefault();
      this.setState((current) => ({
        ...current,
        camera3D: { ...current.camera3D, distance: clamp(current.camera3D.distance + Math.sign(event.deltaY) * 0.8, 4.5, 20) }
      }));
      this.updateHud(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (this.state.view !== "3d") return;
      if (this.state.camera3D.mode === "first-person") {
        const canvas = this.host.querySelector<HTMLCanvasElement>("#studio-host-3d canvas");
        if (canvas && event.target === canvas) void canvas.requestPointerLock?.();
        return;
      }
      this.isDraggingCamera = true;
      this.lastPointer = { x: event.clientX, y: event.clientY };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!this.isDraggingCamera || !this.lastPointer || this.state.camera3D.mode === "first-person") return;
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
    const onMouseMove = (event: MouseEvent) => {
      if (this.state.view !== "3d" || this.state.camera3D.mode !== "first-person") return;
      const canvas = this.host.querySelector<HTMLCanvasElement>("#studio-host-3d canvas");
      if (!canvas || document.pointerLockElement !== canvas) return;
      this.setState((current) => ({
        ...current,
        camera3D: {
          ...current.camera3D,
          yaw: current.camera3D.yaw + event.movementX * 0.0024,
          pitch: clamp(current.camera3D.pitch - event.movementY * 0.0018, -1.15, 0.9)
        }
      }));
    };

    this.host.addEventListener("click", onClick);
    this.host.addEventListener("change", onChange);
    this.host.addEventListener("input", onInput);
    this.host.querySelector("#studio-host-3d")?.addEventListener("wheel", onWheel as EventListener, { passive: false });
    this.host.querySelector("#studio-host-3d")?.addEventListener("pointerdown", onPointerDown as EventListener);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("mousemove", onMouseMove);

    this.cleanups.add(() => this.host.removeEventListener("click", onClick));
    this.cleanups.add(() => this.host.removeEventListener("change", onChange));
    this.cleanups.add(() => this.host.removeEventListener("input", onInput));
    this.cleanups.add(() => this.host.querySelector("#studio-host-3d")?.removeEventListener("wheel", onWheel as EventListener));
    this.cleanups.add(() => this.host.querySelector("#studio-host-3d")?.removeEventListener("pointerdown", onPointerDown as EventListener));
    this.cleanups.add(() => window.removeEventListener("pointermove", onPointerMove));
    this.cleanups.add(() => window.removeEventListener("pointerup", onPointerUp));
    this.cleanups.add(() => window.removeEventListener("mousemove", onMouseMove));
  }

  private provider(): RenderDataProvider {
    return {
      getWorld: () => this.filteredStudioWorld(),
      getGhostWorld: () => this.filteredGhostWorld(),
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
    this.host.querySelector<HTMLElement>(".studio-shell")?.classList.toggle("studio-view-2d", this.state.view === "2d");
    this.host.querySelector<HTMLElement>(".studio-shell")?.classList.toggle("studio-view-25d", this.state.view === "25d");
    this.host.querySelector<HTMLElement>(".studio-shell")?.classList.toggle("studio-view-3d", this.state.view === "3d");
    this.host.querySelectorAll<HTMLButtonElement>("[data-studio-view]").forEach((button) => button.classList.toggle("active", button.dataset.studioView === this.state.view));
    this.host.querySelectorAll<HTMLElement>("[data-studio-view-card]").forEach((card) => {
      const active = card.dataset.studioViewCard === this.state.view;
      card.classList.toggle("active-view", active);
      card.classList.toggle("mini-view", !active);
    });
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
    const selectedCore = selected?.kind === "base-core" ? this.session.world.baseCore : undefined;
    const currentFrame = this.session.timeline.frames.find((frame) => frame.tick === this.session.timeline.tick) ?? this.session.timeline.frames.at(-1);
    const enemy = this.session.enemyWorkbench.archetype;
    const parity = createGeometryParityReport(this.session.world);
    return `
      <section class="studio-panel-block parity-gate ${parity.ok ? "ok" : "fail"}" data-testid="geometry-parity-gate">
        <h2>Geometry parity gate</h2>
        <dl>
          <dt>Status</dt><dd>${parity.ok ? "OK: 2D = 2.5D = 3D" : `FAIL: ${parity.mismatchedAdapters.join(" | ")}`}</dd>
          <dt>Objects</dt><dd>${parity.checks.map((check) => `${check.adapter}:${check.objectCount}`).join(" | ")}</dd>
          <dt>3D hash</dt><dd>${parity.baselineSignature.slice(0, 34)}...</dd>
        </dl>
      </section>
      <section class="studio-panel-block">
        <h2>Inspector canonico</h2>
        <dl>
          <dt>Selection</dt><dd>${selected ? `${selected.kind}:${selected.id}` : "none"}</dd>
          <dt>Type</dt><dd>${selectedPiece?.properties.type ?? selectedTower?.properties.type ?? selectedActor?.properties.type ?? selectedCore?.properties.type ?? "-"}</dd>
          <dt>A/B</dt><dd>${selectedPiece ? `A(${selectedPiece.a.x},${selectedPiece.a.z}) B(${selectedPiece.b.x},${selectedPiece.b.z})` : "-"}</dd>
          <dt>Bounds</dt><dd>${selectedPiece ? JSON.stringify(pieceHorizontalBounds(selectedPiece)) : selectedActor ? `r=${selectedActor.radius} h=${selectedActor.height}` : "-"}</dd>
          <dt>Sockets</dt><dd>${selectedPiece ? pieceSockets(selectedPiece).map((socket) => `${socket.kind}@${socket.position.y.toFixed(1)}`).join(" | ") : selectedTower ? `anchor=(${selectedTower.anchor.x.toFixed(2)},${selectedTower.anchor.y.toFixed(2)},${selectedTower.anchor.z.toFixed(2)})` : "-"}</dd>
          <dt>Layer</dt><dd>${this.layerFilter}</dd>
          <dt>Ghost</dt><dd>${this.ghostPreviousFrame ? "on" : "off"}</dd>
          <dt>Snapshot</dt><dd>${currentFrame ? `tick ${currentFrame.tick} | ${canonicalGeometrySignature(this.session.world).slice(0, 28)}...` : "-"}</dd>
        </dl>
        ${this.objectPropertiesHtml(selectedPiece, selectedTower, selectedActor, selectedCore)}
      </section>
      <section class="studio-panel-block">
        <details>
          <summary>Validador + grafo</summary>
        <dl>
          <dt>Nodes/edges</dt><dd>${graph.nodes.length} / ${graph.edges.length}</dd>
          <dt>Sockets</dt><dd>${graph.sockets.length}</dd>
          <dt>Issues</dt><dd>${this.session.analysis.validationIssues.map((issue) => `${issue.severity}:${issue.kind}`).join(" | ") || "sem issues"}</dd>
          <dt>Dirty</dt><dd>${Object.entries(this.session.analysis.cache.dirty).filter(([, value]) => value).map(([key]) => key).join(" | ") || "reused"}</dd>
        </dl>
        </details>
      </section>
      <section class="studio-panel-block">
        <details>
          <summary>Recipe builder</summary>
        <div class="studio-recipe-grid">
          ${STUDIO_RECIPES.map((recipe) => `<button data-studio-recipe="${recipe.id}"><strong>${recipe.label}</strong><span>${recipe.intent}</span></button>`).join("")}
        </div>
        </details>
      </section>
      <section class="studio-panel-block">
        <details>
          <summary>Workbench AI</summary>
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
        </details>
      </section>
      <section class="studio-panel-block">
        <details>
          <summary>Enemy generator</summary>
        <label>Seed <input type="number" data-studio-field="enemy-seed" value="${this.session.enemyWorkbench.seed}" /></label>
        <div class="enemy-preview-grid" data-testid="enemy-previews">
          <div class="enemy-preview-card"><span>2D</span>${enemyPreviewSvg(enemy, "2d")}</div>
          <div class="enemy-preview-card"><span>2.5D</span>${enemyPreviewSvg(enemy, "25d")}</div>
          <div class="enemy-preview-card"><span>3D</span>${enemyPreviewSvg(enemy, "3d")}</div>
        </div>
        </details>
      </section>
    `;
  }

  private objectPropertiesHtml(
    selectedPiece?: BasePiece,
    selectedTower?: TowerPiece,
    selectedActor?: Actor,
    selectedCore?: BaseCore
  ): string {
    const object = selectedPiece ?? selectedTower ?? selectedActor ?? selectedCore;
    if (!object) return `<div class="object-props muted">Selecione um objeto para editar propriedades de v1.</div>`;
    const props = object.properties;
    const width = props.measurement.widthM;
    return `
      <div class="object-props">
        <h3>Propriedades editaveis</h3>
        <label>Nome
          <input data-object-prop="displayName" value="${props.displayName}" />
        </label>
        <label>Altura
          <input type="number" min="0.1" step="0.05" data-object-prop="heightM" value="${props.measurement.heightM}" />
          <span>${formatMeters(props.measurement.heightM)}</span>
        </label>
        <label>Largura/diametro
          <input type="number" min="0.05" step="0.05" data-object-prop="widthM" value="${width}" />
          <span>${formatMeters(width)}</span>
        </label>
        <label>HP max
          <input type="number" min="1" step="1" data-object-prop="maxHp" value="${props.maxHp}" />
        </label>
        <label>Armor
          <input type="number" min="0" step="1" data-object-prop="armor" value="${props.armor}" />
        </label>
        <div class="tag-row">${props.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
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
          <div class="overlay-strip studio-options-strip">
            <span>Options</span>
            ${OVERLAY_KEYS.map((key) => `<button data-overlay="${key}" class="${this.state.debugOverlays[key] ? "active" : ""}">${this.overlayLabel(key)}</button>`).join("")}
          </div>
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
    if (button.dataset.studioView) {
      this.applyStudioView(button.dataset.studioView as ViewMode);
      return;
    }
    if (button.dataset.studioCamera) {
      this.setState((current) => ({
        ...current,
        view: "3d",
        camera3D: {
          ...current.camera3D,
          mode: button.dataset.studioCamera as CameraMode3D,
          focusTarget: button.dataset.studioCamera === "first-person" ? "player" : current.camera3D.focusTarget
        }
      }));
      this.updateHud(true);
      this.resizeRenderersSoon();
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
    if (button.dataset.studioRecipe) {
      this.applyRecipe(button.dataset.studioRecipe as StudioRecipeId);
      return;
    }
    switch (button.dataset.studioAction) {
      case "play":
        this.setState((current) => {
          const playing = !current.session.timeline.playing;
          return {
            ...current,
            session: { ...current.session, timeline: { ...current.session.timeline, playing } },
            camera3D:
              playing && current.view === "3d"
                ? { ...current.camera3D, mode: "first-person", focusTarget: "player", pitch: clamp(current.camera3D.pitch, -0.35, 0.35) }
                : current.camera3D
          };
        });
        this.updateHud(true);
        this.resizeRenderersSoon();
        return;
      case "step":
        this.setState((current) => ({ ...current, session: stepStudioSession(current.session, this.inputState(), []) }));
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
        this.updateHud(true);
        return;
      case "isolate-selection":
        this.isolateSelection = !this.isolateSelection;
        this.updateHud(true);
        return;
      default:
        break;
    }
    if (button.dataset.overlay) {
      const key = button.dataset.overlay as Exclude<keyof DebugOverlayOptions, "enabled">;
      this.setState((current) => ({ ...current, debugOverlays: { ...current.debugOverlays, [key]: !current.debugOverlays[key] } }));
      this.updateHud(true);
    }
  }

  private handleChange(event: Event): void {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLSelectElement && target.dataset.studioField === "scenario") {
      this.setState((current) => ({ ...current, session: setStudioScenario(current.session, target.value), pendingPoint: undefined, hoverPoint: undefined }));
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
      this.updateHud(true);
    }
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLInputElement && target.dataset.studioField === "timeline") {
      this.setState((current) => ({ ...current, session: scrubStudioTimeline(current.session, Number(target.value)) }));
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
      return;
    }
    if (target instanceof HTMLInputElement && target.dataset.objectProp) {
      this.applyObjectProperty(target.dataset.objectProp, target.value);
    }
  }

  private applyObjectProperty(prop: string, rawValue: string): void {
    const selection = this.session.selection;
    if (!selection) return;
    const numeric = Number(rawValue);
    const patchProperties = <T extends BasePiece | TowerPiece | Actor | BaseCore>(object: T): T => {
      const measurement = { ...object.properties.measurement };
      let nextObject: T = object;
      if (prop === "displayName") {
        return { ...object, properties: { ...object.properties, displayName: rawValue } };
      }
      if (!Number.isFinite(numeric)) return object;
      if (prop === "heightM") {
        measurement.heightM = numeric;
        nextObject = { ...nextObject, height: numeric };
      }
      if (prop === "widthM") {
        measurement.widthM = numeric;
        if ("thickness" in nextObject) nextObject = { ...nextObject, thickness: numeric };
        if ("radius" in nextObject) nextObject = { ...nextObject, radius: numeric * 0.5 };
      }
      if (prop === "maxHp") {
        if ("maxHp" in nextObject) nextObject = { ...nextObject, maxHp: numeric, hp: Math.min(nextObject.hp, numeric) };
      }
      return {
        ...nextObject,
        properties: {
          ...nextObject.properties,
          maxHp: prop === "maxHp" && Number.isFinite(numeric) ? numeric : nextObject.properties.maxHp,
          armor: prop === "armor" && Number.isFinite(numeric) ? numeric : nextObject.properties.armor,
          measurement
        }
      };
    };

    const nextWorld = (() => {
      if (selection.kind === "piece") {
        const pieces = this.session.world.pieces.map((piece) => (piece.id === selection.id ? patchProperties(piece) : piece));
        return { ...this.session.world, pieces, structures: createStructureMap(pieces, this.session.world.towers, this.session.world.baseCore, this.session.world.run.baseCoreMaxHp) };
      }
      if (selection.kind === "tower") {
        const towers = this.session.world.towers.map((tower) => (tower.id === selection.id ? patchProperties(tower) : tower));
        return { ...this.session.world, towers, structures: createStructureMap(this.session.world.pieces, towers, this.session.world.baseCore, this.session.world.run.baseCoreMaxHp) };
      }
      if (selection.kind === "actor") {
        const actors = this.session.world.actors.map((actor) => (actor.id === selection.id ? patchProperties(actor) : actor));
        return { ...this.session.world, actors };
      }
      const baseCore = patchProperties(this.session.world.baseCore);
      const baseCoreMaxHp = baseCore.properties.maxHp;
      return {
        ...this.session.world,
        baseCore,
        run: { ...this.session.world.run, baseCoreMaxHp, baseCoreHp: Math.min(this.session.world.run.baseCoreHp, baseCoreMaxHp) },
        structures: createStructureMap(this.session.world.pieces, this.session.world.towers, baseCore, baseCoreMaxHp)
      };
    })();

    this.setState((current) => ({ ...current, session: replaceStudioWorld(current.session, nextWorld) }));
    this.updateHud(true);
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
    if (!this.state.pendingPoint || !this.state.hoverPoint || !this.isSegmentTool(this.state.tool)) return undefined;
    return this.editorForSession().previewSegment(this.state.tool, this.state.pendingPoint, this.state.hoverPoint);
  }

  private editorForSession(): BaseEditor {
    return new BaseEditor({ version: 2, pieces: this.session.world.pieces, towers: this.session.world.towers, connectors: this.session.world.connectors });
  }

  private handleWorldClick(point: Vec2): void {
    if (this.isActorTool(this.state.tool)) {
      const kind = this.state.tool;
      const layer = this.activePlacementLayer();
      const actorId = kind === "player" ? "player" : this.nextActorId(kind);
      const actor = createActor(actorId, kind, point, { heightLayer: layer });
      const actors =
        kind === "player"
          ? [actor, ...this.session.world.actors.filter((entry) => entry.kind !== "player")]
          : [...this.session.world.actors, actor];
      const world = { ...this.session.world, actors };
      this.setState((current) => ({
        ...current,
        session: setStudioSelection(replaceStudioWorld(current.session, world), { kind: "actor", id: actor.id }),
        pendingPoint: undefined,
        hoverPoint: undefined
      }));
      this.updateHud(true);
      return;
    }
    if (this.state.tool === "ramp" || this.state.tool === "platform-link") {
      if (!this.state.pendingPoint) {
        this.setState((current) => ({ ...current, pendingPoint: point }));
        this.updateHud(true);
        return;
      }
      const editor = this.editorForSession();
      const fromLayer = this.activePlacementLayer();
      const toLayer = this.state.tool === "ramp" ? this.nextHeightLayer(fromLayer) : fromLayer;
      const connector = editor.placeConnector(this.state.tool, this.state.pendingPoint, point, fromLayer, toLayer);
      const world = { ...this.session.world, pieces: editor.pieces, towers: editor.towers, connectors: editor.connectors };
      this.setState((current) => ({
        ...current,
        session: replaceStudioWorld(current.session, world),
        pendingPoint: undefined,
        hoverPoint: undefined
      }));
      this.applyConnectorFocus(connector);
      this.updateHud(true);
      return;
    }
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
      this.updateHud(true);
      return;
    }
    if (this.state.tool === "erase") {
      const editor = this.editorForSession();
      editor.deleteNear(point, 0.45);
      const actors = this.session.world.actors.filter((actor) => distance(point, actor.position) > Math.max(0.45, actor.radius + 0.12));
      const world = {
        ...this.session.world,
        pieces: editor.pieces,
        towers: editor.towers,
        connectors: editor.connectors,
        actors,
        selectedId: undefined,
        structures: createStructureMap(editor.pieces, editor.towers, this.session.world.baseCore, this.session.world.run.baseCoreMaxHp)
      };
      this.setState((current) => ({ ...current, session: replaceStudioWorld(current.session, world), pendingPoint: undefined, hoverPoint: undefined }));
      this.updateHud(true);
      return;
    }
    if (!this.isSegmentTool(this.state.tool)) return;
    if (!this.state.pendingPoint) {
      this.setState((current) => ({ ...current, pendingPoint: point }));
      this.updateHud(true);
      return;
    }
    const editor = this.editorForSession();
    const piece = editor.placeSegment(this.state.tool, this.state.pendingPoint, point, "closed", { heightLayer: this.activePlacementLayer() });
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

  private applyRecipe(recipeId: StudioRecipeId): void {
    const world = applyStudioRecipe(this.session.world, recipeId);
    const selected = world.selectedId ? ({ kind: "piece", id: world.selectedId } as const) : undefined;
    this.setState((current) => ({
      ...current,
      session: setStudioSelection(replaceStudioWorld(current.session, world), selected),
      pendingPoint: undefined,
      hoverPoint: undefined,
      camera3D: {
        ...current.camera3D,
        focusTarget: selected ? "selected" : "core"
      }
    }));
    this.updateHud(true);
    this.resizeRenderersSoon();
  }

  private findNearestTL(point: Vec2): BasePiece | undefined {
    return this.session.world.pieces
      .filter((piece) => piece.kind === "fence-tl")
      .map((piece) => ({ piece, d: distance(point, { x: (piece.a.x + piece.b.x) * 0.5, z: (piece.a.z + piece.b.z) * 0.5 }) }))
      .sort((a, b) => a.d - b.d)[0]?.piece;
  }

  private inputState() {
    const forwardAxis = Number(this.keyboard.pressed.has("ArrowUp") || this.keyboard.pressed.has("KeyW")) - Number(this.keyboard.pressed.has("ArrowDown") || this.keyboard.pressed.has("KeyS"));
    const strafeAxis = Number(this.keyboard.pressed.has("ArrowRight") || this.keyboard.pressed.has("KeyD")) - Number(this.keyboard.pressed.has("ArrowLeft") || this.keyboard.pressed.has("KeyA"));
    if (this.state.view === "3d") {
      const yaw = this.state.camera3D.yaw;
      const forward = { x: Math.sin(yaw), z: Math.cos(yaw) };
      const right = { x: forward.z, z: -forward.x };
      return {
        move: normalize({
          x: forward.x * forwardAxis + right.x * strafeAxis,
          z: forward.z * forwardAxis + right.z * strafeAxis
        }),
        attack: this.keyboard.pressed.has("Space"),
        interact: this.keyboard.pressed.has("KeyE")
      };
    }
    return {
      move: { x: strafeAxis, z: -forwardAxis },
      attack: this.keyboard.pressed.has("Space"),
      interact: this.keyboard.pressed.has("KeyE")
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
    if (tool === "ramp") return "Rampa";
    if (tool === "platform-link") return "Link";
    if (tool === "player") return "Player";
    if (tool === "enemy") return "Mob";
    if (tool === "dwarf") return "Anao";
    if (tool === "boss") return "Boss";
    return "Apagar";
  }

  private toolPaletteButton(tool: ToolMode): string {
    return `
      <button data-tool="${tool}" class="studio-tool-card ${this.state.tool === tool ? "active" : ""}">
        <span class="studio-tool-preview" aria-hidden="true">${this.toolPreview(tool)}</span>
        <strong>${this.toolLabel(tool)}</strong>
        <small>${this.toolDescription(tool)}</small>
      </button>
    `;
  }

  private toolPreview(tool: ToolMode): string {
    if (tool === "fence") return `<svg viewBox="0 0 80 46"><path d="M10 16h60M10 30h60" /><path d="M16 9v29M40 9v29M64 9v29" /></svg>`;
    if (tool === "fence-tl") return `<svg viewBox="0 0 80 46"><path d="M10 16h60M10 30h60" /><path d="M15 7v31M33 7v31M51 7v31M69 7v31" /><circle cx="40" cy="7" r="5" /></svg>`;
    if (tool === "gate") return `<svg viewBox="0 0 80 46"><path d="M12 34h56M16 11v27M64 11v27" /><path d="M24 17l32 14M56 17L24 31" /></svg>`;
    if (tool === "tower") return `<svg viewBox="0 0 80 46"><path d="M24 36h32" /><path d="M33 36l7-27 7 27" /><circle cx="40" cy="10" r="7" /></svg>`;
    if (tool === "ramp") return `<svg viewBox="0 0 80 46"><path d="M14 35h52" /><path d="M20 34L62 12" /><path d="M62 12v22" /></svg>`;
    if (tool === "platform-link") return `<svg viewBox="0 0 80 46"><path d="M12 18h22M46 18h22M34 27h12" /><path d="M24 12v20M56 12v20" /></svg>`;
    if (tool === "erase") return `<svg viewBox="0 0 80 46"><path d="M25 31l24-18 8 11-24 18z" /><path d="M19 39h42" /></svg>`;
    if (tool === "player") return `<svg viewBox="0 0 80 46"><circle cx="40" cy="16" r="7" /><path d="M40 23v15M29 29h22" /></svg>`;
    if (tool === "enemy") return `<svg viewBox="0 0 80 46"><circle cx="40" cy="20" r="11" /><path d="M29 35h22M34 18h1M46 18h1" /></svg>`;
    if (tool === "dwarf") return `<svg viewBox="0 0 80 46"><circle cx="40" cy="27" r="7" /><path d="M31 36h18" /></svg>`;
    return `<svg viewBox="0 0 80 46"><circle cx="40" cy="21" r="15" /><path d="M24 10l8 6M56 10l-8 6M31 35h18" /></svg>`;
  }

  private toolDescription(tool: ToolMode): string {
    if (tool === "fence") return "1,5m / bloqueio";
    if (tool === "fence-tl") return "4m / topo";
    if (tool === "gate") return "portal E / fluxo";
    if (tool === "tower") return "socket superior";
    if (tool === "ramp") return "layer +1";
    if (tool === "platform-link") return "mesmo layer";
    if (tool === "player") return "1m";
    if (tool === "enemy") return "2m";
    if (tool === "dwarf") return "0,5m";
    if (tool === "boss") return "4m";
    return "remove perto";
  }

  private isSegmentTool(tool: ToolMode): tool is PlacementTool {
    return tool === "fence" || tool === "fence-tl" || tool === "gate";
  }

  private isActorTool(tool: ToolMode): tool is ActorKind {
    return tool === "player" || tool === "enemy" || tool === "dwarf" || tool === "boss";
  }

  private activePlacementLayer(): HeightLayer {
    return this.layerFilter === "all" ? 0 : this.layerFilter;
  }

  private nextHeightLayer(layer: HeightLayer): HeightLayer {
    return (Math.min(3, layer + 1) as HeightLayer);
  }

  private nextActorId(kind: ActorKind): string {
    const highest = this.session.world.actors
      .filter((actor) => actor.kind === kind || actor.id.startsWith(`${kind}-`))
      .map((actor) => Number(actor.id.split("-").at(-1)))
      .filter(Number.isFinite)
      .reduce((max, value) => Math.max(max, value), 0);
    return `${kind}-${highest + 1}`;
  }

  private applyConnectorFocus(connector: HeightConnector): void {
    this.setState((current) => ({
      ...current,
      camera3D: {
        ...current.camera3D,
        focusTarget: "core",
        panOffset: {
          x: (connector.from.position.x + connector.to.position.x) * 0.5 - this.session.world.baseCore.position.x,
          z: (connector.from.position.z + connector.to.position.z) * 0.5 - this.session.world.baseCore.position.z
        }
      }
    }));
  }

  private cameraModeLabel(mode: CameraMode3D): string {
    if (mode === "first-person") return "FPS";
    return mode === "tactical" ? "Tactical" : "Inspect";
  }

  private viewLabel(view: ViewMode): string {
    if (view === "2d") return "2D";
    if (view === "25d") return "2.5D";
    return "3D";
  }

  private applyStudioView(view: ViewMode): void {
    this.setState((current) => ({
      ...current,
      view,
      camera3D:
        view === "3d"
          ? {
              ...current.camera3D,
              mode: current.session.timeline.playing ? "first-person" : current.camera3D.mode,
              focusTarget: current.session.timeline.playing ? "player" : current.camera3D.focusTarget
            }
          : current.camera3D
    }));
    this.updateHud(true);
    this.resizeRenderersSoon();
  }

  private resizeRenderersSoon(): void {
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  }

  private overlayLabel(key: Exclude<keyof DebugOverlayOptions, "enabled">): string {
    const labels: Record<Exclude<keyof DebugOverlayOptions, "enabled">, string> = {
      endpoints: "Endpoints",
      sockets: "Sockets",
      bounds: "Bounds",
      colliders: "Collider",
      nearest: "Nearest",
      axes: "Axes",
      pivots: "Pivots",
      facing: "Facing",
      routes: "Routes",
      targets: "Targets",
      navigation: "Nav",
      influence: "Heatmap",
      damage: "Damage",
      diagnostics: "Issues",
      shadows: "Shadows",
      fog: "Fog",
      grid: "Grid",
      lighting: "Light",
      effects: "FX"
    };
    return labels[key];
  }

  private policySlider(key: keyof typeof DEFAULT_AI_POLICY, label: string, value: number, min: number, max: number, step: number): string {
    return `<label>${label}<input type="range" data-studio-policy="${key}" min="${min}" max="${max}" step="${step}" value="${value}" /><span>${value}</span></label>`;
  }
}
