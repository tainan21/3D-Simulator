import {
  ACTOR_VISUAL_PROFILES,
  createSurfaceTile,
  SURFACE_MATERIALS,
  surfaceTileId,
  type ActorVisualVariant,
  type HeightLayer,
  type SurfaceIntensity,
  type SurfaceMaterialKind,
  type SurfaceTile
} from "../domain/canonical";
import { worldToCell } from "../kernel/worldUnits";
import type { Vec2 } from "../kernel/vector";
import type { WorldState } from "../simulation/worldState";

export type SurfaceBrush = Readonly<{
  id: SurfaceMaterialKind;
  label: string;
  intent: string;
}>;

export type ActorVisualBrush = Readonly<{
  id: ActorVisualVariant;
  label: string;
  intent: string;
}>;

export const SURFACE_BRUSHES: SurfaceBrush[] = [
  { id: "stone", label: SURFACE_MATERIALS.stone.displayName, intent: "chao neutro de leitura limpa" },
  { id: "moss", label: SURFACE_MATERIALS.moss.displayName, intent: "envelhecido e organico" },
  { id: "dirt", label: SURFACE_MATERIALS.dirt.displayName, intent: "trilha de combate e fluxo" },
  { id: "rune", label: SURFACE_MATERIALS.rune.displayName, intent: "sinalizacao magica leve" },
  { id: "water", label: SURFACE_MATERIALS.water.displayName, intent: "agua rasa, custo visualizado" }
];

export const ACTOR_VISUAL_BRUSHES: ActorVisualBrush[] = [
  { id: "scout", label: "Scout", intent: "silhueta rapida" },
  { id: "raider", label: "Raider", intent: "mob padrao" },
  { id: "warden", label: "Warden", intent: "pequeno/defensivo" },
  { id: "brute", label: "Brute", intent: "pesado/boss" },
  { id: "specter", label: "Specter", intent: "elite mistico" }
];

export function pointToSurfaceCell(point: Vec2): SurfaceTile["cell"] {
  const cell = worldToCell(point);
  return { i: Math.round(cell.i), j: Math.round(cell.j) };
}

export function paintSurfaceTile(
  world: WorldState,
  point: Vec2,
  material: SurfaceMaterialKind,
  intensity: SurfaceIntensity,
  heightLayer: HeightLayer
): WorldState {
  const cell = pointToSurfaceCell(point);
  const id = surfaceTileId(cell, heightLayer);
  const tile = createSurfaceTile(id, cell, material, intensity, heightLayer);
  const surfaceTiles = [...(world.surfaceTiles ?? []).filter((entry) => entry.id !== id), tile].sort((a, b) => a.id.localeCompare(b.id));
  return { ...world, surfaceTiles };
}

export function createSurfacePatch(
  from: SurfaceTile["cell"],
  to: SurfaceTile["cell"],
  material: SurfaceMaterialKind,
  intensity: SurfaceIntensity,
  heightLayer: HeightLayer
): SurfaceTile[] {
  const minI = Math.min(from.i, to.i);
  const maxI = Math.max(from.i, to.i);
  const minJ = Math.min(from.j, to.j);
  const maxJ = Math.max(from.j, to.j);
  const tiles: SurfaceTile[] = [];
  for (let i = minI; i <= maxI; i += 1) {
    for (let j = minJ; j <= maxJ; j += 1) {
      const cell = { i, j };
      tiles.push(createSurfaceTile(surfaceTileId(cell, heightLayer), cell, material, intensity, heightLayer));
    }
  }
  return tiles;
}

export function withActorVisual(world: WorldState, actorId: string, variant: ActorVisualVariant): WorldState {
  const profile = ACTOR_VISUAL_PROFILES[variant];
  return {
    ...world,
    actors: world.actors.map((actor) => (actor.id === actorId ? { ...actor, visual: profile } : actor))
  };
}
