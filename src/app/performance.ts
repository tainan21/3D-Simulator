import type { PerformancePreset, SurfaceId } from "./contracts";

export type PerformancePresetConfig = Readonly<{
  preset: PerformancePreset;
  pixelRatioCap: number;
  targetFps: number;
  renderScale: number;
  heavyOverlays: boolean;
  harnessViews: 1 | 2 | 3;
  shadowQuality: "off" | "low" | "high";
}>;

export type PerformanceSnapshot = Readonly<{
  fps: number;
  frameMs: number;
  simMs: number;
  renderMs: number;
  aiMs: number;
  overlayMs: number;
  activeSurface: SurfaceId;
  entityCount: number;
  shapeCount: number;
  queryCount: number;
  activeCanvases: number;
  activeLoops: number;
  timestamp: number;
}>;

type SnapshotListener = (snapshot: PerformanceSnapshot) => void;

export const DEFAULT_PERFORMANCE_SNAPSHOT: PerformanceSnapshot = {
  fps: 0,
  frameMs: 0,
  simMs: 0,
  renderMs: 0,
  aiMs: 0,
  overlayMs: 0,
  activeSurface: "hub",
  entityCount: 0,
  shapeCount: 0,
  queryCount: 0,
  activeCanvases: 0,
  activeLoops: 0,
  timestamp: performance.now()
};

export function createPresetConfig(preset: PerformancePreset, isMobile: boolean): PerformancePresetConfig {
  if (preset === "quality") {
    return {
      preset,
      pixelRatioCap: isMobile ? 1.4 : 2,
      targetFps: 60,
      renderScale: 1,
      heavyOverlays: true,
      harnessViews: isMobile ? 1 : 3,
      shadowQuality: isMobile ? "low" : "high"
    };
  }
  if (preset === "performance") {
    return {
      preset,
      pixelRatioCap: isMobile ? 1 : 1.1,
      targetFps: isMobile ? 45 : 60,
      renderScale: 0.92,
      heavyOverlays: false,
      harnessViews: 1,
      shadowQuality: "off"
    };
  }
  if (preset === "debug-heavy") {
    return {
      preset,
      pixelRatioCap: isMobile ? 1.1 : 1.5,
      targetFps: 45,
      renderScale: 0.95,
      heavyOverlays: true,
      harnessViews: isMobile ? 1 : 3,
      shadowQuality: isMobile ? "off" : "low"
    };
  }
  return {
    preset: "balanced",
    pixelRatioCap: isMobile ? 1.1 : 1.35,
    targetFps: isMobile ? 45 : 60,
    renderScale: 1,
    heavyOverlays: false,
    harnessViews: isMobile ? 1 : 2,
    shadowQuality: isMobile ? "off" : "low"
  };
}

export class PerformanceRegistry {
  private snapshot: PerformanceSnapshot = DEFAULT_PERFORMANCE_SNAPSHOT;
  private readonly listeners = new Set<SnapshotListener>();
  private readonly activeCanvases = new Set<string>();
  private readonly activeLoops = new Set<string>();

  subscribe(listener: SnapshotListener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): PerformanceSnapshot {
    return this.snapshot;
  }

  update(partial: Partial<PerformanceSnapshot> & Pick<PerformanceSnapshot, "activeSurface">): PerformanceSnapshot {
    this.snapshot = {
      ...this.snapshot,
      ...partial,
      activeCanvases: this.activeCanvases.size,
      activeLoops: this.activeLoops.size,
      timestamp: performance.now()
    };
    this.listeners.forEach((listener) => listener(this.snapshot));
    return this.snapshot;
  }

  trackCanvas(key: string): () => void {
    this.activeCanvases.add(key);
    this.update({ activeSurface: this.snapshot.activeSurface });
    return () => {
      this.activeCanvases.delete(key);
      this.update({ activeSurface: this.snapshot.activeSurface });
    };
  }

  trackLoop(key: string): () => void {
    this.activeLoops.add(key);
    this.update({ activeSurface: this.snapshot.activeSurface });
    return () => {
      this.activeLoops.delete(key);
      this.update({ activeSurface: this.snapshot.activeSurface });
    };
  }
}
