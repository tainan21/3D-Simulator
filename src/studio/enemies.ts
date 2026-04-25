import type { Vec2 } from "../kernel/vector";

type Rng = () => number;

function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pick<T>(rng: Rng, values: readonly T[]): T {
  return values[Math.floor(rng() * values.length)] ?? values[0];
}

function range(rng: Rng, min: number, max: number, digits = 2): number {
  return Number((min + (max - min) * rng()).toFixed(digits));
}

export type EnemyPreviewMode = "2d" | "25d" | "3d";

export type EnemyAnimationClip = Readonly<{
  name: "idle" | "walk" | "attack" | "hit";
  tempo: number;
  armSwing: number;
  legSwing: number;
  bob: number;
}>;

export type EnemyRig = Readonly<{
  trunk: { width: number; height: number };
  head: { radius: number };
  upperArms: { length: number; width: number };
  lowerArms: { length: number; width: number };
  upperLegs: { length: number; width: number };
  lowerLegs: { length: number; width: number };
}>;

export type EnemyArchetype = Readonly<{
  id: string;
  seed: number;
  silhouetteClass: "lean" | "soldier" | "brute";
  paletteFamily: "ember" | "jade" | "violet" | "steel" | "sand";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  armorAccents: "none" | "pauldrons" | "belt" | "crest";
  gaitProfile: "light" | "march" | "heavy";
  limbProportions: {
    shoulderWidth: number;
    hipWidth: number;
    armScale: number;
    legScale: number;
  };
  rig: EnemyRig;
  animationSet: EnemyAnimationClip[];
}>;

export type EnemyBakeArtifact = Readonly<{
  mode: "procedural" | "bake" | "hybrid-placeholder";
  payload: string;
}>;

const PALETTES = {
  ember: { primary: "#de6e63", secondary: "#7c1f2a", accent: "#f6c453" },
  jade: { primary: "#62d26f", secondary: "#215d4c", accent: "#b6f28e" },
  violet: { primary: "#9a7bff", secondary: "#372f75", accent: "#f1b6ff" },
  steel: { primary: "#8da7c7", secondary: "#33455f", accent: "#d5e8ff" },
  sand: { primary: "#d4b48b", secondary: "#6f5539", accent: "#fff0c7" }
} as const;

export function createEnemyArchetype(seed: number): EnemyArchetype {
  const rng = createRng(seed);
  const silhouetteClass = pick(rng, ["lean", "soldier", "brute"] as const);
  const paletteFamily = pick(rng, ["ember", "jade", "violet", "steel", "sand"] as const);
  const gaitProfile = pick(rng, ["light", "march", "heavy"] as const);
  const armorAccents = pick(rng, ["none", "pauldrons", "belt", "crest"] as const);
  const silhouetteScale = silhouetteClass === "lean" ? 0.9 : silhouetteClass === "brute" ? 1.16 : 1;
  const colors = PALETTES[paletteFamily];

  const rig: EnemyRig = {
    trunk: { width: range(rng, 0.34, 0.48) * silhouetteScale, height: range(rng, 0.58, 0.8) * silhouetteScale },
    head: { radius: range(rng, 0.13, 0.18) * (silhouetteClass === "brute" ? 1.05 : 1) },
    upperArms: { length: range(rng, 0.22, 0.31), width: range(rng, 0.07, 0.11) },
    lowerArms: { length: range(rng, 0.2, 0.28), width: range(rng, 0.06, 0.1) },
    upperLegs: { length: range(rng, 0.28, 0.4) * (gaitProfile === "heavy" ? 0.94 : 1.02), width: range(rng, 0.08, 0.12) },
    lowerLegs: { length: range(rng, 0.26, 0.36), width: range(rng, 0.07, 0.11) }
  };

  return {
    id: `enemy-arch-${seed}`,
    seed,
    silhouetteClass,
    paletteFamily,
    colors,
    armorAccents,
    gaitProfile,
    limbProportions: {
      shoulderWidth: range(rng, 0.24, 0.38) * silhouetteScale,
      hipWidth: range(rng, 0.18, 0.3) * silhouetteScale,
      armScale: range(rng, 0.92, 1.14),
      legScale: range(rng, 0.9, 1.18)
    },
    rig,
    animationSet: [
      { name: "idle", tempo: range(rng, 1.2, 1.8), armSwing: 4, legSwing: 2, bob: 3 },
      { name: "walk", tempo: range(rng, 2.2, 3.3), armSwing: silhouetteClass === "brute" ? 14 : 18, legSwing: gaitProfile === "heavy" ? 12 : 16, bob: 5 },
      { name: "attack", tempo: range(rng, 3.4, 4.6), armSwing: 24, legSwing: 9, bob: 7 },
      { name: "hit", tempo: range(rng, 4.4, 5.1), armSwing: 10, legSwing: 4, bob: 2 }
    ]
  };
}

function svgLimb(x: number, y: number, width: number, height: number, fill: string, transformOrigin: Vec2, animation: EnemyAnimationClip): string {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${width * 0.35}" fill="${fill}" style="transform-origin:${transformOrigin.x}px ${transformOrigin.z}px;animation:studioLimb ${animation.tempo}s ease-in-out infinite alternate;" />`;
}

export function enemyPreviewSvg(archetype: EnemyArchetype, mode: EnemyPreviewMode): string {
  const clip = archetype.animationSet.find((entry) => entry.name === "walk") ?? archetype.animationSet[0];
  const scale = mode === "3d" ? 74 : mode === "25d" ? 78 : 82;
  const tiltX = mode === "25d" ? 10 : mode === "3d" ? 16 : 0;
  const depth = mode === "3d" ? 10 : mode === "25d" ? 5 : 0;
  const torsoW = archetype.rig.trunk.width * scale;
  const torsoH = archetype.rig.trunk.height * scale;
  const headR = archetype.rig.head.radius * scale;
  const originX = 90;
  const originY = 54;
  const armW = archetype.rig.upperArms.width * scale;
  const armH = archetype.rig.upperArms.length * scale * archetype.limbProportions.armScale;
  const legW = archetype.rig.upperLegs.width * scale;
  const legH = archetype.rig.upperLegs.length * scale * archetype.limbProportions.legScale;
  const bodyX = originX - torsoW * 0.5;
  const bodyY = originY;
  const shadow = mode === "2d" ? "" : `<ellipse cx="${originX + tiltX}" cy="${originY + torsoH + legH * 1.85}" rx="${torsoW * 0.9}" ry="${8 + depth}" fill="rgba(0,0,0,0.22)" />`;
  const depthPlate = mode === "3d" ? `<rect x="${bodyX + depth}" y="${bodyY - depth}" width="${torsoW}" height="${torsoH}" rx="${torsoW * 0.16}" fill="${archetype.colors.secondary}" opacity="0.55" />` : "";

  return `
  <svg viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
    <style>
      @keyframes studioLimb {
        from { transform: rotate(${-clip.armSwing * 0.5}deg) translateY(0px); }
        to { transform: rotate(${clip.armSwing}deg) translateY(${clip.bob * 0.25}px); }
      }
      @keyframes studioLeg {
        from { transform: rotate(${clip.legSwing}deg); }
        to { transform: rotate(${-clip.legSwing}deg); }
      }
      @keyframes studioBody {
        from { transform: translateY(0px); }
        to { transform: translateY(${clip.bob}px); }
      }
    </style>
    ${shadow}
    ${depthPlate}
    <g style="animation:studioBody ${clip.tempo}s ease-in-out infinite alternate;">
      <circle cx="${originX + tiltX}" cy="${bodyY - headR * 0.45}" r="${headR}" fill="${archetype.colors.primary}" />
      <rect x="${bodyX}" y="${bodyY}" width="${torsoW}" height="${torsoH}" rx="${torsoW * 0.16}" fill="${archetype.colors.primary}" />
      ${archetype.armorAccents === "crest" ? `<rect x="${originX - torsoW * 0.1}" y="${bodyY - headR * 1.5}" width="${torsoW * 0.2}" height="${headR * 0.9}" rx="3" fill="${archetype.colors.accent}" />` : ""}
      ${archetype.armorAccents === "belt" ? `<rect x="${bodyX}" y="${bodyY + torsoH * 0.56}" width="${torsoW}" height="${torsoH * 0.12}" fill="${archetype.colors.accent}" />` : ""}
      ${archetype.armorAccents === "pauldrons" ? `<rect x="${bodyX - 7}" y="${bodyY + 4}" width="${torsoW + 14}" height="${torsoH * 0.18}" rx="5" fill="${archetype.colors.accent}" />` : ""}
      ${svgLimb(bodyX - armW, bodyY + 10, armW, armH, archetype.colors.secondary, { x: bodyX, z: bodyY + 10 }, clip)}
      ${svgLimb(bodyX + torsoW, bodyY + 10, armW, armH, archetype.colors.secondary, { x: bodyX + torsoW, z: bodyY + 10 }, clip)}
      <rect x="${originX - archetype.limbProportions.hipWidth * scale * 0.5 - legW}" y="${bodyY + torsoH - 6}" width="${legW}" height="${legH}" rx="${legW * 0.35}" fill="${archetype.colors.secondary}" style="transform-origin:${originX - legW}px ${bodyY + torsoH}px;animation:studioLeg ${clip.tempo}s ease-in-out infinite alternate;" />
      <rect x="${originX + archetype.limbProportions.hipWidth * scale * 0.5}" y="${bodyY + torsoH - 6}" width="${legW}" height="${legH}" rx="${legW * 0.35}" fill="${archetype.colors.secondary}" style="transform-origin:${originX + legW}px ${bodyY + torsoH}px;animation:studioLeg ${clip.tempo}s ease-in-out infinite alternate-reverse;" />
    </g>
  </svg>`;
}

export function exportEnemyBakeArtifact(archetype: EnemyArchetype, mode: EnemyBakeArtifact["mode"]): EnemyBakeArtifact {
  return {
    mode,
    payload: JSON.stringify(
      {
        id: archetype.id,
        seed: archetype.seed,
        silhouetteClass: archetype.silhouetteClass,
        paletteFamily: archetype.paletteFamily,
        colors: archetype.colors,
        gaitProfile: archetype.gaitProfile,
        rig: archetype.rig,
        animationSet: archetype.animationSet
      },
      null,
      2
    )
  };
}
