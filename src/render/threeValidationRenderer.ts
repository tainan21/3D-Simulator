import * as THREE from "three";
import {
  baseCoreCircle,
  pieceCapsule,
  pieceHorizontalBounds,
  pieceSockets,
  type Actor,
  type BasePiece,
  type HeightConnector,
  type TowerPiece
} from "../domain/canonical";
import { actorOrientation, baseCoreOrientation, pieceOrientation, towerOrientation } from "../domain/orientation";
import type { AiDebugState } from "../simulation/aiTypes";
import { structureState, structureTintFactor } from "../simulation/structures";
import type { RenderDataProvider, ThreeCameraState } from "./contracts";
import { computeRenderDirtyFlags, createRenderFingerprint, type RenderFingerprint } from "./dirtyFlags";

export type ThreeRendererOptions = RenderDataProvider & {
  parent: HTMLElement;
  getCameraState: () => ThreeCameraState;
};

const GROUND_SIZE = 84;
const CAMERA_FAR = 160;

function pieceColor(piece: BasePiece): number {
  if (piece.kind === "fence-tl") return 0xf6c453;
  if (piece.kind === "gate") return piece.state === "closed" ? 0xf16d6d : 0x62d26f;
  return 0x9eb7ff;
}

function actorColor(actor: Actor): number {
  if (actor.kind === "player") return 0x7af0d4;
  if (actor.kind === "boss") return 0xe9609b;
  return 0xf2a65a;
}

function materialColor(color: number, roughness = 0.72): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.03 });
}

function tintHex(color: number, factor: number): number {
  return new THREE.Color(color).multiplyScalar(factor).getHex();
}

function vec3ToThree(v: { x: number; y: number; z: number }): THREE.Vector3 {
  return new THREE.Vector3(v.x, v.y, v.z);
}

export class ThreeValidationRenderer {
  private readonly options: ThreeRendererOptions;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(58, 1, 0.04, CAMERA_FAR);
  private readonly root = new THREE.Group();
  private readonly lights: THREE.Light[] = [];
  private animation = 0;
  private readonly resizeHandler = () => this.resize();
  private lastFingerprint?: RenderFingerprint;
  private lastMetricsAt = performance.now();
  private framesSinceMetrics = 0;
  private metrics = { fps: 0, frameMs: 0, renderMs: 0, overlayMs: 0, drawCalls: 0, triangles: 0 };

  constructor(options: ThreeRendererOptions) {
    this.options = options;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0d1117, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.02;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  mount(): void {
    this.options.parent.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color(0x0d1117);
    this.scene.fog = new THREE.Fog(0x0d1117, 24, 76);
    this.scene.add(this.root);
    this.addLighting();
    window.addEventListener("resize", this.resizeHandler);
    this.resize();
    this.loop();
  }

  destroy(): void {
    window.removeEventListener("resize", this.resizeHandler);
    cancelAnimationFrame(this.animation);
    this.disposeGroup(this.root);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  getMetrics(): typeof this.metrics {
    return this.metrics;
  }

  private addLighting(): void {
    const hemi = new THREE.HemisphereLight(0xc4dbff, 0x1c2532, 1.08);
    this.scene.add(hemi);
    this.lights.push(hemi);
    const sun = new THREE.DirectionalLight(0xffefc8, 2.8);
    sun.position.set(-10, 18, -6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 54;
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 24;
    sun.shadow.camera.bottom = -24;
    this.scene.add(sun);
    this.lights.push(sun);
    const fill = new THREE.DirectionalLight(0x74f5ff, 0.4);
    fill.position.set(9, 6, 14);
    this.scene.add(fill);
    this.lights.push(fill);
  }

  private resize(): void {
    const width = Math.max(1, this.options.parent.clientWidth);
    const height = Math.max(1, this.options.parent.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private loop = (): void => {
    const frameStart = performance.now();
    const world = this.options.getWorld();
    const debug = this.options.getDebugOptions();
    const aiDebug = this.options.getAiDebug();
    const contacts = this.options.getDebugContacts();
    const validationIssues = this.options.getValidationIssues();
    const influenceField = this.options.getInfluenceField();
    const replayState = this.options.getReplayState();
    const camera = this.options.getCameraState();
    const ghostWorld = this.options.getGhostWorld?.();
    this.applyVisualOptions(debug);
    const nextFingerprint = createRenderFingerprint({ world, debug, aiDebug, contacts, validationIssues, influenceField, replayState, camera, ghostWorld });
    const automaticDirty = computeRenderDirtyFlags(this.lastFingerprint, nextFingerprint);
    const externalDirty = this.options.getRenderDirtyFlags?.();
    const dirty = externalDirty
      ? {
          geometry: automaticDirty.geometry || externalDirty.geometry,
          simulation: automaticDirty.simulation || externalDirty.simulation,
          camera: automaticDirty.camera || externalDirty.camera,
          overlays: automaticDirty.overlays || externalDirty.overlays
        }
      : automaticDirty;
    this.updateCamera(world);
    if (dirty.geometry || dirty.simulation || dirty.overlays) {
      this.rebuildWithSnapshot(world, debug, aiDebug, ghostWorld);
      this.lastFingerprint = nextFingerprint;
    }
    const renderStart = performance.now();
    this.renderer.render(this.scene, this.camera);
    this.updateMetrics(frameStart, renderStart);
    this.animation = requestAnimationFrame(this.loop);
  };

  private rebuild(): void {
    this.rebuildWithSnapshot(this.options.getWorld(), this.options.getDebugOptions(), this.options.getAiDebug(), this.options.getGhostWorld?.());
  }

  private rebuildWithSnapshot(
    world: ReturnType<ThreeRendererOptions["getWorld"]>,
    debug: ReturnType<ThreeRendererOptions["getDebugOptions"]>,
    aiDebug: ReturnType<ThreeRendererOptions["getAiDebug"]>,
    ghostWorld?: ReturnType<ThreeRendererOptions["getWorld"]>
  ): void {
    this.disposeGroup(this.root);
    this.root.clear();
    this.drawGround(debug);
    if (debug.effects && ghostWorld) this.drawGhostWorld(ghostWorld);
    if (debug.enabled && debug.effects && debug.influence) this.drawInfluenceField();
    this.drawBaseCore(world, debug);
    for (const connector of world.connectors) this.drawConnector(connector);
    for (const piece of world.pieces) this.drawPiece(piece, world.selectedId === piece.id, debug);
    for (const tower of world.towers) this.drawTower(tower, world, debug);
    for (const actor of world.actors) this.drawActor(actor, debug);
    if (debug.enabled && debug.nearest) for (const contact of this.options.getDebugContacts()) this.drawDebugContact(contact);
    if (debug.enabled && debug.targets) for (const entry of aiDebug) this.drawAiTarget(entry);
    if (debug.enabled && debug.routes) for (const entry of aiDebug) this.drawAiRoute(entry);
    if (debug.enabled && debug.navigation) for (const entry of aiDebug) this.drawNavigationSamples(entry);
    if (debug.enabled && debug.effects && debug.damage) this.drawStructuralDamage(world);
    if (debug.enabled && debug.diagnostics) this.drawValidationIssues();
  }

  private applyVisualOptions(debug: ReturnType<ThreeRendererOptions["getDebugOptions"]>): void {
    this.renderer.shadowMap.enabled = debug.shadows;
    this.scene.fog = debug.fog ? new THREE.Fog(0x0d1117, 24, 76) : null;
    for (const light of this.lights) light.visible = debug.lighting;
  }

  private updateMetrics(frameStart: number, renderStart: number): void {
    this.framesSinceMetrics += 1;
    const now = performance.now();
    if (now - this.lastMetricsAt < 260) return;
    const renderInfo = this.renderer.info.render;
    this.metrics = {
      fps: Math.round((this.framesSinceMetrics * 1000) / Math.max(1, now - this.lastMetricsAt)),
      frameMs: now - frameStart,
      renderMs: now - renderStart,
      overlayMs: 0,
      drawCalls: renderInfo.calls,
      triangles: renderInfo.triangles
    };
    this.framesSinceMetrics = 0;
    this.lastMetricsAt = now;
  }

  private updateCamera(world: ReturnType<ThreeRendererOptions["getWorld"]>): void {
    const state = this.options.getCameraState();
    const player = world.actors.find((actor) => actor.kind === "player");
    const selected = world.pieces.find((piece) => piece.id === world.selectedId);
    const selectedPivot = selected ? pieceOrientation(selected).pivot.origin : undefined;
    const focusBase =
      state.focusTarget === "selected" && selectedPivot
        ? selectedPivot
        : state.focusTarget === "player" && player
          ? { x: player.position.x, y: player.baseY + 1.2, z: player.position.z }
          : { x: world.baseCore.position.x, y: world.baseCore.baseY + 1.1, z: world.baseCore.position.z };
    const target = {
      x: focusBase.x + state.panOffset.x,
      y: focusBase.y,
      z: focusBase.z + state.panOffset.z
    };

    const yaw = state.yaw;
    const pitch = state.pitch;
    const forward = {
      x: Math.sin(yaw) * Math.cos(pitch),
      y: Math.sin(pitch),
      z: Math.cos(yaw) * Math.cos(pitch)
    };

    if (state.mode === "first-person" && player) {
      this.camera.fov = 64;
      this.camera.position.set(player.position.x, player.baseY + state.eyeHeight, player.position.z);
      this.camera.lookAt(vec3ToThree({
        x: player.position.x + forward.x * 4,
        y: player.baseY + state.eyeHeight + forward.y * 4,
        z: player.position.z + forward.z * 4
      }));
      return;
    }

    const distanceScale = state.mode === "tactical" ? state.distance : state.distance * 0.88;
    this.camera.fov = state.mode === "inspection" ? 50 : 56;
    this.camera.position.set(
      target.x - forward.x * distanceScale,
      target.y + Math.max(2.6, distanceScale * (state.mode === "tactical" ? 0.45 : 0.32)) - forward.y * distanceScale,
      target.z - forward.z * distanceScale
    );
    this.camera.lookAt(vec3ToThree(target));
  }

  private drawGround(debug: ReturnType<ThreeRendererOptions["getDebugOptions"]>): void {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE),
      new THREE.MeshStandardMaterial({ color: 0x17202d, roughness: 0.95, metalness: 0 })
    );
    ground.rotation.x = -Math.PI * 0.5;
    ground.receiveShadow = true;
    this.root.add(ground);

    if (debug.grid) {
      const grid = new THREE.GridHelper(GROUND_SIZE, GROUND_SIZE, 0x556d88, 0x243141);
      grid.position.y = 0.015;
      this.root.add(grid);
    }

    if (debug.enabled && debug.axes) {
      const axes = new THREE.AxesHelper(1.5);
      axes.position.set(-12.5, 0.04, -12.5);
      this.root.add(axes);
    }
  }

  private drawInfluenceField(): void {
    for (const cell of this.options.getInfluenceField().cells) {
      const color = cell.score > 1 ? 0xe9609b : cell.deadZone ? 0xf6c453 : 0x62d26f;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.92, 0.92),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: Math.min(0.28, 0.06 + Math.abs(cell.score) * 0.05), side: THREE.DoubleSide })
      );
      mesh.rotation.x = -Math.PI * 0.5;
      mesh.position.set(cell.center.x, 0.03, cell.center.z);
      this.root.add(mesh);
    }
  }

  private drawGhostWorld(world: ReturnType<ThreeRendererOptions["getWorld"]>): void {
    for (const piece of world.pieces) {
      const orientation = pieceOrientation(piece);
      const length = Math.hypot(piece.b.x - piece.a.x, piece.b.z - piece.a.z);
      const group = this.createFrameGroup(orientation.pivot);
      this.root.add(group);
      const material = new THREE.MeshBasicMaterial({ color: 0xc4dbff, transparent: true, opacity: 0.14, wireframe: true });
      for (const localX of this.localPostPositions(length)) this.addPost(group, localX, piece.height, piece.thickness * 0.42, material);
      for (const y of this.railHeights(piece.height)) this.addRail(group, length, y, piece.thickness * 0.45, material);
    }
    for (const actor of world.actors) {
      const ghost = new THREE.Mesh(
        new THREE.CylinderGeometry(actor.radius, actor.radius, actor.height, 12),
        new THREE.MeshBasicMaterial({ color: 0x74f5ff, transparent: true, opacity: 0.12, wireframe: true })
      );
      ghost.position.set(actor.position.x, actor.baseY + actor.height * 0.5, actor.position.z);
      this.root.add(ghost);
    }
  }

  private drawBaseCore(world: ReturnType<ThreeRendererOptions["getWorld"]>, debug: ReturnType<ThreeRendererOptions["getDebugOptions"]>): void {
    const core = world.baseCore;
    const circle = baseCoreCircle(core);
    const coreState = structureState(world.structures, core.id);
    const factor = structureTintFactor(coreState);
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(circle.radius, circle.radius, core.height, 32),
      new THREE.MeshStandardMaterial({ color: tintHex(0x6fd39c, factor), transparent: true, opacity: coreState?.integrity === "destroyed" ? 0.24 : 0.76, roughness: 0.5 })
    );
    mesh.position.set(circle.center.x, core.baseY + core.height * 0.5, circle.center.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.root.add(mesh);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(circle.radius, 0.018, 8, 40),
      new THREE.MeshBasicMaterial({ color: 0x6fd39c, transparent: true, opacity: 0.95 })
    );
    ring.rotation.x = Math.PI * 0.5;
    ring.position.set(circle.center.x, core.baseY + 0.07, circle.center.z);
    this.root.add(ring);

    if (debug.enabled && debug.pivots) this.drawPivot(baseCoreOrientation(core), 0x6fd39c);
    if (debug.enabled && debug.axes) this.drawFrameAxes(baseCoreOrientation(core), 0.75);
  }

  private drawPiece(piece: BasePiece, selected: boolean, debug: ReturnType<ThreeRendererOptions["getDebugOptions"]>): void {
    const orientation = pieceOrientation(piece);
    const state = structureState(this.options.getWorld().structures, piece.id);
    const color = tintHex(pieceColor(piece), structureTintFactor(state));
    const material = materialColor(color);
    material.transparent = state?.integrity === "destroyed";
    material.opacity = state?.integrity === "destroyed" ? 0.26 : 1;
    const length = Math.hypot(piece.b.x - piece.a.x, piece.b.z - piece.a.z);
    const group = this.createFrameGroup(orientation.pivot);
    this.root.add(group);

    const postRadius = piece.thickness * 0.58;
    for (const localX of this.localPostPositions(length)) {
      this.addPost(group, localX, piece.height, postRadius, material);
    }

    if (piece.kind === "gate") {
      this.addGatePanel(group, piece, length, material);
    } else {
      for (const y of this.railHeights(piece.height)) this.addRail(group, length, y, piece.thickness * 0.72, material);
    }

    if (debug.enabled && debug.colliders) this.drawCapsuleFootprint(pieceCapsule(piece), color, piece.baseY);
    if (debug.enabled && debug.bounds) this.drawBounds(piece, selected);
    if (debug.enabled && debug.sockets) this.drawSockets(piece);
    if (debug.enabled && debug.axes) {
      this.drawFrameAxes(orientation.pivot, 0.72);
      if (orientation.topSocket) this.drawFrameAxes(orientation.topSocket, 0.55);
    }
    if (debug.enabled && debug.pivots) this.drawPivot(orientation.pivot, selected ? 0xffffff : color);
    if (debug.enabled && debug.facing) this.drawFacingArrow(orientation.pivot, 1.2, color);
  }

  private drawConnector(connector: HeightConnector): void {
    const from = vec3ToThree(connector.from.position);
    const to = vec3ToThree(connector.to.position);
    const color = connector.kind === "ramp" ? 0xf6c453 : connector.kind === "platform-link" ? 0x74f5ff : 0xffffff;
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([from, to]),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.82 })
    );
    this.root.add(line);
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), new THREE.MeshBasicMaterial({ color }));
    marker.position.copy(to);
    this.root.add(marker);
  }

  private drawTower(tower: TowerPiece, world: ReturnType<ThreeRendererOptions["getWorld"]>, debug: ReturnType<ThreeRendererOptions["getDebugOptions"]>): void {
    const fence = world.pieces.find((piece): piece is Extract<BasePiece, { kind: "fence-tl" }> => piece.id === tower.fenceId && piece.kind === "fence-tl");
    const frame = towerOrientation(tower, fence);
    const group = this.createFrameGroup(frame);
    this.root.add(group);

    const state = structureState(world.structures, tower.id);
    const material = materialColor(tintHex(0xf9f4dd, structureTintFactor(state)), 0.48);
    material.transparent = state?.integrity === "destroyed";
    material.opacity = state?.integrity === "destroyed" ? 0.22 : 1;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(tower.radius, tower.radius, tower.height, 18), material);
    shaft.position.set(0, tower.height * 0.5, 0);
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    group.add(shaft);

    const crown = new THREE.Mesh(new THREE.SphereGeometry(tower.radius * 1.8, 18, 12), material);
    crown.position.set(0, tower.height + tower.radius * 1.6, 0);
    crown.castShadow = true;
    group.add(crown);

    if (debug.enabled && debug.pivots) this.drawPivot(frame, 0xf9f4dd);
    if (debug.enabled && debug.axes) this.drawFrameAxes(frame, 0.55);
  }

  private drawActor(actor: Actor, debug: ReturnType<ThreeRendererOptions["getDebugOptions"]>): void {
    const frame = actorOrientation(actor);
    const color = actorColor(actor);
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(actor.radius, actor.radius, actor.height, 18),
      materialColor(color, 0.58)
    );
    mesh.position.set(actor.position.x, actor.baseY + actor.height * 0.5, actor.position.z);
    mesh.castShadow = true;
    this.root.add(mesh);

    if (debug.enabled && debug.pivots) this.drawPivot(frame, color);
    if (debug.enabled && debug.axes) this.drawFrameAxes(frame, actor.kind === "boss" ? 0.9 : 0.6);
    if (debug.enabled && debug.facing) this.drawFacingArrow(frame, actor.kind === "boss" ? 1.4 : 1, color);
  }

  private drawDebugContact(contact: ReturnType<ThreeRendererOptions["getDebugContacts"]>[number]): void {
    const color = contact.actorKind === "boss" ? 0xe9609b : 0xf2a65a;
    this.root.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(contact.origin.x, 0.1, contact.origin.z),
          new THREE.Vector3(contact.point.x, 0.1, contact.point.z)
        ]),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.82 })
      )
    );
  }

  private drawAiTarget(entry: AiDebugState): void {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.018, 8, 24),
      new THREE.MeshBasicMaterial({ color: entry.actorKind === "boss" ? 0xe9609b : 0x74f5ff })
    );
    mesh.rotation.x = Math.PI * 0.5;
    mesh.position.set(entry.targetPoint.x, 0.08 + (entry.visible ? 0.02 : 0), entry.targetPoint.z);
    this.root.add(mesh);
  }

  private drawAiRoute(entry: AiDebugState): void {
    if (entry.waypoints.length < 2) return;
    const points = entry.waypoints.map((waypoint) => new THREE.Vector3(waypoint.point.x, waypoint.baseY + 0.12, waypoint.point.z));
    this.root.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: entry.actorKind === "boss" ? 0xe9609b : 0x74f5ff, transparent: true, opacity: 0.7 })
      )
    );
  }

  private drawNavigationSamples(entry: AiDebugState): void {
    for (const sample of entry.navigationSamples) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.42, 0.42),
        new THREE.MeshBasicMaterial({ color: sample.navigable ? 0x62d26f : 0xe9609b, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
      );
      mesh.rotation.x = -Math.PI * 0.5;
      mesh.position.set(sample.point.x, 0.06, sample.point.z);
      this.root.add(mesh);
    }
  }

  private drawValidationIssues(): void {
    for (const issue of this.options.getValidationIssues()) {
      const color = issue.severity === "error" ? 0xe9609b : issue.severity === "warning" ? 0xf6c453 : 0x74f5ff;
      const marker = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.13, 0),
        new THREE.MeshBasicMaterial({ color })
      );
      marker.position.set(issue.position.x, issue.position.y + 0.2, issue.position.z);
      this.root.add(marker);
    }
  }

  private drawStructuralDamage(world: ReturnType<ThreeRendererOptions["getWorld"]>): void {
    for (const state of Object.values(world.structures)) {
      if (!state.lastImpactPoint) continue;
      const color = state.integrity === "destroyed" ? 0xe9609b : state.integrity === "damaged" ? 0xf6c453 : 0x74f5ff;
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(state.integrity === "destroyed" ? 0.13 : 0.09, 14, 12),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
      );
      marker.position.set(state.lastImpactPoint.x, 0.18, state.lastImpactPoint.z);
      this.root.add(marker);
      const pressureHeight = Math.min(1.4, 0.18 + state.pressure * 0.08);
      const column = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, pressureHeight, 8),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.42 })
      );
      column.position.set(state.lastImpactPoint.x, pressureHeight * 0.5, state.lastImpactPoint.z);
      this.root.add(column);
    }

    for (const entry of world.combatLog.slice(-10)) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.1, 0.014, 8, 20),
        new THREE.MeshBasicMaterial({ color: entry.kind === "destroyed" ? 0xe9609b : 0xf2a65a, transparent: true, opacity: 0.82 })
      );
      ring.rotation.x = Math.PI * 0.5;
      ring.position.set(entry.point.x, 0.06, entry.point.z);
      this.root.add(ring);
    }
  }

  private localPostPositions(length: number): number[] {
    const count = Math.max(2, Math.ceil(length / 1.6) + 1);
    return Array.from({ length: count }, (_, index) => -length * 0.5 + (length * index) / (count - 1));
  }

  private railHeights(height: number): number[] {
    return [0.72, Math.max(1.4, height * 0.55), height - 0.32];
  }

  private addPost(group: THREE.Group, localForward: number, height: number, radius: number, material: THREE.Material): void {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 18), material);
    mesh.position.set(localForward, height * 0.5, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  private addRail(group: THREE.Group, length: number, y: number, thickness: number, material: THREE.Material): void {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(length, thickness, thickness), material);
    mesh.position.set(0, y, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  private addGatePanel(group: THREE.Group, piece: Extract<BasePiece, { kind: "gate" }>, length: number, material: THREE.Material): void {
    const lift = piece.state === "open" ? piece.height - 0.75 : 0;
    for (const y of this.railHeights(piece.height)) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(length, piece.thickness * 0.72, piece.thickness * 0.72), material);
      bar.position.set(0, y + lift, 0);
      bar.castShadow = true;
      bar.receiveShadow = true;
      group.add(bar);
    }
  }

  private drawCapsuleFootprint(capsule: ReturnType<typeof pieceCapsule>, color: number, baseY: number): void {
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.82 });
    const points = [
      new THREE.Vector3(capsule.segment.a.x, baseY + 0.05, capsule.segment.a.z),
      new THREE.Vector3(capsule.segment.b.x, baseY + 0.05, capsule.segment.b.z)
    ];
    this.root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }

  private drawBounds(piece: BasePiece, selected: boolean): void {
    const bounds = pieceHorizontalBounds(piece);
    const color = selected ? 0xffffff : 0x8d99ae;
    const points = [
      new THREE.Vector3(bounds.min.x, piece.baseY + 0.075, bounds.min.z),
      new THREE.Vector3(bounds.max.x, piece.baseY + 0.075, bounds.min.z),
      new THREE.Vector3(bounds.max.x, piece.baseY + 0.075, bounds.max.z),
      new THREE.Vector3(bounds.min.x, piece.baseY + 0.075, bounds.max.z),
      new THREE.Vector3(bounds.min.x, piece.baseY + 0.075, bounds.min.z)
    ];
    this.root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.54 })));
  }

  private drawSockets(piece: BasePiece): void {
    for (const socket of pieceSockets(piece)) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(socket.kind === "top" ? 0.1 : 0.07, 16, 10),
        new THREE.MeshBasicMaterial({ color: socket.kind === "top" ? 0xffffff : 0x74f5ff })
      );
      mesh.position.set(socket.position.x, socket.position.y, socket.position.z);
      this.root.add(mesh);
    }
  }

  private drawPivot(frame: ReturnType<typeof pieceOrientation>["pivot"], color: number): void {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), new THREE.MeshBasicMaterial({ color }));
    mesh.position.copy(vec3ToThree(frame.origin));
    this.root.add(mesh);
  }

  private drawFrameAxes(frame: ReturnType<typeof pieceOrientation>["pivot"], scaleFactor: number): void {
    const origin = vec3ToThree(frame.origin);
    const forward = vec3ToThree({
      x: frame.origin.x + frame.axes.forward.x * scaleFactor,
      y: frame.origin.y + frame.axes.forward.y * scaleFactor,
      z: frame.origin.z + frame.axes.forward.z * scaleFactor
    });
    const right = vec3ToThree({
      x: frame.origin.x + frame.axes.right.x * scaleFactor,
      y: frame.origin.y + frame.axes.right.y * scaleFactor,
      z: frame.origin.z + frame.axes.right.z * scaleFactor
    });
    const up = vec3ToThree({
      x: frame.origin.x + frame.axes.up.x * scaleFactor,
      y: frame.origin.y + frame.axes.up.y * scaleFactor,
      z: frame.origin.z + frame.axes.up.z * scaleFactor
    });
    this.root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([origin, forward]), new THREE.LineBasicMaterial({ color: 0x62d26f })));
    this.root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([origin, right]), new THREE.LineBasicMaterial({ color: 0xf6c453 })));
    this.root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([origin, up]), new THREE.LineBasicMaterial({ color: 0xffffff })));
  }

  private drawFacingArrow(frame: ReturnType<typeof pieceOrientation>["pivot"], length: number, color: number): void {
    const from = vec3ToThree(frame.origin);
    const to = vec3ToThree({
      x: frame.origin.x + frame.axes.forward.x * length,
      y: frame.origin.y + frame.axes.forward.y * length,
      z: frame.origin.z + frame.axes.forward.z * length
    });
    this.root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, to]), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.88 })));
  }

  private createFrameGroup(frame: ReturnType<typeof pieceOrientation>["pivot"]): THREE.Group {
    const group = new THREE.Group();
    const matrix = new THREE.Matrix4();
    const right = frame.axes.right;
    const up = frame.axes.up;
    const forward = frame.axes.forward;
    matrix.makeBasis(
      new THREE.Vector3(forward.x, forward.y, forward.z),
      new THREE.Vector3(up.x, up.y, up.z),
      new THREE.Vector3(right.x, right.y, right.z)
    );
    group.matrixAutoUpdate = false;
    matrix.setPosition(frame.origin.x, frame.origin.y, frame.origin.z);
    group.matrix.copy(matrix);
    group.matrix.decompose(group.position, group.quaternion, group.scale);
    return group;
  }

  private disposeGroup(group: THREE.Object3D): void {
    group.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.geometry.dispose();
        const material = Array.isArray(node.material) ? node.material : [node.material];
        material.forEach((entry) => entry.dispose());
      }
      if (node instanceof THREE.Line) {
        node.geometry.dispose();
        const material = Array.isArray(node.material) ? node.material : [node.material];
        material.forEach((entry) => entry.dispose());
      }
    });
  }
}
