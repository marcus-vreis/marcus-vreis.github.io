# Invariantes do projeto

Este é o portfólio de Marcus Vinicius Diniz dos Reis: um site estático Astro 7,
bilíngue (PT/EN), desenhado como **Caderno de Engenharia & Instrumentos** —
cada projeto público do GitHub é documentado como uma ficha técnica com
esquemático arquitetural vetorial, invariante de engenharia e estado operacional
calculado dos dados reais do GitHub. Antes de mudar algo, confira se a mudança
respeita o que segue — são decisões deliberadas, não acidentes de implementação.

- **IDs de conteúdo são `<locale>/<slug>`.** Vêm de `generateId` em
  `src/content.config.ts`. `src/lib/projects.ts` (`slugOf`, `entriesFor`) é o
  único lugar que deve parsear esse formato; não reintroduza `id.split('/')[1]`
  em páginas ou componentes.
- **Nenhum texto de exibição fica hardcoded em componente ou página.** Todo
  texto visível vive em `src/lib/ui-strings.ts` (`UI`, por idioma) ou no
  frontmatter/corpo dos MDX. Se um texto novo aparecer na tela (incluindo
  rótulos de esquemáticos, publicações, prêmios ou telemetria), ele entra ali
  primeiro.
- **Cores só vêm de dois lugares:** a paleta base em `src/lib/tokens.ts`, e o
  acento por projeto no frontmatter do MDX (`accent`, `accentLight`). Nunca
  hardcode um hex em CSS ou SVG de componente.
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
- **Todo projeto e pesquisa tem um esquemático vetorial em `Schematic.astro`.**
  O campo `character` do frontmatter seleciona o diagrama arquitetural e a
  costura matemática correspondente em `UI[locale].schematics`. Sem bonequinho
  de palito e sem arte que dependa de captura ausente.
- **Apenas repositórios públicos de autoria própria entram no índice.** Projetos
  do empregador nunca aparecem no site: "Pix Force" só é citada como
  empregadora no "Sobre" e na linha do tempo profissional.
- **JavaScript é aprimoramento progressivo.** O site é completo e navegável sem
  ele (abas de costuras no hero e filtros de estado no índice degradam para HTML
  semântico), e o teto é de 70 kB de JS minificado no total.
