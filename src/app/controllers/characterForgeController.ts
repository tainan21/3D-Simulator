import type { AppRoute, AppSurfaceContext, SurfaceHandle } from "../contracts";
import { createCleanupBag } from "./common";
import {
  FORGE_ACCESSORIES,
  FORGE_ANIMATIONS,
  FORGE_ARMS,
  FORGE_AURAS,
  FORGE_BODIES,
  FORGE_CLASSES,
  FORGE_EYES,
  FORGE_HEADS,
  FORGE_LEGS,
  FORGE_MOTION_VERBS,
  FORGE_PALETTES,
  FORGE_PERSONALITIES,
  FORGE_RARITIES,
  FORGE_SIZES,
  FORGE_SKILLS,
  FORGE_SPEEDS,
  FORGE_SPECIES,
  FORGE_TEMPERAMENTS,
  createDefaultForgeBuild,
  finalizeForgeBuild,
  randomForgeBuild,
  type ForgeAnimationId,
  type ForgeAccessory,
  type ForgeArms,
  type ForgeAura,
  type ForgeBody,
  type ForgeBuild,
  type ForgeClass,
  type ForgeEyes,
  type ForgeHead,
  type ForgeLegs,
  type ForgeMotionVerb,
  type ForgePaletteId,
  type ForgePersonality,
  type ForgeRarity,
  type ForgeSize,
  type ForgeSkillId,
  type ForgeSkillSlot,
  type ForgeSpecies,
  type ForgeSpeed,
  type ForgeTemperament
} from "../../domain/characterForge";
import { forgeBuildToCharacterArchetype } from "../../domain/createdMob";
import { createdMobSyncStatus, exportCreatedMobPayload, importCreatedMobPayload, loadCreatedMobCache, upsertForgeBuildIntoMobCache } from "../../infrastructure/createdMobCache";

type ForgeField =
  | "species"
  | "archetype"
  | "temperament"
  | "head"
  | "body"
  | "arms"
  | "legs"
  | "eyes"
  | "aura"
  | "accessory"
  | "paletteId"
  | "size"
  | "speed"
  | "rarity"
  | "personality";

type ForgeState = {
  current: ForgeBuild;
  previous?: ForgeBuild;
  favorites: ForgeBuild[];
  compare: boolean;
  animation: ForgeAnimationId;
  simulationVerb: ForgeMotionVerb;
  copiedCode?: string;
};

const STORAGE_KEY = "rogue-character-forge";
const SKILL_SLOTS: ForgeSkillSlot[] = ["primary", "secondary", "dash", "ultimate", "passive"];
const PRESET_SEEDS: Record<string, Partial<ForgeBuild>> = {
  Titan: { species: "cube", archetype: "tank", body: "titan", arms: "cannons", legs: "walker", aura: "holy", rarity: "mythic", personality: "royal", size: "titan" },
  Wraith: { species: "unknown", archetype: "rogue", body: "levitating", arms: "blades", legs: "hover", aura: "shadow", rarity: "epic", personality: "cold", speed: "phase" },
  Mystic: { species: "crystal", archetype: "mage", head: "crown", body: "segmented", arms: "orbitals", eyes: "halo sensors", aura: "plasma", personality: "mystic" },
  Broken: { species: "corrupted", archetype: "chaos", head: "split", body: "fractured", arms: "tentacles", aura: "void", rarity: "anomaly", personality: "broken" },
  Elegant: { species: "sphere", archetype: "support", body: "fluid", arms: "dual", legs: "hover", aura: "frost", personality: "elegant", paletteId: "ice-white", speed: "glide" }
};

export class CharacterForgeController {
  private readonly cleanups = createCleanupBag();
  private state: ForgeState = this.loadState();
  private pointer = { x: 0, y: 0 };

  constructor(
    private readonly host: HTMLElement,
    private readonly context: AppSurfaceContext
  ) {}

  mount(): SurfaceHandle {
    this.context.shell.status.textContent = "Character Forge: DNA visual, stats e compatibilidade futura.";
    this.renderFrame();
    this.host.addEventListener("click", this.onClick);
    this.host.addEventListener("input", this.onInput);
    this.host.addEventListener("pointermove", this.onPointerMove);
    this.cleanups.add(() => this.host.removeEventListener("click", this.onClick));
    this.cleanups.add(() => this.host.removeEventListener("input", this.onInput));
    this.cleanups.add(() => this.host.removeEventListener("pointermove", this.onPointerMove));
    return { dispose: () => this.cleanups.dispose() };
  }

  private loadState(): ForgeState {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const current = createDefaultForgeBuild();
        return { current, favorites: [], compare: false, animation: "idle", simulationVerb: current.motionProfile.primaryVerb };
      }
      const parsed = JSON.parse(raw) as Partial<ForgeState>;
      const current = parsed.current ? finalizeForgeBuild(parsed.current) : createDefaultForgeBuild();
      return {
        current,
        previous: parsed.previous ? finalizeForgeBuild(parsed.previous) : undefined,
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites.slice(0, 8).map((build) => finalizeForgeBuild(build)) : [],
        compare: Boolean(parsed.compare),
        animation: (parsed.animation as ForgeAnimationId | undefined) ?? "idle",
        simulationVerb: (parsed.simulationVerb as ForgeMotionVerb | undefined) ?? current.motionProfile.primaryVerb,
        copiedCode: parsed.copiedCode
      };
    } catch {
      const current = createDefaultForgeBuild();
      return { current, favorites: [], compare: false, animation: "idle", simulationVerb: current.motionProfile.primaryVerb };
    }
  }

  private persist(): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private updateCurrent(patch: Partial<ForgeBuild>, keepPrevious = true): void {
    this.state = {
      ...this.state,
      previous: keepPrevious ? this.state.current : this.state.previous,
      current: finalizeForgeBuild({ ...this.state.current, ...patch })
    };
    this.persist();
    this.renderFrame();
  }

  private renderFrame(): void {
    const build = this.state.current;
    const palette = FORGE_PALETTES.find((entry) => entry.id === build.paletteId) ?? FORGE_PALETTES[0];
    const mobCache = loadCreatedMobCache();
    const sync = createdMobSyncStatus(mobCache);
    const archetype = forgeBuildToCharacterArchetype(build);
    const activeMotion = this.state.simulationVerb ?? build.motionProfile.primaryVerb;
    this.host.innerHTML = `
      <section class="forge-shell" data-testid="character-forge-shell" style="--forge-primary:${palette.primary};--forge-secondary:${palette.secondary};--forge-glow:${palette.glow};--forge-eye:${palette.eye};--forge-fx:${palette.fx};--forge-tilt-x:${this.pointer.y};--forge-tilt-y:${this.pointer.x};--forge-dash-distance:${build.motionProfile.dashDistance};--forge-speed-burst:${build.motionProfile.speedBurst};">
        <header class="forge-header">
          <button class="forge-back" data-route="/studio">Back Studio</button>
          <div class="forge-brand">
            <span class="forge-brand-mark">CF</span>
            <div>
              <div class="forge-kicker">Geometric soul authoring</div>
              <h1>Character Forge</h1>
            </div>
          </div>
          <div class="forge-actions">
            <button data-forge-action="save">Save Build</button>
            <button data-forge-action="duplicate">Duplicate</button>
            <button class="forge-god-button" data-forge-action="surprise">Surprise Me</button>
            <button data-forge-action="compare">${this.state.compare ? "Hide Compare" : "Compare"}</button>
            <button data-forge-action="send-mob">Send Mob</button>
            <button data-forge-action="export-dna">Export DNA</button>
            <button data-forge-action="import-dna">Import DNA</button>
          </div>
        </header>
        <main class="forge-stage">
          <aside class="forge-panel forge-origin">
            <div class="forge-panel-title">
              <span>01</span>
              <strong>DNA Base</strong>
            </div>
            ${this.renderOptionGroup("Species", "species", FORGE_SPECIES)}
            ${this.renderOptionGroup("Class", "archetype", FORGE_CLASSES)}
            ${this.renderOptionGroup("Temperament", "temperament", FORGE_TEMPERAMENTS)}
            <div class="forge-presets">
              <span>Smart presets</span>
              <div class="forge-chip-grid">
                ${Object.keys(PRESET_SEEDS).map((label) => `<button data-forge-preset="${label}">${label}</button>`).join("")}
              </div>
            </div>
            <label class="forge-mutation">
              <span>Mutation</span>
              <input type="range" min="0" max="100" value="${build.mutation}" data-forge-mutation>
              <b>${build.mutation}%</b>
            </label>
          </aside>
          <section class="forge-preview-panel">
            <div class="forge-preview-top">
              <div>
                <span class="forge-rarity">${label(build.rarity)}</span>
                <h2>${build.name}</h2>
              </div>
              <div class="forge-dna-code" data-testid="forge-dna-code">${build.dnaCode}</div>
            </div>
            <div class="forge-animation-dock" data-testid="forge-animation-dock">
              ${Object.entries(FORGE_ANIMATIONS).map(([id, name]) => `<button class="${this.state.animation === id ? "active" : ""}" data-forge-animation="${id}">${name}</button>`).join("")}
            </div>
            <div class="forge-hero" data-species="${build.species}" data-body="${build.body}" data-head="${build.head}" data-aura="${build.aura}" data-animation="${this.state.animation}" data-motion="${activeMotion}">
              <div class="forge-orbit forge-orbit-a"></div>
              <div class="forge-orbit forge-orbit-b"></div>
              <div class="forge-action-arc"></div>
              <div class="forge-particle-field">${Array.from({ length: 22 }, (_, index) => `<i style="--i:${index};--x:${(index * 37) % 100}%;--y:${(index * 29) % 100}%"></i>`).join("")}</div>
              ${this.renderAvatar(build)}
              <div class="forge-shadow"></div>
            </div>
            ${this.renderMotionLab(build, activeMotion)}
            <div class="forge-lore">
              <span>Auto lore</span>
              <p>${build.lore}</p>
            </div>
            <div class="forge-intel">
              <div class="forge-stats">
                ${Object.entries(build.stats)
                  .map(([name, value]) => `<div class="forge-stat"><span>${label(name)}</span><b>${value}</b><em style="width:${value}%"></em></div>`)
                  .join("")}
              </div>
              <div class="forge-compat">
                ${this.renderCompatibility("2D", build.compatibility.twoD)}
                ${this.renderCompatibility("2.5D", build.compatibility.twoFiveD)}
                ${this.renderCompatibility("3D", build.compatibility.threeD)}
              </div>
            </div>
            <div class="forge-tags">${[...build.behaviorTags, ...build.animationTags].slice(0, 9).map((tag) => `<span>${tag}</span>`).join("")}</div>
            <div class="forge-pipeline">
              <div><span>Mob output</span><strong>${archetype.kind} / ${archetype.attackId}</strong><em>${archetype.behaviorId} | crowd ${archetype.crowdCount}</em></div>
              <div><span>Postgres mock</span><strong>${sync.cachedRows} rows</strong><em>${sync.lastSyncLabel}</em></div>
              <div><span>Blob mock</span><strong>${sync.cachedBlobs} objects</strong><em>application/vnd.rogue.mob+json</em></div>
            </div>
            ${this.state.compare && this.state.previous ? this.renderCompare() : ""}
          </section>
          <aside class="forge-panel forge-traits">
            <div class="forge-panel-title">
              <span>02</span>
              <strong>Traits</strong>
            </div>
            ${this.renderOptionGroup("Head", "head", FORGE_HEADS)}
            ${this.renderOptionGroup("Body", "body", FORGE_BODIES)}
            ${this.renderOptionGroup("Arms", "arms", FORGE_ARMS)}
            ${this.renderOptionGroup("Legs", "legs", FORGE_LEGS)}
            ${this.renderOptionGroup("Eyes", "eyes", FORGE_EYES)}
            ${this.renderOptionGroup("Aura", "aura", FORGE_AURAS)}
            ${this.renderOptionGroup("Accessory", "accessory", FORGE_ACCESSORIES)}
            ${this.renderPaletteGroup()}
            ${this.renderOptionGroup("Size", "size", FORGE_SIZES)}
            ${this.renderOptionGroup("Speed", "speed", FORGE_SPEEDS)}
            ${this.renderOptionGroup("Rarity", "rarity", FORGE_RARITIES)}
            ${this.renderOptionGroup("Personality", "personality", FORGE_PERSONALITIES)}
          </aside>
        </main>
        <footer class="forge-footer">
          <div class="forge-footer-head">
            <strong>Gameplay DNA</strong>
            <button data-forge-action="name">Name Generator</button>
            <button data-forge-action="favorite">Favorite</button>
            <span>${this.state.copiedCode ? `Exported ${this.state.copiedCode}` : "Mock sound: forge hum ready"}</span>
          </div>
          <div class="forge-skill-row">
            ${SKILL_SLOTS.map((slot) => this.renderSkillSlot(slot)).join("")}
          </div>
          ${this.renderFavorites()}
        </footer>
      </section>
    `;
  }

  private renderOptionGroup<T extends string>(title: string, field: ForgeField, options: readonly T[]): string {
    const current = String(this.state.current[field]);
    return `
      <div class="forge-option-group">
        <span>${title}</span>
        <div class="forge-chip-grid">
          ${options.map((option) => `<button class="${current === option ? "active" : ""}" data-forge-field="${field}" data-forge-value="${option}">${label(option)}</button>`).join("")}
        </div>
      </div>
    `;
  }

  private renderPaletteGroup(): string {
    return `
      <div class="forge-option-group">
        <span>Palette</span>
        <div class="forge-palette-grid">
          ${FORGE_PALETTES.map(
            (palette) => `
              <button class="${this.state.current.paletteId === palette.id ? "active" : ""}" data-forge-field="paletteId" data-forge-value="${palette.id}">
                <i style="--a:${palette.primary};--b:${palette.secondary};--c:${palette.glow}"></i>
                <span>${palette.label}</span>
              </button>
            `
          ).join("")}
        </div>
      </div>
    `;
  }

  private renderSkillSlot(slot: ForgeSkillSlot): string {
    const current = this.state.current.skills[slot];
    const skillIds = Object.keys(FORGE_SKILLS) as ForgeSkillId[];
    return `
      <div class="forge-skill-slot">
        <span>${label(slot)}</span>
        <strong>${FORGE_SKILLS[current]}</strong>
        <div>
          ${skillIds.map((skill) => `<button class="${skill === current ? "active" : ""}" data-forge-skill-slot="${slot}" data-forge-skill="${skill}">${FORGE_SKILLS[skill]}</button>`).join("")}
        </div>
      </div>
    `;
  }

  private renderMotionLab(build: ForgeBuild, activeMotion: ForgeMotionVerb): string {
    const motion = build.motionProfile;
    const stepNodes = motion.simulationSteps
      .map((step) => `<i class="forge-sim-node" style="--step-x:${step.t * 100}%;--step-y:${50 + step.z * 38}%" title="${label(step.phase)}">${label(step.phase)}</i>`)
      .join("");
    return `
      <div class="forge-sim-panel" data-testid="forge-sim-panel">
        <div class="forge-sim-head">
          <span>Simulation Lab</span>
          <strong>${FORGE_MOTION_VERBS[activeMotion]}</strong>
          <em>${motion.dashDistance}m dash | ${motion.dashCooldown}s cd | ${motion.speedBurst}x burst</em>
        </div>
        <div class="forge-motion-buttons">
          ${(Object.keys(FORGE_MOTION_VERBS) as ForgeMotionVerb[])
            .map((verb) => `<button class="${activeMotion === verb ? "active" : ""}" data-forge-motion="${verb}">${FORGE_MOTION_VERBS[verb]}</button>`)
            .join("")}
        </div>
        <div class="forge-sim-track" data-motion="${activeMotion}">
          <span class="forge-sim-start">0m</span>
          <span class="forge-sim-end">${activeMotion === "blink" ? motion.blinkRange : motion.dashDistance}m</span>
          ${stepNodes}
          <b class="forge-sim-runner"></b>
        </div>
      </div>
    `;
  }

  private renderCompatibility(name: string, value: number): string {
    return `<div class="forge-compat-pill" style="--value:${value}"><span>${name}</span><b>${value}%</b></div>`;
  }

  private renderCompare(): string {
    const previous = this.state.previous;
    if (!previous) return "";
    return `
      <div class="forge-compare" data-testid="forge-compare">
        <div><span>Previous</span><strong>${previous.name}</strong><em>${previous.dnaCode}</em></div>
        <div><span>Current</span><strong>${this.state.current.name}</strong><em>${this.state.current.dnaCode}</em></div>
      </div>
    `;
  }

  private renderFavorites(): string {
    if (this.state.favorites.length === 0) return "";
    return `
      <div class="forge-favorites">
        <span>Favorites</span>
        ${this.state.favorites
          .map((build) => `<button data-forge-favorite="${build.dnaCode}"><strong>${build.name}</strong><em>${build.dnaCode}</em></button>`)
          .join("")}
      </div>
    `;
  }

  private renderAvatar(build: ForgeBuild): string {
    const scale = build.size === "titan" ? 1.14 : build.size === "large" ? 1.06 : build.size === "small" ? 0.92 : build.size === "tiny" ? 0.82 : 1;
    return `
      <svg class="forge-avatar" viewBox="0 0 360 420" role="img" aria-label="${build.name} preview" style="--forge-scale:${scale}">
        <defs>
          <filter id="forgeGlow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="forgeBody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="var(--forge-primary)"/><stop offset="1" stop-color="var(--forge-secondary)"/></linearGradient>
        </defs>
        <g class="forge-avatar-core ${token(build.body)} ${token(build.species)}" filter="url(#forgeGlow)">
          ${this.renderLegs(build)}
          ${this.renderArms(build)}
          ${this.renderBody(build)}
          ${this.renderHead(build)}
          ${this.renderEyes(build)}
          ${this.renderAccessory(build)}
        </g>
      </svg>
    `;
  }

  private renderBody(build: ForgeBuild): string {
    if (build.species === "triangle") return `<polygon class="forge-body-shape" points="180,120 270,300 90,300"/>`;
    if (build.species === "cube") return `<rect class="forge-body-shape" x="98" y="142" width="164" height="164" rx="${build.body === "fluid" ? 48 : 16}"/>`;
    if (build.species === "hex") return `<polygon class="forge-body-shape" points="180,120 258,166 258,258 180,306 102,258 102,166"/>`;
    if (build.species === "crystal") return `<polygon class="forge-body-shape" points="180,112 252,190 226,304 180,342 134,304 108,190"/>`;
    return `<ellipse class="forge-body-shape" cx="180" cy="226" rx="${build.body === "heavy" || build.body === "titan" ? 92 : 72}" ry="${build.body === "slim" ? 116 : 94}"/>`;
  }

  private renderHead(build: ForgeBuild): string {
    const floating = build.head === "floating" ? -18 : 0;
    if (build.head === "crown") return `<polygon class="forge-head-shape" points="124,95 148,42 180,86 214,42 238,95 222,136 138,136" transform="translate(0 ${floating})"/>`;
    if (build.head === "angular" || build.head === "masked") return `<polygon class="forge-head-shape" points="180,48 236,86 218,146 142,146 124,86" transform="translate(0 ${floating})"/>`;
    if (build.head === "split") return `<path class="forge-head-shape" d="M132 80 L174 48 L168 146 L128 132 Z M186 48 L230 80 L232 132 L192 146 Z" transform="translate(0 ${floating})"/>`;
    return `<circle class="forge-head-shape" cx="180" cy="98" r="${build.head === "multi-core" ? 58 : 50}" transform="translate(0 ${floating})"/>`;
  }

  private renderArms(build: ForgeBuild): string {
    if (build.arms === "none") return "";
    if (build.arms === "orbitals") return `<circle class="forge-orbital" cx="74" cy="196" r="18"/><circle class="forge-orbital" cx="286" cy="196" r="18"/>`;
    if (build.arms === "cannons") return `<rect class="forge-limb" x="42" y="190" width="74" height="24" rx="8"/><rect class="forge-limb" x="244" y="190" width="74" height="24" rx="8"/>`;
    if (build.arms === "blades") return `<polygon class="forge-limb" points="102,170 46,250 118,224"/><polygon class="forge-limb" points="258,170 314,250 242,224"/>`;
    return `<path class="forge-limb" d="M112 178 C70 202 70 260 104 286 M248 178 C290 202 290 260 256 286"/>`;
  }

  private renderLegs(build: ForgeBuild): string {
    if (build.legs === "none" || build.legs === "hover") return `<ellipse class="forge-hover-base" cx="180" cy="348" rx="78" ry="16"/>`;
    if (build.legs === "spikes") return `<polygon class="forge-limb" points="136,294 112,370 154,326"/><polygon class="forge-limb" points="224,294 248,370 206,326"/>`;
    if (build.legs === "wheel") return `<circle class="forge-limb" cx="180" cy="340" r="38"/>`;
    return `<path class="forge-limb" d="M148 290 L126 360 M212 290 L234 360 M172 300 L162 370 M188 300 L198 370"/>`;
  }

  private renderEyes(build: ForgeBuild): string {
    if (build.eyes === "no eyes") return "";
    if (build.eyes === "mono eye" || build.eyes === "laser slit") return `<rect class="forge-eye" x="148" y="92" width="64" height="${build.eyes === "laser slit" ? 8 : 20}" rx="8"/>`;
    if (build.eyes === "multi eye") return `<circle class="forge-eye" cx="152" cy="94" r="8"/><circle class="forge-eye" cx="180" cy="88" r="8"/><circle class="forge-eye" cx="208" cy="94" r="8"/>`;
    if (build.eyes === "halo sensors") return `<circle class="forge-eye-ring" cx="180" cy="96" r="34"/><circle class="forge-eye" cx="180" cy="96" r="9"/>`;
    return `<circle class="forge-eye" cx="158" cy="96" r="10"/><circle class="forge-eye" cx="202" cy="96" r="10"/>`;
  }

  private renderAccessory(build: ForgeBuild): string {
    if (build.accessory === "orbit rings") return `<ellipse class="forge-accessory" cx="180" cy="224" rx="122" ry="34"/>`;
    if (build.accessory === "crown") return `<path class="forge-accessory" d="M136 50 L154 18 L180 48 L208 18 L226 50"/>`;
    if (build.accessory === "cape shards") return `<polygon class="forge-accessory-fill" points="118,230 74,352 150,318"/><polygon class="forge-accessory-fill" points="242,230 286,352 210,318"/>`;
    if (build.accessory === "shoulder cores") return `<circle class="forge-accessory-fill" cx="102" cy="160" r="18"/><circle class="forge-accessory-fill" cx="258" cy="160" r="18"/>`;
    return `<path class="forge-accessory" d="M116 120 C82 96 78 72 94 54 M244 120 C278 96 282 72 266 54"/>`;
  }

  private onClick = (event: MouseEvent): void => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button");
    if (!button) return;
    if (button.dataset.route) {
      this.context.navigate(button.dataset.route as AppRoute);
      return;
    }
    const field = button.dataset.forgeField as ForgeField | undefined;
    const value = button.dataset.forgeValue;
    if (field && value) {
      this.updateCurrent({ [field]: value } as Partial<ForgeBuild>);
      return;
    }
    const skillSlot = button.dataset.forgeSkillSlot as ForgeSkillSlot | undefined;
    const skill = button.dataset.forgeSkill as ForgeSkillId | undefined;
    if (skillSlot && skill) {
      this.updateCurrent({ skills: { ...this.state.current.skills, [skillSlot]: skill } });
      return;
    }
    const preset = button.dataset.forgePreset;
    if (preset) {
      this.updateCurrent(PRESET_SEEDS[preset] ?? {});
      return;
    }
    const favoriteCode = button.dataset.forgeFavorite;
    if (favoriteCode) {
      const favorite = this.state.favorites.find((build) => build.dnaCode === favoriteCode);
      if (favorite) this.updateCurrent(favorite);
      return;
    }
    const animation = button.dataset.forgeAnimation as ForgeAnimationId | undefined;
    if (animation) {
      this.state = { ...this.state, animation };
      this.persist();
      this.renderFrame();
      return;
    }
    const motion = button.dataset.forgeMotion as ForgeMotionVerb | undefined;
    if (motion) {
      const animation: ForgeAnimationId = motion === "dash" || motion === "blink" ? "dash" : motion === "roll" || motion === "speed" ? "walk" : this.state.animation;
      this.state = { ...this.state, simulationVerb: motion, animation };
      this.persist();
      this.renderFrame();
      return;
    }
    this.handleAction(button.dataset.forgeAction);
  };

  private onInput = (event: Event): void => {
    const input = (event.target as HTMLElement).closest<HTMLInputElement>("[data-forge-mutation]");
    if (!input) return;
    this.updateCurrent({ mutation: Number(input.value) });
  };

  private onPointerMove = (event: PointerEvent): void => {
    const hero = (event.target as HTMLElement).closest<HTMLElement>(".forge-preview-panel");
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    this.pointer = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 10,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * -8
    };
    const shell = this.host.querySelector<HTMLElement>(".forge-shell");
    if (shell) {
      shell.style.setProperty("--forge-tilt-x", this.pointer.y.toFixed(2));
      shell.style.setProperty("--forge-tilt-y", this.pointer.x.toFixed(2));
    }
  };

  private handleAction(action?: string): void {
    if (!action) return;
    if (action === "surprise") {
      this.state = { ...this.state, previous: this.state.current, current: randomForgeBuild(Date.now(), Math.max(64, this.state.current.mutation)) };
    } else if (action === "save" || action === "favorite") {
      const favorite = finalizeForgeBuild({ ...this.state.current, favorite: true });
      const record = upsertForgeBuildIntoMobCache(favorite);
      this.syncCharacterStore(record.archetype);
      this.state = { ...this.state, favorites: [favorite, ...this.state.favorites.filter((build) => build.dnaCode !== favorite.dnaCode)].slice(0, 8), current: favorite };
    } else if (action === "duplicate") {
      this.state = { ...this.state, previous: this.state.current, current: finalizeForgeBuild({ ...this.state.current, id: `forge-copy-${Date.now().toString(36)}`, name: `${this.state.current.name} COPY` }) };
    } else if (action === "compare") {
      this.state = { ...this.state, compare: !this.state.compare };
    } else if (action === "name") {
      this.updateCurrent({ name: randomForgeBuild(Date.now(), this.state.current.mutation).name });
      return;
    } else if (action === "export-dna") {
      const payload = exportCreatedMobPayload(this.state.current);
      const record = upsertForgeBuildIntoMobCache(this.state.current);
      this.syncCharacterStore(record.archetype);
      this.downloadPayload(payload, `${this.state.current.dnaCode.toLowerCase()}.rogue-mob.json`);
      this.state = { ...this.state, copiedCode: this.state.current.dnaCode };
      void navigator.clipboard?.writeText(payload);
    } else if (action === "import-dna") {
      const raw = window.prompt("Paste .rogue-mob JSON or DNA Code", this.state.current.dnaCode);
      if (raw?.trim().startsWith("{")) {
        const record = importCreatedMobPayload(raw);
        this.syncCharacterStore(record.archetype);
        this.state = { ...this.state, previous: this.state.current, current: record.build, copiedCode: record.dnaCode };
      } else if (raw) {
        this.state = { ...this.state, previous: this.state.current, current: randomForgeBuild(hash(raw), this.state.current.mutation), copiedCode: raw.toUpperCase() };
      }
    } else if (action === "send-mob") {
      const record = upsertForgeBuildIntoMobCache(this.state.current);
      this.syncCharacterStore(record.archetype);
      this.state = { ...this.state, copiedCode: `Mob ${record.dnaCode} cached` };
    }
    this.persist();
    this.renderFrame();
  }

  private syncCharacterStore(archetype: ReturnType<typeof forgeBuildToCharacterArchetype>): void {
    this.context.stores.characterStudioStore.setState((current) => ({
      ...current,
      archetype,
      selectedId: archetype.id,
      library: [archetype, ...current.library.filter((entry) => entry.id !== archetype.id)]
    }));
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
}

function label(value: string): string {
  return value
    .split(/[-\s]/)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function token(value: string): string {
  return value.replace(/[^a-z0-9]+/g, "-");
}

function hash(input: string): number {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) value = Math.imul(value ^ input.charCodeAt(index), 16777619);
  return value >>> 0;
}
