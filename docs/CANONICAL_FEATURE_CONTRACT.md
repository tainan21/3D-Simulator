# Canonical Feature Contract

Every feature in this studio must start from the canonical world and only then be read by 2D, 2.5D, and 3D.

## Required Rule

- Domain and simulation own geometry, collision, sockets, height layers, HP, AI targets, gates, and procedural seeds.
- Phaser, Three, HUD, CSS, camera, overlays, and effects are adapters.
- A feature is acceptable only when `createGeometryAdapterSnapshot(world, "2d")`, `"25d"`, and `"3d"` share the same structural payload.
- Visual polish may clarify the world, but it must not invent a second world.
- Editable floor textures and mob/character visuals are canonical metadata: renderers read `surfaceTiles` and actor `visual` profiles, they do not own them.
- Character creation lives in its own Studio surface. Archetypes, attacks, behaviors, and encounter settings must be canonical before any 2D, 2.5D, or 3D adapter reads them.
- Character Forge is separate from Character Studio: it authors premium high-level DNA, stats, skills, compatibility, tags, lore, and visual presets before any future 2D, 2.5D, or 3D renderer interprets that DNA.
- Forge movement is data-first: dash, blink, roll, speed, cooldowns, burst values, and simulated motion steps live in `motionProfile`; CSS/SVG animation may dramatize them but cannot be the source of truth.
- Created mob export packages must remain data-first: Forge DNA, Character Archetype, mocked Postgres row, mocked Blob object, and Runtime spawn policy must travel together as importable JSON.
- A baked character encounter must carry `Actor.combatProfile` into Runtime so simulation can read attack range/damage without consulting UI state.
- Runtime may auto-pull created mobs from the local cache, but it must materialize them as canonical actors before any renderer reads them.

## Implementation Checklist

- Add or update canonical data first.
- Keep renderer changes limited to reading existing canonical data.
- Add parity coverage for any new object, recipe, or runtime behavior.
- Include non-blocking canonical visuals such as surface tiles and actor profiles in parity coverage when they must match across views.
- Keep the base Studio and Character Studio separated in UI and state. Shared renderers are allowed; mixed authoring surfaces are not.
- Keep Character Forge separated from both base Studio and Character Studio. It may export DNA later, but it must not hide rules in CSS animation, SVG shape, mesh, camera, or post-processing.
- Export/import must carry `motionProfile` with the mob package so Runtime and Character Studio can read the same movement intent later.
- Treat cache, Postgres, and Blob layers as persistence adapters. They can store packages and manifests; they do not own geometry, AI, attack range, HP, or renderer-specific decisions.
- Keep replay signatures deterministic when gameplay state changes.
- Update `world.md` when a new v1 object or canonical rule is introduced.
