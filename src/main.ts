import "./style.css";
import { AppShell } from "./app/shell";
import { initializeRepositories } from "./infrastructure/repo/bootstrap";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Missing #app root");

// Hidrata os repositórios (IndexedDB e/ou /api) e migra qualquer save
// legado do localStorage antes da primeira renderização. UI nunca mais
// toca storage no hot path.
initializeRepositories()
  .catch((err) => {
    console.warn("[main] repository bootstrap failed:", (err as Error).message);
  })
  .finally(() => {
    new AppShell(root).mount();
  });
