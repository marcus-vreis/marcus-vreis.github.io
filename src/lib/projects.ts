import type { Locale } from './i18n';

/** `projeto` vira máquina no chão e linha no índice; `pesquisa` vai para o "Sobre". */
export const KINDS = ['projeto', 'pesquisa'] as const;
export type Kind = (typeof KINDS)[number];

/** Extrai o slug de um id `<locale>/<slug>`, falhando alto se o formato mudar. */
export function slugOf(id: string): string {
  const [locale, slug, ...rest] = id.split('/');
  if (!locale || !slug || rest.length > 0) {
    throw new Error(`id fora do formato <locale>/<slug>: ${id}`);
  }
  return slug;
}

/** Filtra as entradas de um idioma e ordena pela ordem do conteúdo. */
export function entriesFor<T extends { id: string; data: { order: number } }>(
  all: T[],
  locale: Locale,
): T[] {
  return all
    .filter((e) => e.id.startsWith(`${locale}/`))
    .sort((a, b) => a.data.order - b.data.order);
}
