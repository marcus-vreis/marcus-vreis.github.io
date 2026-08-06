import { describe, expect, it } from 'vitest';
import { entriesFor, slugOf } from '../../src/lib/projects';

describe('slugOf', () => {
  it('extrai o slug de um id bem formado', () => {
    expect(slugOf('pt/visionforge')).toBe('visionforge');
  });

  it('lança se faltar o segmento de idioma', () => {
    expect(() => slugOf('visionforge')).toThrow('id fora do formato <locale>/<slug>');
  });

  it('lança se o id for mais profundo que <locale>/<slug>', () => {
    expect(() => slugOf('pt/a/b')).toThrow('id fora do formato <locale>/<slug>');
  });
});

describe('entriesFor', () => {
  it('filtra por idioma e ordena por order', () => {
    const all = [
      { id: 'en/a', data: { order: 2 } },
      { id: 'pt/b', data: { order: 1 } },
      { id: 'pt/a', data: { order: 2 } },
      { id: 'en/b', data: { order: 1 } },
    ];
    expect(entriesFor(all, 'pt').map((e) => e.id)).toEqual(['pt/b', 'pt/a']);
    expect(entriesFor(all, 'en').map((e) => e.id)).toEqual(['en/b', 'en/a']);
  });
});
