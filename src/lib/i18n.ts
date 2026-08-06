export const LOCALES = ['pt', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pt';

/** O segmento da rota de projeto é traduzido; o resto do caminho não é. */
const PROJECT_SEGMENT: Record<Locale, string> = { pt: 'projeto', en: 'project' };

export type Route = { kind: 'home' } | { kind: 'project'; slug: string };

export function parsePath(pathname: string): { locale: Locale; route: Route } {
  const parts = pathname.split('/').filter(Boolean);
  let locale: Locale = DEFAULT_LOCALE;

  if (parts[0] === 'en') {
    locale = 'en';
    parts.shift();
  }

  if (parts.length === 0) return { locale, route: { kind: 'home' } };

  if (parts[0] === PROJECT_SEGMENT[locale] && parts[1]) {
    return { locale, route: { kind: 'project', slug: parts[1] } };
  }

  return { locale, route: { kind: 'home' } };
}

export function buildPath(route: Route, locale: Locale): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  if (route.kind === 'home') return `${prefix}/`;
  return `${prefix}/${PROJECT_SEGMENT[locale]}/${route.slug}`;
}

export function switchLocale(pathname: string, target: Locale): string {
  const { route } = parsePath(pathname);
  return buildPath(route, target);
}
