import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseInlineLinks, UI, type CharacterId } from '../../src/lib/ui-strings';

const PROJECTS_DIR = join(process.cwd(), 'src/content/projects/pt');

function extractCharacter(filePath: string): string | null {
  const raw = readFileSync(filePath, 'utf-8');
  const match = /^character:\s*['"]?([a-z-]+)['"]?\s*$/m.exec(raw);
  return match ? match[1] : null;
}

describe('UI strings & schematics parity', () => {
  it('PT e EN possuem o mesmo conjunto de chaves de esquemático', () => {
    expect(Object.keys(UI.en.schematics).sort()).toEqual(
      Object.keys(UI.pt.schematics).sort(),
    );
  });

  it('PT e EN possuem a mesma quantidade de itens em todas as seções do dossiê', () => {
    expect(UI.en.intro).toHaveLength(UI.pt.intro.length);
    expect(UI.en.researchAreas).toHaveLength(UI.pt.researchAreas.length);
    expect(UI.en.pillars).toHaveLength(UI.pt.pillars.length);
    expect(UI.en.publications).toHaveLength(UI.pt.publications.length);
    expect(UI.en.trajectory).toHaveLength(UI.pt.trajectory.length);
    expect(UI.en.bioFields).toHaveLength(UI.pt.bioFields.length);
    expect(UI.en.indicators).toHaveLength(UI.pt.indicators.length);
    expect(UI.en.experience).toHaveLength(UI.pt.experience.length);
    expect(UI.en.education).toHaveLength(UI.pt.education.length);
    expect(UI.en.academicProjects).toHaveLength(UI.pt.academicProjects.length);
    expect(UI.en.awards).toHaveLength(UI.pt.awards.length);
    expect(UI.en.events).toHaveLength(UI.pt.events.length);
    expect(UI.en.skillGroups).toHaveLength(UI.pt.skillGroups.length);
    expect(UI.en.languages).toHaveLength(UI.pt.languages.length);
    expect(UI.en.contact).toHaveLength(UI.pt.contact.length);
  });

  it('todas as publicações possuem DOI e link direto para o artigo', () => {
    for (const locale of ['pt', 'en'] as const) {
      for (const pub of UI[locale].publications) {
        expect(pub.doi).toMatch(/^10\.\d{4,9}\//);
        expect(pub.href).toMatch(/^https:\/\/doi\.org\/10\./);
      }
    }
  });

  it('parseInlineLinks extrai links internos e externos preservando o texto ao redor', () => {
    const parsed = parseInlineLinks(
      'Estudo na [UFSCar](https://www.ppgcc.dc.ufscar.br/) sobre o [VisionForge](/projeto/visionforge).',
    );
    expect(parsed).toEqual([
      { text: 'Estudo na ' },
      { text: 'UFSCar', href: 'https://www.ppgcc.dc.ufscar.br/', external: true },
      { text: ' sobre o ' },
      { text: 'VisionForge', href: '/projeto/visionforge', external: false },
      { text: '.' },
    ]);
  });

  for (const file of readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.mdx')).sort()) {
    it(`${file}: character aponta para um esquemático definido em PT e EN`, () => {
      const ch = extractCharacter(join(PROJECTS_DIR, file));
      expect(ch, `${file} sem campo character`).not.toBeNull();
      const key = ch as CharacterId;
      expect(UI.pt.schematics[key]).toBeDefined();
      expect(UI.en.schematics[key]).toBeDefined();
      expect(UI.pt.schematics[key].stages).toHaveLength(3);
      expect(UI.en.schematics[key].stages).toHaveLength(3);
    });
  }
});
