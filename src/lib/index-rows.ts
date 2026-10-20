import { buildPath, type Locale } from './i18n';
import { resolveMood, type Mood, type Status } from './mood';
import { entriesFor, slugOf, type Kind } from './projects';
import { formatSince } from './relative-time';
import type { Snapshot } from './github/snapshot';
import { UI, type CharacterId } from './ui-strings';

/** O mínimo de uma entrada da coleção que o índice precisa. */
export interface ProjectLike {
  id: string;
  data: {
    title: string;
    persona?: string;
    tagline?: string;
    accent: string;
    accentLight: string;
    order: number;
    kind: Kind;
    status?: Status;
    github?: string;
    character?: string;
    year?: string;
    stack?: string[];
  };
}

export interface IndexRow {
  slug: string;
  indexNumber: string;
  title: string;
  persona: string;
  tagline: string;
  character: CharacterId;
  year: string;
  stack: string[];
  href: string;
  accent: string;
  accentLight: string;
  mood: Mood;
  moodLabel: string;
  commits90d: number;
  latestTag: string | null;
  stars: number;
  /** "último commit há 24 dias · v0.10.0" */
  detail: string;
}

const VALID_CHARACTERS = new Set<CharacterId>([
  'lente',
  'custodia',
  'fliperama',
  'estacao',
  'scanner',
  'cafeteira',
  'plotter',
  'esteira',
  'nevoeiro',
]);

function normalizeCharacter(value?: string): CharacterId {
  if (value && VALID_CHARACTERS.has(value as CharacterId)) {
    return value as CharacterId;
  }
  return 'lente';
}

/**
 * As linhas do índice: só `kind: projeto`, na ordem do conteúdo, com o humor
 * calculado contra o dia do instantâneo — nunca contra o relógio, para o
 * build ser reproduzível.
 */
export function buildIndexRows(
  all: ProjectLike[],
  snapshot: Snapshot,
  locale: Locale,
): { rows: IndexRow[]; warnings: string[] } {
  const t = UI[locale];
  const warnings: string[] = [];

  const rows = entriesFor(all, locale)
    .filter((entry) => entry.data.kind === 'projeto')
    .map((entry, idx): IndexRow => {
      const slug = slugOf(entry.id);
      const { status, github } = entry.data;
      if (!status || !github) {
        throw new Error(`${entry.id}: projeto sem status ou github — o schema deveria ter barrado isto.`);
      }
      const repo = snapshot.repos[github];
      if (!repo) {
        throw new Error(
          `${github} (de ${entry.id}) não está no instantâneo do GitHub. Rode: GITHUB_TOKEN=$(gh auth token) npm run refresh:github`,
        );
      }

      const result = resolveMood(status, repo, snapshot.generatedAt);
      if (result.warning) warnings.push(result.warning);
      const since = formatSince(result.daysSinceCommit, locale);

      return {
        slug,
        indexNumber: String(idx + 1).padStart(2, '0'),
        title: entry.data.title,
        persona: entry.data.persona ?? '',
        tagline: entry.data.tagline ?? '',
        character: normalizeCharacter(entry.data.character),
        year: entry.data.year ?? '',
        stack: entry.data.stack ?? [],
        href: buildPath({ kind: 'project', slug }, locale),
        accent: entry.data.accent,
        accentLight: entry.data.accentLight,
        mood: result.mood,
        moodLabel: t.moods[result.mood],
        commits90d: repo.commits90d,
        latestTag: result.versionBadge,
        stars: repo.stars,
        detail: result.versionBadge
          ? `${t.lastCommitLabel} ${since} · ${result.versionBadge}`
          : `${t.lastCommitLabel} ${since}`,
      };
    });

  return { rows, warnings };
}
