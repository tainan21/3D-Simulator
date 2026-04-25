import { boundsForCircle, mergeBounds, type Aabb2D } from "../kernel/shapes";
import { distance, midpoint, perpendicular, scale, sub, type Vec2, type Vec3 } from "../kernel/vector";
import { baseCoreCircle, pieceMidpoint, pieceSockets, type BaseCore, type BasePiece, type HeightConnector, type HeightLayer } from "../domain/canonical";
import type { NavPortal, TopologyRoute, WorldTopology, WorldTopologyEdge, WorldTopologyNode } from "../domain/analysis";

function nodeKey(position: Vec3, heightLayer: HeightLayer): string {
  return `${position.x.toFixed(4)}:${position.y.toFixed(4)}:${position.z.toFixed(4)}:${heightLayer}`;
}

function structuralWeight(piece: BasePiece): number {
  if (piece.kind === "fence-tl") return 2.3;
  if (piece.kind === "gate") return piece.state === "closed" ? 1.6 : 0.7;
  return 1;
}

function ensureNode(
  nodes: Map<string, WorldTopologyNode>,
  position: Vec3,
  kind: WorldTopologyNode["kind"],
  heightLayer: HeightLayer,
  pieceId?: string
): WorldTopologyNode {
  const key = nodeKey(position, heightLayer);
  const existing = nodes.get(key);
  if (existing) return existing;
  const created: WorldTopologyNode = {
    id: `topo-node-${nodes.size + 1}`,
    kind,
    position,
    heightLayer,
    pieceId
  };
  nodes.set(key, created);
  return created;
}

function topologyBounds(pieces: BasePiece[], baseCore: BaseCore): Aabb2D {
  const pieceBounds = pieces.map((piece) => ({
    min: { x: Math.min(piece.a.x, piece.b.x) - 2, z: Math.min(piece.a.z, piece.b.z) - 2 },
    max: { x: Math.max(piece.a.x, piece.b.x) + 2, z: Math.max(piece.a.z, piece.b.z) + 2 }
  }));
  return mergeBounds([...pieceBounds, boundsForCircle(baseCoreCircle(baseCore))]);
}

export function buildWorldTopology(pieces: BasePiece[], connectors: HeightConnector[], baseCore: BaseCore): WorldTopology {
  const nodes = new Map<string, WorldTopologyNode>();
  const edges: WorldTopologyEdge[] = [];
  const portals: NavPortal[] = [];

  const coreNode = ensureNode(
    nodes,
    { x: baseCore.position.x, y: baseCore.baseY, z: baseCore.position.z },
    "base-core",
    baseCore.heightLayer,
    baseCore.id
  );

  for (const piece of pieces) {
    const [startSocket, endSocket] = pieceSockets(piece).filter((socket) => socket.kind === "endpoint");
    const start = ensureNode(nodes, startSocket.position, "piece-endpoint", piece.heightLayer, piece.id);
    const end = ensureNode(nodes, endSocket.position, "piece-endpoint", piece.heightLayer, piece.id);
    const mid = pieceMidpoint(piece);
    const midNode = ensureNode(nodes, { x: mid.x, y: piece.baseY, z: mid.z }, "piece-midpoint", piece.heightLayer, piece.id);
    const length = distance(piece.a, piece.b);
    const traversalCost = length + structuralWeight(piece);
    edges.push({
      id: `topo-edge-${piece.id}:a-b`,
      pieceId: piece.id,
      kind: piece.kind,
      fromNodeId: start.id,
      toNodeId: end.id,
      length,
      structuralWeight: structuralWeight(piece),
      traversalCost
    });
    edges.push({
      id: `topo-edge-${piece.id}:a-mid`,
      pieceId: piece.id,
      kind: piece.kind,
      fromNodeId: start.id,
      toNodeId: midNode.id,
      length: length * 0.5,
      structuralWeight: structuralWeight(piece),
      traversalCost: traversalCost * 0.5
    });
    edges.push({
      id: `topo-edge-${piece.id}:mid-b`,
      pieceId: piece.id,
      kind: piece.kind,
      fromNodeId: midNode.id,
      toNodeId: end.id,
      length: length * 0.5,
      structuralWeight: structuralWeight(piece),
      traversalCost: traversalCost * 0.5
    });
    if (piece.kind === "gate") {
      portals.push({
        id: `portal-${piece.id}`,
        kind: "gate",
        fromNodeId: start.id,
        toNodeId: end.id,
        available: piece.state === "open",
        gateState: piece.state,
        pieceId: piece.id,
        traversalCost: piece.state === "open" ? length * 0.35 : length * 2.8
      });
    }
    if (distance(mid, baseCore.position) <= 8 && piece.heightLayer === baseCore.heightLayer) {
      edges.push({
        id: `topo-edge-${piece.id}:core`,
        pieceId: piece.id,
        kind: piece.kind,
        fromNodeId: midNode.id,
        toNodeId: coreNode.id,
        length: distance(mid, baseCore.position),
        structuralWeight: 0.6,
        traversalCost: distance(mid, baseCore.position) + 0.6
      });
    }
  }

  for (const connector of connectors) {
    const from = ensureNode(nodes, connector.from.position, "connector-end", connector.from.layer, connector.from.pieceId);
    const to = ensureNode(nodes, connector.to.position, "connector-end", connector.to.layer, connector.to.pieceId);
    portals.push({
      id: `portal-${connector.id}`,
      kind: connector.kind,
      fromNodeId: from.id,
      toNodeId: to.id,
      available: true,
      connectorId: connector.id,
      traversalCost: connector.travelCost
    });
  }

  return {
    bounds: topologyBounds(pieces, baseCore),
    nodes: [...nodes.values()],
    edges,
    portals
  };
}

function neighbors(topology: WorldTopology, nodeId: string): Array<{ to: string; cost: number; portalId?: string }> {
  const edgeNeighbors = topology.edges.flatMap((edge) => {
    if (edge.fromNodeId === nodeId) return [{ to: edge.toNodeId, cost: edge.traversalCost }];
    if (edge.toNodeId === nodeId) return [{ to: edge.fromNodeId, cost: edge.traversalCost }];
    return [];
  });
  const portalNeighbors = topology.portals.flatMap((portal) => {
    if (!portal.available) return [];
    if (portal.fromNodeId === nodeId) return [{ to: portal.toNodeId, cost: portal.traversalCost, portalId: portal.id }];
    if (portal.toNodeId === nodeId) return [{ to: portal.fromNodeId, cost: portal.traversalCost, portalId: portal.id }];
    return [];
  });
  return [...edgeNeighbors, ...portalNeighbors];
}

function nearestNodes(topology: WorldTopology, position: Vec3, layer: HeightLayer): WorldTopologyNode[] {
  return topology.nodes
    .filter((node) => node.heightLayer === layer)
    .sort((a, b) => distance({ x: a.position.x, z: a.position.z }, { x: position.x, z: position.z }) - distance({ x: b.position.x, z: b.position.z }, { x: position.x, z: position.z }))
    .slice(0, 4);
}

export function findTopologyRoute(
  topology: WorldTopology,
  start: Vec3,
  startLayer: HeightLayer,
  goal: Vec3,
  goalLayer: HeightLayer
): TopologyRoute {
  const startCandidates = nearestNodes(topology, start, startLayer);
  const goalCandidates = nearestNodes(topology, goal, goalLayer);
  if (startCandidates.length === 0 || goalCandidates.length === 0) {
    return { nodeIds: [], portalIds: [], traversalCost: Number.POSITIVE_INFINITY, reachable: false };
  }

  const open = new Map<string, number>();
  const best = new Map<string, number>();
  const previous = new Map<string, string>();
  const throughPortal = new Map<string, string>();

  for (const node of startCandidates) {
    const cost = distance({ x: node.position.x, z: node.position.z }, { x: start.x, z: start.z });
    open.set(node.id, cost);
    best.set(node.id, cost);
  }

  let reachedGoal: string | undefined;
  while (open.size > 0) {
    const [currentId, currentCost] = [...open.entries()].sort((a, b) => a[1] - b[1])[0];
    open.delete(currentId);
    if (goalCandidates.some((node) => node.id === currentId)) {
      reachedGoal = currentId;
      break;
    }
    for (const next of neighbors(topology, currentId)) {
      const tentative = currentCost + next.cost;
      if (tentative >= (best.get(next.to) ?? Number.POSITIVE_INFINITY)) continue;
      best.set(next.to, tentative);
      open.set(next.to, tentative);
      previous.set(next.to, currentId);
      if (next.portalId) throughPortal.set(next.to, next.portalId);
    }
  }

  if (!reachedGoal) return { nodeIds: [], portalIds: [], traversalCost: Number.POSITIVE_INFINITY, reachable: false };

  const nodeIds: string[] = [];
  const portalIds: string[] = [];
  let cursor: string | undefined = reachedGoal;
  while (cursor) {
    nodeIds.push(cursor);
    const portalId = throughPortal.get(cursor);
    if (portalId) portalIds.push(portalId);
    cursor = previous.get(cursor);
  }
  nodeIds.reverse();
  portalIds.reverse();

  const goalLanding = goalCandidates.find((node) => node.id === reachedGoal);
  const landingCost = goalLanding ? distance({ x: goalLanding.position.x, z: goalLanding.position.z }, { x: goal.x, z: goal.z }) : 0;
  return {
    nodeIds,
    portalIds,
    traversalCost: (best.get(reachedGoal) ?? Number.POSITIVE_INFINITY) + landingCost,
    reachable: true
  };
}
