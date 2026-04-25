export type Vec2 = Readonly<{ x: number; z: number }>;
export type Vec3 = Readonly<{ x: number; y: number; z: number }>;

export const EPSILON = 1e-6;

export const vec2 = (x = 0, z = 0): Vec2 => ({ x, z });
export const vec3 = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, z: a.z + b.z };
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, z: a.z - b.z };
}

export function scale(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, z: v.z * scalar };
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.z * b.z;
}

export function lengthSq(v: Vec2): number {
  return dot(v, v);
}

export function length(v: Vec2): number {
  return Math.sqrt(lengthSq(v));
}

export function distance(a: Vec2, b: Vec2): number {
  return length(sub(a, b));
}

export function normalize(v: Vec2): Vec2 {
  const l = length(v);
  return l <= EPSILON ? vec2(0, 0) : scale(v, 1 / l);
}

export function midpoint(a: Vec2, b: Vec2): Vec2 {
  return { x: (a.x + b.x) * 0.5, z: (a.z + b.z) * 0.5 };
}

export function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
}

export function perpendicular(v: Vec2): Vec2 {
  return { x: -v.z, z: v.x };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function almostEqual(a: number, b: number, tolerance = EPSILON): boolean {
  return Math.abs(a - b) <= tolerance;
}

export function vecAlmostEqual(a: Vec2, b: Vec2, tolerance = EPSILON): boolean {
  return almostEqual(a.x, b.x, tolerance) && almostEqual(a.z, b.z, tolerance);
}

export function snapToGrid(point: Vec2, cellSize = 1): Vec2 {
  return {
    x: Math.round(point.x / cellSize) * cellSize,
    z: Math.round(point.z / cellSize) * cellSize
  };
}

export function add3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function sub3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function scale3(v: Vec3, scalar: number): Vec3 {
  return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
}

export function dot3(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function lengthSq3(v: Vec3): number {
  return dot3(v, v);
}

export function length3(v: Vec3): number {
  return Math.sqrt(lengthSq3(v));
}

export function normalize3(v: Vec3): Vec3 {
  const l = length3(v);
  return l <= EPSILON ? vec3(0, 0, 0) : scale3(v, 1 / l);
}

export function cross3(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}
