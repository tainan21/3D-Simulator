import { buildBaseGraph } from "../../domain/baseGraph";
import { PhaserGeometryRenderer } from "../../render/phaserGeometryRenderer";
import { ThreeValidationRenderer } from "../../render/threeValidationRenderer";
import type { CameraMode3D, RenderDataProvider, ThreeCameraState, ViewportCamera2D } from "../../render/contracts";
import { FIXED_TIMESTEP } from "../../simulation/replay";
import { stepStudioSession } from "../../studio/session";
import { distance, clamp, type Vec2 } from "../../kernel/vector";
import { WORLD_UNIT_LABEL } from "../../kernel/worldUnits";
import type { AppRoute, AppSurfaceContext, SurfaceHandle } from "../contracts";
import { createCleanupBag, createKeyboardState, type RendererHandle, updatePerformanceSnapshot } from "./common";

const CAMERA_MODES: CameraMode3D[] = ["tactical", "inspection", "first-person"];

export class HarnessSurfaceController {
  private readonly cleanups = createCleanupBag();
  private readonly keyboard = createKeyboardState();
  private readonly renderers = new Map<string, RendererHandle>();
  private readonly canvasCleanups = new Map<string, () => void>();
  private paused = false;
  private raf = 0;
  private lastTick = performance.now();
  private accumulator = 0;

  constructor(
    private readonly host: HTMLElement,
    private readonly context: AppSurfaceContext
  ) {}

  mount(): SurfaceHandle {
    const loopCleanup = this.context.performance.trackLoop("harness:loop");
    this.cleanups.add(loopCleanup);
    this.keyboard.attach(this.cleanups);
    this.renderFrame();
    this.attachEvents();
    this.mountRenderers();
    this.updateHud();
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
        surfaceId: "harness",
        snapshot: this.context.performance.getSnapshot()
      })
    };
  }

  private get studioState() {
    return this.context.stores.studioStore.getState();
  }

  private get harnessState() {
    return this.context.stores.harnessStore.getState();
  }

  private setHarnessState(updater: Parameters<typeof this.context.stores.harnessStore.setState>[0]) {
    return this.context.stores.harnessStore.setState(updater);
  }

  private dispose(): void {
    this.canvasCleanups.forEach((cleanup) => cleanup());
    this.renderers.forEach((renderer) => renderer.destroy());
    this.canvasCleanups.clear();
    this.renderers.clear();
    this.cleanups.dispose();
    this.host.innerHTML = "";
  }

  private provider(): RenderDataProvider {
    return {
      getWorld: () => this.studioState.session.world,
      getDebugOptions: () => this.harnessState.debugOverlays,
      getDebugContacts: () => this.studioState.session.analysis.debugContacts,
      getAiDebug: () => this.studioState.session.analysis.aiDebug,
      getValidationIssues: () => this.studioState.session.analysis.validationIssues,
      getInfluenceField: () => this.studioState.session.analysis.influenceField,
      getReplayState: () => this.studioState.session.replay.state
    };
  }

  private renderFrame(): void {
    this.host.innerHTML = `
      <section class="workspace-surface harness-surface" data-testid="harness-surface">
        <header class="workspace-header">
          <div>
            <span class="panel-tag">validacao</span>
            <h1>Harness</h1>
            <p>Comparacao explicita 2D, 2.5D e 3D com o mesmo WorldState canonico, ativada apenas sob demanda.</p>
          </div>
          <div class="workspace-actions">
            <button data-action="toggle-2d">${this.harnessState.show2D ? "Ocultar 2D" : "Mostrar 2D"}</button>
            <button data-action="toggle-25d">${this.harnessState.show25D ? "Ocultar 2.5D" : "Mostrar 2.5D"}</button>
            <button data-action="toggle-3d">${this.harnessState.show3D ? "Ocultar 3D" : "Mostrar 3D"}</button>
            <button data-action="play">${this.studioState.session.timeline.playing ? "Pause" : "Play"}</button>
            <button data-action="step">Step</button>
            <button data-route="/studio">Studio</button>
          </div>
        </header>
        <div class="workspace-grid harness-grid">
          <section class="harness-grid-stage" data-testid="studio-harness">
            ${this.harnessState.show2D ? `<article class="harness-card"><div class="harness-card-meta"><strong>2D</strong><span>debug/editor</span></div><div class="studio-canvas-host" id="harness-host-2d" data-testid="studio-host-2d"></div></article>` : ""}
            ${this.harnessState.show25D ? `<article class="harness-card"><div class="harness-card-meta"><strong>2.5D</strong><span>modo principal</span></div><div class="studio-canvas-host" id="harness-host-25d" data-testid="studio-host-25d"></div></article>` : ""}
            ${this.harnessState.show3D ? `<article class="harness-card"><div class="harness-card-meta"><strong>3D</strong><span>validador espacial</span></div><div class="studio-canvas-host" id="harness-host-3d" data-testid="studio-host-3d"></div></article>` : ""}
          </section>
          <aside class="workspace-side" id="harness-side" data-testid="debug-panel"></aside>
        </div>
      </section>
    `;
  }

  private attachEvents(): void {
    const onClick = (event: Event) => this.handleClick(event as MouseEvent);
    this.host.addEventListener("click", onClick);
    this.cleanups.add(() => this.host.removeEventListener("click", onClick));
  }

  private mountRenderers(): void {
    this.canvasCleanups.forEach((cleanup) => cleanup());
    this.renderers.forEach((renderer) => renderer.destroy());
    this.canvasCleanups.clear();
    this.renderers.clear();

    if (this.harnessState.show2D) {
      const host = this.host.querySelector<HTMLElement>("#harness-host-2d");
      if (host) {
        const renderer = new PhaserGeometryRenderer({
          ...this.provider(),
          parent: host,
          mode: "2d",
          getCamera: () => this.studioCamera2D("2d"),
          getDraftSegment: () => undefined,
          onWorldClick: (point) => this.handleSelection(point),
          onWorldHover: () => undefined,
          interactionEnabled: true
        });
        renderer.mount();
        this.renderers.set("2d", renderer as unknown as RendererHandle);
        this.canvasCleanups.set("2d", this.context.performance.trackCanvas("harness:2d"));
      }
    }
    if (this.harnessState.show25D) {
      const host = this.host.querySelector<HTMLElement>("#harness-host-25d");
      if (host) {
        const renderer = new PhaserGeometryRenderer({
          ...this.provider(),
          parent: host,
          mode: "25d",
          getCamera: () => this.studioCamera2D("25d"),
          getDraftSegment: () => undefined,
          onWorldClick: (point) => this.handleSelection(point),
          onWorldHover: () => undefined,
          interactionEnabled: true
        });
        renderer.mount();
        this.renderers.set("25d", renderer as unknown as RendererHandle);
        this.canvasCleanups.set("25d", this.context.performance.trackCanvas("harness:25d"));
      }
    }
    if (this.harnessState.show3D) {
      const host = this.host.querySelector<HTMLElement>("#harness-host-3d");
      if (host) {
        const renderer = new ThreeValidationRenderer({
          ...this.provider(),
          parent: host,
          getCameraState: () => this.harnessState.camera3D
        });
        renderer.mount();
        this.renderers.set("3d", renderer as unknown as RendererHandle);
        this.canvasCleanups.set("3d", this.context.performance.trackCanvas("harness:3d"));
      }
    }
  }

  private readonly loop = (time: number): void => {
    const dt = Math.min(0.05, (time - this.lastTick) / 1000);
    this.lastTick = time;
    if (!this.paused && this.studioState.session.timeline.playing) {
      this.accumulator += dt;
      while (this.accumulator >= FIXED_TIMESTEP) {
        const nextSession = stepStudioSession(this.studioState.session, { move: { x: 0, z: 0 }, attack: false }, []);
        this.context.stores.studioStore.setState((current) => ({ ...current, session: nextSession }));
        this.accumulator -= FIXED_TIMESTEP;
      }
      updatePerformanceSnapshot(
        this.context,
        "harness",
        dt * 1000,
        this.studioState.session.analysis.timings.totalMs,
        this.studioState.session.analysis,
        this.studioState.session.world,
        this.renderers.get(this.harnessState.show3D ? "3d" : this.harnessState.show25D ? "25d" : "2d")
      );
      this.updateHud();
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  private updateHud(): void {
    const side = this.host.querySelector<HTMLElement>("#harness-side");
    if (!side) return;
    const graph = buildBaseGraph(this.studioState.session.world.pieces);
    side.innerHTML = `
      <div class="workspace-side-block">
        <h2>Harness</h2>
        <dl>
          <dt>Views</dt><dd>${[this.harnessState.show2D ? "2D" : "", this.harnessState.show25D ? "2.5D" : "", this.harnessState.show3D ? "3D" : ""].filter(Boolean).join(" | ")}</dd>
          <dt>Surface</dt><dd>${WORLD_UNIT_LABEL} | studio tick ${this.studioState.session.timeline.tick}</dd>
          <dt>Replay</dt><dd>${this.studioState.session.replay.state.status} ${this.studioState.session.replay.state.totalFrames}</dd>
          <dt>Nodes/edges</dt><dd>${graph.nodes.length} / ${graph.edges.length}</dd>
          <dt>AI</dt><dd>${this.studioState.session.analysis.aiDebug.map((entry) => `${entry.actorId}:${entry.objective}`).join(" | ") || "-"}</dd>
        </dl>
      </div>
      <div class="workspace-side-block">
        <h2>Camera</h2>
        <div class="workspace-button-grid">
          ${CAMERA_MODES.map((mode) => `<button data-camera-mode="${mode}" class="${this.harnessState.camera3D.mode === mode ? "active" : ""}">${mode}</button>`).join("")}
          <button data-focus="player" class="${this.harnessState.camera3D.focusTarget === "player" ? "active" : ""}">Player</button>
          <button data-focus="selected" class="${this.harnessState.camera3D.focusTarget === "selected" ? "active" : ""}">Selected</button>
          <button data-focus="core" class="${this.harnessState.camera3D.focusTarget === "core" ? "active" : ""}">Core</button>
        </div>
      </div>
      <div class="workspace-side-block">
        <h2>Performance</h2>
        <dl>
          <dt>Canvases</dt><dd>${this.context.performance.getSnapshot().activeCanvases}</dd>
          <dt>Loops</dt><dd>${this.context.performance.getSnapshot().activeLoops}</dd>
          <dt>AI ms</dt><dd>${this.studioState.session.analysis.timings.aiMs.toFixed(3)}</dd>
          <dt>Analysis</dt><dd>${this.studioState.session.analysis.timings.totalMs.toFixed(3)} ms</dd>
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
    switch (button.dataset.action) {
      case "toggle-2d":
        this.setHarnessState((current) => ({ ...current, show2D: !current.show2D }));
        this.renderFrame();
        this.attachEvents();
        this.mountRenderers();
        this.updateHud();
        return;
      case "toggle-25d":
        this.setHarnessState((current) => ({ ...current, show25D: !current.show25D }));
        this.renderFrame();
        this.attachEvents();
        this.mountRenderers();
        this.updateHud();
        return;
      case "toggle-3d":
        this.setHarnessState((current) => ({ ...current, show3D: !current.show3D }));
        this.renderFrame();
        this.attachEvents();
        this.mountRenderers();
        this.updateHud();
        return;
      case "play":
        this.context.stores.studioStore.setState((current) => ({ ...current, session: { ...current.session, timeline: { ...current.session.timeline, playing: !current.session.timeline.playing } } }));
        this.updateHud();
        return;
      case "step":
        this.context.stores.studioStore.setState((current) => ({ ...current, session: stepStudioSession(current.session, { move: { x: 0, z: 0 }, attack: false }, []) }));
        this.updateHud();
        return;
      default:
        break;
    }
    if (button.dataset.cameraMode) {
      this.setHarnessState((current) => ({ ...current, camera3D: { ...current.camera3D, mode: button.dataset.cameraMode as CameraMode3D } }));
      this.updateHud();
      return;
    }
    if (button.dataset.focus) {
      this.setHarnessState((current) => ({ ...current, camera3D: { ...current.camera3D, focusTarget: button.dataset.focus as ThreeCameraState["focusTarget"] } }));
      this.updateHud();
    }
  }

  private handleSelection(point: Vec2): void {
    const piece = this.studioState.session.world.pieces
      .map((entry) => ({ entry, d: distance(point, { x: (entry.a.x + entry.b.x) * 0.5, z: (entry.a.z + entry.b.z) * 0.5 }) }))
      .sort((a, b) => a.d - b.d)[0]?.entry;
    if (!piece) return;
    this.context.stores.studioStore.setState((current) => ({
      ...current,
      session: { ...current.session, selection: { kind: "piece", id: piece.id }, world: { ...current.session.world, selectedId: piece.id } }
    }));
    this.updateHud();
  }

  private studioCamera2D(view: "2d" | "25d"): ViewportCamera2D {
    const selectedId = this.studioState.session.selection?.kind === "piece" ? this.studioState.session.selection.id : undefined;
    const selected = selectedId ? this.studioState.session.world.pieces.find((piece) => piece.id === selectedId) : undefined;
    const target = selected
      ? { x: (selected.a.x + selected.b.x) * 0.5, z: (selected.a.z + selected.b.z) * 0.5 }
      : { x: this.studioState.session.world.baseCore.position.x, z: this.studioState.session.world.baseCore.position.z };
    return {
      target,
      zoom: view === "2d" ? 0.54 : 0.5
    };
  }
}
