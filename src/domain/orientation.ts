import type { Actor, BaseCore, BasePiece, FenceTLPiece, Socket, TowerPiece } from "./canonical";
import { midpoint, sub, type Vec2, type Vec3 } from "../kernel/vector";
import { frameFromPlanarForward, type OrientationAxes, type OrientationFrame, WORLD_FORWARD } from "../kernel/orientation";

export type PieceOrientation = Readonly<{
  pivot: OrientationFrame;
  start: OrientationFrame;
  end: OrientationFrame;
  topSocket?: OrientationFrame;
}>;

export function pieceForward(piece: BasePiece): Vec2 {
  return sub(piece.b, piece.a);
}

export function pieceOrientation(piece: BasePiece): PieceOrientation {
  const forward = pieceForward(piece);
  return {
    pivot: frameFromPlanarForward({ x: midpoint(piece.a, piece.b).x, y: piece.baseY, z: midpoint(piece.a, piece.b).z }, forward),
    start: frameFromPlanarForward({ x: piece.a.x, y: piece.baseY, z: piece.a.z }, forward),
    end: frameFromPlanarForward({ x: piece.b.x, y: piece.baseY, z: piece.b.z }, forward),
    topSocket:
      piece.kind === "fence-tl"
        ? frameFromPlanarForward({ x: midpoint(piece.a, piece.b).x, y: piece.baseY + piece.height, z: midpoint(piece.a, piece.b).z }, forward)
        : undefined
  };
}

export function socketOrientation(piece: BasePiece, socketKind: Socket["kind"], endpoint: "a" | "b" | "mid" = "mid"): OrientationFrame {
  const orientation = pieceOrientation(piece);
  if (socketKind === "top") return orientation.topSocket ?? orientation.pivot;
  if (endpoint === "a") return orientation.start;
  if (endpoint === "b") return orientation.end;
  return orientation.pivot;
}

export function towerOrientation(tower: TowerPiece, fence?: FenceTLPiece): OrientationFrame {
  if (fence) {
    return frameFromPlanarForward(tower.anchor, pieceForward(fence));
  }
  return frameFromPlanarForward(tower.anchor, { x: WORLD_FORWARD.x, z: WORLD_FORWARD.z });
}

export function actorOrientation(actor: Actor): OrientationFrame {
  return frameFromPlanarForward({ x: actor.position.x, y: actor.baseY, z: actor.position.z }, actor.facing);
}

export function baseCoreOrientation(core: BaseCore): OrientationFrame {
  return frameFromPlanarForward({ x: core.position.x, y: core.baseY, z: core.position.z }, { x: WORLD_FORWARD.x, z: WORLD_FORWARD.z });
}

export function axesLabel(frame: OrientationFrame): string {
  const axes = frame.axes;
  return `f(${axes.forward.x.toFixed(2)},${axes.forward.y.toFixed(2)},${axes.forward.z.toFixed(2)}) r(${axes.right.x.toFixed(2)},${axes.right.y.toFixed(2)},${axes.right.z.toFixed(2)}) u(${axes.up.x.toFixed(2)},${axes.up.y.toFixed(2)},${axes.up.z.toFixed(2)})`;
}

export function axesToObjectBasis(axes: OrientationAxes): [Vec3, Vec3, Vec3] {
  return [axes.forward, axes.up, axes.right];
}

export function withHeight(origin: Vec2, y: number): Vec3 {
  return { x: origin.x, y, z: origin.z };
}
