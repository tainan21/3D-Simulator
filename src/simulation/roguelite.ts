import { createActor, type Actor } from "../domain/canonical";

export type UpgradeId = "playerSpeed" | "towerPulseCooldown" | "baseCoreHp";
export type RogueRunPhase = "combat" | "upgrade" | "defeat";

export type RogueRunState = Readonly<{
  wave: number;
  phase: RogueRunPhase;
  baseCoreHp: number;
  baseCoreMaxHp: number;
  upgrades: Record<UpgradeId, number>;
  pendingChoices: UpgradeId[];
  towerPulseTimer: number;
  playerAttackTimer: number;
}>;

export const UPGRADE_LABELS: Record<UpgradeId, string> = {
  playerSpeed: "Movimento +",
  towerPulseCooldown: "Torre +",
  baseCoreHp: "Base +"
};

export function createRogueRun(): RogueRunState {
  return {
    wave: 1,
    phase: "combat",
    baseCoreHp: 12,
    baseCoreMaxHp: 12,
    upgrades: {
      playerSpeed: 0,
      towerPulseCooldown: 0,
      baseCoreHp: 0
    },
    pendingChoices: [],
    towerPulseTimer: 1.2,
    playerAttackTimer: 0.28
  };
}

export function playerSpeedMultiplier(run: RogueRunState): number {
  return 1 + run.upgrades.playerSpeed * 0.12;
}

export function towerPulseCooldown(run: RogueRunState): number {
  return Math.max(1.1, 2.8 - run.upgrades.towerPulseCooldown * 0.35);
}

export function chooseUpgrade(run: RogueRunState, upgrade: UpgradeId): RogueRunState {
  const upgrades = { ...run.upgrades, [upgrade]: run.upgrades[upgrade] + 1 };
  const hpBonus = upgrade === "baseCoreHp" ? 3 : 0;
  return {
    ...run,
    phase: "combat",
    wave: run.wave + 1,
    baseCoreMaxHp: run.baseCoreMaxHp + hpBonus,
    baseCoreHp: Math.min(run.baseCoreMaxHp + hpBonus, run.baseCoreHp + hpBonus + 2),
    upgrades,
    pendingChoices: [],
    towerPulseTimer: 0.4,
    playerAttackTimer: 0.18
  };
}

export function nextUpgradeChoices(run: RogueRunState): UpgradeId[] {
  const order: UpgradeId[] = ["playerSpeed", "towerPulseCooldown", "baseCoreHp"];
  const offset = run.wave % order.length;
  return [order[offset], order[(offset + 1) % order.length], order[(offset + 2) % order.length]];
}

export function spawnWaveActors(wave: number): Actor[] {
  const enemyCount = Math.min(2 + wave, 6);
  const actors: Actor[] = [];
  for (let i = 0; i < enemyCount; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const kind = wave >= 2 && i % 3 === 2 ? "dwarf" : "enemy";
    actors.push(createActor(`${kind}-w${wave}-${i + 1}`, kind, { x: side * (7.2 + i * 0.22), z: 3.4 - i * 0.55 }));
  }
  actors.push(createActor(`boss-w${wave}`, "boss", { x: 8.6, z: 0.8 }));
  return actors;
}
