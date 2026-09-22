import type { RepoSnapshot } from './github/snapshot';

export const STATUSES = ['ativo', 'pausado', 'concluido'] as const;
export type Status = (typeof STATUSES)[number];

export const MOODS = [
  'formado',
  'a-todo-vapor',
  'ativo',
  'bocejando',
  'cochilando',
  'dormindo',
] as const;
export type Mood = (typeof MOODS)[number];

export type Overlay = 'capelo' | 'faisca' | 'zz' | 'poeira';

/** A partir daqui, um projeto ativo trabalha "a todo vapor". */
export const FULL_STEAM_COMMITS = 30;
/** Sem commit há mais que isto, `ativo` é tratado como `pausado`. */
export const STALE_ACTIVE_DAYS = 180;
/** Pausado boceja abaixo disto. */
export const YAWN_UNTIL_DAYS = 90;
/** Pausado cochila até isto, inclusive; acima, dorme. */
export const NAP_UNTIL_DAYS = 180;
/** Teto de estrelinhas em órbita. */
export const MAX_ORBITING_STARS = 5;

const DAY_MS = 86_400_000;

/** Dias inteiros entre duas datas ISO. Nunca negativo. */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.max(0, Math.floor((Date.parse(toIso) - Date.parse(fromIso)) / DAY_MS));
}

export interface MoodResult {
  mood: Mood;
  /** O status depois da correção pelo dado. */
  effectiveStatus: Status;
  daysSinceCommit: number;
  overlays: Overlay[];
  versionBadge: string | null;
  orbitingStars: number;
  /** Preenchido quando o dado contradiz o status escrito no MDX. */
  warning: string | null;
}

const OVERLAYS: Record<Mood, readonly Overlay[]> = {
  formado: ['capelo'],
  'a-todo-vapor': ['faisca'],
  ativo: [],
  bocejando: [],
  cochilando: ['zz'],
  dormindo: ['zz', 'poeira'],
};

/**
 * A regra da §5.4 da spec. O dado diz quanto tempo; o status diz o que isso
 * significa — exceto quando o status mente: `ativo` sem commit há mais de
 * `STALE_ACTIVE_DAYS` dias é tratado como `pausado`, com aviso para o build.
 */
export function resolveMood(status: Status, repo: RepoSnapshot, today: string): MoodResult {
  const days = daysBetween(repo.lastCommitAt, today);

  let effectiveStatus: Status = status;
  let warning: string | null = null;
  if (status === 'ativo' && days > STALE_ACTIVE_DAYS) {
    effectiveStatus = 'pausado';
    warning =
      `${repo.repo} está marcado como "ativo", mas o último commit foi há ${days} dias. ` +
      'Tratado como "pausado" — atualize o status no MDX.';
  }

  let mood: Mood;
  if (effectiveStatus === 'concluido') mood = 'formado';
  else if (effectiveStatus === 'ativo') {
    mood = repo.commits90d >= FULL_STEAM_COMMITS ? 'a-todo-vapor' : 'ativo';
  } else if (days < YAWN_UNTIL_DAYS) mood = 'bocejando';
  else if (days <= NAP_UNTIL_DAYS) mood = 'cochilando';
  else mood = 'dormindo';

  return {
    mood,
    effectiveStatus,
    daysSinceCommit: days,
    overlays: [...OVERLAYS[mood]],
    versionBadge: repo.latestTag,
    orbitingStars: Math.min(repo.stars, MAX_ORBITING_STARS),
    warning,
  };
}
