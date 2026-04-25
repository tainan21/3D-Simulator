import type { ReplayCommand, ReplayFrame, ReplaySession, ReplayState } from "../domain/analysis";
import { canonicalGeometrySignature } from "../kernel/adapterSnapshot";
import type { InputState } from "./simulation";
import { cloneWorld, type WorldState } from "./worldState";

export const FIXED_TIMESTEP = 1 / 12;

export function createReplayState(): ReplayState {
  return {
    status: "idle",
    frame: 0,
    totalFrames: 0,
    seed: 0
  };
}

export function startReplayRecording(world: WorldState): ReplaySession {
  return {
    seed: world.worldSeed,
    status: "recording",
    frame: 0,
    initialWorldJson: JSON.stringify(cloneWorld(world)),
    frames: []
  };
}

export function runtimeReplaySignature(world: WorldState): string {
  return JSON.stringify({
    canonical: canonicalGeometrySignature(world),
    tick: world.tick,
    run: {
      phase: world.run.phase,
      wave: world.run.wave,
      baseCoreHp: Number(world.run.baseCoreHp.toFixed(4)),
      towerPulseTimer: Number(world.run.towerPulseTimer.toFixed(4)),
      playerAttackTimer: Number(world.run.playerAttackTimer.toFixed(4))
    },
    actors: world.actors.map((actor) => ({
      id: actor.id,
      kind: actor.kind,
      hp: Number(actor.hp.toFixed(4)),
      position: {
        x: Number(actor.position.x.toFixed(4)),
        z: Number(actor.position.z.toFixed(4))
      },
      baseY: Number(actor.baseY.toFixed(4)),
      heightLayer: actor.heightLayer
    })),
    structures: Object.values(world.structures)
      .map((state) => ({
        id: state.id,
        hp: Number(state.hp.toFixed(4)),
        pressure: Number(state.pressure.toFixed(4)),
        integrity: state.integrity
      }))
      .sort((a, b) => a.id.localeCompare(b.id))
  });
}

export function pushReplayFrame(
  session: ReplaySession,
  frame: number,
  input: InputState,
  commands: ReplayCommand[],
  world: WorldState
): ReplaySession {
  const storedFrame: ReplayFrame = {
    frame,
    input: {
      move: input.move,
      attack: input.attack
    },
    commands,
    signature: runtimeReplaySignature(world)
  };
  return {
    ...session,
    frame,
    frames: [...session.frames, storedFrame]
  };
}

export function replayStateFromSession(session?: ReplaySession): ReplayState {
  if (!session) return createReplayState();
  return {
    status: session.status,
    frame: session.frame,
    totalFrames: session.frames.length,
    seed: session.seed,
    divergence: session.divergence
  };
}

export function serializeReplayDivergence(session?: ReplaySession): string {
  if (!session?.divergence) return "";
  return JSON.stringify(
    {
      seed: session.seed,
      frame: session.frame,
      divergence: session.divergence
    },
    null,
    2
  );
}

export function resetReplayToInitialWorld(session: ReplaySession): WorldState {
  return JSON.parse(session.initialWorldJson) as WorldState;
}
