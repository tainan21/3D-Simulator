export type AiPolicyConfig = Readonly<{
  fovDegrees: number;
  visionRange: number;
  memoryDuration: number;
  playerPriority: number;
  corePriority: number;
  openGateBias: number;
  closedGateBias: number;
  weakStructureBias: number;
  chokeCost: number;
  structuralWeight: number;
}>;

export const DEFAULT_AI_POLICY: AiPolicyConfig = {
  fovDegrees: 104,
  visionRange: 8,
  memoryDuration: 2.4,
  playerPriority: -1.8,
  corePriority: 1.1,
  openGateBias: -1.1,
  closedGateBias: 0.3,
  weakStructureBias: 0.2,
  chokeCost: 0,
  structuralWeight: 1
};
