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
