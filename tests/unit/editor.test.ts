import { describe, expect, it } from "vitest";
import { BaseEditor } from "../../src/editor/baseEditor";
import { CANONICAL_DIMENSIONS, pieceCapsule, pieceHorizontalBounds, pieceSockets } from "../../src/domain/canonical";
import { segmentLength } from "../../src/kernel/shapes";

describe("BaseEditor", () => {
  it("snaps endpoint connections by socket proximity", () => {
    const editor = new BaseEditor();
    const a = editor.placeSegment("fence", { x: 0, z: 0 }, { x: 2, z: 0 });
    const b = editor.placeSegment("fence", { x: 2.05, z: 0.04 }, { x: 2, z: 2 });
    expect(b.a).toEqual(a.b);
  });

  it("forms corners as two connected segment sticks", () => {
    const editor = new BaseEditor();
    const first = editor.placeSegment("fence", { x: 0, z: 0 }, { x: 2, z: 0 });
    const corner = editor.placeSegment("fence", { x: 2, z: 0 }, { x: 2, z: 2 });
    expect(first.b).toEqual(corner.a);
    expect(editor.pieces).toHaveLength(2);
  });

  it("saves and reopens pure geometry", () => {
    const editor = new BaseEditor();
    const gate = editor.placeSegment("gate", { x: 0, z: 0 }, { x: 2, z: 0 }, "open");
    editor.placeSegment("fence-tl", { x: 2, z: 0 }, { x: 4, z: 0 });
    const tl = editor.pieces.find((piece) => piece.kind === "fence-tl");
    if (!tl) throw new Error("TL missing");
    editor.attachTowerToFenceTL(tl.id);

    const reopened = BaseEditor.deserialize(editor.serialize());
    expect(reopened.serialize()).toEqual(editor.serialize());
    expect(reopened.pieces[0]).toEqual(gate);
  });

  it("attaches tower to TL top socket without changing TL geometry", () => {
    const editor = new BaseEditor();
    const tl = editor.placeSegment("fence-tl", { x: 0, z: 0 }, { x: 2, z: 0 });
    const beforeLength = segmentLength({ a: tl.a, b: tl.b });
    const beforeBounds = pieceHorizontalBounds(tl);
    const beforeCapsule = pieceCapsule(tl);
    const tower = editor.attachTowerToFenceTL(tl.id);
    const after = editor.pieces.find((piece) => piece.id === tl.id);
    if (!after || after.kind !== "fence-tl") throw new Error("TL missing");

    expect(segmentLength({ a: after.a, b: after.b })).toBe(beforeLength);
    expect(after.thickness).toBe(tl.thickness);
    expect(after.a).toEqual(tl.a);
    expect(after.b).toEqual(tl.b);
    expect(pieceHorizontalBounds(after)).toEqual(beforeBounds);
    expect(pieceCapsule(after)).toEqual(beforeCapsule);
    expect(tower.anchor).toEqual({ x: 1, y: CANONICAL_DIMENSIONS.fenceTL.height, z: 0 });
    expect(pieceSockets(after).some((socket) => socket.kind === "top" && socket.position.y === CANONICAL_DIMENSIONS.fenceTL.height)).toBe(true);
    expect(editor.connectors).toHaveLength(1);
    expect(editor.connectors[0]).toMatchObject({
      kind: "top-socket-link",
      from: { pieceId: tl.id, position: { x: 1, y: 0, z: 0 } },
      to: { pieceId: tl.id, position: { x: 1, y: CANONICAL_DIMENSIONS.fenceTL.height, z: 0 } }
    });
  });

  it("previews snapped fence drawing before committing geometry", () => {
    const editor = new BaseEditor();
    const first = editor.placeSegment("fence", { x: 0, z: 0 }, { x: 2, z: 0 });
    const draft = editor.previewSegment("fence", { x: 2.06, z: 0.03 }, { x: 5.1, z: 0.1 });
    expect(draft.a).toEqual(first.b);
    expect(draft.b).toEqual({ x: 5, z: 0 });
    expect(editor.pieces).toHaveLength(1);
  });

  it("deletes pieces and dependent towers without leaving visual state", () => {
    const editor = new BaseEditor();
    const tl = editor.placeSegment("fence-tl", { x: 0, z: 0 }, { x: 2, z: 0 });
    editor.attachTowerToFenceTL(tl.id);
    editor.deleteNear({ x: 0, z: 0 });
    expect(editor.pieces).toHaveLength(0);
    expect(editor.towers).toHaveLength(0);
    expect(editor.connectors).toHaveLength(0);
  });

  it("moves tower anchors and top-socket links when a TL changes height layer", () => {
    const editor = new BaseEditor();
    const tl = editor.placeSegment("fence-tl", { x: 0, z: 0 }, { x: 2, z: 0 });
    editor.attachTowerToFenceTL(tl.id);

    editor.setPieceLayer(tl.id, 2);

    expect(editor.towers[0]).toMatchObject({
      fenceId: tl.id,
      heightLayer: 2,
      anchor: { x: 1, y: 8.8, z: 0 }
    });
    expect(editor.connectors[0]).toMatchObject({
      kind: "top-socket-link",
      from: { layer: 2, position: { x: 1, y: 4.8, z: 0 } },
      to: { layer: 2, position: { x: 1, y: 8.8, z: 0 } }
    });
  });
});
