import type { Vec2 } from "./vector";

export const WORLD_UNIT_LABEL = "1 world unit = 1 metro logico";
export const CELL_SIZE = 1;
export const PIXELS_PER_UNIT = 48;
export const SOCKET_SNAP_RADIUS = 0.2;
export const HEIGHT_LAYER_STEP = 2.4;
export const MAX_HEIGHT_LAYER = 3;

export type CellCoord = Readonly<{ i: number; j: number }>;

export function cellToWorld(cell: CellCoord): Vec2 {
  return { x: cell.i * CELL_SIZE, z: cell.j * CELL_SIZE };
}

export function worldToCell(point: Vec2): CellCoord {
  return { i: point.x / CELL_SIZE, j: point.z / CELL_SIZE };
}

export function snapWorldToCell(point: Vec2): Vec2 {
  const cell = worldToCell(point);
  return cellToWorld({ i: Math.round(cell.i), j: Math.round(cell.j) });
}

export function layerToBaseY(layer: number): number {
  return layer * HEIGHT_LAYER_STEP;
}

export function clampHeightLayer(layer: number): number {
  return Math.max(0, Math.min(MAX_HEIGHT_LAYER, Math.round(layer)));
}
