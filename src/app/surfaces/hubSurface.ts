import { SURFACE_META } from "../routes";
import type { AppSurfaceModule } from "../contracts";
import { createRuntimeBakeArtifact, materializeRuntimeSession } from "../../runtime/materialize";
import { loadScenarioPreset } from "../../studio/scenarios";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const cards = SURFACE_META.filter((entry) => entry.id !== "hub")
      .map(
        (entry) => `
          <button class="hub-card" data-route="${entry.route}">
            <span class="hub-card-role">${entry.role}</span>
            <strong>${entry.title}</strong>
            <span>${entry.description}</span>
          </button>
        `
      )
      .join("");

    host.innerHTML = `
      <section class="hub-surface" data-testid="hub-surface">
        <div class="hub-hero">
          <div>
            <span class="hub-kicker">Universo matematico v1</span>
            <h1>Jogue, construa e valide o mesmo mundo em 2D, 2.5D e 3D.</h1>
            <p>A tela inicial materializa um roguelite simples sem separar regra de render: Studio, Fases e Game leem a mesma geometria canonica.</p>
            <div class="hub-actions">
              <button class="primary-action" data-action="start-game">1 - Jogar roguelite</button>
              <button data-route="/studio">Abrir Studio</button>
              <button data-route="/phases">Universo/Fases</button>
            </div>
          </div>
          <dl class="hub-summary">
            <div><dt>Preset</dt><dd>${context.stores.settingsStore.getState().preset}</dd></div>
            <div><dt>Mobile</dt><dd>${context.stores.settingsStore.getState().isMobile ? "sim" : "nao"}</dd></div>
            <div><dt>Runtime</dt><dd>${context.stores.runtimeStore.getState().artifact ? "ultimo bake pronto" : "sem bake salvo"}</dd></div>
          </dl>
        </div>
        <div class="hub-grid">${cards}</div>
      </section>
    `;
    const onClick = (event: Event) => {
      const action = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
      if (action?.dataset.action === "start-game") {
        const world = loadScenarioPreset("siege-lab", 101);
        const artifact = createRuntimeBakeArtifact(world, "scenario", "Roguelite v1 - cerco inicial", 0, "siege-lab");
        context.stores.runtimeStore.setState((current) => ({
          ...current,
          artifact,
          session: materializeRuntimeSession(artifact),
          replaySession: undefined
        }));
        context.navigate("/runtime");
        return;
      }
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-route]");
      if (target) context.navigate(target.dataset.route as typeof context.route);
    };
    host.addEventListener("click", onClick);
    context.performance.update({
      activeSurface: "hub",
      fps: 0,
      frameMs: 0,
      simMs: 0,
      renderMs: 0,
      aiMs: 0,
      overlayMs: 0,
      entityCount: 0,
      shapeCount: 0,
      queryCount: 0
    });
    return {
      dispose: () => {
        host.removeEventListener("click", onClick);
        host.innerHTML = "";
      },
      collectDiagnostics: () => ({
        surfaceId: "hub",
        snapshot: context.performance.getSnapshot()
      })
    };
  }
};

export default surfaceModule;
