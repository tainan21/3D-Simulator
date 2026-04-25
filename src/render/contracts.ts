import type { ReplayState, ValidationIssue, InfluenceField } from "../domain/analysis";
import type { DebugContact, DebugOverlayOptions } from "../domain/debug";
import type { Vec2 } from "../kernel/vector";
import type { WorldState } from "../simulation/worldState";
import type { AiDebugState } from "../simulation/aiTypes";
import type { RenderDirtyFlags } from "./dirtyFlags";

export type CameraMode3D = "tactical" | "inspection" | "first-person";

export type ThreeCameraState = Readonly<{
  mode: CameraMode3D;
  yaw: number;
  pitch: number;
  distance: number;
  eyeHeight: number;
  focusTarget: "player" | "selected" | "core";
  panOffset: Vec2;
}>;

export type ViewportCamera2D = Readonly<{
  target: Vec2;
  zoom: number;
}>;

export type RenderDataProvider = Readonly<{
  getWorld: () => WorldState;
  getGhostWorld?: () => WorldState | undefined;
  getDebugOptions: () => DebugOverlayOptions;
  getDebugContacts: () => DebugContact[];
  getAiDebug: () => AiDebugState[];
  getValidationIssues: () => ValidationIssue[];
  getInfluenceField: () => InfluenceField;
  getReplayState: () => ReplayState;
  getRenderDirtyFlags?: () => RenderDirtyFlags;
}>;
