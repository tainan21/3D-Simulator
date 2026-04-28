import { describe, expect, it } from "vitest";
import { createGeometryAdapterSnapshot } from "../../src/kernel/adapterSnapshot";
import { createGeometryParityReport } from "../../src/studio/geometryParity";
import { applyStudioRecipe, STUDIO_RECIPES } from "../../src/studio/recipes";
import { createStudioSession } from "../../src/studio/session";
import { paintSurfaceTile, withActorVisual } from "../../src/studio/surfaceStudio";
import { ATTACK_PATTERNS, BEHAVIOR_PATTERNS, createCharacterPreviewWorld, DEFAULT_CHARACTER_ARCHETYPE } from "../../src/domain/entityArchetype";
import { createDefaultForgeBuild, finalizeForgeBuild, randomForgeBuild } from "../../src/domain/characterForge";
import { createCreatedMobPackage, createCreatedMobPackageFromArchetype, createdMobRecordFromPackage, forgeBuildToCharacterArchetype, materializeCreatedMobs, parseCreatedMobPackage } from "../../src/domain/createdMob";

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
      expect(world.surfaceTiles?.length, recipe.id).toBeGreaterThan(0);
    }
  });

  it("builds the height recipe with explicit canonical connectors", () => {
    const session = createStudioSession();
    const world = applyStudioRecipe(session.world, "height-spine");

    expect(world.connectors.some((connector) => connector.kind === "ramp")).toBe(true);
    expect(world.connectors.some((connector) => connector.kind === "top-socket-link")).toBe(true);
    expect(world.pieces.some((piece) => piece.heightLayer === 1)).toBe(true);
  });

  it("keeps surface paint and actor visual profiles canonical across adapters", () => {
    const session = createStudioSession();
    const painted = paintSurfaceTile(session.world, { x: 1.2, z: -0.8 }, "rune", 3, 0);
    const styled = withActorVisual(painted, "player", "specter");
    const twoD = createGeometryAdapterSnapshot(styled, "2d");
    const threeD = createGeometryAdapterSnapshot(styled, "3d");

    expect(twoD.surfaceTiles[0]).toMatchObject({ material: "rune", intensity: 3 });
    expect(threeD.actors.find((actor) => actor.id === "player")?.visual.variant).toBe("specter");
    expect(structuralSnapshot(twoD)).toEqual(structuralSnapshot(threeD));
    expect(createGeometryParityReport(styled).ok).toBe(true);
  });

  it("builds character studio previews with attack and behavior catalogs", () => {
    const world = createCharacterPreviewWorld({ ...DEFAULT_CHARACTER_ARCHETYPE, attackId: "cone", behaviorId: "swarm", crowdCount: 100 });
    const report = createGeometryParityReport(world);

    expect(ATTACK_PATTERNS.some((pattern) => pattern.id === "cone")).toBe(true);
    expect(BEHAVIOR_PATTERNS.some((pattern) => pattern.id === "swarm")).toBe(true);
    expect(world.actors).toHaveLength(100);
    expect(world.actors[0].properties.tags).toContain("cone");
    expect(world.actors[0].properties.tags).toContain("swarm");
    expect(world.actors[0].combatProfile).toMatchObject({ attackId: "cone", behaviorId: "swarm", geometry: "cone" });
    expect(createGeometryAdapterSnapshot(world, "3d").actors[0].combatProfile?.attackId).toBe("cone");
    expect(report.ok).toBe(true);
  });

  it("turns Character Forge choices into future-ready gameplay DNA", () => {
    const baseline = createDefaultForgeBuild();
    const mutated = finalizeForgeBuild({
      ...baseline,
      species: "corrupted",
      archetype: "chaos",
      body: "fractured",
      arms: "tentacles",
      aura: "void",
      rarity: "anomaly",
      mutation: 96
    });
    const surprise = randomForgeBuild(777, 88);

    expect(mutated.dnaCode).not.toBe(baseline.dnaCode);
    expect(mutated.stats.chaos).toBeGreaterThan(baseline.stats.chaos);
    expect(mutated.compatibility.twoD).toBeGreaterThan(0);
    expect(mutated.compatibility.twoFiveD).toBeGreaterThan(0);
    expect(mutated.compatibility.threeD).toBeGreaterThan(0);
    expect(mutated.behaviorTags).toContain("chaos");
    expect(mutated.animationTags.some((tag) => tag.includes("pulse"))).toBe(true);
    expect(mutated.motionProfile.primaryVerb).toBeTruthy();
    expect(mutated.motionProfile.simulationSteps.map((step) => step.phase)).toEqual(["start", "windup", "travel", "impact", "recover"]);
    expect(surprise.skills.primary).toBeTruthy();
  });

  it("exports Forge mobs as importable runtime packages", () => {
    const build = finalizeForgeBuild({
      ...createDefaultForgeBuild(),
      name: "AURIX",
      archetype: "boss",
      size: "titan",
      speed: "rush",
      skills: { ...createDefaultForgeBuild().skills, primary: "beam-cannon", dash: "charge-dash" }
    });
    const archetype = forgeBuildToCharacterArchetype(build);
    const mobPackage = createCreatedMobPackage(build);
    const parsed = parseCreatedMobPackage(JSON.stringify(mobPackage));
    const record = createdMobRecordFromPackage(parsed);
    const world = materializeCreatedMobs(createStudioSession().world, [record]);

    expect(archetype.kind).toBe("boss");
    expect(mobPackage.kind).toBe("rogue-created-mob/v1");
    expect(mobPackage.postgres.table).toBe("created_mobs");
    expect(mobPackage.blob.contentType).toBe("application/vnd.rogue.mob+json");
    expect(mobPackage.runtime.motionProfile.primaryVerb).toBe("dash");
    expect(parsed.build.dnaCode).toBe(build.dnaCode);
    expect(world.actors.some((actor) => actor.id.startsWith("created-mob:"))).toBe(true);
    expect(world.actors.find((actor) => actor.id.startsWith("created-mob:"))?.combatProfile?.attackId).toBe("projectile");
    expect(world.actors.find((actor) => actor.id.startsWith("created-mob:"))?.properties.tags).toContain("motion:dash");
  });

  it("exports Character Studio archetypes back into created mob packages", () => {
    const archetype = { ...DEFAULT_CHARACTER_ARCHETYPE, id: "char-test-export", label: "Export Raider", attackId: "dash" as const, behaviorId: "swarm" as const };
    const mobPackage = createCreatedMobPackageFromArchetype(archetype);
    const record = createdMobRecordFromPackage(mobPackage);

    expect(mobPackage.source).toBe("character-studio");
    expect(mobPackage.archetype.id).toBe("char-test-export");
    expect(mobPackage.build.skills.primary).toBe("charge-dash");
    expect(record.packageJson).toContain("rogue-created-mob/v1");
  });
});
