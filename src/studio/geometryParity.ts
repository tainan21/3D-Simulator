import { createGeometryAdapterSnapshot, type AdapterMode, type GeometryAdapterSnapshot } from "../kernel/adapterSnapshot";
import type { WorldState } from "../simulation/worldState";

export type GeometryParityCheck = Readonly<{
  adapter: AdapterMode;
  objectCount: number;
  signature: string;
  matches3D: boolean;
}>;

export type GeometryParityReport = Readonly<{
  ok: boolean;
  baselineSignature: string;
  checks: GeometryParityCheck[];
  mismatchedAdapters: AdapterMode[];
}>;

function structuralSnapshot(snapshot: GeometryAdapterSnapshot): Omit<GeometryAdapterSnapshot, "adapter"> {
  const { adapter: _adapter, ...structural } = snapshot;
  return structural;
}

function stableSignature(snapshot: GeometryAdapterSnapshot): string {
  return JSON.stringify(structuralSnapshot(snapshot));
}

function objectCount(snapshot: GeometryAdapterSnapshot): number {
  return snapshot.pieces.length + snapshot.towers.length + snapshot.connectors.length + snapshot.actors.length + 1;
}

export function createGeometryParityReport(world: WorldState): GeometryParityReport {
  const adapters: AdapterMode[] = ["2d", "25d", "3d"];
  const snapshots = adapters.map((adapter) => createGeometryAdapterSnapshot(world, adapter));
  const baselineSignature = stableSignature(snapshots[2]);
  const checks = snapshots.map((snapshot) => {
    const signature = stableSignature(snapshot);
    return {
      adapter: snapshot.adapter,
      objectCount: objectCount(snapshot),
      signature,
      matches3D: signature === baselineSignature
    };
  });
  const mismatchedAdapters = checks.filter((check) => !check.matches3D).map((check) => check.adapter);
  return {
    ok: mismatchedAdapters.length === 0,
    baselineSignature,
    checks,
    mismatchedAdapters
  };
}
