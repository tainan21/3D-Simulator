import {
  ACTOR_VISUAL_PROFILES,
  createActor,
  createBaseCore,
  type Actor,
  type ActorCombatProfile,
  type ActorKind,
  type ActorVisualVariant
} from "./canonical";
import { createRogueRun } from "../simulation/roguelite";
import { createStructureMap } from "../simulation/structures";
import type { WorldState } from "../simulation/worldState";

export type AttackPatternId = "melee" | "dash" | "projectile" | "cone" | "area" | "summon" | "structure-breaker" | "gate-rusher";
export type BehaviorPatternId = "chase-player" | "defend-zone" | "attack-base" | "patrol-route" | "kite" | "swarm" | "boss-phase";
export type EntityFaction = "player" | "hostile" | "neutral";

export type AttackPattern = Readonly<{
  id: AttackPatternId;
  label: string;
  geometry: "circle" | "capsule" | "cone" | "projectile" | "ring";
  range: number;
  cooldown: number;
  damage: number;
  tags: readonly string[];
}>;

export type BehaviorPattern = Readonly<{
  id: BehaviorPatternId;
  label: string;
  objective: "player" | "base-core" | "zone" | "route" | "structure";
  aggression: number;
  cohesion: number;
  tags: readonly string[];
}>;

export type CharacterBodyProfile = Readonly<{
  radius: number;
  height: number;
  speed: number;
  hp: number;
}>;

export type CharacterArchetype = Readonly<{
  id: string;
  label: string;
  kind: ActorKind;
  faction: EntityFaction;
  visual: ActorVisualVariant;
  body: CharacterBodyProfile;
  attackId: AttackPatternId;
  behaviorId: BehaviorPatternId;
  crowdCount: number;
}>;

export const ATTACK_PATTERNS: AttackPattern[] = [
  { id: "melee", label: "Melee", geometry: "circle", range: 0.72, cooldown: 0.48, damage: 1, tags: ["close", "simple"] },
  { id: "dash", label: "Dash", geometry: "capsule", range: 2.2, cooldown: 1.4, damage: 1.4, tags: ["burst", "movement"] },
  { id: "projectile", label: "Projectile", geometry: "projectile", range: 6.5, cooldown: 1.1, damage: 0.8, tags: ["ranged"] },
  { id: "cone", label: "Cone", geometry: "cone", range: 2.8, cooldown: 1.25, damage: 1.1, tags: ["arc", "crowd"] },
  { id: "area", label: "Area", geometry: "ring", range: 2.1, cooldown: 2.2, damage: 1.8, tags: ["zone"] },
  { id: "summon", label: "Summon", geometry: "circle", range: 3.4, cooldown: 4.8, damage: 0, tags: ["spawn", "boss"] },
  { id: "structure-breaker", label: "Structure breaker", geometry: "capsule", range: 0.95, cooldown: 0.75, damage: 2.2, tags: ["structure"] },
  { id: "gate-rusher", label: "Gate rusher", geometry: "capsule", range: 1.2, cooldown: 0.68, damage: 1.6, tags: ["gate", "breach"] }
];

export const BEHAVIOR_PATTERNS: BehaviorPattern[] = [
  { id: "chase-player", label: "Chase player", objective: "player", aggression: 0.72, cohesion: 0.2, tags: ["direct"] },
  { id: "defend-zone", label: "Defend zone", objective: "zone", aggression: 0.42, cohesion: 0.75, tags: ["guard"] },
  { id: "attack-base", label: "Attack base", objective: "base-core", aggression: 0.82, cohesion: 0.35, tags: ["siege"] },
  { id: "patrol-route", label: "Patrol route", objective: "route", aggression: 0.38, cohesion: 0.5, tags: ["route"] },
  { id: "kite", label: "Kite", objective: "player", aggression: 0.55, cohesion: 0.18, tags: ["ranged"] },
  { id: "swarm", label: "Swarm", objective: "player", aggression: 0.92, cohesion: 0.9, tags: ["crowd"] },
  { id: "boss-phase", label: "Boss phase", objective: "structure", aggression: 0.88, cohesion: 0.15, tags: ["boss", "phase"] }
];

export const DEFAULT_CHARACTER_ARCHETYPE: CharacterArchetype = {
  id: "char-raider-v1",
  label: "Raider V1",
  kind: "enemy",
  faction: "hostile",
  visual: "raider",
  body: { radius: 0.34, height: 2, speed: 1.55, hp: 3 },
  attackId: "melee",
  behaviorId: "chase-player",
  crowdCount: 8
};

export function canonicalCharacterSignature(archetype: CharacterArchetype): string {
  return JSON.stringify({
    id: archetype.id,
    kind: archetype.kind,
    faction: archetype.faction,
    visual: archetype.visual,
    body: archetype.body,
    attackId: archetype.attackId,
    behaviorId: archetype.behaviorId
  });
}

export function actorFromCharacterArchetype(archetype: CharacterArchetype, id: string, index: number): Actor {
  const attack = ATTACK_PATTERNS.find((entry) => entry.id === archetype.attackId) ?? ATTACK_PATTERNS[0];
  const columns = Math.max(1, Math.ceil(Math.sqrt(archetype.crowdCount)));
  const row = Math.floor(index / columns);
  const col = index % columns;
  const spacing = Math.max(0.85, archetype.body.radius * 3.2);
  const originX = (columns - 1) * spacing * -0.5;
  const combatProfile: ActorCombatProfile = {
    attackId: archetype.attackId,
    behaviorId: archetype.behaviorId,
    geometry: attack.geometry,
    range: attack.range,
    cooldown: attack.cooldown,
    damage: attack.damage
  };
  const actor = createActor(id, archetype.kind, { x: originX + col * spacing, z: row * spacing - 1.8 }, { visual: archetype.visual, combatProfile });
  return {
    ...actor,
    radius: archetype.body.radius,
    height: archetype.body.height,
    speed: archetype.body.speed,
    hp: archetype.body.hp,
    maxHp: archetype.body.hp,
    visual: ACTOR_VISUAL_PROFILES[archetype.visual],
    combatProfile,
    properties: {
      ...actor.properties,
      displayName: archetype.label,
      maxHp: archetype.body.hp,
      measurement: {
        heightM: archetype.body.height,
        widthM: archetype.body.radius * 2,
        footprintRadiusM: archetype.body.radius
      },
      tags: [...actor.properties.tags, archetype.attackId, archetype.behaviorId]
    }
  };
}

export function createCharacterPreviewWorld(archetype: CharacterArchetype): WorldState {
  const run = createRogueRun();
  const count = Math.max(1, Math.min(160, Math.round(archetype.crowdCount)));
  const actors = Array.from({ length: count }, (_, index) => actorFromCharacterArchetype(archetype, `${archetype.kind}-${index + 1}`, index));
  const baseCore = createBaseCore({ x: 0, z: 2.8 });
  return {
    pieces: [],
    towers: [],
    connectors: [],
    surfaceTiles: [],
    actors,
    baseCore,
    run,
    aiMemory: {},
    worldSeed: 501,
    tick: 0,
    structures: createStructureMap([], [], baseCore, run.baseCoreMaxHp),
    combatLog: [],
    selectedId: undefined
  };
}

export function updateCharacterArchetype(archetype: CharacterArchetype, patch: Partial<CharacterArchetype>): CharacterArchetype {
  return { ...archetype, ...patch };
}
