import { describe, expect, it } from 'vitest';
import { planStations } from '../../src/lib/gl/station-manager';

const S = ['a', 'b', 'c', 'd', 'e'];

describe('planStations', () => {
  it('monta a visível e a seguinte', () => {
    expect(planStations(S, 'b')).toEqual({ mount: ['b', 'c'], dispose: [] });
  });

  it('na última, não inventa uma seguinte', () => {
    expect(planStations(S, 'e')).toEqual({ mount: ['e'], dispose: [] });
  });

  it('descarta o que ficou para trás', () => {
    expect(planStations(S, 'd', ['a', 'b', 'd'])).toEqual({
      mount: ['e'],
      dispose: ['a', 'b'],
    });
  });

  it('não remonta o que já está montado', () => {
    expect(planStations(S, 'b', ['b', 'c'])).toEqual({ mount: [], dispose: [] });
  });

  it('sem estação ativa, descarta tudo', () => {
    expect(planStations(S, null, ['a', 'b'])).toEqual({
      mount: [],
      dispose: ['a', 'b'],
    });
  });

  it('ignora slug desconhecido', () => {
    expect(planStations(S, 'z')).toEqual({ mount: [], dispose: [] });
  });
});
