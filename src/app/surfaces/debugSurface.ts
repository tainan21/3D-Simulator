import type { AppSurfaceModule } from "../contracts";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const snapshot = context.performance.getSnapshot();
    host.innerHTML = `
      <section class="panel-surface" data-testid="debug-surface">
        <header>
          <span class="panel-tag">debug</span>
          <h1>Ferramentas de depuracao</h1>
          <p>Esta superficie centraliza comandos leves e evita overlays pesados na abertura padrao.</p>
        </header>
        <dl class="panel-stats">
          <div><dt>Superficie ativa</dt><dd>${snapshot.activeSurface}</dd></div>
          <div><dt>Canvases ativos</dt><dd>${snapshot.activeCanvases}</dd></div>
          <div><dt>Loops ativos</dt><dd>${snapshot.activeLoops}</dd></div>
          <div><dt>Studio view</dt><dd>${context.stores.studioStore.getState().view}</dd></div>
        </dl>
      </section>
    `;
    return {
      dispose: () => {
        host.innerHTML = "";
      }
    };
  }
};

export default surfaceModule;
