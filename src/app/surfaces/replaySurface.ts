import type { AppSurfaceModule } from "../contracts";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const records = context.stores.replayStore.getState().records;
    host.innerHTML = `
      <section class="panel-surface" data-testid="replay-surface">
        <header>
          <span class="panel-tag">replay</span>
          <h1>Replay dedicado</h1>
          <p>Gravacoes deixam de ficar soterradas no Studio e passam a ter superficie propria.</p>
        </header>
        <dl class="panel-stats">
          <div><dt>Gravacoes</dt><dd>${records.length}</dd></div>
          <div><dt>Ultima fonte</dt><dd>${records.at(-1)?.source ?? "-"}</dd></div>
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
