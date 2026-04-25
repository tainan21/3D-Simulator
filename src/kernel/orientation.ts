import { cross3, normalize, normalize3, type Vec2, type Vec3 } from "./vector";

export type OrientationAxes = Readonly<{
  forward: Vec3;
  right: Vec3;
  up: Vec3;
}>;

export type OrientationFrame = Readonly<{
  origin: Vec3;
  axes: OrientationAxes;
}>;

export const WORLD_FORWARD: Vec3 = { x: 0, y: 0, z: 1 };
export const WORLD_RIGHT: Vec3 = { x: 1, y: 0, z: 0 };
export const WORLD_UP: Vec3 = { x: 0, y: 1, z: 0 };

export function axesFromPlanarForward(forward2: Vec2): OrientationAxes {
  const planar = normalize(forward2);
  const forward: Vec3 = normalize3({ x: planar.x, y: 0, z: planar.z });
  const right = normalize3(cross3(WORLD_UP, forward));
  const correctedForward = normalize3(cross3(right, WORLD_UP));
  return {
    forward: correctedForward,
    right,
    up: WORLD_UP
  };
}

export function frameFromPlanarForward(origin: Vec3, forward2: Vec2): OrientationFrame {
  return {
    origin,
    axes: axesFromPlanarForward(forward2)
  };
}

export function yawPitchToAxes(yaw: number, pitch: number): OrientationAxes {
  const horizontal = Math.cos(pitch);
  const forward = normalize3({
    x: Math.sin(yaw) * horizontal,
    y: Math.sin(pitch),
    z: Math.cos(yaw) * horizontal
  });
  const right = normalize3(cross3(WORLD_UP, { x: forward.x, y: 0, z: forward.z }));
  const up = normalize3(cross3(forward, right));
  return { forward, right, up };
}
