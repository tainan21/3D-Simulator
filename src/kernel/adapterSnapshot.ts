import {
  actorCircle,
  baseCoreCircle,
  pieceCapsule,
  pieceHorizontalBounds,
  pieceSockets,
  type Actor,
  type BaseCore,
  type BasePiece,
  type SurfaceTile,
  type TowerPiece
} from "../domain/canonical";
import { actorOrientation, baseCoreOrientation, pieceOrientation, towerOrientation } from "../domain/orientation";
import type { WorldState } from "../simulation/worldState";
import { distance } from "./vector";

export type AdapterMode = "2d" | "25d" | "3d";

export type GeometryAdapterSnapshot = Readonly<{
  adapter: AdapterMode;
  pieces: Array<{
    id: string;
    kind: BasePiece["kind"];
    a: BasePiece["a"];
    b: BasePiece["b"];
    baseY: number;
    heightLayer: BasePiece["heightLayer"];
    length: number;
    thickness: number;
    height: number;
    colliderRadius: number;
    bounds: ReturnType<typeof pieceHorizontalBounds>;
    sockets: ReturnType<typeof pieceSockets>;
    pivot: ReturnType<typeof pieceOrientation>["pivot"];
    topSocket?: ReturnType<typeof pieceOrientation>["topSocket"];
    towerId?: string;
    state?: Extract<BasePiece, { kind: "gate" }>["state"];
  }>;
  towers: Array<{
    id: string;
    fenceId: string;
    radius: number;
    height: number;
    anchor: TowerPiece["anchor"];
    pivot: ReturnType<typeof towerOrientation>;
  }>;
  connectors: Array<{
    id: WorldState["connectors"][number]["id"];
    kind: WorldState["connectors"][number]["kind"];
    from: WorldState["connectors"][number]["from"];
    to: WorldState["connectors"][number]["to"];
    width: number;
    travelCost: number;
  }>;
  surfaceTiles: Array<{
    id: string;
    cell: SurfaceTile["cell"];
    material: SurfaceTile["material"];
    intensity: SurfaceTile["intensity"];
    heightLayer: SurfaceTile["heightLayer"];
  }>;
  actors: Array<{
    id: string;
    kind: Actor["kind"];
    position: Actor["position"];
    baseY: number;
    heightLayer: Actor["heightLayer"];
    radius: number;
    height: number;
    facing: Actor["facing"];
    visual: Actor["visual"];
    combatProfile?: Actor["combatProfile"];
    pivot: ReturnType<typeof actorOrientation>;
  }>;
  baseCore: {
    id: BaseCore["id"];
    position: BaseCore["position"];
    baseY: number;
    heightLayer: BaseCore["heightLayer"];
    radius: number;
    height: number;
    pivot: ReturnType<typeof baseCoreOrientation>;
  };
}>;

export function createGeometryAdapterSnapshot(world: WorldState, adapter: AdapterMode): GeometryAdapterSnapshot {
  return {
    adapter,
    pieces: world.pieces.map((piece) => {
      const orientation = pieceOrientation(piece);
      const capsule = pieceCapsule(piece);
      return {
        id: piece.id,
        kind: piece.kind,
        a: piece.a,
        b: piece.b,
        baseY: piece.baseY,
        heightLayer: piece.heightLayer,
        length: Number(distance(piece.a, piece.b).toFixed(4)),
        thickness: piece.thickness,
        height: piece.height,
        colliderRadius: capsule.radius,
        bounds: pieceHorizontalBounds(piece),
        sockets: pieceSockets(piece),
        pivot: orientation.pivot,
        topSocket: orientation.topSocket,
        towerId: piece.kind === "fence-tl" ? piece.towerId : undefined,
        state: piece.kind === "gate" ? piece.state : undefined
      };
    }),
    towers: world.towers.map((tower) => {
      const fence = world.pieces.find((piece): piece is Extract<BasePiece, { kind: "fence-tl" }> => piece.id === tower.fenceId && piece.kind === "fence-tl");
      return {
        id: tower.id,
        fenceId: tower.fenceId,
        radius: tower.radius,
        height: tower.height,
        anchor: tower.anchor,
        pivot: towerOrientation(tower, fence)
      };
    }),
    connectors: world.connectors.map((connector) => ({
      id: connector.id,
      kind: connector.kind,
      from: connector.from,
      to: connector.to,
      width: connector.width,
      travelCost: connector.travelCost
    })),
    surfaceTiles: [...(world.surfaceTiles ?? [])]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((tile) => ({
        id: tile.id,
        cell: tile.cell,
        material: tile.material,
        intensity: tile.intensity,
        heightLayer: tile.heightLayer
      })),
    actors: world.actors.map((actor) => ({
      id: actor.id,
      kind: actor.kind,
      position: actor.position,
      baseY: actor.baseY,
      heightLayer: actor.heightLayer,
      radius: actorCircle(actor).radius,
      height: actor.height,
      facing: actor.facing,
      visual: actor.visual,
      combatProfile: actor.combatProfile,
      pivot: actorOrientation(actor)
    })),
    baseCore: {
      id: world.baseCore.id,
      position: baseCoreCircle(world.baseCore).center,
      baseY: world.baseCore.baseY,
      heightLayer: world.baseCore.heightLayer,
      radius: world.baseCore.radius,
      height: world.baseCore.height,
      pivot: baseCoreOrientation(world.baseCore)
    }
  };
}

export function canonicalGeometrySignature(world: WorldState): string {
  return JSON.stringify(createGeometryAdapterSnapshot(world, "3d"));
}
