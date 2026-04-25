import type { AppSurfaceModule } from "../contracts";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const render = () => {
      const snapshot = context.performance.getSnapshot();
      host.innerHTML = `
        <section class="panel-surface" data-testid="performance-surface">
          <header>
            <span class="panel-tag">performance</span>
            <h1>Painel de performance</h1>
            <p>Mede FPS, frame time, simulacao, render, AI, overlays, entidades, shapes e queries por superficie.</p>
          </header>
          <dl class="panel-stats panel-stats-wide">
            <div><dt>Surface</dt><dd>${snapshot.activeSurface}</dd></div>
            <div><dt>FPS</dt><dd>${snapshot.fps.toFixed(1)}</dd></div>
            <div><dt>Frame</dt><dd>${snapshot.frameMs.toFixed(2)} ms</dd></div>
            <div><dt>Sim</dt><dd>${snapshot.simMs.toFixed(2)} ms</dd></div>
            <div><dt>Render</dt><dd>${snapshot.renderMs.toFixed(2)} ms</dd></div>
            <div><dt>AI</dt><dd>${snapshot.aiMs.toFixed(2)} ms</dd></div>
            <div><dt>Overlay</dt><dd>${snapshot.overlayMs.toFixed(2)} ms</dd></div>
            <div><dt>Entities</dt><dd>${snapshot.entityCount}</dd></div>
            <div><dt>Shapes</dt><dd>${snapshot.shapeCount}</dd></div>
            <div><dt>Queries</dt><dd>${snapshot.queryCount}</dd></div>
            <div><dt>Canvases</dt><dd>${snapshot.activeCanvases}</dd></div>
            <div><dt>Loops</dt><dd>${snapshot.activeLoops}</dd></div>
          </dl>
        </section>
      `;
    };
    const unsubscribe = context.performance.subscribe(() => render());
    render();
    return {
      dispose: () => {
        unsubscribe();
        host.innerHTML = "";
      }
    };
  }
};

export default surfaceModule;
