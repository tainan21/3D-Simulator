var e={mount(e,t){let n=t.stores.replayStore.getState().records;return e.innerHTML=`
      <section class="panel-surface" data-testid="replay-surface">
        <header>
          <span class="panel-tag">replay</span>
          <h1>Replay dedicado</h1>
          <p>Gravacoes deixam de ficar soterradas no Studio e passam a ter superficie propria.</p>
        </header>
        <dl class="panel-stats">
          <div><dt>Gravacoes</dt><dd>${n.length}</dd></div>
          <div><dt>Ultima fonte</dt><dd>${n.at(-1)?.source??`-`}</dd></div>
        </dl>
      </section>
    `,{dispose:()=>{e.innerHTML=``}}}};export{e as default};