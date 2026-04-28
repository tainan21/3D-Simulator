import { centimeters, layerToBaseY, meters, SOCKET_SNAP_RADIUS } from "../kernel/worldUnits";
import { midpoint, type Vec2, type Vec3 } from "../kernel/vector";
import { axesFromPlanarForward, type OrientationAxes } from "../kernel/orientation";
import { boundsForCapsule, type Aabb2D, type Capsule2D, type Circle2D, type Segment2D } from "../kernel/shapes";

export type PieceKind = "fence" | "fence-tl" | "gate";
export type GateState = "open" | "closed";
export type SocketKind = "endpoint" | "top";
export type HeightLayer = 0 | 1 | 2 | 3;
export type HeightConnectorKind = "ramp" | "platform-link" | "top-socket-link";
export type GameObjectType =
  | "player"
  | "enemy"
  | "dwarf"
  | "boss"
  | "base-core"
  | "fence"
  | "fence-tl"
  | "gate"
  | "tower"
  | HeightConnectorKind;

export type MeasurementProfile = Readonly<{
  heightM: number;
  widthM: number;
  lengthM?: number;
  footprintRadiusM?: number;
}>;

export type GameObjectProperties = Readonly<{
  type: GameObjectType;
  displayName: string;
  measurement: MeasurementProfile;
  maxHp: number;
  armor: number;
  tags: readonly string[];
}>;

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
  properties: GameObjectProperties;
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
  properties: GameObjectProperties;
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
  properties: GameObjectProperties;
}>;

export type ActorKind = "player" | "enemy" | "dwarf" | "boss";
export type SurfaceMaterialKind = "stone" | "moss" | "dirt" | "rune" | "water";
export type SurfaceIntensity = 1 | 2 | 3;
export type ActorVisualVariant = "scout" | "raider" | "warden" | "brute" | "specter";
export type ActorSilhouette = "slim" | "balanced" | "heavy" | "small" | "colossus";

export type SurfaceTile = Readonly<{
  id: string;
  cell: Readonly<{ i: number; j: number }>;
  material: SurfaceMaterialKind;
  intensity: SurfaceIntensity;
  heightLayer: HeightLayer;
}>;

export type SurfaceMaterialProfile = Readonly<{
  displayName: string;
  color: number;
  accentColor: number;
  roughness: number;
  walkCost: number;
  tags: readonly string[];
}>;

export type ActorVisualProfile = Readonly<{
  variant: ActorVisualVariant;
  primaryColor: number;
  secondaryColor: number;
  accentColor: number;
  silhouette: ActorSilhouette;
}>;

export type ActorAttackGeometry = "circle" | "capsule" | "cone" | "projectile" | "ring";

export type ActorCombatProfile = Readonly<{
  attackId: string;
  behaviorId: string;
  geometry: ActorAttackGeometry;
  range: number;
  cooldown: number;
  damage: number;
}>;

export const SURFACE_MATERIALS: Record<SurfaceMaterialKind, SurfaceMaterialProfile> = {
  stone: { displayName: "Pedra fria", color: 0x40506b, accentColor: 0x9eb7ff, roughness: 0.92, walkCost: 1, tags: ["floor", "neutral"] },
  moss: { displayName: "Musgo leve", color: 0x4e8f62, accentColor: 0x9df09f, roughness: 0.98, walkCost: 1.05, tags: ["floor", "organic"] },
  dirt: { displayName: "Terra batida", color: 0x8a6242, accentColor: 0xf2c184, roughness: 1, walkCost: 1.08, tags: ["floor", "rough"] },
  rune: { displayName: "Runa baixa", color: 0x6749a8, accentColor: 0x7af0d4, roughness: 0.7, walkCost: 1, tags: ["floor", "signal"] },
  water: { displayName: "Agua rasa", color: 0x235d7e, accentColor: 0x74f5ff, roughness: 0.45, walkCost: 1.2, tags: ["floor", "slow"] }
};

export const ACTOR_VISUAL_PROFILES: Record<ActorVisualVariant, ActorVisualProfile> = {
  scout: { variant: "scout", primaryColor: 0x7af0d4, secondaryColor: 0x1f7469, accentColor: 0xf9f4dd, silhouette: "slim" },
  raider: { variant: "raider", primaryColor: 0xf2a65a, secondaryColor: 0x8a3f2d, accentColor: 0xffd28a, silhouette: "balanced" },
  warden: { variant: "warden", primaryColor: 0x9eb7ff, secondaryColor: 0x40506b, accentColor: 0xf6c453, silhouette: "small" },
  brute: { variant: "brute", primaryColor: 0xe9609b, secondaryColor: 0x61243e, accentColor: 0xf16d6d, silhouette: "colossus" },
  specter: { variant: "specter", primaryColor: 0xa98cff, secondaryColor: 0x2b2446, accentColor: 0x74f5ff, silhouette: "heavy" }
};

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
  visual: ActorVisualProfile;
  combatProfile?: ActorCombatProfile;
  properties: GameObjectProperties;
}>;

export type BossBody = Readonly<{
  main: Circle2D;
  attackZone: Capsule2D;
}>;

export type PieceHeightOptions = Readonly<{
  heightLayer?: HeightLayer;
  baseY?: number;
}>;

export type ActorOptions = PieceHeightOptions &
  Readonly<{
    visual?: ActorVisualVariant | ActorVisualProfile;
    combatProfile?: ActorCombatProfile;
  }>;

export const CANONICAL_DIMENSIONS = {
  fence: { thickness: centimeters(18), radius: centimeters(9), height: meters(1.5) },
  fenceTL: { thickness: centimeters(22), radius: centimeters(11), height: meters(4) },
  gate: { thickness: centimeters(20), radius: centimeters(10), height: meters(1.5), openInterval: [0.15, 0.85] as const },
  tower: { radius: centimeters(26), height: meters(3.2) },
  baseCore: { radius: centimeters(55), height: meters(1.15) },
  player: { radius: centimeters(28), height: meters(1), speed: 2.65, hp: 8 },
  enemy: { radius: centimeters(34), height: meters(2), speed: 1.55, hp: 3 },
  dwarf: { radius: centimeters(22), height: centimeters(50), speed: 2.15, hp: 2 },
  boss: { radius: centimeters(95), height: meters(4), speed: 0.92, hp: 18, attackRadius: centimeters(70) }
} as const;

export const DEFAULT_OBJECT_PROPERTIES: Record<GameObjectType, GameObjectProperties> = {
  player: {
    type: "player",
    displayName: "Jogador",
    measurement: { heightM: CANONICAL_DIMENSIONS.player.height, widthM: CANONICAL_DIMENSIONS.player.radius * 2, footprintRadiusM: CANONICAL_DIMENSIONS.player.radius },
    maxHp: CANONICAL_DIMENSIONS.player.hp,
    armor: 0,
    tags: ["actor", "controllable", "roguelite"]
  },
  enemy: {
    type: "enemy",
    displayName: "Mob inimigo",
    measurement: { heightM: CANONICAL_DIMENSIONS.enemy.height, widthM: CANONICAL_DIMENSIONS.enemy.radius * 2, footprintRadiusM: CANONICAL_DIMENSIONS.enemy.radius },
    maxHp: CANONICAL_DIMENSIONS.enemy.hp,
    armor: 0,
    tags: ["actor", "hostile"]
  },
  dwarf: {
    type: "dwarf",
    displayName: "Mob anao",
    measurement: { heightM: CANONICAL_DIMENSIONS.dwarf.height, widthM: CANONICAL_DIMENSIONS.dwarf.radius * 2, footprintRadiusM: CANONICAL_DIMENSIONS.dwarf.radius },
    maxHp: CANONICAL_DIMENSIONS.dwarf.hp,
    armor: 0,
    tags: ["actor", "hostile", "small"]
  },
  boss: {
    type: "boss",
    displayName: "Boss estrutural",
    measurement: { heightM: CANONICAL_DIMENSIONS.boss.height, widthM: CANONICAL_DIMENSIONS.boss.radius * 2, footprintRadiusM: CANONICAL_DIMENSIONS.boss.radius },
    maxHp: CANONICAL_DIMENSIONS.boss.hp,
    armor: 1,
    tags: ["actor", "hostile", "boss", "structural-ai"]
  },
  "base-core": {
    type: "base-core",
    displayName: "Nucleo",
    measurement: { heightM: CANONICAL_DIMENSIONS.baseCore.height, widthM: CANONICAL_DIMENSIONS.baseCore.radius * 2, footprintRadiusM: CANONICAL_DIMENSIONS.baseCore.radius },
    maxHp: 42,
    armor: 1,
    tags: ["structure", "win-condition", "destructible"]
  },
  fence: {
    type: "fence",
    displayName: "Cerca",
    measurement: { heightM: CANONICAL_DIMENSIONS.fence.height, widthM: CANONICAL_DIMENSIONS.fence.thickness },
    maxHp: 14,
    armor: 0,
    tags: ["structure", "wall", "destructible"]
  },
  "fence-tl": {
    type: "fence-tl",
    displayName: "Cerca TL",
    measurement: { heightM: CANONICAL_DIMENSIONS.fenceTL.height, widthM: CANONICAL_DIMENSIONS.fenceTL.thickness },
    maxHp: 26,
    armor: 1,
    tags: ["structure", "wall", "top-socket", "destructible"]
  },
  gate: {
    type: "gate",
    displayName: "Portao",
    measurement: { heightM: CANONICAL_DIMENSIONS.gate.height, widthM: CANONICAL_DIMENSIONS.gate.thickness },
    maxHp: 18,
    armor: 0,
    tags: ["structure", "portal", "destructible", "interactive"]
  },
  tower: {
    type: "tower",
    displayName: "Torre",
    measurement: { heightM: CANONICAL_DIMENSIONS.tower.height, widthM: CANONICAL_DIMENSIONS.tower.radius * 2, footprintRadiusM: CANONICAL_DIMENSIONS.tower.radius },
    maxHp: 12,
    armor: 0,
    tags: ["structure", "defense", "destructible"]
  },
  ramp: {
    type: "ramp",
    displayName: "Rampa",
    measurement: { heightM: 1, widthM: 0.8 },
    maxHp: 10,
    armor: 0,
    tags: ["connector", "height"]
  },
  "platform-link": {
    type: "platform-link",
    displayName: "Link de plataforma",
    measurement: { heightM: 0.15, widthM: 0.8 },
    maxHp: 10,
    armor: 0,
    tags: ["connector", "height"]
  },
  "top-socket-link": {
    type: "top-socket-link",
    displayName: "Link de topo",
    measurement: { heightM: CANONICAL_DIMENSIONS.fenceTL.height, widthM: CANONICAL_DIMENSIONS.fenceTL.thickness * 2 },
    maxHp: 10,
    armor: 0,
    tags: ["connector", "socket", "height"]
  }
};

export function propertiesFor(type: GameObjectType, overrides: Partial<GameObjectProperties> = {}): GameObjectProperties {
  const base = DEFAULT_OBJECT_PROPERTIES[type];
  return {
    ...base,
    ...overrides,
    measurement: { ...base.measurement, ...overrides.measurement },
    tags: overrides.tags ?? base.tags
  };
}

function resolveHeight(options: PieceHeightOptions): { baseY: number; heightLayer: HeightLayer } {
  const heightLayer = options.heightLayer ?? 0;
  return {
    heightLayer,
    baseY: options.baseY ?? layerToBaseY(heightLayer)
  };
}

function defaultActorVisual(kind: ActorKind): ActorVisualProfile {
  if (kind === "player") return ACTOR_VISUAL_PROFILES.scout;
  if (kind === "dwarf") return ACTOR_VISUAL_PROFILES.warden;
  if (kind === "boss") return ACTOR_VISUAL_PROFILES.brute;
  return ACTOR_VISUAL_PROFILES.raider;
}

function resolveActorVisual(kind: ActorKind, visual?: ActorOptions["visual"]): ActorVisualProfile {
  if (!visual) return defaultActorVisual(kind);
  if (typeof visual === "string") return ACTOR_VISUAL_PROFILES[visual];
  return visual;
}

export function surfaceTileId(cell: SurfaceTile["cell"], heightLayer: HeightLayer): string {
  return `surface-${heightLayer}-${cell.i}-${cell.j}`;
}

export function createSurfaceTile(
  id: string,
  cell: SurfaceTile["cell"],
  material: SurfaceMaterialKind,
  intensity: SurfaceIntensity = 2,
  heightLayer: HeightLayer = 0
): SurfaceTile {
  return {
    id,
    cell,
    material,
    intensity,
    heightLayer
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
    properties: propertiesFor("fence"),
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
    properties: propertiesFor("fence-tl"),
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
    properties: propertiesFor("gate"),
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
    properties: propertiesFor("tower"),
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
    heightLayer,
    properties: propertiesFor("base-core")
  };
}

export function createActor(
  id: string,
  kind: ActorKind,
  position: Vec2,
  options: ActorOptions = {}
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
    heightLayer,
    visual: resolveActorVisual(kind, options.visual),
    combatProfile: options.combatProfile,
    properties: propertiesFor(kind)
  };
}

export function actorCircle(actor: Actor): Circle2D {
  return { center: actor.position, radius: actor.radius };
}

export function baseCoreCircle(core: BaseCore): Circle2D {
  return { center: core.position, radius: core.radius };
}
