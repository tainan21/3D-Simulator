// Pausa renderers cujos hosts estão fora da viewport via IntersectionObserver.
// O contrato canônico exige que adapters de leitura (Phaser/Three) sejam
// pauseáveis sem efeito colateral na simulação. Esse helper apenas orquestra
// chamadas pause/resume — a verdade matemática continua intocada.

export interface PausableRenderer {
  pause?: () => void;
  resume?: () => void;
}

export interface VisibilityPauseOptions {
  // Razão mínima visível para considerar "ativo". 0 = qualquer pixel; 0.05
  // funciona bem para evitar resumes em transições milimétricas.
  threshold?: number;
  // Margem em px expandindo a viewport — útil para pré-carregar antes do
  // canvas entrar de fato em tela.
  rootMargin?: string;
}

export function attachVisibilityPause(
  host: Element,
  renderer: PausableRenderer,
  options: VisibilityPauseOptions = {}
): () => void {
  // Sem suporte a IntersectionObserver: não fazemos nada (renderer fica como está).
  if (typeof IntersectionObserver === "undefined") return () => {};
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) renderer.resume?.();
        else renderer.pause?.();
      }
    },
    {
      threshold: options.threshold ?? 0.05,
      rootMargin: options.rootMargin ?? "0px",
    }
  );
  observer.observe(host);
  return () => observer.disconnect();
}
