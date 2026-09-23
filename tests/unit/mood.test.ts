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
