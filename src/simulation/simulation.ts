import { bossBody } from "../domain/boss";
import { actorCircle, baseCoreCircle, CANONICAL_DIMENSIONS, pieceCapsule, type Actor } from "../domain/canonical";
import type { DebugContact } from "../domain/debug";
import { circleIntersectsCapsule, distanceToCapsule, nearestPointOnCircle, nearestPointOnCapsule, type Capsule2D } from "../kernel/shapes";
import { add, distance, normalize, scale, sub, type Vec2 } from "../kernel/vector";
import { computeAiDebug, computeNextAiMemory } from "./ai";
import type { AiPolicyConfig } from "./aiPolicy";
import { canOccupy, gateBlockers, moveActor } from "./collision";
import { nextUpgradeChoices, playerSpeedMultiplier, spawnWaveActors, towerPulseCooldown } from "./roguelite";
import type { WorldState } from "./worldState";
import { activePieces, activeTowers, applyStructureDamage, splashTowerDamage, structureState, withPressureDecay, type CombatEvent } from "./structures";

export { blockingCapsules, canOccupy, moveActor } from "./collision";

export type InputState = Readonly<{
  move: Vec2;
  attack?: boolean;
  interact?: boolean;
}>;

function waypointDelta(position: Vec2, waypoints: Array<{ point: Vec2 }>, speed: number, dt: number): Vec2 {
  const goal = waypoints.at(-1)?.point;
  if (!goal) return { x: 0, z: 0 };
  const currentGoalDistance = distance(position, goal);
  const next =
    waypoints.find((waypoint) => distance(position, waypoint.point) > 0.08 && distance(waypoint.point, goal) < currentGoalDistance - 0.02) ??
    waypoints.find((waypoint) => distance(position, waypoint.point) > 0.08);
  if (!next) return { x: 0, z: 0 };
  const direction = normalize({ x: next.point.x - position.x, z: next.point.z - position.z });
  return scale(direction, speed * dt);
}

function applyHeightConnectorTraversal(actor: Actor, entry: ReturnType<typeof computeAiDebug>[number] | undefined): Actor {
  if (!entry) return actor;
  const nextLayerWaypoint = entry.waypoints.find((waypoint) => waypoint.layer !== actor.heightLayer);
  if (!nextLayerWaypoint) return actor;
  if (distance(actor.position, nextLayerWaypoint.point) > 0.35) return actor;
  return {
    ...actor,
    position: nextLayerWaypoint.point,
    heightLayer: nextLayerWaypoint.layer,
    baseY: nextLayerWaypoint.baseY
  };
}

function applyPlayerConnectorTraversal(actor: Actor, world: WorldState): Actor {
  const connector = world.connectors.find(
    (entry) =>
      (entry.from.layer === actor.heightLayer &&
        distance(actor.position, { x: entry.from.position.x, z: entry.from.position.z }) <= 0.35) ||
      (entry.to.layer === actor.heightLayer && distance(actor.position, { x: entry.to.position.x, z: entry.to.position.z }) <= 0.35)
  );
  if (!connector) return actor;
  const forward = distance(actor.position, { x: connector.from.position.x, z: connector.from.position.z }) <= 0.35;
  const target = forward ? connector.to : connector.from;
  return {
    ...actor,
    position: { x: target.position.x, z: target.position.z },
    heightLayer: target.layer,
    baseY: target.position.y
  };
}

export function stepSimulation(world: WorldState, input: InputState, dt: number, aiPolicy?: AiPolicyConfig): WorldState {
  if (world.run.phase !== "combat") return world;

  const interactionWorld = applyPlayerGateInteraction(world, input);
  const collisionPieces = activePieces(interactionWorld.pieces, interactionWorld.structures);
  const aiDebug = computeAiDebug(interactionWorld, { policy: aiPolicy });
  const nextActors = world.actors.map((actor) => {
    if (actor.kind === "player") {
      const moved = moveActor(actor, scale(normalize(input.move), actor.speed * playerSpeedMultiplier(world.run) * dt), collisionPieces);
      return applyPlayerConnectorTraversal(moved, interactionWorld);
    }

    const debugEntry = aiDebug.find((entry) => entry.actorId === actor.id);
    if (!debugEntry) return actor;
    const chaseSpeed =
      actor.kind === "boss"
        ? actor.speed * (debugEntry.objective === "base-core" ? 1.08 : 0.76)
        : actor.speed;
    const pathDelta = waypointDelta(actor.position, debugEntry.waypoints, chaseSpeed, dt);
    const fallback = normalize(sub(debugEntry.targetPoint, actor.position));
    const delta = distance(pathDelta, { x: 0, z: 0 }) > 0.001 ? pathDelta : scale(fallback, chaseSpeed * dt);
    const facing = distance(delta, { x: 0, z: 0 }) > 0.001 ? normalize(delta) : actor.facing;
    const moved = moveActor({ ...actor, facing }, delta, collisionPieces);
    return applyHeightConnectorTraversal(moved, debugEntry);
  });

  const nextWorld = applyRogueLoop({
    ...interactionWorld,
    tick: world.tick + 1,
    actors: nextActors,
    aiMemory: computeNextAiMemory(interactionWorld, aiDebug),
    structures: withPressureDecay(interactionWorld.structures, dt)
  }, input, dt);
  return nextWorld;
}

function applyPlayerGateInteraction(world: WorldState, input: InputState): WorldState {
  if (!input.interact) return world;
  const player = world.actors.find((actor) => actor.kind === "player");
  if (!player) return world;
  const gate = world.pieces
    .filter((piece) => piece.kind === "gate" && piece.state === "closed" && piece.heightLayer === player.heightLayer)
    .map((piece) => ({ piece, d: distanceToCapsule(player.position, pieceCapsule(piece)) - player.radius }))
    .sort((a, b) => a.d - b.d)[0]?.piece;
  if (!gate || distanceToCapsule(player.position, pieceCapsule(gate)) - player.radius > 0.72) return world;
  return {
    ...world,
    pieces: world.pieces.map((piece) => (piece.id === gate.id && piece.kind === "gate" ? { ...piece, state: "open" as const } : piece))
  };
}

export function actorCanHit(attacker: Actor, target: Actor): boolean {
  if (attacker.kind === "boss") {
    return circleIntersectsCapsule(actorCircle(target), bossBody(attacker).attackZone);
  }
  return distance(attacker.position, target.position) <= attacker.radius + target.radius + 0.2;
}

export function computeDebugContacts(world: WorldState, aiPolicy?: AiPolicyConfig, aiDebug = computeAiDebug(world, { policy: aiPolicy })): DebugContact[] {
  return aiDebug.map((entry) => ({
    id: `${entry.actorId}:nearest`,
    actorId: entry.actorId,
    actorKind: entry.actorKind,
    origin: world.actors.find((actor) => actor.id === entry.actorId)?.position ?? { x: 0, z: 0 },
    point: entry.contactPoint,
    targetId: entry.targetId,
    targetKind:
      entry.objective === "player"
        ? "player"
        : entry.objective === "base-core"
          ? "base-core"
          : entry.objective === "weak-structure"
            ? "structure"
            : "gate",
    distance: distance(world.actors.find((actor) => actor.id === entry.actorId)?.position ?? { x: 0, z: 0 }, entry.contactPoint)
  }));
}

function applyRogueLoop(world: WorldState, input: InputState, dt: number): WorldState {
  const pulse = applyTowerPulse(world, dt);
  let run = pulse.run;
  let actors = pulse.actors;
  let structures = pulse.structures;
  let combatLog = pulse.combatLog;

  const player = actors.find((actor) => actor.kind === "player");
  const aiDebug = computeAiDebug({ ...world, actors, structures }, {});

  const playerAttack = inputDrivenPlayerAttack(player, actors, input, run.playerAttackTimer, dt, world.tick, combatLog);
  actors = playerAttack.actors;
  run = { ...run, playerAttackTimer: playerAttack.cooldown };
  combatLog = playerAttack.combatLog;

  const structuralCombat = applyStructuralCombat({ ...world, actors, structures, combatLog }, aiDebug, dt);
  actors = structuralCombat.actors;
  structures = structuralCombat.structures;
  combatLog = structuralCombat.combatLog;

  const coreState = structureState(structures, world.baseCore.id);
  if (coreState) {
    run = {
      ...run,
      baseCoreHp: Math.max(0, Math.min(run.baseCoreMaxHp, coreState.hp))
    };
  }

  if (run.baseCoreHp <= 0 || (player && player.hp <= 0)) {
    return { ...world, actors, structures, combatLog, run: { ...run, phase: "defeat", pendingChoices: [] } };
  }
  const hostiles = actors.filter((actor) => actor.kind === "enemy" || actor.kind === "dwarf" || actor.kind === "boss");
  if (hostiles.length === 0) {
    run = { ...run, phase: "upgrade", pendingChoices: nextUpgradeChoices(run), towerPulseTimer: 0, playerAttackTimer: 0.22 };
  }
  return { ...world, actors, structures, combatLog, run };
}

function applyTowerPulse(world: WorldState, dt: number): { actors: Actor[]; run: WorldState["run"]; structures: WorldState["structures"]; combatLog: CombatEvent[] } {
  const nextTimer = world.run.towerPulseTimer - dt;
  if (nextTimer > 0 || world.towers.length === 0) {
    return { actors: world.actors, run: { ...world.run, towerPulseTimer: nextTimer }, structures: world.structures, combatLog: world.combatLog };
  }

  const liveTowers = activeTowers(world.towers, world.structures);
  const actors = world.actors
    .map((actor) => {
      if (actor.kind === "player") return actor;
      const inPulse = liveTowers.some(
        (tower) => tower.heightLayer === actor.heightLayer && distance(actor.position, { x: tower.anchor.x, z: tower.anchor.z }) <= 2.6
      );
      return inPulse ? { ...actor, hp: actor.hp - 1 } : actor;
    })
    .filter((actor) => actor.kind === "player" || actor.hp > 0);

  return { actors, run: { ...world.run, towerPulseTimer: towerPulseCooldown(world.run) }, structures: world.structures, combatLog: world.combatLog };
}

export function advanceWaveAfterUpgrade(world: WorldState): WorldState {
  const player = world.actors.find((actor) => actor.kind === "player");
  if (!player) return world;
  return {
    ...world,
    actors: [player, ...spawnWaveActors(world.run.wave)],
    run: { ...world.run, phase: "combat", pendingChoices: [], towerPulseTimer: 0.4, playerAttackTimer: 0.2 }
  };
}

function inputDrivenPlayerAttack(
  player: Actor | undefined,
  actors: Actor[],
  input: InputState,
  cooldown: number,
  dt: number,
  tick: number,
  combatLog: CombatEvent[]
): { actors: Actor[]; cooldown: number; combatLog: CombatEvent[] } {
  if (!player) return { actors, cooldown: Math.max(0, cooldown - dt), combatLog };
  const nextCooldown = Math.max(0, cooldown - dt);
  if (nextCooldown > 0) return { actors, cooldown: nextCooldown, combatLog };
  const target = actors
    .filter((actor) => actor.kind !== "player")
    .map((actor) => ({ actor, d: distance(actor.position, player.position) - actor.radius - player.radius }))
    .sort((a, b) => a.d - b.d)[0];
  if (!target || target.d > 1.1) return { actors, cooldown: nextCooldown, combatLog };
  if (!input.attack && target.d > 0.55) return { actors, cooldown: nextCooldown, combatLog };

  return {
    actors: actors
      .map((actor) => (actor.id === target.actor.id ? { ...actor, hp: actor.hp - 1 } : actor))
      .filter((actor) => actor.kind === "player" || actor.hp > 0),
    cooldown: 0.48,
    combatLog: [
      ...combatLog.slice(-59),
      {
        id: `combat-${tick}-player-${target.actor.id}`,
        tick,
        attackerId: player.id,
        targetId: target.actor.id,
        point: target.actor.position,
        amount: 1,
        kind: "impact"
      }
    ]
  };
}

function appendCombatEvent(world: WorldState, attackerId: string, targetId: string, point: Vec2, amount: number, kind: CombatEvent["kind"] = "impact"): CombatEvent[] {
  return [
    ...world.combatLog.slice(-79),
    {
      id: `combat-${world.tick}-${attackerId}-${targetId}-${world.combatLog.length + 1}`,
      tick: world.tick,
      attackerId,
      targetId,
      point,
      amount,
      kind
    }
  ];
}

function applyStructuralCombat(world: WorldState, aiDebug: ReturnType<typeof computeAiDebug>, dt: number): Pick<WorldState, "actors" | "structures" | "combatLog"> {
  let actors = world.actors;
  let structures = world.structures;
  let combatLog = world.combatLog;

  for (const entry of aiDebug) {
    const actor = actors.find((candidate) => candidate.id === entry.actorId);
    if (!actor) continue;
    const contactDistance = distance(actor.position, entry.contactPoint);

    if (entry.objective === "player") {
      const player = actors.find((candidate) => candidate.id === entry.targetId);
      if (!player || contactDistance > actor.radius + player.radius + 0.28) continue;
      const amount = (actor.kind === "boss" ? 2.4 : 0.8) * dt;
      actors = actors.map((candidate) => (candidate.id === player.id ? { ...candidate, hp: candidate.hp - amount } : candidate));
      combatLog = appendCombatEvent(world, actor.id, player.id, entry.contactPoint, amount);
      continue;
    }

    const threshold = actor.kind === "boss" ? actor.radius + 0.45 : actor.radius + 0.24;
    if (contactDistance > threshold) continue;

    const amount = (actor.kind === "boss" ? 4.8 : 1.9) * dt;
    structures = applyStructureDamage(structures, entry.targetId, amount, entry.contactPoint, actor.id);
    if (entry.objective === "weak-structure" || entry.objective === "closed-gate" || entry.objective === "open-gate") {
      structures = splashTowerDamage(structures, world.towers, entry.targetId, amount, entry.contactPoint, actor.id);
    }
    combatLog = appendCombatEvent(world, actor.id, entry.targetId, entry.contactPoint, amount);
    if (structureState(structures, entry.targetId)?.integrity === "destroyed") {
      combatLog = appendCombatEvent(world, actor.id, entry.targetId, entry.contactPoint, amount, "destroyed");
    }
  }

  return { actors, structures, combatLog };
}
