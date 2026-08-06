import { describe, expect, it } from 'vitest';
import { buildPath, parsePath, switchLocale } from '../../src/lib/i18n';

describe('parsePath', () => {
  it('trata a raiz como home em português', () => {
    expect(parsePath('/')).toEqual({ locale: 'pt', route: { kind: 'home' } });
  });

  it('reconhece o prefixo en', () => {
    expect(parsePath('/en/')).toEqual({ locale: 'en', route: { kind: 'home' } });
  });

  it('extrai o slug do projeto em português', () => {
    expect(parsePath('/projeto/visionforge')).toEqual({
      locale: 'pt',
      route: { kind: 'project', slug: 'visionforge' },
    });
  });

  it('extrai o slug do projeto em inglês', () => {
    expect(parsePath('/en/project/visionforge')).toEqual({
      locale: 'en',
      route: { kind: 'project', slug: 'visionforge' },
    });
  });

  it('ignora barra final', () => {
    expect(parsePath('/projeto/vampireai/')).toEqual({
      locale: 'pt',
      route: { kind: 'project', slug: 'vampireai' },
    });
  });

  it('cai em home quando o segmento não bate com o idioma', () => {
    expect(parsePath('/project/visionforge')).toEqual({
      locale: 'pt',
      route: { kind: 'home' },
    });
  });
});

describe('buildPath', () => {
  it('não prefixa o idioma padrão', () => {
    expect(buildPath({ kind: 'home' }, 'pt')).toBe('/');
    expect(buildPath({ kind: 'project', slug: 'imagelab' }, 'pt')).toBe('/projeto/imagelab');
  });

  it('prefixa e traduz o segmento em inglês', () => {
    expect(buildPath({ kind: 'home' }, 'en')).toBe('/en/');
    expect(buildPath({ kind: 'project', slug: 'imagelab' }, 'en')).toBe('/en/project/imagelab');
  });
});

describe('switchLocale', () => {
  it('preserva o projeto ao trocar de idioma', () => {
    expect(switchLocale('/projeto/uda-ovd', 'en')).toBe('/en/project/uda-ovd');
    expect(switchLocale('/en/project/uda-ovd', 'pt')).toBe('/projeto/uda-ovd');
  });

  it('é idempotente para o mesmo idioma', () => {
    expect(switchLocale('/projeto/coffeebean', 'pt')).toBe('/projeto/coffeebean');
  });
});
