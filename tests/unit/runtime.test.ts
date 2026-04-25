import { describe, expect, it } from "vitest";
import { createBaseCore, createFence, createGate, createActor } from "../../src/domain/canonical";
import { canonicalGeometrySignature } from "../../src/kernel/adapterSnapshot";
import { createRuntimeBakeArtifact, materializeRuntimeSession } from "../../src/runtime/materialize";
import { createReplayState, pushReplayFrame, runtimeReplaySignature, startReplayRecording } from "../../src/simulation/replay";
import { DEFAULT_AI_POLICY } from "../../src/simulation/aiPolicy";
import { computeWorldAnalysis } from "../../src/simulation/analysis";
import { stepSimulation } from "../../src/simulation/simulation";
import { createRogueRun } from "../../src/simulation/roguelite";
import type { WorldState } from "../../src/simulation/worldState";
import { createStructureMap } from "../../src/simulation/structures";
import { createSiegeLabWorld } from "../../src/simulation/worldState";

function runtimeWorld(): WorldState {
  const pieces = [
    createFence("top", { x: -4, z: -4 }, { x: 4, z: -4 }),
    createFence("bottom", { x: -4, z: 4 }, { x: 4, z: 4 }),
    createFence("left", { x: -4, z: -4 }, { x: -4, z: 4 }),
    createFence("right-north", { x: 4, z: -4 }, { x: 4, z: -2 }),
    createGate("gate", { x: 4, z: -2 }, { x: 4, z: 2 }, "closed"),
    createFence("right-south", { x: 4, z: 2 }, { x: 4, z: 4 })
  ];
  const baseCore = createBaseCore({ x: 0, z: 0 });
  const run = createRogueRun();
  return {
    pieces,
    towers: [],
    connectors: [],
    actors: [
      createActor("player", "player", { x: -3, z: 3 }),
      createActor("boss", "boss", { x: 6, z: 0 }),
      createActor("enemy", "enemy", { x: 6, z: 1.4 })
    ],
    baseCore,
    run,
    aiMemory: {},
    worldSeed: 501,
    tick: 0,
    combatLog: [],
    structures: createStructureMap(pieces, [], baseCore, run.baseCoreMaxHp),
    phaseScenarioId: "siege-lab"
  };
}

describe("Runtime materialization", () => {
  it("bakes Studio/scenario geometry into a playable runtime session without changing canonical scale", () => {
    const source = createSiegeLabWorld(99);
    const artifact = createRuntimeBakeArtifact(source, "scenario", "Vertical Slice", source.tick, source.phaseScenarioId);
    const runtime = materializeRuntimeSession(artifact);

    expect(runtime.artifact.canonicalSignature).toBe(canonicalGeometrySignature(runtime.world));
    expect(runtime.world.runtime?.artifactId).toBe(artifact.id);
    expect(runtime.world.runtime?.bakedFromScenarioId).toBe("siege-lab");
  });

  it("applies structural damage on contact and eventually opens the route by destruction", () => {
    let world = runtimeWorld();

    for (let index = 0; index < 48; index += 1) {
      world = stepSimulation(world, { move: { x: 0, z: 0 } }, 0.35, DEFAULT_AI_POLICY);
    }

    const gateState = world.structures.gate;
    expect(gateState.hp).toBeLessThan(gateState.maxHp);
    expect(["pressured", "damaged", "destroyed"]).toContain(gateState.integrity);
    if (gateState.integrity === "destroyed") {
      expect(world.combatLog.some((entry) => entry.targetId === "gate" && entry.kind === "destroyed")).toBe(true);
    }
  });

  it("records replay signatures with structural state, not just frozen geometry", () => {
    const world = runtimeWorld();
    const session = startReplayRecording(world);
    const nextWorld = stepSimulation(world, { move: { x: 0, z: 0 }, attack: true }, 0.35, DEFAULT_AI_POLICY);
    const stored = pushReplayFrame(session, nextWorld.tick, { move: { x: 0, z: 0 }, attack: true }, [], nextWorld);

    expect(stored.frames[0].input).toEqual({ move: { x: 0, z: 0 }, attack: true });
    expect(stored.frames[0].signature).toBe(runtimeReplaySignature(nextWorld));
    expect(stored.frames[0].signature).not.toBe(canonicalGeometrySignature(nextWorld));
  });

  it("keeps runtime analysis aligned with the baked world state", () => {
    const source = runtimeWorld();
    const artifact = createRuntimeBakeArtifact(source, "scenario", "Runtime QA", 0, "siege-lab");
    const runtime = materializeRuntimeSession(artifact);
    const replayState = createReplayState();
    const analysis = computeWorldAnalysis(runtime.world, replayState, DEFAULT_AI_POLICY);

    expect(runtime.analysis.validationIssues.length).toBe(analysis.validationIssues.length);
    expect(runtime.analysis.aiDebug.map((entry) => entry.objective)).toEqual(analysis.aiDebug.map((entry) => entry.objective));
  });
});
