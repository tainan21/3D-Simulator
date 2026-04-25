import type { Aabb2D } from "../kernel/shapes";
import type { Vec2, Vec3 } from "../kernel/vector";
import type { BasePiece, GateState, HeightConnector, HeightConnectorKind, HeightLayer } from "./canonical";

export type ValidationSeverity = "info" | "warning" | "error";
export type ValidationIssueKind =
  | "visual-only-join"
  | "logical-only-join"
  | "orphan-tower"
  | "overlap"
  | "invalid-top-socket"
  | "unreachable-segment"
  | "height-discontinuity-without-connector";

export type ValidationIssue = Readonly<{
  id: string;
  kind: ValidationIssueKind;
  severity: ValidationSeverity;
  message: string;
  position: Vec3;
  relatedIds: string[];
}>;

export type TopologyNodeKind = "piece-endpoint" | "piece-midpoint" | "connector-end" | "base-core" | "gate-portal";

export type WorldTopologyNode = Readonly<{
  id: string;
  kind: TopologyNodeKind;
  position: Vec3;
  heightLayer: HeightLayer;
  pieceId?: string;
}>;

export type WorldTopologyEdge = Readonly<{
  id: string;
  pieceId: string;
  kind: BasePiece["kind"];
  fromNodeId: string;
  toNodeId: string;
  length: number;
  structuralWeight: number;
  traversalCost: number;
}>;

export type NavPortal = Readonly<{
  id: string;
  kind: "gate" | HeightConnectorKind;
  fromNodeId: string;
  toNodeId: string;
  available: boolean;
  gateState?: GateState;
  pieceId?: string;
  connectorId?: string;
  traversalCost: number;
}>;

export type TopologyRoute = Readonly<{
  nodeIds: string[];
  portalIds: string[];
  traversalCost: number;
  reachable: boolean;
}>;

export type WorldTopology = Readonly<{
  bounds: Aabb2D;
  nodes: WorldTopologyNode[];
  edges: WorldTopologyEdge[];
  portals: NavPortal[];
}>;

export type InfluenceCell = Readonly<{
  id: string;
  center: Vec2;
  defense: number;
  pressure: number;
  exposure: number;
  score: number;
  deadZone: boolean;
  vulnerable: boolean;
}>;

export type InfluenceField = Readonly<{
  bounds: Aabb2D;
  cellSize: number;
  cells: InfluenceCell[];
}>;

export type AnalysisDirtyFlags = Readonly<{
  geometry: boolean;
  actors: boolean;
  structures: boolean;
  replay: boolean;
  policy: boolean;
}>;

export type ReplayStatus = "idle" | "recording" | "playing" | "paused";

export type ReplayCommand =
  | Readonly<{ kind: "toggle-gate"; gateId: string }>
  | Readonly<{ kind: "attach-tower"; fenceId: string }>
  | Readonly<{ kind: "place-segment"; tool: BasePiece["kind"]; a: Vec2; b: Vec2; state?: GateState; heightLayer?: HeightLayer }>
  | Readonly<{ kind: "erase-near"; point: Vec2 }>
  | Readonly<{ kind: "load-phase-scenario"; scenarioId: string; seed: number }>
  | Readonly<{ kind: "reset-studio" }>;

export type ReplayFrame = Readonly<{
  frame: number;
  input: {
    move: Vec2;
    attack?: boolean;
  };
  commands: ReplayCommand[];
  signature: string;
}>;

export type ReplaySession = Readonly<{
  seed: number;
  status: ReplayStatus;
  frame: number;
  initialWorldJson: string;
  frames: ReplayFrame[];
  divergence?: string;
}>;

export type ReplayState = Readonly<{
  status: ReplayStatus;
  frame: number;
  totalFrames: number;
  seed: number;
  divergence?: string;
}>;

export type ChunkSeed = number;

export type ChunkDescriptor = Readonly<{
  id: string;
  seed: ChunkSeed;
  origin: Vec2;
  bounds: Aabb2D;
  pieces: BasePiece[];
  towers: ReadonlyArray<{ id: string; fenceId: string }>;
  connectors: HeightConnector[];
  suggestedSpawns: Vec2[];
}>;

export type ChunkGenerationReport = Readonly<{
  seed: ChunkSeed;
  chunks: ChunkDescriptor[];
  signature: string;
}>;
