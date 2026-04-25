import { layerToBaseY, SOCKET_SNAP_RADIUS } from "../kernel/worldUnits";
import { midpoint, type Vec2, type Vec3 } from "../kernel/vector";
import { axesFromPlanarForward, type OrientationAxes } from "../kernel/orientation";
import { boundsForCapsule, type Aabb2D, type Capsule2D, type Circle2D, type Segment2D } from "../kernel/shapes";

export type PieceKind = "fence" | "fence-tl" | "gate";
export type GateState = "open" | "closed";
export type SocketKind = "endpoint" | "top";
export type HeightLayer = 0 | 1 | 2 | 3;
export type HeightConnectorKind = "ramp" | "platform-link" | "top-socket-link";

export type Socket = Readonly<{
  id: string;
  kind: SocketKind;
  position: Vec3;
  axes: OrientationAxes;
  snapRadius: number;
}>;

type PieceBase<K extends PieceKind> = Readonly<{
  id: string;
  kind: K;
  a: Vec2;
  b: Vec2;
  thickness: number;
  height: number;
  baseY: number;
  heightLayer: HeightLayer;
}>;

export type FencePiece = PieceBase<"fence"> &
  Readonly<{
    blocksMovement: true;
  }>;

export type FenceTLPiece = PieceBase<"fence-tl"> &
  Readonly<{
    blocksMovement: true;
    towerId?: string;
  }>;

export type GatePiece = PieceBase<"gate"> &
  Readonly<{
    state: GateState;
  }>;

export type BasePiece = FencePiece | FenceTLPiece | GatePiece;

export type TowerPiece = Readonly<{
  id: string;
  fenceId: string;
  radius: number;
  height: number;
  anchor: Vec3;
  heightLayer: HeightLayer;
}>;

export type HeightConnectorEnd = Readonly<{
  position: Vec3;
  layer: HeightLayer;
  pieceId?: string;
}>;

export type HeightConnector = Readonly<{
  id: string;
  kind: HeightConnectorKind;
  from: HeightConnectorEnd;
  to: HeightConnectorEnd;
  width: number;
  travelCost: number;
}>;

export type BaseCore = Readonly<{
  id: "base-core";
  position: Vec2;
  radius: number;
  height: number;
  baseY: number;
  heightLayer: HeightLayer;
}>;

export type ActorKind = "player" | "enemy" | "boss";

export type Actor = Readonly<{
  id: string;
  kind: ActorKind;
  position: Vec2;
  radius: number;
  height: number;
  speed: number;
  facing: Vec2;
  hp: number;
  maxHp: number;
  baseY: number;
  heightLayer: HeightLayer;
}>;

export type BossBody = Readonly<{
  main: Circle2D;
  attackZone: Capsule2D;
}>;

export type PieceHeightOptions = Readonly<{
  heightLayer?: HeightLayer;
  baseY?: number;
}>;

export const CANONICAL_DIMENSIONS = {
  fence: { thickness: 0.18, radius: 0.09, height: 3 },
  fenceTL: { thickness: 0.18, radius: 0.09, height: 3 },
  gate: { thickness: 0.18, radius: 0.09, height: 3, openInterval: [0.15, 0.85] as const },
  tower: { radius: 0.09, height: 1.2 },
  baseCore: { radius: 0.42, height: 0.75 },
  player: { radius: 0.28, height: 1.7, speed: 2.6, hp: 6 },
  enemy: { radius: 0.24, height: 1.4, speed: 1.6, hp: 2 },
  boss: { radius: 0.75, height: 2.2, speed: 0.9, hp: 8, attackRadius: 0.45 }
} as const;

function resolveHeight(options: PieceHeightOptions): { baseY: number; heightLayer: HeightLayer } {
  const heightLayer = options.heightLayer ?? 0;
  return {
    heightLayer,
    baseY: options.baseY ?? layerToBaseY(heightLayer)
  };
}

export function pieceMidpoint(piece: Pick<BasePiece, "a" | "b">): Vec2 {
  return midpoint(piece.a, piece.b);
}

export function pieceSegment(piece: BasePiece): Segment2D {
  return { a: piece.a, b: piece.b };
}

export function pieceRadius(piece: BasePiece): number {
  return piece.thickness * 0.5;
}

export function pieceCapsule(piece: BasePiece): Capsule2D {
  return { segment: pieceSegment(piece), radius: pieceRadius(piece) };
}

export function pieceHorizontalBounds(piece: BasePiece): Aabb2D {
  return boundsForCapsule(pieceCapsule(piece));
}

export function pieceSockets(piece: BasePiece): Socket[] {
  const axes = axesFromPlanarForward({ x: piece.b.x - piece.a.x, z: piece.b.z - piece.a.z });
  const sockets: Socket[] = [
    {
      id: `${piece.id}:a`,
      kind: "endpoint",
      position: { x: piece.a.x, y: piece.baseY, z: piece.a.z },
      axes,
      snapRadius: SOCKET_SNAP_RADIUS
    },
    {
      id: `${piece.id}:b`,
      kind: "endpoint",
      position: { x: piece.b.x, y: piece.baseY, z: piece.b.z },
      axes,
      snapRadius: SOCKET_SNAP_RADIUS
    }
  ];

  if (piece.kind === "fence-tl") {
    const center = pieceMidpoint(piece);
    sockets.push({
      id: `${piece.id}:top`,
      kind: "top",
      position: { x: center.x, y: piece.baseY + piece.height, z: center.z },
      axes,
      snapRadius: SOCKET_SNAP_RADIUS
    });
  }

  return sockets;
}

export function createFence(id: string, a: Vec2, b: Vec2, options: PieceHeightOptions = {}): FencePiece {
  const { baseY, heightLayer } = resolveHeight(options);
  return {
    id,
    kind: "fence",
    a,
    b,
    thickness: CANONICAL_DIMENSIONS.fence.thickness,
    height: CANONICAL_DIMENSIONS.fence.height,
    baseY,
    heightLayer,
    blocksMovement: true
  };
}

export function createFenceTL(id: string, a: Vec2, b: Vec2, towerId?: string, options: PieceHeightOptions = {}): FenceTLPiece {
  const { baseY, heightLayer } = resolveHeight(options);
  return {
    id,
    kind: "fence-tl",
    a,
    b,
    thickness: CANONICAL_DIMENSIONS.fenceTL.thickness,
    height: CANONICAL_DIMENSIONS.fenceTL.height,
    baseY,
    heightLayer,
    blocksMovement: true,
    towerId
  };
}

export function createGate(id: string, a: Vec2, b: Vec2, state: GateState = "closed", options: PieceHeightOptions = {}): GatePiece {
  const { baseY, heightLayer } = resolveHeight(options);
  return {
    id,
    kind: "gate",
    a,
    b,
    thickness: CANONICAL_DIMENSIONS.gate.thickness,
    height: CANONICAL_DIMENSIONS.gate.height,
    baseY,
    heightLayer,
    state
  };
}

export function createTower(id: string, fence: FenceTLPiece): TowerPiece {
  const anchor2 = pieceMidpoint(fence);
  return {
    id,
    fenceId: fence.id,
    radius: CANONICAL_DIMENSIONS.tower.radius,
    height: CANONICAL_DIMENSIONS.tower.height,
    heightLayer: fence.heightLayer,
    anchor: { x: anchor2.x, y: fence.baseY + fence.height, z: anchor2.z }
  };
}

export function attachTower(piece: FenceTLPiece, towerId: string): FenceTLPiece {
  return { ...piece, towerId };
}

export function createTopSocketLink(id: string, fence: FenceTLPiece): HeightConnector {
  const center = pieceMidpoint(fence);
  return {
    id,
    kind: "top-socket-link",
    from: {
      position: { x: center.x, y: fence.baseY, z: center.z },
      layer: fence.heightLayer,
      pieceId: fence.id
    },
    to: {
      position: { x: center.x, y: fence.baseY + fence.height, z: center.z },
      layer: fence.heightLayer,
      pieceId: fence.id
    },
    width: fence.thickness * 2,
    travelCost: 1.4
  };
}

export function createHeightConnector(
  id: string,
  kind: Exclude<HeightConnectorKind, "top-socket-link">,
  from: HeightConnectorEnd,
  to: HeightConnectorEnd,
  width = 0.8
): HeightConnector {
  return {
    id,
    kind,
    from,
    to,
    width,
    travelCost: kind === "ramp" ? 1.1 : 0.8
  };
}

export function createBaseCore(position: Vec2 = { x: 0, z: 0 }, options: PieceHeightOptions = {}): BaseCore {
  const { baseY, heightLayer } = resolveHeight(options);
  return {
    id: "base-core",
    position,
    radius: CANONICAL_DIMENSIONS.baseCore.radius,
    height: CANONICAL_DIMENSIONS.baseCore.height,
    baseY,
    heightLayer
  };
}

export function createActor(
  id: string,
  kind: ActorKind,
  position: Vec2,
  options: PieceHeightOptions = {}
): Actor {
  const dims = CANONICAL_DIMENSIONS[kind];
  const { baseY, heightLayer } = resolveHeight(options);
  return {
    id,
    kind,
    position,
    radius: dims.radius,
    height: dims.height,
    speed: dims.speed,
    facing: { x: 1, z: 0 },
    hp: dims.hp,
    maxHp: dims.hp,
    baseY,
    heightLayer
  };
}

export function actorCircle(actor: Actor): Circle2D {
  return { center: actor.position, radius: actor.radius };
}

export function baseCoreCircle(core: BaseCore): Circle2D {
  return { center: core.position, radius: core.radius };
}
