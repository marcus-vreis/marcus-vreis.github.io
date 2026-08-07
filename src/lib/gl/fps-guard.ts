// Numa GPU fraca o efeito precisa sair de cena sozinho, sem o visitante ter
// que pedir. A guarda observa a média móvel do intervalo entre quadros e
// reprova — de vez, sem se recuperar — quando ela indica FPS abaixo do piso.

export interface FpsGuardOptions {
  sampleSize: number;
  minFps: number;
}

export interface FpsGuard {
  /** Registra o intervalo (ms) desde o quadro anterior. Devolve `false`
   *  assim que a média móvel cair abaixo do piso, e nunca mais volta a
   *  `true`. */
  record(deltaMs: number): boolean;
}

/** Acima disso o quadro não é GPU lenta — é aba em segundo plano ou pausa
 *  do sistema. Descartado sem entrar na média. */
const MAX_PLAUSIBLE_DELTA_MS = 1000;

export function createFpsGuard({ sampleSize, minFps }: FpsGuardOptions): FpsGuard {
  const samples: number[] = [];
  let failed = false;

  return {
    record(deltaMs: number): boolean {
      if (failed) return false;
      if (deltaMs > MAX_PLAUSIBLE_DELTA_MS) return true;

      samples.push(deltaMs);
      if (samples.length > sampleSize) samples.shift();
      if (samples.length < sampleSize) return true;

      const avgMs = samples.reduce((sum, s) => sum + s, 0) / samples.length;
      const fps = 1000 / avgMs;
      if (fps < minFps) {
        failed = true;
        return false;
      }
      return true;
    },
  };
}
