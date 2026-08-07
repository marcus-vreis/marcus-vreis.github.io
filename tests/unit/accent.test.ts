import { describe, expect, it } from 'vitest';
import { hexToVec3 } from '../../src/lib/gl/accent';

describe('hexToVec3', () => {
  it('converte preto e branco nos extremos', () => {
    expect(hexToVec3('#000000')).toEqual([0, 0, 0]);
    expect(hexToVec3('#FFFFFF')).toEqual([1, 1, 1]);
  });

  it('normaliza cada canal para 0..1', () => {
    const [r, g, b] = hexToVec3('#6EE7A8');
    expect(r).toBeCloseTo(0x6e / 255, 6);
    expect(g).toBeCloseTo(0xe7 / 255, 6);
    expect(b).toBeCloseTo(0xa8 / 255, 6);
  });

  it('aceita minúsculas e maiúsculas', () => {
    expect(hexToVec3('#da464c')).toEqual(hexToVec3('#DA464C'));
  });
});
