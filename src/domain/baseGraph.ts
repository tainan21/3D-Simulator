import { pieceSockets, type BasePiece } from "./canonical";
import { distance, type Vec2 } from "../kernel/vector";

export type BaseGraphNode = Readonly<{
  id: string;
  position: Vec2;
}>;

export type BaseGraphEdge = Readonly<{
  id: string;
  pieceId: string;
  kind: BasePiece["kind"];
  from: string;
  to: string;
  length: number;
  structuralWeight: number;
}>;

export type BaseGraphSocket = Readonly<{
  id: string;
  pieceId: string;
  kind: "endpoint" | "top";
  position: { x: number; y: number; z: number };
}>;

export type BaseGraph = Readonly<{
  nodes: BaseGraphNode[];
  edges: BaseGraphEdge[];
  sockets: BaseGraphSocket[];
}>;

function key(point: Vec2): string {
  return `${point.x.toFixed(4)}:${point.z.toFixed(4)}`;
}

function structuralWeight(piece: BasePiece): number {
  if (piece.kind === "fence-tl") return 2.3;
  if (piece.kind === "gate") return piece.state === "closed" ? 1.4 : 0.6;
  return 1;
}

export function buildBaseGraph(pieces: BasePiece[]): BaseGraph {
  const nodeMap = new Map<string, BaseGraphNode>();
  const sockets: BaseGraphSocket[] = [];

  for (const piece of pieces) {
    const aKey = key(piece.a);
    const bKey = key(piece.b);
    if (!nodeMap.has(aKey)) nodeMap.set(aKey, { id: `node-${nodeMap.size + 1}`, position: piece.a });
    if (!nodeMap.has(bKey)) nodeMap.set(bKey, { id: `node-${nodeMap.size + 1}`, position: piece.b });
    sockets.push(
      ...pieceSockets(piece).map((socket) => ({
        id: socket.id,
        pieceId: piece.id,
        kind: socket.kind,
        position: socket.position
      }))
    );
  }

  const edges: BaseGraphEdge[] = pieces.map((piece) => ({
    id: `edge-${piece.id}`,
    pieceId: piece.id,
    kind: piece.kind,
    from: nodeMap.get(key(piece.a))!.id,
    to: nodeMap.get(key(piece.b))!.id,
    length: distance(piece.a, piece.b),
    structuralWeight: structuralWeight(piece)
  }));

  return {
    nodes: [...nodeMap.values()],
    edges,
    sockets
  };
}
