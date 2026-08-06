import { describe, expect, it } from 'vitest';
import { assertParity, findParityErrors } from '../../src/lib/parity';

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

describe('assertParity', () => {
  it('lança quando as duas coleções estão vazias', () => {
    expect(() => assertParity([], [])).toThrow('Coleção de projetos vazia');
  });

  it('não lança para um par normal com paridade', () => {
    expect(() => assertParity(['a', 'b'], ['a', 'b'])).not.toThrow();
  });
});
