import { SURFACE_META } from "../routes";
import type { AppSurfaceModule } from "../contracts";

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
            <span class="hub-kicker">Entrada leve</span>
            <h1>Escolha a superficie que precisa estar ativa.</h1>
            <p>O boot padrao nao cria renderer, nao liga harness e nao sobe overlays ou diagnosticos pesados.</p>
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
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-route]");
      if (!target) return;
      context.navigate(target.dataset.route as typeof context.route);
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
