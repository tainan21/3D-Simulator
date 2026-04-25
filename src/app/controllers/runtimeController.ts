import { pieceHorizontalBounds, pieceSockets, type BasePiece } from "../../domain/canonical";
import { type DebugOverlayOptions } from "../../domain/debug";
import type { ReplayCommand, ReplaySession } from "../../domain/analysis";
import { canonicalGeometrySignature } from "../../kernel/adapterSnapshot";
import { clamp, distance, normalize, type Vec2 } from "../../kernel/vector";
import { WORLD_UNIT_LABEL } from "../../kernel/worldUnits";
import { PhaserGeometryRenderer } from "../../render/phaserGeometryRenderer";
import type { CameraMode3D, RenderDataProvider, ThreeCameraState, ViewportCamera2D } from "../../render/contracts";
import { ThreeValidationRenderer } from "../../render/threeValidationRenderer";
import { createRuntimeBakeArtifact, materializeRuntimeSession } from "../../runtime/materialize";
import { computeWorldAnalysis } from "../../simulation/analysis";
import { DEFAULT_AI_POLICY } from "../../simulation/aiPolicy";
import { FIXED_TIMESTEP, createReplayState, pushReplayFrame, replayStateFromSession, resetReplayToInitialWorld, runtimeReplaySignature, startReplayRecording } from "../../simulation/replay";
import { stepSimulation, type InputState } from "../../simulation/simulation";
import { editorFromWorld } from "../../simulation/worldState";
import type { AppRoute, AppSurfaceContext, ReplayRecord, SurfaceHandle, ViewMode } from "../contracts";
import { STUDIO_SCENARIOS, loadScenarioPreset } from "../../studio/scenarios";
import { createCleanupBag, createKeyboardState, type RendererHandle, updatePerformanceSnapshot } from "./common";

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
  "diagnostics"
];

export class RuntimeSurfaceController {
  private readonly cleanups = createCleanupBag();
  private readonly keyboard = createKeyboardState();
  private renderer?: RendererHandle;
  private rendererCanvasCleanup?: () => void;
  private raf = 0;
  private paused = false;
  private lastTick = performance.now();
  private accumulator = 0;
  private hudStamp = 0;
  private frameMs = 0;
  private simMs = 0;
  private isDraggingCamera = false;
  private lastPointer?: { x: number; y: number };

  constructor(
    private readonly host: HTMLElement,
    private readonly context: AppSurfaceContext
  ) {}

  mount(): SurfaceHandle {
    const loopCleanup = this.context.performance.trackLoop("runtime:loop");
    this.cleanups.add(loopCleanup);
    this.keyboard.attach(this.cleanups);
    this.renderFrame();
    this.attachEvents();
    if (this.state.session) this.mountRenderer();
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
        surfaceId: "runtime",
        snapshot: this.context.performance.getSnapshot()
      })
    };
  }

  private get state() {
    return this.context.stores.runtimeStore.getState();
  }

  private setState(updater: Parameters<typeof this.context.stores.runtimeStore.setState>[0]) {
    return this.context.stores.runtimeStore.setState(updater);
  }

  private dispose(): void {
    this.rendererCanvasCleanup?.();
    this.renderer?.destroy();
    this.cleanups.dispose();
    this.host.innerHTML = "";
  }

  private renderFrame(): void {
    const hasSession = Boolean(this.state.session);
    this.host.innerHTML = `
      <section class="workspace-surface" data-testid="runtime-surface">
        <header class="workspace-header">
          <div>
            <span class="panel-tag">jogo</span>
            <h1>Runtime</h1>
            <p>Superficie jogavel e materializada a partir do ultimo bake valido, com replay e fallback explicito para presets.</p>
          </div>
          <div class="workspace-actions">
            ${MODES.map((mode) => `<button data-mode="${mode}">${this.modeLabel(mode)}</button>`).join("")}
            <button data-action="runtime-record">${this.state.replaySession?.status === "recording" ? "Stop Rec" : "Record"}</button>
            <button data-action="runtime-replay">Replay</button>
            <button data-action="runtime-reset">Reset Runtime</button>
            <button data-action="runtime-bake-studio">Bake Studio</button>
          </div>
        </header>
        <div class="workspace-grid">
          <section class="workspace-stage">
            <div class="workspace-floating top">
              ${CAMERA_MODES.map((mode) => `<button data-camera-mode="${mode}">${this.cameraModeLabel(mode)}</button>`).join("")}
            </div>
            <div class="workspace-floating bottom">
              <button data-action="toggle-debug">Debug</button>
              <button data-action="toggle-gate">Portao</button>
              <button data-route="/replay">Replays</button>
            </div>
            <div class="workspace-stage-status" id="runtime-status"></div>
            ${
              hasSession
                ? `<div class="canvas-host" id="runtime-canvas" data-testid="canvas-host"></div>`
                : `<div class="runtime-fallback" data-testid="runtime-fallback">
                    <h2>Sem bake salvo</h2>
                    <p>Escolha um preset para materializar um Runtime leve ou bakeie diretamente o estado atual do Studio.</p>
                    <div class="workspace-button-grid">
                      <button data-action="runtime-bake-studio">Bake do Studio</button>
                      ${STUDIO_SCENARIOS.map((scenario) => `<button data-runtime-scenario="${scenario.id}">${scenario.name}</button>`).join("")}
                    </div>
                  </div>`
            }
            <pre id="runtime-signature" class="sr-only" data-testid="canonical-signature"></pre>
          </section>
          <aside class="workspace-side" id="runtime-side" data-testid="debug-panel"></aside>
        </div>
      </section>
    `;
  }

  private attachEvents(): void {
    const onClick = (event: Event) => this.handleClick(event as MouseEvent);
    const onWheel = (event: WheelEvent) => {
      if (!this.state.session || this.state.mode !== "3d" || this.state.camera3D.mode === "first-person") return;
      event.preventDefault();
      this.setState((current) => ({ ...current, camera3D: { ...current.camera3D, distance: clamp(current.camera3D.distance + Math.sign(event.deltaY) * 0.8, 4.5, 20) } }));
      this.updateHud(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!this.state.session || this.state.mode !== "3d" || this.state.camera3D.mode === "first-person") return;
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
      if (!this.state.session || this.state.mode !== "3d" || this.state.camera3D.mode !== "first-person") return;
      const canvas = this.host.querySelector<HTMLCanvasElement>("#runtime-canvas canvas");
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
    this.host.querySelector("#runtime-canvas")?.addEventListener("wheel", onWheel as EventListener, { passive: false });
    this.host.querySelector("#runtime-canvas")?.addEventListener("pointerdown", onPointerDown as EventListener);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("mousemove", onMouseMove);

    this.cleanups.add(() => this.host.removeEventListener("click", onClick));
    this.cleanups.add(() => this.host.querySelector("#runtime-canvas")?.removeEventListener("wheel", onWheel as EventListener));
    this.cleanups.add(() => this.host.querySelector("#runtime-canvas")?.removeEventListener("pointerdown", onPointerDown as EventListener));
    this.cleanups.add(() => window.removeEventListener("pointermove", onPointerMove));
    this.cleanups.add(() => window.removeEventListener("pointerup", onPointerUp));
    this.cleanups.add(() => window.removeEventListener("mousemove", onMouseMove));
  }

  private provider(): RenderDataProvider {
    const session = this.state.session;
    return {
      getWorld: () => session?.world ?? loadScenarioPreset("baseline", 101),
      getDebugOptions: () => this.state.debugOverlays,
      getDebugContacts: () => session?.analysis.debugContacts ?? [],
      getAiDebug: () => session?.analysis.aiDebug ?? [],
      getValidationIssues: () => session?.analysis.validationIssues ?? [],
      getInfluenceField: () => session?.analysis.influenceField ?? { bounds: { min: { x: 0, z: 0 }, max: { x: 0, z: 0 } }, cellSize: 1, cells: [] },
      getReplayState: () => replayStateFromSession(this.state.replaySession)
    };
  }

  private mountRenderer(): void {
    this.rendererCanvasCleanup?.();
    this.renderer?.destroy();
    this.renderer = undefined;
    const canvasHost = this.host.querySelector<HTMLElement>("#runtime-canvas");
    if (!canvasHost || !this.state.session) return;
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
        getDraftSegment: () => undefined,
        onWorldClick: (point) => this.handleWorldClick(point),
        onWorldHover: () => undefined,
        interactionEnabled: true
      });
      renderer.mount();
      this.renderer = renderer as unknown as RendererHandle;
    }
    const canvas = canvasHost.querySelector("canvas");
    if (canvas) {
      this.rendererCanvasCleanup = this.context.performance.trackCanvas(`runtime:${this.state.mode}`);
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
    if (!this.paused && this.state.session) {
      const frameStart = performance.now();
      if (this.state.mode === "3d") {
        const turn = Number(this.keyboard.pressed.has("KeyE")) - Number(this.keyboard.pressed.has("KeyQ"));
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
      this.accumulator += dt;
      while (this.accumulator >= FIXED_TIMESTEP) {
        const simStart = performance.now();
        const currentSession = this.state.session;
        if (!currentSession) break;
        const input = this.inputState();
        const nextWorld = stepSimulation(currentSession.world, input, FIXED_TIMESTEP, DEFAULT_AI_POLICY);
        this.simMs = performance.now() - simStart;
        let replaySession = this.state.replaySession;
        if (replaySession?.status === "recording") {
          replaySession = pushReplayFrame(replaySession, nextWorld.tick, input, [], nextWorld);
        }
        const analysis = computeWorldAnalysis(nextWorld, replayStateFromSession(replaySession), DEFAULT_AI_POLICY);
        this.setState((current) => ({
          ...current,
          replaySession,
          session: current.session ? { ...current.session, world: nextWorld, analysis } : current.session
        }));
        this.accumulator -= FIXED_TIMESTEP;
        if (nextWorld.run.phase !== "combat") break;
      }
      this.frameMs = performance.now() - frameStart;
      this.updateHud();
      if (this.state.session) updatePerformanceSnapshot(this.context, "runtime", this.frameMs, this.simMs, this.state.session.analysis, this.state.session.world, this.renderer);
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  private updateHud(force = false): void {
    const now = performance.now();
    if (!force && now - this.hudStamp < 140) return;
    this.hudStamp = now;
    this.host.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === this.state.mode));
    this.host.querySelectorAll<HTMLButtonElement>("[data-camera-mode]").forEach((button) => button.classList.toggle("active", button.dataset.cameraMode === this.state.camera3D.mode));
    const status = this.host.querySelector<HTMLElement>("#runtime-status");
    const side = this.host.querySelector<HTMLElement>("#runtime-side");
    const signature = this.host.querySelector<HTMLElement>("#runtime-signature");
    if (!side) return;
    if (!this.state.session) {
      side.innerHTML = `
        <div class="workspace-side-block">
          <h2>Fallback</h2>
          <p>O Runtime esta leve porque nada foi materializado ainda. Abra um preset ou bakeie o Studio.</p>
        </div>
      `;
      return;
    }
    const world = this.state.session.world;
    const analysis = this.state.session.analysis;
    const selected = world.pieces.find((piece) => piece.id === world.selectedId);
    const replayState = replayStateFromSession(this.state.replaySession);
    const sig = canonicalGeometrySignature(world);
    if (signature) signature.textContent = sig;
    if (status) {
      status.textContent = `${WORLD_UNIT_LABEL} | artifact ${this.state.artifact?.label ?? "-"} | modo ${this.modeLabel(this.state.mode)} | replay ${replayState.status} ${replayState.frame}/${replayState.totalFrames}`;
    }
    side.innerHTML = `
      <div class="workspace-side-block">
        <h2>Runtime</h2>
        <dl>
          <dt>Artifact</dt><dd>${this.state.artifact?.label ?? "-"}</dd>
          <dt>Fonte</dt><dd>${this.state.artifact?.source ?? "-"}</dd>
          <dt>Tick</dt><dd>${world.tick}</dd>
          <dt>Fase</dt><dd>${world.run.phase}</dd>
          <dt>Base</dt><dd>${world.run.baseCoreHp.toFixed(1)} / ${world.run.baseCoreMaxHp}</dd>
        </dl>
      </div>
      <div class="workspace-side-block">
        <h2>Performance</h2>
        <dl>
          <dt>Frame</dt><dd>${this.frameMs.toFixed(2)} ms</dd>
          <dt>Sim</dt><dd>${this.simMs.toFixed(2)} ms</dd>
          <dt>AI</dt><dd>${analysis.timings.aiMs.toFixed(2)} ms</dd>
          <dt>Renderers</dt><dd>${this.context.performance.getSnapshot().activeCanvases}</dd>
          <dt>Loops</dt><dd>${this.context.performance.getSnapshot().activeLoops}</dd>
        </dl>
      </div>
      <div class="workspace-side-block">
        <h2>Debug</h2>
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
          <dt>AI</dt><dd>${analysis.aiDebug.map((entry) => `${entry.actorId}:${entry.objective}`).join(" | ") || "-"}</dd>
          <dt>Issues</dt><dd>${analysis.validationIssues.map((issue) => `${issue.severity}:${issue.kind}`).join(" | ") || "sem issues"}</dd>
        </dl>
      </div>
    `;
  }

  private handleClick(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLElement>("button");
    if (!button) return;
    if (button.dataset.route) {
      this.context.navigate(button.dataset.route as AppRoute);
      return;
    }
    if (button.dataset.runtimeScenario) {
      const scenarioId = button.dataset.runtimeScenario;
      const world = loadScenarioPreset(scenarioId, 101);
      const artifact = createRuntimeBakeArtifact(world, "scenario", `Scenario ${scenarioId}`, 0, scenarioId);
      const session = materializeRuntimeSession(artifact);
      this.setState((current) => ({ ...current, artifact, session }));
      this.renderFrame();
      this.attachEvents();
      this.mountRenderer();
      this.updateHud(true);
      return;
    }
    if (button.dataset.mode) {
      this.setState((current) => ({ ...current, mode: button.dataset.mode as ViewMode }));
      if (this.state.session) this.mountRenderer();
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
      if (this.state.session) this.mountRenderer();
      this.updateHud(true);
      return;
    }
    switch (button.dataset.action) {
      case "runtime-bake-studio":
        this.bakeStudioIntoRuntime();
        break;
      case "runtime-record":
        this.toggleRecording();
        break;
      case "runtime-replay":
        this.replayRecording();
        break;
      case "runtime-reset":
        this.resetRuntime();
        break;
      case "toggle-debug":
        this.setState((current) => ({ ...current, debugOverlays: { ...current.debugOverlays, enabled: !current.debugOverlays.enabled } }));
        if (this.state.session) this.mountRenderer();
        this.updateHud(true);
        break;
      case "toggle-gate":
        this.toggleSelectedGate();
        break;
      default:
        break;
    }
  }

  private geometryCamera(): ViewportCamera2D {
    const canvasHost = this.host.querySelector<HTMLElement>("#runtime-canvas");
    const width = canvasHost?.clientWidth || 900;
    const height = canvasHost?.clientHeight || 650;
    const zoom = Math.max(0.34, Math.min(0.92, Math.min(width / 1320, height / 980)));
    const world = this.state.session?.world ?? loadScenarioPreset("baseline", 101);
    return {
      target: { x: world.baseCore.position.x, z: world.baseCore.position.z - 0.6 },
      zoom
    };
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
        attack: this.keyboard.pressed.has("Space")
      };
    }
    return {
      move: { x: strafeAxis, z: -forwardAxis },
      attack: this.keyboard.pressed.has("Space")
    };
  }

  private handleWorldClick(point: Vec2): void {
    if (!this.state.session) return;
    const piece = this.state.session.world.pieces
      .map((entry) => ({ entry, d: distance(point, { x: (entry.a.x + entry.b.x) * 0.5, z: (entry.a.z + entry.b.z) * 0.5 }) }))
      .sort((a, b) => a.d - b.d)[0]?.entry;
    if (!piece) return;
    const nextWorld = { ...this.state.session.world, selectedId: piece.id };
    this.setState((current) => ({
      ...current,
      session: current.session ? { ...current.session, world: nextWorld, analysis: computeWorldAnalysis(nextWorld, replayStateFromSession(current.replaySession), DEFAULT_AI_POLICY) } : current.session
    }));
    this.updateHud(true);
  }

  private bakeStudioIntoRuntime(): void {
    const studio = this.context.stores.studioStore.getState().session;
    const artifact = createRuntimeBakeArtifact(studio.world, "studio", `Studio ${studio.scenarioId}`, studio.timeline.tick, studio.scenarioId);
    const session = materializeRuntimeSession(artifact);
    this.setState((current) => ({ ...current, artifact, session, replaySession: undefined }));
    this.renderFrame();
    this.attachEvents();
    this.mountRenderer();
    this.updateHud(true);
  }

  private resetRuntime(): void {
    if (!this.state.artifact) return;
    const session = materializeRuntimeSession(this.state.artifact);
    this.setState((current) => ({ ...current, session, replaySession: undefined }));
    this.mountRenderer();
    this.updateHud(true);
  }

  private toggleRecording(): void {
    const session = this.state.session;
    if (!session) return;
    if (this.state.replaySession?.status === "recording") {
      const pausedSession: ReplaySession = { ...this.state.replaySession, status: "paused" };
      this.setState((current) => ({ ...current, replaySession: pausedSession }));
      this.persistReplayRecord(pausedSession, "runtime");
      this.updateHud(true);
      return;
    }
    this.setState((current) => ({ ...current, replaySession: startReplayRecording(session.world) }));
    this.updateHud(true);
  }

  private replayRecording(): void {
    if (!this.state.replaySession || !this.state.session) return;
    let world = resetReplayToInitialWorld(this.state.replaySession);
    for (const frame of this.state.replaySession.frames) {
      for (const command of frame.commands) {
        world = this.applyReplayCommand(world, command);
      }
      world = stepSimulation(world, frame.input, FIXED_TIMESTEP, DEFAULT_AI_POLICY);
    }
    const divergence =
      this.state.replaySession.frames.at(-1)?.signature !== runtimeReplaySignature(world)
        ? `expected ${this.state.replaySession.frames.at(-1)?.signature} got ${runtimeReplaySignature(world)}`
        : undefined;
    const replaySession: ReplaySession = {
      ...this.state.replaySession,
      status: "paused",
      frame: this.state.replaySession.frames.length,
      divergence
    };
    this.persistReplayRecord(replaySession, "runtime");
    this.setState((current) => ({
      ...current,
      replaySession,
      session: current.session ? { ...current.session, world, analysis: computeWorldAnalysis(world, replayStateFromSession(replaySession), DEFAULT_AI_POLICY) } : current.session
    }));
    this.mountRenderer();
    this.updateHud(true);
  }

  private applyReplayCommand(world: ReturnType<typeof resetReplayToInitialWorld>, command: ReplayCommand) {
    if (command.kind !== "toggle-gate") return world;
    const gate = world.pieces.find((piece) => piece.id === command.gateId && piece.kind === "gate");
    if (!gate || gate.kind !== "gate") return world;
    const editor = editorFromWorld(world);
    editor.setGateState(gate.id, gate.state === "open" ? "closed" : "open");
    return {
      ...world,
      pieces: editor.pieces,
      towers: editor.towers,
      connectors: editor.connectors
    };
  }

  private toggleSelectedGate(): void {
    if (!this.state.session) return;
    const gate =
      this.state.session.world.pieces.find((piece) => piece.id === this.state.session?.world.selectedId && piece.kind === "gate") ??
      this.state.session.world.pieces.find((piece) => piece.kind === "gate");
    if (!gate || gate.kind !== "gate") return;
    const editor = editorFromWorld(this.state.session.world);
    editor.setGateState(gate.id, gate.state === "closed" ? "open" : "closed");
    const nextWorld = {
      ...this.state.session.world,
      pieces: editor.pieces,
      towers: editor.towers,
      connectors: editor.connectors,
      selectedId: gate.id
    };
    const replaySession = this.state.replaySession?.status === "recording" ? { ...this.state.replaySession, frames: [...this.state.replaySession.frames] } : this.state.replaySession;
    this.setState((current) => ({
      ...current,
      replaySession,
      session: current.session ? { ...current.session, world: nextWorld, analysis: computeWorldAnalysis(nextWorld, replayStateFromSession(current.replaySession), DEFAULT_AI_POLICY) } : current.session
    }));
    this.mountRenderer();
    this.updateHud(true);
  }

  private persistReplayRecord(session: ReplaySession, source: ReplayRecord["source"]): void {
    const record: ReplayRecord = {
      id: `replay-${source}-${session.seed}-${session.frame}`,
      label: this.state.artifact?.label ?? `Runtime ${source}`,
      source,
      createdAt: Date.now(),
      session
    };
    this.context.stores.replayStore.setState((current) => {
      const nextRecords = [...current.records.filter((entry) => entry.id !== record.id), record].sort((a, b) => b.createdAt - a.createdAt);
      return {
        records: nextRecords,
        selectedId: record.id
      };
    });
  }

  private modeLabel(mode: ViewMode): string {
    return mode === "2d" ? "2D" : mode === "25d" ? "2.5D" : "3D";
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
      diagnostics: "Issues"
    };
    return labels[key];
  }
}
