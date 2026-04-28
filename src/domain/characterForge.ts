export type ForgeSpecies = "sphere" | "cube" | "triangle" | "hex" | "crystal" | "hybrid" | "unknown" | "corrupted" | "ancient" | "machine-born";
export type ForgeClass = "tank" | "agile" | "rogue" | "mage" | "summoner" | "engineer" | "berserker" | "boss" | "support" | "chaos";
export type ForgeTemperament = "hostile" | "calm" | "strategic" | "wild" | "curious" | "merciless" | "noble" | "broken";
export type ForgeHead = "round" | "angular" | "crown" | "split" | "horned" | "floating" | "masked" | "multi-core";
export type ForgeBody = "slim" | "armored" | "heavy" | "segmented" | "levitating" | "fractured" | "titan" | "fluid";
export type ForgeArms = "none" | "short" | "blades" | "cannons" | "tentacles" | "dual" | "orbitals";
export type ForgeLegs = "walker" | "hover" | "spikes" | "wheel" | "none" | "multi-leg" | "spider";
export type ForgeEyes = "mono eye" | "dual" | "multi eye" | "laser slit" | "no eyes" | "halo sensors";
export type ForgeAura = "fire" | "frost" | "toxic" | "electric" | "void" | "holy" | "shadow" | "plasma";
export type ForgeAccessory = "crown" | "antennas" | "chains" | "orbit rings" | "cape shards" | "shoulder cores" | "flags" | "relics";
export type ForgePersonality = "mystic" | "brutal" | "broken" | "elegant" | "playful" | "cold" | "royal" | "feral";
export type ForgeRarity = "standard" | "rare" | "epic" | "mythic" | "anomaly";
export type ForgeSize = "tiny" | "small" | "medium" | "large" | "titan";
export type ForgeSpeed = "steady" | "quick" | "phase" | "rush" | "glide";

export type ForgePaletteId = "inferno" | "neon-blue" | "toxic-lime" | "royal-gold" | "void-purple" | "blood-red" | "ice-white" | "matrix-green";
export type ForgeSkillSlot = "primary" | "secondary" | "dash" | "ultimate" | "passive";
export type ForgeSkillId = "spin-blade" | "pulse-shot" | "charge-dash" | "summon-wall" | "orbit-mines" | "beam-cannon" | "clone-split" | "rage-mode" | "phase-step" | "gravity-well";
export type ForgeAnimationId = "idle" | "walk" | "attack" | "dash" | "death" | "dance";
export type ForgeMotionVerb = "dash" | "blink" | "roll" | "speed";

export type ForgeMotionStep = Readonly<{
  t: number;
  x: number;
  z: number;
  phase: "start" | "windup" | "travel" | "impact" | "recover";
  verb: ForgeMotionVerb;
}>;

export type ForgeMotionProfile = Readonly<{
  primaryVerb: ForgeMotionVerb;
  dashDistance: number;
  dashCooldown: number;
  blinkRange: number;
  rollIFrames: number;
  speedBurst: number;
  trailSeconds: number;
  simulationSteps: readonly ForgeMotionStep[];
}>;

export type ForgePalette = Readonly<{
  id: ForgePaletteId;
  label: string;
  primary: string;
  secondary: string;
  glow: string;
  eye: string;
  fx: string;
}>;

export type ForgeStats = Readonly<{
  hp: number;
  speed: number;
  range: number;
  power: number;
  control: number;
  defense: number;
  chaos: number;
  difficulty: number;
}>;

export type ForgeCompatibility = Readonly<{
  twoD: number;
  twoFiveD: number;
  threeD: number;
}>;

export type ForgeBuild = Readonly<{
  id: string;
  name: string;
  dnaCode: string;
  species: ForgeSpecies;
  archetype: ForgeClass;
  temperament: ForgeTemperament;
  head: ForgeHead;
  body: ForgeBody;
  arms: ForgeArms;
  legs: ForgeLegs;
  eyes: ForgeEyes;
  aura: ForgeAura;
  accessory: ForgeAccessory;
  paletteId: ForgePaletteId;
  size: ForgeSize;
  speed: ForgeSpeed;
  rarity: ForgeRarity;
  personality: ForgePersonality;
  mutation: number;
  skills: Record<ForgeSkillSlot, ForgeSkillId>;
  stats: ForgeStats;
  compatibility: ForgeCompatibility;
  motionProfile: ForgeMotionProfile;
  behaviorTags: string[];
  animationTags: string[];
  lore: string;
  favorite: boolean;
}>;

export const FORGE_SPECIES: ForgeSpecies[] = ["sphere", "cube", "triangle", "hex", "crystal", "hybrid", "unknown", "corrupted", "ancient", "machine-born"];
export const FORGE_CLASSES: ForgeClass[] = ["tank", "agile", "rogue", "mage", "summoner", "engineer", "berserker", "boss", "support", "chaos"];
export const FORGE_TEMPERAMENTS: ForgeTemperament[] = ["hostile", "calm", "strategic", "wild", "curious", "merciless", "noble", "broken"];
export const FORGE_HEADS: ForgeHead[] = ["round", "angular", "crown", "split", "horned", "floating", "masked", "multi-core"];
export const FORGE_BODIES: ForgeBody[] = ["slim", "armored", "heavy", "segmented", "levitating", "fractured", "titan", "fluid"];
export const FORGE_ARMS: ForgeArms[] = ["none", "short", "blades", "cannons", "tentacles", "dual", "orbitals"];
export const FORGE_LEGS: ForgeLegs[] = ["walker", "hover", "spikes", "wheel", "none", "multi-leg", "spider"];
export const FORGE_EYES: ForgeEyes[] = ["mono eye", "dual", "multi eye", "laser slit", "no eyes", "halo sensors"];
export const FORGE_AURAS: ForgeAura[] = ["fire", "frost", "toxic", "electric", "void", "holy", "shadow", "plasma"];
export const FORGE_ACCESSORIES: ForgeAccessory[] = ["crown", "antennas", "chains", "orbit rings", "cape shards", "shoulder cores", "flags", "relics"];
export const FORGE_PERSONALITIES: ForgePersonality[] = ["mystic", "brutal", "broken", "elegant", "playful", "cold", "royal", "feral"];
export const FORGE_SIZES: ForgeSize[] = ["tiny", "small", "medium", "large", "titan"];
export const FORGE_SPEEDS: ForgeSpeed[] = ["steady", "quick", "phase", "rush", "glide"];
export const FORGE_RARITIES: ForgeRarity[] = ["standard", "rare", "epic", "mythic", "anomaly"];

export const FORGE_PALETTES: ForgePalette[] = [
  { id: "inferno", label: "Inferno", primary: "#ff643d", secondary: "#39130d", glow: "#ffb047", eye: "#fff1ba", fx: "#ff2f1f" },
  { id: "neon-blue", label: "Neon Blue", primary: "#59d7ff", secondary: "#0f2748", glow: "#77fff0", eye: "#e7fbff", fx: "#2b7cff" },
  { id: "toxic-lime", label: "Toxic Lime", primary: "#9aff4f", secondary: "#16351e", glow: "#d4ff67", eye: "#faffc5", fx: "#50ff92" },
  { id: "royal-gold", label: "Royal Gold", primary: "#f7c85a", secondary: "#2e1e0d", glow: "#ffe7a6", eye: "#fff8db", fx: "#ff9f1a" },
  { id: "void-purple", label: "Void Purple", primary: "#a77cff", secondary: "#21123d", glow: "#f0a6ff", eye: "#f7e8ff", fx: "#6d4dff" },
  { id: "blood-red", label: "Blood Red", primary: "#e84855", secondary: "#2b0c17", glow: "#ff8c9b", eye: "#ffd8df", fx: "#ff224d" },
  { id: "ice-white", label: "Ice White", primary: "#eaf8ff", secondary: "#24364c", glow: "#aef6ff", eye: "#ffffff", fx: "#62cfff" },
  { id: "matrix-green", label: "Matrix Green", primary: "#35f28a", secondary: "#09251a", glow: "#7cffb8", eye: "#d9ffe7", fx: "#0fff68" }
];

export const FORGE_SKILLS: Record<ForgeSkillId, string> = {
  "spin-blade": "Spin Blade",
  "pulse-shot": "Pulse Shot",
  "charge-dash": "Charge Dash",
  "summon-wall": "Summon Wall",
  "orbit-mines": "Orbit Mines",
  "beam-cannon": "Beam Cannon",
  "clone-split": "Clone Split",
  "rage-mode": "Rage Mode",
  "phase-step": "Phase Step",
  "gravity-well": "Gravity Well"
};

export const FORGE_ANIMATIONS: Record<ForgeAnimationId, string> = {
  idle: "Idle",
  walk: "Walk",
  attack: "Attack",
  dash: "Dash",
  death: "Death",
  dance: "Victory Dance"
};

export const FORGE_MOTION_VERBS: Record<ForgeMotionVerb, string> = {
  dash: "Dash",
  blink: "Blink",
  roll: "Roll",
  speed: "Speed"
};

const NAMES = ["KORVEX", "TRIAX", "NOVARA", "GLITCHON", "VELTRON", "AURIX", "HEXARA", "CYRION", "VANTA", "SOLKRA"];
const LORE_PLACES = ["Sector Nine", "Delta Pressure Ring", "the Glass Furnace", "the Silent Grid", "Crownless Orbit", "the Black Lattice"];

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hash(input: string): number {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) value = Math.imul(value ^ input.charCodeAt(index), 16777619);
  return value >>> 0;
}

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

function dnaCode(build: Omit<ForgeBuild, "dnaCode" | "stats" | "compatibility" | "motionProfile" | "behaviorTags" | "animationTags" | "lore" | "favorite">): string {
  const value = hash(`${build.name}:${build.species}:${build.archetype}:${build.head}:${build.body}:${build.aura}:${build.mutation}`);
  return `${build.species.slice(0, 2).toUpperCase()}${value.toString(36).slice(0, 2).toUpperCase()}-${build.archetype.slice(0, 3).toUpperCase()}-${(value % 97).toString().padStart(2, "0")}-${build.rarity.toUpperCase()}`;
}

export function computeForgeMotionProfile(
  stats: ForgeStats,
  build: Pick<ForgeBuild, "body" | "legs" | "speed" | "size" | "mutation" | "skills" | "archetype">
): ForgeMotionProfile {
  const primaryVerb: ForgeMotionVerb =
    build.skills.dash === "phase-step" || build.speed === "phase"
      ? "blink"
      : build.body === "fluid" || build.legs === "wheel" || build.size === "tiny" || build.size === "small"
        ? "roll"
        : build.skills.dash === "charge-dash" || build.speed === "rush" || build.archetype === "agile" || build.archetype === "rogue"
          ? "dash"
          : "speed";
  const mutationFactor = build.mutation / 100;
  const dashDistance = Number((1.7 + stats.speed / 46 + mutationFactor * 0.85 + (primaryVerb === "blink" ? 0.45 : 0)).toFixed(2));
  const dashCooldown = Number(Math.max(0.42, 1.82 - stats.speed / 120 - mutationFactor * 0.35).toFixed(2));
  const blinkRange = Number((dashDistance * (primaryVerb === "blink" ? 1.28 : 0.82)).toFixed(2));
  const rollIFrames = Number((0.12 + (primaryVerb === "roll" ? 0.2 : 0.08) + stats.control / 520).toFixed(2));
  const speedBurst = Number((1 + stats.speed / 86 + mutationFactor * 0.32).toFixed(2));
  const trailSeconds = Number((0.16 + mutationFactor * 0.24 + (primaryVerb === "blink" ? 0.22 : 0)).toFixed(2));
  const travelX = primaryVerb === "blink" ? blinkRange : dashDistance;
  const arcZ = primaryVerb === "roll" ? 0.32 : primaryVerb === "speed" ? -0.18 : 0;
  const phases: ForgeMotionStep["phase"][] = ["start", "windup", "travel", "impact", "recover"];
  return {
    primaryVerb,
    dashDistance,
    dashCooldown,
    blinkRange,
    rollIFrames,
    speedBurst,
    trailSeconds,
    simulationSteps: phases.map((phase, index) => ({
      t: Number((index / (phases.length - 1)).toFixed(2)),
      x: Number((travelX * (index / (phases.length - 1))).toFixed(2)),
      z: Number((Math.sin((index / (phases.length - 1)) * Math.PI) * arcZ).toFixed(2)),
      phase,
      verb: primaryVerb
    }))
  };
}

export function computeForgeStats(build: Pick<ForgeBuild, "species" | "archetype" | "body" | "arms" | "aura" | "size" | "speed" | "rarity" | "mutation">): ForgeStats {
  const heavy = build.archetype === "tank" || build.archetype === "boss" || build.body === "heavy" || build.body === "titan";
  const fast = build.archetype === "agile" || build.archetype === "rogue" || build.speed === "rush" || build.speed === "phase";
  const mystic = build.archetype === "mage" || build.archetype === "summoner" || build.aura === "void" || build.aura === "plasma";
  const mutation = build.mutation * 0.22;
  return {
    hp: clamp((heavy ? 82 : 52) + (build.size === "titan" ? 12 : 0) + mutation * 0.4),
    speed: clamp((fast ? 84 : 48) - (heavy ? 18 : 0) + mutation * 0.18),
    range: clamp((mystic ? 76 : 44) + (build.arms === "cannons" || build.arms === "orbitals" ? 18 : 0)),
    power: clamp((build.archetype === "berserker" || build.archetype === "boss" ? 82 : 56) + mutation * 0.25),
    control: clamp((build.archetype === "engineer" || build.archetype === "support" ? 78 : 44) + (mystic ? 12 : 0)),
    defense: clamp((heavy ? 86 : 46) + (build.body === "armored" ? 18 : 0)),
    chaos: clamp((build.archetype === "chaos" || build.species === "corrupted" ? 84 : 26) + mutation * 0.7),
    difficulty: clamp(34 + mutation * 0.45 + (build.rarity === "anomaly" ? 22 : 0))
  };
}

export function computeForgeCompatibility(stats: ForgeStats, build: Pick<ForgeBuild, "species" | "body" | "arms" | "accessory" | "mutation">): ForgeCompatibility {
  const complexity = (build.arms === "tentacles" ? 16 : 0) + (build.accessory === "orbit rings" ? 10 : 0) + (build.body === "fractured" ? 12 : 0) + build.mutation * 0.18;
  return {
    twoD: clamp(96 - complexity * 0.35 + stats.control * 0.08),
    twoFiveD: clamp(92 - complexity * 0.22 + stats.defense * 0.05),
    threeD: clamp(88 - complexity * 0.14 + stats.power * 0.08)
  };
}

export function finalizeForgeBuild(
  partial: Omit<ForgeBuild, "dnaCode" | "stats" | "compatibility" | "motionProfile" | "behaviorTags" | "animationTags" | "lore" | "favorite"> & Partial<Pick<ForgeBuild, "favorite">>
): ForgeBuild {
  const stats = computeForgeStats(partial);
  const compatibility = computeForgeCompatibility(stats, partial);
  const motionProfile = computeForgeMotionProfile(stats, partial);
  const code = dnaCode(partial);
  return {
    ...partial,
    dnaCode: code,
    stats,
    compatibility,
    motionProfile,
    behaviorTags: [partial.archetype, partial.temperament, partial.personality, partial.aura, partial.rarity],
    animationTags: [
      "idle-breathe",
      "walk-cycle",
      "attack-burst",
      "dash-smear",
      "death-collapse",
      "dance-loop",
      `${partial.speed}-motion`,
      `${partial.aura}-pulse`,
      `${partial.body}-silhouette`,
      `${motionProfile.primaryVerb}-verb`,
      `dash-${motionProfile.dashDistance}m`,
      `cooldown-${motionProfile.dashCooldown}s`
    ],
    lore: `Forged inside ${pick(LORE_PLACES, hash(code))}, ${partial.name} carries a ${partial.aura} core and moves with ${partial.temperament} intent.`,
    favorite: partial.favorite ?? false
  };
}

export function createDefaultForgeBuild(): ForgeBuild {
  return finalizeForgeBuild({
    id: "forge-default",
    name: "KORVEX",
    species: "crystal",
    archetype: "mage",
    temperament: "strategic",
    head: "crown",
    body: "segmented",
    arms: "orbitals",
    legs: "hover",
    eyes: "halo sensors",
    aura: "plasma",
    accessory: "orbit rings",
    paletteId: "neon-blue",
    size: "medium",
    speed: "phase",
    rarity: "epic",
    personality: "mystic",
    mutation: 34,
    skills: {
      primary: "pulse-shot",
      secondary: "orbit-mines",
      dash: "phase-step",
      ultimate: "gravity-well",
      passive: "clone-split"
    }
  });
}

export function randomForgeBuild(seed = Date.now(), mutation = 55): ForgeBuild {
  const chaos = Math.max(0, Math.min(100, mutation));
  const name = pick(NAMES, seed + 1);
  const skillIds = Object.keys(FORGE_SKILLS) as ForgeSkillId[];
  return finalizeForgeBuild({
    id: `forge-${seed.toString(36)}`,
    name,
    species: pick(FORGE_SPECIES, seed + Math.round(chaos)),
    archetype: pick(FORGE_CLASSES, seed * 3 + 7),
    temperament: pick(FORGE_TEMPERAMENTS, seed * 5 + 11),
    head: pick(FORGE_HEADS, seed * 7 + Math.round(chaos * 1.3)),
    body: pick(FORGE_BODIES, seed * 11 + Math.round(chaos * 1.7)),
    arms: pick(FORGE_ARMS, seed * 13 + Math.round(chaos * 1.9)),
    legs: pick(FORGE_LEGS, seed * 17 + Math.round(chaos * 2.1)),
    eyes: pick(FORGE_EYES, seed * 19 + Math.round(chaos * 2.3)),
    aura: pick(FORGE_AURAS, seed * 23 + Math.round(chaos * 2.9)),
    accessory: pick(FORGE_ACCESSORIES, seed * 29 + Math.round(chaos * 3.1)),
    paletteId: pick(FORGE_PALETTES, seed * 31 + Math.round(chaos)).id,
    size: pick(FORGE_SIZES, seed * 37 + Math.round(chaos * 0.4)),
    speed: pick(FORGE_SPEEDS, seed * 41 + Math.round(chaos * 0.8)),
    rarity: chaos > 88 ? "anomaly" : chaos > 72 ? "mythic" : chaos > 48 ? "epic" : chaos > 24 ? "rare" : "standard",
    personality: pick(FORGE_PERSONALITIES, seed * 43 + Math.round(chaos)),
    mutation: chaos,
    skills: {
      primary: pick(skillIds, seed + 1),
      secondary: pick(skillIds, seed + 2),
      dash: pick(skillIds, seed + 3),
      ultimate: pick(skillIds, seed + 4),
      passive: pick(skillIds, seed + 5)
    }
  });
}
