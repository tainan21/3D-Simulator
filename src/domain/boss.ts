import { add, normalize, scale } from "../kernel/vector";
import type { Actor, BossBody } from "./canonical";
import { CANONICAL_DIMENSIONS } from "./canonical";

export function bossBody(actor: Actor): BossBody {
  const facing = normalize(actor.facing);
  const from = add(actor.position, scale(facing, 0.2));
  const to = add(actor.position, scale(facing, 1.6));
  return {
    main: { center: actor.position, radius: CANONICAL_DIMENSIONS.boss.radius },
    attackZone: {
      segment: { a: from, b: to },
      radius: CANONICAL_DIMENSIONS.boss.attackRadius
    }
  };
}
