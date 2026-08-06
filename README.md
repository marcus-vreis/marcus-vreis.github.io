# Portfolio

Portfólio de Marcus Vinicius, apresentado como um banco óptico: cada
projeto é uma estação percorrida em ordem por um trilho de navegação
sticky. Bilíngue (PT/EN), com paridade de conteúdo imposta no build.

## Stack

- [Astro 7](https://astro.build), `output: 'static'` — HTML puro, sem
  runtime JavaScript.
- Conteúdo dos projetos em MDX (`src/content/projects/{pt,en}/`).
- Fontes self-hosted via `@fontsource`; tokens de cor em
  `src/lib/tokens.ts`, com acento por projeto declarado no frontmatter.
- Testes unitários com [Vitest](https://vitest.dev), testes end-to-end
  com [Playwright](https://playwright.dev).

## Comandos

| Comando            | Ação                                              |
| :------------------ | :------------------------------------------------ |
| `npm run dev`        | Inicia o servidor de desenvolvimento             |
| `npm run build`       | Gera o site estático em `./dist/`                |
| `npm run preview`      | Serve o build de produção localmente             |
| `npm test`            | Roda os testes unitários (Vitest)                |
| `npm run test:e2e`     | Roda os testes end-to-end (Playwright)           |
| `npm run check`        | Type-checa o projeto, incluindo arquivos `.astro` |

Veja `CLAUDE.md` para os invariantes do projeto.
