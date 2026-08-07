export interface SupportProbes {
  hasWebGL2: () => boolean;
  prefersReducedMotion: () => boolean;
}

/** Sondas reais do navegador. Separadas para o teste poder substituí-las. */
export const browserProbes: SupportProbes = {
  hasWebGL2: () => {
    const canvas = document.createElement('canvas');
    return canvas.getContext('webgl2') !== null;
  },
  prefersReducedMotion: () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

/**
 * O efeito é enfeite: qualquer dúvida resolve em não animar, e o visitante
 * fica com a imagem estática, que já é o conteúdo real.
 */
export function shouldAnimate(probes: SupportProbes): boolean {
  try {
    return probes.hasWebGL2() && !probes.prefersReducedMotion();
  } catch {
    return false;
  }
}
