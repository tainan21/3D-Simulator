import { describe, expect, it } from "vitest";
import { CANONICAL_DIMENSIONS, createFenceTL, createTower, attachTower, pieceCapsule, pieceHorizontalBounds } from "../../src/domain/canonical";
import { createGeometryAdapterSnapshot, canonicalGeometrySignature } from "../../src/kernel/adapterSnapshot";
import { buildBaseGraph } from "../../src/domain/baseGraph";
import { pieceOrientation, towerOrientation } from "../../src/domain/orientation";
import { cellToWorld, worldToCell } from "../../src/kernel/worldUnits";
import { project25D, project2D, project3D } from "../../src/kernel/projections";
import {
  boundsForCapsule,
  circleIntersectsCapsule,
  closestPointOnSegment,
  distanceToCapsule,
  distanceToSegment,
  nearestPointOnCapsule,
  nearestPointOnCircle,
  segmentLength
} from "../../src/kernel/shapes";
import { midpoint, vecAlmostEqual } from "../../src/kernel/vector";
import { createCanonicalValidationWorld } from "../../src/simulation/worldState";

describe("WorldGeometryKernel", () => {
  it("keeps one roundtrippable square world matrix", () => {
    const cell = { i: 3.5, j: -2 };
    expect(worldToCell(cellToWorld(cell))).toEqual(cell);
  });

  it("computes segment length, closest point and distances", () => {
    const segment = { a: { x: 0, z: 0 }, b: { x: 4, z: 0 } };
    expect(segmentLength(segment)).toBe(4);
    expect(closestPointOnSegment({ x: 2, z: 3 }, segment)).toEqual({ x: 2, z: 0 });
    expect(distanceToSegment({ x: 2, z: 3 }, segment)).toBe(3);
    expect(distanceToCapsule({ x: 2, z: 3 }, { segment, radius: 0.5 })).toBe(2.5);
  });

  it("derives capsule bounds from footprint and not height", () => {
    const tl = createFenceTL("tl", { x: 0, z: 0 }, { x: 2, z: 0 });
    const bounds = pieceHorizontalBounds(tl);
    expect(bounds).toEqual({ min: { x: -0.09, z: -0.09 }, max: { x: 2.09, z: 0.09 } });
    expect(boundsForCapsule(pieceCapsule(tl))).toEqual(bounds);
  });

  it("keeps TL footprint, bounds and collider unchanged when a tower is attached", () => {
    const tl = createFenceTL("tl", { x: 0, z: 0 }, { x: 2, z: 0 });
    const tower = createTower("tower", tl);
    const withTower = attachTower(tl, tower.id);

    expect(segmentLength({ a: withTower.a, b: withTower.b })).toBe(segmentLength({ a: tl.a, b: tl.b }));
    expect(pieceHorizontalBounds(withTower)).toEqual(pieceHorizontalBounds(tl));
    expect(pieceCapsule(withTower)).toEqual(pieceCapsule(tl));
    expect(tower.anchor).toEqual({ x: 1, y: CANONICAL_DIMENSIONS.fenceTL.height, z: 0 });
    expect(vecAlmostEqual(midpoint(tl.a, tl.b), { x: tower.anchor.x, z: tower.anchor.z })).toBe(true);
  });

  it("defines canonical forward/right/up and top socket orientation for TL and tower", () => {
    const tl = createFenceTL("tl", { x: 0, z: 0 }, { x: 0, z: 4 });
    const tower = createTower("tower", tl);
    const orientation = pieceOrientation(tl);
    const towerFrame = towerOrientation(tower, tl);

    expect(orientation.pivot.axes.forward).toEqual({ x: 0, y: 0, z: 1 });
    expect(orientation.pivot.axes.right).toEqual({ x: 1, y: 0, z: 0 });
    expect(orientation.pivot.axes.up).toEqual({ x: 0, y: 1, z: 0 });
    expect(orientation.topSocket?.origin).toEqual({ x: 0, y: CANONICAL_DIMENSIONS.fenceTL.height, z: 2 });
    expect(orientation.topSocket?.axes).toEqual(orientation.pivot.axes);
    expect(towerFrame.origin).toEqual(tower.anchor);
    expect(towerFrame.axes).toEqual(orientation.pivot.axes);
  });

  it("uses declared circle and capsule geometry for collision", () => {
    const capsule = { segment: { a: { x: 0, z: 0 }, b: { x: 2, z: 0 } }, radius: 0.09 };
    expect(circleIntersectsCapsule({ center: { x: 1, z: 0.1 }, radius: 0.05 }, capsule)).toBe(true);
    expect(circleIntersectsCapsule({ center: { x: 1, z: 0.4 }, radius: 0.05 }, capsule)).toBe(false);
    expect(nearestPointOnCircle({ x: 2, z: 0 }, { center: { x: 0, z: 0 }, radius: 0.28 })).toEqual({ x: 0.28, z: 0 });
    expect(nearestPointOnCapsule({ x: 1, z: 2 }, capsule)).toEqual({ x: 1, z: 0.09 });
  });

  it("projects 2D, 2.5D and 3D without mutating real dimensions", () => {
    const viewport = { width: 800, height: 600 };
    const camera = { target: { x: 0, z: 0 }, zoom: 1 };
    expect(project2D({ x: 1, z: 1 }, camera, viewport)).toEqual({ x: 448, y: 348 });
    expect(project25D({ x: 1, y: 0, z: 1 }, camera, viewport)).toEqual({ x: 400, y: 348 });
    expect(project25D({ x: 1, y: 1, z: 1 }, camera, viewport)).toEqual({ x: 400, y: 300 });
    expect(project3D({ x: 1, y: 2, z: 3 })).toEqual({ x: 1, y: 2, z: 3 });
  });

  it("keeps adapter snapshots identical across 2D, 2.5D and 3D", () => {
    const world = createCanonicalValidationWorld();
    const twoD = createGeometryAdapterSnapshot(world, "2d");
    const twoFiveD = createGeometryAdapterSnapshot(world, "25d");
    const threeD = createGeometryAdapterSnapshot(world, "3d");

    expect(twoD.pieces).toEqual(twoFiveD.pieces);
    expect(twoD.pieces).toEqual(threeD.pieces);
    expect(twoD.towers).toEqual(twoFiveD.towers);
    expect(twoD.towers).toEqual(threeD.towers);
    expect(twoD.connectors).toEqual(twoFiveD.connectors);
    expect(twoD.connectors).toEqual(threeD.connectors);
    expect(canonicalGeometrySignature(world)).toContain("fence-tl-2");
  });

  it("builds a structural graph from the same canonical base geometry", () => {
    const world = createCanonicalValidationWorld();
    const graph = buildBaseGraph(world.pieces);
    const tlSocket = graph.sockets.find((socket) => socket.kind === "top");
    const gateEdge = graph.edges.find((edge) => edge.kind === "gate");

    expect(graph.nodes.length).toBeGreaterThanOrEqual(8);
    expect(graph.edges.length).toBe(world.pieces.length);
    expect(tlSocket?.position.y).toBe(CANONICAL_DIMENSIONS.fenceTL.height);
    expect(gateEdge?.length).toBe(4);
  });
});
