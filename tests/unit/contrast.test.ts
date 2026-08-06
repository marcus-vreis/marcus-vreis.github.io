import { describe, expect, it } from 'vitest';
import { contrastRatio, relativeLuminance } from '../../src/lib/contrast';

describe('relativeLuminance', () => {
  it('devolve 0 para preto e 1 para branco', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('rejeita hex inválido', () => {
    expect(() => relativeLuminance('#GGG')).toThrow('Hex inválido');
  });
});

describe('contrastRatio', () => {
  it('devolve 21 para preto contra branco', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 2);
  });

  it('é simétrico', () => {
    expect(contrastRatio('#F0A33C', '#0B0D0E')).toBeCloseTo(
      contrastRatio('#0B0D0E', '#F0A33C'),
      6,
    );
  });

  it('devolve 1 para a mesma cor', () => {
    expect(contrastRatio('#123456', '#123456')).toBeCloseTo(1, 6);
  });
});
