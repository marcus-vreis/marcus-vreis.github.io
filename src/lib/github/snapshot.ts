/** Dados de um repositório no instantâneo. Todo campo vem do GitHub. */
export interface RepoSnapshot {
  /** `owner/nome`, igual à chave em `Snapshot.repos`. */
  repo: string;
  /** ISO 8601. Último commit, máximo entre todas as branches. */
  lastCommitAt: string;
  /** Commits na branch padrão nos 90 dias anteriores a `generatedAt`. */
  commits90d: number;
  /** Tag mais recente por data de commit, ou `null` se não houver. */
  latestTag: string | null;
  stars: number;
}

export interface Snapshot {
  /** ISO 8601, meia-noite UTC do dia da coleta. É o "hoje" do humor: o
   *  build nunca consulta o relógio, então é reproduzível. */
  generatedAt: string;
  repos: Record<string, RepoSnapshot>;
}

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

function fail(path: string, message: string): never {
  throw new Error(`Instantâneo do GitHub inválido em ${path}: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isoAt(value: unknown, path: string): string {
  if (typeof value !== 'string' || !ISO_UTC.test(value) || Number.isNaN(Date.parse(value))) {
    fail(path, `esperava data ISO 8601 em UTC, veio ${JSON.stringify(value)}`);
  }
  return value;
}

function countAt(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    fail(path, `esperava inteiro maior ou igual a zero, veio ${JSON.stringify(value)}`);
  }
  return value;
}

/** Valida o JSON do instantâneo e o devolve tipado. Falha alto, com o caminho. */
export function parseSnapshot(raw: unknown): Snapshot {
  if (!isRecord(raw)) fail('$', 'esperava um objeto');
  const generatedAt = isoAt(raw.generatedAt, '$.generatedAt');
  if (!isRecord(raw.repos)) fail('$.repos', 'esperava um objeto');

  const repos: Record<string, RepoSnapshot> = {};
  for (const [key, value] of Object.entries(raw.repos)) {
    const path = `$.repos["${key}"]`;
    if (!isRecord(value)) fail(path, 'esperava um objeto');
    if (value.repo !== key) {
      fail(`${path}.repo`, `deveria ser "${key}", veio ${JSON.stringify(value.repo)}`);
    }

    let latestTag: string | null;
    if (value.latestTag === null) latestTag = null;
    else if (typeof value.latestTag === 'string') latestTag = value.latestTag;
    else fail(`${path}.latestTag`, `esperava string ou null, veio ${JSON.stringify(value.latestTag)}`);

    repos[key] = {
      repo: key,
      lastCommitAt: isoAt(value.lastCommitAt, `${path}.lastCommitAt`),
      commits90d: countAt(value.commits90d, `${path}.commits90d`),
      latestTag,
      stars: countAt(value.stars, `${path}.stars`),
    };
  }
  return { generatedAt, repos };
}
