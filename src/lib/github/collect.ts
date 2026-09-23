import type { RepoSnapshot } from './snapshot';

/** Uma consulta por repositório traz tudo que o instantâneo precisa. */
export const REPO_QUERY = `query($owner: String!, $name: String!, $since: GitTimestamp!, $until: GitTimestamp!) {
  repository(owner: $owner, name: $name) {
    stargazerCount
    defaultBranchRef { target { ... on Commit { history(since: $since, until: $until) { totalCount } } } }
    refs(refPrefix: "refs/heads/", first: 100) {
      pageInfo { hasNextPage }
      nodes { name target { ... on Commit { committedDate } } }
    }
    tags: refs(refPrefix: "refs/tags/", first: 1, orderBy: { field: TAG_COMMIT_DATE, direction: DESC }) {
      nodes { name }
    }
  }
}`;

/** O formato de `data.repository` devolvido por `REPO_QUERY`. */
export interface RepoQueryResult {
  stargazerCount: number;
  defaultBranchRef: { target: { history?: { totalCount: number } } } | null;
  refs: { nodes: { name: string; target: { committedDate?: string } }[]; pageInfo: { hasNextPage: boolean } };
  tags: { nodes: { name: string }[] };
}

/** Tamanho da janela de atividade, em dias. */
export const WINDOW_DAYS = 90;
const DAY_MS = 86_400_000;

/** Meia-noite UTC do dia de `now`. Coletas no mesmo dia dão o mesmo valor. */
export function snapshotDate(now: Date): string {
  return `${now.toISOString().slice(0, 10)}T00:00:00Z`;
}

/** Início da janela de atividade que termina em `generatedAt`. */
export function windowStart(generatedAt: string): string {
  return new Date(Date.parse(generatedAt) - WINDOW_DAYS * DAY_MS).toISOString();
}

/**
 * Converte a resposta do GraphQL em `RepoSnapshot`. O último commit é o
 * máximo entre TODAS as branches: `pushed_at` engana, e a branch padrão
 * sozinha também — o VampireAI tinha a `main` parada em junho e commit em
 * setembro numa branch de trabalho.
 */
export function toRepoSnapshot(repo: string, data: RepoQueryResult): RepoSnapshot {
  if (data.refs.pageInfo.hasNextPage) {
    throw new Error(`${repo}: mais de 100 branches — a consulta precisa de paginação.`);
  }
  const dates = data.refs.nodes
    .map((node) => node.target.committedDate)
    .filter((date): date is string => typeof date === 'string');
  if (dates.length === 0) {
    throw new Error(`${repo}: nenhuma branch com commit — o repositório está vazio?`);
  }
  const lastCommitAt = dates.reduce((a, b) => (Date.parse(b) > Date.parse(a) ? b : a));

  return {
    repo,
    lastCommitAt,
    commits90d: data.defaultBranchRef?.target.history?.totalCount ?? 0,
    latestTag: data.tags.nodes[0]?.name ?? null,
    stars: data.stargazerCount,
  };
}
