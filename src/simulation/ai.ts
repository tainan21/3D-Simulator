import { actorCircle, baseCoreCircle, pieceCapsule, type Actor, type BasePiece } from "../domain/canonical";
import { canOccupy, blockingCapsules } from "./collision";
import { findPath, navigationBounds } from "./navigation";
import { circleIntersectsCapsule, nearestPointOnCapsule, nearestPointOnCircle } from "../kernel/shapes";
import { distance, dot, normalize, sub, type Vec2 } from "../kernel/vector";
import type { WorldState } from "./worldState";
import { buildWorldTopology, findTopologyRoute } from "./topology";
import { computeInfluenceField } from "./influence";
import { DEFAULT_AI_POLICY, type AiPolicyConfig } from "./aiPolicy";
import type { AiDebugOptions } from "./simulationTypes";
import type { AiDebugState, AiDecisionSnapshot, AiMemoryState, AiObjectiveKind, AiPerceptionState, AiTargetScore } from "./aiTypes";
import { activePieces, activeTowers, structureWeaknessScore } from "./structures";
import type { InfluenceField, WorldTopology } from "../domain/analysis";

type TargetShape =
  | Readonly<{
      kind: "circle";
      id: string;
      objective: AiObjectiveKind;
      layer: Actor["heightLayer"];
      baseY: number;
      circle: ReturnType<typeof actorCircle> | ReturnType<typeof baseCoreCircle>;
    }>
  | Readonly<{
      kind: "capsule";
      id: string;
      objective: AiObjectiveKind;
      layer: BasePiece["heightLayer"];
      baseY: number;
      capsule: ReturnType<typeof pieceCapsule>;
    }>;

const NAV_SAMPLE_STEP = 1;
const NAV_SAMPLE_RADIUS = 3;
const LOS_STEP = 0.25;

function pieceById(world: WorldState, id: string): BasePiece | undefined {
  return world.pieces.find((piece) => piece.id === id);
}

function targetShapePoint(actor: Actor, shape: TargetShape): Vec2 {
  return shape.kind === "circle" ? nearestPointOnCircle(actor.position, shape.circle) : nearestPointOnCapsule(actor.position, shape.capsule);
}

function lineOfSightBlocked(a: Vec2, b: Vec2, pieces: BasePiece[], heightLayer: number): string[] {
  const blockerIds = new Set<string>();
  const blockers = pieces
    .filter((piece) => piece.heightLayer === heightLayer)
    .map((piece) => ({ pieceId: piece.id, capsules: blockingCapsules([piece]) }));
  const steps = Math.max(1, Math.ceil(distance(a, b) / LOS_STEP));
  for (let index = 1; index < steps; index += 1) {
    const t = index / steps;
    const point = {
      x: a.x + (b.x - a.x) * t,
      z: a.z + (b.z - a.z) * t
    };
    for (const blocker of blockers) {
      if (blocker.capsules.some((capsule) => circleIntersectsCapsule({ center: point, radius: 0.04 }, capsule))) {
        blockerIds.add(blocker.pieceId);
      }
    }
  }
  return [...blockerIds];
}

function fovDot(policy: AiPolicyConfig): number {
  const halfRadians = (policy.fovDegrees * Math.PI) / 360;
  return Math.cos(halfRadians);
}

function canSeeTarget(actor: Actor, target: Vec2, pieces: BasePiece[], policy: AiPolicyConfig): Omit<AiPerceptionState, "memoryLeft" | "lastSeenPoint" | "threatPriority"> {
  const toTarget = normalize(sub(target, actor.position));
  const facing = normalize(actor.facing);
  const inFov = dot(facing, toTarget) >= fovDot(policy);
  const blockers = lineOfSightBlocked(actor.position, target, pieces, actor.heightLayer);
  const withinRange = distance(actor.position, target) <= policy.visionRange;
  return {
    visible: inFov && blockers.length === 0 && withinRange,
    withinFov: inFov,
    withinRange,
    blockingPieceIds: blockers
  };
}

function openGateTargets(livePieces: BasePiece[]): TargetShape[] {
  return livePieces
    .filter((piece) => piece.kind === "gate" && piece.state === "open")
    .map((piece) => ({
      kind: "capsule" as const,
      id: piece.id,
      objective: "open-gate" as const,
      layer: piece.heightLayer,
      baseY: piece.baseY,
      capsule: pieceCapsule(piece)
    }));
}

function closedGateTargets(livePieces: BasePiece[]): TargetShape[] {
  return livePieces
    .filter((piece) => piece.kind === "gate" && piece.state === "closed")
    .map((piece) => ({
      kind: "capsule" as const,
      id: piece.id,
      objective: "closed-gate" as const,
      layer: piece.heightLayer,
      baseY: piece.baseY,
      capsule: pieceCapsule(piece)
    }));
}

function weakestStructureTargets(world: WorldState, livePieces: BasePiece[]): TargetShape[] {
  return [...livePieces]
    .sort((a, b) => {
      const scoreA = structureWeaknessScore(world.structures, a.id) + (a.kind === "fence-tl" ? 0.7 : a.kind === "gate" ? (a.state === "closed" ? 0.4 : 0.1) : 0.2);
      const scoreB = structureWeaknessScore(world.structures, b.id) + (b.kind === "fence-tl" ? 0.7 : b.kind === "gate" ? (b.state === "closed" ? 0.4 : 0.1) : 0.2);
      return scoreA - scoreB;
    })
    .map((piece) => ({
      kind: "capsule" as const,
      id: piece.id,
      objective: "weak-structure" as const,
      layer: piece.heightLayer,
      baseY: piece.baseY,
      capsule: pieceCapsule(piece)
    }));
}

function evaluatePerception(world: WorldState, actor: Actor, player: Actor | undefined, policy: AiPolicyConfig, livePieces: BasePiece[]): AiPerceptionState {
  const memory = world.aiMemory[actor.id];
  if (!player) {
    return {
      visible: false,
      withinFov: false,
      withinRange: false,
      blockingPieceIds: [],
      memoryLeft: memory?.memoryLeft ?? 0,
      lastSeenPoint: memory?.lastSeenPoint,
      threatPriority: 0
    };
  }
  const playerPoint = nearestPointOnCircle(actor.position, actorCircle(player));
  const visibility = canSeeTarget(actor, playerPoint, livePieces, policy);
  const memoryLeft = visibility.visible ? policy.memoryDuration : Math.max(0, (memory?.memoryLeft ?? 0) - 0.1);
  return {
    ...visibility,
    memoryLeft,
    lastSeenPoint: visibility.visible ? player.position : memory?.lastSeenPoint,
    threatPriority: visibility.visible ? Math.max(0.4, 2.2 - distance(actor.position, player.position) * 0.2) : Math.max(0, (memory?.memoryLeft ?? 0) * 0.35)
  };
}

function influencePenalty(field: InfluenceField, point: Vec2): number {
  const closest = field.cells.reduce(
    (best, cell) => (distance(cell.center, point) < distance(best.center, point) ? cell : best),
    field.cells[0]
  );
  return closest ? Math.max(0, closest.defense - closest.pressure * 0.35) + closest.exposure * 0.3 : 0;
}

function scoreTarget(
  world: WorldState,
  actor: Actor,
  shape: TargetShape,
  perception: AiPerceptionState,
  policy: AiPolicyConfig,
  topology: WorldTopology,
  influenceField: InfluenceField
): AiTargetScore {
  const targetPoint = targetShapePoint(actor, shape);
  const route = findTopologyRoute(
    topology,
    { x: actor.position.x, y: actor.baseY, z: actor.position.z },
    actor.heightLayer,
    { x: targetPoint.x, y: shape.baseY, z: targetPoint.z },
    shape.layer
  );
  const structuralWeaknessScoreValue =
    shape.objective === "player" ? 0 : structureWeaknessScore(world.structures, shape.id);
  const structuralWeakness =
    shape.objective === "weak-structure"
      ? policy.weakStructureBias * policy.structuralWeight - structuralWeaknessScoreValue * 1.8
      : shape.objective === "open-gate"
        ? policy.openGateBias * 0.72 - structuralWeaknessScoreValue * 1.2
      : shape.objective === "closed-gate"
          ? policy.closedGateBias - structuralWeaknessScoreValue * 1.4
          : shape.objective === "player"
            ? actor.kind === "boss"
              ? policy.corePriority + 1.1
              : policy.playerPriority
            : policy.corePriority - structuralWeaknessScoreValue * 0.5;
  const gateBias =
    shape.objective === "open-gate" ? policy.openGateBias : shape.objective === "closed-gate" ? policy.closedGateBias : shape.objective === "base-core" ? policy.corePriority * 0.72 : 0;
  const heightPenalty = Math.abs(shape.layer - actor.heightLayer) * 1.8;
  const influence = influencePenalty(influenceField, targetPoint);
  const visibleBias = shape.objective === "player" ? -perception.threatPriority : 0;
  return {
    targetId: shape.id,
    objective: shape.objective,
    routeCost: route.reachable ? route.traversalCost : distance(actor.position, targetPoint) + 14,
    structuralWeakness,
    influencePenalty: influence,
    gateBias,
    heightPenalty,
    total: (route.reachable ? route.traversalCost : distance(actor.position, targetPoint) + 14) + structuralWeakness + influence + gateBias + heightPenalty + visibleBias + policy.chokeCost * route.portalIds.length
  };
}

function chooseTarget(
  world: WorldState,
  actor: Actor,
  perception: AiPerceptionState,
  player: Actor | undefined,
  policy: AiPolicyConfig,
  topology: WorldTopology,
  influenceField: InfluenceField,
  livePieces: BasePiece[]
): { shape: TargetShape; decision: AiDecisionSnapshot } {
  const gatesOpen = openGateTargets(livePieces);
  const gatesClosed = closedGateTargets(livePieces);
  let candidates: TargetShape[] = [];
  if (player) {
    candidates.push({
      kind: "circle",
      id: player.id,
      objective: "player",
      layer: player.heightLayer,
      baseY: player.baseY,
      circle: actorCircle(player)
    });
  }
  candidates.push(...gatesOpen, ...gatesClosed, ...weakestStructureTargets(world, livePieces));
  candidates.push({
    kind: "circle",
    id: world.baseCore.id,
    objective: "base-core",
    layer: world.baseCore.heightLayer,
    baseY: world.baseCore.baseY,
    circle: baseCoreCircle(world.baseCore)
  });

  if (!perception.visible) {
    if (actor.kind === "boss" && gatesOpen.length > 0) {
      candidates = candidates.filter((candidate) => candidate.objective === "base-core");
    } else if (gatesClosed.length > 0 && gatesOpen.length === 0) {
      candidates = candidates.filter((candidate) => candidate.objective === "closed-gate" || candidate.objective === "base-core");
    } else if (gatesOpen.length > 0) {
      candidates = candidates.filter((candidate) => candidate.objective === "open-gate" || candidate.objective === "base-core" || candidate.objective === "player");
    }
  }

  const scored = candidates.map((candidate) => scoreTarget(world, actor, candidate, perception, policy, topology, influenceField));
  const chosenScore = [...scored].sort((a, b) => a.total - b.total)[0];
  const chosenShape = candidates.find((candidate) => candidate.id === chosenScore.targetId && candidate.objective === chosenScore.objective) ?? candidates[0];
  return {
    shape: chosenShape,
    decision: {
      actorId: actor.id,
      chosen: chosenScore,
      candidates: scored.sort((a, b) => a.total - b.total).slice(0, 5)
    }
  };
}

function sampleNavigation(actor: Actor, pieces: BasePiece[], center: Vec2): Array<{ point: Vec2; navigable: boolean }> {
  const bounds = navigationBounds(pieces.filter((piece) => piece.heightLayer === actor.heightLayer), [actor.position, center]);
  const points: Array<{ point: Vec2; navigable: boolean }> = [];
  const minX = Math.max(bounds.min.x, center.x - NAV_SAMPLE_RADIUS);
  const maxX = Math.min(bounds.max.x, center.x + NAV_SAMPLE_RADIUS);
  const minZ = Math.max(bounds.min.z, center.z - NAV_SAMPLE_RADIUS);
  const maxZ = Math.min(bounds.max.z, center.z + NAV_SAMPLE_RADIUS);

  for (let x = Math.floor(minX); x <= Math.ceil(maxX); x += NAV_SAMPLE_STEP) {
    for (let z = Math.floor(minZ); z <= Math.ceil(maxZ); z += NAV_SAMPLE_STEP) {
      const point = { x, z };
      points.push({ point, navigable: canOccupy(actor, point, pieces) });
    }
  }

  return points;
}

function hybridWaypoints(
  world: WorldState,
  actor: Actor,
  target: TargetShape,
  topology: WorldTopology,
  livePieces: BasePiece[]
): { waypoints: AiDebugState["waypoints"]; reached: boolean; topologyRoute: string[]; portalIds: string[] } {
  const targetPoint = targetShapePoint(actor, target);
  const route = findTopologyRoute(
    topology,
    { x: actor.position.x, y: actor.baseY, z: actor.position.z },
    actor.heightLayer,
    { x: targetPoint.x, y: target.baseY, z: targetPoint.z },
    target.layer
  );
  const waypoints: AiDebugState["waypoints"] = [];
  let currentActor = actor;

  for (const portalId of route.portalIds) {
    const portal = topology.portals.find((entry) => entry.id === portalId);
    if (!portal || portal.kind === "gate") continue;
    const fromNode = topology.nodes.find((node) => node.id === portal.fromNodeId);
    const toNode = topology.nodes.find((node) => node.id === portal.toNodeId);
    if (!fromNode || !toNode) continue;
    const approach = currentActor.heightLayer === fromNode.heightLayer ? fromNode : toNode;
    const exit = currentActor.heightLayer === fromNode.heightLayer ? toNode : fromNode;
    const leg = findPath(
      currentActor,
      currentActor.position,
      { x: approach.position.x, z: approach.position.z },
      livePieces.filter((piece) => piece.heightLayer === currentActor.heightLayer),
      canOccupy
    );
    waypoints.push(
      ...leg.waypoints.map((point) => ({
        point,
        layer: currentActor.heightLayer,
        baseY: currentActor.baseY
      }))
    );
    waypoints.push({
      point: { x: exit.position.x, z: exit.position.z },
      layer: exit.heightLayer,
      baseY: exit.position.y
    });
    currentActor = { ...currentActor, position: { x: exit.position.x, z: exit.position.z }, heightLayer: exit.heightLayer, baseY: exit.position.y };
  }

  const finalLeg = findPath(
    currentActor,
    currentActor.position,
    targetPoint,
    livePieces.filter((piece) => piece.heightLayer === currentActor.heightLayer),
    canOccupy
  );
  waypoints.push(
    ...finalLeg.waypoints.map((point) => ({
      point,
      layer: currentActor.heightLayer,
      baseY: currentActor.baseY
    }))
  );
  return {
    waypoints,
    reached: finalLeg.reached || distance(currentActor.position, targetPoint) <= 0.6,
    topologyRoute: route.nodeIds,
    portalIds: route.portalIds
  };
}

export function computeAiDebug(world: WorldState, options: AiDebugOptions = {}): AiDebugState[] {
  const policy = options.policy ?? DEFAULT_AI_POLICY;
  const livePieces = options.livePieces ?? activePieces(world.pieces, world.structures);
  const liveTowers = options.liveTowers ?? activeTowers(world.towers, world.structures);
  const topology = options.topology ?? buildWorldTopology(livePieces, world.connectors, world.baseCore);
  const influenceField = options.influenceField ?? computeInfluenceField(livePieces, liveTowers, world.actors, world.baseCore);
  const player = world.actors.find((actor) => actor.kind === "player");
  return world.actors
    .filter((actor) => actor.kind === "enemy" || actor.kind === "boss")
    .map((actor) => {
      const actorKind = actor.kind as "enemy" | "boss";
      const perception = evaluatePerception(world, actor, player, policy, livePieces);
      const { shape, decision } = chooseTarget(world, actor, perception, player, policy, topology, influenceField, livePieces);
      const targetPoint = targetShapePoint(actor, shape);
      const path = hybridWaypoints(world, actor, shape, topology, livePieces);
      return {
        actorId: actor.id,
        actorKind,
        objective: shape.objective,
        targetId: shape.id,
        targetPoint,
        contactPoint: targetPoint,
        visible: perception.visible,
        waypoints: path.waypoints,
        reached: path.reached,
        blockingPieceIds: perception.blockingPieceIds,
        navigationSamples: options.includeNavigation ? sampleNavigation(actor, livePieces, targetPoint) : [],
        topologyRoute: path.topologyRoute,
        portalIds: path.portalIds,
        perception,
        decision
      };
    });
}

export function computeNextAiMemory(world: WorldState, aiDebug: AiDebugState[]): AiMemoryState {
  const next: Record<string, AiMemoryState[string]> = {};
  for (const entry of aiDebug) {
    next[entry.actorId] = {
      targetId: entry.targetId,
      lastSeenPoint: entry.perception.lastSeenPoint,
      memoryLeft: entry.perception.visible ? DEFAULT_AI_POLICY.memoryDuration : Math.max(0, entry.perception.memoryLeft - 0.1)
    };
  }
  return next;
}
