import type { ForgeMotionProfile, ForgeMotionStep } from "../domain/characterForge";
import { FIXED_TIMESTEP } from "../simulation/replay";

// 5.1 — Curvas por fase. Mantemos as 5 fases canônicas e atribuímos uma easing
// função pura por fase. Tudo data-first: o animator não conhece keyframes.
type Easing = (t: number) => number;

const easeIn: Easing = (t) => t * t;
const linear: Easing = (t) => t;
const snap: Easing = (t) => (t < 0.5 ? t * 0.4 : 0.2 + (t - 0.5) * 1.6);
const easeOut: Easing = (t) => 1 - (1 - t) * (1 - t);
const easeInOut: Easing = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const PHASE_EASING: Record<ForgeMotionStep["phase"], Easing> = {
  start: easeInOut,
  windup: easeIn,
  travel: linear,
  impact: snap,
  recover: easeOut
};

// 5.2 — Timeline canônica: 1 step do simulationSteps == 1 FIXED_TIMESTEP da
// simulação (1/12s). 5 steps == ~417ms por ciclo. Importante: sincroniza com
// replay e com qualquer mob spawnado no Runtime que use o mesmo profile.
const STEP_DURATION_SECONDS = FIXED_TIMESTEP;

export interface ForgeAnimatorOptions {
  /** Elemento que recebe as CSS variables (tipicamente .forge-hero). */
  readonly target: HTMLElement;
  /** Profile de movimento canônico do build atual. */
  readonly profile: ForgeMotionProfile;
  /**
   * Ativo só quando true. Padrão `true`. O caller pode passar `false` em
   * cenários de "pose estática" (idle/death) para economizar CPU.
   */
  readonly enabled?: boolean;
  /**
   * Tempo decorrido inicial em segundos. Útil quando o `.forge-hero` é
   * recriado por re-render mas queremos manter a fase em curso (sem reset).
   */
  readonly initialElapsed?: number;
}

export interface ForgeAnimatorHandle {
  /** Atualiza profile sem desmontar (usuário troca DNA/skill). */
  setProfile(profile: ForgeMotionProfile): void;
  /** Liga/desliga o RAF preservando a última pose conhecida. */
  setEnabled(enabled: boolean): void;
  /** Pausa explícita (usado por IntersectionObserver/visibilitychange). */
  pause(): void;
  /** Retoma de onde parou (mantém fase consistente). */
  resume(): void;
  /** Para o RAF e remove as variables; idempotente. */
  destroy(): void;
  /** Tempo decorrido atual; usado para preservar fase em recreate. */
  getElapsed(): number;
}

interface InternalState {
  profile: ForgeMotionProfile;
  enabled: boolean;
  running: boolean;
  rafId: number;
  lastNow: number;
  elapsed: number;
  destroyed: boolean;
}

/**
 * 5.3 — Cria um animator que dirige `--forge-step-x|z|t|phase` no elemento.
 *
 * Princípios invioláveis:
 * - É um adapter: o profile é a verdade, o DOM é leitura.
 * - Respeita `prefers-reduced-motion`: ao ligar, fixa pose `start` e não roda RAF.
 * - Pausa quando `document.visibilityState !== 'visible'` automaticamente.
 * - Não mexe em transforms diretos do `.forge-avatar`; só publica variables.
 *   O CSS escolhe se consome (`data-driven="true"`) ou não.
 */
export function createForgeAnimator(options: ForgeAnimatorOptions): ForgeAnimatorHandle {
  const { target } = options;
  const reducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state: InternalState = {
    profile: options.profile,
    enabled: options.enabled ?? true,
    running: false,
    rafId: 0,
    lastNow: 0,
    elapsed: Math.max(0, options.initialElapsed ?? 0),
    destroyed: false
  };

  const onVisibilityChange = (): void => {
    if (state.destroyed) return;
    if (document.visibilityState === "visible" && state.enabled && !reducedMotion) start();
    else stop();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);

  // Estado inicial: aplica timeline ao tempo herdado (preserva fase em recreate)
  // ou ao step 0 quando começamos do zero. Cobre também reduced-motion.
  if (state.elapsed > 0) applyTimeline(target, state.profile, state.elapsed);
  else applyStep(target, state.profile, 0);

  if (reducedMotion) {
    // Não roda RAF nem assina nada além de visibilitychange (que ainda assim
    // não vai ligar nada). A pose congelada é suficiente.
  } else if (state.enabled && document.visibilityState === "visible") {
    start();
  }

  function start(): void {
    if (state.running || state.destroyed) return;
    state.running = true;
    state.lastNow = performance.now();
    state.rafId = requestAnimationFrame(tick);
  }

  function stop(): void {
    if (!state.running) return;
    state.running = false;
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }

  function tick(now: number): void {
    if (state.destroyed || !state.running) return;
    const dt = Math.max(0, (now - state.lastNow) / 1000);
    state.lastNow = now;
    state.elapsed += dt;
    applyTimeline(target, state.profile, state.elapsed);
    state.rafId = requestAnimationFrame(tick);
  }

  return {
    setProfile(profile) {
      state.profile = profile;
      // Reaplica imediatamente para evitar "flash" da pose anterior em mudança de DNA.
      applyTimeline(target, profile, state.elapsed);
    },
    setEnabled(enabled) {
      state.enabled = enabled;
      if (!enabled) stop();
      else if (!reducedMotion && document.visibilityState === "visible") start();
    },
    pause() {
      stop();
    },
    resume() {
      if (!reducedMotion && state.enabled && document.visibilityState === "visible") start();
    },
    destroy() {
      if (state.destroyed) return;
      state.destroyed = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Limpa as vars para não vazarem em re-renders subsequentes.
      target.style.removeProperty("--forge-step-x");
      target.style.removeProperty("--forge-step-z");
      target.style.removeProperty("--forge-step-t");
      target.style.removeProperty("--forge-step-progress");
      target.style.removeProperty("--forge-step-phase-index");
      target.removeAttribute("data-forge-phase");
    },
    getElapsed() {
      return state.elapsed;
    }
  };
}

// 5.4 — Resolve a pose para um tempo absoluto em segundos. Loop infinito sobre
// a duração total (steps.length * STEP_DURATION_SECONDS). Interpola entre
// step[i] e step[i+1] usando a easing da fase de step[i+1] (a que está sendo
// "executada"). Em loops, step[final] interpola com step[0] (recover -> start).
function applyTimeline(target: HTMLElement, profile: ForgeMotionProfile, elapsedSeconds: number): void {
  const steps = profile.simulationSteps;
  if (steps.length === 0) return;
  const cycle = steps.length * STEP_DURATION_SECONDS;
  const local = ((elapsedSeconds % cycle) + cycle) % cycle;
  const stepIndex = Math.floor(local / STEP_DURATION_SECONDS);
  const tInStep = (local - stepIndex * STEP_DURATION_SECONDS) / STEP_DURATION_SECONDS;
  const current = steps[stepIndex];
  const next = steps[(stepIndex + 1) % steps.length];
  const eased = (PHASE_EASING[next.phase] ?? linear)(tInStep);

  const x = current.x + (next.x - current.x) * eased;
  const z = current.z + (next.z - current.z) * eased;
  // Progresso normalizado 0..1 sobre o maior x dos steps. Permite que o CSS
  // use `--forge-step-progress` para posicionar elementos relativos ao track
  // sem precisar conhecer a escala em metros.
  const maxX = profile.simulationSteps.reduce((acc, step) => Math.max(acc, Math.abs(step.x)), 0) || 1;
  const progress = Math.max(0, Math.min(1, Math.abs(x) / maxX));

  target.style.setProperty("--forge-step-x", x.toFixed(3));
  target.style.setProperty("--forge-step-z", z.toFixed(3));
  target.style.setProperty("--forge-step-t", eased.toFixed(3));
  target.style.setProperty("--forge-step-progress", progress.toFixed(4));
  target.style.setProperty("--forge-step-phase-index", String(stepIndex));
  // Atributo separado para seletores CSS quererem reagir a fase
  // (e.g. .forge-hero[data-forge-phase="impact"] .forge-action-arc { ... })
  target.setAttribute("data-forge-phase", current.phase);
}

function applyStep(target: HTMLElement, profile: ForgeMotionProfile, index: number): void {
  const step = profile.simulationSteps[index];
  if (!step) return;
  target.style.setProperty("--forge-step-x", step.x.toFixed(3));
  target.style.setProperty("--forge-step-z", step.z.toFixed(3));
  target.style.setProperty("--forge-step-t", "0");
  target.style.setProperty("--forge-step-phase-index", String(index));
  target.setAttribute("data-forge-phase", step.phase);
}
