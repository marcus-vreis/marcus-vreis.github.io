import { describe, expect, it } from 'vitest';
import { formatSince } from '../../src/lib/relative-time';

const CASES: [number, string, string][] = [
  [0, 'hoje', 'today'],
  [1, 'ontem', 'yesterday'],
  [24, 'há 24 dias', '24 days ago'],
  [59, 'há 59 dias', '59 days ago'],
  [60, 'há 2 meses', '2 months ago'],
  [107, 'há 3 meses', '3 months ago'],
  [672, 'há 22 meses', '22 months ago'],
  [800, 'há 2 anos', '2 years ago'],
];

describe('formatSince', () => {
  it.each(CASES)('%i dias em português', (days, pt) => {
    expect(formatSince(days, 'pt')).toBe(pt);
  });

  it.each(CASES)('%i dias em inglês', (days, _pt, en) => {
    expect(formatSince(days, 'en')).toBe(en);
  });
});
