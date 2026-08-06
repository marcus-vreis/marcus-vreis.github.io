# Portfólio Banco Óptico — Plano 1: Fundação bilíngue

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Colocar no ar um site Astro bilíngue PT/EN com as dez estações de projeto renderizadas em tratamento neutro, trilho de navegação acessível, tokens de design verificados em contraste e cobertura de testes — sem nenhum WebGL ainda.

**Architecture:** Astro 5 estático. O conteúdo vive em Content Collections MDX, um arquivo por projeto e idioma, com paridade PT/EN imposta no build. As rotas são derivadas de um par de funções puras (`parsePath`/`buildPath`) para que o seletor de idioma preserve a rota atual sem lógica espalhada. Os tokens de cor são definidos em TypeScript como fonte única de verdade, emitidos como custom properties CSS pelo layout base, e cobertos por um teste de contraste WCAG. Nenhum componente contém texto de exibição.

**Tech Stack:** Astro 5, MDX, TypeScript, Vitest (unidade), Playwright (e2e), Fontsource (fontes self-hosted), Vercel (estático, sem adapter).

**Pré-requisitos:** Node 22.15.0 e npm 11.16.0 já verificados na máquina. Repositório em `C:\Users\marcu\Downloads\Portfolio`, HEAD em `47e2930`, contendo apenas `docs/`.

**Escopo deste plano — o que NÃO entra:** canvas WebGL, shaders, posters de fallback, ilhas interativas (ImageLab, KNN, AirWatch, VoleiArena, RVH) e o efeito de Bayer/demosaicing. Tudo isso é dos Planos 2 e 3. Aqui as estações são blocos tipográficos estáticos.

**Slugs canônicos** (usados em nome de arquivo, `id` de âncora e rota):
`visionforge`, `vampireai`, `uda-ovd`, `airwatch`, `imagelab`, `coffeebean`,
`cv-knn`, `sorting-hub`, `voleiarena`, `rvh-construtora`.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/lib/i18n.ts` | Converte caminho ↔ `{locale, route}`. Único lugar que sabe que EN mora em `/en/` e que o segmento de projeto muda de idioma. |
| `src/lib/contrast.ts` | Luminância relativa e razão de contraste WCAG. Puro, sem dependência do projeto. |
| `src/lib/tokens.ts` | Fonte única de verdade das cores. Consumido pelo layout e pelo teste. |
| `src/lib/parity.ts` | Compara os conjuntos PT e EN e devolve a lista de divergências. Puro. |
| `src/content.config.ts` | Schema Zod da coleção `projects`. |
| `src/content/projects/{pt,en}/<slug>.mdx` | Conteúdo. Vinte arquivos. |
| `src/layouts/Base.astro` | `<html>`, fontes, emissão dos tokens como custom properties, alternância claro/escuro. |
| `src/components/Rail.astro` | O trilho: navegação por âncora + marcações de escala. |
| `src/components/Station.astro` | Casca de uma estação: heading, acento local, slot de conteúdo. |
| `src/components/Specimen.astro` | Slot do retrato, com o bonequinho de palito como placeholder. |
| `src/components/LocaleToggle.astro` | Alterna idioma preservando rota e âncora. |
| `src/pages/index.astro`, `src/pages/en/index.astro` | Home por idioma; dispara a checagem de paridade no build. |
| `src/pages/projeto/[slug].astro`, `src/pages/en/project/[slug].astro` | Páginas profundas. |
| `tests/unit/*.test.ts` | Vitest sobre os módulos puros. |
| `tests/e2e/*.spec.ts` | Playwright sobre as jornadas. |

---

## Task 1: Scaffold do projeto

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`

- [ ] **Step 1: Criar o projeto Astro**

Rodar na raiz do repositório (a pasta já tem `docs/`, então o template é aplicado por cima):

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --skip-houston
```

Se o comando reclamar que o diretório não está vazio, aceitar continuar — ele não toca em `docs/`.

- [ ] **Step 2: Instalar dependências**

```bash
npm install && npm install @astrojs/mdx && npm install -D vitest @playwright/test
```

- [ ] **Step 3: Instalar as fontes**

Versões confirmadas em 2026-08-06, todas em 5.3.0:

```bash
npm install @fontsource/instrument-serif @fontsource-variable/geist @fontsource-variable/geist-mono
```

- [ ] **Step 4: Configurar o Astro**

Escrever `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  integrations: [mdx()],
  build: { format: 'directory' },
});
```

`site` recebe o domínio final quando ele existir; até lá o valor não afeta o build.

- [ ] **Step 5: Configurar o Vitest**

Escrever `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 6: Adicionar os scripts**

Em `package.json`, garantir que a seção `scripts` contenha exatamente:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 7: Verificar que o build passa**

```bash
npm run build
```

Esperado: `Complete!` e a pasta `dist/` criada.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 5 com MDX, Vitest e Playwright"
```

---

## Task 2: Roteamento bilíngue

O seletor de idioma precisa levar de `/projeto/visionforge` para `/en/project/visionforge`. Em vez de manipular string em cada componente, o caminho é convertido para uma rota canônica e reconstruído no idioma alvo.

**Files:**
- Create: `src/lib/i18n.ts`
- Test: `tests/unit/i18n.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

Criar `tests/unit/i18n.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildPath, parsePath, switchLocale } from '../../src/lib/i18n';

describe('parsePath', () => {
  it('trata a raiz como home em português', () => {
    expect(parsePath('/')).toEqual({ locale: 'pt', route: { kind: 'home' } });
  });

  it('reconhece o prefixo en', () => {
    expect(parsePath('/en/')).toEqual({ locale: 'en', route: { kind: 'home' } });
  });

  it('extrai o slug do projeto em português', () => {
    expect(parsePath('/projeto/visionforge')).toEqual({
      locale: 'pt',
      route: { kind: 'project', slug: 'visionforge' },
    });
  });

  it('extrai o slug do projeto em inglês', () => {
    expect(parsePath('/en/project/visionforge')).toEqual({
      locale: 'en',
      route: { kind: 'project', slug: 'visionforge' },
    });
  });

  it('ignora barra final', () => {
    expect(parsePath('/projeto/vampireai/')).toEqual({
      locale: 'pt',
      route: { kind: 'project', slug: 'vampireai' },
    });
  });

  it('cai em home quando o segmento não bate com o idioma', () => {
    expect(parsePath('/project/visionforge')).toEqual({
      locale: 'pt',
      route: { kind: 'home' },
    });
  });
});

describe('buildPath', () => {
  it('não prefixa o idioma padrão', () => {
    expect(buildPath({ kind: 'home' }, 'pt')).toBe('/');
    expect(buildPath({ kind: 'project', slug: 'imagelab' }, 'pt')).toBe('/projeto/imagelab');
  });

  it('prefixa e traduz o segmento em inglês', () => {
    expect(buildPath({ kind: 'home' }, 'en')).toBe('/en/');
    expect(buildPath({ kind: 'project', slug: 'imagelab' }, 'en')).toBe('/en/project/imagelab');
  });
});

describe('switchLocale', () => {
  it('preserva o projeto ao trocar de idioma', () => {
    expect(switchLocale('/projeto/uda-ovd', 'en')).toBe('/en/project/uda-ovd');
    expect(switchLocale('/en/project/uda-ovd', 'pt')).toBe('/projeto/uda-ovd');
  });

  it('é idempotente para o mesmo idioma', () => {
    expect(switchLocale('/projeto/coffeebean', 'pt')).toBe('/projeto/coffeebean');
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

```bash
npm test
```

Esperado: FAIL, `Failed to resolve import "../../src/lib/i18n"`.

- [ ] **Step 3: Implementar**

Criar `src/lib/i18n.ts`:

```ts
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
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

```bash
npm test
```

Esperado: PASS, 10 testes.

- [ ] **Step 5: Commit**

```bash
git add src/lib/i18n.ts tests/unit/i18n.test.ts
git commit -m "feat: roteamento bilíngue com rota canônica"
```

---

## Task 3: Tokens de cor com contraste verificado

O acento âmbar `#F0A33C` funciona sobre grafite mas **reprova no modo claro** — a razão contra `#F4F2ED` é 1,88, muito abaixo de AA. Por isso o acento tem um valor por modo. Este teste existe para que essa classe de erro não passe despercebida quando os dez acentos por projeto entrarem no Plano 3.

**Files:**
- Create: `src/lib/contrast.ts`, `src/lib/tokens.ts`
- Test: `tests/unit/contrast.test.ts`, `tests/unit/tokens.test.ts`

- [ ] **Step 1: Escrever o teste de contraste que falha**

Criar `tests/unit/contrast.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { contrastRatio, relativeLuminance } from '../../src/lib/contrast';

describe('relativeLuminance', () => {
  it('devolve 0 para preto e 1 para branco', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('rejeita hex inválido', () => {
    expect(() => relativeLuminance('#GGG')).toThrow('Hex inválido');
  });
});

describe('contrastRatio', () => {
  it('devolve 21 para preto contra branco', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 2);
  });

  it('é simétrico', () => {
    expect(contrastRatio('#F0A33C', '#0B0D0E')).toBeCloseTo(
      contrastRatio('#0B0D0E', '#F0A33C'),
      6,
    );
  });

  it('devolve 1 para a mesma cor', () => {
    expect(contrastRatio('#123456', '#123456')).toBeCloseTo(1, 6);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
npm test
```

Esperado: FAIL, `Failed to resolve import "../../src/lib/contrast"`.

- [ ] **Step 3: Implementar o cálculo de contraste**

Criar `src/lib/contrast.ts`:

```ts
/** Linearização de um canal sRGB, conforme WCAG 2.1. */
function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) throw new Error(`Hex inválido: ${hex}`);

  const int = Number.parseInt(match[1], 16);
  const r = channel((int >> 16) & 0xff);
  const g = channel((int >> 8) & 0xff);
  const b = channel(int & 0xff);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

```bash
npm test
```

Esperado: PASS.

- [ ] **Step 5: Escrever o teste dos tokens**

Criar `tests/unit/tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../../src/lib/contrast';
import { MODES, PALETTE } from '../../src/lib/tokens';

describe('paleta base', () => {
  for (const mode of MODES) {
    const { bg, fg, muted, accent } = PALETTE[mode];

    it(`${mode}: texto principal atinge 7:1`, () => {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(7);
    });

    it(`${mode}: texto secundário atinge AA (4.5:1)`, () => {
      expect(contrastRatio(muted, bg)).toBeGreaterThanOrEqual(4.5);
    });

    it(`${mode}: acento atinge AA (4.5:1)`, () => {
      expect(contrastRatio(accent, bg)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it('o acento do modo escuro reprovaria no modo claro', () => {
    // Documenta por que o acento é definido por modo em vez de ser único.
    expect(contrastRatio(PALETTE.dark.accent, PALETTE.light.bg)).toBeLessThan(4.5);
  });
});
```

`rule` fica de fora das asserções de propósito: é um filete divisório decorativo,
que o WCAG não exige que passe. O anel de foco usa `accent`, que já é coberto.

- [ ] **Step 6: Rodar e confirmar que falha**

```bash
npm test
```

Esperado: FAIL, `Failed to resolve import "../../src/lib/tokens"`.

- [ ] **Step 7: Implementar os tokens**

Criar `src/lib/tokens.ts`:

```ts
export const MODES = ['dark', 'light'] as const;
export type Mode = (typeof MODES)[number];

export interface Palette {
  /** Fundo da página. */
  bg: string;
  /** Texto principal. */
  fg: string;
  /** Texto secundário e legendas. */
  muted: string;
  /** Acento do site (âmbar de instrumento). Cada estação sobrescreve o seu. */
  accent: string;
  /** Filete decorativo do trilho. Não carrega informação. */
  rule: string;
}

export const PALETTE: Record<Mode, Palette> = {
  dark: {
    bg: '#0B0D0E',
    fg: '#E8E6E1',
    muted: '#9A9791',
    accent: '#F0A33C',
    rule: '#2A2D2F',
  },
  light: {
    bg: '#F4F2ED',
    fg: '#14161A',
    muted: '#5E5B55',
    // Âmbar escurecido: o #F0A33C do modo escuro só atinge 1,88 sobre papel.
    accent: '#9A5B00',
    rule: '#D6D2C8',
  },
};

/** Emite a paleta como bloco de custom properties CSS. */
export function paletteToCss(mode: Mode): string {
  const p = PALETTE[mode];
  return Object.entries(p)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(' ');
}
```

- [ ] **Step 8: Rodar e confirmar que passa**

```bash
npm test
```

Esperado: PASS, 7 testes novos.

- [ ] **Step 9: Commit**

```bash
git add src/lib/contrast.ts src/lib/tokens.ts tests/unit/contrast.test.ts tests/unit/tokens.test.ts
git commit -m "feat: tokens de cor com contraste WCAG verificado por teste"
```

---

## Task 4: Checagem de paridade PT/EN

A spec exige que uma tradução faltando quebre o build. A comparação é uma função pura para poder ser testada sem o Astro.

**Files:**
- Create: `src/lib/parity.ts`
- Test: `tests/unit/parity.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

Criar `tests/unit/parity.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { findParityErrors } from '../../src/lib/parity';

describe('findParityErrors', () => {
  it('não acusa nada quando os dois idiomas batem', () => {
    expect(findParityErrors(['a', 'b'], ['a', 'b'])).toEqual([]);
  });

  it('ignora a ordem', () => {
    expect(findParityErrors(['b', 'a'], ['a', 'b'])).toEqual([]);
  });

  it('acusa slug sem tradução em inglês', () => {
    expect(findParityErrors(['a', 'b'], ['a'])).toEqual([
      'Falta a versão EN de: b',
    ]);
  });

  it('acusa slug sem versão em português', () => {
    expect(findParityErrors(['a'], ['a', 'z'])).toEqual([
      'Falta a versão PT de: z',
    ]);
  });

  it('acusa os dois lados de uma vez, em ordem estável', () => {
    expect(findParityErrors(['a', 'b'], ['a', 'z'])).toEqual([
      'Falta a versão EN de: b',
      'Falta a versão PT de: z',
    ]);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
npm test
```

Esperado: FAIL, `Failed to resolve import "../../src/lib/parity"`.

- [ ] **Step 3: Implementar**

Criar `src/lib/parity.ts`:

```ts
/**
 * Compara os slugs presentes em cada idioma e descreve as divergências.
 * Devolve lista vazia quando há paridade. A ordem da saída é estável para
 * que a mensagem de erro do build seja determinística.
 */
export function findParityErrors(ptSlugs: string[], enSlugs: string[]): string[] {
  const pt = new Set(ptSlugs);
  const en = new Set(enSlugs);
  const errors: string[] = [];

  for (const slug of [...pt].sort()) {
    if (!en.has(slug)) errors.push(`Falta a versão EN de: ${slug}`);
  }
  for (const slug of [...en].sort()) {
    if (!pt.has(slug)) errors.push(`Falta a versão PT de: ${slug}`);
  }

  return errors;
}

/** Lança se houver divergência. Chamado no build, a partir das páginas home. */
export function assertParity(ptSlugs: string[], enSlugs: string[]): void {
  const errors = findParityErrors(ptSlugs, enSlugs);
  if (errors.length > 0) {
    throw new Error(`Paridade PT/EN quebrada:\n  ${errors.join('\n  ')}`);
  }
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

```bash
npm test
```

Esperado: PASS, 5 testes novos.

- [ ] **Step 5: Commit**

```bash
git add src/lib/parity.ts tests/unit/parity.test.ts
git commit -m "feat: checagem de paridade PT/EN"
```

---

## Task 5: Coleção de conteúdo e conteúdo semente

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/pt/*.mdx` (10), `src/content/projects/en/*.mdx` (10)

- [ ] **Step 1: Definir o schema**

Criar `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    /** Nome do projeto como aparece no título da estação. */
    title: z.string(),
    /** O apelido da estação: "O Instrumento", "O Nevoeiro". */
    persona: z.string(),
    /** Uma linha que resume o projeto. */
    tagline: z.string(),
    /** Cor de acento da estação, hex de 6 dígitos. */
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    /** Posição no trilho, crescente. */
    order: z.number().int().positive(),
    /** Ano ou intervalo, exibido como dado. */
    year: z.string(),
    /** Tecnologias exibidas como etiquetas. */
    stack: z.array(z.string()).min(1),
    /** Links externos. Ausente quando o repositório é privado. */
    repo: z.string().url().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Escrever o par de arquivos exemplar**

Criar `src/content/projects/pt/visionforge.mdx`:

```mdx
---
title: VisionForge
persona: O Instrumento
tagline: Plataforma local-first de experimentação em visão computacional.
accent: '#6EE7A8'
order: 1
year: '2025—2026'
stack: ['PyTorch', 'FastAPI', 'React', 'Docker']
repo: 'https://github.com/marcus-vreis/VisionForge'
links:
  - label: 'PyPI'
    href: 'https://pypi.org/project/visionforge-studio/'
---

Treinar, validar e comparar modelos na própria GPU — sem nuvem, sem notebook,
sem laço de treino copiado. Cinco famílias de tarefa atrás da mesma interface:
classificação, detecção, regressão de imagem, segmentação semântica e detecção
de anomalia, mais um SDK para tarefas próprias.

O que o projeto defende é simples de dizer e raro de encontrar: o número que
você reporta precisa ser um número que você consegue defender. Toda execução
grava a proveniência completa, e toda comparação pode ser replicada em várias
seeds com intervalo de confiança.
```

Criar `src/content/projects/en/visionforge.mdx` — mesmo frontmatter, exceto `persona`, `tagline` e o corpo:

```mdx
---
title: VisionForge
persona: The Instrument
tagline: A local-first computer-vision experimentation platform.
accent: '#6EE7A8'
order: 1
year: '2025—2026'
stack: ['PyTorch', 'FastAPI', 'React', 'Docker']
repo: 'https://github.com/marcus-vreis/VisionForge'
links:
  - label: 'PyPI'
    href: 'https://pypi.org/project/visionforge-studio/'
---

Train, validate and compare models on your own GPU — no cloud, no notebooks, no
copy-pasted training loops. Five task families behind one interface:
classification, detection, image regression, semantic segmentation and anomaly
detection, plus an SDK for your own tasks.

What the project argues is easy to say and rare to find: the number you report
has to be a number you can defend. Every run records its full provenance, and
every comparison can be replicated across seeds with confidence intervals.
```

- [ ] **Step 3: Escrever os outros nove pares**

Mesma estrutura. Os valores de frontmatter estão fixados abaixo — não inventar
nenhum. O corpo de cada arquivo é o parágrafo descritivo correspondente da
seção 6 da spec (`docs/superpowers/specs/2026-08-06-portfolio-design.md`),
copiado e adaptado para prosa corrida, mais a tradução em inglês.

| slug | order | title | persona PT / EN | accent | year | stack | repo |
|---|---|---|---|---|---|---|---|
| `vampireai` | 2 | VampireAI | O Jogador Míope / The Short-Sighted Player | `#C1272D` | `'2026'` | Qwen2.5-VL, Ollama, pydantic, mss | `https://github.com/marcus-vreis/VampireAI` |
| `uda-ovd` | 3 | Adaptação de domínio para detecção / Domain adaptation for detection | O Nevoeiro / The Fog | `#8FA6B8` | `'2026—'` | Grounding DINO, LoRA, Cityscapes | *(sem repo)* |
| `airwatch` | 4 | AirWatch | A Rede / The Network | `#4EC9E0` | `'2026'` | TypeScript, Docker, WebSocket, REST | `https://github.com/marcus-vreis/AirWatch` |
| `imagelab` | 5 | ImageLab | O Bisturi / The Scalpel | `#E040A0` | `'2025'` | Python, OpenCV, scikit-image, Tkinter | `https://github.com/marcus-vreis/ImageLab` |
| `coffeebean` | 6 | ComputerVision-CoffeeBean | O Grão / The Bean | `#A9704B` | `'2024'` | PyTorch, scikit-learn, Jupyter | `https://github.com/marcus-vreis/ComputerVision-CoffeeBean` |
| `cv-knn` | 7 | ComputerVision-KNN | As Formas / The Shapes | `#FF7A29` | `'2024'` | scikit-image, k-NN, SVM, MPEG7 | `https://github.com/marcus-vreis/ComputerVision-KNN` |
| `sorting-hub` | 8 | Sorting-Algorithms-Hub | O Metrônomo / The Metronome | `#9A9791` | `'2024'` | C++ | `https://github.com/marcus-vreis/Sorting-Algorithms-Hub` |
| `voleiarena` | 9 | VoleiArena | A Quadra / The Court | `#2F9E7E` | `'2026'` | React, Vite, Supabase | *(sem repo — privado)* |
| `rvh-construtora` | 10 | RVH Construtora | A Obra / The Site | `#F2B705` | `'2026'` | HTML, CSS, JavaScript, Vercel | *(sem repo — privado)* |

Para `coffeebean`, incluir também em `links` o vídeo explicativo:
`{ label: 'Vídeo', href: 'https://www.youtube.com/watch?v=mVWqjKUZZsI' }`
(no arquivo EN, `label: 'Video'`).

**Restrição de conteúdo:** nenhum arquivo pode citar projeto, cliente ou métrica
interna da Pix Force. A empresa aparece apenas na seção "Sobre" (Task 9).

- [ ] **Step 4: Verificar que a coleção carrega**

```bash
npm run build
```

Esperado: build passa. Se um frontmatter estiver fora do schema, o Astro
aponta o arquivo e o campo.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content
git commit -m "feat: coleção de projetos com as dez estações em PT e EN"
```

---

## Task 6: Layout base, fontes e modo claro/escuro

**Files:**
- Create: `src/layouts/Base.astro`, `src/styles/global.css`

- [ ] **Step 1: Escrever o CSS global**

Criar `src/styles/global.css`:

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }

html {
  color-scheme: dark light;
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: 'Geist Variable', system-ui, sans-serif;
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

code, kbd, .tabular {
  font-family: 'Geist Mono Variable', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}

a { color: inherit; }

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Escrever o layout**

Criar `src/layouts/Base.astro`:

```astro
---
import '@fontsource/instrument-serif/400.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '../styles/global.css';
import { paletteToCss } from '../lib/tokens';
import type { Locale } from '../lib/i18n';

interface Props {
  title: string;
  description: string;
  locale: Locale;
}

const { title, description, locale } = Astro.props;
---

<html lang={locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
    <style is:inline set:html={`
      :root { ${paletteToCss('dark')} }
      @media (prefers-color-scheme: light) { :root { ${paletteToCss('light')} } }
      :root[data-mode="dark"] { ${paletteToCss('dark')} }
      :root[data-mode="light"] { ${paletteToCss('light')} }
    `} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

O bloco de estilo é gerado a partir de `tokens.ts`, então os valores testados na
Task 3 são literalmente os que chegam ao navegador — não há uma segunda cópia
das cores para sair de sincronia.

- [ ] **Step 3: Verificar o build**

```bash
npm run build
```

Esperado: passa.

- [ ] **Step 4: Commit**

```bash
git add src/layouts src/styles
git commit -m "feat: layout base com fontes self-hosted e tokens por modo"
```

---

## Task 7: O trilho

**Files:**
- Create: `src/components/Rail.astro`

- [ ] **Step 1: Implementar**

Criar `src/components/Rail.astro`:

```astro
---
interface Stop {
  slug: string;
  label: string;
}

interface Props {
  stops: Stop[];
  navLabel: string;
}

const { stops, navLabel } = Astro.props;
---

<nav class="rail" aria-label={navLabel}>
  <ol>
    {stops.map((stop, index) => (
      <li>
        <a href={`#${stop.slug}`} data-stop={stop.slug}>
          <span class="tick" aria-hidden="true"></span>
          <span class="index tabular">{String(index + 1).padStart(2, '0')}</span>
          <span class="label">{stop.label}</span>
        </a>
      </li>
    ))}
  </ol>
</nav>

<style>
  .rail {
    position: sticky;
    top: 0;
    z-index: 10;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--rule);
  }

  ol {
    display: flex;
    gap: 0;
    margin: 0;
    padding: 0 1rem;
    list-style: none;
    overflow-x: auto;
    scrollbar-width: none;
  }

  a {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.75rem 0.875rem;
    text-decoration: none;
    white-space: nowrap;
    font-size: 0.8125rem;
    color: var(--muted);
    transition: color 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  a:hover { color: var(--fg); }

  .tick {
    width: 1px;
    height: 0.5rem;
    background: var(--rule);
  }

  .index { color: var(--accent); }

  @media (max-width: 40rem) {
    .label { display: none; }
  }
</style>
```

O trilho é uma `<nav>` com lista ordenada, então leitores de tela anunciam
posição e total, e a navegação por teclado é a nativa dos links.

- [ ] **Step 2: Commit**

```bash
git add src/components/Rail.astro
git commit -m "feat: trilho de navegação por estação"
```

---

## Task 8: Estação e espécime

**Files:**
- Create: `src/components/Station.astro`, `src/components/Specimen.astro`, `public/specimen/placeholder.svg`

- [ ] **Step 1: Desenhar o bonequinho de palito**

Criar `public/specimen/placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" role="img" aria-label="Bonequinho de palito no lugar do retrato">
  <rect width="400" height="500" fill="#1A1D1F"/>
  <g fill="none" stroke="#E8E6E1" stroke-width="8" stroke-linecap="round">
    <circle cx="200" cy="170" r="62"/>
    <line x1="200" y1="232" x2="200" y2="370"/>
    <line x1="200" y1="272" x2="126" y2="330"/>
    <line x1="200" y1="272" x2="274" y2="330"/>
    <line x1="200" y1="370" x2="150" y2="460"/>
    <line x1="200" y1="370" x2="250" y2="460"/>
  </g>
  <g fill="#E8E6E1">
    <circle cx="178" cy="158" r="6"/>
    <circle cx="222" cy="158" r="6"/>
  </g>
  <path d="M172 196 Q200 216 228 196" fill="none" stroke="#E8E6E1" stroke-width="7" stroke-linecap="round"/>
</svg>
```

Proporção 4:5, a mesma que a fotografia final vai usar.

- [ ] **Step 2: Implementar o espécime**

Criar `src/components/Specimen.astro`:

```astro
---
interface Props {
  /** Texto alternativo — descreve a imagem que estiver no slot. */
  alt: string;
  /** Legenda curta exibida abaixo. */
  caption: string;
}

const { alt, caption } = Astro.props;

// Trocar por '/specimen/marcus.jpg' quando a fotografia existir.
// Nenhum outro arquivo precisa mudar.
const SPECIMEN_SRC = '/specimen/placeholder.svg';
---

<figure class="specimen">
  <img src={SPECIMEN_SRC} alt={alt} width="400" height="500" />
  <figcaption class="tabular">{caption}</figcaption>
</figure>

<style>
  .specimen { margin: 0; max-width: 20rem; }

  img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border: 1px solid var(--rule);
  }

  figcaption {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 3: Implementar a estação**

Criar `src/components/Station.astro`:

```astro
---
interface Props {
  slug: string;
  title: string;
  persona: string;
  tagline: string;
  accent: string;
  year: string;
  stack: string[];
  href: string;
  /** Rótulos vêm do idioma da página — o componente é compartilhado. */
  yearLabel: string;
  stackLabel: string;
  readLabel: string;
}

const {
  slug, title, persona, tagline, accent, year, stack, href,
  yearLabel, stackLabel, readLabel,
} = Astro.props;
---

<section id={slug} aria-labelledby={`${slug}-title`} style={`--accent: ${accent}`}>
  <p class="persona tabular">{persona}</p>
  <h2 id={`${slug}-title`}>{title}</h2>
  <p class="tagline">{tagline}</p>

  <dl class="meta tabular">
    <dt>{yearLabel}</dt><dd>{year}</dd>
    <dt>{stackLabel}</dt><dd>{stack.join(' · ')}</dd>
  </dl>

  <slot />

  <a class="read" href={href}>{readLabel}</a>
</section>

<style>
  section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 1.5rem;
    max-width: 46rem;
    margin-inline: auto;
    border-top: 1px solid var(--rule);
  }

  .persona {
    color: var(--accent);
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h2 { font-size: clamp(2.5rem, 1.5rem + 4vw, 5rem); }

  .tagline { color: var(--muted); max-width: 34rem; }

  .meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.25rem 1.5rem;
    font-size: 0.8125rem;
    margin: 0;
  }

  .meta dt { color: var(--muted); }
  .meta dd { margin: 0; }

  .read {
    align-self: start;
    padding-bottom: 2px;
    border-bottom: 1px solid var(--accent);
    text-decoration: none;
    font-size: 0.875rem;
  }
</style>
```

Cada estação sobrescreve `--accent` no próprio escopo, então o link, o rótulo da
persona e o anel de foco herdam a cor do projeto sem uma folha de estilo por
estação.

- [ ] **Step 4: Commit**

```bash
git add src/components/Station.astro src/components/Specimen.astro public/specimen
git commit -m "feat: estação, espécime e placeholder de bonequinho de palito"
```

---

## Task 9: Seletor de idioma

**Files:**
- Create: `src/components/LocaleToggle.astro`

- [ ] **Step 1: Implementar**

Criar `src/components/LocaleToggle.astro`:

```astro
---
import { LOCALES, switchLocale, type Locale } from '../lib/i18n';

interface Props {
  current: Locale;
  pathname: string;
}

const { current, pathname } = Astro.props;
const LABEL: Record<Locale, string> = { pt: 'Português', en: 'English' };
---

<div class="toggle">
  {LOCALES.map((locale) => (
    locale === current
      ? <span aria-current="true" lang={locale}>{LABEL[locale]}</span>
      : <a href={switchLocale(pathname, locale)} lang={locale}>{LABEL[locale]}</a>
  ))}
</div>

<style>
  .toggle {
    display: flex;
    gap: 0.75rem;
    font-size: 0.8125rem;
  }

  span[aria-current] { color: var(--accent); }
  a { color: var(--muted); text-decoration: none; }
  a:hover { color: var(--fg); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LocaleToggle.astro
git commit -m "feat: seletor de idioma preservando a rota"
```

---

## Task 10: Home nos dois idiomas

**Files:**
- Create: `src/pages/index.astro`, `src/pages/en/index.astro`, `src/lib/ui-strings.ts`

- [ ] **Step 1: Extrair as strings de interface**

Nenhum texto de exibição vive em componente. Criar `src/lib/ui-strings.ts`:

```ts
import type { Locale } from './i18n';

export interface UiStrings {
  siteTitle: string;
  siteDescription: string;
  thesis: string;
  intro: string;
  navLabel: string;
  yearLabel: string;
  stackLabel: string;
  readLabel: string;
  repoLabel: string;
  backLabel: string;
  specimenAlt: string;
  specimenCaption: string;
  aboutHeading: string;
  aboutBody: string[];
}

export const UI: Record<Locale, UiStrings> = {
  pt: {
    siteTitle: 'Marcus Vinicius — Banco Óptico',
    siteDescription:
      'Portfólio de Marcus Vinicius: visão computacional, engenharia de machine learning e software.',
    thesis: 'Construo instrumentos para ver.',
    intro:
      'Engenheiro de visão computacional. Cada projeto abaixo é uma estação neste banco óptico.',
    navLabel: 'Estações do banco óptico',
    yearLabel: 'Ano',
    stackLabel: 'Stack',
    readLabel: 'Abrir estação',
    repoLabel: 'Repositório',
    backLabel: 'Voltar ao banco óptico',
    specimenAlt: 'Bonequinho de palito no lugar do retrato',
    specimenCaption: 'Espécime — retrato pendente',
    aboutHeading: 'Sobre',
    aboutBody: [
      'Engenheiro de visão computacional na Pix Force, onde trabalho com inferência em produção, streaming de vídeo e GPU.',
      'Mestrado em andamento em adaptação de domínio para detecção com vocabulário aberto. Graduação na UFV.',
      'Uma RTX 5060 Ti de 16 GB. Sem cluster. Tudo que eu publico roda numa GPU só — e é por isso que o trabalho é desenhado para caber.',
    ],
  },
  en: {
    siteTitle: 'Marcus Vinicius — Optical Bench',
    siteDescription:
      'Portfolio of Marcus Vinicius: computer vision, machine-learning engineering and software.',
    thesis: 'I build instruments for seeing.',
    intro:
      'Computer-vision engineer. Each project below is a station on this optical bench.',
    navLabel: 'Optical bench stations',
    yearLabel: 'Year',
    stackLabel: 'Stack',
    readLabel: 'Open station',
    repoLabel: 'Repository',
    backLabel: 'Back to the optical bench',
    specimenAlt: 'Stick figure standing in for the portrait',
    specimenCaption: 'Specimen — portrait pending',
    aboutHeading: 'About',
    aboutBody: [
      'Computer-vision engineer at Pix Force, working on production inference, video streaming and GPU workloads.',
      'Ongoing master’s research on domain adaptation for open-vocabulary detection. Undergraduate degree at UFV.',
      'One RTX 5060 Ti, 16 GB. No cluster. Everything I publish runs on a single GPU — which is why the work is designed to fit.',
    ],
  },
};
```

- [ ] **Step 2: Implementar a home em português**

Criar `src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import Rail from '../components/Rail.astro';
import Station from '../components/Station.astro';
import Specimen from '../components/Specimen.astro';
import LocaleToggle from '../components/LocaleToggle.astro';
import { assertParity } from '../lib/parity';
import { buildPath } from '../lib/i18n';
import { UI } from '../lib/ui-strings';

const all = await getCollection('projects');
const slugOf = (id: string) => id.split('/')[1];

// Quebra o build se faltar tradução dos dois lados.
assertParity(
  all.filter((e) => e.id.startsWith('pt/')).map((e) => slugOf(e.id)),
  all.filter((e) => e.id.startsWith('en/')).map((e) => slugOf(e.id)),
);

const projects = all
  .filter((e) => e.id.startsWith('pt/'))
  .sort((a, b) => a.data.order - b.data.order);

const t = UI.pt;
const stops = projects.map((p) => ({ slug: slugOf(p.id), label: p.data.title }));
---

<Base title={t.siteTitle} description={t.siteDescription} locale="pt">
  <Rail stops={stops} navLabel={t.navLabel} />

  <header>
    <LocaleToggle current="pt" pathname={Astro.url.pathname} />
    <Specimen alt={t.specimenAlt} caption={t.specimenCaption} />
    <h1>{t.thesis}</h1>
    <p>{t.intro}</p>
  </header>

  <main>
    {projects.map((p) => (
      <Station
        slug={slugOf(p.id)}
        title={p.data.title}
        persona={p.data.persona}
        tagline={p.data.tagline}
        accent={p.data.accent}
        year={p.data.year}
        stack={p.data.stack}
        href={buildPath({ kind: 'project', slug: slugOf(p.id) }, 'pt')}
        yearLabel={t.yearLabel}
        stackLabel={t.stackLabel}
        readLabel={t.readLabel}
      />
    ))}
  </main>

  <footer id="sobre">
    <h2>{t.aboutHeading}</h2>
    {t.aboutBody.map((paragraph) => <p>{paragraph}</p>)}
  </footer>
</Base>

<style>
  header, footer {
    max-width: 46rem;
    margin-inline: auto;
    padding: 4rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  h1 { font-size: clamp(3rem, 2rem + 6vw, 7rem); }
  footer { border-top: 1px solid var(--rule); }
  footer p { color: var(--muted); max-width: 36rem; }
</style>
```

- [ ] **Step 3: Implementar a home em inglês**

Criar `src/pages/en/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Rail from '../../components/Rail.astro';
import Station from '../../components/Station.astro';
import Specimen from '../../components/Specimen.astro';
import LocaleToggle from '../../components/LocaleToggle.astro';
import { assertParity } from '../../lib/parity';
import { buildPath } from '../../lib/i18n';
import { UI } from '../../lib/ui-strings';

const all = await getCollection('projects');
const slugOf = (id: string) => id.split('/')[1];

// Quebra o build se faltar tradução dos dois lados.
assertParity(
  all.filter((e) => e.id.startsWith('pt/')).map((e) => slugOf(e.id)),
  all.filter((e) => e.id.startsWith('en/')).map((e) => slugOf(e.id)),
);

const projects = all
  .filter((e) => e.id.startsWith('en/'))
  .sort((a, b) => a.data.order - b.data.order);

const t = UI.en;
const stops = projects.map((p) => ({ slug: slugOf(p.id), label: p.data.title }));
---

<Base title={t.siteTitle} description={t.siteDescription} locale="en">
  <Rail stops={stops} navLabel={t.navLabel} />

  <header>
    <LocaleToggle current="en" pathname={Astro.url.pathname} />
    <Specimen alt={t.specimenAlt} caption={t.specimenCaption} />
    <h1>{t.thesis}</h1>
    <p>{t.intro}</p>
  </header>

  <main>
    {projects.map((p) => (
      <Station
        slug={slugOf(p.id)}
        title={p.data.title}
        persona={p.data.persona}
        tagline={p.data.tagline}
        accent={p.data.accent}
        year={p.data.year}
        stack={p.data.stack}
        href={buildPath({ kind: 'project', slug: slugOf(p.id) }, 'en')}
        yearLabel={t.yearLabel}
        stackLabel={t.stackLabel}
        readLabel={t.readLabel}
      />
    ))}
  </main>

  <footer id="about">
    <h2>{t.aboutHeading}</h2>
    {t.aboutBody.map((paragraph) => <p>{paragraph}</p>)}
  </footer>
</Base>

<style>
  header, footer {
    max-width: 46rem;
    margin-inline: auto;
    padding: 4rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  h1 { font-size: clamp(3rem, 2rem + 6vw, 7rem); }
  footer { border-top: 1px solid var(--rule); }
  footer p { color: var(--muted); max-width: 36rem; }
</style>
```

- [ ] **Step 4: Verificar que a paridade é imposta**

Renomear temporariamente um arquivo EN e confirmar que o build falha:

```bash
mv src/content/projects/en/airwatch.mdx ./airwatch.mdx.bak && npm run build; mv ./airwatch.mdx.bak src/content/projects/en/airwatch.mdx
```

Esperado: o build falha com `Paridade PT/EN quebrada:` e
`Falta a versão EN de: airwatch`. Depois do `mv` de volta, `npm run build` passa.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ui-strings.ts src/pages/index.astro src/pages/en/index.astro
git commit -m "feat: home bilíngue com paridade imposta no build"
```

---

## Task 11: Páginas profundas

**Files:**
- Create: `src/pages/projeto/[slug].astro`, `src/pages/en/project/[slug].astro`

- [ ] **Step 1: Implementar a rota em português**

Criar `src/pages/projeto/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import LocaleToggle from '../../components/LocaleToggle.astro';
import { UI } from '../../lib/ui-strings';

export async function getStaticPaths() {
  const entries = await getCollection('projects');
  return entries
    .filter((entry) => entry.id.startsWith('pt/'))
    .map((entry) => ({
      params: { slug: entry.id.split('/')[1] },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const t = UI.pt;
const d = entry.data;
---

<Base
  title={`${d.title} — ${t.siteTitle}`}
  description={d.tagline}
  locale="pt"
>
  <article style={`--accent: ${d.accent}`}>
    <LocaleToggle current="pt" pathname={Astro.url.pathname} />
    <p class="persona tabular">{d.persona}</p>
    <h1>{d.title}</h1>
    <p class="tagline">{d.tagline}</p>

    <dl class="meta tabular">
      <dt>{t.yearLabel}</dt><dd>{d.year}</dd>
      <dt>{t.stackLabel}</dt><dd>{d.stack.join(' · ')}</dd>
    </dl>

    <div class="prose"><Content /></div>

    <ul class="links">
      {d.repo && <li><a href={d.repo}>{t.repoLabel}</a></li>}
      {d.links.map((link) => <li><a href={link.href}>{link.label}</a></li>)}
    </ul>

    <a class="back" href="/">← {t.backLabel}</a>
  </article>
</Base>

<style>
  article {
    max-width: 42rem;
    margin-inline: auto;
    padding: 4rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .persona {
    color: var(--accent);
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 { font-size: clamp(2.5rem, 1.5rem + 4vw, 4.5rem); }
  .tagline { color: var(--muted); }

  .meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.25rem 1.5rem;
    font-size: 0.8125rem;
    margin: 0;
  }

  .meta dt { color: var(--muted); }
  .meta dd { margin: 0; }

  .prose { display: flex; flex-direction: column; gap: 1rem; }

  .links { display: flex; gap: 1rem; padding: 0; list-style: none; }
  .links a { border-bottom: 1px solid var(--accent); text-decoration: none; }

  .back { color: var(--muted); text-decoration: none; font-size: 0.875rem; }
</style>
```

- [ ] **Step 2: Implementar a rota em inglês**

Criar `src/pages/en/project/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../../layouts/Base.astro';
import LocaleToggle from '../../../components/LocaleToggle.astro';
import { UI } from '../../../lib/ui-strings';

export async function getStaticPaths() {
  const entries = await getCollection('projects');
  return entries
    .filter((entry) => entry.id.startsWith('en/'))
    .map((entry) => ({
      params: { slug: entry.id.split('/')[1] },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const t = UI.en;
const d = entry.data;
---

<Base
  title={`${d.title} — ${t.siteTitle}`}
  description={d.tagline}
  locale="en"
>
  <article style={`--accent: ${d.accent}`}>
    <LocaleToggle current="en" pathname={Astro.url.pathname} />
    <p class="persona tabular">{d.persona}</p>
    <h1>{d.title}</h1>
    <p class="tagline">{d.tagline}</p>

    <dl class="meta tabular">
      <dt>{t.yearLabel}</dt><dd>{d.year}</dd>
      <dt>{t.stackLabel}</dt><dd>{d.stack.join(' · ')}</dd>
    </dl>

    <div class="prose"><Content /></div>

    <ul class="links">
      {d.repo && <li><a href={d.repo}>{t.repoLabel}</a></li>}
      {d.links.map((link) => <li><a href={link.href}>{link.label}</a></li>)}
    </ul>

    <a class="back" href="/en/">← {t.backLabel}</a>
  </article>
</Base>

<style>
  article {
    max-width: 42rem;
    margin-inline: auto;
    padding: 4rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .persona {
    color: var(--accent);
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 { font-size: clamp(2.5rem, 1.5rem + 4vw, 4.5rem); }
  .tagline { color: var(--muted); }

  .meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.25rem 1.5rem;
    font-size: 0.8125rem;
    margin: 0;
  }

  .meta dt { color: var(--muted); }
  .meta dd { margin: 0; }

  .prose { display: flex; flex-direction: column; gap: 1rem; }

  .links { display: flex; gap: 1rem; padding: 0; list-style: none; }
  .links a { border-bottom: 1px solid var(--accent); text-decoration: none; }

  .back { color: var(--muted); text-decoration: none; font-size: 0.875rem; }
</style>
```

- [ ] **Step 3: Verificar as rotas geradas**

```bash
npm run build && ls dist/projeto && ls dist/en/project
```

Esperado: dez diretórios em cada um, com os slugs canônicos.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projeto src/pages/en/project
git commit -m "feat: páginas profundas de projeto nos dois idiomas"
```

---

## Task 12: Testes de ponta a ponta

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: Instalar o navegador**

```bash
npx playwright install chromium
```

- [ ] **Step 2: Configurar o Playwright**

Criar `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: Escrever os testes**

Criar `tests/e2e/navigation.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

const SLUGS = [
  'visionforge', 'vampireai', 'uda-ovd', 'airwatch', 'imagelab',
  'coffeebean', 'cv-knn', 'sorting-hub', 'voleiarena', 'rvh-construtora',
];

test('a home lista as dez estações na ordem do trilho', async ({ page }) => {
  await page.goto('/');
  for (const slug of SLUGS) {
    await expect(page.locator(`section#${slug}`)).toHaveCount(1);
  }
  const links = page.locator('nav[aria-label] a[data-stop]');
  await expect(links).toHaveCount(SLUGS.length);
  await expect(links.first()).toHaveAttribute('data-stop', 'visionforge');
});

test('o seletor de idioma preserva a estação aberta', async ({ page }) => {
  await page.goto('/projeto/uda-ovd');
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/project\/uda-ovd\/?$/);

  await page.getByRole('link', { name: 'Português' }).click();
  await expect(page).toHaveURL(/\/projeto\/uda-ovd\/?$/);
});

test('cada estação leva à sua página profunda', async ({ page }) => {
  await page.goto('/');
  await page.locator('section#visionforge a.read').click();
  await expect(page).toHaveURL(/\/projeto\/visionforge\/?$/);
  await expect(page.locator('h1')).toHaveText('VisionForge');
});

test('o trilho é percorrível por teclado', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('nav[aria-label] a[data-stop]').first();
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('nav[aria-label] a[data-stop]').nth(1)).toBeFocused();
});

test('a home em inglês existe e aponta para as rotas em inglês', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('section#visionforge a.read')).toHaveAttribute(
    'href',
    '/en/project/visionforge',
  );
});
```

- [ ] **Step 4: Rodar e confirmar que passam**

```bash
npm run test:e2e
```

Esperado: 5 testes passando.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e
git commit -m "test: cobertura e2e de navegação, idioma e teclado"
```

---

## Task 13: Deploy na Vercel

**Files:**
- Create: `vercel.json`, `.github/workflows/ci.yml`

- [ ] **Step 1: Configurar a Vercel**

Site estático, sem adapter. Criar `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "cleanUrls": true
}
```

- [ ] **Step 2: Adicionar CI**

Criar `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

- [ ] **Step 3: Rodar a suíte completa**

```bash
npm test && npm run build && npm run test:e2e
```

Esperado: unidade passa (27 testes — 10 de i18n, 5 de contraste, 7 de tokens,
5 de paridade), build passa, e2e passa (5 testes).

- [ ] **Step 4: Medir a linha de base**

Sem WebGL, esta é a melhor pontuação que o site vai ter. Registrar o número
agora dá o teto contra o qual o Plano 2 será comparado.

```bash
npm run build && npx serve dist -l 4321 & npx lighthouse http://localhost:4321 --only-categories=performance,accessibility,best-practices --chrome-flags="--headless" --output=json --output-path=./lighthouse-baseline.json
```

Esperado: as três categorias em 100 ou muito perto. Anotar os valores no corpo do
commit. Adicionar `lighthouse-baseline.json` ao `.gitignore` — o que importa é o
número registrado, não o arquivo.

- [ ] **Step 5: Commit**

```bash
git add vercel.json .github/workflows/ci.yml .gitignore
git commit -m "ci: build e testes no GitHub Actions, deploy estático na Vercel"
```

- [ ] **Step 6: Publicar**

Criar o repositório e conectar à Vercel. O deploy é detectado automaticamente
(framework Astro, saída estática).

```bash
gh repo create marcus-vreis/portfolio --private --source=. --remote=origin --push
```

Depois, importar o repositório em vercel.com. Quando o domínio existir, atualizar
`site` em `astro.config.mjs`.

---

## Definição de pronto

- [ ] `npm test` passa (27 testes)
- [ ] `npm run build` passa e gera 22 páginas (2 homes + 20 projetos)
- [ ] `npm run test:e2e` passa
- [ ] Remover um MDX de um idioma quebra o build com mensagem nomeando o slug
- [ ] As dez estações têm acento próprio visível no rótulo da persona
- [ ] O site é legível e navegável com JavaScript desligado
- [ ] Nenhum projeto da Pix Force aparece em qualquer arquivo de conteúdo

---

## Próximos planos

**Plano 2 — Motor WebGL e posters.** `lib/gl/renderer.ts` (contexto, quad em tela
cheia, uniforms), `lib/gl/station-manager.ts` (IntersectionObserver e crossfade de
600 ms), `scripts/render-posters.ts` (pré-renderização WebP no build), guarda de
FPS em celular, e o caminho de fallback sob `prefers-reduced-motion`. O primeiro
shader é o da abertura: mosaico de Bayer e demosaicing sobre o espécime.

**Plano 3 — Estações.** Um shader e uma mecânica por projeto, em ordem de valor:
VisionForge (réplicas com IC), VampireAI (replay de turno), UDA/OVD (slider de
neblina), depois as demais. Cada estação inclui a verificação de contraste do seu
acento nos dois modos, reusando o teste da Task 3.
