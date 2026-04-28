import {
  ACTOR_VISUAL_PROFILES,
  type ActorKind,
  type ActorVisualVariant
} from "../../domain/canonical";
import {
  ATTACK_PATTERNS,
  BEHAVIOR_PATTERNS,
  canonicalCharacterSignature,
  createCharacterPreviewWorld,
  DEFAULT_CHARACTER_ARCHETYPE,
  updateCharacterArchetype,
  type AttackPattern,
  type AttackPatternId,
  type BehaviorPattern,
  type BehaviorPatternId,
  type CharacterArchetype,
  type EntityFaction
} from "../../domain/entityArchetype";
import { DEFAULT_DEBUG_OVERLAYS, type DebugOverlayOptions } from "../../domain/debug";
import { createGeometryParityReport } from "../../studio/geometryParity";
import type { WorldState } from "../../simulation/worldState";
import { createRuntimeBakeArtifact, materializeRuntimeSession } from "../../runtime/materialize";
import { createCreatedMobPackageFromArchetype, createdMobRecordFromPackage } from "../../domain/createdMob";
import { importCreatedMobPayload, loadCreatedMobCache, upsertCreatedMobRecord } from "../../infrastructure/createdMobCache";
import { PhaserGeometryRenderer } from "../../render/phaserGeometryRenderer";
import { ThreeValidationRenderer } from "../../render/threeValidationRenderer";
import type { AppRoute, AppSurfaceContext, SurfaceHandle, ViewMode } from "../contracts";
import { createCleanupBag, type RendererHandle } from "./common";
import type { CameraMode3D, RenderDataProvider, ThreeCameraState, ViewportCamera2D } from "../../render/contracts";

const CHARACTER_VIEWS: ViewMode[] = ["2d", "25d", "3d"];
const CAMERA_MODES: CameraMode3D[] = ["tactical", "inspection", "first-person"];

const DEBUG_OFF: DebugOverlayOptions = {
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

export class CharacterStudioController {
  private readonly cleanups = createCleanupBag();
  private readonly renderers = new Map<string, RendererHandle>();
  private readonly rendererCanvasCleanups: Array<() => void> = [];
  private previewWorld: WorldState = createCharacterPreviewWorld(DEFAULT_CHARACTER_ARCHETYPE);

  constructor(
    private readonly host: HTMLElement,
    private readonly context: AppSurfaceContext
  ) {}

  mount(): SurfaceHandle {
    this.previewWorld = createCharacterPreviewWorld(this.archetype);
    this.renderFrame();
    this.attachEvents();
    this.mountRenderers();
    this.updateInspector();
    return {
      dispose: () => this.dispose(),
      collectDiagnostics: () => ({
        surfaceId: "characters",
        snapshot: this.context.performance.getSnapshot()
      })
    };
  }

  private dispose(): void {
    this.disposeRenderersOnly();
    this.cleanups.dispose();
    this.host.innerHTML = "";
  }

  private get state() {
    return this.context.stores.characterStudioStore.getState();
  }

  private get archetype() {
    return this.state.archetype;
  }

  private get view() {
    return this.state.view;
  }

  private get camera() {
    return this.state.camera3D;
  }

  private setState(updater: Parameters<typeof this.context.stores.characterStudioStore.setState>[0]) {
    return this.context.stores.characterStudioStore.setState(updater);
  }

  private renderFrame(): void {
    this.host.innerHTML = `
      <section class="character-shell character-view-${this.view}" data-testid="character-studio-shell">
        <nav class="studio-route-tabs">
          <button data-route="/studio">Base Shell</button>
          <button data-route="/characters">Personagens</button>
          <button data-route="/character-forge">Character Forge</button>
          <button data-route="/runtime">Runtime</button>
        </nav>
        <header class="character-topbar">
          <div>
            <div class="brand">Character Studio</div>
            <div class="status-line">Entidades geometricas | ataques | padroes | encontros</div>
          </div>
          <div class="studio-view-switch">
            ${CHARACTER_VIEWS.map((view) => `<button data-character-view="${view}" class="${this.view === view ? "active" : ""}">${this.viewLabel(view)}</button>`).join("")}
          </div>
          <div class="studio-inline-buttons">
            ${CAMERA_MODES.map((mode) => `<button data-character-camera="${mode}">${this.cameraModeLabel(mode)}</button>`).join("")}
            <button data-character-action="save">Salvar</button>
            <button data-character-action="duplicate">Duplicar</button>
            <button data-character-action="export-mob">Export Mob</button>
            <button data-character-action="import-mob">Import Mob</button>
            <button data-character-action="reset">Reset</button>
            <button data-character-action="bake-runtime">Bake Runtime</button>
          </div>
        </header>
        <section class="character-layout">
          <aside class="character-builder">
            <section class="studio-panel-block">
              <h2>Entidade</h2>
              ${this.textInput("label", "Nome", this.archetype.label)}
              ${this.selectInput("kind", "Tipo", this.archetype.kind, ["player", "enemy", "dwarf", "boss"])}
              ${this.selectInput("faction", "Faccao", this.archetype.faction, ["player", "hostile", "neutral"])}
              ${this.selectInput("visual", "Visual", this.archetype.visual, Object.keys(ACTOR_VISUAL_PROFILES))}
            </section>
            <section class="studio-panel-block">
              <h2>Corpo geometrico</h2>
              ${this.numberInput("radius", "Raio", this.archetype.body.radius, 0.12, 1.4, 0.01)}
              ${this.numberInput("height", "Altura", this.archetype.body.height, 0.4, 5.5, 0.05)}
              ${this.numberInput("speed", "Velocidade", this.archetype.body.speed, 0.4, 5, 0.05)}
              ${this.numberInput("hp", "HP", this.archetype.body.hp, 1, 80, 1)}
            </section>
            <section class="studio-panel-block">
              <h2>Stress</h2>
              ${this.numberInput("crowdCount", "Quantidade", this.archetype.crowdCount, 1, 160, 1)}
              <div class="segmented-row">
                <button data-crowd-preset="8">8</button>
                <button data-crowd-preset="40">40</button>
                <button data-crowd-preset="120">120</button>
              </div>
            </section>
            <section class="studio-panel-block">
              <h2>Biblioteca</h2>
              <div class="catalog-list">
                ${this.state.library.map((entry) => `<button data-character-load="${entry.id}" class="${entry.id === this.state.selectedId ? "active" : ""}"><strong>${entry.label}</strong><span>${entry.kind} | ${entry.attackId} | ${entry.behaviorId}</span></button>`).join("")}
              </div>
            </section>
            <section class="studio-panel-block created-mob-list" data-testid="created-mob-list">
              <h2>Mobs criados</h2>
              <p class="muted">Cache mockado Postgres + Blob, alimentado pelo Character Forge.</p>
              <div class="catalog-list">
                ${this.createdMobButtons()}
              </div>
            </section>
          </aside>
          <section class="character-stage">
            <div class="studio-harness character-harness">
              <article class="studio-view-card ${this.view === "2d" ? "active-view" : "mini-view"}">
                <div class="studio-view-meta"><strong>2D</strong><span>silhueta e footprint</span></div>
                <div id="character-host-2d" class="studio-canvas-host"></div>
              </article>
              <article class="studio-view-card ${this.view === "25d" ? "active-view" : "mini-view"}">
                <div class="studio-view-meta"><strong>2.5D</strong><span>leitura principal</span></div>
                <div id="character-host-25d" class="studio-canvas-host"></div>
              </article>
              <article class="studio-view-card ${this.view === "3d" ? "active-view" : "mini-view"}">
                <div class="studio-view-meta"><strong>3D</strong><span>auditoria volumetrica</span></div>
                <div id="character-host-3d" class="studio-canvas-host"></div>
              </article>
            </div>
            <div class="character-bottom" id="character-bottom"></div>
          </section>
          <aside class="character-inspector" id="character-inspector"></aside>
        </section>
      </section>
    `;
  }

  private attachEvents(): void {
    const onClick = (event: Event) => this.handleClick(event as MouseEvent);
    const onInput = (event: Event) => this.handleInput(event);
    this.host.addEventListener("click", onClick);
    this.host.addEventListener("input", onInput);
    this.cleanups.add(() => this.host.removeEventListener("click", onClick));
    this.cleanups.add(() => this.host.removeEventListener("input", onInput));
  }

  private mountRenderers(): void {
    const host2D = this.host.querySelector<HTMLElement>("#character-host-2d");
    const host25D = this.host.querySelector<HTMLElement>("#character-host-25d");
    const host3D = this.host.querySelector<HTMLElement>("#character-host-3d");
    if (host2D) {
      const renderer = new PhaserGeometryRenderer({
        ...this.provider(),
        parent: host2D,
        mode: "2d",
        getCamera: () => this.camera2D("2d"),
        getDraftSegment: () => undefined,
        onWorldClick: () => undefined,
        onWorldHover: () => undefined,
        interactionEnabled: false
      }) as unknown as RendererHandle;
      (renderer as unknown as PhaserGeometryRenderer).mount();
      this.renderers.set("2d", renderer);
      this.rendererCanvasCleanups.push(this.context.performance.trackCanvas("characters:2d"));
    }
    if (host25D) {
      const renderer = new PhaserGeometryRenderer({
        ...this.provider(),
        parent: host25D,
        mode: "25d",
        getCamera: () => this.camera2D("25d"),
        getDraftSegment: () => undefined,
        onWorldClick: () => undefined,
        onWorldHover: () => undefined,
        interactionEnabled: false
      }) as unknown as RendererHandle;
      (renderer as unknown as PhaserGeometryRenderer).mount();
      this.renderers.set("25d", renderer);
      this.rendererCanvasCleanups.push(this.context.performance.trackCanvas("characters:25d"));
    }
    if (host3D) {
      const renderer = new ThreeValidationRenderer({
        ...this.provider(),
        parent: host3D,
        getCameraState: () => this.camera
      }) as unknown as RendererHandle;
      (renderer as unknown as ThreeValidationRenderer).mount();
      this.renderers.set("3d", renderer);
      this.rendererCanvasCleanups.push(this.context.performance.trackCanvas("characters:3d"));
    }
  }

  private provider(): RenderDataProvider {
    return {
      getWorld: () => this.previewWorld,
      getGhostWorld: () => undefined,
      getDebugOptions: () => DEBUG_OFF,
      getDebugContacts: () => [],
      getAiDebug: () => [],
      getValidationIssues: () => [],
      getInfluenceField: () => ({ bounds: { min: { x: -1, z: -1 }, max: { x: 1, z: 1 } }, cellSize: 1, cells: [] }),
      getReplayState: () => ({ status: "idle", seed: 0, totalFrames: 0, frame: 0, divergence: undefined })
    };
  }

  private handleClick(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLElement>("button");
    if (!button) return;
    if (button.dataset.route) {
      this.context.navigate(button.dataset.route as AppRoute);
      return;
    }
    if (button.dataset.characterView) {
      this.setState((current) => ({ ...current, view: button.dataset.characterView as ViewMode }));
      this.remount();
      return;
    }
    if (button.dataset.characterCamera) {
      this.setState((current) => ({ ...current, camera3D: { ...current.camera3D, mode: button.dataset.characterCamera as CameraMode3D } }));
      return;
    }
    if (button.dataset.characterLoad) {
      const archetype = this.state.library.find((entry) => entry.id === button.dataset.characterLoad);
      if (archetype) this.setArchetype(archetype, archetype.id, true);
      return;
    }
    if (button.dataset.createdMob) {
      const record = loadCreatedMobCache().records.find((entry) => entry.id === button.dataset.createdMob);
      if (record) this.setArchetype(record.archetype, record.archetype.id, true);
      return;
    }
    if (button.dataset.characterAction) {
      this.handleAction(button.dataset.characterAction);
      return;
    }
    if (button.dataset.attack) {
      this.setArchetype(updateCharacterArchetype(this.archetype, { attackId: button.dataset.attack as AttackPatternId }));
      return;
    }
    if (button.dataset.behavior) {
      this.setArchetype(updateCharacterArchetype(this.archetype, { behaviorId: button.dataset.behavior as BehaviorPatternId }));
      return;
    }
    if (button.dataset.crowdPreset) {
      this.setArchetype(updateCharacterArchetype(this.archetype, { crowdCount: Number(button.dataset.crowdPreset) }));
    }
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLElement;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    const field = target.dataset.characterField;
    if (!field) return;
    if (field === "label") {
      this.setArchetype(updateCharacterArchetype(this.archetype, { label: target.value }));
      return;
    }
    if (field === "kind") {
      this.setArchetype(updateCharacterArchetype(this.archetype, { kind: target.value as ActorKind }));
      return;
    }
    if (field === "faction") {
      this.setArchetype(updateCharacterArchetype(this.archetype, { faction: target.value as EntityFaction }));
      return;
    }
    if (field === "visual") {
      this.setArchetype(updateCharacterArchetype(this.archetype, { visual: target.value as ActorVisualVariant }));
      return;
    }
    if (field === "crowdCount") {
      this.setArchetype(updateCharacterArchetype(this.archetype, { crowdCount: Number(target.value) }));
      return;
    }
    const bodyField = field as keyof CharacterArchetype["body"];
    this.setArchetype(updateCharacterArchetype(this.archetype, { body: { ...this.archetype.body, [bodyField]: Number(target.value) } }));
  }

  private setArchetype(archetype: CharacterArchetype, selectedId = this.state.selectedId ?? archetype.id, remount = false): void {
    this.setState((current) => ({ ...current, archetype, selectedId }));
    this.previewWorld = createCharacterPreviewWorld(archetype);
    if (remount) {
      this.remount();
      return;
    }
    this.updateInspector();
  }

  private remount(): void {
    this.disposeRenderersOnly();
    this.renderFrame();
    this.mountRenderers();
    this.updateInspector();
  }

  private handleAction(action: string): void {
    if (action === "reset") {
      this.setArchetype(DEFAULT_CHARACTER_ARCHETYPE, DEFAULT_CHARACTER_ARCHETYPE.id, true);
      return;
    }
    if (action === "duplicate") {
      const id = `${this.archetype.id}-copy-${Date.now().toString(36)}`;
      const duplicate = { ...this.archetype, id, label: `${this.archetype.label} copy` };
      this.setState((current) => ({ ...current, archetype: duplicate, selectedId: id, library: [...current.library, duplicate] }));
      this.previewWorld = createCharacterPreviewWorld(duplicate);
      this.remount();
      return;
    }
    if (action === "save") {
      const nextLibrary = [this.archetype, ...this.state.library.filter((entry) => entry.id !== this.archetype.id)];
      this.setState((current) => ({ ...current, library: nextLibrary, selectedId: this.archetype.id }));
      this.remount();
      return;
    }
    if (action === "export-mob") {
      const record = createdMobRecordFromPackage(createCreatedMobPackageFromArchetype(this.archetype));
      upsertCreatedMobRecord(record);
      this.downloadPayload(record.packageJson, `${this.archetype.id}.rogue-mob.json`);
      void navigator.clipboard?.writeText(record.packageJson);
      this.setState((current) => ({
        ...current,
        library: [record.archetype, ...current.library.filter((entry) => entry.id !== record.archetype.id)],
        archetype: record.archetype,
        selectedId: record.archetype.id
      }));
      this.remount();
      return;
    }
    if (action === "import-mob") {
      const raw = window.prompt("Paste .rogue-mob JSON");
      if (!raw) return;
      const record = importCreatedMobPayload(raw);
      this.setState((current) => ({
        ...current,
        archetype: record.archetype,
        selectedId: record.archetype.id,
        library: [record.archetype, ...current.library.filter((entry) => entry.id !== record.archetype.id)]
      }));
      this.previewWorld = createCharacterPreviewWorld(record.archetype);
      this.remount();
      return;
    }
    if (action === "bake-runtime") {
      const artifact = createRuntimeBakeArtifact(this.previewWorld, "studio", `Character ${this.archetype.label}`, 0, "character-studio");
      const session = materializeRuntimeSession(artifact);
      this.context.stores.runtimeStore.setState((current) => ({ ...current, artifact, session, replaySession: undefined, mode: "3d" }));
      this.context.navigate("/runtime");
    }
  }

  private updateInspector(): void {
    const inspector = this.host.querySelector<HTMLElement>("#character-inspector");
    const bottom = this.host.querySelector<HTMLElement>("#character-bottom");
    const attack = ATTACK_PATTERNS.find((entry) => entry.id === this.archetype.attackId) ?? ATTACK_PATTERNS[0];
    const behavior = BEHAVIOR_PATTERNS.find((entry) => entry.id === this.archetype.behaviorId) ?? BEHAVIOR_PATTERNS[0];
    const parity = createGeometryParityReport(this.previewWorld);
    const createdCache = loadCreatedMobCache();
    if (inspector) {
      inspector.innerHTML = `
        <section class="studio-panel-block parity-gate ${parity.ok ? "ok" : "fail"}">
          <h2>Parity</h2>
          <dl>
            <dt>Status</dt><dd>${parity.ok ? "OK" : "FAIL"}</dd>
            <dt>Actors</dt><dd>${this.previewWorld.actors.length}</dd>
            <dt>Mobs criados</dt><dd>${createdCache.records.length}</dd>
            <dt>Signature</dt><dd>${canonicalCharacterSignature(this.archetype).slice(0, 42)}...</dd>
          </dl>
        </section>
        <section class="studio-panel-block">
          <h2>Ataques</h2>
          <div class="catalog-list">
            ${ATTACK_PATTERNS.map((entry) => this.catalogButton("attack", entry.id, entry.label, `${entry.geometry} | r ${entry.range} | cd ${entry.cooldown}`, entry.id === this.archetype.attackId)).join("")}
          </div>
        </section>
        <section class="studio-panel-block">
          <h2>Padroes</h2>
          <div class="catalog-list">
            ${BEHAVIOR_PATTERNS.map((entry) => this.catalogButton("behavior", entry.id, entry.label, `${entry.objective} | aggro ${entry.aggression}`, entry.id === this.archetype.behaviorId)).join("")}
          </div>
        </section>
      `;
    }
    if (bottom) {
      bottom.innerHTML = `
        <section class="studio-panel-block">
          <h2>Encounter Lab v1</h2>
          <dl>
            <dt>Entity</dt><dd>${this.archetype.label} / ${this.archetype.kind}</dd>
            <dt>Attack</dt><dd>${attack.label} (${attack.geometry})</dd>
            <dt>Behavior</dt><dd>${behavior.label} -> ${behavior.objective}</dd>
            <dt>Crowd</dt><dd>${this.archetype.crowdCount} entidades</dd>
            <dt>Created mobs</dt><dd>${createdCache.records.map((record) => record.label).slice(0, 4).join(" | ") || "cache vazio"}</dd>
          </dl>
          <div class="attack-geometry">${this.attackShapeSvg(attack, behavior)}</div>
        </section>
      `;
    }
  }

  private disposeRenderersOnly(): void {
    while (this.rendererCanvasCleanups.length > 0) this.rendererCanvasCleanups.pop()?.();
    this.renderers.forEach((renderer) => renderer.destroy());
    this.renderers.clear();
  }

  private camera2D(mode: "2d" | "25d"): ViewportCamera2D {
    return { target: { x: 0, z: this.archetype.crowdCount > 50 ? 2.4 : 0.6 }, zoom: mode === "2d" ? 0.52 : 0.5 };
  }

  private selectInput(field: string, label: string, value: string, options: string[]): string {
    return `<label>${label}<select data-character-field="${field}">${options.map((option) => `<option value="${option}" ${option === value ? "selected" : ""}>${option}</option>`).join("")}</select></label>`;
  }

  private textInput(field: string, label: string, value: string): string {
    return `<label>${label}<input data-character-field="${field}" value="${value}" /></label>`;
  }

  private numberInput(field: string, label: string, value: number, min: number, max: number, step: number): string {
    return `<label>${label}<input type="number" min="${min}" max="${max}" step="${step}" data-character-field="${field}" value="${value}" /></label>`;
  }

  private catalogButton(kind: "attack" | "behavior", id: string, label: string, meta: string, active: boolean): string {
    return `<button data-${kind}="${id}" class="${active ? "active" : ""}"><strong>${label}</strong><span>${meta}</span></button>`;
  }

  private createdMobButtons(): string {
    const records = loadCreatedMobCache().records;
    if (records.length === 0) return `<div class="empty-state">Nenhum mob exportado do Forge ainda.</div>`;
    return records
      .map(
        (record) =>
          `<button data-created-mob="${record.id}" class="${record.archetype.id === this.archetype.id ? "active" : ""}">
            <strong>${record.label}</strong>
            <span>${record.dnaCode} | ${record.archetype.kind} | ${record.archetype.attackId}</span>
          </button>`
      )
      .join("");
  }

  private downloadPayload(payload: string, filename: string): void {
    const blob = new Blob([payload], { type: "application/vnd.rogue.mob+json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private attackShapeSvg(attack: AttackPattern, behavior: BehaviorPattern): string {
    const color = ACTOR_VISUAL_PROFILES[this.archetype.visual].accentColor.toString(16).padStart(6, "0");
    const shape =
      attack.geometry === "cone"
        ? `<path d="M90 92L32 34A82 82 0 0 1 148 34Z" fill="#${color}" opacity=".32" stroke="#${color}" />`
        : attack.geometry === "capsule"
          ? `<rect x="34" y="74" width="112" height="34" rx="17" fill="#${color}" opacity=".28" stroke="#${color}" />`
          : attack.geometry === "projectile"
            ? `<path d="M26 92h114" stroke="#${color}" stroke-width="8" stroke-linecap="round" /><path d="M140 92l-20-14v28z" fill="#${color}" />`
            : attack.geometry === "ring"
              ? `<circle cx="90" cy="92" r="56" fill="none" stroke="#${color}" stroke-width="16" opacity=".42" />`
              : `<circle cx="90" cy="92" r="42" fill="#${color}" opacity=".3" stroke="#${color}" />`;
    return `<svg viewBox="0 0 180 160" role="img" aria-label="${attack.label} ${behavior.label}">
      <ellipse cx="90" cy="118" rx="42" ry="12" fill="rgba(0,0,0,.28)" />
      ${shape}
      <circle cx="90" cy="92" r="14" fill="#${ACTOR_VISUAL_PROFILES[this.archetype.visual].primaryColor.toString(16).padStart(6, "0")}" />
    </svg>`;
  }

  private viewLabel(view: ViewMode): string {
    if (view === "2d") return "2D";
    if (view === "25d") return "2.5D";
    return "3D";
  }

  private cameraModeLabel(mode: CameraMode3D): string {
    if (mode === "first-person") return "FPS";
    if (mode === "tactical") return "Tatico";
    return "Inspect";
  }
}
