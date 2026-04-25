var e={mount(e,t){let n=()=>{let n=t.performance.getSnapshot();e.innerHTML=`
        <section class="panel-surface" data-testid="performance-surface">
          <header>
            <span class="panel-tag">performance</span>
            <h1>Painel de performance</h1>
            <p>Mede FPS, frame time, simulacao, render, AI, overlays, entidades, shapes e queries por superficie.</p>
          </header>
          <dl class="panel-stats panel-stats-wide">
            <div><dt>Surface</dt><dd>${n.activeSurface}</dd></div>
            <div><dt>FPS</dt><dd>${n.fps.toFixed(1)}</dd></div>
            <div><dt>Frame</dt><dd>${n.frameMs.toFixed(2)} ms</dd></div>
            <div><dt>Sim</dt><dd>${n.simMs.toFixed(2)} ms</dd></div>
            <div><dt>Render</dt><dd>${n.renderMs.toFixed(2)} ms</dd></div>
            <div><dt>AI</dt><dd>${n.aiMs.toFixed(2)} ms</dd></div>
            <div><dt>Overlay</dt><dd>${n.overlayMs.toFixed(2)} ms</dd></div>
            <div><dt>Entities</dt><dd>${n.entityCount}</dd></div>
            <div><dt>Shapes</dt><dd>${n.shapeCount}</dd></div>
            <div><dt>Queries</dt><dd>${n.queryCount}</dd></div>
            <div><dt>Canvases</dt><dd>${n.activeCanvases}</dd></div>
            <div><dt>Loops</dt><dd>${n.activeLoops}</dd></div>
          </dl>
        </section>
      `},r=t.performance.subscribe(()=>n());return n(),{dispose:()=>{r(),e.innerHTML=``}}}};export{e as default};