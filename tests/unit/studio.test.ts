import { describe, expect, it } from "vitest";
import { createGeometryAdapterSnapshot } from "../../src/kernel/adapterSnapshot";
import { createGeometryParityReport } from "../../src/studio/geometryParity";
import { applyStudioRecipe, STUDIO_RECIPES } from "../../src/studio/recipes";
import { createStudioSession } from "../../src/studio/session";

function structuralSnapshot(adapter: ReturnType<typeof createGeometryAdapterSnapshot>) {
  const { adapter: _adapter, ...structural } = adapter;
  return structural;
}

describe("Studio canonical features", () => {
  it("reports geometry parity across 2D, 2.5D and 3D adapters", () => {
    const session = createStudioSession();
    const report = createGeometryParityReport(session.world);

    expect(report.ok).toBe(true);
    expect(report.checks.map((check) => check.adapter)).toEqual(["2d", "25d", "3d"]);
    expect(report.checks.every((check) => check.matches3D)).toBe(true);
  });

  it("keeps recipe-built worlds adapter-equivalent", () => {
    const session = createStudioSession();

    for (const recipe of STUDIO_RECIPES) {
      const world = applyStudioRecipe(session.world, recipe.id);
      const twoD = createGeometryAdapterSnapshot(world, "2d");
      const twoFiveD = createGeometryAdapterSnapshot(world, "25d");
      const threeD = createGeometryAdapterSnapshot(world, "3d");

      expect(structuralSnapshot(twoD), recipe.id).toEqual(structuralSnapshot(twoFiveD));
      expect(structuralSnapshot(threeD), recipe.id).toEqual(structuralSnapshot(twoD));
      expect(createGeometryParityReport(world).ok, recipe.id).toBe(true);
      expect(world.pieces.length, recipe.id).toBeGreaterThan(0);
    }
  });

  it("builds the height recipe with explicit canonical connectors", () => {
    const session = createStudioSession();
    const world = applyStudioRecipe(session.world, "height-spine");

    expect(world.connectors.some((connector) => connector.kind === "ramp")).toBe(true);
    expect(world.connectors.some((connector) => connector.kind === "top-socket-link")).toBe(true);
    expect(world.pieces.some((piece) => piece.heightLayer === 1)).toBe(true);
  });
});
