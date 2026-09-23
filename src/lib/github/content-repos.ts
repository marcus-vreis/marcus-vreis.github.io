/**
 * Lê o campo `github` do frontmatter de um MDX, sem parser YAML: nestes
 * arquivos ele é sempre uma linha `github: 'owner/nome'`. Devolve `null`
 * quando o campo não existe — a pesquisa de mestrado, por exemplo.
 */
export function githubFieldOf(mdxSource: string): string | null {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(mdxSource);
  if (!frontmatter) throw new Error('MDX sem frontmatter');
  const line = /^github:\s*['"]?([\w.-]+\/[\w.-]+)['"]?\s*$/m.exec(frontmatter[1]);
  return line ? line[1] : null;
}
