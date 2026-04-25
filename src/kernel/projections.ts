import { PIXELS_PER_UNIT } from "./worldUnits";
import type { Vec2, Vec3 } from "./vector";

export type Viewport = Readonly<{ width: number; height: number }>;
export type Camera2D = Readonly<{ target: Vec2; zoom: number }>;
export type ScreenPoint = Readonly<{ x: number; y: number }>;

export function iso(point: Vec2): ScreenPoint {
  return {
    x: point.x - point.z,
    y: (point.x + point.z) * 0.5
  };
}

export function project2D(point: Vec2, camera: Camera2D, viewport: Viewport): ScreenPoint {
  return {
    x: viewport.width * 0.5 + camera.zoom * PIXELS_PER_UNIT * (point.x - camera.target.x),
    y: viewport.height * 0.5 + camera.zoom * PIXELS_PER_UNIT * (point.z - camera.target.z)
  };
}

export function project25D(point: Vec3, camera: Camera2D, viewport: Viewport): ScreenPoint {
  const p = iso({ x: point.x, z: point.z });
  const c = iso(camera.target);
  return {
    x: viewport.width * 0.5 + camera.zoom * PIXELS_PER_UNIT * (p.x - c.x),
    y: viewport.height * 0.5 + camera.zoom * PIXELS_PER_UNIT * (p.y - c.y - point.y)
  };
}

export function project3D(point: Vec3): Vec3 {
  return point;
}
