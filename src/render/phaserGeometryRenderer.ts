import * as Phaser from "phaser";
import {
  actorCircle,
  baseCoreCircle,
  pieceCapsule,
  pieceHorizontalBounds,
  pieceSockets,
  type Actor,
  type BasePiece,
  type HeightConnector,
  type TowerPiece
} from "../domain/canonical";
import type { DebugContact, DebugOverlayOptions } from "../domain/debug";
import type { SegmentPreview } from "../editor/baseEditor";
import { actorOrientation, baseCoreOrientation, pieceOrientation, towerOrientation } from "../domain/orientation";
import { orientedBoxCorners } from "../kernel/shapes";
import { PIXELS_PER_UNIT } from "../kernel/worldUnits";
import { iso, project2D, project25D, type Camera2D, type ScreenPoint, type Viewport } from "../kernel/projections";
import { midpoint, type Vec2, type Vec3 } from "../kernel/vector";
import type { AiDebugState } from "../simulation/aiTypes";
import type { RenderDataProvider, ViewportCamera2D } from "./contracts";

export type PhaserMode = "2d" | "25d";

export type PhaserRendererOptions = RenderDataProvider & {
  parent: HTMLElement;
  mode: PhaserMode;
  getCamera: () => ViewportCamera2D;
  getDraftSegment: () => SegmentPreview | undefined;
  onWorldClick: (point: Vec2) => void;
  onWorldHover: (point: Vec2) => void;
  interactionEnabled?: boolean;
};

function colorForPiece(piece: BasePiece): number {
  if (piece.kind === "fence-tl") return 0xf6c453;
  if (piece.kind === "gate") return piece.state === "closed" ? 0xf16d6d : 0x62d26f;
  return 0x9eb7ff;
}

function actorColor(actor: Actor): number {
  if (actor.kind === "player") return 0x7af0d4;
  if (actor.kind === "boss") return 0xe9609b;
  return 0xf2a65a;
}

export class PhaserGeometryRenderer {
  private game?: Phaser.Game;
  private readonly options: PhaserRendererOptions;
  private readonly resizeHandler = () => this.resize();

  constructor(options: PhaserRendererOptions) {
    this.options = options;
  }

  mount(): void {
    const scene = new GeometryScene(this.options);
    this.game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: this.options.parent,
      width: this.options.parent.clientWidth,
      height: this.options.parent.clientHeight,
      backgroundColor: "#0f141b",
      scene,
      scale: {
        mode: Phaser.Scale.NONE
      }
    });
    window.addEventListener("resize", this.resizeHandler);
  }

  destroy(): void {
    window.removeEventListener("resize", this.resizeHandler);
    this.game?.destroy(true);
    this.game = undefined;
  }

  private resize(): void {
    if (!this.game) return;
    this.game.scale.resize(this.options.parent.clientWidth, this.options.parent.clientHeight);
  }
}

class GeometryScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private badgeText?: Phaser.GameObjects.Text;
  private draftText?: Phaser.GameObjects.Text;
  private readonly options: PhaserRendererOptions;

  constructor(options: PhaserRendererOptions) {
    super({ key: `geometry-${options.mode}` });
    this.options = options;
  }

  create(): void {
    this.graphics = this.add.graphics();
    if (this.options.interactionEnabled !== false) {
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        this.options.onWorldClick(this.screenToWorld(pointer.x, pointer.y));
      });
      this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        this.options.onWorldHover(this.screenToWorld(pointer.x, pointer.y));
      });
    }
  }

  update(): void {
    const viewport = this.viewport();
    const world = this.options.getWorld();
    this.graphics.clear();
    this.drawBackground(viewport);
    if (this.options.getDebugOptions().enabled && this.options.getDebugOptions().influence) {
      this.drawInfluenceField();
    }
    if (this.options.mode === "2d") {
      this.draw2D(world, viewport);
    } else {
      this.draw25D(world, viewport);
    }
  }

  private viewport(): Viewport {
    return { width: this.scale.width, height: this.scale.height };
  }

  private camera(): Camera2D {
    return this.options.getCamera();
  }

  private projectGround(point: Vec2): ScreenPoint {
    const viewport = this.viewport();
    const camera = this.camera();
    return this.options.mode === "2d" ? project2D(point, camera, viewport) : project25D({ x: point.x, y: 0, z: point.z }, camera, viewport);
  }

  private project(point: Vec3): ScreenPoint {
    const viewport = this.viewport();
    const camera = this.camera();
    return this.options.mode === "2d" ? project2D({ x: point.x, z: point.z }, camera, viewport) : project25D(point, camera, viewport);
  }

  private screenToWorld(x: number, y: number): Vec2 {
    const viewport = this.viewport();
    const camera = this.camera();
    const px = (x - viewport.width * 0.5) / (camera.zoom * PIXELS_PER_UNIT);
    if (this.options.mode === "2d") {
      return { x: camera.target.x + px, z: camera.target.z + (y - viewport.height * 0.5) / (camera.zoom * PIXELS_PER_UNIT) };
    }
    const cameraIso = iso(camera.target);
    const u = cameraIso.x + px;
    const v = cameraIso.y + (y - viewport.height * 0.5) / (camera.zoom * PIXELS_PER_UNIT);
    return { x: v + u * 0.5, z: v - u * 0.5 };
  }

  private drawBackground(viewport: Viewport): void {
    this.graphics.fillStyle(0x0f141b, 1);
    this.graphics.fillRect(0, 0, viewport.width, viewport.height);
    this.graphics.lineStyle(1, 0x263142, 0.55);
    for (let x = -18; x <= 18; x += 1) {
      this.strokeSegment({ x, z: -18 }, { x, z: 18 }, 0x263142, 0.34, 1);
      this.strokeSegment({ x: -18, z: x }, { x: 18, z: x }, 0x263142, 0.34, 1);
    }
    this.strokeSegment({ x: -18, z: 0 }, { x: 18, z: 0 }, 0x40506b, 0.7, 1.4);
    this.strokeSegment({ x: 0, z: -18 }, { x: 0, z: 18 }, 0x40506b, 0.7, 1.4);
  }

  private drawInfluenceField(): void {
    for (const cell of this.options.getInfluenceField().cells) {
      const point = this.projectGround(cell.center);
      const color = cell.score > 1 ? 0xe9609b : cell.deadZone ? 0xf6c453 : 0x62d26f;
      const alpha = Math.min(0.22, 0.05 + Math.abs(cell.score) * 0.045);
      this.graphics.fillStyle(color, alpha);
      this.graphics.fillRect(point.x - 10, point.y - 10, 20, 20);
    }
  }

  private draw2D(world: ReturnType<PhaserRendererOptions["getWorld"]>, viewport: Viewport): void {
    this.drawBaseCore2D(world);
    for (const connector of world.connectors) this.drawConnector2D(connector);
    for (const piece of world.pieces) this.drawPieceFootprint(piece, world.selectedId === piece.id);
    this.drawTowers2D(world.towers);
    for (const actor of world.actors) this.drawActor2D(actor);
    this.drawDebugOverlays(world, this.options.getDebugContacts(), this.options.getDebugOptions());
    this.drawDraftSegment();
    this.drawModeBadge(viewport, "Studio 2D tecnico");
  }

  private draw25D(world: ReturnType<PhaserRendererOptions["getWorld"]>, viewport: Viewport): void {
    const drawItems = [
      { depth: world.baseCore.position.x + world.baseCore.position.z, draw: () => this.drawBaseCore25D(world) },
      ...world.connectors.map((connector) => ({ depth: connector.from.position.x + connector.from.position.z + 0.1, draw: () => this.drawConnector25D(connector) })),
      ...world.pieces.map((piece) => ({ depth: Math.max(piece.a.x + piece.a.z, piece.b.x + piece.b.z) + piece.baseY * 0.05, draw: () => this.drawPiece25D(piece, world.selectedId === piece.id) })),
      ...world.actors.map((actor) => ({ depth: actor.position.x + actor.position.z + actor.baseY * 0.05 + 0.2, draw: () => this.drawActor25D(actor) })),
      ...world.towers.map((tower) => ({ depth: tower.anchor.x + tower.anchor.z + 0.4, draw: () => this.drawTower25D(tower) }))
    ].sort((a, b) => a.depth - b.depth);
    drawItems.forEach((item) => item.draw());
    this.drawDebugOverlays(world, this.options.getDebugContacts(), this.options.getDebugOptions());
    this.drawDraftSegment();
    this.drawModeBadge(viewport, "Studio 2.5D primario");
  }

  private drawDraftSegment(): void {
    const draft = this.options.getDraftSegment();
    if (!draft || draft.length <= 0.01) {
      this.draftText?.setVisible(false);
      return;
    }

    const color = draft.tool === "fence-tl" ? 0xf6c453 : draft.tool === "gate" ? 0x62d26f : 0x74f5ff;
    const a = this.projectGround(draft.a);
    const b = this.projectGround(draft.b);
    this.graphics.lineStyle(3, color, 0.9);
    this.graphics.lineBetween(a.x, a.y, b.x, b.y);
    this.graphics.lineStyle(1, 0xffffff, 0.8);
    this.graphics.strokeCircle(a.x, a.y, 8);
    this.graphics.strokeCircle(b.x, b.y, 8);
    const mid = { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 };
    if (!this.draftText) {
      this.draftText = this.add.text(mid.x, mid.y, "", {
        color: "#eef3ff",
        fontFamily: "Arial",
        fontSize: "12px",
        backgroundColor: "rgba(0,0,0,0.45)",
        padding: { x: 5, y: 3 }
      });
      this.draftText.setDepth(1001);
    }
    this.draftText.setText(`${draft.length.toFixed(1)} m`).setPosition(mid.x + 8, mid.y - 18).setVisible(true);
  }

  private drawPieceFootprint(piece: BasePiece, selected: boolean): void {
    const capsule = pieceCapsule(piece);
    const color = colorForPiece(piece);
    const width = Math.max(2, capsule.radius * 2 * PIXELS_PER_UNIT * this.camera().zoom);
    this.strokeSegment(piece.a, piece.b, color, 0.42, width);
    for (const endpoint of [piece.a, piece.b]) {
      const p = this.projectGround(endpoint);
      this.graphics.fillStyle(color, 0.9);
      this.graphics.fillCircle(p.x, p.y, Math.max(4, width * 0.5));
    }
    if (piece.kind === "gate" && piece.state === "open") this.drawGateOpenInterval(piece);
    if (selected) this.drawBounds(piece);
  }

  private drawPiece25D(piece: BasePiece, selected: boolean): void {
    const color = colorForPiece(piece);
    this.drawPieceFootprint(piece, selected);
    for (const endpoint of [piece.a, piece.b]) {
      const base = this.project({ x: endpoint.x, y: piece.baseY, z: endpoint.z });
      const top = this.project({ x: endpoint.x, y: piece.baseY + piece.height, z: endpoint.z });
      this.graphics.lineStyle(piece.kind === "fence-tl" ? 7 : 5, color, 0.98);
      this.graphics.lineBetween(base.x, base.y, top.x, top.y);
      this.graphics.fillStyle(0x0b0d12, 0.5);
      this.graphics.fillCircle(base.x, base.y, 5);
    }
    const railHeights = [0.7, 1.65, piece.height - 0.32];
    for (const y of railHeights) {
      const a = this.project({ x: piece.a.x, y: piece.baseY + y, z: piece.a.z });
      const b = this.project({ x: piece.b.x, y: piece.baseY + y, z: piece.b.z });
      this.graphics.lineStyle(piece.kind === "fence-tl" ? 5 : 4, color, 0.94);
      this.graphics.lineBetween(a.x, a.y, b.x, b.y);
    }
    if (piece.kind === "fence-tl") {
      const top = this.project({ x: midpoint(piece.a, piece.b).x, y: piece.baseY + piece.height, z: midpoint(piece.a, piece.b).z });
      this.graphics.lineStyle(2, 0xffffff, 0.9);
      this.graphics.strokeCircle(top.x, top.y, 8);
      this.graphics.fillStyle(0xffffff, 0.28);
      this.graphics.fillCircle(top.x, top.y, 4);
    }
  }

  private drawConnector2D(connector: HeightConnector): void {
    const from = this.projectGround({ x: connector.from.position.x, z: connector.from.position.z });
    const to = this.projectGround({ x: connector.to.position.x, z: connector.to.position.z });
    const color = connector.kind === "ramp" ? 0xf6c453 : connector.kind === "platform-link" ? 0x74f5ff : 0xffffff;
    this.graphics.lineStyle(3, color, 0.75);
    this.graphics.lineBetween(from.x, from.y, to.x, to.y);
  }

  private drawConnector25D(connector: HeightConnector): void {
    const from = this.project(connector.from.position);
    const to = this.project(connector.to.position);
    const color = connector.kind === "ramp" ? 0xf6c453 : connector.kind === "platform-link" ? 0x74f5ff : 0xffffff;
    this.graphics.lineStyle(3, color, 0.75);
    this.graphics.lineBetween(from.x, from.y, to.x, to.y);
    this.graphics.fillStyle(color, 0.55);
    this.graphics.fillCircle(to.x, to.y, 4);
  }

  private drawGateOpenInterval(piece: BasePiece): void {
    const a = this.projectGround({
      x: piece.a.x + (piece.b.x - piece.a.x) * 0.15,
      z: piece.a.z + (piece.b.z - piece.a.z) * 0.15
    });
    const b = this.projectGround({
      x: piece.a.x + (piece.b.x - piece.a.x) * 0.85,
      z: piece.a.z + (piece.b.z - piece.a.z) * 0.85
    });
    this.graphics.lineStyle(3, 0x62d26f, 1);
    this.graphics.lineBetween(a.x, a.y, b.x, b.y);
  }

  private drawTowers2D(towers: TowerPiece[]): void {
    for (const tower of towers) {
      const p = this.projectGround({ x: tower.anchor.x, z: tower.anchor.z });
      this.graphics.lineStyle(2, 0xffffff, 0.95);
      this.graphics.strokeCircle(p.x, p.y, 8);
      this.graphics.fillStyle(0xffffff, 0.2);
      this.graphics.fillCircle(p.x, p.y, 4);
    }
  }

  private drawBaseCore2D(world: ReturnType<PhaserRendererOptions["getWorld"]>): void {
    const circle = baseCoreCircle(world.baseCore);
    const p = this.projectGround(circle.center);
    const radius = circle.radius * PIXELS_PER_UNIT * this.camera().zoom;
    this.graphics.fillStyle(0x6fd39c, 0.28);
    this.graphics.fillCircle(p.x, p.y, radius);
    this.graphics.lineStyle(2, 0x6fd39c, 0.95);
    this.graphics.strokeCircle(p.x, p.y, radius);
  }

  private drawBaseCore25D(world: ReturnType<PhaserRendererOptions["getWorld"]>): void {
    const core = world.baseCore;
    const foot = this.project({ x: core.position.x, y: core.baseY, z: core.position.z });
    const top = this.project({ x: core.position.x, y: core.baseY + core.height, z: core.position.z });
    this.graphics.fillStyle(0x6fd39c, 0.35);
    this.graphics.fillEllipse(foot.x, foot.y, core.radius * 2 * PIXELS_PER_UNIT * this.camera().zoom, core.radius * PIXELS_PER_UNIT * this.camera().zoom);
    this.graphics.lineStyle(8, 0x6fd39c, 0.9);
    this.graphics.lineBetween(foot.x, foot.y, top.x, top.y);
    this.graphics.fillStyle(0x6fd39c, 0.95);
    this.graphics.fillCircle(top.x, top.y, 9);
  }

  private drawTower25D(tower: TowerPiece): void {
    const base = this.project(tower.anchor);
    const top = this.project({ x: tower.anchor.x, y: tower.anchor.y + tower.height, z: tower.anchor.z });
    this.graphics.lineStyle(8, 0xf9f4dd, 0.95);
    this.graphics.lineBetween(base.x, base.y, top.x, top.y);
    this.graphics.fillStyle(0xf9f4dd, 0.9);
    this.graphics.fillCircle(top.x, top.y, 7);
  }

  private drawActor2D(actor: Actor): void {
    const p = this.projectGround(actor.position);
    this.graphics.fillStyle(actorColor(actor), 0.45);
    this.graphics.fillCircle(p.x, p.y, actor.radius * PIXELS_PER_UNIT * this.camera().zoom);
    this.graphics.lineStyle(2, actorColor(actor), 1);
    this.graphics.strokeCircle(p.x, p.y, actor.radius * PIXELS_PER_UNIT * this.camera().zoom);
  }

  private drawActor25D(actor: Actor): void {
    const foot = this.project({ x: actor.position.x, y: actor.baseY, z: actor.position.z });
    const top = this.project({ x: actor.position.x, y: actor.baseY + actor.height, z: actor.position.z });
    this.graphics.fillStyle(actorColor(actor), 0.35);
    this.graphics.fillEllipse(foot.x, foot.y, actor.radius * 2 * PIXELS_PER_UNIT * this.camera().zoom, actor.radius * PIXELS_PER_UNIT * this.camera().zoom);
    this.graphics.lineStyle(actor.kind === "boss" ? 7 : 5, actorColor(actor), 0.95);
    this.graphics.lineBetween(foot.x, foot.y, top.x, top.y);
    this.graphics.fillStyle(actorColor(actor), 0.95);
    this.graphics.fillCircle(top.x, top.y, actor.kind === "boss" ? 13 : 8);
  }

  private drawDebugOverlays(world: ReturnType<PhaserRendererOptions["getWorld"]>, contacts: DebugContact[], options: DebugOverlayOptions): void {
    if (!options.enabled) return;
    const aiDebug = this.options.getAiDebug();
    for (const piece of world.pieces) {
      if (options.bounds) this.drawBounds(piece);
      if (options.sockets) this.drawSockets(piece);
      if (options.endpoints) this.drawEndpoints(piece);
      if (options.colliders) this.drawCapsuleCollider(piece);
      if (options.pivots) this.drawPivot(pieceOrientation(piece).pivot.origin, 0xdde6f7);
      if (options.axes) this.drawAxes(pieceOrientation(piece).pivot, 0.7);
      if (options.facing) this.drawFacing(pieceOrientation(piece).pivot.origin, pieceOrientation(piece).pivot.axes.forward, 0xbcd1ff, 0.9);
    }
    for (const tower of world.towers) {
      const fence = world.pieces.find((piece) => piece.id === tower.fenceId && piece.kind === "fence-tl");
      if (!fence || fence.kind !== "fence-tl") continue;
      const frame = towerOrientation(tower, fence);
      if (options.pivots) this.drawPivot(frame.origin, 0xf9f4dd);
      if (options.axes) this.drawAxes(frame, 0.55);
      if (options.facing) this.drawFacing(frame.origin, frame.axes.forward, 0xf9f4dd, 0.8);
    }
    if (options.pivots) this.drawPivot(baseCoreOrientation(world.baseCore).origin, 0x6fd39c);
    if (options.axes) this.drawAxes(baseCoreOrientation(world.baseCore), 0.65);
    for (const actor of world.actors) {
      const frame = actorOrientation(actor);
      if (options.pivots) this.drawPivot(frame.origin, actorColor(actor));
      if (options.axes) this.drawAxes(frame, actor.kind === "boss" ? 0.9 : 0.6);
      if (options.facing) this.drawFacing(frame.origin, frame.axes.forward, actorColor(actor), actor.kind === "boss" ? 1.2 : 0.9);
    }
    if (options.nearest) for (const contact of contacts) this.drawDebugContact(contact);
    if (options.targets) for (const entry of aiDebug) this.drawAiTarget(entry);
    if (options.routes) for (const entry of aiDebug) this.drawAiRoute(entry);
    if (options.navigation) for (const entry of aiDebug) this.drawNavigationSamples(entry);
    if (options.damage) this.drawStructuralDamage(world);
    if (options.diagnostics) this.drawValidationIssues();
  }

  private drawBounds(piece: BasePiece): void {
    const corners = orientedBoxCorners({ a: piece.a, b: piece.b }, piece.thickness * 0.5);
    this.graphics.lineStyle(1, 0xffffff, 0.75);
    const first = this.projectGround(corners[0]);
    this.graphics.beginPath();
    this.graphics.moveTo(first.x, first.y);
    for (const corner of corners.slice(1)) {
      const p = this.projectGround(corner);
      this.graphics.lineTo(p.x, p.y);
    }
    this.graphics.lineTo(first.x, first.y);
    this.graphics.strokePath();
  }

  private drawSockets(piece: BasePiece): void {
    for (const socket of pieceSockets(piece)) {
      const p = this.project(socket.position);
      this.graphics.lineStyle(2, socket.kind === "top" ? 0xffffff : 0x74f5ff, 0.95);
      this.graphics.strokeCircle(p.x, p.y, socket.kind === "top" ? 7 : 5);
    }
  }

  private drawEndpoints(piece: BasePiece): void {
    for (const point of [piece.a, piece.b]) {
      const p = this.projectGround(point);
      this.graphics.fillStyle(0x74f5ff, 0.95);
      this.graphics.fillCircle(p.x, p.y, 3);
    }
  }

  private drawCapsuleCollider(piece: BasePiece): void {
    const a = this.projectGround(piece.a);
    const b = this.projectGround(piece.b);
    this.graphics.lineStyle(Math.max(2, piece.thickness * PIXELS_PER_UNIT * this.camera().zoom), colorForPiece(piece), 0.14);
    this.graphics.lineBetween(a.x, a.y, b.x, b.y);
  }

  private drawPivot(origin: Vec3, color: number): void {
    const p = this.project(origin);
    this.graphics.lineStyle(1, color, 0.95);
    this.graphics.strokeCircle(p.x, p.y, 4);
  }

  private drawAxes(frame: ReturnType<typeof pieceOrientation>["pivot"], scaleFactor: number): void {
    const origin = this.project(frame.origin);
    const forward = this.project({
      x: frame.origin.x + frame.axes.forward.x * scaleFactor,
      y: frame.origin.y + frame.axes.forward.y * scaleFactor,
      z: frame.origin.z + frame.axes.forward.z * scaleFactor
    });
    const right = this.project({
      x: frame.origin.x + frame.axes.right.x * scaleFactor,
      y: frame.origin.y + frame.axes.right.y * scaleFactor,
      z: frame.origin.z + frame.axes.right.z * scaleFactor
    });
    this.graphics.lineStyle(2, 0x62d26f, 0.9);
    this.graphics.lineBetween(origin.x, origin.y, forward.x, forward.y);
    this.graphics.lineStyle(2, 0xf6c453, 0.9);
    this.graphics.lineBetween(origin.x, origin.y, right.x, right.y);
  }

  private drawFacing(origin: Vec3, forward: Vec3, color: number, length: number): void {
    const from = this.project(origin);
    const to = this.project({ x: origin.x + forward.x * length, y: origin.y + forward.y * length, z: origin.z + forward.z * length });
    this.graphics.lineStyle(2, color, 0.9);
    this.graphics.lineBetween(from.x, from.y, to.x, to.y);
  }

  private drawDebugContact(contact: DebugContact): void {
    const origin = this.projectGround(contact.origin);
    const target = this.projectGround(contact.point);
    this.graphics.lineStyle(2, contact.actorKind === "boss" ? 0xe9609b : 0xf2a65a, 0.8);
    this.graphics.lineBetween(origin.x, origin.y, target.x, target.y);
    this.graphics.fillStyle(0xffffff, 0.9);
    this.graphics.fillCircle(target.x, target.y, 3);
  }

  private drawAiTarget(entry: AiDebugState): void {
    const point = this.projectGround(entry.targetPoint);
    this.graphics.lineStyle(2, entry.actorKind === "boss" ? 0xe9609b : 0x74f5ff, 0.95);
    this.graphics.strokeCircle(point.x, point.y, 8);
  }

  private drawAiRoute(entry: AiDebugState): void {
    if (entry.waypoints.length < 2) return;
    this.graphics.lineStyle(2, entry.actorKind === "boss" ? 0xe9609b : 0x74f5ff, 0.7);
    const first = this.projectGround(entry.waypoints[0].point);
    this.graphics.beginPath();
    this.graphics.moveTo(first.x, first.y);
    for (const waypoint of entry.waypoints.slice(1)) {
      const point = this.projectGround(waypoint.point);
      this.graphics.lineTo(point.x, point.y);
    }
    this.graphics.strokePath();
  }

  private drawNavigationSamples(entry: AiDebugState): void {
    for (const sample of entry.navigationSamples) {
      const point = this.projectGround(sample.point);
      this.graphics.fillStyle(sample.navigable ? 0x62d26f : 0xe9609b, 0.18);
      this.graphics.fillRect(point.x - 7, point.y - 7, 14, 14);
    }
  }

  private drawValidationIssues(): void {
    for (const issue of this.options.getValidationIssues()) {
      const point = this.project(issue.position);
      const color = issue.severity === "error" ? 0xe9609b : issue.severity === "warning" ? 0xf6c453 : 0x74f5ff;
      this.graphics.lineStyle(2, color, 0.95);
      this.graphics.strokeCircle(point.x, point.y, 6);
      this.graphics.lineBetween(point.x - 6, point.y - 6, point.x + 6, point.y + 6);
    }
  }

  private drawStructuralDamage(world: ReturnType<PhaserRendererOptions["getWorld"]>): void {
    for (const state of Object.values(world.structures)) {
      if (!state.lastImpactPoint) continue;
      const point = this.projectGround(state.lastImpactPoint);
      const color = state.integrity === "destroyed" ? 0xe9609b : state.integrity === "damaged" ? 0xf6c453 : 0x74f5ff;
      this.graphics.lineStyle(2, color, 0.95);
      this.graphics.strokeCircle(point.x, point.y, 7);
      this.graphics.lineBetween(point.x, point.y - 8, point.x, point.y - 8 - Math.min(16, state.pressure * 3.2));
    }
    for (const event of world.combatLog.slice(-10)) {
      const point = this.projectGround(event.point);
      this.graphics.lineStyle(2, event.kind === "destroyed" ? 0xe9609b : 0xf2a65a, 0.9);
      this.graphics.strokeCircle(point.x, point.y, event.kind === "destroyed" ? 8 : 5);
    }
  }

  private drawModeBadge(viewport: Viewport, text: string): void {
    const replay = this.options.getReplayState();
    if (!this.badgeText) {
      this.badgeText = this.add.text(18, viewport.height - 34, "", {
        color: "#eef3ff",
        fontFamily: "Arial",
        fontSize: "12px",
        backgroundColor: "rgba(12,18,26,0.72)",
        padding: { x: 8, y: 5 }
      });
      this.badgeText.setDepth(1001);
    }
    this.badgeText.setText(`${text} | replay ${replay.status} f=${replay.frame}/${replay.totalFrames}`).setPosition(18, viewport.height - 34);
  }

  private strokeSegment(a: Vec2, b: Vec2, color: number, alpha: number, width: number): void {
    const pa = this.projectGround(a);
    const pb = this.projectGround(b);
    this.graphics.lineStyle(width, color, alpha);
    this.graphics.lineBetween(pa.x, pa.y, pb.x, pb.y);
  }
}
