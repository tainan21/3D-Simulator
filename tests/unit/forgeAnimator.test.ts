import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createForgeAnimator } from "../../src/runtime/forgeAnimator";
import { createDefaultForgeBuild, finalizeForgeBuild } from "../../src/domain/characterForge";
import { FIXED_TIMESTEP } from "../../src/simulation/replay";

// 5.6 — Mock DOM mínimo (sem jsdom). Só os hooks que o animator toca:
// requestAnimationFrame, performance.now, document.visibilityState,
// matchMedia e o style.setProperty/setAttribute do target.
interface FakeStyle {
  props: Map<string, string>;
  setProperty(name: string, value: string): void;
  removeProperty(name: string): void;
}

interface FakeTarget {
  style: FakeStyle;
  attrs: Map<string, string>;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

function createFakeTarget(): FakeTarget {
  const props = new Map<string, string>();
  const attrs = new Map<string, string>();
  return {
    style: {
      props,
      setProperty(name, value) {
        props.set(name, value);
      },
      removeProperty(name) {
        props.delete(name);
      }
    },
    attrs,
    setAttribute(name, value) {
      attrs.set(name, value);
    },
    removeAttribute(name) {
      attrs.delete(name);
    }
  };
}

interface FakeRafScheduler {
  now: number;
  pendingCallbacks: Map<number, FrameRequestCallback>;
  nextId: number;
  request(cb: FrameRequestCallback): number;
  cancel(id: number): void;
  /** Avança o relógio simulado e dispara o RAF agendado para esse instante. */
  advance(ms: number): void;
}

function installFakeRaf(): FakeRafScheduler {
  const sched: FakeRafScheduler = {
    now: 0,
    pendingCallbacks: new Map(),
    nextId: 1,
    request(cb) {
      const id = sched.nextId++;
      sched.pendingCallbacks.set(id, cb);
      return id;
    },
    cancel(id) {
      sched.pendingCallbacks.delete(id);
    },
    advance(ms) {
      sched.now += ms;
      const callbacks = Array.from(sched.pendingCallbacks.entries());
      sched.pendingCallbacks.clear();
      for (const [, cb] of callbacks) cb(sched.now);
    }
  };
  vi.stubGlobal("requestAnimationFrame", sched.request);
  vi.stubGlobal("cancelAnimationFrame", sched.cancel);
  vi.stubGlobal("performance", { now: () => sched.now });
  return sched;
}

interface FakeDocument {
  visibilityState: "visible" | "hidden";
  listeners: Map<string, Set<EventListener>>;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
  emit(type: string): void;
}

function installFakeDocument(visible = true): FakeDocument {
  const listeners = new Map<string, Set<EventListener>>();
  const doc: FakeDocument = {
    visibilityState: visible ? "visible" : "hidden",
    listeners,
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(listener);
    },
    removeEventListener(type, listener) {
      listeners.get(type)?.delete(listener);
    },
    emit(type) {
      const set = listeners.get(type);
      if (!set) return;
      for (const listener of set) listener(new Event(type));
    }
  };
  vi.stubGlobal("document", doc);
  return doc;
}

function installFakeWindow(reducedMotion: boolean): void {
  vi.stubGlobal("window", {
    matchMedia(query: string) {
      return {
        matches: query.includes("prefers-reduced-motion") && reducedMotion,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined
      };
    }
  });
}

describe("ForgeAnimator", () => {
  beforeEach(() => {
    installFakeWindow(false);
    installFakeDocument(true);
    installFakeRaf();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("aplica step inicial sem rodar RAF antes de avançar o relógio", () => {
    const profile = finalizeForgeBuild(createDefaultForgeBuild()).motionProfile;
    const target = createFakeTarget();

    const animator = createForgeAnimator({ target: target as unknown as HTMLElement, profile });

    expect(target.style.props.has("--forge-step-x")).toBe(true);
    expect(target.style.props.has("--forge-step-z")).toBe(true);
    expect(target.attrs.get("data-forge-phase")).toBe(profile.simulationSteps[0]?.phase);
    animator.destroy();
  });

  it("avança elapsed proporcional ao tempo decorrido", () => {
    const profile = finalizeForgeBuild(createDefaultForgeBuild()).motionProfile;
    const target = createFakeTarget();
    const sched = installFakeRaf();

    const animator = createForgeAnimator({ target: target as unknown as HTMLElement, profile });

    // 250ms == ~3 FIXED_TIMESTEP (cada step ~83.3ms). O elapsed deve refletir.
    sched.advance(250);
    expect(animator.getElapsed()).toBeGreaterThan(0.24);
    expect(animator.getElapsed()).toBeLessThan(0.26);
    animator.destroy();
  });

  it("preserva fase via initialElapsed em recreate", () => {
    const profile = finalizeForgeBuild(createDefaultForgeBuild()).motionProfile;
    const target = createFakeTarget();
    // Pula direto para metade do ciclo (~2.5 steps).
    const halfCycle = profile.simulationSteps.length * FIXED_TIMESTEP * 0.5;

    const animator = createForgeAnimator({
      target: target as unknown as HTMLElement,
      profile,
      initialElapsed: halfCycle
    });

    expect(animator.getElapsed()).toBeCloseTo(halfCycle, 5);
    // Step esperado: index ~ floor(2.5) == 2.
    expect(target.style.props.get("--forge-step-phase-index")).toBe("2");
    animator.destroy();
  });

  it("destroy limpa todas as variables e atributos publicados", () => {
    const profile = finalizeForgeBuild(createDefaultForgeBuild()).motionProfile;
    const target = createFakeTarget();

    const animator = createForgeAnimator({ target: target as unknown as HTMLElement, profile });
    animator.destroy();

    expect(target.style.props.has("--forge-step-x")).toBe(false);
    expect(target.style.props.has("--forge-step-z")).toBe(false);
    expect(target.style.props.has("--forge-step-t")).toBe(false);
    expect(target.style.props.has("--forge-step-progress")).toBe(false);
    expect(target.attrs.has("data-forge-phase")).toBe(false);
  });

  it("pausa em visibilitychange para hidden e retoma em visible", () => {
    const profile = finalizeForgeBuild(createDefaultForgeBuild()).motionProfile;
    const target = createFakeTarget();
    const doc = installFakeDocument(true);
    const sched = installFakeRaf();

    const animator = createForgeAnimator({ target: target as unknown as HTMLElement, profile });
    sched.advance(50);
    const elapsedBeforeHide = animator.getElapsed();

    doc.visibilityState = "hidden";
    doc.emit("visibilitychange");

    // Avança o relógio enquanto invisível: elapsed não deve crescer.
    sched.advance(500);
    expect(animator.getElapsed()).toBeCloseTo(elapsedBeforeHide, 5);

    doc.visibilityState = "visible";
    doc.emit("visibilitychange");
    sched.advance(50);
    expect(animator.getElapsed()).toBeGreaterThan(elapsedBeforeHide);
    animator.destroy();
  });

  it("respeita prefers-reduced-motion: pose congelada, sem RAF", () => {
    installFakeWindow(true);
    const profile = finalizeForgeBuild(createDefaultForgeBuild()).motionProfile;
    const target = createFakeTarget();
    const sched = installFakeRaf();

    const animator = createForgeAnimator({ target: target as unknown as HTMLElement, profile });

    // Step inicial aplicado, mas RAF não foi enfileirado.
    expect(target.style.props.get("--forge-step-phase-index")).toBe("0");
    expect(sched.pendingCallbacks.size).toBe(0);

    sched.advance(1000);
    expect(animator.getElapsed()).toBe(0);
    animator.destroy();
  });

  it("setProfile reaplica timeline mantendo elapsed (zero flash)", () => {
    const buildA = createDefaultForgeBuild();
    // Re-finaliza com mutação alterada: dispara recompute de motionProfile
    // (dashDistance/blinkRange variam com mutation), mas mantém shape válido.
    const buildB = finalizeForgeBuild({ ...createDefaultForgeBuild(), mutation: 88 });
    const target = createFakeTarget();
    const sched = installFakeRaf();

    const animator = createForgeAnimator({
      target: target as unknown as HTMLElement,
      profile: buildA.motionProfile
    });
    sched.advance(120);
    const elapsedBeforeSwap = animator.getElapsed();

    animator.setProfile(buildB.motionProfile);
    expect(animator.getElapsed()).toBeCloseTo(elapsedBeforeSwap, 5);
    animator.destroy();
  });
});
