import type { AppSurfaceModule, PerformancePreset } from "../contracts";

const PRESETS: PerformancePreset[] = ["quality", "balanced", "performance", "debug-heavy"];

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const render = () => {
      const settings = context.stores.settingsStore.getState();
      host.innerHTML = `
        <section class="panel-surface" data-testid="settings-surface">
          <header>
            <span class="panel-tag">configuracoes</span>
            <h1>Presets e preferencias globais</h1>
            <p>O preset afeta pixel ratio, densidade visual, sombras e orcamento de overlays pesados.</p>
          </header>
          <div class="panel-grid">
            ${PRESETS.map((preset) => `<button class="${preset === settings.preset ? "active" : ""}" data-preset="${preset}">${preset}</button>`).join("")}
          </div>
          <dl class="panel-stats">
            <div><dt>Preset atual</dt><dd>${settings.preset}</dd></div>
            <div><dt>Perfil</dt><dd>${settings.isMobile ? "mobile" : "desktop"}</dd></div>
          </dl>
        </section>
      `;
    };

    const onClick = (event: Event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>("[data-preset]");
      if (!button) return;
      context.stores.settingsStore.setState((current) => ({ ...current, preset: button.dataset.preset as PerformancePreset }));
      render();
    };

    render();
    host.addEventListener("click", onClick);
    return {
      dispose: () => {
        host.removeEventListener("click", onClick);
        host.innerHTML = "";
      }
    };
  }
};

export default surfaceModule;
