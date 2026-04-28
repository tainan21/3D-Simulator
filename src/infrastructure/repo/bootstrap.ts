// Bootstrap dos repositórios.
//
// Chama ready() em paralelo para hidratar tudo do storage antes da UI montar.
// Roda a migração one-shot de localStorage. Tolerante a falhas (cada repo
// individual loga e segue) — a UI nunca é bloqueada por storage.
//
// Uso (em main.ts):
//   await initializeRepositories();
//   new AppShell(root).mount();

import { mobRepository } from "./mobRepository";
import { archetypeRepository } from "./archetypeRepository";
import { runtimeArtifactRepository } from "./runtimeArtifactRepository";
import { replayRepository } from "./replayRepository";
import { settingsRepository } from "./settingsRepository";
import { migrateFromLocalStorageOnce } from "../migration/fromLocalStorage";

let booted: Promise<void> | undefined;

export function initializeRepositories(): Promise<void> {
  if (!booted) {
    booted = (async () => {
      // Hidratação inicial em paralelo. Nenhuma dessas chamadas toca o
      // hot path; cada uma resolve quando o adapter terminou o list inicial.
      await Promise.all([
        mobRepository().ready(),
        archetypeRepository().ready(),
        runtimeArtifactRepository().ready(),
        replayRepository().ready(),
        settingsRepository().ready(),
      ]);
      // Migração de localStorage → repositories. Idempotente; checa flag.
      try {
        await migrateFromLocalStorageOnce();
      } catch (err) {
        console.warn("[bootstrap] migration skipped:", (err as Error).message);
      }
    })();
  }
  return booted;
}
