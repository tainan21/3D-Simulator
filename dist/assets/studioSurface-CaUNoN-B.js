import{D as e,G as t,H as n,O as r,R as i,V as a,W as o,f as s,o as c,y as l,z as u}from"./analysis-Cl-KssE7.js";import{i as d,r as f,t as p}from"./scenarios-DpvkYtCk.js";import{a as m,c as h,d as g,f as _,i as v,l as y,n as b,o as x,p as S,r as C,s as w,t as T,u as E}from"./index-CW9oLWEW.js";import{a as D,i as O,n as k,r as A,t as j}from"./common-Cxr3-2RJ.js";function M(e){return`${e.x.toFixed(4)}:${e.z.toFixed(4)}`}function N(e){return e.kind===`fence-tl`?2.3:e.kind===`gate`?e.state===`closed`?1.4:.6:1}function P(e){let t=new Map,r=[];for(let n of e){let e=M(n.a),i=M(n.b);t.has(e)||t.set(e,{id:`node-${t.size+1}`,position:n.a}),t.has(i)||t.set(i,{id:`node-${t.size+1}`,position:n.b}),r.push(...u(n).map(e=>({id:e.id,pieceId:n.id,kind:e.kind,position:e.position})))}let i=e.map(e=>({id:`edge-${e.id}`,pieceId:e.id,kind:e.kind,from:t.get(M(e.a)).id,to:t.get(M(e.b)).id,length:n(e.a,e.b),structuralWeight:N(e)}));return{nodes:[...t.values()],edges:i,sockets:r}}var F=[`fence`,`fence-tl`,`gate`,`tower`,`erase`],I=[`2d`,`25d`,`3d`],L=[`tactical`,`inspection`,`first-person`],R=[`pressure`,`coverage`,`chokepoint`,`vulnerability`,`dead-zone`,`flow`],z=class{cleanups=j();keyboard=k();renderer;rendererCanvasCleanup;raf=0;paused=!1;lastTick=performance.now();accumulator=0;hudStamp=0;frameMs=0;simMs=0;commandQueue=[];isDraggingCamera=!1;lastPointer;constructor(e,t){this.host=e,this.context=t}mount(){let e=this.context.performance.trackLoop(`studio:loop`);return this.cleanups.add(e),this.keyboard.attach(this.cleanups),this.renderFrame(),this.attachEvents(),this.mountRenderer(),this.updateHud(!0),this.raf=requestAnimationFrame(this.loop),this.cleanups.add(()=>cancelAnimationFrame(this.raf)),{dispose:()=>this.dispose(),pause:()=>{this.paused=!0,this.renderer?.pause?.()},resume:()=>{this.paused=!1,this.renderer?.resume?.()},collectDiagnostics:()=>({surfaceId:`studio`,snapshot:this.context.performance.getSnapshot()})}}get state(){return this.context.stores.studioStore.getState()}setState(e){return this.context.stores.studioStore.setState(e)}dispose(){this.rendererCanvasCleanup?.(),this.renderer?.destroy(),this.cleanups.dispose(),this.host.innerHTML=``}provider(){return{getWorld:()=>this.state.session.world,getDebugOptions:()=>this.state.debugOverlays,getDebugContacts:()=>this.state.session.analysis.debugContacts,getAiDebug:()=>this.state.session.analysis.aiDebug,getValidationIssues:()=>this.state.session.analysis.validationIssues,getInfluenceField:()=>this.state.session.analysis.influenceField,getReplayState:()=>this.state.session.replay.state}}renderFrame(){this.host.innerHTML=`
      <section class="workspace-surface studio-surface" data-testid="studio-surface">
        <header class="workspace-header">
          <div>
            <span class="panel-tag">edicao</span>
            <h1>Studio</h1>
            <p>Editor forte com vista unica por vez, timeline, workbench de AI e bake explicito para Runtime.</p>
          </div>
          <div class="workspace-actions">
            ${I.map(e=>`<button data-view="${e}">${this.viewLabel(e)}</button>`).join(``)}
            <select data-studio-field="scenario">
              ${p.map(e=>`<option value="${e.id}" ${e.id===this.state.session.scenarioId?`selected`:``}>${e.name}</option>`).join(``)}
            </select>
            <select data-studio-field="heatmap">
              ${R.map(e=>`<option value="${e}" ${e===this.state.session.heatmapLayer?`selected`:``}>${e}</option>`).join(``)}
            </select>
            <button data-studio-action="play">${this.state.session.timeline.playing?`Pause`:`Play`}</button>
            <button data-studio-action="step">Step</button>
            <button data-studio-action="record">${this.state.session.replay.session?.status===`recording`?`Stop Rec`:`Record`}</button>
            <button data-studio-action="replay">Replay</button>
            <button data-studio-action="bake-runtime">Bake Runtime</button>
            <button data-route="/harness">Harness</button>
          </div>
        </header>
        <div class="workspace-grid studio-grid">
          <section class="workspace-stage">
            <div class="workspace-floating top">
              ${L.map(e=>`<button data-camera-mode="${e}">${this.cameraModeLabel(e)}</button>`).join(``)}
              <button data-focus="player">Player</button>
              <button data-focus="selected">Selected</button>
              <button data-focus="core">Core</button>
            </div>
            <div class="workspace-floating bottom">
              ${F.map(e=>`<button data-tool="${e}">${this.toolLabel(e)}</button>`).join(``)}
              <button data-studio-action="toggle-gate">Gate</button>
              <button data-studio-action="export-scenario">Export</button>
              <button data-studio-action="import-scenario">Import</button>
            </div>
            <div class="workspace-stage-status" id="studio-status"></div>
            <div class="canvas-host" id="studio-canvas" data-testid="studio-canvas"></div>
            <pre id="studio-signature" class="sr-only" data-testid="canonical-signature"></pre>
          </section>
          <aside class="workspace-side" id="studio-side" data-testid="studio-side"></aside>
        </div>
        <section class="workspace-bottom" id="studio-bottom" data-testid="studio-bottom"></section>
      </section>
    `}attachEvents(){let e=e=>this.handleClick(e),t=e=>this.handleChange(e),n=e=>this.handleInput(e),r=e=>{this.state.view!==`3d`||this.state.camera3D.mode===`first-person`||(e.preventDefault(),this.setState(t=>({...t,camera3D:{...t.camera3D,distance:a(t.camera3D.distance+Math.sign(e.deltaY)*.8,4.5,20)}})),this.updateHud(!0))},i=e=>{this.state.view!==`3d`||this.state.camera3D.mode===`first-person`||(this.isDraggingCamera=!0,this.lastPointer={x:e.clientX,y:e.clientY})},o=e=>{if(!this.isDraggingCamera||!this.lastPointer||this.state.camera3D.mode===`first-person`)return;let t=e.clientX-this.lastPointer.x,n=e.clientY-this.lastPointer.y;this.lastPointer={x:e.clientX,y:e.clientY},this.setState(e=>({...e,camera3D:{...e.camera3D,yaw:e.camera3D.yaw+t*.008,pitch:a(e.camera3D.pitch-n*.006,-1.1,.72)}}))},s=()=>{this.isDraggingCamera=!1,this.lastPointer=void 0},c=e=>{if(this.state.view!==`3d`||this.state.camera3D.mode!==`first-person`)return;let t=this.host.querySelector(`#studio-canvas canvas`);!t||document.pointerLockElement!==t||this.setState(t=>({...t,camera3D:{...t.camera3D,yaw:t.camera3D.yaw+e.movementX*.0024,pitch:a(t.camera3D.pitch-e.movementY*.0018,-1.15,.9)}}))};this.host.addEventListener(`click`,e),this.host.addEventListener(`change`,t),this.host.addEventListener(`input`,n),this.host.querySelector(`#studio-canvas`)?.addEventListener(`wheel`,r,{passive:!1}),this.host.querySelector(`#studio-canvas`)?.addEventListener(`pointerdown`,i),window.addEventListener(`pointermove`,o),window.addEventListener(`pointerup`,s),window.addEventListener(`mousemove`,c),this.cleanups.add(()=>this.host.removeEventListener(`click`,e)),this.cleanups.add(()=>this.host.removeEventListener(`change`,t)),this.cleanups.add(()=>this.host.removeEventListener(`input`,n)),this.cleanups.add(()=>this.host.querySelector(`#studio-canvas`)?.removeEventListener(`wheel`,r)),this.cleanups.add(()=>this.host.querySelector(`#studio-canvas`)?.removeEventListener(`pointerdown`,i)),this.cleanups.add(()=>window.removeEventListener(`pointermove`,o)),this.cleanups.add(()=>window.removeEventListener(`pointerup`,s)),this.cleanups.add(()=>window.removeEventListener(`mousemove`,c))}mountRenderer(){this.rendererCanvasCleanup?.(),this.renderer?.destroy(),this.renderer=void 0;let e=this.host.querySelector(`#studio-canvas`);if(!e)return;if(this.state.view===`3d`){let t=new O({...this.provider(),parent:e,getCameraState:()=>this.state.camera3D});t.mount(),this.renderer=t}else{let t=new D({...this.provider(),parent:e,mode:this.state.view,getCamera:()=>this.studioCamera2D(this.state.view),getDraftSegment:()=>this.draftSegment(),onWorldClick:e=>this.handleStudioWorldClick(e),onWorldHover:e=>{this.setState(t=>({...t,hoverPoint:e}))},interactionEnabled:!0});t.mount(),this.renderer=t}let t=e.querySelector(`canvas`);t&&(this.rendererCanvasCleanup=this.context.performance.trackCanvas(`studio:${this.state.view}`),this.state.view===`3d`&&e.addEventListener(`click`,()=>{this.state.camera3D.mode===`first-person`&&t.requestPointerLock?.()},{once:!0}))}loop=e=>{let t=Math.min(.05,(e-this.lastTick)/1e3);if(this.lastTick=e,!this.paused){let e=performance.now();if(this.state.view===`3d`){let e=Number(this.keyboard.pressed.has(`KeyE`))-Number(this.keyboard.pressed.has(`KeyQ`)),n=Number(this.keyboard.pressed.has(`KeyR`))-Number(this.keyboard.pressed.has(`KeyF`));(e!==0||n!==0)&&this.setState(r=>({...r,camera3D:{...r.camera3D,yaw:r.camera3D.yaw+e*t*1.9,pitch:a(r.camera3D.pitch+n*t*1.3,-1.15,.9)}}))}if(this.state.session.timeline.playing)for(this.accumulator+=t;this.accumulator>=c;){let e=performance.now(),t=[...this.commandQueue];this.commandQueue=[];let n=g(this.state.session,this.inputState(),t);this.simMs=performance.now()-e,this.setState(e=>({...e,session:n})),this.accumulator-=c}this.frameMs=performance.now()-e,this.updateHud(),A(this.context,`studio`,this.frameMs,this.simMs,this.state.session.analysis,this.state.session.world,this.renderer)}this.raf=requestAnimationFrame(this.loop)};updateHud(e=!1){let n=performance.now();if(!e&&n-this.hudStamp<140)return;this.hudStamp=n,this.host.querySelectorAll(`[data-view]`).forEach(e=>e.classList.toggle(`active`,e.dataset.view===this.state.view)),this.host.querySelectorAll(`[data-tool]`).forEach(e=>e.classList.toggle(`active`,e.dataset.tool===this.state.tool)),this.host.querySelectorAll(`[data-camera-mode]`).forEach(e=>e.classList.toggle(`active`,e.dataset.cameraMode===this.state.camera3D.mode)),this.host.querySelectorAll(`[data-focus]`).forEach(e=>e.classList.toggle(`active`,e.dataset.focus===this.state.camera3D.focusTarget));let i=this.host.querySelector(`#studio-status`),a=this.host.querySelector(`#studio-side`),o=this.host.querySelector(`#studio-bottom`),s=this.host.querySelector(`#studio-signature`),c=r(this.state.session.world);s&&(s.textContent=c),i&&(i.textContent=`${t} | scenario ${this.state.session.scenarioId} | tick ${this.state.session.timeline.tick} | view ${this.viewLabel(this.state.view)} | replay ${this.state.session.replay.state.status}`),a&&(a.innerHTML=this.sideHtml()),o&&(o.innerHTML=this.bottomHtml())}sideHtml(){let e=P(this.state.session.world.pieces),t=this.state.session.selection,n=t?.kind===`piece`?this.state.session.world.pieces.find(e=>e.id===t.id):void 0,r=t?.kind===`actor`?this.state.session.world.actors.find(e=>e.id===t.id):void 0,a=this.state.session.timeline.frames.find(e=>e.tick===this.state.session.timeline.tick)??this.state.session.timeline.frames.at(-1),o=this.state.session.enemyWorkbench.archetype;return`
      <div class="workspace-side-block">
        <h2>Inspector</h2>
        <div class="workspace-button-grid">
          ${this.state.session.world.pieces.map(e=>`<button data-select-kind="piece" data-select-id="${e.id}">${e.id}</button>`).join(``)}
          ${this.state.session.world.actors.map(e=>`<button data-select-kind="actor" data-select-id="${e.id}">${e.id}</button>`).join(``)}
          <button data-select-kind="base-core" data-select-id="base-core">base-core</button>
        </div>
        <dl>
          <dt>Selection</dt><dd>${t?`${t.kind}:${t.id}`:`none`}</dd>
          <dt>Bounds</dt><dd>${n?JSON.stringify(i(n)):r?`r=${r.radius} h=${r.height}`:`-`}</dd>
          <dt>Sockets</dt><dd>${n?u(n).map(e=>`${e.kind}@${e.position.y.toFixed(1)}`).join(` | `):`-`}</dd>
          <dt>Snapshot</dt><dd><pre class="studio-pre">${a?JSON.stringify(a.canonicalSnapshot,null,2).slice(0,800):``}</pre></dd>
        </dl>
      </div>
      <div class="workspace-side-block">
        <h2>Validacao</h2>
        <dl>
          <dt>Nodes/edges</dt><dd>${e.nodes.length} / ${e.edges.length}</dd>
          <dt>Sockets</dt><dd>${e.sockets.length}</dd>
          <dt>Issues</dt><dd>${this.state.session.analysis.validationIssues.map(e=>`${e.severity}:${e.kind}`).join(` | `)||`sem issues`}</dd>
          <dt>Diff</dt><dd>${this.state.session.diff.changedHash?`pieces ${this.state.session.diff.changedPieceIds.join(`,`)||`-`} | actors ${this.state.session.diff.changedActorIds.join(`,`)||`-`} | delta ${this.state.session.diff.issueDelta}`:`sem diferencas`}</dd>
        </dl>
      </div>
      <div class="workspace-side-block">
        <h2>Workbench AI</h2>
        <div class="studio-slider-list">
          ${this.policySlider(`fovDegrees`,`FOV`,this.state.session.aiWorkbench.policy.fovDegrees,60,160,1)}
          ${this.policySlider(`visionRange`,`Vision`,this.state.session.aiWorkbench.policy.visionRange,3,14,.5)}
          ${this.policySlider(`openGateBias`,`Open gate`,this.state.session.aiWorkbench.policy.openGateBias,-3,1,.1)}
          ${this.policySlider(`closedGateBias`,`Closed gate`,this.state.session.aiWorkbench.policy.closedGateBias,-1,3,.1)}
          ${this.policySlider(`playerPriority`,`Player`,this.state.session.aiWorkbench.policy.playerPriority,-4,2,.1)}
          ${this.policySlider(`corePriority`,`Core`,this.state.session.aiWorkbench.policy.corePriority,-1,4,.1)}
        </div>
      </div>
      <div class="workspace-side-block">
        <h2>Enemy seed</h2>
        <label>Seed <input type="number" data-studio-field="enemy-seed" value="${this.state.session.enemyWorkbench.seed}" /></label>
        <div class="enemy-preview-grid" data-testid="enemy-previews">
          <div class="enemy-preview-card"><span>2D</span>${S(o,`2d`)}</div>
          <div class="enemy-preview-card"><span>2.5D</span>${S(o,`25d`)}</div>
          <div class="enemy-preview-card"><span>3D</span>${S(o,`3d`)}</div>
        </div>
      </div>
    `}bottomHtml(){let e=(this.state.session.timeline.frames.find(e=>e.tick===this.state.session.timeline.tick)??this.state.session.timeline.frames.at(-1))?.profilerSample;return`
      <div class="workspace-bottom-grid">
        <div class="workspace-side-block">
          <h2>Timeline</h2>
          <label>Tick <input type="range" min="0" max="${Math.max(0,this.state.session.timeline.frames.at(-1)?.tick??0)}" value="${this.state.session.timeline.tick}" data-studio-field="timeline" /></label>
          <label>Compare <input type="range" min="0" max="${Math.max(0,this.state.session.timeline.frames.at(-1)?.tick??0)}" value="${this.state.session.timeline.compareTick}" data-studio-field="compare" /></label>
          <dl>
            <dt>Replay</dt><dd>${this.state.session.replay.state.status} total=${this.state.session.replay.state.totalFrames}</dd>
            <dt>Divergence</dt><dd>${s(this.state.session.replay.session)||`-`}</dd>
          </dl>
        </div>
        <div class="workspace-side-block">
          <h2>Profiler</h2>
          <dl>
            <dt>Step</dt><dd>${e?.stepMs.toFixed(3)??`0.000`} ms</dd>
            <dt>Analysis</dt><dd>${e?.analysisMs.toFixed(3)??`0.000`} ms</dd>
            <dt>AI</dt><dd>${this.state.session.analysis.timings.aiMs.toFixed(3)} ms</dd>
            <dt>Paths</dt><dd>${e?.pathActors??0}</dd>
            <dt>Nav samples</dt><dd>${e?.navigationSamples??0}</dd>
            <dt>Blockers</dt><dd>${e?.blockers??0}</dd>
          </dl>
        </div>
        <div class="workspace-side-block">
          <h2>Separacao</h2>
          <dl>
            <dt>View ativa</dt><dd>${this.viewLabel(this.state.view)}</dd>
            <dt>Harness</dt><dd>modo diagnostico separado por rota</dd>
            <dt>Runtime</dt><dd>bake explicito, nada pesado inicia junto</dd>
          </dl>
        </div>
      </div>
    `}handleClick(t){let n=t.target.closest(`button`);if(n){if(n.dataset.route){this.context.navigate(n.dataset.route);return}if(n.dataset.view){this.setState(e=>({...e,view:n.dataset.view})),this.mountRenderer(),this.updateHud(!0);return}if(n.dataset.tool){this.setState(e=>({...e,tool:n.dataset.tool,pendingPoint:void 0})),this.updateHud(!0);return}if(n.dataset.cameraMode){this.setState(e=>({...e,camera3D:{...e.camera3D,mode:n.dataset.cameraMode}})),this.updateHud(!0);return}if(n.dataset.focus){this.setState(e=>({...e,camera3D:{...e.camera3D,focusTarget:n.dataset.focus}})),this.updateHud(!0);return}if(n.dataset.selectKind&&n.dataset.selectId){let e=n.dataset.selectKind===`base-core`?{kind:`base-core`,id:`base-core`}:{kind:n.dataset.selectKind,id:n.dataset.selectId};this.applyStudioSelection(e),this.updateHud(!0);return}switch(n.dataset.studioAction){case`play`:this.setState(e=>({...e,session:{...e.session,timeline:{...e.session.timeline,playing:!e.session.timeline.playing}}})),this.updateHud(!0);break;case`step`:this.setState(e=>({...e,session:g(e.session,this.inputState(),this.commandQueue.splice(0))})),this.updateHud(!0);break;case`record`:if(this.state.session.replay.session?.status===`recording`){let e=_(this.state.session);this.setState(t=>({...t,session:e})),e.replay.session&&this.persistReplayRecord(e.replay.session,`studio`)}else this.setState(e=>({...e,session:E(e.session)}));this.updateHud(!0);break;case`replay`:{let e=b(this.state.session);this.setState(t=>({...t,session:e})),e.replay.session&&this.persistReplayRecord(e.replay.session,`studio`),this.updateHud(!0);break}case`bake-runtime`:this.bakeRuntime();break;case`toggle-gate`:this.toggleSelectedGate();break;case`export-scenario`:navigator.clipboard?.writeText(JSON.stringify(l(this.state.session.world).serialize(),null,2));break;case`import-scenario`:{let t=window.prompt(`Cole o JSON do cenario de teste:`);if(!t)break;try{let n=e.deserialize(JSON.parse(t)),r={...this.state.session.world,pieces:n.pieces,towers:n.towers,connectors:n.connectors};this.setState(e=>({...e,session:T(e.session,r,this.commandQueue.splice(0))})),this.mountRenderer(),this.updateHud(!0)}catch{}break}default:break}}}handleChange(e){let t=e.target;if(t instanceof HTMLSelectElement&&t.dataset.studioField===`scenario`){this.setState(e=>({...e,session:h(e.session,t.value)})),this.mountRenderer(),this.updateHud(!0);return}t instanceof HTMLSelectElement&&t.dataset.studioField===`heatmap`&&(this.setState(e=>({...e,session:w(e.session,t.value)})),this.updateHud(!0))}handleInput(e){let t=e.target;if(t instanceof HTMLInputElement&&t.dataset.studioField===`timeline`){this.setState(e=>({...e,session:C(e.session,Number(t.value))})),this.updateHud(!0);return}if(t instanceof HTMLInputElement&&t.dataset.studioField===`compare`){this.setState(e=>({...e,session:m(e.session,Number(t.value))})),this.updateHud(!0);return}if(t instanceof HTMLInputElement&&t.dataset.studioField===`enemy-seed`){this.setState(e=>({...e,session:x(e.session,Number(t.value))})),this.updateHud(!0);return}if(t instanceof HTMLInputElement&&t.dataset.studioPolicy){let e=t.dataset.studioPolicy;this.setState(n=>({...n,session:v(n.session,{[e]:Number(t.value)})})),this.updateHud(!0)}}studioCamera2D(e){let t=this.resolveFocusPoint(this.state.session.world,this.state.session.selection,this.state.camera3D.focusTarget);return{target:{x:t.x,z:t.z},zoom:e===`2d`?.54:.5}}resolveFocusPoint(e,t,n){if(n===`player`){let t=e.actors.find(e=>e.kind===`player`);if(t)return{x:t.position.x,y:t.baseY+1,z:t.position.z}}if(n===`selected`&&t){if(t.kind===`piece`){let n=e.pieces.find(e=>e.id===t.id);if(n)return{x:(n.a.x+n.b.x)*.5,y:n.baseY+n.height*.5,z:(n.a.z+n.b.z)*.5}}if(t.kind===`actor`){let n=e.actors.find(e=>e.id===t.id);if(n)return{x:n.position.x,y:n.baseY+n.height*.5,z:n.position.z}}}return{x:e.baseCore.position.x,y:e.baseCore.baseY+e.baseCore.height,z:e.baseCore.position.z}}handleStudioWorldClick(e){if(this.state.tool===`tower`){let t=this.findNearestTL(e);if(t?.kind!==`fence-tl`||t.towerId)return;let n=l(this.state.session.world);n.attachTowerToFenceTL(t.id),this.commandQueue.push({kind:`attach-tower`,fenceId:t.id});let r={...this.state.session.world,pieces:n.pieces,towers:n.towers,connectors:n.connectors,selectedId:t.id};this.setState(e=>({...e,session:T(e.session,r,this.commandQueue.splice(0))})),this.mountRenderer(),this.updateHud(!0);return}if(this.state.tool===`erase`){let t=l(this.state.session.world);t.deleteNear(e,.45),this.commandQueue.push({kind:`erase-near`,point:e});let n={...this.state.session.world,pieces:t.pieces,towers:t.towers,connectors:t.connectors,selectedId:void 0};this.setState(e=>({...e,session:T(e.session,n,this.commandQueue.splice(0))})),this.mountRenderer(),this.updateHud(!0);return}if(this.state.tool!==`fence`&&this.state.tool!==`fence-tl`&&this.state.tool!==`gate`)return;if(!this.state.pendingPoint){this.setState(t=>({...t,pendingPoint:e})),this.updateHud(!0);return}let t=l(this.state.session.world),n=t.placeSegment(this.state.tool,this.state.pendingPoint,e);this.commandQueue.push({kind:`place-segment`,tool:n.kind,a:n.a,b:n.b,state:n.kind===`gate`?n.state:void 0,heightLayer:n.heightLayer});let r={...this.state.session.world,pieces:t.pieces,towers:t.towers,connectors:t.connectors,selectedId:n.id};this.setState(e=>({...e,session:T(e.session,r,this.commandQueue.splice(0)),pendingPoint:void 0,hoverPoint:void 0})),this.mountRenderer(),this.updateHud(!0)}applyStudioSelection(e){let t=e.kind===`piece`?e.id:void 0,n={...this.state.session.world,selectedId:t},r=y(T(this.state.session,n),e);this.setState(t=>({...t,session:r,camera3D:{...t.camera3D,focusTarget:e.kind===`base-core`?`core`:`selected`}}))}findNearestTL(e){return this.state.session.world.pieces.filter(e=>e.kind===`fence-tl`).map(t=>({piece:t,d:n(e,{x:(t.a.x+t.b.x)*.5,z:(t.a.z+t.b.z)*.5})})).sort((e,t)=>e.d-t.d)[0]?.piece}inputState(){let e=Number(this.keyboard.pressed.has(`ArrowUp`)||this.keyboard.pressed.has(`KeyW`))-Number(this.keyboard.pressed.has(`ArrowDown`)||this.keyboard.pressed.has(`KeyS`)),t=Number(this.keyboard.pressed.has(`ArrowRight`)||this.keyboard.pressed.has(`KeyD`))-Number(this.keyboard.pressed.has(`ArrowLeft`)||this.keyboard.pressed.has(`KeyA`));if(this.state.view===`3d`){let n=this.state.camera3D.yaw,r={x:Math.sin(n),z:Math.cos(n)},i={x:r.z,z:-r.x};return{move:o({x:r.x*e+i.x*t,z:r.z*e+i.z*t}),attack:this.keyboard.pressed.has(`Space`)}}return{move:{x:t,z:-e},attack:this.keyboard.pressed.has(`Space`)}}draftSegment(){if(!(!this.state.pendingPoint||!this.state.hoverPoint)&&!(this.state.tool!==`fence`&&this.state.tool!==`fence-tl`&&this.state.tool!==`gate`))return l(this.state.session.world).previewSegment(this.state.tool,this.state.pendingPoint,this.state.hoverPoint)}toggleSelectedGate(){let e=(this.state.session.selection?.kind===`piece`?this.state.session.world.pieces.find(e=>e.id===this.state.session.selection?.id&&e.kind===`gate`):void 0)??this.state.session.world.pieces.find(e=>e.kind===`gate`);if(!e||e.kind!==`gate`)return;let t=l(this.state.session.world);t.setGateState(e.id,e.state===`open`?`closed`:`open`),this.commandQueue.push({kind:`toggle-gate`,gateId:e.id});let n={...this.state.session.world,pieces:t.pieces,towers:t.towers,connectors:t.connectors,selectedId:e.id},r=y(T(this.state.session,n,this.commandQueue.splice(0)),{kind:`piece`,id:e.id});this.setState(e=>({...e,session:r})),this.mountRenderer(),this.updateHud(!0)}bakeRuntime(){let e=this.state.session,t=f(e.world,`studio`,`Studio ${e.scenarioId}`,e.timeline.tick,e.scenarioId),n=d(t);this.context.stores.runtimeStore.setState(e=>({...e,artifact:t,session:n})),this.context.navigate(`/runtime`)}persistReplayRecord(e,t){let n={id:`studio-replay-${e.seed}-${e.frame}`,label:`Studio ${this.state.session.scenarioId}`,source:t,createdAt:Date.now(),session:e};this.context.stores.replayStore.setState(e=>({records:[...e.records.filter(e=>e.id!==n.id),n].sort((e,t)=>t.createdAt-e.createdAt),selectedId:n.id}))}policySlider(e,t,n,r,i,a){return`<label>${t}<input type="range" data-studio-policy="${e}" min="${r}" max="${i}" step="${a}" value="${n}" /><span>${n}</span></label>`}viewLabel(e){return e===`2d`?`2D`:e===`25d`?`2.5D`:`3D`}cameraModeLabel(e){return e===`first-person`?`FP`:e===`tactical`?`Tactical`:`Inspect`}toolLabel(e){return e===`fence`?`Cerca`:e===`fence-tl`?`Cerca TL`:e===`gate`?`Portao`:e===`tower`?`Torre`:`Apagar`}},B={mount(e,t){return new z(e,t).mount()}};export{B as default};