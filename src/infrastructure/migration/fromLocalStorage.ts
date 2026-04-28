// Migração one-shot de localStorage → Repositories.
//
// Roda no boot. Idempotente — checa flag em settingsRepository. Não apaga o
// localStorage atual: mantemos como fallback de leitura em caso de erro.
//
// Chaves migradas:
//   rogue-shell-settings           → settings:preset, settings:isMobile
//   rogue-shell-characters         → archetype, library (archetypeRepository)
//                                    + selectedId/view/camera3D em settings:characters
//   rogue-shell-runtime-artifact   → runtimeArtifactRepository
//   rogue-shell-replays            → replayRepository
//   rogue-created-mob-cache-v1     → mobRepository
//   rogue-shell-studio-ui          → settings:rogue-shell-studio-ui (UI prefs)
//   rogue-character-forge          → settings:rogue-character-forge (Forge state)

import { mobRepository } from "../repo/mobRepository";
import { archetypeRepository } from "../repo/archetypeRepository";
import { runtimeArtifactRepository } from "../repo/runtimeArtifactRepository";
import { replayRepository } from "../repo/replayRepository";
import { settingsRepository } from "../repo/settingsRepository";
import type { CharacterArchetype } from "../../domain/entityArchetype";
import type { RuntimeBakeArtifact } from "../../runtime/materialize";
import type { ReplayRecord } from "../../app/contracts";
import type { CreatedMobRecord } from "../../domain/createdMob";

const FLAG_KEY = "migration:fromLocalStorageV1";

const LEGACY_KEYS = {
  settings: "rogue-shell-settings",
  characters: "rogue-shell-characters",
  runtimeArtifact: "rogue-shell-runtime-artifact",
  replayRecords: "rogue-shell-replays",
  mobCache: "rogue-created-mob-cache-v1",
  // Lidos pelos controllers (Studio/Forge) e agora persistidos via settingsRepo.
  studioUi: "rogue-shell-studio-ui",
  forgeState: "rogue-character-forge",
} as const;

function readJson<T>(key: string): T | undefined {
  try {
    if (typeof window === "undefined" || !window.localStorage) return undefined;
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

interface LegacyMobCache {
  records?: CreatedMobRecord[];
}

interface LegacyCharactersState {
  archetype?: CharacterArchetype;
  library?: CharacterArchetype[];
  selectedId?: string;
  view?: string;
  camera3D?: unknown;
}

export async function migrateFromLocalStorageOnce(): Promise<void> {
  if (typeof window === "undefined" || !window.localStorage) return;

  const settings = settingsRepository();
  const already = settings.get(FLAG_KEY);
  if (already?.value === true) return;

  let migrated = 0;

  // 1) Settings (preset, isMobile)
  const legacySettings = readJson<Record<string, unknown>>(LEGACY_KEYS.settings);
  if (legacySettings) {
    settings.upsert({ id: "settings:preset", value: legacySettings.preset ?? "balanced" });
    settings.upsert({ id: "settings:isMobile", value: legacySettings.isMobile ?? false });
    migrated += 1;
  }

  // 2) Characters → archetypes + UI prefs
  const legacyChars = readJson<LegacyCharactersState>(LEGACY_KEYS.characters);
  if (legacyChars) {
    const archetypes = archetypeRepository();
    if (legacyChars.archetype) archetypes.upsert(legacyChars.archetype);
    for (const arch of legacyChars.library ?? []) archetypes.upsert(arch);
    settings.upsert({
      id: "characters:ui",
      value: {
        selectedId: legacyChars.selectedId,
        view: legacyChars.view,
        camera3D: legacyChars.camera3D,
        archetypeId: legacyChars.archetype?.id,
      },
    });
    migrated += 1;
  }

  // 3) Runtime artifact
  const legacyArtifact = readJson<RuntimeBakeArtifact>(LEGACY_KEYS.runtimeArtifact);
  if (legacyArtifact && legacyArtifact.id && legacyArtifact.worldJson) {
    runtimeArtifactRepository().upsert(legacyArtifact);
    migrated += 1;
  }

  // 4) Replays
  const legacyReplays = readJson<ReplayRecord[]>(LEGACY_KEYS.replayRecords) ?? [];
  for (const record of legacyReplays) {
    if (record?.id && record.session) replayRepository().upsert(record);
  }
  if (legacyReplays.length) migrated += 1;

  // 5) Created mob cache
  const legacyMobs = readJson<LegacyMobCache>(LEGACY_KEYS.mobCache);
  for (const record of legacyMobs?.records ?? []) {
    if (record?.id && record.build && record.archetype) mobRepository().upsert(record);
  }
  if (legacyMobs?.records?.length) migrated += 1;

  // 6) Studio UI prefs (painéis, themes, presets de view, command palette)
  const legacyStudioUi = readJson<Record<string, unknown>>(LEGACY_KEYS.studioUi);
  if (legacyStudioUi) {
    settings.upsert({ id: LEGACY_KEYS.studioUi, value: legacyStudioUi });
    migrated += 1;
  }

  // 7) Forge state (build atual, favorites, compare, animation, copiedCode)
  const legacyForge = readJson<unknown>(LEGACY_KEYS.forgeState);
  if (legacyForge) {
    settings.upsert({ id: LEGACY_KEYS.forgeState, value: legacyForge });
    migrated += 1;
  }

  // Marca como migrado.
  settings.upsert({ id: FLAG_KEY, value: true });

  if (migrated > 0) {
    console.info(`[migration] localStorage → repositories: ${migrated} categoria(s) migrada(s).`);
  }
}
