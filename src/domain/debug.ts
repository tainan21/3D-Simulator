import type { ActorKind } from "./canonical";
import type { Vec2 } from "../kernel/vector";

export type DebugOverlayOptions = Readonly<{
  enabled: boolean;
  endpoints: boolean;
  sockets: boolean;
  bounds: boolean;
  colliders: boolean;
  nearest: boolean;
  axes: boolean;
  pivots: boolean;
  facing: boolean;
  routes: boolean;
  targets: boolean;
  navigation: boolean;
  influence: boolean;
  damage: boolean;
  diagnostics: boolean;
  shadows: boolean;
  fog: boolean;
  grid: boolean;
  lighting: boolean;
  effects: boolean;
}>;

export type DebugContact = Readonly<{
  id: string;
  actorId: string;
  actorKind: ActorKind;
  origin: Vec2;
  point: Vec2;
  targetId: string;
  targetKind: "player" | "base-core" | "gate" | "structure";
  distance: number;
}>;

export const DEFAULT_DEBUG_OVERLAYS: DebugOverlayOptions = {
  enabled: true,
  endpoints: true,
  sockets: true,
  bounds: true,
  colliders: true,
  nearest: true,
  axes: true,
  pivots: true,
  facing: true,
  routes: true,
  targets: true,
  navigation: false,
  influence: true,
  damage: true,
  diagnostics: true,
  shadows: true,
  fog: true,
  grid: true,
  lighting: true,
  effects: true
};
