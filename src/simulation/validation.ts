import { distanceBetweenSegments } from "../kernel/shapes";
import { distance, midpoint, type Vec3 } from "../kernel/vector";
import { SOCKET_SNAP_RADIUS } from "../kernel/worldUnits";
import type { ValidationIssue } from "../domain/analysis";
import { pieceMidpoint, pieceSockets, type BaseCore, type BasePiece, type HeightConnector, type TowerPiece } from "../domain/canonical";
import { buildWorldTopology, findTopologyRoute } from "./topology";

function issue(id: string, kind: ValidationIssue["kind"], severity: ValidationIssue["severity"], message: string, position: Vec3, relatedIds: string[]): ValidationIssue {
  return { id, kind, severity, message, position, relatedIds };
}

function samePoint(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }, tolerance = 1e-4): boolean {
  return Math.abs(a.x - b.x) <= tolerance && Math.abs(a.y - b.y) <= tolerance && Math.abs(a.z - b.z) <= tolerance;
}

function hasConnectorBetween(connectors: HeightConnector[], fromPieceId: string, toPieceId: string): boolean {
  return connectors.some((connector) => {
    const ids = [connector.from.pieceId, connector.to.pieceId].filter(Boolean);
    return ids.includes(fromPieceId) && ids.includes(toPieceId);
  });
}

function sharesEndpoint(first: BasePiece, second: BasePiece): boolean {
  return [first.a, first.b].some((point) => [second.a, second.b].some((other) => distance(point, other) <= 1e-4));
}

export function computeValidationIssues(
  pieces: BasePiece[],
  towers: TowerPiece[],
  connectors: HeightConnector[],
  baseCore: BaseCore
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const topology = buildWorldTopology(pieces, connectors, baseCore);

  for (let index = 0; index < pieces.length; index += 1) {
    const current = pieces[index];
    const currentSockets = pieceSockets(current).filter((socket) => socket.kind === "endpoint");
    for (let compareIndex = index + 1; compareIndex < pieces.length; compareIndex += 1) {
      const other = pieces[compareIndex];
      const otherSockets = pieceSockets(other).filter((socket) => socket.kind === "endpoint");
      const closeVisualJoin = currentSockets.some((socket) =>
        otherSockets.some(
          (otherSocket) =>
            Math.abs(socket.position.y - otherSocket.position.y) <= 1e-4 &&
            distance({ x: socket.position.x, z: socket.position.z }, { x: otherSocket.position.x, z: otherSocket.position.z }) <= SOCKET_SNAP_RADIUS &&
            !samePoint(socket.position, otherSocket.position)
        )
      );
      if (closeVisualJoin) {
        const center = pieceMidpoint(current);
        issues.push(
          issue(
            `visual-only-${current.id}-${other.id}`,
            "visual-only-join",
            "warning",
            `${current.id} almost connects to ${other.id} visually but not logically.`,
            { x: center.x, y: current.baseY, z: center.z },
            [current.id, other.id]
          )
        );
      }

      const logicalOnly = currentSockets.some((socket) =>
        otherSockets.some(
          (otherSocket) =>
            Math.abs(socket.position.x - otherSocket.position.x) <= 1e-4 &&
            Math.abs(socket.position.z - otherSocket.position.z) <= 1e-4 &&
            Math.abs(socket.position.y - otherSocket.position.y) > 1e-4
        )
      );
      if (logicalOnly) {
        const center = midpoint(pieceMidpoint(current), pieceMidpoint(other));
        issues.push(
          issue(
            `logical-only-${current.id}-${other.id}`,
            "logical-only-join",
            "warning",
            `${current.id} and ${other.id} share footprint but live on different height layers.`,
            { x: center.x, y: Math.max(current.baseY, other.baseY), z: center.z },
            [current.id, other.id]
          )
        );
        if (!hasConnectorBetween(connectors, current.id, other.id)) {
          issues.push(
            issue(
              `height-gap-${current.id}-${other.id}`,
              "height-discontinuity-without-connector",
              "error",
              `${current.id} and ${other.id} need an explicit height connector.`,
              { x: center.x, y: Math.max(current.baseY, other.baseY), z: center.z },
              [current.id, other.id]
            )
          );
        }
      }

      if (current.heightLayer === other.heightLayer && !sharesEndpoint(current, other)) {
        const overlapDistance = distanceBetweenSegments({ a: current.a, b: current.b }, { a: other.a, b: other.b });
        if (overlapDistance < current.thickness * 0.5 + other.thickness * 0.5 - 1e-4) {
          const center = midpoint(pieceMidpoint(current), pieceMidpoint(other));
          issues.push(
            issue(
              `overlap-${current.id}-${other.id}`,
              "overlap",
              "error",
              `${current.id} overlaps ${other.id} on the same layer.`,
              { x: center.x, y: current.baseY, z: center.z },
              [current.id, other.id]
            )
          );
        }
      }
    }

    const route = findTopologyRoute(
      topology,
      { x: baseCore.position.x, y: baseCore.baseY, z: baseCore.position.z },
      baseCore.heightLayer,
      { x: pieceMidpoint(current).x, y: current.baseY, z: pieceMidpoint(current).z },
      current.heightLayer
    );
    if (!route.reachable) {
      const center = pieceMidpoint(current);
      issues.push(
        issue(
          `unreachable-${current.id}`,
          "unreachable-segment",
          "warning",
          `${current.id} is disconnected from the main structural topology.`,
          { x: center.x, y: current.baseY, z: center.z },
          [current.id]
        )
      );
    }
  }

  for (const tower of towers) {
    const fence = pieces.find((piece) => piece.id === tower.fenceId && piece.kind === "fence-tl");
    if (!fence || fence.kind !== "fence-tl") {
      issues.push(
        issue(
          `orphan-${tower.id}`,
          "orphan-tower",
          "error",
          `${tower.id} is attached to a missing Fence TL.`,
          tower.anchor,
          [tower.id, tower.fenceId]
        )
      );
      continue;
    }
    const topSocket = pieceSockets(fence).find((socket) => socket.kind === "top");
    const hasLink = connectors.some((connector) => connector.kind === "top-socket-link" && connector.from.pieceId === fence.id);
    if (!topSocket || !samePoint(topSocket.position, tower.anchor) || !hasLink) {
      issues.push(
        issue(
          `top-socket-${tower.id}`,
          "invalid-top-socket",
          "error",
          `${tower.id} no longer matches the Fence TL top socket contract.`,
          tower.anchor,
          [tower.id, fence.id]
        )
      );
    }
  }

  return issues;
}
