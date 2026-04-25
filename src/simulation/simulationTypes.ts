import type { AiPolicyConfig } from "./aiPolicy";
import type { BasePiece, TowerPiece } from "../domain/canonical";
import type { InfluenceField, WorldTopology } from "../domain/analysis";

export type AiDebugOptions = Readonly<{
  includeNavigation?: boolean;
  policy?: AiPolicyConfig;
  livePieces?: BasePiece[];
  liveTowers?: TowerPiece[];
  topology?: WorldTopology;
  influenceField?: InfluenceField;
}>;
