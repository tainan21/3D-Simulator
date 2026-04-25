import {
  add,
  clamp,
  distance,
  dot,
  length,
  lengthSq,
  normalize,
  perpendicular,
  scale,
  sub,
  type Vec2
} from "./vector";

export type Segment2D = Readonly<{ a: Vec2; b: Vec2 }>;
export type Capsule2D = Readonly<{ segment: Segment2D; radius: number }>;
export type Circle2D = Readonly<{ center: Vec2; radius: number }>;
export type Aabb2D = Readonly<{ min: Vec2; max: Vec2 }>;
export type Shape2D =
  | Readonly<{ kind: "capsule"; capsule: Capsule2D }>
  | Readonly<{ kind: "circle"; circle: Circle2D }>;

export function segmentLength(segment: Segment2D): number {
  return distance(segment.a, segment.b);
}

export function segmentDirection(segment: Segment2D): Vec2 {
  return normalize(sub(segment.b, segment.a));
}

export function closestPointOnSegment(point: Vec2, segment: Segment2D): Vec2 {
  const ab = sub(segment.b, segment.a);
  const denom = lengthSq(ab);
  if (denom <= 0) return segment.a;
  const t = clamp(dot(sub(point, segment.a), ab) / denom, 0, 1);
  return add(segment.a, scale(ab, t));
}

export function distanceToSegment(point: Vec2, segment: Segment2D): number {
  return distance(point, closestPointOnSegment(point, segment));
}

export function distanceToCapsule(point: Vec2, capsule: Capsule2D): number {
  return Math.max(0, distanceToSegment(point, capsule.segment) - capsule.radius);
}

function orientation(a: Vec2, b: Vec2, c: Vec2): number {
  return (b.z - a.z) * (c.x - b.x) - (b.x - a.x) * (c.z - b.z);
}

function onSegment(a: Vec2, b: Vec2, c: Vec2): boolean {
  return (
    Math.min(a.x, c.x) <= b.x &&
    b.x <= Math.max(a.x, c.x) &&
    Math.min(a.z, c.z) <= b.z &&
    b.z <= Math.max(a.z, c.z)
  );
}

export function segmentsIntersect(first: Segment2D, second: Segment2D): boolean {
  const o1 = orientation(first.a, first.b, second.a);
  const o2 = orientation(first.a, first.b, second.b);
  const o3 = orientation(second.a, second.b, first.a);
  const o4 = orientation(second.a, second.b, first.b);

  if (o1 * o2 < 0 && o3 * o4 < 0) return true;
  if (Math.abs(o1) <= 1e-6 && onSegment(first.a, second.a, first.b)) return true;
  if (Math.abs(o2) <= 1e-6 && onSegment(first.a, second.b, first.b)) return true;
  if (Math.abs(o3) <= 1e-6 && onSegment(second.a, first.a, second.b)) return true;
  if (Math.abs(o4) <= 1e-6 && onSegment(second.a, first.b, second.b)) return true;
  return false;
}

export function distanceBetweenSegments(first: Segment2D, second: Segment2D): number {
  if (segmentsIntersect(first, second)) return 0;
  return Math.min(
    distanceToSegment(first.a, second),
    distanceToSegment(first.b, second),
    distanceToSegment(second.a, first),
    distanceToSegment(second.b, first)
  );
}

export function nearestPointOnCircle(point: Vec2, circle: Circle2D): Vec2 {
  const delta = sub(point, circle.center);
  const current = length(delta);
  if (current <= 1e-6) return { x: circle.center.x + circle.radius, z: circle.center.z };
  return add(circle.center, scale(delta, circle.radius / current));
}

export function nearestPointOnCapsule(point: Vec2, capsule: Capsule2D): Vec2 {
  const centerline = closestPointOnSegment(point, capsule.segment);
  const delta = sub(point, centerline);
  const current = length(delta);
  if (current <= 1e-6) {
    return add(centerline, scale(perpendicular(segmentDirection(capsule.segment)), capsule.radius));
  }
  return add(centerline, scale(delta, capsule.radius / current));
}

export function nearestPointOnShape(point: Vec2, shape: Shape2D): Vec2 {
  return shape.kind === "circle" ? nearestPointOnCircle(point, shape.circle) : nearestPointOnCapsule(point, shape.capsule);
}

export function circleIntersectsCapsule(circle: Circle2D, capsule: Capsule2D): boolean {
  return distanceToSegment(circle.center, capsule.segment) <= circle.radius + capsule.radius;
}

export function boundsForSegment(segment: Segment2D): Aabb2D {
  return {
    min: { x: Math.min(segment.a.x, segment.b.x), z: Math.min(segment.a.z, segment.b.z) },
    max: { x: Math.max(segment.a.x, segment.b.x), z: Math.max(segment.a.z, segment.b.z) }
  };
}

export function expandBounds(bounds: Aabb2D, amount: number): Aabb2D {
  return {
    min: { x: bounds.min.x - amount, z: bounds.min.z - amount },
    max: { x: bounds.max.x + amount, z: bounds.max.z + amount }
  };
}

export function boundsForCapsule(capsule: Capsule2D): Aabb2D {
  return expandBounds(boundsForSegment(capsule.segment), capsule.radius);
}

export function boundsForCircle(circle: Circle2D): Aabb2D {
  return {
    min: { x: circle.center.x - circle.radius, z: circle.center.z - circle.radius },
    max: { x: circle.center.x + circle.radius, z: circle.center.z + circle.radius }
  };
}

export function mergeBounds(bounds: Aabb2D[]): Aabb2D {
  if (bounds.length === 0) {
    return { min: { x: 0, z: 0 }, max: { x: 0, z: 0 } };
  }
  return bounds.reduce(
    (merged, current) => ({
      min: {
        x: Math.min(merged.min.x, current.min.x),
        z: Math.min(merged.min.z, current.min.z)
      },
      max: {
        x: Math.max(merged.max.x, current.max.x),
        z: Math.max(merged.max.z, current.max.z)
      }
    }),
    bounds[0]
  );
}

export function orientedBoxCorners(segment: Segment2D, halfWidth: number): Vec2[] {
  const axis = segmentDirection(segment);
  const normal = perpendicular(axis);
  const offset = scale(normal, halfWidth);
  return [
    add(segment.a, offset),
    add(segment.b, offset),
    add(segment.b, scale(offset, -1)),
    add(segment.a, scale(offset, -1))
  ];
}

export function pushCircleOutOfCapsule(circle: Circle2D, capsule: Capsule2D): Vec2 {
  const nearest = closestPointOnSegment(circle.center, capsule.segment);
  const delta = sub(circle.center, nearest);
  const current = length(delta);
  const target = circle.radius + capsule.radius;
  if (current >= target) return circle.center;
  const normal = current <= 1e-6 ? perpendicular(segmentDirection(capsule.segment)) : scale(delta, 1 / current);
  return add(circle.center, scale(normal, target - current + 1e-4));
}
