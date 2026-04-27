import type { Vec2 } from "./vector";

export const WORLD_UNIT_LABEL = "1 world unit = 1 metro logico";
export const METERS_PER_UNIT = 1;
export const CENTIMETERS_PER_METER = 100;
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

export function meters(value: number): number {
  return value / METERS_PER_UNIT;
}

export function centimeters(value: number): number {
  return meters(value / CENTIMETERS_PER_METER);
}

export function toMeters(worldUnits: number): number {
  return worldUnits * METERS_PER_UNIT;
}

export function toCentimeters(worldUnits: number): number {
  return toMeters(worldUnits) * CENTIMETERS_PER_METER;
}

export function formatMeters(worldUnits: number): string {
  const value = toMeters(worldUnits);
  return `${Number(value.toFixed(value >= 10 ? 1 : 2))} m`;
}

export function formatCentimeters(worldUnits: number): string {
  return `${Math.round(toCentimeters(worldUnits))} cm`;
}
