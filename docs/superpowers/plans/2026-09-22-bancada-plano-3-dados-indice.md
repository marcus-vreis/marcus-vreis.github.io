# A Bancada — Plano 3: dados, humor e índice

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar a rolagem de estações pela estrutura da Bancada — hero, índice de projetos com humor calculado a partir de um instantâneo diário do GitHub, e "Sobre" com a pesquisa — ainda sem canvas.

**Architecture:** Um script coleta dados do GitHub via GraphQL e grava `src/data/github-snapshot.json`, que é commitado; o build só lê esse arquivo e nunca acessa a rede. Uma função pura (`resolveMood`) cruza o `status` escrito no MDX com o instantâneo, usando a data do instantâneo como "hoje" para o build ser reproduzível. A home vira um componente `Home.astro` reaproveitável pelas duas línguas (e, no Plano 5, pela página de projeto com painel aberto).

**Tech Stack:** Astro 7, TypeScript, Vitest, Playwright, API GraphQL do GitHub, Node 22 com `--experimental-strip-types`, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-22-portfolio-bancada-design.md` — seções 3, 5, 8.4, 8.5, 8.6 e 14.

---

## Contexto para quem executa

- Repositório: `C:\Users\marcu\Downloads\Portfolio`, branch `redesign/bancada`. Não crie nem troque de branch. Não faça push.
- Shell: Windows com Git Bash. Use sintaxe POSIX.
- Estado de partida, verificado: `npm test` → **119** testes; `npm run check` limpo; `npm run build` → **22 páginas**; `npm run test:e2e` → **15** testes.
- IDs de conteúdo são `<locale>/<slug>`. Só `src/lib/projects.ts` (`slugOf`, `entriesFor`) interpreta esse formato.
- Nenhum texto de exibição fica em componente ou página: tudo vai em `src/lib/ui-strings.ts`.
- Nenhuma cor em hex no CSS: a paleta vem de `src/lib/tokens.ts` via `paletteToCss`, e o acento por projeto vem do frontmatter.
- `astro check` verifica **também os testes e os scripts** (o `tsconfig` inclui `**/*`). Código de teste precisa passar no type-check.
- O `tsconfig` do Astro já traz `allowImportingTsExtensions: true` e `resolveJsonModule: true`. O Node 22.15 roda `.ts` com `node --experimental-strip-types`.
- **Nenhum projeto da Pix Force aparece no site.** A empresa só é citada como empregadora no texto do "Sobre", que já existe e não muda.

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/lib/github/snapshot.ts` | Tipos do instantâneo e validação do JSON. Puro. |
| `src/lib/github/collect.ts` | Consulta GraphQL, janela de 90 dias, conversão da resposta. Puro. |
| `src/lib/github/content-repos.ts` | Lê o campo `github` do frontmatter de um MDX. Puro. |
| `src/lib/github/load.ts` | Importa e valida o instantâneo commitado, para o build. |
| `src/lib/mood.ts` | A regra de humor da §5.4. Pura. |
| `src/lib/relative-time.ts` | "há 24 dias", "há 3 meses". Pura. |
| `src/lib/index-rows.ts` | Monta as linhas do índice. Pura. |
| `scripts/refresh-github.ts` | Busca na rede e grava o instantâneo. |
| `src/data/github-snapshot.json` | O instantâneo. Gerado, commitado. |
| `src/components/Hero.astro` | Palco escuro: nome, tese, retrato. |
| `src/components/ProjectIndex.astro` | O índice. |
| `src/components/About.astro` | Sobre, pesquisa e contato. |
| `src/components/Home.astro` | A home inteira, por idioma. |
| `.github/workflows/refresh-github.yml` | Roda o script todo dia e commita se mudou. |

---

## Task 1: Tipos e validação do instantâneo

**Files:**
- Create: `src/lib/github/snapshot.ts`
- Test: `tests/unit/snapshot.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

Criar `tests/unit/snapshot.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { parseSnapshot } from '../../src/lib/github/snapshot';

const valid = {
  generatedAt: '2026-09-22T00:00:00Z',
  repos: {
    'marcus-vreis/VisionForge': {
      repo: 'marcus-vreis/VisionForge',
      lastCommitAt: '2026-08-29T21:04:11Z',
      commits90d: 147,
      latestTag: 'v0.10.0',
      stars: 0,
    },
    'marcus-vreis/ImageLab': {
      repo: 'marcus-vreis/ImageLab',
      lastCommitAt: '2025-06-22T10:00:00Z',
      commits90d: 0,
      latestTag: null,
      stars: 0,
    },
  },
};

describe('parseSnapshot', () => {
  it('aceita um instantâneo válido e devolve os mesmos dados', () => {
    expect(parseSnapshot(valid)).toEqual(valid);
  });

  it('recusa o que não é objeto', () => {
    expect(() => parseSnapshot(null)).toThrow('Instantâneo do GitHub inválido em $');
  });

  it('recusa generatedAt fora de ISO em UTC', () => {
    expect(() => parseSnapshot({ ...valid, generatedAt: '22/09/2026' })).toThrow('$.generatedAt');
  });

  it('recusa chave que não bate com o campo repo', () => {
    const broken = structuredClone(valid);
    broken.repos['marcus-vreis/ImageLab'].repo = 'marcus-vreis/Outro';
    expect(() => parseSnapshot(broken)).toThrow('$.repos["marcus-vreis/ImageLab"].repo');
  });

  it('recusa contagem negativa', () => {
    const broken = structuredClone(valid);
    broken.repos['marcus-vreis/VisionForge'].commits90d = -1;
    expect(() => parseSnapshot(broken)).toThrow('commits90d');
  });

  it('recusa latestTag que não é string nem null', () => {
    const broken = {
      generatedAt: valid.generatedAt,
      repos: {
        'a/b': { repo: 'a/b', lastCommitAt: '2026-01-01T00:00:00Z', commits90d: 0, latestTag: 3, stars: 0 },
      },
    };
    expect(() => parseSnapshot(broken)).toThrow('latestTag');
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "../../src/lib/github/snapshot"`.

- [ ] **Step 3: Implementar**

Criar `src/lib/github/snapshot.ts`:

```ts
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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: PASS — **125** testes (119 + 6).

- [ ] **Step 5: Type-check**

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/github/snapshot.ts tests/unit/snapshot.test.ts
git commit -m "feat: tipos e validação do instantâneo do GitHub"
```

---

## Task 2: A regra de humor

**Files:**
- Create: `src/lib/mood.ts`
- Test: `tests/unit/mood.test.ts`

As fronteiras vêm da §5.4 da spec: `formado` para concluído; `a todo vapor` com 30 ou mais commits em 90 dias; pausado **boceja** abaixo de 90 dias, **cochila** de 90 a 180, **dorme** acima de 180; e `ativo` sem commit há mais de 180 dias é tratado como `pausado`, com aviso.

- [ ] **Step 1: Escrever o teste que falha**

Criar `tests/unit/mood.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { daysBetween, resolveMood } from '../../src/lib/mood';
import type { RepoSnapshot } from '../../src/lib/github/snapshot';

const TODAY = '2026-09-22T00:00:00Z';
const DAY_MS = 86_400_000;

/** Data ISO `n` dias antes de TODAY. */
function daysAgo(n: number): string {
  return new Date(Date.parse(TODAY) - n * DAY_MS).toISOString();
}

function repo(overrides: Partial<RepoSnapshot> = {}): RepoSnapshot {
  return {
    repo: 'marcus-vreis/Exemplo',
    lastCommitAt: daysAgo(10),
    commits90d: 5,
    latestTag: null,
    stars: 0,
    ...overrides,
  };
}

describe('daysBetween', () => {
  it('é zero no mesmo instante', () => {
    expect(daysBetween(TODAY, TODAY)).toBe(0);
  });

  it('conta dias inteiros', () => {
    expect(daysBetween('2026-08-29T00:00:00Z', TODAY)).toBe(24);
  });

  it('arredonda dia incompleto para baixo', () => {
    expect(daysBetween('2026-09-21T12:00:00Z', TODAY)).toBe(0);
  });

  it('nunca é negativo — commit com relógio adiantado vira zero', () => {
    expect(daysBetween('2026-09-25T00:00:00Z', TODAY)).toBe(0);
  });
});

describe('resolveMood', () => {
  it('concluído vira formado, com capelo', () => {
    const r = resolveMood('concluido', repo({ lastCommitAt: daysAgo(672) }), TODAY);
    expect(r.mood).toBe('formado');
    expect(r.overlays).toEqual(['capelo']);
  });

  it('concluído nunca gera aviso, por mais antigo que seja', () => {
    expect(resolveMood('concluido', repo({ lastCommitAt: daysAgo(900) }), TODAY).warning).toBeNull();
  });

  it('ativo com 30 commits em 90 dias está a todo vapor, com faísca', () => {
    const r = resolveMood('ativo', repo({ commits90d: 30 }), TODAY);
    expect(r.mood).toBe('a-todo-vapor');
    expect(r.overlays).toEqual(['faisca']);
  });

  it('ativo com 29 commits é só ativo, sem sobreposição', () => {
    const r = resolveMood('ativo', repo({ commits90d: 29 }), TODAY);
    expect(r.mood).toBe('ativo');
    expect(r.overlays).toEqual([]);
  });

  it('pausado há 89 dias boceja', () => {
    expect(resolveMood('pausado', repo({ lastCommitAt: daysAgo(89) }), TODAY).mood).toBe('bocejando');
  });

  it('pausado há 90 dias cochila, com zZ', () => {
    const r = resolveMood('pausado', repo({ lastCommitAt: daysAgo(90) }), TODAY);
    expect(r.mood).toBe('cochilando');
    expect(r.overlays).toEqual(['zz']);
  });

  it('pausado há 180 dias ainda cochila', () => {
    expect(resolveMood('pausado', repo({ lastCommitAt: daysAgo(180) }), TODAY).mood).toBe('cochilando');
  });

  it('pausado há 181 dias dorme, com zZ e poeira', () => {
    const r = resolveMood('pausado', repo({ lastCommitAt: daysAgo(181) }), TODAY);
    expect(r.mood).toBe('dormindo');
    expect(r.overlays).toEqual(['zz', 'poeira']);
  });

  it('ativo parado há 180 dias continua ativo, sem aviso', () => {
    const r = resolveMood('ativo', repo({ lastCommitAt: daysAgo(180), commits90d: 0 }), TODAY);
    expect(r.effectiveStatus).toBe('ativo');
    expect(r.warning).toBeNull();
  });

  it('ativo parado há 181 dias é tratado como pausado, dorme e avisa', () => {
    const r = resolveMood('ativo', repo({ lastCommitAt: daysAgo(181), commits90d: 0 }), TODAY);
    expect(r.effectiveStatus).toBe('pausado');
    expect(r.mood).toBe('dormindo');
    expect(r.warning).toContain('marcus-vreis/Exemplo');
    expect(r.warning).toContain('181 dias');
  });

  it('a tag mais recente vira selo de versão', () => {
    expect(resolveMood('ativo', repo({ latestTag: 'v0.10.0' }), TODAY).versionBadge).toBe('v0.10.0');
    expect(resolveMood('ativo', repo(), TODAY).versionBadge).toBeNull();
  });

  it('uma estrelinha por estrela, com teto de cinco', () => {
    expect(resolveMood('ativo', repo({ stars: 2 }), TODAY).orbitingStars).toBe(2);
    expect(resolveMood('ativo', repo({ stars: 9 }), TODAY).orbitingStars).toBe(5);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "../../src/lib/mood"`.

- [ ] **Step 3: Implementar**

Criar `src/lib/mood.ts`:

```ts
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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: PASS — **141** testes (125 + 16).

- [ ] **Step 5: Type-check e commit**

Run: `npm run check` — Expected: `0 errors`.

```bash
git add src/lib/mood.ts tests/unit/mood.test.ts
git commit -m "feat: regra de humor a partir do status e do instantâneo"
```

---

## Task 3: Tempo relativo

**Files:**
- Create: `src/lib/relative-time.ts`
- Test: `tests/unit/relative-time.test.ts`

Os textos esperados abaixo foram conferidos no Node 22 (ICU 76) em 2026-09-22 — não há espaço não separável na saída.

- [ ] **Step 1: Escrever o teste que falha**

Criar `tests/unit/relative-time.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatSince } from '../../src/lib/relative-time';

const CASES: [number, string, string][] = [
  [0, 'hoje', 'today'],
  [1, 'ontem', 'yesterday'],
  [24, 'há 24 dias', '24 days ago'],
  [59, 'há 59 dias', '59 days ago'],
  [60, 'há 2 meses', '2 months ago'],
  [107, 'há 3 meses', '3 months ago'],
  [672, 'há 22 meses', '22 months ago'],
  [800, 'há 2 anos', '2 years ago'],
];

describe('formatSince', () => {
  it.each(CASES)('%i dias em português', (days, pt) => {
    expect(formatSince(days, 'pt')).toBe(pt);
  });

  it.each(CASES)('%i dias em inglês', (days, _pt, en) => {
    expect(formatSince(days, 'en')).toBe(en);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "../../src/lib/relative-time"`.

- [ ] **Step 3: Implementar**

Criar `src/lib/relative-time.ts`:

```ts
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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: PASS — **157** testes (141 + 16).

- [ ] **Step 5: Type-check e commit**

Run: `npm run check` — Expected: `0 errors`.

```bash
git add src/lib/relative-time.ts tests/unit/relative-time.test.ts
git commit -m "feat: tempo relativo por idioma"
```

---

## Task 4: Coleta — consulta e conversão

**Files:**
- Create: `src/lib/github/collect.ts`
- Test: `tests/unit/collect.test.ts`

A consulta GraphQL abaixo foi executada contra `VisionForge`, `VampireAI` e `VoleiArena` (privado) em 2026-09-22 e devolveu os campos esperados. O caso do VampireAI é o motivo do máximo entre branches: a `main` parou em 12/06 e a branch `sensor-deterministico` teve commit em 02/09.

- [ ] **Step 1: Escrever o teste que falha**

Criar `tests/unit/collect.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  snapshotDate,
  toRepoSnapshot,
  windowStart,
  type RepoQueryResult,
} from '../../src/lib/github/collect';

function result(overrides: Partial<RepoQueryResult> = {}): RepoQueryResult {
  return {
    stargazerCount: 0,
    defaultBranchRef: { target: { history: { totalCount: 0 } } },
    refs: { nodes: [{ name: 'main', target: { committedDate: '2026-06-12T09:00:00Z' } }] },
    tags: { nodes: [] },
    ...overrides,
  };
}

describe('snapshotDate', () => {
  it('zera a hora em UTC — duas coletas no mesmo dia dão o mesmo valor', () => {
    expect(snapshotDate(new Date('2026-09-22T15:30:00Z'))).toBe('2026-09-22T00:00:00Z');
  });
});

describe('windowStart', () => {
  it('volta 90 dias a partir do instantâneo', () => {
    expect(windowStart('2026-09-22T00:00:00Z')).toBe('2026-06-24T00:00:00.000Z');
  });
});

describe('toRepoSnapshot', () => {
  it('usa o commit mais recente entre todas as branches', () => {
    const snap = toRepoSnapshot(
      'marcus-vreis/VampireAI',
      result({
        refs: {
          nodes: [
            { name: 'main', target: { committedDate: '2026-06-12T09:00:00Z' } },
            { name: 'sensor-deterministico', target: { committedDate: '2026-09-02T18:30:00Z' } },
          ],
        },
      }),
    );
    expect(snap.lastCommitAt).toBe('2026-09-02T18:30:00Z');
  });

  it('ignora referência que não aponta para commit', () => {
    const snap = toRepoSnapshot(
      'o/r',
      result({
        refs: {
          nodes: [
            { name: 'estranha', target: {} },
            { name: 'main', target: { committedDate: '2026-06-12T09:00:00Z' } },
          ],
        },
      }),
    );
    expect(snap.lastCommitAt).toBe('2026-06-12T09:00:00Z');
  });

  it('falha alto quando nenhuma branch tem commit', () => {
    expect(() => toRepoSnapshot('o/vazio', result({ refs: { nodes: [] } }))).toThrow('o/vazio');
  });

  it('conta commits da branch padrão', () => {
    const snap = toRepoSnapshot(
      'o/r',
      result({ defaultBranchRef: { target: { history: { totalCount: 147 } } } }),
    );
    expect(snap.commits90d).toBe(147);
  });

  it('sem branch padrão, zero commits', () => {
    expect(toRepoSnapshot('o/r', result({ defaultBranchRef: null })).commits90d).toBe(0);
  });

  it('sem tag, selo nulo; com tag, a primeira', () => {
    expect(toRepoSnapshot('o/r', result()).latestTag).toBeNull();
    expect(toRepoSnapshot('o/r', result({ tags: { nodes: [{ name: 'v0.10.0' }] } })).latestTag).toBe(
      'v0.10.0',
    );
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "../../src/lib/github/collect"`.

- [ ] **Step 3: Implementar**

Criar `src/lib/github/collect.ts`:

```ts
import type { RepoSnapshot } from './snapshot';

/** Uma consulta por repositório traz tudo que o instantâneo precisa. */
export const REPO_QUERY = `query($owner: String!, $name: String!, $since: GitTimestamp!) {
  repository(owner: $owner, name: $name) {
    stargazerCount
    defaultBranchRef { target { ... on Commit { history(since: $since) { totalCount } } } }
    refs(refPrefix: "refs/heads/", first: 100) {
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
  refs: { nodes: { name: string; target: { committedDate?: string } }[] };
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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: PASS — **165** testes (157 + 8).

- [ ] **Step 5: Type-check e commit**

Run: `npm run check` — Expected: `0 errors`.

```bash
git add src/lib/github/collect.ts tests/unit/collect.test.ts
git commit -m "feat: consulta GraphQL e conversão para o instantâneo"
```

---

## Task 5: O campo `github` do frontmatter

**Files:**
- Create: `src/lib/github/content-repos.ts`
- Test: `tests/unit/content-repos.test.ts`

O script de coleta e o teste de cobertura precisam da lista de repositórios. Ela sai dos MDX, nunca de uma lista paralela.

- [ ] **Step 1: Escrever o teste que falha**

Criar `tests/unit/content-repos.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { githubFieldOf } from '../../src/lib/github/content-repos';

const mdx = (front: string, body = 'Texto.') => `---\n${front}\n---\n\n${body}\n`;

describe('githubFieldOf', () => {
  it('lê o valor entre aspas', () => {
    expect(githubFieldOf(mdx("title: X\ngithub: 'marcus-vreis/VisionForge'"))).toBe(
      'marcus-vreis/VisionForge',
    );
  });

  it('lê o valor sem aspas', () => {
    expect(githubFieldOf(mdx('github: marcus-vreis/ComputerVision-KNN'))).toBe(
      'marcus-vreis/ComputerVision-KNN',
    );
  });

  it('devolve null quando o campo não existe', () => {
    expect(githubFieldOf(mdx('title: Pesquisa\nkind: pesquisa'))).toBeNull();
  });

  it('ignora "github:" no corpo do texto', () => {
    expect(githubFieldOf(mdx('title: X', 'github: nao/conta'))).toBeNull();
  });

  it('aceita quebra de linha CRLF', () => {
    expect(githubFieldOf("---\r\ngithub: 'a/b'\r\n---\r\n\r\nTexto.\r\n")).toBe('a/b');
  });

  it('falha alto em arquivo sem frontmatter', () => {
    expect(() => githubFieldOf('Só texto.')).toThrow('frontmatter');
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "../../src/lib/github/content-repos"`.

- [ ] **Step 3: Implementar**

Criar `src/lib/github/content-repos.ts`:

```ts
/**
 * Lê o campo `github` do frontmatter de um MDX, sem parser YAML: nestes
 * arquivos ele é sempre uma linha `github: 'owner/nome'`. Devolve `null`
 * quando o campo não existe — a pesquisa de mestrado, por exemplo.
 */
export function githubFieldOf(mdxSource: string): string | null {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(mdxSource);
  if (!frontmatter) throw new Error('MDX sem frontmatter');
  const line = /^github:\s*['"]?([\w.-]+\/[\w.-]+)['"]?\s*$/m.exec(frontmatter[1]);
  return line ? line[1] : null;
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: PASS — **171** testes (165 + 6).

- [ ] **Step 5: Type-check e commit**

Run: `npm run check` — Expected: `0 errors`.

```bash
git add src/lib/github/content-repos.ts tests/unit/content-repos.test.ts
git commit -m "feat: leitura do campo github do frontmatter"
```

---

## Task 6: Schema e conteúdo

**Files:**
- Modify: `src/lib/projects.ts`
- Modify: `src/content.config.ts`
- Modify: `src/content/projects/{pt,en}/*.mdx` (20 arquivos)
- Modify: `tests/unit/project-accents.test.ts`

`railLabel` **fica** nesta task: a home atual ainda o usa. Ele sai na Task 10, junto com o trilho.

- [ ] **Step 1: Declarar os tipos de conteúdo**

Em `src/lib/projects.ts`, acrescentar no topo, logo depois do `import type { Locale } from './i18n';`:

```ts
/** `projeto` vira máquina no chão e linha no índice; `pesquisa` vai para o "Sobre". */
export const KINDS = ['projeto', 'pesquisa'] as const;
export type Kind = (typeof KINDS)[number];
```

- [ ] **Step 2: Estender o schema**

Em `src/content.config.ts`:

1. Acrescentar dois imports depois de `import { z } from 'astro/zod';`:

```ts
import { KINDS } from './lib/projects';
import { STATUSES } from './lib/mood';
```

2. Acrescentar estes campos dentro do `z.object({ ... })`, logo depois do campo `order`:

```ts
        /** `projeto` vira máquina e linha do índice; `pesquisa` vai para o "Sobre". */
        kind: z.enum(KINDS),
        /** O que o tempo parado significa — §5.3 da spec. Obrigatório em projeto. */
        status: z.enum(STATUSES).optional(),
        /** `owner/nome` no GitHub: a chave do instantâneo. Separado de `repo`,
         *  que é link público e não existe em repositório privado. */
        github: z.string().regex(/^[\w.-]+\/[\w.-]+$/).optional(),
        /** Id do sprite da máquina que representa o projeto. */
        character: z.string().regex(/^[a-z-]+$/).optional(),
```

3. Acrescentar um terceiro `.refine` depois dos dois existentes (antes do `,` que fecha `schema`):

```ts
      .refine(
        (data) =>
          data.kind !== 'projeto' ||
          (Boolean(data.status) && Boolean(data.github) && Boolean(data.character)),
        {
          message:
            'Todo projeto (kind: projeto) precisa de status, github e character no frontmatter.',
          path: ['kind'],
        },
      )
```

- [ ] **Step 3: Preencher os 20 MDX**

Valores confirmados pelo dono na revisão da spec (§5.3). Rodar na raiz do repositório:

```bash
node --input-type=module <<'EOF'
import { readFileSync, writeFileSync } from 'node:fs';

const FIELDS = {
  visionforge: { kind: 'projeto', status: 'ativo', github: 'marcus-vreis/VisionForge', character: 'lente' },
  vampireai: { kind: 'projeto', status: 'ativo', github: 'marcus-vreis/VampireAI', character: 'fliperama' },
  'uda-ovd': { kind: 'pesquisa' },
  airwatch: { kind: 'projeto', status: 'concluido', github: 'marcus-vreis/AirWatch', character: 'estacao' },
  imagelab: { kind: 'projeto', status: 'concluido', github: 'marcus-vreis/ImageLab', character: 'scanner' },
  coffeebean: { kind: 'projeto', status: 'concluido', github: 'marcus-vreis/ComputerVision-CoffeeBean', character: 'cafeteira' },
  'cv-knn': { kind: 'projeto', status: 'concluido', github: 'marcus-vreis/ComputerVision-KNN', character: 'plotter' },
  'sorting-hub': { kind: 'projeto', status: 'concluido', github: 'marcus-vreis/Sorting-Algorithms-Hub', character: 'esteira' },
  voleiarena: { kind: 'projeto', status: 'ativo', github: 'marcus-vreis/VoleiArena', character: 'lancadora' },
  'rvh-construtora': { kind: 'projeto', status: 'ativo', github: 'marcus-vreis/RVH-Construtora', character: 'betoneira' },
};

for (const locale of ['pt', 'en']) {
  for (const [slug, f] of Object.entries(FIELDS)) {
    const path = `src/content/projects/${locale}/${slug}.mdx`;
    const src = readFileSync(path, 'utf-8');
    if (/^kind:/m.test(src)) throw new Error(`${path} já tem kind — rodou duas vezes?`);
    const lines = [`kind: ${f.kind}`];
    if (f.status) lines.push(`status: ${f.status}`, `github: '${f.github}'`, `character: ${f.character}`);
    // Preserva o final de linha do arquivo (LF ou CRLF).
    const out = src.replace(/^(order: \d+)(\r?)$/m, (_, line, cr) => [line, ...lines].join(`${cr}\n`) + cr);
    if (out === src) throw new Error(`${path}: linha "order:" não encontrada`);
    writeFileSync(path, out);
    console.log('ok', path);
  }
}
EOF
```

Expected: 20 linhas `ok src/content/projects/...`.

Conferir um arquivo: `sed -n '1,12p' src/content/projects/pt/visionforge.mdx` deve mostrar, logo depois de `order: 1`:

```
kind: projeto
status: ativo
github: 'marcus-vreis/VisionForge'
character: lente
```

- [ ] **Step 4: Cruzar os campos novos entre PT e EN**

Em `tests/unit/project-accents.test.ts`:

1. Acrescentar esta função logo depois de `readOrder`:

```ts
/** Lê um campo escalar simples do frontmatter, ou `null` se ausente. */
function readScalar(filePath: string, key: string): string | null {
  const raw = readFileSync(filePath, 'utf-8');
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!frontmatter) {
    throw new Error(`Frontmatter não encontrado em ${filePath}`);
  }
  const line = new RegExp(`^${key}:\\s*['"]?([^'"\\r\\n]+?)['"]?\\s*$`, 'm').exec(frontmatter[1]);
  return line ? line[1] : null;
}
```

2. Dentro do laço `for (const slug of listSlugs('pt'))`, depois do teste `PT e EN declaram o mesmo order`, acrescentar:

```ts
    it(`${slug}: PT e EN declaram os mesmos kind, status, github e character`, () => {
      const keys = ['kind', 'status', 'github', 'character'] as const;
      const pick = (path: string) => Object.fromEntries(keys.map((k) => [k, readScalar(path, k)]));
      const pt = pick(join(PROJECTS_DIR, 'pt', `${slug}.mdx`));
      const en = pick(join(PROJECTS_DIR, 'en', `${slug}.mdx`));
      expect(
        en,
        `${slug}: en/${slug}.mdx (${JSON.stringify(en)}) diverge de pt/${slug}.mdx (${JSON.stringify(pt)})`,
      ).toEqual(pt);
    });
```

- [ ] **Step 5: Verificar**

Run: `npm test` — Expected: PASS, **181** testes (171 + 10).
Run: `npm run check` — Expected: `0 errors`.
Run: `npm run build` — Expected: `22 page(s) built`.

- [ ] **Step 6: Provar que o schema barra projeto incompleto**

```bash
cp src/content/projects/pt/visionforge.mdx visionforge.mdx.bak && sed -i "/^character: lente/d" src/content/projects/pt/visionforge.mdx && npm run build; mv visionforge.mdx.bak src/content/projects/pt/visionforge.mdx
```

Expected: o build **falha** com `Todo projeto (kind: projeto) precisa de status, github e character`. Depois do `mv`, `npm run build` volta a passar.

**Não use `git checkout` para restaurar aqui:** as mudanças desta task ainda não estão commitadas, e o checkout apagaria os campos novos do arquivo.

- [ ] **Step 7: Commit**

```bash
git add src/lib/projects.ts src/content.config.ts src/content tests/unit/project-accents.test.ts
git commit -m "feat: kind, status, github e character no conteúdo"
```

---

## Task 7: O script de coleta e o primeiro instantâneo

**Files:**
- Create: `scripts/refresh-github.ts`
- Create: `src/data/github-snapshot.json` (gerado)
- Modify: `package.json`
- Test: `tests/unit/snapshot-coverage.test.ts`

- [ ] **Step 1: Escrever o script**

Criar `scripts/refresh-github.ts`:

```ts
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

async function fetchRepo(repo: string, since: string): Promise<RepoQueryResult> {
  const [owner, name] = repo.split('/');
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-refresh-github',
    },
    body: JSON.stringify({ query: REPO_QUERY, variables: { owner, name, since } }),
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
  const snap = toRepoSnapshot(repo, await fetchRepo(repo, since));
  repos[repo] = snap;
  console.log(`ok ${repo}  ${snap.lastCommitAt.slice(0, 10)}  ${snap.commits90d} commits/90d`);
}

// Valida antes de gravar: o que sai daqui é exatamente o que o build aceita.
const snapshot = parseSnapshot({ generatedAt, repos });
writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`gravado ${OUT} — ${Object.keys(repos).length} repositórios, ${generatedAt}`);
```

- [ ] **Step 2: Registrar o comando**

Em `package.json`, dentro de `scripts`, acrescentar depois de `"shots"`:

```json
    "refresh:github": "node --experimental-strip-types scripts/refresh-github.ts"
```

(lembre da vírgula no fim da linha de `"shots"`).

- [ ] **Step 3: Gerar o primeiro instantâneo**

```bash
mkdir -p src/data && GITHUB_TOKEN=$(gh auth token) npm run refresh:github
```

Expected: nove linhas `ok marcus-vreis/...` e uma linha `gravado ... — 9 repositórios`. O Node imprime um `ExperimentalWarning` sobre type stripping — é esperado.

Conferir: `node -e "const s=require('./src/data/github-snapshot.json'); console.log(Object.keys(s.repos).length, s.generatedAt)"` imprime `9` e a data de hoje à meia-noite UTC.

- [ ] **Step 4: Escrever o teste de cobertura**

Criar `tests/unit/snapshot-coverage.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { githubFieldOf } from '../../src/lib/github/content-repos';
import { parseSnapshot } from '../../src/lib/github/snapshot';

// Se alguém cadastra um projeto novo e esquece de rodar a coleta, isto falha
// antes do build — com a instrução de como consertar.
const CONTENT = join(process.cwd(), 'src/content/projects/pt');
const SNAPSHOT = join(process.cwd(), 'src/data/github-snapshot.json');

describe('instantâneo do GitHub commitado', () => {
  const snapshot = parseSnapshot(JSON.parse(readFileSync(SNAPSHOT, 'utf-8')));
  const files = readdirSync(CONTENT)
    .filter((file) => file.endsWith('.mdx'))
    .sort();

  for (const file of files) {
    const repo = githubFieldOf(readFileSync(join(CONTENT, file), 'utf-8'));
    if (repo === null) continue;

    it(`${file}: ${repo} está no instantâneo`, () => {
      expect(
        snapshot.repos[repo],
        `${repo} (de ${file}) não está em src/data/github-snapshot.json — rode: GITHUB_TOKEN=$(gh auth token) npm run refresh:github`,
      ).toBeDefined();
    });
  }
});
```

- [ ] **Step 5: Verificar**

Run: `npm test` — Expected: PASS, **190** testes (181 + 9).
Run: `npm run check` — Expected: `0 errors`.

- [ ] **Step 6: Commit**

```bash
git add scripts/refresh-github.ts package.json src/data/github-snapshot.json tests/unit/snapshot-coverage.test.ts
git commit -m "feat: coleta diária do GitHub e primeiro instantâneo"
```

---

## Task 8: Linhas do índice

**Files:**
- Modify: `src/lib/ui-strings.ts`
- Create: `src/lib/index-rows.ts`
- Test: `tests/unit/index-rows.test.ts`

Nesta task as strings só são **acrescentadas**. As que ficam órfãs saem na Task 10.

- [ ] **Step 1: Acrescentar as strings**

Em `src/lib/ui-strings.ts`:

1. Acrescentar o import na linha 2:

```ts
import type { Mood } from './mood';
```

2. Acrescentar estes campos ao fim da `interface UiStrings`, antes do `}`:

```ts
  name: string;
  portraitAlt: string;
  projectsHeading: string;
  researchHeading: string;
  moods: Record<Mood, string>;
```

3. Acrescentar ao fim do objeto `pt`, depois de `contact: [...]`:

```ts
    name: 'Marcus Vinicius',
    portraitAlt: 'Bonequinho de palito no lugar do retrato',
    projectsHeading: 'Projetos',
    researchHeading: 'Pesquisa',
    moods: {
      formado: 'formado',
      'a-todo-vapor': 'a todo vapor',
      ativo: 'ativo',
      bocejando: 'bocejando',
      cochilando: 'cochilando',
      dormindo: 'dormindo',
    },
```

4. Acrescentar ao fim do objeto `en`, depois de `contact: [...]`:

```ts
    name: 'Marcus Vinicius',
    portraitAlt: 'Stick figure standing in for the portrait',
    projectsHeading: 'Projects',
    researchHeading: 'Research',
    moods: {
      formado: 'graduated',
      'a-todo-vapor': 'full steam',
      ativo: 'active',
      bocejando: 'yawning',
      cochilando: 'napping',
      dormindo: 'asleep',
    },
```

- [ ] **Step 2: Escrever o teste que falha**

Criar `tests/unit/index-rows.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildIndexRows, type ProjectLike } from '../../src/lib/index-rows';
import type { Snapshot } from '../../src/lib/github/snapshot';

// generatedAt 2026-09-22: forge a 24 dias, knn a 672, stale a 264.
const snapshot: Snapshot = {
  generatedAt: '2026-09-22T00:00:00Z',
  repos: {
    'o/forge': { repo: 'o/forge', lastCommitAt: '2026-08-29T00:00:00Z', commits90d: 147, latestTag: 'v0.10.0', stars: 0 },
    'o/knn': { repo: 'o/knn', lastCommitAt: '2024-11-19T00:00:00Z', commits90d: 0, latestTag: null, stars: 0 },
    'o/stale': { repo: 'o/stale', lastCommitAt: '2026-01-01T00:00:00Z', commits90d: 0, latestTag: null, stars: 0 },
  },
};

function entry(id: string, order: number, data: Partial<ProjectLike['data']>): ProjectLike {
  return {
    id,
    data: {
      title: id.split('/')[1],
      accent: '#6EE7A8',
      accentLight: '#157C46',
      order,
      kind: 'projeto',
      ...data,
    },
  };
}

const all: ProjectLike[] = ['pt', 'en'].flatMap((l) => [
  entry(`${l}/knn`, 3, { status: 'concluido', github: 'o/knn' }),
  entry(`${l}/forge`, 1, { status: 'ativo', github: 'o/forge' }),
  entry(`${l}/pesquisa`, 2, { kind: 'pesquisa' }),
  entry(`${l}/stale`, 4, { status: 'ativo', github: 'o/stale' }),
]);

describe('buildIndexRows', () => {
  it('só projetos, na ordem do conteúdo', () => {
    expect(buildIndexRows(all, snapshot, 'pt').rows.map((r) => r.slug)).toEqual(['forge', 'knn', 'stale']);
  });

  it('o link segue o idioma', () => {
    expect(buildIndexRows(all, snapshot, 'pt').rows[0].href).toBe('/projeto/forge');
    expect(buildIndexRows(all, snapshot, 'en').rows[0].href).toBe('/en/project/forge');
  });

  it('humor e rótulo em português', () => {
    const [forge] = buildIndexRows(all, snapshot, 'pt').rows;
    expect(forge.mood).toBe('a-todo-vapor');
    expect(forge.moodLabel).toBe('a todo vapor');
  });

  it('rótulo em inglês', () => {
    expect(buildIndexRows(all, snapshot, 'en').rows[0].moodLabel).toBe('full steam');
  });

  it('o detalhe junta tempo e versão', () => {
    expect(buildIndexRows(all, snapshot, 'pt').rows[0].detail).toBe('há 24 dias · v0.10.0');
  });

  it('sem versão, o detalhe é só o tempo', () => {
    const knn = buildIndexRows(all, snapshot, 'pt').rows[1];
    expect(knn.mood).toBe('formado');
    expect(knn.detail).toBe('há 22 meses');
  });

  it('avisa quando um projeto "ativo" está parado', () => {
    const { rows, warnings } = buildIndexRows(all, snapshot, 'pt');
    expect(rows[2].mood).toBe('dormindo');
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('o/stale');
    expect(warnings[0]).toContain('264 dias');
  });

  it('falha alto quando o repositório não está no instantâneo', () => {
    const broken = [...all, entry('pt/novo', 5, { status: 'ativo', github: 'o/novo' })];
    expect(() => buildIndexRows(broken, snapshot, 'pt')).toThrow('refresh:github');
  });
});
```

- [ ] **Step 3: Rodar e confirmar que falha**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "../../src/lib/index-rows"`.

- [ ] **Step 4: Implementar**

Criar `src/lib/index-rows.ts`:

```ts
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
  /** "há 24 dias · v0.10.0" */
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
        detail: result.versionBadge ? `${since} · ${result.versionBadge}` : since,
      };
    });

  return { rows, warnings };
}
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `npm test` — Expected: PASS, **198** testes (190 + 8).
Run: `npm run check` — Expected: `0 errors`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/ui-strings.ts src/lib/index-rows.ts tests/unit/index-rows.test.ts
git commit -m "feat: linhas do índice com humor e dado"
```

---

## Task 9: A home nova

**Files:**
- Create: `src/lib/github/load.ts`
- Create: `src/components/Hero.astro`, `ProjectIndex.astro`, `About.astro`, `Home.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `src/lib/ui-strings.ts`
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro` (substituição completa)
- Modify: `tests/e2e/navigation.spec.ts` (substituição completa)
- Delete: `tests/e2e/hero.spec.ts`, `tests/e2e/stations.spec.ts`

Os componentes antigos (`Rail`, `Station`, `Specimen`) continuam no disco nesta task, sem uso. Eles saem na Task 10, depois que a home nova estiver provada.

- [ ] **Step 1: Carregar o instantâneo no build**

Criar `src/lib/github/load.ts`:

```ts
import raw from '../../data/github-snapshot.json';
import { parseSnapshot } from './snapshot';

/** O instantâneo commitado, validado uma vez por build. */
export const snapshot = parseSnapshot(raw);
```

- [ ] **Step 2: O palco escuro**

Em `src/layouts/Base.astro`, dentro do template do `<style is:inline set:html={...}>`, acrescentar uma linha depois de `:root[data-mode="light"] { ... }`:

```
      .stage { ${paletteToCss('dark')} color-scheme: dark; background: var(--bg); color: var(--fg); }
```

O hero é sempre escuro, nos dois modos (§3 da spec). As variáveis vêm da mesma `paletteToCss` testada — nenhuma cor nova.

- [ ] **Step 3: Atualizar as strings que mudaram de sentido**

Em `src/lib/ui-strings.ts`, trocar os valores (não os nomes) destes campos:

| Campo | `pt` | `en` |
|---|---|---|
| `siteTitle` | `'Marcus Vinicius — visão computacional'` | `'Marcus Vinicius — computer vision'` |
| `intro` | `'Engenheiro de visão computacional. Cada máquina da bancada é um projeto meu — e o estado dela vem do repositório de verdade.'` | `'Computer-vision engineer. Every machine on the bench is one of my projects — and its state comes from the real repository.'` |
| `backLabel` | `'Voltar para a bancada'` | `'Back to the bench'` |

- [ ] **Step 4: O hero**

Criar `src/components/Hero.astro`:

```astro
---
import LocaleToggle from './LocaleToggle.astro';
import type { Locale } from '../lib/i18n';
import { UI } from '../lib/ui-strings';

interface Props {
  locale: Locale;
  pathname: string;
}

const { locale, pathname } = Astro.props;
const t = UI[locale];

// O bonequinho segura o lugar até a fotografia existir. O efeito de
// quadrados de luz (Plano 6) entra por cima desta mesma imagem.
const PORTRAIT_SRC = '/specimen/placeholder.svg';
---

<header class="stage">
  <div class="inner">
    <div class="copy">
      <LocaleToggle current={locale} pathname={pathname} />
      <p class="name">{t.name}</p>
      <h1>{t.thesis}</h1>
      <p class="intro">{t.intro}</p>
    </div>
    <figure class="portrait">
      <img src={PORTRAIT_SRC} alt={t.portraitAlt} width="400" height="500" />
    </figure>
  </div>
</header>

<style>
  .stage {
    border-bottom: 1px solid var(--rule);
  }

  .inner {
    max-width: 72rem;
    margin-inline: auto;
    padding: clamp(3rem, 2rem + 5vw, 7rem) 1.5rem;
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: clamp(2rem, 1rem + 4vw, 5rem);
    align-items: center;
  }

  .copy {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .name {
    color: var(--accent);
    font-size: 0.8125rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    font-size: clamp(2.75rem, 1.5rem + 5vw, 6rem);
  }

  .intro {
    color: var(--muted);
    max-width: 30rem;
  }

  .portrait {
    margin: 0;
    justify-self: end;
    width: min(100%, 22rem);
  }

  .portrait img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 5;
    border: 1px solid var(--rule);
  }

  @media (max-width: 40rem) {
    .inner {
      grid-template-columns: 1fr;
    }

    .portrait {
      justify-self: start;
      width: min(100%, 16rem);
    }
  }
</style>
```

- [ ] **Step 5: O índice**

Criar `src/components/ProjectIndex.astro`:

```astro
---
import type { IndexRow } from '../lib/index-rows';

interface Props {
  rows: IndexRow[];
  heading: string;
}

const { rows, heading } = Astro.props;
---

<section id="projetos" aria-labelledby="projetos-title">
  <h2 id="projetos-title">{heading}</h2>
  <ol>
    {rows.map((row) => (
      <li style={`--accent: light-dark(${row.accentLight}, ${row.accent})`}>
        <a href={row.href} data-slug={row.slug} data-mood={row.mood}>
          <span class="title">{row.title}</span>
          <span class="mood">{row.moodLabel}</span>
          <span class="detail tabular">{row.detail}</span>
        </a>
      </li>
    ))}
  </ol>
</section>

<style>
  section {
    max-width: 72rem;
    margin-inline: auto;
    padding: clamp(2.5rem, 2rem + 3vw, 5rem) 1.5rem;
  }

  h2 {
    font-size: clamp(1.75rem, 1.25rem + 2vw, 2.75rem);
    margin-bottom: 1.5rem;
  }

  ol {
    list-style: none;
    padding: 0;
    margin: 0;
    border-top: 1px solid var(--rule);
  }

  a {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 10rem 12rem;
    gap: 1rem;
    align-items: baseline;
    padding: 0.875rem 0.25rem;
    border-bottom: 1px solid var(--rule);
    text-decoration: none;
    transition: background-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  a:hover,
  a:focus-visible {
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  .title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.375rem;
  }

  .mood {
    color: var(--accent);
    font-size: 0.8125rem;
  }

  /* O "pixel" antes do humor: mesmo quadrado das máquinas que vêm no Plano 4. */
  .mood::before {
    content: '';
    display: inline-block;
    width: 0.4375rem;
    height: 0.4375rem;
    margin-right: 0.5rem;
    background: var(--accent);
    vertical-align: 0.0625rem;
  }

  .detail {
    color: var(--muted);
    font-size: 0.8125rem;
    text-align: right;
  }

  @media (max-width: 40rem) {
    a {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .detail {
      grid-column: 1 / -1;
      text-align: left;
    }
  }
</style>
```

- [ ] **Step 6: O "Sobre"**

Criar `src/components/About.astro`:

```astro
---
import type { Locale } from '../lib/i18n';
import { UI } from '../lib/ui-strings';

interface Props {
  locale: Locale;
  research: { title: string; tagline: string; href: string }[];
}

const { locale, research } = Astro.props;
const t = UI[locale];
---

<section id="sobre" aria-labelledby="sobre-title">
  <h2 id="sobre-title">{t.aboutHeading}</h2>
  {t.aboutBody.map((paragraph) => <p>{paragraph}</p>)}

  {research.length > 0 && (
    <>
      <h3>{t.researchHeading}</h3>
      <ul class="research">
        {research.map((item) => (
          <li>
            <a href={item.href}>{item.title}</a>
            <span>{item.tagline}</span>
          </li>
        ))}
      </ul>
    </>
  )}

  <h3>{t.contactHeading}</h3>
  <ul class="contact">
    {t.contact.map((c) => <li><a href={c.href}>{c.label}</a></li>)}
  </ul>
</section>

<style>
  section {
    max-width: 46rem;
    margin-inline: auto;
    padding: clamp(2.5rem, 2rem + 3vw, 5rem) 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    border-top: 1px solid var(--rule);
  }

  p {
    color: var(--muted);
    max-width: 36rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-top: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .research li {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .research span {
    color: var(--muted);
    font-size: 0.875rem;
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  a {
    border-bottom: 1px solid var(--accent);
    text-decoration: none;
    align-self: start;
  }
</style>
```

- [ ] **Step 7: A home**

Criar `src/components/Home.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Hero from './Hero.astro';
import ProjectIndex from './ProjectIndex.astro';
import About from './About.astro';
import { snapshot } from '../lib/github/load';
import { buildIndexRows } from '../lib/index-rows';
import { assertParity } from '../lib/parity';
import { entriesFor, slugOf } from '../lib/projects';
import { buildPath, type Locale } from '../lib/i18n';
import { UI } from '../lib/ui-strings';

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const all = await getCollection('projects');

// Quebra o build se faltar tradução dos dois lados.
assertParity(
  entriesFor(all, 'pt').map((e) => slugOf(e.id)),
  entriesFor(all, 'en').map((e) => slugOf(e.id)),
);

const { rows, warnings } = buildIndexRows(all, snapshot, locale);
// As duas línguas calculam o mesmo aviso; basta imprimir uma vez.
if (locale === 'pt') {
  for (const warning of warnings) console.warn(`[bancada] ${warning}`);
}

const research = entriesFor(all, locale)
  .filter((e) => e.data.kind === 'pesquisa')
  .map((e) => ({
    title: e.data.title,
    tagline: e.data.tagline,
    href: buildPath({ kind: 'project', slug: slugOf(e.id) }, locale),
  }));

const t = UI[locale];
---

<Hero locale={locale} pathname={Astro.url.pathname} />
<main>
  <ProjectIndex rows={rows} heading={t.projectsHeading} />
  <About locale={locale} research={research} />
</main>
```

- [ ] **Step 8: As páginas**

Substituir o conteúdo inteiro de `src/pages/index.astro` por:

```astro
---
import Base from '../layouts/Base.astro';
import Home from '../components/Home.astro';
import { UI } from '../lib/ui-strings';

const t = UI.pt;
---

<Base title={t.siteTitle} description={t.siteDescription} locale="pt">
  <Home locale="pt" />
</Base>
```

Substituir o conteúdo inteiro de `src/pages/en/index.astro` por:

```astro
---
import Base from '../../layouts/Base.astro';
import Home from '../../components/Home.astro';
import { UI } from '../../lib/ui-strings';

const t = UI.en;
---

<Base title={t.siteTitle} description={t.siteDescription} locale="en">
  <Home locale="en" />
</Base>
```

- [ ] **Step 9: Os testes de ponta a ponta**

Apagar os dois arquivos que testam o que saiu da página:

```bash
git rm tests/e2e/hero.spec.ts tests/e2e/stations.spec.ts
```

Substituir o conteúdo inteiro de `tests/e2e/navigation.spec.ts` por:

```ts
import { expect, test } from '@playwright/test';
import { PALETTE } from '../../src/lib/tokens';

const PROJECTS = [
  'visionforge', 'vampireai', 'airwatch', 'imagelab', 'coffeebean',
  'cv-knn', 'sorting-hub', 'voleiarena', 'rvh-construtora',
];
const MOODS = ['formado', 'a-todo-vapor', 'ativo', 'bocejando', 'cochilando', 'dormindo'];

function hexToRgb(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
}

test('o índice lista os nove projetos na ordem do conteúdo', async ({ page }) => {
  await page.goto('/');
  const slugs = await page
    .locator('#projetos a[data-slug]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('data-slug')));
  expect(slugs).toEqual(PROJECTS);
});

// O humor exato muda com os dados de cada dia; o teste verifica a forma,
// e a regra fica coberta pelos testes de unidade de mood.ts.
test('cada linha diz o humor em palavras e o dado que o justifica', async ({ page }) => {
  await page.goto('/');
  for (const row of await page.locator('#projetos a[data-slug]').all()) {
    expect(MOODS).toContain(await row.getAttribute('data-mood'));
    await expect(row.locator('.mood')).not.toBeEmpty();
    await expect(row.locator('.detail')).not.toBeEmpty();
  }
});

test('a pesquisa de mestrado fica no Sobre, não no índice', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#projetos a[data-slug="uda-ovd"]')).toHaveCount(0);
  await expect(page.locator('#sobre a[href="/projeto/uda-ovd"]')).toHaveCount(1);
});

test('uma linha do índice leva ao projeto', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projetos a[data-slug="visionforge"]').click();
  await expect(page).toHaveURL(/\/projeto\/visionforge\/?$/);
  await expect(page.locator('h1')).toHaveText('VisionForge');
});

test('o seletor de idioma preserva o projeto aberto', async ({ page }) => {
  await page.goto('/projeto/uda-ovd');
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/project\/uda-ovd\/?$/);
  await page.getByRole('link', { name: 'Português' }).click();
  await expect(page).toHaveURL(/\/projeto\/uda-ovd\/?$/);
});

test('o índice é percorrível por teclado', async ({ page }) => {
  await page.goto('/');
  const rows = page.locator('#projetos a[data-slug]');
  await rows.first().focus();
  await expect(rows.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(rows.nth(1)).toBeFocused();
});

test('a home em inglês aponta para as rotas em inglês', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#projetos a[data-slug="visionforge"]')).toHaveAttribute(
    'href',
    '/en/project/visionforge',
  );
});

test('o hero é palco escuro mesmo no modo claro', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const background = await page
    .locator('header.stage')
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).toBe(hexToRgb(PALETTE.dark.bg));
});
```

- [ ] **Step 10: Verificar**

Run: `npm test` — Expected: PASS, **198** testes (sem mudança).
Run: `npm run check` — Expected: `0 errors`.
Run: `npm run build` — Expected: `22 page(s) built`, e **nenhuma** linha `[bancada]` no log (hoje nenhum projeto `ativo` está parado há mais de 180 dias).
Run: `npm run test:e2e` — Expected: **8** testes passando.

- [ ] **Step 11: Olhar**

```bash
npm run build && (npx serve dist -l 4331 >/dev/null 2>&1 &) && sleep 4 && node --input-type=module <<'EOF'
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
for (const scheme of ['dark', 'light']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4331/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `plano3-home-${scheme}.png`, fullPage: true });
}
await browser.close();
EOF
npx kill-port 4331
```

Abrir `plano3-home-dark.png` e `plano3-home-light.png` e conferir: o hero é escuro nos dois; o índice mostra nove linhas com título em serifa, humor colorido com o quadradinho do acento, e o detalhe alinhado à direita; o "Sobre" traz a pesquisa e o contato. **Apagar os dois PNG depois** — são para olhar, não para commitar.

- [ ] **Step 12: Commit**

```bash
git add src/lib/github/load.ts src/components/Hero.astro src/components/ProjectIndex.astro src/components/About.astro src/components/Home.astro src/layouts/Base.astro src/lib/ui-strings.ts src/pages/index.astro src/pages/en/index.astro tests/e2e/navigation.spec.ts
git commit -m "feat: home da bancada — hero, índice com humor e sobre"
```

---

## Task 10: Remover o que ficou órfão

**Files:**
- Delete: `src/components/Rail.astro`, `src/components/Station.astro`, `src/components/Specimen.astro`
- Delete: `src/shaders/hero-bayer.frag`, `src/shaders/stations/`
- Delete: `src/lib/gl/station-manager.ts`, `src/lib/gl/station-controller.ts`, `tests/unit/station-manager.test.ts`
- Modify: `src/content.config.ts`, 10 MDX com `railLabel`, `src/lib/ui-strings.ts`

**Ficam** — o Plano 4 e o Plano 6 usam: `src/lib/gl/renderer.ts`, `support.ts`, `easing.ts`, `fps-guard.ts`, `accent.ts`, `src/shaders/quad.vert` (importado pelo `renderer.ts`) e `public/specimen/placeholder.svg`.

- [ ] **Step 1: Apagar componentes, shaders e o gerente de estações**

```bash
git rm src/components/Rail.astro src/components/Station.astro src/components/Specimen.astro \
  src/shaders/hero-bayer.frag src/lib/gl/station-manager.ts src/lib/gl/station-controller.ts \
  tests/unit/station-manager.test.ts
git rm -r src/shaders/stations
```

- [ ] **Step 2: Tirar `railLabel` do schema e do conteúdo**

Em `src/content.config.ts`, apagar o bloco do campo `railLabel` — o comentário `/** Rótulo curto para o trilho, ... */` e a linha `railLabel: z.string().optional(),`.

Depois, nos MDX:

```bash
grep -l "^railLabel:" src/content/projects/*/*.mdx | xargs sed -i '/^railLabel:/d'
grep -rn "^railLabel:" src/content || echo "railLabel: nenhum"
```

Expected: `railLabel: nenhum`.

- [ ] **Step 3: Tirar as strings órfãs**

Em `src/lib/ui-strings.ts`, apagar da `interface UiStrings` e dos dois objetos (`pt` e `en`) os campos `navLabel`, `readLabel`, `specimenAlt` e `specimenCaption`.

- [ ] **Step 4: Confirmar que nada aponta para o que saiu**

```bash
grep -rnE "components/(Rail|Station|Specimen)|shaders/stations|hero-bayer|station-(manager|controller)|railLabel|navLabel|readLabel|specimen(Alt|Caption)" src tests || echo "nenhuma referência"
```

Expected: `nenhuma referência`.

- [ ] **Step 5: Verificar**

Run: `npm test` — Expected: PASS, **192** testes (198 − os 6 de `station-manager.test.ts`). Se o arquivo apagado tinha outra contagem, o esperado é 198 menos essa contagem; confira com `git show HEAD:tests/unit/station-manager.test.ts | grep -c "  it("`.
Run: `npm run check` — Expected: `0 errors`.
Run: `npm run build` — Expected: `22 page(s) built`.
Run: `npm run test:e2e` — Expected: **8** passando.
Run: `find dist/_astro -name "*.js" | wc -l` — Expected: `0`. Sem espécime e sem estações, a home volta a não ter JavaScript; o chão (Plano 4) é o próximo a trazer.

- [ ] **Step 6: Commit**

```bash
git add -A src tests
git commit -m "chore: remove trilho, estações, espécime e railLabel"
```

---

## Task 11: Os invariantes do `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md` (substituição completa)

- [ ] **Step 1: Reescrever**

Substituir o conteúdo inteiro de `CLAUDE.md` por:

```markdown
# Invariantes do projeto

Este é o portfólio de Marcus Vinicius: um site estático Astro 7, bilíngue
(PT/EN), chamado **A Bancada** — cada projeto é uma máquina que vive num chão,
e o estado dela vem dos dados reais do GitHub. A spec é
`docs/superpowers/specs/2026-09-22-portfolio-bancada-design.md`. Antes de mudar
algo, confira se a mudança respeita o que segue — são decisões deliberadas, não
acidentes de implementação.

- **IDs de conteúdo são `<locale>/<slug>`.** Vêm de `generateId` em
  `src/content.config.ts`. `src/lib/projects.ts` (`slugOf`, `entriesFor`) é o
  único lugar que deve parsear esse formato; não reintroduza `id.split('/')[1]`
  em páginas ou componentes.
- **Nenhum texto de exibição fica hardcoded em componente ou página.** Todo
  texto visível vive em `src/lib/ui-strings.ts` (`UI`, por idioma). Se um texto
  novo aparecer na tela, ele entra ali primeiro.
- **Cores só vêm de dois lugares:** a paleta base em `src/lib/tokens.ts`, e o
  acento por projeto no frontmatter do MDX (`accent`, `accentLight`). Nunca
  hardcode um hex em CSS.
- **Todo acento precisa de `accent` (escuro) e `accentLight` (claro), e os dois
  precisam passar WCAG AA (4.5:1)** contra o fundo do modo correspondente.
  `tests/unit/project-accents.test.ts` cobre isso lendo os MDX de verdade — não
  mantenha uma lista paralela.
- **Paridade PT/EN é imposta no build.** `src/lib/parity.ts` quebra o build se
  um slug existir num idioma e não no outro, e também se a coleção vier vazia.
  Os campos `accent`, `accentLight`, `order`, `kind`, `status`, `github` e
  `character` precisam ser iguais entre PT e EN — o teste de frontmatter cobre.
- **O build nunca acessa a rede.** Os dados do GitHub vêm de
  `src/data/github-snapshot.json`, gravado por `npm run refresh:github` e
  atualizado todo dia por um Action. O "hoje" do humor é o `generatedAt` do
  instantâneo, nunca o relógio — o build é reproduzível. Projeto novo exige
  rodar a coleta; `tests/unit/snapshot-coverage.test.ts` avisa se esquecerem.
- **Humor é função pura.** `src/lib/mood.ts` cruza o `status` escrito no MDX
  com o instantâneo. Concluído não é abandonado: `concluido` vira "formado", e
  só projeto inacabado e parado dorme.
- **Os personagens são máquinas com rosto em tela. Nenhum é humanoide.** Decisão
  do dono; não proponha personagem humano, nem o vampirinho.
- **Projetos do empregador do dono do repositório nunca aparecem no site.** "Pix
  Force" só pode ser citada como nome do empregador no texto "Sobre" — não como
  projeto, não como máquina.
- **JavaScript é aprimoramento progressivo.** O site é completo e navegável sem
  ele, e o teto é de 70 kB de JS minificado no total (§9 da spec). Cada motor de
  animação pausa quando sai da tela.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: invariantes da Bancada no CLAUDE.md"
```

---

## Task 12: A coleta diária

**Files:**
- Create: `.github/workflows/refresh-github.yml`

- [ ] **Step 1: Escrever o workflow**

Criar `.github/workflows/refresh-github.yml`:

```yaml
name: Atualiza dados do GitHub

on:
  schedule:
    # 06:17 UTC = 03:17 em Brasília, longe da virada do dia.
    - cron: '17 6 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'

      # O script só usa módulos do próprio Node e arquivos .ts locais:
      # não precisa de npm ci.
      - run: node --experimental-strip-types scripts/refresh-github.ts
        env:
          # Token pessoal com leitura de conteúdo e metadados nos repositórios
          # do portfólio — o GITHUB_TOKEN do Action não enxerga os privados.
          GITHUB_TOKEN: ${{ secrets.PORTFOLIO_GITHUB_TOKEN }}

      - name: Commita se mudou
        run: |
          if git diff --quiet -- src/data/github-snapshot.json; then
            echo "Instantâneo inalterado."
          else
            git config user.name "github-actions[bot]"
            git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
            git add src/data/github-snapshot.json
            git commit -m "chore: atualiza instantâneo do GitHub"
            git push
          fi
```

O `generatedAt` avança todo dia, então o workflow commita todo dia — é o que faz "há 24 dias" virar "há 25 dias" no site. Um push feito com o token do Action não dispara outros workflows; o deploy da Vercel reage ao push por webhook próprio.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/refresh-github.yml
git commit -m "ci: coleta diária dos dados do GitHub"
```

- [ ] **Step 3: Avisar o dono**

O workflow só funciona depois que o dono criar o segredo `PORTFOLIO_GITHUB_TOKEN` em *Settings → Secrets and variables → Actions* do repositório `marcus-vreis/portfolio`: um token *fine-grained* com acesso de leitura a **Contents** e **Metadata** nos nove repositórios. Registrar isso no relatório final — não é algo que quem executa o plano consegue fazer.

---

## Task 13: Capturas e README

**Files:**
- Modify: `scripts/screenshots.mjs` (substituição completa)
- Modify: `README.md` (substituição completa)
- Delete: capturas obsoletas em `docs/images/`

- [ ] **Step 1: Reescrever o script de capturas**

Substituir o conteúdo inteiro de `scripts/screenshots.mjs` por:

```js
// Gera as capturas usadas no README.
//
// Rode contra o site BUILDADO, não contra `astro dev` — a barra de ferramentas
// do modo de desenvolvimento aparece no rodapé e suja toda captura:
//
//   npm run build && npx serve dist -l 4331 &
//   SHOTS_BASE=http://localhost:4331 npm run shots
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.SHOTS_BASE ?? 'http://localhost:4321';
const OUT = 'docs/images';

const SHOTS = [
  { file: 'home-dark.png', path: '/', width: 1280, height: 900, scheme: 'dark' },
  { file: 'home-light.png', path: '/', width: 1280, height: 900, scheme: 'light' },
  { file: 'home-en.png', path: '/en/', width: 1280, height: 900, scheme: 'dark' },
  { file: 'index.png', path: '/#projetos', width: 1280, height: 900, scheme: 'dark' },
  { file: 'project-page.png', path: '/projeto/uda-ovd', width: 1280, height: 900, scheme: 'dark' },
  { file: 'mobile.png', path: '/', width: 390, height: 844, scheme: 'dark' },
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

for (const shot of SHOTS) {
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
    colorScheme: shot.scheme,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(BASE + shot.path, { waitUntil: 'networkidle' });
  // As fontes chegam depois do load e mudam a métrica do texto.
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}/${shot.file}` });
  await context.close();
  console.log('ok', shot.file);
}

await browser.close();
```

- [ ] **Step 2: Apagar as capturas que descrevem o site antigo**

```bash
git rm docs/images/station.png docs/images/station-vampireai.png \
  docs/images/station-vampireai-settled.png docs/images/station-visionforge-settled.png \
  docs/images/station-visionforge-sweep.png docs/images/hero-reveal-1.png \
  docs/images/hero-reveal-2.png docs/images/hero-reveal-3.png
```

Se algum desses não existir no índice do git, o `git rm` avisa; confira com `git ls-files docs/images` e apague só os que existirem.

- [ ] **Step 3: Gerar as capturas novas**

```bash
npm run build && (npx serve dist -l 4331 >/dev/null 2>&1 &) && sleep 4 && SHOTS_BASE=http://localhost:4331 npm run shots; npx kill-port 4331
```

Expected: seis linhas `ok`. Abrir `docs/images/home-dark.png` e `docs/images/index.png` e conferir que mostram a home nova.

- [ ] **Step 4: Reescrever o README**

Substituir o conteúdo inteiro de `README.md` por:

````markdown
# A Bancada — portfólio de Marcus Vinicius

A bilingual portfolio where every project is a **small machine living on a
bench**, and the state of each machine comes from its real GitHub repository.

![The home page in dark mode](docs/images/home-dark.png)

*(README in English on purpose: this repository is linked from the site, which
is aimed at both Brazilian and international readers.)*

> **Status — under construction.** This is stage 3 of 7: the data pipeline,
> the mood rules and the project index are live. The machines themselves (a
> pixel-art floor in Canvas 2D), the in-place project panel and the hero's
> light effect come next — see [Roadmap](#roadmap).

## The idea

The projects become machines with a screen for a face: a floating lens for
VisionForge, a weather station for AirWatch, a coffee maker for CoffeeBean, a
ball launcher for VoleiArena. None of them is humanoid.

Each machine's **mood is computed from the repository**. A daily job reads the
last commit (across *all* branches — `pushed_at` lies), the commits in the last
90 days, the latest tag and the stars, and crosses that with a hand-written
status:

| Mood | When |
|---|---|
| graduated | the project is finished — university coursework, for instance |
| full steam | active, 30 or more commits in 90 days |
| active | active, fewer commits |
| yawning / napping / asleep | paused, for under 90 / 90–180 / over 180 days |

Finished is not abandoned: a course project from 2024 *graduates*, it doesn't
gather dust. And the data keeps the status honest — a project marked "active"
with no commit in six months is treated as paused, and the build says so.

![The project index, each row saying the mood and the fact behind it](docs/images/index.png)

## A few things I'd point at

**The build never touches the network.** `npm run refresh:github` writes
`src/data/github-snapshot.json`, which is committed. A GitHub Action refreshes
it daily. The mood's "today" is the snapshot's date, never the clock, so any
build is reproducible.

**A missing translation fails the build**, and so does an empty collection —
which is what would happen, silently, if the content id format ever changed.

**Colour contrast is a test, not a hope.** Every accent is a *pair* — dark and
light mode — and `tests/unit/project-accents.test.ts` reads the real content
files to assert WCAG AA on each.

**No display text lives in a component.** It's all in `src/lib/ui-strings.ts`
or in MDX frontmatter.

| Light mode | English |
|---|---|
| ![Home in light mode — the hero stays a dark stage](docs/images/home-light.png) | ![Home in English](docs/images/home-en.png) |

## Commands

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the static site to `./dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run check` | Type-check, including `.astro` files and tests |
| `npm run refresh:github` | Refresh the GitHub snapshot (needs `GITHUB_TOKEN`) |
| `npm run shots` | Regenerate the screenshots in this README |

## Roadmap

- [x] **Stage 3 — data, mood and index.**
- [ ] **Stage 4 — the floor.** Canvas 2D, Aseprite spritesheets, the first two
  machines.
- [ ] **Stage 5 — the panel.** Projects open in place; the URL still changes.
- [ ] **Stage 6 — the hero.** Half photograph, half squares of light on the
  same pixel grid as the machines.
- [ ] **Stage 7 — the full cast** and the interactions between machines.

See `CLAUDE.md` for the project's invariants, and `docs/superpowers/` for the
spec and the implementation plans.
````

- [ ] **Step 5: Conferir os links de imagem**

```bash
node -e "const fs=require('fs');const md=fs.readFileSync('README.md','utf8');const refs=[...md.matchAll(/\]\((docs\/[^)]+)\)/g)].map(m=>m[1]);const bad=refs.filter(r=>!fs.existsSync(r));console.log(refs.length+' imagens, '+bad.length+' quebradas',bad)"
```

Expected: `4 imagens, 0 quebradas []`.

- [ ] **Step 6: Commit**

```bash
git add scripts/screenshots.mjs README.md docs/images
git commit -m "docs: README e capturas da Bancada"
```

---

## Task 14: Verificação final

- [ ] **Step 1: A suíte inteira**

```bash
npm test && npm run check && npm run build && npm run test:e2e
```

Expected: **192** testes de unidade, `0 errors`, **22** páginas, **8** e2e.

- [ ] **Step 2: Lighthouse**

```bash
npm run build && (npx serve dist -l 4331 >/dev/null 2>&1 &) && sleep 4 && npx lighthouse http://localhost:4331 --only-categories=performance,accessibility,best-practices --chrome-flags="--headless --no-sandbox" --output=json --output-path=./lh.json --quiet; node -e "const r=require('./lh.json');for(const[k,v]of Object.entries(r.categories))console.log(k,Math.round(v.score*100))"; rm -f lh.json; npx kill-port 4331
```

Expected: performance **≥ 95**, accessibility **100**, best-practices **100** (§9 da spec).

- [ ] **Step 3: Confidencialidade**

```bash
grep -rniE "occurrence|PRJ248|triton|zenml|citrosuco" src README.md || echo "limpo"
grep -rn "Pix Force" src
```

Expected: `limpo`; e `Pix Force` só aparece em `src/lib/ui-strings.ts`, dentro de `aboutBody`.

- [ ] **Step 4: Árvore limpa**

Run: `git status --short` — Expected: nada além de `.claude/`.

---

## Definição de pronto

- [ ] `npm test` — 192 testes
- [ ] `npm run check` — 0 erros
- [ ] `npm run build` — 22 páginas, sem acesso à rede
- [ ] `npm run test:e2e` — 8 testes
- [ ] A home mostra hero escuro, índice com humor e "Sobre" com pesquisa e contato
- [ ] Nenhum `.js` em `dist/_astro`
- [ ] Lighthouse ≥ 95 / 100 / 100
- [ ] O dono foi avisado sobre o segredo `PORTFOLIO_GITHUB_TOKEN`
