import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/projects',
    // Sem isto o id vira um slug kebab-case gerado por slugger. O resto do
    // código depende do formato `<locale>/<slug>`, então ele é fixado aqui.
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ''),
  }),
  schema: z.object({
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
    /** Ano ou intervalo, exibido como dado. */
    year: z.string(),
    /** Tecnologias exibidas como etiquetas. */
    stack: z.array(z.string()).min(1),
    /** Links externos. Ausente quando o repositório é privado. */
    repo: z.string().url().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  }),
});

export const collections = { projects };
