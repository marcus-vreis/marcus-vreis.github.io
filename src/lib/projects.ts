import type { Locale } from './i18n';

/** Extrai o slug de um id `<locale>/<slug>`, falhando alto se o formato mudar. */
export function slugOf(id: string): string {
  const [locale, slug, ...rest] = id.split('/');
  if (!locale || !slug || rest.length > 0) {
    throw new Error(`id fora do formato <locale>/<slug>: ${id}`);
  }
  return slug;
}

/** Filtra as entradas de um idioma e ordena pela posição no trilho. */
export function entriesFor<T extends { id: string; data: { order: number } }>(
  all: T[],
  locale: Locale,
): T[] {
  return all
    .filter((e) => e.id.startsWith(`${locale}/`))
    .sort((a, b) => a.data.order - b.data.order);
}
