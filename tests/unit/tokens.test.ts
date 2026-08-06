import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../../src/lib/contrast';
import { MODES, PALETTE } from '../../src/lib/tokens';

describe('paleta base', () => {
  for (const mode of MODES) {
    const { bg, fg, muted, accent } = PALETTE[mode];

    it(`${mode}: texto principal atinge 7:1`, () => {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(7);
    });

    it(`${mode}: texto secundário atinge AA (4.5:1)`, () => {
      expect(contrastRatio(muted, bg)).toBeGreaterThanOrEqual(4.5);
    });

    it(`${mode}: acento atinge AA (4.5:1)`, () => {
      expect(contrastRatio(accent, bg)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it('o acento do modo escuro reprovaria no modo claro', () => {
    // Documenta por que o acento é definido por modo em vez de ser único.
    expect(contrastRatio(PALETTE.dark.accent, PALETTE.light.bg)).toBeLessThan(4.5);
  });
});
