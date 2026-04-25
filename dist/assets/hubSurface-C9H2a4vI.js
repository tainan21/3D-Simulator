import{y as e}from"./index-CW9oLWEW.js";var t={mount(t,n){let r=e.filter(e=>e.id!==`hub`).map(e=>`
          <button class="hub-card" data-route="${e.route}">
            <span class="hub-card-role">${e.role}</span>
            <strong>${e.title}</strong>
            <span>${e.description}</span>
          </button>
        `).join(``);t.innerHTML=`
      <section class="hub-surface" data-testid="hub-surface">
        <div class="hub-hero">
          <div>
            <span class="hub-kicker">Entrada leve</span>
            <h1>Escolha a superficie que precisa estar ativa.</h1>
            <p>O boot padrao nao cria renderer, nao liga harness e nao sobe overlays ou diagnosticos pesados.</p>
          </div>
          <dl class="hub-summary">
            <div><dt>Preset</dt><dd>${n.stores.settingsStore.getState().preset}</dd></div>
            <div><dt>Mobile</dt><dd>${n.stores.settingsStore.getState().isMobile?`sim`:`nao`}</dd></div>
            <div><dt>Runtime</dt><dd>${n.stores.runtimeStore.getState().artifact?`ultimo bake pronto`:`sem bake salvo`}</dd></div>
          </dl>
        </div>
        <div class="hub-grid">${r}</div>
      </section>
    `;let i=e=>{let t=e.target.closest(`[data-route]`);t&&n.navigate(t.dataset.route)};return t.addEventListener(`click`,i),n.performance.update({activeSurface:`hub`,fps:0,frameMs:0,simMs:0,renderMs:0,aiMs:0,overlayMs:0,entityCount:0,shapeCount:0,queryCount:0}),{dispose:()=>{t.removeEventListener(`click`,i),t.innerHTML=``},collectDiagnostics:()=>({surfaceId:`hub`,snapshot:n.performance.getSnapshot()})}}};export{t as default};