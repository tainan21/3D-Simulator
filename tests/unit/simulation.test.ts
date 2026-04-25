import { describe, expect, it } from "vitest";
import { createActor, createBaseCore, createFence, createGate, pieceHorizontalBounds, pieceSockets, type Actor } from "../../src/domain/canonical";
import { bossBody } from "../../src/domain/boss";
import { findPath } from "../../src/simulation/navigation";
import { computeAiDebug } from "../../src/simulation/ai";
import { actorCanHit, blockingCapsules, canOccupy, computeDebugContacts, moveActor, stepSimulation } from "../../src/simulation/simulation";
import { createRogueRun, chooseUpgrade } from "../../src/simulation/roguelite";
import type { WorldState } from "../../src/simulation/worldState";
import { createStructureMap } from "../../src/simulation/structures";

function testWorld(overrides: Partial<WorldState>): WorldState {
  const pieces = overrides.pieces ?? [];
  const towers = overrides.towers ?? [];
  const baseCore = overrides.baseCore ?? createBaseCore();
  const run = overrides.run ?? createRogueRun();
  return {
    pieces,
    towers,
    connectors: [],
    actors: [],
    baseCore,
    run,
    aiMemory: {},
    worldSeed: 1,
    tick: 0,
    combatLog: [],
    structures: createStructureMap(pieces, towers, baseCore, run.baseCoreMaxHp),
    ...overrides
  };
}

describe("Simulation", () => {
  it("keeps actor body dimensions canonical", () => {
    expect(createActor("p", "player", { x: 0, z: 0 })).toMatchObject({ radius: 0.28, height: 1.7, speed: 2.6 });
    expect(createActor("e", "enemy", { x: 0, z: 0 })).toMatchObject({ radius: 0.24, height: 1.4, speed: 1.6 });
    expect(createActor("b", "boss", { x: 0, z: 0 })).toMatchObject({ radius: 0.75, height: 2.2 });
  });

  it("blocks boss movement through a closed fence", () => {
    const fence = createFence("f", { x: -1, z: 0 }, { x: 1, z: 0 });
    const boss = createActor("boss", "boss", { x: 0, z: 1 });
    const moved = moveActor(boss, { x: 0, z: -0.9 }, [fence]);
    expect(moved.position).toEqual(boss.position);
  });

  it("changes gate blocking when opened", () => {
    const closed = createGate("g", { x: 2, z: -0.5 }, { x: 2, z: 2.5 }, "closed");
    const open = createGate("g", { x: 2, z: -0.5 }, { x: 2, z: 2.5 }, "open");
    const player = createActor("p", "player", { x: 0, z: 0.4 });
    const boss = createActor("boss", "boss", { x: 2.95, z: 1 });

    expect(canOccupy(player, { x: 2, z: 1 }, [closed])).toBe(false);
    expect(canOccupy(player, { x: 2, z: 1 }, [open])).toBe(true);
    expect(moveActor(boss, { x: -0.8, z: 0 }, [closed]).position).toEqual(boss.position);
    expect(moveActor(boss, { x: -0.8, z: 0 }, [open]).position.x).toBeLessThan(boss.position.x);
    expect(blockingCapsules([open])).toHaveLength(2);
    expect(pieceHorizontalBounds(open)).toEqual(pieceHorizontalBounds(closed));
    expect(pieceSockets(open)).toEqual(pieceSockets(closed));
  });

  it("boss attack uses closest distance to canonical attack capsule", () => {
    const boss = createActor("boss", "boss", { x: 0, z: 0 });
    const target = createActor("p", "player", { x: 1.2, z: 0.2 });
    expect(bossBody(boss).attackZone.segment.b).toEqual({ x: 1.6, z: 0 });
    expect(actorCanHit(boss, target)).toBe(true);
  });

  it("steps enemies toward the player through simulation state, not renderer state", () => {
    const player: Actor = createActor("player", "player", { x: 0, z: 0 });
    const enemy: Actor = createActor("enemy", "enemy", { x: 2, z: 0 });
    const world: WorldState = testWorld({ actors: [player, enemy] });
    const next = stepSimulation(world, { move: { x: 0, z: 0 } }, 0.5);
    expect(next.actors.find((actor) => actor.id === "enemy")?.position.x).toBeLessThan(2);
  });

  it("makes enemies choose structural flow when the player is not visible", () => {
    const player = createActor("player", "player", { x: 0, z: 0 });
    const enemy = createActor("enemy", "enemy", { x: 6, z: 0 });
    const world: WorldState = testWorld({
      pieces: [
        createFence("top", { x: -4, z: -4 }, { x: 4, z: -4 }),
        createFence("bottom", { x: -4, z: 4 }, { x: 4, z: 4 }),
        createFence("left", { x: -4, z: -4 }, { x: -4, z: 4 }),
        createFence("right-north", { x: 4, z: -4 }, { x: 4, z: -2 }),
        createGate("gate", { x: 4, z: -2 }, { x: 4, z: 2 }, "closed"),
        createFence("right-south", { x: 4, z: 2 }, { x: 4, z: 4 })
      ],
      actors: [player, enemy],
      baseCore: createBaseCore({ x: 0, z: 0 })
    });

    const debug = computeAiDebug(world).find((entry) => entry.actorId === "enemy");
    expect(debug?.objective).toBe("closed-gate");
    expect(debug?.targetId).toBe("gate");
  });

  it("makes the boss pressure a closed gate and switch to the core when the gate opens", () => {
    const boss = createActor("boss", "boss", { x: 6, z: 0 });
    const player = createActor("player", "player", { x: -3, z: 3 });
    const closedWorld: WorldState = testWorld({
      pieces: [
        createFence("top", { x: -4, z: -4 }, { x: 4, z: -4 }),
        createFence("bottom", { x: -4, z: 4 }, { x: 4, z: 4 }),
        createFence("left", { x: -4, z: -4 }, { x: -4, z: 4 }),
        createFence("right-north", { x: 4, z: -4 }, { x: 4, z: -2 }),
        createGate("gate", { x: 4, z: -2 }, { x: 4, z: 2 }, "closed"),
        createFence("right-south", { x: 4, z: 2 }, { x: 4, z: 4 })
      ],
      actors: [player, boss],
      baseCore: createBaseCore({ x: 0, z: 0 })
    });
    const openWorld: WorldState = {
      ...closedWorld,
      pieces: [
        createFence("top", { x: -4, z: -4 }, { x: 4, z: -4 }),
        createFence("bottom", { x: -4, z: 4 }, { x: 4, z: 4 }),
        createFence("left", { x: -4, z: -4 }, { x: -4, z: 4 }),
        createFence("right-north", { x: 4, z: -4 }, { x: 4, z: -2 }),
        createGate("gate", { x: 4, z: -2 }, { x: 4, z: 2 }, "open"),
        createFence("right-south", { x: 4, z: 2 }, { x: 4, z: 4 })
      ]
    };

    expect(computeAiDebug(closedWorld).find((entry) => entry.actorId === "boss")?.objective).toBe("closed-gate");
    expect(computeAiDebug(openWorld).find((entry) => entry.actorId === "boss")?.objective).toBe("base-core");
  });

  it("finds a path for the boss through an open gate and refuses the closed gate corridor", () => {
    const pieces = [
      createFence("top", { x: -4, z: -4 }, { x: 4, z: -4 }),
      createFence("bottom", { x: -4, z: 4 }, { x: 4, z: 4 }),
      createFence("left", { x: -4, z: -4 }, { x: -4, z: 4 }),
      createFence("right-north", { x: 4, z: -4 }, { x: 4, z: -2 }),
      createGate("gate", { x: 4, z: -2 }, { x: 4, z: 2 }, "closed"),
      createFence("right-south", { x: 4, z: 2 }, { x: 4, z: 4 })
    ];
    const boss = createActor("boss", "boss", { x: 6, z: 0 });
    const goal = { x: 0, z: 0 };

    const closed = findPath(boss, boss.position, goal, pieces, canOccupy);
    const open = findPath(
      boss,
      boss.position,
      goal,
      [pieces[0], pieces[1], pieces[2], pieces[3], createGate("gate", { x: 4, z: -2 }, { x: 4, z: 2 }, "open"), pieces[5]],
      canOccupy
    );

    expect(closed.reached).toBe(false);
    expect(open.reached).toBe(true);
    expect(open.waypoints.some((waypoint) => Math.abs(waypoint.x - 4) < 0.7 && Math.abs(waypoint.z) < 1.4)).toBe(true);
  });

  it("lets the boss pressure the base only when the gate is open", () => {
    const player = createActor("player", "player", { x: -3, z: 3 });
    const boss = createActor("boss", "boss", { x: 6, z: 0 });
    const baseCore = createBaseCore({ x: 0, z: 0 });
    const closedPieces = [
      createFence("top", { x: -4, z: -4 }, { x: 4, z: -4 }),
      createFence("bottom", { x: -4, z: 4 }, { x: 4, z: 4 }),
      createFence("left", { x: -4, z: -4 }, { x: -4, z: 4 }),
      createFence("right-north", { x: 4, z: -4 }, { x: 4, z: -2 }),
      createGate("gate", { x: 4, z: -2 }, { x: 4, z: 2 }, "closed"),
      createFence("right-south", { x: 4, z: 2 }, { x: 4, z: 4 })
    ];
    const openPieces = [
      createFence("top", { x: -4, z: -4 }, { x: 4, z: -4 }),
      createFence("bottom", { x: -4, z: 4 }, { x: 4, z: 4 }),
      createFence("left", { x: -4, z: -4 }, { x: -4, z: 4 }),
      createFence("right-north", { x: 4, z: -4 }, { x: 4, z: -2 }),
      createGate("gate", { x: 4, z: -2 }, { x: 4, z: 2 }, "open"),
      createFence("right-south", { x: 4, z: 2 }, { x: 4, z: 4 })
    ];

    let closedWorld: WorldState = testWorld({ pieces: closedPieces, actors: [player, boss], baseCore });
    let openWorld: WorldState = testWorld({ pieces: openPieces, actors: [player, boss], baseCore });

    for (let index = 0; index < 18; index += 1) {
      closedWorld = stepSimulation(closedWorld, { move: { x: 0, z: 0 } }, 0.35);
      openWorld = stepSimulation(openWorld, { move: { x: 0, z: 0 } }, 0.35);
    }

    const closedBoss = closedWorld.actors.find((actor) => actor.id === "boss");
    const openBoss = openWorld.actors.find((actor) => actor.id === "boss");

    expect(closedBoss?.position.x).toBeGreaterThan(4.4);
    expect(openBoss?.position.x).toBeLessThan(3.2);
  });

  it("debug contacts expose nearest point on canonical shape, not visual center", () => {
    const player = createActor("player", "player", { x: 0, z: 0 });
    const enemy = createActor("enemy", "enemy", { x: 2, z: 0 });
    const boss = createActor("boss", "boss", { x: 3, z: 0.8 });
    const world: WorldState = testWorld({ actors: [player, enemy, boss], baseCore: createBaseCore({ x: 0, z: 0.8 }) });
    const contacts = computeDebugContacts(world);

    const enemyContact = contacts.find((contact) => contact.actorId === "enemy")?.point;
    const bossContact = contacts.find((contact) => contact.actorId === "boss")?.point;
    expect(enemyContact).toEqual({ x: 0.28, z: 0 });
    expect(bossContact?.x).toBeCloseTo(0.42);
    expect(bossContact?.z).toBeCloseTo(0.8);
  });

  it("roguelite upgrades never alter canonical player collider", () => {
    const run = createRogueRun();
    const upgraded = chooseUpgrade({ ...run, phase: "upgrade", pendingChoices: ["playerSpeed"] }, "playerSpeed");
    const player = createActor("player", "player", { x: 0, z: 0 });

    expect(upgraded.upgrades.playerSpeed).toBe(1);
    expect(player).toMatchObject({ radius: 0.28, height: 1.7 });
  });
});
