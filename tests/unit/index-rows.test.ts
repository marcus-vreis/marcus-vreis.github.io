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
    expect(buildIndexRows(all, snapshot, 'pt').rows[0].detail).toBe('último commit há 24 dias · v0.10.0');
  });

  it('sem versão, o detalhe é só o tempo', () => {
    const knn = buildIndexRows(all, snapshot, 'pt').rows[1];
    expect(knn.mood).toBe('formado');
    expect(knn.detail).toBe('último commit há 22 meses');
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
