import { mergeBounds, type Aabb2D } from "../kernel/shapes";
import { add, distance, length, normalize, scale, type Vec2 } from "../kernel/vector";
import type { Actor, BasePiece } from "../domain/canonical";

type PathNode = Readonly<{
  key: string;
  point: Vec2;
  g: number;
  f: number;
  parent?: string;
}>;

export type NavigationResult = Readonly<{
  waypoints: Vec2[];
  reached: boolean;
}>;

const NAV_STEP = 0.5;
const MAX_EXPANSIONS = 2200;

function nodeKey(point: Vec2): string {
  return `${point.x.toFixed(2)}:${point.z.toFixed(2)}`;
}

function roundToStep(value: number): number {
  return Math.round(value / NAV_STEP) * NAV_STEP;
}

function snapNav(point: Vec2): Vec2 {
  return { x: roundToStep(point.x), z: roundToStep(point.z) };
}

export function navigationBounds(pieces: BasePiece[], focus: Vec2[]): Aabb2D {
  const shapeBounds = pieces.length
    ? mergeBounds(
        pieces.map((piece) => ({
          min: { x: Math.min(piece.a.x, piece.b.x) - 2, z: Math.min(piece.a.z, piece.b.z) - 2 },
          max: { x: Math.max(piece.a.x, piece.b.x) + 2, z: Math.max(piece.a.z, piece.b.z) + 2 }
        }))
      )
    : { min: { x: -8, z: -8 }, max: { x: 8, z: 8 } };
  return focus.reduce(
    (bounds, point) => ({
      min: { x: Math.min(bounds.min.x, point.x - 4), z: Math.min(bounds.min.z, point.z - 4) },
      max: { x: Math.max(bounds.max.x, point.x + 4), z: Math.max(bounds.max.z, point.z + 4) }
    }),
    shapeBounds
  );
}

function neighbors(point: Vec2, bounds: Aabb2D): Vec2[] {
  const next: Vec2[] = [];
  for (const dz of [-NAV_STEP, 0, NAV_STEP]) {
    for (const dx of [-NAV_STEP, 0, NAV_STEP]) {
      if (dx === 0 && dz === 0) continue;
      const candidate = { x: point.x + dx, z: point.z + dz };
      if (
        candidate.x < bounds.min.x ||
        candidate.x > bounds.max.x ||
        candidate.z < bounds.min.z ||
        candidate.z > bounds.max.z
      ) {
        continue;
      }
      next.push(candidate);
    }
  }
  return next;
}

function reconstruct(cameFrom: Map<string, string>, points: Map<string, Vec2>, endKey: string): Vec2[] {
  const path: Vec2[] = [];
  let cursor: string | undefined = endKey;
  while (cursor) {
    const point = points.get(cursor);
    if (point) path.push(point);
    cursor = cameFrom.get(cursor);
  }
  return path.reverse();
}

function openCandidates(goal: Vec2, radius: number): Vec2[] {
  const candidates: Vec2[] = [goal];
  for (let ring = 1; ring <= 4; ring += 1) {
    const step = NAV_STEP * ring;
    candidates.push({ x: goal.x + step, z: goal.z });
    candidates.push({ x: goal.x - step, z: goal.z });
    candidates.push({ x: goal.x, z: goal.z + step });
    candidates.push({ x: goal.x, z: goal.z - step });
    candidates.push({ x: goal.x + step, z: goal.z + step });
    candidates.push({ x: goal.x - step, z: goal.z - step });
    candidates.push({ x: goal.x + step, z: goal.z - step });
    candidates.push({ x: goal.x - step, z: goal.z + step });
  }
  return candidates.filter((candidate, index, all) => index === all.findIndex((item) => item.x === candidate.x && item.z === candidate.z));
}

export function findPath(
  actor: Actor,
  start: Vec2,
  goal: Vec2,
  pieces: BasePiece[],
  canOccupy: (actor: Actor, point: Vec2, pieces: BasePiece[]) => boolean
): NavigationResult {
  const snappedStart = snapNav(start);
  const snappedGoal = snapNav(goal);
  const bounds = navigationBounds(pieces, [snappedStart, snappedGoal]);
  const validGoals = openCandidates(snappedGoal, actor.radius).filter((candidate) => canOccupy(actor, candidate, pieces));
  if (validGoals.length === 0) return { waypoints: [], reached: false };

  const goalPoint = validGoals.sort((a, b) => distance(a, snappedGoal) - distance(b, snappedGoal))[0];
  const startKey = nodeKey(snappedStart);
  const goalKey = nodeKey(goalPoint);
  const open = new Map<string, PathNode>([
    [
      startKey,
      {
        key: startKey,
        point: snappedStart,
        g: 0,
        f: distance(snappedStart, goalPoint)
      }
    ]
  ]);
  const cameFrom = new Map<string, string>();
  const points = new Map<string, Vec2>([[startKey, snappedStart], [goalKey, goalPoint]]);
  const best = new Map<string, number>([[startKey, 0]]);
  let expansions = 0;

  while (open.size > 0 && expansions < MAX_EXPANSIONS) {
    expansions += 1;
    const current = [...open.values()].sort((a, b) => a.f - b.f)[0];
    open.delete(current.key);

    if (current.key === goalKey || distance(current.point, goalPoint) <= NAV_STEP * 0.75) {
      return { waypoints: reconstruct(cameFrom, points, current.key), reached: true };
    }

    for (const neighbor of neighbors(current.point, bounds)) {
      if (!canOccupy(actor, neighbor, pieces)) continue;
      const key = nodeKey(neighbor);
      const tentative = current.g + length({ x: neighbor.x - current.point.x, z: neighbor.z - current.point.z });
      if (tentative >= (best.get(key) ?? Number.POSITIVE_INFINITY)) continue;
      cameFrom.set(key, current.key);
      points.set(key, neighbor);
      best.set(key, tentative);
      open.set(key, {
        key,
        point: neighbor,
        g: tentative,
        f: tentative + distance(neighbor, goalPoint)
      });
    }
  }

  return { waypoints: [], reached: false };
}

export function waypointDelta(position: Vec2, waypoints: Vec2[], speed: number, dt: number): Vec2 {
  const goal = waypoints.at(-1);
  if (!goal) return { x: 0, z: 0 };
  const currentGoalDistance = distance(position, goal);
  const next =
    waypoints.find((point) => distance(position, point) > 0.08 && distance(point, goal) < currentGoalDistance - 0.02) ??
    waypoints.find((point) => distance(position, point) > 0.08);
  if (!next) return { x: 0, z: 0 };
  const direction = normalize({ x: next.x - position.x, z: next.z - position.z });
  return scale(direction, speed * dt);
}

export function nudgeToward(position: Vec2, target: Vec2, amount: number): Vec2 {
  return add(position, scale(normalize({ x: target.x - position.x, z: target.z - position.z }), amount));
}
