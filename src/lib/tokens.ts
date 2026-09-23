export const MODES = ['dark', 'light'] as const;
export type Mode = (typeof MODES)[number];

export interface Palette {
  /** Fundo da página. */
  bg: string;
  /** Texto principal. */
  fg: string;
  /** Texto secundário e legendas. */
  muted: string;
  /** Acento do site (âmbar de instrumento). Cada projeto sobrescreve o seu
   *  no frontmatter do MDX (`accent`/`accentLight`). */
  accent: string;
  /** Filete decorativo usado como divisor entre linhas e seções. Não
   *  carrega informação. */
  rule: string;
}

export const PALETTE: Record<Mode, Palette> = {
  dark: {
    bg: '#0B0D0E',
    fg: '#E8E6E1',
    muted: '#9A9791',
    accent: '#F0A33C',
    rule: '#2A2D2F',
  },
  light: {
    bg: '#F4F2ED',
    fg: '#14161A',
    muted: '#5E5B55',
    // Âmbar escurecido: o #F0A33C do modo escuro só atinge 1,88 sobre papel.
    accent: '#9A5B00',
    rule: '#D6D2C8',
  },
};

/** Emite a paleta como bloco de custom properties CSS. */
export function paletteToCss(mode: Mode): string {
  const p = PALETTE[mode];
  return Object.entries(p)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(' ');
}
