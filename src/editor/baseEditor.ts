import { distance, snapToGrid, type Vec2 } from "../kernel/vector";
import { CELL_SIZE, SOCKET_SNAP_RADIUS } from "../kernel/worldUnits";
import {
  attachTower,
  createFence,
  createFenceTL,
  createGate,
  createHeightConnector,
  createTopSocketLink,
  createTower,
  pieceMidpoint,
  pieceSockets,
  type BasePiece,
  type FenceTLPiece,
  type GateState,
  type HeightConnector,
  type HeightConnectorKind,
  type HeightLayer,
  type PieceHeightOptions,
  type PieceKind,
  type TowerPiece
} from "../domain/canonical";

export type BaseSaveData = Readonly<{
  version: 2;
  pieces: BasePiece[];
  towers: TowerPiece[];
  connectors: HeightConnector[];
}>;

export type PlacementTool = "fence" | "fence-tl" | "gate";
export type SegmentPreview = Readonly<{
  tool: PlacementTool;
  a: Vec2;
  b: Vec2;
  length: number;
}>;

export class BaseEditor {
  private nextPiece = 1;
  private nextTower = 1;
  private nextConnector = 1;
  pieces: BasePiece[];
  towers: TowerPiece[];
  connectors: HeightConnector[];

  constructor(save?: BaseSaveData) {
    this.pieces = save ? [...save.pieces] : [];
    this.towers = save ? [...save.towers] : [];
    this.connectors = save ? [...save.connectors] : [];
    this.seedCounters();
  }

  placeSegment(tool: PlacementTool, rawA: Vec2, rawB: Vec2, gateState: GateState = "closed", options: PieceHeightOptions = {}): BasePiece {
    const a = this.snapPoint(rawA);
    const b = this.snapPoint(rawB);
    const id = this.newPieceId(tool);
    const piece =
      tool === "fence"
        ? createFence(id, a, b, options)
        : tool === "fence-tl"
          ? createFenceTL(id, a, b, undefined, options)
          : createGate(id, a, b, gateState, options);
    this.pieces.push(piece);
    return piece;
  }

  previewSegment(tool: PlacementTool, rawA: Vec2, rawB: Vec2): SegmentPreview {
    const a = this.snapPoint(rawA);
    const b = this.snapPoint(rawB);
    return {
      tool,
      a,
      b,
      length: distance(a, b)
    };
  }

  placeConnector(
    kind: Exclude<HeightConnectorKind, "top-socket-link">,
    from: Vec2,
    to: Vec2,
    fromLayer: HeightLayer,
    toLayer: HeightLayer
  ): HeightConnector {
    const snappedFrom = this.snapPoint(from);
    const snappedTo = this.snapPoint(to);
    const connector = createHeightConnector(
      this.newConnectorId(kind),
      kind,
      {
        position: { x: snappedFrom.x, y: fromLayer * 2.4, z: snappedFrom.z },
        layer: fromLayer
      },
      {
        position: { x: snappedTo.x, y: toLayer * 2.4, z: snappedTo.z },
        layer: toLayer
      }
    );
    this.connectors.push(connector);
    return connector;
  }

  attachTowerToFenceTL(fenceId: string): TowerPiece {
    const index = this.pieces.findIndex((piece): piece is FenceTLPiece => piece.id === fenceId && piece.kind === "fence-tl");
    if (index < 0) throw new Error(`Fence TL ${fenceId} not found`);
    const fence = this.pieces[index] as FenceTLPiece;
    const tower = createTower(this.newTowerId(), fence);
    this.towers.push(tower);
    this.pieces[index] = attachTower(fence, tower.id);
    const connector = createTopSocketLink(this.newConnectorId("top-socket-link"), fence);
    this.connectors = [...this.connectors.filter((entry) => !(entry.kind === "top-socket-link" && entry.from.pieceId === fence.id)), connector];
    return tower;
  }

  setGateState(gateId: string, state: GateState): void {
    this.pieces = this.pieces.map((piece) => (piece.id === gateId && piece.kind === "gate" ? { ...piece, state } : piece));
  }

  deleteNear(point: Vec2, radius = 0.3): BasePiece | HeightConnector | undefined {
    const pieceIndex = this.pieces.findIndex((piece) =>
      pieceSockets(piece).some((socket) => distance({ x: socket.position.x, z: socket.position.z }, point) <= radius)
    );
    if (pieceIndex >= 0) {
      const [removed] = this.pieces.splice(pieceIndex, 1);
      this.towers = this.towers.filter((tower) => tower.fenceId !== removed.id);
      this.connectors = this.connectors.filter(
        (connector) => connector.from.pieceId !== removed.id && connector.to.pieceId !== removed.id
      );
      return removed;
    }

    const connectorIndex = this.connectors.findIndex(
      (connector) =>
        distance({ x: connector.from.position.x, z: connector.from.position.z }, point) <= radius ||
        distance({ x: connector.to.position.x, z: connector.to.position.z }, point) <= radius
    );
    if (connectorIndex < 0) return undefined;
    const [removedConnector] = this.connectors.splice(connectorIndex, 1);
    return removedConnector;
  }

  serialize(): BaseSaveData {
    return {
      version: 2,
      pieces: this.pieces.map((piece) => ({ ...piece })),
      towers: this.towers.map((tower) => ({ ...tower })),
      connectors: this.connectors.map((connector) => ({
        ...connector,
        from: { ...connector.from, position: { ...connector.from.position } },
        to: { ...connector.to, position: { ...connector.to.position } }
      }))
    };
  }

  static deserialize(save: BaseSaveData): BaseEditor {
    return new BaseEditor(save);
  }

  setPieceLayer(pieceId: string, heightLayer: HeightLayer): void {
    this.pieces = this.pieces.map((piece) => {
      if (piece.id !== pieceId) return piece;
      return { ...piece, heightLayer, baseY: heightLayer * 2.4 };
    });
    this.syncTowerAnchors();
  }

  private syncTowerAnchors(): void {
    this.towers = this.towers.map((tower) => {
      const fence = this.pieces.find((piece): piece is FenceTLPiece => piece.id === tower.fenceId && piece.kind === "fence-tl");
      if (!fence) return tower;
      const center = pieceMidpoint(fence);
      return {
        ...tower,
        heightLayer: fence.heightLayer,
        anchor: { x: center.x, y: fence.baseY + fence.height, z: center.z }
      };
    });
    this.connectors = this.connectors.map((connector) => {
      if (connector.kind !== "top-socket-link" || !connector.from.pieceId) return connector;
      const fence = this.pieces.find((piece): piece is FenceTLPiece => piece.id === connector.from.pieceId && piece.kind === "fence-tl");
      if (!fence) return connector;
      const center = pieceMidpoint(fence);
      return createTopSocketLink(connector.id, fence);
    });
  }

  private snapPoint(point: Vec2): Vec2 {
    for (const piece of this.pieces) {
      for (const socket of pieceSockets(piece)) {
        if (socket.kind !== "endpoint") continue;
        const socketPoint = { x: socket.position.x, z: socket.position.z };
        if (distance(point, socketPoint) <= SOCKET_SNAP_RADIUS) return socketPoint;
      }
    }
    return snapToGrid(point, CELL_SIZE);
  }

  private newPieceId(kind: PieceKind): string {
    return `${kind}-${this.nextPiece++}`;
  }

  private newTowerId(): string {
    return `tower-${this.nextTower++}`;
  }

  private newConnectorId(kind: HeightConnectorKind): string {
    return `${kind}-${this.nextConnector++}`;
  }

  private seedCounters(): void {
    const pieceMax = this.pieces
      .map((piece) => Number(piece.id.split("-").at(-1)))
      .filter(Number.isFinite)
      .reduce((max, value) => Math.max(max, value), 0);
    const towerMax = this.towers
      .map((tower) => Number(tower.id.split("-").at(-1)))
      .filter(Number.isFinite)
      .reduce((max, value) => Math.max(max, value), 0);
    const connectorMax = this.connectors
      .map((connector) => Number(connector.id.split("-").at(-1)))
      .filter(Number.isFinite)
      .reduce((max, value) => Math.max(max, value), 0);
    this.nextPiece = pieceMax + 1;
    this.nextTower = towerMax + 1;
    this.nextConnector = connectorMax + 1;
  }
}
