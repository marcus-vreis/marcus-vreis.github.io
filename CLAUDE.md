# Invariantes do projeto

Este é o portfólio de Marcus Vinicius: um site estático Astro 7,
bilíngue (PT/EN), zero JavaScript de runtime. Antes de mudar algo,
confira se a mudança respeita o que segue — são decisões deliberadas,
não acidentes de implementação.

- **IDs de conteúdo são `<locale>/<slug>`.** Vêm de `generateId` em
  `src/content.config.ts`. `src/lib/projects.ts` (`slugOf`,
  `entriesFor`) é o único lugar que deve parsear esse formato; não
  reintroduza `id.split('/')[1]` em páginas ou componentes.
- **Nenhum texto de exibição fica hardcoded em componente ou página.**
  Todo texto visível vive em `src/lib/ui-strings.ts` (`UI`, por
  idioma). Se um texto novo aparecer na tela, ele entra ali primeiro.
- **Cores só vêm de dois lugares:** a paleta base em
  `src/lib/tokens.ts`, e o acento por projeto no frontmatter do MDX
  (`accent`, `accentLight`). Nunca hardcode um hex em CSS.
- **Todo acento precisa de `accent` (escuro) e `accentLight` (claro),
  e os dois precisam passar WCAG AA (4.5:1)** contra o fundo do modo
  correspondente. `tests/unit/project-accents.test.ts` cobre isso lendo
  os MDX de verdade — não mantenha uma lista paralela.
- **Paridade PT/EN é imposta no build.** `src/lib/parity.ts` quebra o
  build se um slug existir num idioma e não no outro, e também se a
  coleção vier vazia (indício de que o formato de id mudou). Uma
  tradução faltando não deve nunca ir para produção silenciosamente.
- **Projetos do empregador do dono do repositório nunca aparecem no
  site.** "Pix Force" só pode ser citada como nome do empregador no
  texto "Sobre" — não como projeto, não como estação.
- **O site não tem JavaScript de runtime.** Mantenha assim a menos que
  um plano explícito diga o contrário.
