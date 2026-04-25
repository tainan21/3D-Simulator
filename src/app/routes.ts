import type { AppRoute, SurfaceLoader, SurfaceMeta } from "./contracts";

export const SURFACE_META: SurfaceMeta[] = [
  { id: "hub", route: "/hub", title: "Hub", shortTitle: "Hub", role: "hub", description: "Entrada leve para escolher a superficie ativa." },
  { id: "studio", route: "/studio", title: "Studio", shortTitle: "Studio", role: "editing", description: "Edicao canonica e ferramentas fortes de construcao." },
  { id: "runtime", route: "/runtime", title: "Runtime", shortTitle: "Runtime", role: "game", description: "Superficie jogavel materializada a partir do ultimo bake valido." },
  { id: "phases", route: "/phases", title: "Fases", shortTitle: "Fases", role: "experiment", description: "Playground de cenarios, seeds e modos de visualizacao." },
  { id: "harness", route: "/harness", title: "Harness", shortTitle: "Harness", role: "validation", description: "Comparacao controlada 2D, 2.5D e 3D para validacao." },
  { id: "replay", route: "/replay", title: "Replay", shortTitle: "Replay", role: "validation", description: "Inspecao dedicada de gravacoes e divergencias." },
  { id: "settings", route: "/settings", title: "Configuracoes", shortTitle: "Config", role: "diagnostic", description: "Presets, densidade visual e preferencias globais." },
  { id: "debug", route: "/debug", title: "Debug", shortTitle: "Debug", role: "diagnostic", description: "Comandos e flags de depuracao sob demanda." },
  { id: "performance", route: "/performance", title: "Performance", shortTitle: "Perf", role: "diagnostic", description: "Metrica, profiling e gargalos por superficie." }
];

const loaderEntries: Array<[AppRoute, SurfaceLoader]> = [
  ["/hub", () => import("./surfaces/hubSurface").then((module) => module.default)],
  ["/studio", () => import("./surfaces/studioSurface").then((module) => module.default)],
  ["/runtime", () => import("./surfaces/runtimeSurface").then((module) => module.default)],
  ["/phases", () => import("./surfaces/phasesSurface").then((module) => module.default)],
  ["/harness", () => import("./surfaces/harnessSurface").then((module) => module.default)],
  ["/replay", () => import("./surfaces/replaySurface").then((module) => module.default)],
  ["/settings", () => import("./surfaces/settingsSurface").then((module) => module.default)],
  ["/debug", () => import("./surfaces/debugSurface").then((module) => module.default)],
  ["/performance", () => import("./surfaces/performanceSurface").then((module) => module.default)]
];

export const SURFACE_LOADERS = new Map<AppRoute, SurfaceLoader>(loaderEntries);
export const SURFACE_META_BY_ROUTE = new Map(SURFACE_META.map((entry) => [entry.route, entry] as const));

export function normalizeRoute(pathname: string): AppRoute {
  if (!pathname || pathname === "/") return "/studio";
  const cleaned = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  if (SURFACE_META_BY_ROUTE.has(cleaned as AppRoute)) return cleaned as AppRoute;
  return "/studio";
}
