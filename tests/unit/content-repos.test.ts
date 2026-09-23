import { describe, expect, it } from 'vitest';
import { githubFieldOf } from '../../src/lib/github/content-repos';

const mdx = (front: string, body = 'Texto.') => `---\n${front}\n---\n\n${body}\n`;

describe('githubFieldOf', () => {
  it('lê o valor entre aspas', () => {
    expect(githubFieldOf(mdx("title: X\ngithub: 'marcus-vreis/VisionForge'"))).toBe(
      'marcus-vreis/VisionForge',
    );
  });

  it('lê o valor sem aspas', () => {
    expect(githubFieldOf(mdx('github: marcus-vreis/ComputerVision-KNN'))).toBe(
      'marcus-vreis/ComputerVision-KNN',
    );
  });

  it('devolve null quando o campo não existe', () => {
    expect(githubFieldOf(mdx('title: Pesquisa\nkind: pesquisa'))).toBeNull();
  });

  it('ignora "github:" no corpo do texto', () => {
    expect(githubFieldOf(mdx('title: X', 'github: nao/conta'))).toBeNull();
  });

  it('aceita quebra de linha CRLF', () => {
    expect(githubFieldOf("---\r\ngithub: 'a/b'\r\n---\r\n\r\nTexto.\r\n")).toBe('a/b');
  });

  it('falha alto em arquivo sem frontmatter', () => {
    expect(() => githubFieldOf('Só texto.')).toThrow('frontmatter');
  });
});
