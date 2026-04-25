import { closestPointOnSegment } from "../kernel/shapes";
import type { BasePiece } from "../domain/canonical";
import type { Vec2 } from "../kernel/vector";

export function debugClosestPoint(reference: Vec2, pieces: BasePiece[]): Vec2 | undefined {
  let best: { point: Vec2; d: number } | undefined;
  for (const piece of pieces) {
    const point = closestPointOnSegment(reference, { a: piece.a, b: piece.b });
    const d = Math.hypot(reference.x - point.x, reference.z - point.z);
    if (!best || d < best.d) best = { point, d };
  }
  return best?.point;
}
