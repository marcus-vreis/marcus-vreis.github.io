// Decide QUANDO um shader de estação roda. WebGL fica de fora desta decisão
// de propósito: ela é pura, então é testável sem navegador.

export interface StationPlan {
  mount: string[];
  dispose: string[];
}

/**
 * Decide quais estações devem ter shader vivo: a visível e a seguinte, para
 * que a próxima já esteja compilada quando chegar. Todo o resto é descartado —
 * manter dez contextos WebGL vivos é a forma mais rápida de derrubar uma GPU
 * integrada.
 */
export function planStations(
  all: string[],
  active: string | null,
  mounted: string[] = [],
): StationPlan {
  const index = active === null ? -1 : all.indexOf(active);
  const wanted = index < 0 ? [] : all.slice(index, index + 2);

  return {
    mount: wanted.filter((s) => !mounted.includes(s)),
    dispose: mounted.filter((s) => !wanted.includes(s)),
  };
}
