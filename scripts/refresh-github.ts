// Atualiza src/data/github-snapshot.json a partir da API GraphQL do GitHub.
//
//   GITHUB_TOKEN=$(gh auth token) npm run refresh:github
//
// O build nunca acessa a rede: ele lê o arquivo que este script grava. Se
// qualquer repositório falhar, nada é gravado e o instantâneo anterior fica.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  REPO_QUERY,
  snapshotDate,
  toRepoSnapshot,
  windowStart,
  type RepoQueryResult,
} from '../src/lib/github/collect.ts';
import { githubFieldOf } from '../src/lib/github/content-repos.ts';
import { parseSnapshot, type RepoSnapshot } from '../src/lib/github/snapshot.ts';

const CONTENT_DIR = join(process.cwd(), 'src/content/projects/pt');
const OUT = join(process.cwd(), 'src/data/github-snapshot.json');

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN ausente. Localmente: GITHUB_TOKEN=$(gh auth token) npm run refresh:github');
  process.exit(1);
}

function reposFromContent(): string[] {
  const repos = readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => githubFieldOf(readFileSync(join(CONTENT_DIR, file), 'utf-8')))
    .filter((repo): repo is string => repo !== null);
  return [...new Set(repos)].sort();
}

async function fetchRepo(repo: string, since: string, until: string): Promise<RepoQueryResult> {
  const [owner, name] = repo.split('/');
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-refresh-github',
    },
    body: JSON.stringify({ query: REPO_QUERY, variables: { owner, name, since, until } }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${repo}: HTTP ${response.status}`);
  const json = (await response.json()) as {
    data?: { repository: RepoQueryResult | null };
    errors?: { message: string }[];
  };
  if (json.errors?.length) {
    throw new Error(`${repo}: ${json.errors.map((e) => e.message).join('; ')}`);
  }
  if (!json.data?.repository) throw new Error(`${repo}: repositório não encontrado ou sem acesso`);
  return json.data.repository;
}

const generatedAt = snapshotDate(new Date());
const since = windowStart(generatedAt);
const repos: Record<string, RepoSnapshot> = {};

for (const repo of reposFromContent()) {
  const snap = toRepoSnapshot(repo, await fetchRepo(repo, since, generatedAt));
  repos[repo] = snap;
  console.log(`ok ${repo}  ${snap.lastCommitAt.slice(0, 10)}  ${snap.commits90d} commits/90d`);
}

// Valida antes de gravar: o que sai daqui é exatamente o que o build aceita.
const snapshot = parseSnapshot({ generatedAt, repos });
writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`gravado ${OUT} — ${Object.keys(repos).length} repositórios, ${generatedAt}`);
