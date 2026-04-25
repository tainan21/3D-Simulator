var e=[`quality`,`balanced`,`performance`,`debug-heavy`],t={mount(t,n){let r=()=>{let r=n.stores.settingsStore.getState();t.innerHTML=`
        <section class="panel-surface" data-testid="settings-surface">
          <header>
            <span class="panel-tag">configuracoes</span>
            <h1>Presets e preferencias globais</h1>
            <p>O preset afeta pixel ratio, densidade visual, sombras e orcamento de overlays pesados.</p>
          </header>
          <div class="panel-grid">
            ${e.map(e=>`<button class="${e===r.preset?`active`:``}" data-preset="${e}">${e}</button>`).join(``)}
          </div>
          <dl class="panel-stats">
            <div><dt>Preset atual</dt><dd>${r.preset}</dd></div>
            <div><dt>Perfil</dt><dd>${r.isMobile?`mobile`:`desktop`}</dd></div>
          </dl>
        </section>
      `},i=e=>{let t=e.target.closest(`[data-preset]`);t&&(n.stores.settingsStore.setState(e=>({...e,preset:t.dataset.preset})),r())};return r(),t.addEventListener(`click`,i),{dispose:()=>{t.removeEventListener(`click`,i),t.innerHTML=``}}}};export{t as default};