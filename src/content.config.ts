import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { KINDS } from './lib/projects';
import { STATUSES } from './lib/mood';

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/projects',
    // Sem isto o id vira um slug kebab-case gerado por slugger. O resto do
    // código depende do formato `<locale>/<slug>`, então ele é fixado aqui.
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ''),
  }),
  schema: ({ image }) =>
    z
      .object({
        /** Nome do projeto como aparece no título da estação. */
        title: z.string(),
        /** O apelido da estação: "O Instrumento", "O Nevoeiro". */
        persona: z.string(),
        /** Uma linha que resume o projeto. */
        tagline: z.string(),
        /** Cor de acento da estação no modo escuro, hex de 6 dígitos. */
        accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        /** Acento no modo claro. Separado porque uma cor que passa AA sobre
         *  grafite quase nunca passa sobre papel. */
        accentLight: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        /** Posição no trilho, crescente. */
        order: z.number().int().positive(),
        /** `projeto` vira máquina e linha do índice; `pesquisa` vai para o "Sobre". */
        kind: z.enum(KINDS),
        /** O que o tempo parado significa — §5.3 da spec. Obrigatório em projeto. */
        status: z.enum(STATUSES).optional(),
        /** `owner/nome` no GitHub: a chave do instantâneo. Separado de `repo`,
         *  que é link público e não existe em repositório privado. */
        github: z.string().regex(/^[\w.-]+\/[\w.-]+$/).optional(),
        /** Id do sprite da máquina que representa o projeto. */
        character: z.string().regex(/^[a-z-]+$/).optional(),
        /** Ano ou intervalo, exibido como dado. */
        year: z.string(),
        /** Tecnologias exibidas como etiquetas. */
        stack: z.array(z.string()).min(1),
        /** Links externos. Ausente quando o repositório é privado. */
        repo: z.string().url().optional(),
        links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
        /** Capa da estação. Opcional — a maioria dos projetos ainda não tem
         *  uma imagem utilizável. Validada e otimizada pelo pipeline de
         *  assets do Astro. */
        cover: image().optional(),
        /** Texto alternativo da capa. Obrigatório sempre que `cover`
         *  estiver presente — ver `.refine` abaixo. */
        coverAlt: z.string().optional(),
        /** Segunda imagem opcional, renderizada mais abaixo na página
         *  profunda do projeto (depois da prosa). Genérico: qualquer
         *  projeto pode usá-lo, não só o que tem hoje. */
        detailImage: image().optional(),
        /** Texto alternativo da segunda imagem. Obrigatório sempre que
         *  `detailImage` estiver presente. */
        detailImageAlt: z.string().optional(),
      })
      .refine((data) => !data.cover || Boolean(data.coverAlt), {
        message:
          'coverAlt é obrigatório sempre que cover estiver definido — uma imagem sem texto alternativo é um defeito de acessibilidade. Adicione coverAlt ao frontmatter deste MDX.',
        path: ['coverAlt'],
      })
      .refine((data) => !data.detailImage || Boolean(data.detailImageAlt), {
        message:
          'detailImageAlt é obrigatório sempre que detailImage estiver definido — adicione detailImageAlt ao frontmatter deste MDX.',
        path: ['detailImageAlt'],
      })
      .refine(
        (data) =>
          data.kind !== 'projeto' ||
          (Boolean(data.status) && Boolean(data.github) && Boolean(data.character)),
        {
          message:
            'Todo projeto (kind: projeto) precisa de status, github e character no frontmatter.',
          path: ['kind'],
        },
      ),
});

export const collections = { projects };
