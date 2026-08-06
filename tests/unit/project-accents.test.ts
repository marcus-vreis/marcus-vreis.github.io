import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { contrastRatio } from '../../src/lib/contrast';
import { PALETTE } from '../../src/lib/tokens';

// Os acentos vivem no frontmatter dos MDX, não em TypeScript. Este teste lê
// os arquivos de verdade em vez de uma lista hardcoded, para nunca divergir
// do que é publicado e para cobrir automaticamente um 11º projeto.
const PROJECTS_DIR = join(process.cwd(), 'src/content/projects');
const LOCALES = ['pt', 'en'] as const;
type Locale = (typeof LOCALES)[number];

interface Accents {
  accent: string;
  accentLight: string;
}

/**
 * Extrai `accent` e `accentLight` do frontmatter YAML de um MDX sem
 * depender de um parser YAML: nestes arquivos os dois campos são sempre
 * uma linha simples `chave: 'valor'`.
 */
function readAccents(filePath: string): Accents {
  const raw = readFileSync(filePath, 'utf-8');
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!frontmatter) {
    throw new Error(`Frontmatter não encontrado em ${filePath}`);
  }
  const body = frontmatter[1];

  const extract = (key: string): string => {
    const line = new RegExp(`^${key}:\\s*['"]?(#[0-9A-Fa-f]{6})['"]?\\s*$`, 'm').exec(body);
    if (!line) {
      throw new Error(`Campo "${key}" ausente ou mal formatado em ${filePath}`);
    }
    return line[1];
  };

  return { accent: extract('accent'), accentLight: extract('accentLight') };
}

function listSlugs(locale: Locale): string[] {
  return readdirSync(join(PROJECTS_DIR, locale))
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''))
    .sort();
}

describe('acentos por projeto atingem AA nos dois modos', () => {
  for (const locale of LOCALES) {
    for (const slug of listSlugs(locale)) {
      const filePath = join(PROJECTS_DIR, locale, `${slug}.mdx`);
      const { accent, accentLight } = readAccents(filePath);
      const relPath = `src/content/projects/${locale}/${slug}.mdx`;

      it(`${locale}/${slug}: accent (modo escuro) atinge 4.5:1 sobre --bg escuro`, () => {
        const ratio = contrastRatio(accent, PALETTE.dark.bg);
        expect(
          ratio,
          `${relPath}: accent ${accent} sobre ${PALETTE.dark.bg} (dark bg) = ${ratio.toFixed(2)}:1, abaixo do mínimo AA de 4.5:1`,
        ).toBeGreaterThanOrEqual(4.5);
      });

      it(`${locale}/${slug}: accentLight (modo claro) atinge 4.5:1 sobre --bg claro`, () => {
        const ratio = contrastRatio(accentLight, PALETTE.light.bg);
        expect(
          ratio,
          `${relPath}: accentLight ${accentLight} sobre ${PALETTE.light.bg} (light bg) = ${ratio.toFixed(2)}:1, abaixo do mínimo AA de 4.5:1`,
        ).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  for (const slug of listSlugs('pt')) {
    it(`${slug}: PT e EN declaram o mesmo par de acentos`, () => {
      const ptPath = join(PROJECTS_DIR, 'pt', `${slug}.mdx`);
      const enPath = join(PROJECTS_DIR, 'en', `${slug}.mdx`);
      const pt = readAccents(ptPath);
      const en = readAccents(enPath);
      expect(
        en,
        `${slug}: en/${slug}.mdx (${JSON.stringify(en)}) diverge de pt/${slug}.mdx (${JSON.stringify(pt)})`,
      ).toEqual(pt);
    });
  }
});
