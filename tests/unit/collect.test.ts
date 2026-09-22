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
