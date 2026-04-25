var e={mount(e,t){let n=t.performance.getSnapshot();return e.innerHTML=`
      <section class="panel-surface" data-testid="debug-surface">
        <header>
          <span class="panel-tag">debug</span>
          <h1>Ferramentas de depuracao</h1>
          <p>Esta superficie centraliza comandos leves e evita overlays pesados na abertura padrao.</p>
        </header>
        <dl class="panel-stats">
          <div><dt>Superficie ativa</dt><dd>${n.activeSurface}</dd></div>
          <div><dt>Canvases ativos</dt><dd>${n.activeCanvases}</dd></div>
          <div><dt>Loops ativos</dt><dd>${n.activeLoops}</dd></div>
          <div><dt>Studio view</dt><dd>${t.stores.studioStore.getState().view}</dd></div>
        </dl>
      </section>
    `,{dispose:()=>{e.innerHTML=``}}}};export{e as default};