import type { Locale } from './i18n';

const INTL_LOCALE: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

/**
 * "hoje", "ontem", "há 24 dias", "há 3 meses", "há 2 anos". Dias até 59,
 * meses até 729 dias, anos a partir daí: o índice lê como gente fala, sem
 * fingir precisão que a granularidade não tem.
 */
export function formatSince(days: number, locale: Locale): string {
  const rtf = new Intl.RelativeTimeFormat(INTL_LOCALE[locale], { numeric: 'auto' });
  if (days < 60) return rtf.format(days === 0 ? 0 : -days, 'day');
  if (days < 730) return rtf.format(-Math.floor(days / 30), 'month');
  return rtf.format(-Math.floor(days / 365), 'year');
}
