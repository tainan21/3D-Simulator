// Agendador de flush: idle + debounce.
//
// Garante que escritas no storage NUNCA aconteçam dentro do hot path
// (renderFrame, simulation tick). Mutações disparam um agendamento;
// quando a aba estiver ociosa por DEBOUNCE_MS, executa o flush.

const DEBOUNCE_MS = 400;

type IdleHandle = ReturnType<typeof setTimeout> | number;

interface IdleApi {
  request: (cb: () => void) => IdleHandle;
  cancel: (handle: IdleHandle) => void;
}

function pickIdleApi(): IdleApi {
  const w = globalThis as typeof globalThis & {
    requestIdleCallback?: (cb: () => void) => number;
    cancelIdleCallback?: (handle: number) => void;
  };
  if (typeof w.requestIdleCallback === "function" && typeof w.cancelIdleCallback === "function") {
    return {
      request: (cb) => w.requestIdleCallback!(cb),
      cancel: (handle) => w.cancelIdleCallback!(handle as number),
    };
  }
  return {
    request: (cb) => setTimeout(cb, 16),
    cancel: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
  };
}

export interface FlushScheduler {
  schedule(task: () => Promise<void> | void): void;
  flushNow(): Promise<void>;
  pending(): boolean;
}

export function createFlushScheduler(debounceMs = DEBOUNCE_MS): FlushScheduler {
  const idle = pickIdleApi();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let idleHandle: IdleHandle | undefined;
  let pendingTask: (() => Promise<void> | void) | undefined;
  let running: Promise<void> | undefined;

  function clearTimers(): void {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (idleHandle !== undefined) {
      idle.cancel(idleHandle);
      idleHandle = undefined;
    }
  }

  async function execute(): Promise<void> {
    const task = pendingTask;
    pendingTask = undefined;
    if (!task) return;
    try {
      await task();
    } catch (err) {
      // Não derrubar UI por falha de storage.
      console.warn("[repo] flush failed:", (err as Error).message);
    }
  }

  function arm(): void {
    clearTimers();
    timer = setTimeout(() => {
      timer = undefined;
      idleHandle = idle.request(() => {
        idleHandle = undefined;
        running = execute().finally(() => {
          running = undefined;
        });
      });
    }, debounceMs);
  }

  return {
    schedule(task) {
      // Combina mutações: a última task vence (representa estado mais novo).
      pendingTask = task;
      arm();
    },
    async flushNow() {
      clearTimers();
      if (running) await running;
      running = execute().finally(() => {
        running = undefined;
      });
      await running;
    },
    pending() {
      return pendingTask !== undefined || running !== undefined;
    },
  };
}
