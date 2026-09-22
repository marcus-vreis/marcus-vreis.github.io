# Portfólio — A Bancada

**Data:** 2026-09-22
**Autor:** Marcus Vinicius (`marcus-vreis`)
**Status:** Aprovado para planejamento
**Substitui:** `2026-08-06-portfolio-design.md` (Banco Óptico)

---

## 1. Por que um redesign

O Banco Óptico ficou tecnicamente sólido e visualmente vazio. Nas palavras do
dono, olhando o site rodando: *"são os títulos dos projetos espaçados, clica na
estação e tem uma descrição — mas e aí?"*. A rolagem de estações lia como índice,
não como portfólio, e o conceito de "cada projeto processa a página" dependia de
imagens que oito dos dez projetos não tinham.

A Bancada troca a metáfora: **os projetos viram máquinas pequenas que vivem num
chão, fazendo o que cada projeto faz**, e o único humano no chão é quem construiu
todas elas. O estado de cada máquina vem dos dados reais do GitHub — o quanto ela
trabalha, dorme ou se formou reflete o repositório de verdade.

A tese do site continua a mesma: **"Construo instrumentos para ver."** As
máquinas são os instrumentos.

## 2. Decisões fechadas

Tomadas pelo dono durante o brainstorming, em 2026-09-22. Não reabrir.

| Decisão | Escolha |
|---|---|
| Relação personagens × site | **Palco + moradores.** O site segue refinado e escuro; as máquinas vivem num chão, em cima do layout. |
| Tempo parado | **Concluído ≠ abandonado.** Projeto terminado se forma; só projeto inacabado e parado dorme. |
| Estrutura | **O chão é o índice.** Hero, chão com as máquinas, índice compacto sincronizado. Sem rolagem de estações. |
| Personagens | **Máquinas com rosto em tela.** Nada humanoide, exceto o próprio autor. |
| Hero | **Metade foto, metade quadrados de luz brancos**, com as restrições da §6. |
| Abrir projeto | **No lugar**, sem trocar de documento; a URL muda de verdade. |

Restrições herdadas que continuam valendo: bilíngue PT/EN com paridade imposta no
build; nenhum projeto da Pix Force no site, e a empresa aparece só como
empregadora no "Sobre"; contraste AA verificado por teste; conteúdo em MDX.

## 3. A página

```
┌───────────────────────────────────────────┐
│ HERO — palco escuro                       │
│  Marcus Vinicius          ┌──────────┐    │
│  Construo instrumentos    │ foto  ▦▦ │    │
│  para ver.                │ 60%  ▦ ▦ │    │
│                           └──────────┘    │
├───────────────────────────────────────────┤
│ O CHÃO                                    │
│  ◉·°   [≡]   ⌂☁  🎓▭   ⚙→   👤   ...     │
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │
├───────────────────────────────────────────┤
│ ÍNDICE                                    │
│  VisionForge   a todo vapor  v0.10   24d  │
│  VampireAI     ativo                 20d  │
│  AirWatch      formado          há 3 meses│
│  ...                                      │
├───────────────────────────────────────────┤
│ SOBRE · PESQUISA · CONTATO                │
└───────────────────────────────────────────┘
```

**O hero é sempre um palco escuro**, nos dois modos de cor. Ele é uma tela; o
resto da página segue o modo do sistema. Isso mantém o efeito de luz legível sem
uma segunda versão para papel, e dá à página um cabeçalho de revista.

**O índice é a interface acessível.** Cada linha nomeia o projeto, o estado em
palavras e o dado que justifica o estado. Passar o mouse ou o foco numa linha faz
a máquina correspondente reagir no chão, e vice-versa. Clicar em qualquer um dos
dois abre o projeto.

**A pesquisa de mestrado não vira máquina** — não tem repositório nem dado. Ela
vive em "Sobre", numa seção de pesquisa, e abre o mesmo painel dos projetos.

## 4. O elenco

### 4.1 Regras da família

- **48×48 px**, base alinhada numa linha de chão comum.
- **O rosto é sempre uma tela ou mostrador.** A expressão muda porque a tela muda.
  É o que amarra os nove no tema, e é o jeito barato de mostrar humor.
- Contorno escuro único, dois ou três tons por material, zero antialias — o molde
  do `gerador.py` do vampirinho.
- O `accent` do projeto pinta **um material só** de cada máquina. Nove matizes, uma
  família.
- `idle` é respiro, nunca parado: ventoinha girando, LED piscando, oscilação de
  quem flutua.
- Animações mínimas por máquina: `idle`, `walk` (ou flutuar, ou rodar),
  `action` (a ação-assinatura), `react` (hover, foco, clique). Todas voltam para
  `idle`, como no contrato do `crawd-vampiro/DESIGN.md`.

### 4.2 As máquinas

| Projeto | Máquina | Ação-assinatura |
|---|---|---|
| VisionForge | **Lente flutuante** — íris de diafragma, esferas de vidro em órbita, sem pés | As esferas se alinham e uma retícula varre a cena. Na série 0.x, **uma esfera por versão menor** (v0.10.0 → 10), teto de 12; a partir da 1.0, órbita cheia de 12. |
| VampireAI | **Fliperama-caixão** — gabinete estreito, rosto na tela, presas na moldura, capinha | Joga sozinho; cartas passam na tela. |
| AirWatch | **Estação meteorológica** — conchas de anemômetro, barômetro | As conchas giram e ela dispara pacotinhos de dados para os vizinhos. |
| ImageLab | **Scanner de mesa** — tampa de vidro, barra de luz | A barra varre e a tela alterna filtros: borda, limiar, Fourier. |
| CoffeeBean | **Cafeteira** — filtro em cima, caneca embaixo | Passa o café; a tela separa grãos em duas canecas. |
| KNN | **Plotter** — tela de dispersão, três antenas | As antenas apontam para os 3 vizinhos mais próximos no chão e ela adota a cor da maioria. k-NN literal. |
| Sorting-Hub | **Esteira com garra** | Blocos de alturas diferentes passam; a garra troca os que estão fora de ordem. |
| VoleiArena | **Lançadora de bolas** sobre rodinhas | Cospe a bola num vizinho, que devolve. |
| RVH Construtora | **Betoneira** de capacete | Assenta tijolo; uma mureta cresce ao lado dela. |

### 4.3 O autor

O **mini-Marcus** é o único humanoide no chão, por regra: as máquinas são os
projetos, o humano é quem fez todas elas. Ele anda entre elas e **passa mais tempo
perto de quem teve mais commit nos últimos 90 dias** — hoje moraria no VisionForge.
De vez em quando para numa máquina e faz manutenção: abre um painel, gira um
mostrador, tira a poeira de quem está dormindo. Ao escolher a próxima máquina a
visitar, a chance de cada uma é proporcional a `commits90d + 1` — o `+ 1` garante
que as formadas também recebem visita. Clicar nele **rola a página até a seção
"Sobre"**; ele não abre painel, porque o painel é de projeto.

Até a fotografia existir, ele é genérico. Quando ela existir, cabelo, óculos e cor
de roupa são tirados dela — o mesmo rosto em 48×48 no chão e em alta resolução no
hero.

### 4.4 O vampirinho

A arte existente em `vampirinho-sprite/` é humanoide, e por isso **não mora no
chão**. Ela aparece **dentro do painel do VampireAI**, como o personagem do jogo na
tela do fliperama. A arte vira conteúdo, não morador.

### 4.5 Sobreposições compartilhadas

Desenhadas uma vez e aplicadas a qualquer máquina, para não multiplicar arte:
capelo, zZ, poeira, faísca, selo de versão, estrelinha em órbita.

## 5. Dados → humor

### 5.1 O que se coleta

Para cada projeto com campo `github` (`owner/nome`):

| Campo | Fonte | Observação |
|---|---|---|
| `lastCommitAt` | **Máximo** do último commit entre todas as branches | O `pushed_at` engana: o VampireAI tem push recente em branch e zero commit na principal em 90 dias. |
| `commits90d` | Commits na branch padrão nos últimos 90 dias | |
| `latestTag` | Tag mais recente | Só o VisionForge tem hoje (`v0.10.0`). |
| `stars` | `stargazers_count` | |

Repositórios privados (VoleiArena, RVH) exigem token com leitura de repositório.
Só datas e contagens saem dele; nenhum código.

### 5.2 Instantâneo, não chamada no build

Um script `scripts/refresh-github.mjs` busca os dados e grava
`src/data/github-snapshot.json`, que **é commitado**. O build lê esse arquivo e
**nunca acessa a rede** — nunca quebra por API fora do ar, limite de taxa ou token
expirado.

Um GitHub Action roda o script **uma vez por dia**. Se o instantâneo mudou, ele
commita e empurra; o deploy segue do push. Ninguém precisa lembrar de nada.

### 5.3 O status

Novo campo no frontmatter: `status: ativo | pausado | concluido`. O dado diz
*quanto tempo*; o status diz *o que isso significa*. Proposta inicial, a confirmar
na revisão desta spec:

| Projeto | Status proposto | Por quê |
|---|---|---|
| VisionForge | ativo | 100+ commits em 90 dias |
| VampireAI | ativo | commit em branch há 20 dias |
| RVH Construtora | ativo | manutenção recente para cliente |
| VoleiArena | ativo | 5 commits em 90 dias |
| AirWatch | concluido | trabalho de disciplina (SIN 142, UFV) |
| ImageLab | concluido | trabalho de disciplina (SIN 392, UFV) |
| CoffeeBean | concluido | trabalho de disciplina (SIN 393, UFV) |
| KNN | concluido | trabalho acadêmico |
| Sorting-Hub | concluido | repositório de fundamentos |

### 5.4 A regra

Função pura em `src/lib/mood.ts`: `(status, snapshot, hoje) → humor`.

**O dado corrige o status.** `ativo` sem commit há mais de 180 dias é tratado
como `pausado`, e o build emite um aviso pedindo para atualizar o MDX.

| Humor | Condição |
|---|---|
| **formado** | `concluido`, qualquer idade |
| **a todo vapor** | `ativo` e `commits90d ≥ 30` |
| **ativo** | `ativo` e `commits90d < 30` |
| **bocejando** | `pausado`, menos de 90 dias |
| **cochilando** | `pausado`, de 90 a 180 dias |
| **dormindo** | `pausado`, mais de 180 dias |

| Humor | Comportamento | Sobreposição |
|---|---|---|
| formado | idle sereno, pose orgulhosa de vez em quando | capelo |
| a todo vapor | mais rápida, ação-assinatura frequente | faísca |
| ativo | comportamento base | — |
| bocejando | pausa mais, boceja na tela | — |
| cochilando | senta e cochila | zZ |
| dormindo | dorme enrolada, quase não se move | zZ, poeira |

Independentes do humor: **selo de versão** acima da cabeça quando há `latestTag`,
e **uma estrelinha orbitando por estrela** do GitHub, com teto de 5.

## 6. O hero

### 6.1 Composição

A foto ocupa cerca de **60%** do quadro. O resto é a mesma foto **dissolvida em
quadrados de luz brancos** que fluem para longe dela.

Três regras que separam isso do clichê de ciborgue:

1. **O quadrado tem o tamanho exato do pixel das máquinas, na mesma grade.** Uma
   constante única, `PIXEL`, governa os dois: é a escala do chão, 3 px no desktop
   e 2 px abaixo de 640 px. Você se desfaz nos mesmos pixels de
   que o chão é feito. Quadrado de tamanho arbitrário vira dispersão genérica.
2. **A fronteira não corta o rosto ao meio.** Ela corre na diagonal a partir de um
   lado e deixa os olhos inteiros. A borda é serrilhada por uma matriz de Bayer —
   dither de verdade, não degradê suave.
3. **Os quadrados se comportam como dado.** Fluem, se alinham à grade e quantizam
   brilho. Nada de faísca subindo como partícula de RPG.

### 6.2 Interação

O mouse **empurra a fronteira**: onde ele aponta, os quadrados condensam e viram
foto; quando sai, voltam a se dissolver. Sem cursor (toque), a fronteira respira
sozinha, devagar, e o toque arrastado faz o mesmo que o mouse.

Ao carregar, a imagem começa toda dissolvida e condensa na composição 60/40 em
cerca de 1,6 s.

### 6.3 Técnica

WebGL2, reaproveitando `src/lib/gl/renderer.ts`. A foto é amostrada uma vez numa
grade de células de tamanho `PIXEL`; cada célula vira um ponto com posição de
repouso e cor. O vertex shader aplica ruído de fluxo e a influência do cursor; o
fragment shader desenha quadrados sem suavização, com mistura aditiva.

**Sem WebGL2 ou com `prefers-reduced-motion`:** a foto com uma máscara CSS de
dither no lado dissolvido. Estática, sem JavaScript, e ainda com a composição.

Até a foto existir, o bonequinho de palito segura o lugar.

## 7. Abrir um projeto

### 7.1 A sequência

1. Clique na máquina ou na linha do índice.
2. A máquina reage: para o que está fazendo, vira para a frente, dá um pulinho.
3. O painel **cresce a partir do retângulo da máquina** até virar o cartão do
   projeto — animação FLIP com a Web Animations API, sem depender de View
   Transitions.
4. A máquina aparece num canto do painel, continuando a ação dela.

O painel mostra capa, texto, links e a **linha de dados em linguagem de dado**:
*último commit há 24 dias · v0.10.0 · 100 commits em 90 dias*.

Fecha com Esc, clique fora ou botão voltar, e encolhe de volta para dentro da
máquina.

### 7.2 Endereço

Abrir faz `pushState` para `/projeto/<slug>` (`/en/project/<slug>` em inglês).
**Carregar esse endereço direto entrega a mesma home, com o painel já aberto** —
não é outra página, é o mesmo lugar em outro estado. `popstate` abre e fecha.

### 7.3 Semântica

O painel é um `<dialog>` aberto com `showModal()`: fundo inerte, foco no título ao
abrir, foco devolvido à linha do índice ao fechar. Sob `prefers-reduced-motion`
abre e fecha sem animação.

As linhas do índice **são sempre links** para `/projeto/<slug>`. Com JavaScript,
o clique é interceptado e vira a sequência da §7.1. **Sem JavaScript**, o link
segue normalmente e chega com o `<dialog>` renderizado aberto no fluxo e um link
de volta para `/`.

## 8. Arquitetura

### 8.1 Abordagem

Astro 7 estático com dois motores próprios carregados depois do `load`: WebGL2
para o hero, Canvas 2D para o chão. Consideradas e descartadas: **PixiJS** (cerca
de 150 kB para animar nove sprites de 48 px, e uma tela de canvas única fica opaca
para leitor de tela e busca) e **personagens no DOM** (acessível, mas interação
entre personagens e partículas vira centenas de nós, e o hero precisaria de WebGL
de qualquer jeito).

### 8.2 O chão

- Faixa de **240 px** de altura no desktop e **200 px** abaixo de 640 px, largura
  total, logo abaixo do hero.
- **Escala inteira**: 3× no desktop, 2× abaixo de 640 px. `imageSmoothingEnabled
  = false`. `devicePixelRatio` com teto em 2.
- **Simulação em passo fixo de 60 Hz**, desenho no `requestAnimationFrame`, e
  pausa total quando o chão sai da tela ou a aba fica oculta.
- A simulação é **uma função pura** `(estado, dt, rng) → estado`, com gerador
  pseudoaleatório semeado. Os comportamentos ficam testáveis e reproduzíveis.
- Cada personagem: posição, direção, estado (`idle`, `walk`, `action`, `react`,
  `sleep`), tempo no estado e humor. O agendador escolhe o próximo estado por pesos
  que o humor modula.
- Separação mínima entre personagens e margem nas bordas, para ninguém se
  empilhar.
- Interações entre personagens (pacotes, bola, vizinhos do KNN) com teto: uma bola
  no chão por vez, no máximo três pacotes em voo.
- Hit-test por retângulo; o canvas é `aria-hidden`. O índice é a interface.

### 8.3 Sprites

O runtime lê o **JSON de exportação do Aseprite** (`frames` com `duration`,
`meta.frameTags` para nomear animações) e a folha PNG. Sem `frameTags`, a folha
inteira vira `idle` — o teste usa o JSON real do vampirinho como caso de fronteira.

A arte é gerada em **`art/`**, em Python, no molde do `gerador.py`:

- `art/common.py` — paleta, contorno, sombreamento, eixo de simetria, dither
- `art/<personagem>.py` — um gerador por máquina
- `art/build.py` — gera frames, monta a folha e o JSON em
  `src/assets/sprites/<personagem>.{png,json}`, com `frameTags`

O dono revisa e retoca no Aseprite. Um retoque manual precisa sobreviver:
depois de retocada, uma folha passa a ser a fonte, e o gerador daquela máquina é
aposentado.

### 8.4 Conteúdo

Mudanças no schema de `src/content.config.ts`:

| Campo | Tipo | Uso |
|---|---|---|
| `kind` | `projeto \| pesquisa` | projetos vão para chão e índice; pesquisa vai para "Sobre" |
| `status` | `ativo \| pausado \| concluido` | obrigatório quando `kind = projeto` |
| `github` | `owner/nome` | fonte dos dados; separado de `repo`, que é o link público e não existe em repositório privado |
| `character` | id do sprite | qual máquina representa o projeto |

Saem: `railLabel` (o trilho sai). Ficam: `cover`, `coverAlt`, `detailImage`,
`detailImageAlt`, agora usados no painel.

O teste de frontmatter que já cruza `accent`, `accentLight` e `order` entre PT e
EN passa a cruzar também `kind`, `status`, `github` e `character`.

### 8.5 Mapa de arquivos

**Novos**

| Arquivo | Responsabilidade |
|---|---|
| `scripts/refresh-github.mjs` | busca dados e grava o instantâneo |
| `.github/workflows/refresh-github.yml` | roda o script todo dia, commita se mudou |
| `src/data/github-snapshot.json` | o instantâneo, commitado |
| `src/lib/github/snapshot.ts` | tipos, leitura e validação do instantâneo |
| `src/lib/mood.ts` | a regra da §5.4, pura |
| `src/lib/sprites/aseprite.ts` | parser do JSON do Aseprite, puro |
| `src/lib/floor/rng.ts` | gerador semeado |
| `src/lib/floor/sim.ts` | passo da simulação, puro |
| `src/lib/floor/behaviors/*.ts` | ação-assinatura e interações de cada máquina |
| `src/lib/floor/render.ts` | desenho no Canvas 2D |
| `src/lib/floor/index.ts` | laço, entrada, pausa, ligação com o índice |
| `src/lib/hero/sample.ts` | foto → grade de células, puro |
| `src/lib/hero/field.ts` | o campo de partículas em WebGL2 |
| `src/shaders/hero-field.vert`, `.frag` | shaders do hero |
| `src/lib/panel/flip.ts` | animação de abrir e fechar |
| `src/lib/panel/history.ts` | `pushState` e `popstate` |
| `src/components/Hero.astro`, `Floor.astro`, `ProjectIndex.astro`, `ProjectPanel.astro`, `About.astro` | a página |
| `art/` | geradores de sprite em Python |

**Mantidos:** `i18n.ts`, `parity.ts`, `projects.ts`, `tokens.ts`,
`contrast.ts`, `ui-strings.ts`, `gl/renderer.ts`, `gl/support.ts`,
`gl/easing.ts`, `gl/fps-guard.ts`, `gl/accent.ts`, `LocaleToggle.astro`,
`Base.astro`, `public/specimen/placeholder.svg` (o bonequinho, agora dentro do
hero), o conteúdo e a infraestrutura de teste.

**Removidos:** `Rail.astro`, `Station.astro`, `Specimen.astro`,
`shaders/hero-bayer.frag`, `shaders/stations/`, `gl/station-manager.ts`,
`gl/station-controller.ts` e seus testes.

As páginas `index.astro` e `projeto/[slug].astro` (e as versões em inglês) passam
a renderizar **o mesmo layout de home**; a de projeto só chega com o painel aberto.

### 8.6 O `CLAUDE.md`

O invariante **"o site não tem JavaScript de runtime" deixa de valer** e é trocado
por: *JavaScript é aprimoramento progressivo — o site é completo e navegável sem
ele, e o orçamento da §9 é teto.* A troca acontece no primeiro plano de
implementação, não antes.

## 9. Orçamentos

| Item | Teto |
|---|---|
| JavaScript total, minificado | 70 kB |
| Folha de sprite por personagem | 60 kB |
| Sprites no total | 500 kB |
| Lighthouse — performance | ≥ 95 |
| Lighthouse — acessibilidade, boas práticas | 100 |

Performance tem teto 95 e não 100 de propósito: no Plano 2 ficou medido que o FCP
sob 4G simulado tem piso de 1,5 s em qualquer página com uma folha de estilo e uma
fonte. Perseguir o último ponto só adiciona complexidade.

**Cada motor pausa sozinho quando sai da tela** ou quando a aba fica oculta. Numa
tela alta os dois podem rodar juntos, e está tudo bem; a guarda de FPS existente
rebaixa qualquer um deles para o modo estático em GPU fraca.

## 10. Acessibilidade

- Canvases `aria-hidden`; o índice é a navegação. Cada linha diz o estado em
  palavras: *"VisionForge — a todo vapor, último commit há 24 dias"*.
- `<dialog>` modal, com foco gerenciado.
- **Movimento reduzido:** o hero fica estático com a máscara de dither; as máquinas
  ficam paradas lado a lado, no primeiro quadro do `idle`, com as sobreposições do
  humor. Nada se move na página.
- Todo texto está sobre fundo sólido. O texto do hero usa a paleta escura nos dois
  modos, já coberta pelo teste de tokens.

## 11. Fora de escopo

Som. Ciclo de dia e noite. Arrastar máquinas. Busca de dados do GitHub no
navegador, que exigiria token exposto. Mapa de calor de commits. CMS. Analytics.
Qualquer idioma além de PT e EN.

## 12. Riscos

**A arte é o caminho crítico.** Nove máquinas, o autor e as sobreposições, com
quatro ou cinco animações cada. Mitigação: geradores com estilo compartilhado,
sobreposições reaproveitadas, e o chão aceitar qualquer número de personagens — o
site vai ao ar com dois e ganha os outros conforme a arte fica pronta.

**O hero depende da foto.** Sem ela, a composição é meio bonequinho, meio luz.
Funciona como piada; não funciona como apresentação.

**Comportamento emergente pode virar bagunça.** O KNN perseguindo vizinhos, a
bola, os pacotes. Mitigação: simulação determinística com testes, tetos de
quantidade, e ajuste olhando capturas.

**Dois motores em celular.** Mitigação: cada motor pausa fora da tela, e a guarda
de FPS rebaixa para o modo estático.

**"Pausado" lido por recrutador.** Mitigado pelo status `concluido` e pelo tom: a
máquina dorme, não apodrece.

## 13. Critérios de sucesso

1. Os nove projetos são máquinas não humanoides com rosto em tela; o único
   humanoide no chão é o autor.
2. O humor de cada máquina segue a tabela da §5.4, e cada linha da tabela tem
   teste.
3. O instantâneo do GitHub se atualiza sozinho todo dia, e o build nunca acessa a
   rede.
4. Com JavaScript, abrir um projeto nunca carrega outro documento; a URL muda, o
   voltar fecha, e o link direto abre o painel.
5. O site é completo sem JavaScript e sem movimento sob `prefers-reduced-motion`.
6. JavaScript total até 70 kB; Lighthouse ≥ 95 / 100 / 100.
7. Nenhum projeto da Pix Force aparece; a paridade PT/EN segue imposta.

## 14. Ordem de construção

Cada plano entrega um site no ar, melhor que o anterior.

| Plano | Entrega |
|---|---|
| **3 — Dados, humor e índice** | instantâneo + Action diário, schema novo, `mood.ts`, índice e "Sobre" com a pesquisa, remoção das estações e do trilho, troca do invariante no `CLAUDE.md`. O site já tem a estrutura nova, ainda sem canvas. |
| **4 — O chão** | motor, parser do Aseprite, sobreposições, sincronia índice ↔ chão, e as duas primeiras máquinas: VisionForge e AirWatch. |
| **5 — O painel** | `<dialog>`, FLIP, histórico, estado aberto no servidor, caminho sem JS. |
| **6 — O hero** | campo de quadrados de luz, fronteira em dither, cursor, fallback em CSS. |
| **7 — O elenco completo** | as outras sete máquinas, o mini-Marcus e as interações entre elas. |

A arte das máquinas do Plano 7 pode ser gerada em paralelo a partir do Plano 4.

---

## Apêndice — O que só o dono pode fazer

- **A foto.** Cabeça e ombros, fundo liso, luz lateral, 2000 px no lado maior. O
  hero inteiro depende dela, e o mini-Marcus também.
- **Revisar a arte gerada** no Aseprite. O gerador acerta a família; o olho do
  dono acerta a personalidade.
- **Confirmar os status** da §5.3.
- **Criar o token** do GitHub com leitura de repositório e salvá-lo como segredo do
  Action — é o que permite ler VoleiArena e RVH, que são privados.
