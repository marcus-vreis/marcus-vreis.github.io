/**
 * Compara os slugs presentes em cada idioma e descreve as divergências.
 * Devolve lista vazia quando há paridade. A ordem da saída é estável para
 * que a mensagem de erro do build seja determinística.
 */
export function findParityErrors(ptSlugs: string[], enSlugs: string[]): string[] {
  const pt = new Set(ptSlugs);
  const en = new Set(enSlugs);
  const errors: string[] = [];

  for (const slug of [...pt].sort()) {
    if (!en.has(slug)) errors.push(`Falta a versão EN de: ${slug}`);
  }
  for (const slug of [...en].sort()) {
    if (!pt.has(slug)) errors.push(`Falta a versão PT de: ${slug}`);
  }

  return errors;
}

/** Lança se houver divergência. Chamado no build, a partir das páginas home. */
export function assertParity(ptSlugs: string[], enSlugs: string[]): void {
  if (ptSlugs.length === 0 || enSlugs.length === 0) {
    throw new Error(
      'Coleção de projetos vazia — o formato de `entry.id` provavelmente mudou. ' +
        'Esperado `<locale>/<slug>`; ver generateId em src/content.config.ts.',
    );
  }
  const errors = findParityErrors(ptSlugs, enSlugs);
  if (errors.length > 0) {
    throw new Error(`Paridade PT/EN quebrada:\n  ${errors.join('\n  ')}`);
  }
}
