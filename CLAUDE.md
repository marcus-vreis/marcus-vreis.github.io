# Invariantes do projeto

Este é o portfólio de Marcus Vinicius: um site estático Astro 7, bilíngue
(PT/EN), chamado **A Bancada** — cada projeto é uma máquina que vive num chão,
e o estado dela vem dos dados reais do GitHub. A spec é
`docs/superpowers/specs/2026-09-22-portfolio-bancada-design.md`. Antes de mudar
algo, confira se a mudança respeita o que segue — são decisões deliberadas, não
acidentes de implementação.

- **IDs de conteúdo são `<locale>/<slug>`.** Vêm de `generateId` em
  `src/content.config.ts`. `src/lib/projects.ts` (`slugOf`, `entriesFor`) é o
  único lugar que deve parsear esse formato; não reintroduza `id.split('/')[1]`
  em páginas ou componentes.
- **Nenhum texto de exibição fica hardcoded em componente ou página.** Todo
  texto visível vive em `src/lib/ui-strings.ts` (`UI`, por idioma). Se um texto
  novo aparecer na tela, ele entra ali primeiro.
- **Cores só vêm de dois lugares:** a paleta base em `src/lib/tokens.ts`, e o
  acento por projeto no frontmatter do MDX (`accent`, `accentLight`). Nunca
  hardcode um hex em CSS.
- **Todo acento precisa de `accent` (escuro) e `accentLight` (claro), e os dois
  precisam passar WCAG AA (4.5:1)** contra o fundo do modo correspondente.
  `tests/unit/project-accents.test.ts` cobre isso lendo os MDX de verdade — não
  mantenha uma lista paralela.
- **Paridade PT/EN é imposta no build.** `src/lib/parity.ts` quebra o build se
  um slug existir num idioma e não no outro, e também se a coleção vier vazia.
  Os campos `accent`, `accentLight`, `order`, `kind`, `status`, `github` e
  `character` precisam ser iguais entre PT e EN — o teste de frontmatter cobre.
- **O build nunca acessa a rede.** Os dados do GitHub vêm de
  `src/data/github-snapshot.json`, gravado por `npm run refresh:github` e
  atualizado todo dia por um Action. O "hoje" do humor é o `generatedAt` do
  instantâneo, nunca o relógio — o build é reproduzível. Projeto novo exige
  rodar a coleta; `tests/unit/snapshot-coverage.test.ts` avisa se esquecerem.
- **Humor é função pura.** `src/lib/mood.ts` cruza o `status` escrito no MDX
  com o instantâneo. Concluído não é abandonado: `concluido` vira "formado", e
  só projeto inacabado e parado dorme.
- **Os personagens são máquinas com rosto em tela. Nenhum é humanoide.** Decisão
  do dono; não proponha personagem humano, nem o vampirinho.
- **Projetos do empregador do dono do repositório nunca aparecem no site.** "Pix
  Force" só pode ser citada como nome do empregador no texto "Sobre" — não como
  projeto, não como máquina.
- **JavaScript é aprimoramento progressivo.** O site é completo e navegável sem
  ele, e o teto é de 70 kB de JS minificado no total (§9 da spec). Cada motor de
  animação pausa quando sai da tela.
