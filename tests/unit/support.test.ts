import { describe, expect, it } from 'vitest';
import { shouldAnimate } from '../../src/lib/gl/support';

const yes = () => true;
const no = () => false;

describe('shouldAnimate', () => {
  it('roda quando há WebGL2 e o movimento é permitido', () => {
    expect(shouldAnimate({ hasWebGL2: yes, prefersReducedMotion: no })).toBe(true);
  });

  it('não roda sem WebGL2', () => {
    expect(shouldAnimate({ hasWebGL2: no, prefersReducedMotion: no })).toBe(false);
  });

  it('não roda quando o visitante pediu menos movimento', () => {
    expect(shouldAnimate({ hasWebGL2: yes, prefersReducedMotion: yes })).toBe(false);
  });

  it('não roda quando falta os dois', () => {
    expect(shouldAnimate({ hasWebGL2: no, prefersReducedMotion: yes })).toBe(false);
  });

  it('nunca deixa uma exceção vazar — na dúvida, não anima', () => {
    const explode = () => {
      throw new Error('contexto negado');
    };
    expect(shouldAnimate({ hasWebGL2: explode, prefersReducedMotion: no })).toBe(false);
  });
});
