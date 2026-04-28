// Coalesce eventos contínuos (pointermove, mousemove, wheel) em UM disparo
// por animation frame. Mantém o último argumento — o callback recebe o
// evento mais recente, garantindo correção de drag/camera sem custo em
// monitores 120/144Hz e sem mudar a forma de escrita do callback.
//
// Uso:
//   const onPointerMove = rafThrottle((event: PointerEvent) => { ... });
//   window.addEventListener("pointermove", onPointerMove);
//   ...
//   onPointerMove.cancel(); // cleanup opcional
//
// Política inviolável: o domínio/simulação não devem nunca depender desse
// throttle — ele só serve para handlers de UI. setState dentro do callback
// continua determinístico; a simulação roda no rAF principal do controller.

export type RafThrottled<T extends (...args: never[]) => void> = T & {
  cancel: () => void;
  flush: () => void;
};

export function rafThrottle<T extends (...args: never[]) => void>(fn: T): RafThrottled<T> {
  let scheduled = false;
  let lastArgs: Parameters<T> | undefined;
  let handle = 0;

  const wrapper = ((...args: Parameters<T>) => {
    lastArgs = args;
    if (scheduled) return;
    scheduled = true;
    handle = requestAnimationFrame(() => {
      scheduled = false;
      const next = lastArgs;
      lastArgs = undefined;
      if (next) fn(...next);
    });
  }) as RafThrottled<T>;

  wrapper.cancel = () => {
    if (scheduled) {
      cancelAnimationFrame(handle);
      scheduled = false;
    }
    lastArgs = undefined;
  };

  wrapper.flush = () => {
    if (!scheduled) return;
    cancelAnimationFrame(handle);
    scheduled = false;
    const next = lastArgs;
    lastArgs = undefined;
    if (next) fn(...next);
  };

  return wrapper;
}
