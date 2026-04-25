import type { AppSurfaceContext, SurfaceId } from "../contracts";
import type { ThreeCameraState } from "../../render/contracts";
import type { WorldAnalysisSnapshot } from "../../simulation/analysis";
import type { WorldState } from "../../simulation/worldState";

export type Cleanup = () => void;

export type RendererMetrics = Readonly<{
  fps: number;
  frameMs: number;
  renderMs: number;
  overlayMs: number;
}>;

export type RendererHandle = Readonly<{
  destroy: () => void;
  pause?: () => void;
  resume?: () => void;
  getMetrics?: () => RendererMetrics;
  getCanvasElement?: () => HTMLCanvasElement | undefined;
}>;

export function createCleanupBag() {
  const cleanups: Cleanup[] = [];
  return {
    add(cleanup: Cleanup): void {
      cleanups.push(cleanup);
    },
    dispose(): void {
      while (cleanups.length > 0) {
        cleanups.pop()?.();
      }
    }
  };
}

export function createKeyboardState(): {
  pressed: Set<string>;
  attach: (cleanups: ReturnType<typeof createCleanupBag>) => void;
} {
  const pressed = new Set<string>();
  return {
    pressed,
    attach(cleanups) {
      const onKeyDown = (event: KeyboardEvent) => {
        pressed.add(event.code);
      };
      const onKeyUp = (event: KeyboardEvent) => {
        pressed.delete(event.code);
      };
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      cleanups.add(() => window.removeEventListener("keydown", onKeyDown));
      cleanups.add(() => window.removeEventListener("keyup", onKeyUp));
    }
  };
}

export function registerRendererPerformance(
  context: AppSurfaceContext,
  surfaceId: SurfaceId,
  renderer: RendererHandle,
  suffix: string
): Cleanup {
  const canvas = renderer.getCanvasElement?.();
  const canvasCleanup = canvas ? context.performance.trackCanvas(`${surfaceId}:${suffix}`) : () => undefined;
  return () => {
    canvasCleanup();
  };
}

export function updatePerformanceSnapshot(
  context: AppSurfaceContext,
  surfaceId: SurfaceId,
  frameMs: number,
  simMs: number,
  analysis: WorldAnalysisSnapshot,
  world: WorldState,
  renderer?: RendererHandle
): void {
  const metrics = renderer?.getMetrics?.() ?? { fps: frameMs > 0 ? 1000 / frameMs : 0, frameMs, renderMs: 0, overlayMs: 0 };
  context.performance.update({
    activeSurface: surfaceId,
    fps: metrics.fps,
    frameMs: metrics.frameMs || frameMs,
    simMs,
    renderMs: metrics.renderMs,
    aiMs: analysis.timings.aiMs,
    overlayMs: metrics.overlayMs,
    entityCount: world.actors.length,
    shapeCount: world.pieces.length + world.towers.length + world.connectors.length,
    queryCount:
      analysis.topology.nodes.length +
      analysis.topology.edges.length +
      analysis.aiDebug.reduce((total, entry) => total + entry.waypoints.length + entry.navigationSamples.length, 0)
  });
}

export function applyCameraWheel(camera: ThreeCameraState, deltaY: number): ThreeCameraState {
  if (camera.mode === "first-person") return camera;
  const nextDistance = Math.max(4.5, Math.min(20, camera.distance + Math.sign(deltaY) * 0.8));
  return { ...camera, distance: nextDistance };
}

export function applyPointerDrag(camera: ThreeCameraState, dx: number, dy: number): ThreeCameraState {
  if (camera.mode === "first-person") return camera;
  return {
    ...camera,
    yaw: camera.yaw + dx * 0.008,
    pitch: clamp(camera.pitch - dy * 0.006, -1.1, 0.72)
  };
}

export function applyKeyboardLook(camera: ThreeCameraState, pressed: Set<string>, dt: number): ThreeCameraState {
  const turn = Number(pressed.has("KeyE")) - Number(pressed.has("KeyQ"));
  const pitch = Number(pressed.has("KeyR")) - Number(pressed.has("KeyF"));
  return {
    ...camera,
    yaw: camera.yaw + turn * dt * 1.9,
    pitch: clamp(camera.pitch + pitch * dt * 1.3, -1.15, 0.9)
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
