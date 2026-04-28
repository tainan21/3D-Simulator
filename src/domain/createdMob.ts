import type { Actor, ActorVisualVariant } from "./canonical";
import type { Vec2 } from "../kernel/vector";
import {
  actorFromCharacterArchetype,
  type AttackPatternId,
  type BehaviorPatternId,
  type CharacterArchetype
} from "./entityArchetype";
import { createDefaultForgeBuild, finalizeForgeBuild, type ForgeBuild, type ForgeClass, type ForgeSkillId } from "./characterForge";
import type { WorldState } from "../simulation/worldState";

export type CreatedMobPackageKind = "rogue-created-mob/v1";

export type CreatedMobPostgresRow = Readonly<{
  table: "created_mobs";
  id: string;
  dnaCode: string;
  label: string;
  archetypeId: string;
  version: number;
  updatedAt: string;
}>;

export type CreatedMobBlobObject = Readonly<{
  bucket: "rogue-created-mob-blobs";
  key: string;
  contentType: "application/vnd.rogue.mob+json";
  bytes: number;
  checksum: string;
}>;

export type CreatedMobPackage = Readonly<{
  kind: CreatedMobPackageKind;
  version: 1;
  exportedAt: string;
  source: "character-forge" | "character-studio" | "import";
  build: ForgeBuild;
  archetype: CharacterArchetype;
  postgres: CreatedMobPostgresRow;
  blob: CreatedMobBlobObject;
  runtime: Readonly<{
    spawnPolicy: "auto-runtime-library";
    maxAutoSpawn: number;
    compatibility: ForgeBuild["compatibility"];
    motionProfile: ForgeBuild["motionProfile"];
    behaviorTags: string[];
    animationTags: string[];
  }>;
}>;

export type CreatedMobRecord = Readonly<{
  id: string;
  dnaCode: string;
  label: string;
  build: ForgeBuild;
  archetype: CharacterArchetype;
  packageJson: string;
  postgres: CreatedMobPostgresRow;
  blob: CreatedMobBlobObject;
  cachedAt: number;
}>;

const ATTACK_BY_SKILL: Record<ForgeSkillId, AttackPatternId> = {
  "spin-blade": "melee",
  "pulse-shot": "projectile",
  "charge-dash": "dash",
  "summon-wall": "summon",
  "orbit-mines": "area",
  "beam-cannon": "projectile",
  "clone-split": "summon",
  "rage-mode": "area",
  "phase-step": "dash",
  "gravity-well": "cone"
};

const BEHAVIOR_BY_CLASS: Record<ForgeClass, BehaviorPatternId> = {
  tank: "defend-zone",
  agile: "chase-player",
  rogue: "kite",
  mage: "kite",
  summoner: "attack-base",
  engineer: "defend-zone",
  berserker: "swarm",
  boss: "boss-phase",
  support: "defend-zone",
  chaos: "attack-base"
};

export function forgeBuildToCharacterArchetype(build: ForgeBuild): CharacterArchetype {
  const isBoss = build.archetype === "boss" || build.rarity === "anomaly" || build.size === "titan";
  const kind = isBoss ? "boss" : build.size === "tiny" || build.size === "small" ? "dwarf" : "enemy";
  const radius = build.size === "titan" ? 1.15 : build.size === "large" ? 0.62 : build.size === "small" ? 0.24 : build.size === "tiny" ? 0.18 : 0.38;
  const height = build.size === "titan" ? 4.6 : build.size === "large" ? 2.65 : build.size === "small" ? 0.9 : build.size === "tiny" ? 0.55 : 1.7;
  const speed = 0.65 + build.stats.speed / 44 + build.motionProfile.speedBurst * 0.08;
  return {
    id: `mob-${build.dnaCode.toLowerCase()}`,
    label: build.name,
    kind,
    faction: "hostile",
    visual: visualForBuild(build),
    body: {
      radius,
      height,
      speed: Number(speed.toFixed(2)),
      hp: Math.max(1, Math.round(build.stats.hp / (isBoss ? 3 : 18)))
    },
    attackId: ATTACK_BY_SKILL[build.skills.primary] ?? "melee",
    behaviorId: BEHAVIOR_BY_CLASS[build.archetype] ?? "chase-player",
    crowdCount: isBoss ? 1 : build.archetype === "summoner" || build.archetype === "chaos" ? 18 : build.archetype === "tank" ? 6 : 10
  };
}

export function createCreatedMobPackage(buildInput: ForgeBuild, source: CreatedMobPackage["source"] = "character-forge"): CreatedMobPackage {
  const build = finalizeForgeBuild(buildInput);
  const archetype = forgeBuildToCharacterArchetype(build);
  const exportedAt = new Date().toISOString();
  const packageSeed = `${build.dnaCode}:${build.name}:${archetype.attackId}:${archetype.behaviorId}:${exportedAt}`;
  const checksum = checksumFor(packageSeed);
  const postgres: CreatedMobPostgresRow = {
    table: "created_mobs",
    id: archetype.id,
    dnaCode: build.dnaCode,
    label: build.name,
    archetypeId: archetype.id,
    version: 1,
    updatedAt: exportedAt
  };
  const blob: CreatedMobBlobObject = {
    bucket: "rogue-created-mob-blobs",
    key: `mobs/${build.dnaCode.toLowerCase()}.rogue-mob.json`,
    contentType: "application/vnd.rogue.mob+json",
    bytes: JSON.stringify({ build, archetype }).length,
    checksum
  };
  return {
    kind: "rogue-created-mob/v1",
    version: 1,
    exportedAt,
    source,
    build,
    archetype,
    postgres,
    blob,
    runtime: {
      spawnPolicy: "auto-runtime-library",
      maxAutoSpawn: Math.min(24, archetype.crowdCount),
      compatibility: build.compatibility,
      motionProfile: build.motionProfile,
      behaviorTags: build.behaviorTags,
      animationTags: build.animationTags
    }
  };
}

export function createCreatedMobPackageFromArchetype(archetype: CharacterArchetype, source: CreatedMobPackage["source"] = "character-studio"): CreatedMobPackage {
  const defaultBuild = createDefaultForgeBuild();
  const build = finalizeForgeBuild({
    ...defaultBuild,
    id: `forge-${archetype.id}`,
    name: archetype.label.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 18) || defaultBuild.name,
    archetype: classFromArchetype(archetype),
    size: archetype.kind === "boss" ? "titan" : archetype.kind === "dwarf" ? "small" : "medium",
    skills: { ...defaultBuild.skills, primary: skillFromAttack(archetype.attackId) },
    favorite: true
  });
  const generated = createCreatedMobPackage(build, source);
  const packageSeed = `${build.dnaCode}:${archetype.id}:${archetype.attackId}:${archetype.behaviorId}:${generated.exportedAt}`;
  const postgres: CreatedMobPostgresRow = {
    ...generated.postgres,
    id: archetype.id,
    archetypeId: archetype.id,
    label: archetype.label
  };
  const blob: CreatedMobBlobObject = {
    ...generated.blob,
    key: `mobs/${archetype.id}.rogue-mob.json`,
    checksum: checksumFor(packageSeed)
  };
  return {
    ...generated,
    source,
    archetype,
    postgres,
    blob
  };
}

export function createdMobRecordFromPackage(mobPackage: CreatedMobPackage, cachedAt = Date.now()): CreatedMobRecord {
  const packageJson = JSON.stringify(mobPackage, null, 2);
  return {
    id: mobPackage.archetype.id,
    dnaCode: mobPackage.build.dnaCode,
    label: mobPackage.build.name,
    build: mobPackage.build,
    archetype: mobPackage.archetype,
    packageJson,
    postgres: mobPackage.postgres,
    blob: { ...mobPackage.blob, bytes: packageJson.length },
    cachedAt
  };
}

export function parseCreatedMobPackage(raw: string): CreatedMobPackage {
  const parsed = JSON.parse(raw) as Partial<CreatedMobPackage> | Partial<ForgeBuild>;
  if ("kind" in parsed && parsed.kind === "rogue-created-mob/v1" && parsed.build) {
    return createCreatedMobPackage(finalizeForgeBuild(parsed.build), "import");
  }
  if ("species" in parsed && "archetype" in parsed && "skills" in parsed) {
    return createCreatedMobPackage(finalizeForgeBuild(parsed as ForgeBuild), "import");
  }
  throw new Error("Invalid created mob package.");
}

export function materializeCreatedMobs(world: WorldState, records: readonly CreatedMobRecord[], maxActors = 96): WorldState {
  const existingIds = new Set(world.actors.map((actor) => actor.id));
  const candidates = records.slice(0, 12);
  const actors: Actor[] = [];
  for (const record of candidates) {
    const count = Math.min(record.archetype.crowdCount, record.archetype.kind === "boss" ? 1 : 10);
    for (let index = 0; index < count && actors.length < maxActors; index += 1) {
      const id = `created-mob:${record.dnaCode}:${index + 1}`;
      if (existingIds.has(id)) continue;
      const actor = actorFromCharacterArchetype(record.archetype, id, index);
      actors.push({
        ...actor,
        position: createdMobPosition(world.baseCore.position, actors.length, candidates.length),
        properties: {
          ...actor.properties,
          tags: [
            ...actor.properties.tags,
            "created-mob",
            record.dnaCode,
            record.blob.key,
            ...record.build.behaviorTags,
            `motion:${record.build.motionProfile.primaryVerb}`,
            `dash:${record.build.motionProfile.dashDistance}m`,
            `cooldown:${record.build.motionProfile.dashCooldown}s`
          ]
        }
      });
    }
  }
  if (actors.length === 0) return world;
  return {
    ...world,
    actors: [...world.actors, ...actors]
  };
}

function createdMobPosition(base: Vec2, index: number, groups: number): Vec2 {
  const lane = index % Math.max(3, groups);
  const row = Math.floor(index / Math.max(3, groups));
  return {
    x: base.x - 5.8 + lane * 1.05,
    z: base.z - 5.8 - row * 0.82
  };
}

function visualForBuild(build: ForgeBuild): ActorVisualVariant {
  if (build.archetype === "boss" || build.size === "titan") return "brute";
  if (build.archetype === "rogue" || build.archetype === "agile") return "scout";
  if (build.archetype === "tank" || build.archetype === "support" || build.archetype === "engineer") return "warden";
  if (build.aura === "void" || build.aura === "shadow" || build.species === "unknown") return "specter";
  return "raider";
}

function classFromArchetype(archetype: CharacterArchetype): ForgeClass {
  if (archetype.kind === "boss" || archetype.behaviorId === "boss-phase") return "boss";
  if (archetype.attackId === "projectile" || archetype.behaviorId === "kite") return "mage";
  if (archetype.attackId === "dash" || archetype.behaviorId === "swarm") return "agile";
  if (archetype.attackId === "structure-breaker" || archetype.attackId === "gate-rusher") return "berserker";
  if (archetype.behaviorId === "defend-zone") return "tank";
  return "rogue";
}

function skillFromAttack(attack: AttackPatternId): ForgeSkillId {
  if (attack === "projectile") return "pulse-shot";
  if (attack === "dash" || attack === "gate-rusher") return "charge-dash";
  if (attack === "cone") return "gravity-well";
  if (attack === "area") return "orbit-mines";
  if (attack === "summon") return "summon-wall";
  if (attack === "structure-breaker") return "rage-mode";
  return "spin-blade";
}

function checksumFor(input: string): string {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) value = Math.imul(value ^ input.charCodeAt(index), 16777619);
  return `fnv1a-${(value >>> 0).toString(36)}`;
}
