import { buildPath, type Locale } from './i18n';
import { resolveMood, type Mood, type Status } from './mood';
import { entriesFor, slugOf, type Kind } from './projects';
import { formatSince } from './relative-time';
import type { Snapshot } from './github/snapshot';
import { UI } from './ui-strings';

/** O mínimo de uma entrada da coleção que o índice precisa. */
export interface ProjectLike {
  id: string;
  data: {
    title: string;
    accent: string;
    accentLight: string;
    order: number;
    kind: Kind;
    status?: Status;
    github?: string;
  };
}

export interface IndexRow {
  slug: string;
  title: string;
  href: string;
  accent: string;
  accentLight: string;
  mood: Mood;
  moodLabel: string;
  /** "último commit há 24 dias · v0.10.0" */
  detail: string;
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
    .map((entry): IndexRow => {
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
        title: entry.data.title,
        href: buildPath({ kind: 'project', slug }, locale),
        accent: entry.data.accent,
        accentLight: entry.data.accentLight,
        mood: result.mood,
        moodLabel: t.moods[result.mood],
        detail: result.versionBadge
          ? `${t.lastCommitLabel} ${since} · ${result.versionBadge}`
          : `${t.lastCommitLabel} ${since}`,
      };
    });

  return { rows, warnings };
}
