import { describe, expect, it } from 'vitest';
import { createFpsGuard } from '../../src/lib/gl/fps-guard';

describe('createFpsGuard', () => {
  it('não reprova antes de ter amostras suficientes', () => {
    const guard = createFpsGuard({ sampleSize: 5, minFps: 30 });
    for (let i = 0; i < 4; i++) expect(guard.record(100)).toBe(true);
  });

  it('reprova quando a média fica abaixo do mínimo', () => {
    const guard = createFpsGuard({ sampleSize: 5, minFps: 30 });
    let ok = true;
    for (let i = 0; i < 5; i++) ok = guard.record(100); // 10 fps
    expect(ok).toBe(false);
  });

  it('aprova quando a média está acima do mínimo', () => {
    const guard = createFpsGuard({ sampleSize: 5, minFps: 30 });
    let ok = true;
    for (let i = 0; i < 5; i++) ok = guard.record(16); // ~62 fps
    expect(ok).toBe(true);
  });

  it('ignora quadros absurdos — aba em segundo plano não conta', () => {
    const guard = createFpsGuard({ sampleSize: 3, minFps: 30 });
    guard.record(16);
    guard.record(5000); // descartado
    guard.record(16);
    expect(guard.record(16)).toBe(true);
  });

  it('uma vez reprovado, continua reprovado', () => {
    const guard = createFpsGuard({ sampleSize: 2, minFps: 30 });
    guard.record(100);
    expect(guard.record(100)).toBe(false);
    expect(guard.record(1)).toBe(false);
  });
});
