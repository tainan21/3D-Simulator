import { BaseEditor, type PlacementTool } from "../../editor/baseEditor";
import { pieceHorizontalBounds, pieceSockets, type BasePiece } from "../../domain/canonical";
import { DEFAULT_DEBUG_OVERLAYS, type DebugOverlayOptions } from "../../domain/debug";
import { advanceUniverseOffscreen, getUniverseRegion, materializeUniverseRegion, rerollUniverseRegionSeed, setActiveUniverseRegion } from "../../domain/universe";
import { canonicalGeometrySignature } from "../../kernel/adapterSnapshot";
import { clamp, distance, normalize, type Vec2 } from "../../kernel/vector";
import { WORLD_UNIT_LABEL } from "../../kernel/worldUnits";
import { PhaserGeometryRenderer } from "../../render/phaserGeometryRenderer";
import type { CameraMode3D, RenderDataProvider, ThreeCameraState, ViewportCamera2D } from "../../render/contracts";
import { ThreeValidationRenderer } from "../../render/threeValidationRenderer";
import { createWorldAnalysisCache } from "../../simulation/analysis";
import { DEFAULT_AI_POLICY } from "../../simulation/aiPolicy";
import { createReplayState } from "../../simulation/replay";
import { chooseUpgrade, UPGRADE_LABELS, type UpgradeId } from "../../simulation/roguelite";
import { advanceWaveAfterUpgrade, stepSimulation, type InputState } from "../../simulation/simulation";
import { createStructureMap } from "../../simulation/structures";
import type { AppSurfaceContext, AppRoute, SurfaceHandle, ToolMode, ViewMode } from "../contracts";
import { createCleanupBag, createKeyboardState, type RendererHandle, updatePerformanceSnapshot } from "./common";

const TOOLS: ToolMode[] = ["fence", "fence-tl", "gate", "tower", "erase"];
const MODES: ViewMode[] = ["2d", "25d", "3d"];
const CAMERA_MODES: CameraMode3D[] = ["tactical", "inspection", "first-person"];
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

export class PhasesSurfaceController {
  private readonly cleanups = createCleanupBag();
  private readonly keyboard = createKeyboardState();
  private renderer?: RendererHandle;
  private rendererCanvasCleanup?: () => void;
  private raf = 0;
  private paused = false;
  private lastTick = performance.now();
  private hudStamp = 0;
  private frameMs = 0;
  private simMs = 0;
  private isDraggingCamera = false;
  private lastPointer?: { x: number; y: number };
  private readonly analysisCache = createWorldAnalysisCache();

  constructor(
    private readonly host: HTMLElement,
    private readonly context: AppSurfaceContext
  ) {}

  mount(): SurfaceHandle {
    const loopCleanup = this.context.performance.trackLoop("phases:loop");
    this.cleanups.add(loopCleanup);
    this.keyboard.attach(this.cleanups);
    this.renderFrame();
    this.attachEvents();
    this.mountRenderer();
    this.updateHud(true);
    this.raf = requestAnimationFrame(this.loop);
    this.cleanups.add(() => cancelAnimationFrame(this.raf));
    return {
      dispose: () => this.dispose(),
      pause: () => {
        this.paused = true;
        this.renderer?.pause?.();
      },
      resume: () => {
        this.paused = false;
        this.renderer?.resume?.();
      },
      collectDiagnostics: () => ({
        surfaceId: "phases",
        snapshot: this.context.performance.getSnapshot()
      })
    };
  }

  private dispose(): void {
    this.rendererCanvasCleanup?.();
    this.renderer?.destroy();
    this.cleanups.dispose();
    this.host.innerHTML = "";
  }

  private get state() {
    return this.context.stores.phasesStore.getState();
  }

  private setState(updater: Parameters<typeof this.context.stores.phasesStore.setState>[0]) {
    return this.context.stores.phasesStore.setState(updater);
  }

  private analyze(world: typeof this.state.world) {
    return this.analysisCache.compute(world, createReplayState(), DEFAULT_AI_POLICY);
  }

  private applyUniverse(universe: typeof this.state.universe) {
    const materialized = materializeUniverseRegion(universe);
    const world = materialized.world;
    this.setState((current) => ({
      ...current,
      universe,
      scenarioId: materialized.region.scenarioId,
      seed: materialized.region.seed,
      world,
      editor: new BaseEditor({ version: 2, pieces: world.pieces, towers: world.towers, connectors: world.connectors }),
      analysis: this.analyze(world),
      pendingPoint: undefined,
      hoverPoint: undefined
    }));
  }

  private provider(): RenderDataProvider {
    return {
      getWorld: () => this.state.world,
      getDebugOptions: () => this.state.debugOverlays,
      getDebugContacts: () => this.state.analysis.debugContacts,
      getAiDebug: () => this.state.analysis.aiDebug,
      getValidationIssues: () => this.state.analysis.validationIssues,
      getInfluenceField: () => this.state.analysis.influenceField,
      getReplayState: () => createReplayState()
    };
  }

  private renderFrame(): void {
    this.host.innerHTML = `
      <section class="workspace-surface" data-testid="phases-surface">
        <header class="workspace-header">
          <div>
            <span class="panel-tag">experimento</span>
            <h1>Fases</h1>
            <p>Playground de cenarios, seeds, modos de visualizacao e ajustes de depuracao sem contaminar o Studio.</p>
          </div>
          <div class="workspace-actions">
            ${MODES.map((mode) => `<button data-mode="${mode}">${this.modeLabel(mode)}</button>`).join("")}
            <select data-phase-field="region">
              ${this.state.universe.regions
                .map((region) => `<option value="${region.id}" ${region.id === this.state.universe.activeRegionId ? "selected" : ""}>${region.name}</option>`)
                .join("")}
            </select>
            <button data-action="phase-reroll">Nova seed</button>
            <button data-route="/studio">Entrar no Studio</button>
          </div>
        </header>
        <div class="workspace-grid">
          <section class="workspace-stage">
            <div class="workspace-floating top">
              ${CAMERA_MODES.map((mode) => `<button data-camera-mode="${mode}">${this.cameraModeLabel(mode)}</button>`).join("")}
            </div>
            <div class="workspace-floating bottom">
              ${TOOLS.map((tool) => `<button data-tool="${tool}">${this.toolLabel(tool)}</button>`).join("")}
              <button data-action="toggle-debug">Debug</button>
              <button data-action="toggle-gate">Portao</button>
              <button data-action="export-json">Export JSON</button>
              <button data-action="import-json">Import JSON</button>
              <button data-action="reset">Reset</button>
            </div>
            <div class="workspace-stage-status" id="phases-status"></div>
            <div class="canvas-host" id="phases-canvas" data-testid="canvas-host"></div>
            <pre id="canonical-signature" class="sr-only" data-testid="canonical-signature"></pre>
          </section>
          <aside class="workspace-side" id="phases-side" data-testid="debug-panel"></aside>
        </div>
      </section>
    `;
  }

  private attachEvents(): void {
    const onClick = (event: Event) => this.handleClick(event as MouseEvent);
    const onChange = (event: Event) => this.handleChange(event);
    const onWheel = (event: WheelEvent) => {
      if (this.state.mode !== "3d" || this.state.camera3D.mode === "first-person") return;
      event.preventDefault();
      this.setState((current) => ({ ...current, camera3D: { ...current.camera3D, distance: clamp(current.camera3D.distance + Math.sign(event.deltaY) * 0.8, 4.5, 20) } }));
      this.updateHud(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (this.state.mode !== "3d" || this.state.camera3D.mode === "first-person") return;
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
      if (this.state.mode !== "3d" || this.state.camera3D.mode !== "first-person") return;
      const canvas = this.host.querySelector<HTMLCanvasElement>("#phases-canvas canvas");
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
    this.host.querySelector("#phases-canvas")?.addEventListener("wheel", onWheel as EventListener, { passive: false });
    this.host.querySelector("#phases-canvas")?.addEventListener("pointerdown", onPointerDown as EventListener);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("mousemove", onMouseMove);

    this.cleanups.add(() => this.host.removeEventListener("click", onClick));
    this.cleanups.add(() => this.host.removeEventListener("change", onChange));
    this.cleanups.add(() => this.host.querySelector("#phases-canvas")?.removeEventListener("wheel", onWheel as EventListener));
    this.cleanups.add(() => this.host.querySelector("#phases-canvas")?.removeEventListener("pointerdown", onPointerDown as EventListener));
    this.cleanups.add(() => window.removeEventListener("pointermove", onPointerMove));
    this.cleanups.add(() => window.removeEventListener("pointerup", onPointerUp));
    this.cleanups.add(() => window.removeEventListener("mousemove", onMouseMove));
  }

  private mountRenderer(): void {
    this.rendererCanvasCleanup?.();
    this.renderer?.destroy();
    this.renderer = undefined;
    const canvasHost = this.host.querySelector<HTMLElement>("#phases-canvas");
    if (!canvasHost) return;
    if (this.state.mode === "3d") {
      const renderer = new ThreeValidationRenderer({
        ...this.provider(),
        parent: canvasHost,
        getCameraState: () => this.state.camera3D
      });
      renderer.mount();
      this.renderer = renderer as unknown as RendererHandle;
    } else {
      const renderer = new PhaserGeometryRenderer({
        ...this.provider(),
        parent: canvasHost,
        mode: this.state.mode,
        getCamera: () => this.geometryCamera(),
        getDraftSegment: () => this.draftSegment(),
        onWorldClick: (point) => this.handleWorldClick(point),
        onWorldHover: (point) => {
          this.setState((current) => ({ ...current, hoverPoint: point }));
        },
        interactionEnabled: true
      });
      renderer.mount();
      this.renderer = renderer as unknown as RendererHandle;
    }
    const canvas = canvasHost.querySelector("canvas");
    if (canvas) {
      this.rendererCanvasCleanup = this.context.performance.trackCanvas(`phases:${this.state.mode}`);
      if (this.state.mode === "3d") {
        canvasHost.addEventListener(
          "click",
          () => {
            if (this.state.camera3D.mode === "first-person") void canvas.requestPointerLock?.();
          },
          { once: true }
        );
      }
    }
  }

  private readonly loop = (time: number): void => {
    const dt = Math.min(0.05, (time - this.lastTick) / 1000);
    this.lastTick = time;
    if (!this.paused) {
      const frameStart = performance.now();
      if (this.state.mode === "3d") {
        const turn = Number(this.keyboard.pressed.has("KeyC")) - Number(this.keyboard.pressed.has("KeyZ"));
        const pitch = Number(this.keyboard.pressed.has("KeyR")) - Number(this.keyboard.pressed.has("KeyF"));
        if (turn !== 0 || pitch !== 0) {
          this.setState((current) => ({
            ...current,
            camera3D: {
              ...current.camera3D,
              yaw: current.camera3D.yaw + turn * dt * 1.9,
              pitch: clamp(current.camera3D.pitch + pitch * dt * 1.3, -1.15, 0.9)
            }
          }));
        }
      }
      const simStart = performance.now();
      const nextWorld = stepSimulation(this.state.world, this.inputState(), dt, DEFAULT_AI_POLICY);
      this.simMs = performance.now() - simStart;
      const universeStep = advanceUniverseOffscreen(this.state.universe, Math.max(1, Math.round(dt / 0.016)));
      const currentRegion = getUniverseRegion(universeStep.universe);
      const analysis = this.analyze(nextWorld);
      this.setState((current) => ({
        ...current,
        universe: universeStep.universe,
        universeTickSummaries: universeStep.summaries,
        scenarioId: currentRegion.scenarioId,
        seed: currentRegion.seed,
        world: nextWorld,
        analysis
      }));
      this.frameMs = performance.now() - frameStart;
      this.updateHud();
      updatePerformanceSnapshot(this.context, "phases", this.frameMs, this.simMs, analysis, nextWorld, this.renderer);
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  private updateHud(force = false): void {
    const now = performance.now();
    if (!force && now - this.hudStamp < 140) return;
    this.hudStamp = now;
    this.host.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === this.state.mode));
    this.host.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((button) => button.classList.toggle("active", button.dataset.tool === this.state.tool));
    this.host.querySelectorAll<HTMLButtonElement>("[data-camera-mode]").forEach((button) => button.classList.toggle("active", button.dataset.cameraMode === this.state.camera3D.mode));
    const status = this.host.querySelector<HTMLElement>("#phases-status");
    const side = this.host.querySelector<HTMLElement>("#phases-side");
    const signature = this.host.querySelector<HTMLElement>("#canonical-signature");
    const world = this.state.world;
    const analysis = this.state.analysis;
    const region = getUniverseRegion(this.state.universe);
    const selected = world.pieces.find((piece) => piece.id === world.selectedId);
    const sig = canonicalGeometrySignature(world);
    if (signature) signature.textContent = sig;
    if (status) {
      status.textContent = `${WORLD_UNIT_LABEL} | regiao ${region.name} | modo ${this.modeLabel(this.state.mode)} | seed ${world.worldSeed} | fase ${this.phaseLabel(world.run.phase)}`;
    }
    if (!side) return;
    side.innerHTML = `
      <div class="workspace-side-block">
        <h2>Universo</h2>
        <dl>
          <dt>Regiao</dt><dd>${region.name}</dd>
          <dt>Papel</dt><dd>${region.role} / ${region.functionTag}</dd>
          <dt>Gramatica</dt><dd>${region.grammar}</dd>
          <dt>Ameaca</dt><dd>${(this.state.universe.threatState[region.id] ?? 0).toFixed(2)}</dd>
          <dt>Recursos</dt><dd>${(this.state.universe.resourceState[region.id] ?? 0).toFixed(2)}</dd>
          <dt>Off-screen</dt><dd>${this.state.universeTickSummaries.map((entry) => `${entry.regionId.split("-").at(-1)}:${entry.nextTick}`).join(" | ") || "-"}</dd>
        </dl>
      </div>
      <div class="workspace-side-block">
        <h2>Estado</h2>
        <dl>
          <dt>Base</dt><dd>${world.run.baseCoreHp.toFixed(1)} / ${world.run.baseCoreMaxHp}</dd>
          <dt>Wave</dt><dd>${world.run.wave}</dd>
          <dt>Entities</dt><dd>${world.actors.length}</dd>
          <dt>Shapes</dt><dd>${world.pieces.length + world.towers.length + world.connectors.length}</dd>
          <dt>Queries</dt><dd>${analysis.aiDebug.reduce((total, entry) => total + entry.waypoints.length + entry.navigationSamples.length, 0)}</dd>
        </dl>
      </div>
      <div class="workspace-side-block">
        <h2>Overlays</h2>
        <div class="workspace-button-grid">
          <button data-action="toggle-debug" class="${this.state.debugOverlays.enabled ? "active" : ""}">Debug</button>
          ${OVERLAY_KEYS.map((key) => `<button data-overlay="${key}" class="${this.state.debugOverlays[key] ? "active" : ""}">${this.overlayLabel(key)}</button>`).join("")}
        </div>
      </div>
      <div class="workspace-side-block">
        <h2>Selecao</h2>
        <dl>
          <dt>Selecionado</dt><dd>${selected ? `${selected.id} / ${selected.kind}` : "nenhum"}</dd>
          <dt>Bounds</dt><dd>${selected ? JSON.stringify(pieceHorizontalBounds(selected)) : "-"}</dd>
          <dt>Sockets</dt><dd>${selected ? pieceSockets(selected).map((socket) => `${socket.kind}@${socket.position.y.toFixed(1)}`).join(" | ") : "-"}</dd>
          <dt>Issues</dt><dd>${analysis.validationIssues.map((issue) => `${issue.severity}:${issue.kind}`).join(" | ") || "sem issues"}</dd>
          <dt>AI</dt><dd>${analysis.aiDebug.map((entry) => `${entry.actorId}:${entry.objective}`).join(" | ") || "-"}</dd>
        </dl>
      </div>
      ${this.state.world.run.phase === "upgrade" ? `<div class="workspace-side-block"><h2>Upgrades</h2><div class="workspace-button-grid">${world.run.pendingChoices.map((choice) => `<button data-upgrade="${choice}">${UPGRADE_LABELS[choice]}</button>`).join("")}</div></div>` : ""}
    `;
  }

  private handleClick(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLElement>("button");
    if (!button) return;
    if (button.dataset.route) {
      this.context.navigate(button.dataset.route as AppRoute);
      return;
    }
    if (button.dataset.mode) {
      this.setState((current) => ({
        ...current,
        mode: button.dataset.mode as ViewMode,
        camera3D: button.dataset.mode === "3d" ? { ...current.camera3D, mode: "inspection" } : current.camera3D
      }));
      this.renderFrame();
      this.attachEvents();
      this.mountRenderer();
      this.updateHud(true);
      return;
    }
    if (button.dataset.tool) {
      this.setState((current) => ({ ...current, tool: button.dataset.tool as ToolMode, pendingPoint: undefined }));
      this.updateHud(true);
      return;
    }
    if (button.dataset.cameraMode) {
      this.setState((current) => ({ ...current, camera3D: { ...current.camera3D, mode: button.dataset.cameraMode as CameraMode3D } }));
      this.updateHud(true);
      return;
    }
    if (button.dataset.overlay) {
      const key = button.dataset.overlay as Exclude<keyof DebugOverlayOptions, "enabled">;
      this.setState((current) => ({ ...current, debugOverlays: { ...current.debugOverlays, [key]: !current.debugOverlays[key] } }));
      this.mountRenderer();
      this.updateHud(true);
      return;
    }
    if (button.dataset.upgrade) {
      const world = advanceWaveAfterUpgrade({ ...this.state.world, run: chooseUpgrade(this.state.world.run, button.dataset.upgrade as UpgradeId) });
      this.setState((current) => ({ ...current, world, analysis: this.analyze(world) }));
      this.updateHud(true);
      return;
    }
    switch (button.dataset.action) {
      case "phase-reroll":
        this.applyUniverse(rerollUniverseRegionSeed(this.state.universe, this.state.universe.activeRegionId));
        break;
      case "toggle-debug":
        this.setState((current) => ({ ...current, debugOverlays: { ...current.debugOverlays, enabled: !current.debugOverlays.enabled } }));
        this.mountRenderer();
        this.updateHud(true);
        break;
      case "toggle-gate":
        this.toggleSelectedGate();
        break;
      case "export-json":
        void navigator.clipboard?.writeText(JSON.stringify(this.state.editor.serialize(), null, 2));
        break;
      case "import-json": {
        const raw = window.prompt("Cole o JSON geometrico puro da base:");
        if (!raw) break;
        try {
          const editor = BaseEditor.deserialize(JSON.parse(raw));
          const world = {
            ...this.state.world,
            pieces: editor.pieces,
            towers: editor.towers,
            connectors: editor.connectors,
            structures: createStructureMap(editor.pieces, editor.towers, this.state.world.baseCore, this.state.world.run.baseCoreMaxHp)
          };
          this.setState((current) => ({
            ...current,
            editor,
            world,
            analysis: this.analyze(world)
          }));
          this.mountRenderer();
          this.updateHud(true);
        } catch {
          // Ignore invalid imports.
        }
        break;
      }
      case "reset":
        this.applyUniverse(this.state.universe);
        break;
      default:
        break;
    }
  }

  private handleChange(event: Event): void {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLSelectElement && target.dataset.phaseField === "region") {
      this.applyUniverse(setActiveUniverseRegion(this.state.universe, target.value));
    }
  }

  private geometryCamera(): ViewportCamera2D {
    const canvasHost = this.host.querySelector<HTMLElement>("#phases-canvas");
    const width = canvasHost?.clientWidth || 900;
    const height = canvasHost?.clientHeight || 650;
    const zoom = Math.max(0.34, Math.min(0.92, Math.min(width / 1320, height / 980)));
    return {
      target: { x: this.state.world.baseCore.position.x, z: this.state.world.baseCore.position.z - 0.6 },
      zoom
    };
  }

  private draftSegment() {
    if (!this.state.pendingPoint || !this.state.hoverPoint || !this.isSegmentTool(this.state.tool)) return undefined;
    return this.state.editor.previewSegment(this.state.tool, this.state.pendingPoint, this.state.hoverPoint);
  }

  private handleWorldClick(point: Vec2): void {
    if (this.state.mode === "3d") return;
    if (this.state.tool === "tower") {
      const fence = this.findNearestTL(point);
      if (!fence || fence.kind !== "fence-tl" || fence.towerId) return;
      const editor = this.state.editor;
      const tower = editor.attachTowerToFenceTL(fence.id);
      const world = {
        ...this.state.world,
        pieces: editor.pieces,
        towers: editor.towers,
        connectors: editor.connectors,
        selectedId: tower.fenceId,
        structures: createStructureMap(editor.pieces, editor.towers, this.state.world.baseCore, this.state.world.run.baseCoreMaxHp)
      };
      this.setState((current) => ({ ...current, editor, world, analysis: this.analyze(world) }));
      this.mountRenderer();
      this.updateHud(true);
      return;
    }
    if (this.state.tool === "erase") {
      const editor = this.state.editor;
      editor.deleteNear(point, 0.45);
      const world = {
        ...this.state.world,
        pieces: editor.pieces,
        towers: editor.towers,
        connectors: editor.connectors,
        selectedId: undefined,
        structures: createStructureMap(editor.pieces, editor.towers, this.state.world.baseCore, this.state.world.run.baseCoreMaxHp)
      };
      this.setState((current) => ({ ...current, editor, world, analysis: this.analyze(world) }));
      this.mountRenderer();
      this.updateHud(true);
      return;
    }
    if (!this.isSegmentTool(this.state.tool)) return;
    if (!this.state.pendingPoint) {
      this.setState((current) => ({ ...current, pendingPoint: point }));
      this.updateHud(true);
      return;
    }
    const editor = this.state.editor;
    const piece = editor.placeSegment(this.state.tool, this.state.pendingPoint, point);
    const world = {
      ...this.state.world,
      pieces: editor.pieces,
      towers: editor.towers,
      connectors: editor.connectors,
      selectedId: piece.id,
      structures: createStructureMap(editor.pieces, editor.towers, this.state.world.baseCore, this.state.world.run.baseCoreMaxHp)
    };
    this.setState((current) => ({
      ...current,
      editor,
      world,
      analysis: this.analyze(world),
      pendingPoint: undefined,
      hoverPoint: undefined
    }));
    this.mountRenderer();
    this.updateHud(true);
  }

  private toggleSelectedGate(): void {
    const gate =
      this.state.world.pieces.find((piece) => piece.id === this.state.world.selectedId && piece.kind === "gate") ??
      this.state.world.pieces.find((piece) => piece.kind === "gate");
    if (!gate || gate.kind !== "gate") return;
    const editor = this.state.editor;
    editor.setGateState(gate.id, gate.state === "closed" ? "open" : "closed");
    const world = {
      ...this.state.world,
      pieces: editor.pieces,
      towers: editor.towers,
      connectors: editor.connectors,
      selectedId: gate.id,
      structures: createStructureMap(editor.pieces, editor.towers, this.state.world.baseCore, this.state.world.run.baseCoreMaxHp)
    };
    this.setState((current) => ({ ...current, editor, world, analysis: this.analyze(world) }));
    this.mountRenderer();
    this.updateHud(true);
  }

  private findNearestTL(point: Vec2): BasePiece | undefined {
    return this.state.world.pieces
      .filter((piece) => piece.kind === "fence-tl")
      .map((piece) => ({ piece, d: distance(point, { x: (piece.a.x + piece.b.x) * 0.5, z: (piece.a.z + piece.b.z) * 0.5 }) }))
      .sort((a, b) => a.d - b.d)[0]?.piece;
  }

  private inputState(): InputState {
    const forwardAxis = Number(this.keyboard.pressed.has("ArrowUp") || this.keyboard.pressed.has("KeyW")) - Number(this.keyboard.pressed.has("ArrowDown") || this.keyboard.pressed.has("KeyS"));
    const strafeAxis = Number(this.keyboard.pressed.has("ArrowRight") || this.keyboard.pressed.has("KeyD")) - Number(this.keyboard.pressed.has("ArrowLeft") || this.keyboard.pressed.has("KeyA"));
    if (this.state.mode === "3d") {
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

  private phaseLabel(phase: typeof this.state.world.run.phase): string {
    if (phase === "upgrade") return "Escolha upgrade";
    if (phase === "defeat") return "Derrota";
    return "Combate";
  }

  private modeLabel(mode: ViewMode): string {
    return mode === "2d" ? "2D" : mode === "25d" ? "2.5D" : "3D";
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

  private isSegmentTool(tool: ToolMode): tool is PlacementTool {
    return tool === "fence" || tool === "fence-tl" || tool === "gate";
  }

  private cameraModeLabel(mode: CameraMode3D): string {
    if (mode === "first-person") return "FP";
    if (mode === "tactical") return "Tactical";
    return "Inspect";
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
}
