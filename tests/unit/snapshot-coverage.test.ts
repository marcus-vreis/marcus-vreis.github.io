import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { githubFieldOf } from '../../src/lib/github/content-repos';
import { parseSnapshot } from '../../src/lib/github/snapshot';

// Se alguém cadastra um projeto novo e esquece de rodar a coleta, isto falha
// antes do build — com a instrução de como consertar.
const CONTENT = join(process.cwd(), 'src/content/projects/pt');
const SNAPSHOT = join(process.cwd(), 'src/data/github-snapshot.json');

describe('instantâneo do GitHub commitado', () => {
  const snapshot = parseSnapshot(JSON.parse(readFileSync(SNAPSHOT, 'utf-8')));
  const files = readdirSync(CONTENT)
    .filter((file) => file.endsWith('.mdx'))
    .sort();

  for (const file of files) {
    const repo = githubFieldOf(readFileSync(join(CONTENT, file), 'utf-8'));
    if (repo === null) continue;

    it(`${file}: ${repo} está no instantâneo`, () => {
      expect(
        snapshot.repos[repo],
        `${repo} (de ${file}) não está em src/data/github-snapshot.json — rode: GITHUB_TOKEN=$(gh auth token) npm run refresh:github`,
      ).toBeDefined();
    });
  }
});
