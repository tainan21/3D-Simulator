# Canonical Feature Contract

Every feature in this studio must start from the canonical world and only then be read by 2D, 2.5D, and 3D.

## Required Rule

- Domain and simulation own geometry, collision, sockets, height layers, HP, AI targets, gates, and procedural seeds.
- Phaser, Three, HUD, CSS, camera, overlays, and effects are adapters.
- A feature is acceptable only when `createGeometryAdapterSnapshot(world, "2d")`, `"25d"`, and `"3d"` share the same structural payload.
- Visual polish may clarify the world, but it must not invent a second world.

## Implementation Checklist

- Add or update canonical data first.
- Keep renderer changes limited to reading existing canonical data.
- Add parity coverage for any new object, recipe, or runtime behavior.
- Keep replay signatures deterministic when gameplay state changes.
- Update `world.md` when a new v1 object or canonical rule is introduced.
