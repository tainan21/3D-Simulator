import type { HeightLayer } from "../domain/canonical";
import type { Vec2 } from "../kernel/vector";

export type AiObjectiveKind = "player" | "base-core" | "open-gate" | "closed-gate" | "weak-structure";

export type AiPerceptionState = Readonly<{
  visible: boolean;
  withinFov: boolean;
  withinRange: boolean;
  blockingPieceIds: string[];
  memoryLeft: number;
  lastSeenPoint?: Vec2;
  threatPriority: number;
}>;

export type AiTargetScore = Readonly<{
  targetId: string;
  objective: AiObjectiveKind;
  routeCost: number;
  structuralWeakness: number;
  influencePenalty: number;
  gateBias: number;
  heightPenalty: number;
  total: number;
}>;

export type AiDecisionSnapshot = Readonly<{
  actorId: string;
  chosen: AiTargetScore;
  candidates: AiTargetScore[];
}>;

export type AiDebugState = Readonly<{
  actorId: string;
  actorKind: "enemy" | "boss";
  objective: AiObjectiveKind;
  targetId: string;
  targetPoint: Vec2;
  contactPoint: Vec2;
  visible: boolean;
  waypoints: Array<{ point: Vec2; layer: HeightLayer; baseY: number }>;
  reached: boolean;
  blockingPieceIds: string[];
  navigationSamples: Array<{ point: Vec2; navigable: boolean }>;
  topologyRoute: string[];
  portalIds: string[];
  perception: AiPerceptionState;
  decision: AiDecisionSnapshot;
}>;

export type AiMemoryEntry = Readonly<{
  targetId?: string;
  lastSeenPoint?: Vec2;
  memoryLeft: number;
}>;

export type AiMemoryState = Readonly<Record<string, AiMemoryEntry>>;
