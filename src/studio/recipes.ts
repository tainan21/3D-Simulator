import { BaseEditor } from "../editor/baseEditor";
import { createActor, createBaseCore, type BasePiece } from "../domain/canonical";
import { createRogueRun } from "../simulation/roguelite";
import { createStructureMap } from "../simulation/structures";
import type { WorldState } from "../simulation/worldState";

export type StudioRecipeId = "inner-room" | "outer-arena" | "gate-corridor" | "height-spine" | "boss-breach";

export type StudioRecipe = Readonly<{
  id: StudioRecipeId;
  label: string;
  intent: string;
}>;

export const STUDIO_RECIPES: StudioRecipe[] = [
  { id: "inner-room", label: "Sala interna", intent: "Base compacta construida de dentro para fora." },
  { id: "outer-arena", label: "Arena externa", intent: "Perimetro de combate construido de fora para dentro." },
  { id: "gate-corridor", label: "Corredor gate", intent: "Funil com portao e leitura clara de passagem." },
  { id: "height-spine", label: "Espinha altura", intent: "Camadas discretas, rampa e socket superior." },
  { id: "boss-breach", label: "Boss breach", intent: "Pressao estrutural com TL, torre e boss." }
];

function rebuildWorld(base: WorldState, editor: BaseEditor, actors: WorldState["actors"], selectedId?: string): WorldState {
  const baseCore = createBaseCore(base.baseCore.position, { heightLayer: base.baseCore.heightLayer });
  const run = createRogueRun();
  return {
    ...base,
    pieces: editor.pieces,
    towers: editor.towers,
    connectors: editor.connectors,
    actors,
    baseCore,
    run,
    aiMemory: {},
    tick: 0,
    combatLog: [],
    selectedId,
    structures: createStructureMap(editor.pieces, editor.towers, baseCore, run.baseCoreMaxHp)
  };
}

function attachFirstTower(editor: BaseEditor): BasePiece | undefined {
  const tl = editor.pieces.find((piece) => piece.kind === "fence-tl");
  if (tl) editor.attachTowerToFenceTL(tl.id);
  return tl;
}

export function applyStudioRecipe(world: WorldState, recipeId: StudioRecipeId): WorldState {
  const editor = new BaseEditor();

  if (recipeId === "inner-room") {
    editor.placeSegment("fence", { x: -3, z: -3 }, { x: 3, z: -3 });
    const tl = editor.placeSegment("fence-tl", { x: 3, z: -3 }, { x: 3, z: 3 });
    editor.attachTowerToFenceTL(tl.id);
    editor.placeSegment("gate", { x: 3, z: 3 }, { x: -3, z: 3 }, "closed");
    editor.placeSegment("fence", { x: -3, z: 3 }, { x: -3, z: -3 });
    return rebuildWorld(
      { ...world, baseCore: createBaseCore({ x: 0, z: 0 }) },
      editor,
      [createActor("player", "player", { x: 0, z: -1.2 }), createActor("enemy-1", "enemy", { x: 5, z: 2 })],
      tl.id
    );
  }

  if (recipeId === "outer-arena") {
    editor.placeSegment("fence", { x: -7, z: -5 }, { x: 7, z: -5 });
    editor.placeSegment("fence-tl", { x: 7, z: -5 }, { x: 7, z: 5 });
    editor.placeSegment("gate", { x: 7, z: 5 }, { x: 2, z: 5 }, "open");
    editor.placeSegment("fence", { x: 2, z: 5 }, { x: -7, z: 5 });
    editor.placeSegment("fence", { x: -7, z: 5 }, { x: -7, z: -5 });
    const tl = attachFirstTower(editor);
    return rebuildWorld(
      { ...world, baseCore: createBaseCore({ x: -1, z: 0 }) },
      editor,
      [createActor("player", "player", { x: -4, z: 0 }), createActor("enemy-1", "enemy", { x: 4.5, z: 2 }), createActor("dwarf-1", "dwarf", { x: 5, z: -2 })],
      tl?.id
    );
  }

  if (recipeId === "gate-corridor") {
    editor.placeSegment("fence", { x: -5, z: -2 }, { x: 1, z: -2 });
    editor.placeSegment("gate", { x: 1, z: -2 }, { x: 5, z: -2 }, "closed");
    editor.placeSegment("fence", { x: -5, z: 2 }, { x: 5, z: 2 });
    const tl = editor.placeSegment("fence-tl", { x: 5, z: -2 }, { x: 5, z: 2 });
    editor.attachTowerToFenceTL(tl.id);
    return rebuildWorld(
      { ...world, baseCore: createBaseCore({ x: -3, z: 0 }) },
      editor,
      [createActor("player", "player", { x: -4, z: 0 }), createActor("enemy-1", "enemy", { x: 6.2, z: -0.4 }), createActor("boss-1", "boss", { x: 8, z: 1 })],
      tl.id
    );
  }

  if (recipeId === "height-spine") {
    editor.placeSegment("fence", { x: -5, z: -2 }, { x: -1, z: -2 });
    const tl = editor.placeSegment("fence-tl", { x: -1, z: -2 }, { x: 3, z: -2 }, "closed", { heightLayer: 1 });
    editor.attachTowerToFenceTL(tl.id);
    editor.placeSegment("gate", { x: 3, z: -2 }, { x: 3, z: 2 }, "open", { heightLayer: 1 });
    editor.placeSegment("fence", { x: 3, z: 2 }, { x: -5, z: 2 }, "closed", { heightLayer: 1 });
    editor.placeConnector("ramp", { x: -5, z: -2 }, { x: -3, z: 0 }, 0, 1);
    editor.placeConnector("platform-link", { x: 3, z: 2 }, { x: 6, z: 2 }, 1, 1);
    return rebuildWorld(
      { ...world, baseCore: createBaseCore({ x: 0, z: 0 }, { heightLayer: 1 }) },
      editor,
      [createActor("player", "player", { x: -5, z: 0 }), createActor("enemy-1", "enemy", { x: 6, z: 1 }, { heightLayer: 1 })],
      tl.id
    );
  }

  editor.placeSegment("fence", { x: -6, z: -5 }, { x: 5, z: -5 });
  const tl = editor.placeSegment("fence-tl", { x: 5, z: -5 }, { x: 5, z: -1 });
  editor.attachTowerToFenceTL(tl.id);
  editor.placeSegment("gate", { x: 5, z: -1 }, { x: 5, z: 2.5 }, "closed");
  editor.placeSegment("gate", { x: 5, z: 2.5 }, { x: 5, z: 5 }, "open");
  editor.placeSegment("fence", { x: 5, z: 5 }, { x: -6, z: 5 });
  editor.placeSegment("fence", { x: -6, z: 5 }, { x: -6, z: -5 });
  return rebuildWorld(
    { ...world, baseCore: createBaseCore({ x: 0, z: 0 }) },
    editor,
    [createActor("player", "player", { x: -2, z: 0 }), createActor("enemy-1", "enemy", { x: 7, z: -2 }), createActor("boss-1", "boss", { x: 8, z: 3 })],
    tl.id
  );
}
