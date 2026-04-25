import { CANONICAL_DIMENSIONS, pieceCapsule, type Actor, type BasePiece, type GatePiece } from "../domain/canonical";
import { circleIntersectsCapsule, type Capsule2D } from "../kernel/shapes";
import { add, distance, lerp, normalize, type Vec2 } from "../kernel/vector";

export function gateBlockers(gate: GatePiece): Capsule2D[] {
  if (gate.state === "closed") return [pieceCapsule(gate)];
  const radius = gate.thickness * 0.5;
  const [openStart, openEnd] = CANONICAL_DIMENSIONS.gate.openInterval;
  return [
    { segment: { a: gate.a, b: lerp(gate.a, gate.b, openStart) }, radius },
    { segment: { a: lerp(gate.a, gate.b, openEnd), b: gate.b }, radius }
  ];
}

export function blockersForPiece(piece: BasePiece): Capsule2D[] {
  if (piece.kind !== "gate") return [pieceCapsule(piece)];
  return gateBlockers(piece);
}

export function blockingCapsules(pieces: BasePiece[]): Capsule2D[] {
  return pieces.flatMap(blockersForPiece);
}

export function canOccupy(actor: Actor, position: Vec2, pieces: BasePiece[]): boolean {
  const circle = { center: position, radius: actor.radius };
  return !blockingCapsules(pieces.filter((piece) => piece.heightLayer === actor.heightLayer)).some((capsule) => circleIntersectsCapsule(circle, capsule));
}

export function moveActor(actor: Actor, delta: Vec2, pieces: BasePiece[]): Actor {
  const next = add(actor.position, delta);
  if (canOccupy(actor, next, pieces)) {
    return {
      ...actor,
      position: next,
      facing: distance(delta, { x: 0, z: 0 }) > 0.001 ? normalize(delta) : actor.facing
    };
  }
  return actor;
}
