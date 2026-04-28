// Debounce com flush em idle. Para escritas/efeitos colaterais que são
// caros mas não urgentes — typing em busca, salvar prefs de UI em
// localStorage, recomputar listas filtradas.
//
// Diferença para o flushScheduler do repo: este é síncrono e generic;
// aquele é assíncrono e gerencia uma única "task pendente" por repo.

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

export interface IdleDebounced<T extends (...args: never[]) => void> {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
}

export function idleDebounce<T extends (...args: never[]) => void>(
  fn: T,
  delayMs = 200
): IdleDebounced<T> {
  const idle = pickIdleApi();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let idleHandle: IdleHandle | undefined;
  let lastArgs: Parameters<T> | undefined;

  function clear(): void {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (idleHandle !== undefined) {
      idle.cancel(idleHandle);
      idleHandle = undefined;
    }
  }

  function run(): void {
    const args = lastArgs;
    lastArgs = undefined;
    if (args) fn(...args);
  }

  const wrapper = ((...args: Parameters<T>) => {
    lastArgs = args;
    clear();
    timer = setTimeout(() => {
      timer = undefined;
      idleHandle = idle.request(() => {
        idleHandle = undefined;
        run();
      });
    }, delayMs);
  }) as IdleDebounced<T>;

  wrapper.cancel = () => {
    clear();
    lastArgs = undefined;
  };

  wrapper.flush = () => {
    clear();
    run();
  };

  return wrapper;
}
