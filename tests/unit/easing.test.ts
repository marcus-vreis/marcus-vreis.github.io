import { describe, expect, it } from 'vitest';
import { easeOutCubic, clamp01 } from '../../src/lib/gl/easing';

describe('clamp01', () => {
  it('prende nos extremos', () => {
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(7)).toBe(1);
    expect(clamp01(0.42)).toBeCloseTo(0.42, 6);
  });
});

describe('easeOutCubic', () => {
  it('fixa os extremos', () => {
    expect(easeOutCubic(0)).toBeCloseTo(0, 6);
    expect(easeOutCubic(1)).toBeCloseTo(1, 6);
  });

  it('desacelera no fim — passa da metade antes da metade do tempo', () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });

  it('é monotônica', () => {
    let previous = -1;
    for (let i = 0; i <= 20; i++) {
      const value = easeOutCubic(i / 20);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it('prende a entrada fora de [0,1]', () => {
    expect(easeOutCubic(-1)).toBeCloseTo(0, 6);
    expect(easeOutCubic(2)).toBeCloseTo(1, 6);
  });
});
