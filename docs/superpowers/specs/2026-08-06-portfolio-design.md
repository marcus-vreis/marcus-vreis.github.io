# Portfólio — Banco Óptico

**Data:** 2026-08-06
**Autor:** Marcus Vinicius (`marcus-vreis`)
**Status:** Aprovado para planejamento

---

## 1. Objetivo

Um portfólio pessoal que apresente o trabalho de Marcus em visão computacional e
engenharia de software com identidade própria, onde cada projeto exibe a sua
própria personalidade visual e interativa em vez de ocupar um cartão padronizado.

O fio condutor do trabalho é a construção de instrumentos de observação:
VisionForge existe para que um pesquisador enxergue o próprio modelo sem se
enganar; ImageLab expõe a operação sobre o pixel; VampireAI investiga o que um
modelo pequeno consegue enxergar em uma tela de jogo; a pesquisa de mestrado
trata de fazer um detector enxergar sob desvio de domínio. A assinatura técnica
que atravessa todos é o rigor: intervalos de confiança por bootstrap, réplicas
multi-seed, proveniência gravada em `run.json`, decisões registradas em ADRs.

O site precisa comunicar as duas coisas ao mesmo tempo: sensibilidade visual e
rigor de engenharia.

## 2. Público, idioma e restrições

**Público:** bilíngue. Português e inglês com paridade total de conteúdo.
O idioma padrão é o português (`/`); o inglês vive em `/en/`.

**Restrição de confidencialidade (decidida pelo usuário em 2026-08-06):**
a Pix Force pode ser citada como empregadora, cargo e domínio de atuação, mas
**nenhum projeto da empresa entra no portfólio**. Ficam explicitamente fora:
`occurrence-framework`, `occurrence-detector`, `occurrence-count-people`,
`PRJ248-count-people`, `triton-inference` e `zenml-pipelines`. Não se cita
cliente, métrica interna, nome de modelo de produção nem captura de tela do
sistema.

**Fora do elenco por outros motivos:** `pixel-mcp` não é de autoria do Marcus
(pertence a `willibrandon`); `Dash` é material de trabalho.

## 3. Conceito

O site é um **banco óptico**. Uma régua horizontal com marcações de escala
atravessa a página inteira e funciona como trilho: cada projeto é uma **estação**
posicionada nele. A posição do scroll é a posição no trilho, e o trilho também é
a navegação por teclado.

Atrás de todo o conteúdo roda um `<canvas>` WebGL2 contínuo. Ao entrar em uma
estação, o shader é trocado e o projeto passa a **processar a página**: a
personalidade não é decoração aplicada sobre o projeto, é o algoritmo do próprio
projeto executando ao vivo sobre o layout.

A abertura estabelece a metáfora. O espécime sobre a bancada é o retrato do
Marcus. Ele começa como leitura crua de sensor — um mosaico de Bayer — passa por
demosaicing e resolve na fotografia conforme o visitante rola. De pixel a pessoa.
O cursor é a fonte de luz: um feixe colimado que refrata ao atravessar a lente.

## 4. Arquitetura

### 4.1 Stack

- **Astro 5**, deploy na **Vercel**.
- Home em scroll único (o banco óptico); páginas profundas em `/projeto/[slug]`
  e `/en/project/[slug]`.
- Conteúdo em **Content Collections** (MDX), um arquivo por projeto e por idioma.
  Nenhum texto de exibição vive dentro de componente.
- **Sem three.js e sem ogl.** O canvas é WebGL2 escrito à mão: um único quad em
  tela cheia mais um fragment shader por estação. A estimativa é de cerca de 10 kB
  de runtime próprio, o que mantém o orçamento de JS e combina com o caráter
  artesanal do resto do trabalho.

### 4.2 Estrutura de arquivos

```
src/
  content/
    projects/
      pt/<slug>.mdx
      en/<slug>.mdx
    config.ts              # schema Zod das coleções
  shaders/
    common.vert            # quad fullscreen, compartilhado
    stations/<slug>.frag   # um por estação
  lib/
    gl/renderer.ts         # contexto, quad, uniforms, crossfade
    gl/station-manager.ts  # IntersectionObserver -> troca de shader
    i18n.ts                # rotas e resolução de locale
  components/
    Rail.astro             # o trilho / navegação
    Station.astro          # casca de uma estação
    Specimen.astro         # slot do retrato
    islands/               # ilhas interativas (canvas 2D)
  pages/
    index.astro
    projeto/[slug].astro
    en/index.astro
    en/project/[slug].astro
scripts/
  render-posters.ts        # pré-renderiza posters a partir dos shaders
public/
  specimen/placeholder.svg # bonequinho de palito
  posters/<slug>.webp      # gerados no build
```

### 4.3 O canvas e as estações

Um `StationManager` observa as estações com `IntersectionObserver`. Ao entrar
uma nova estação, o shader correspondente é compilado (se ainda não foi) e ocorre
um crossfade de 600 ms entre o shader anterior e o novo, controlado por um uniform
`uMix`. Cada shader recebe uniforms comuns: `uTime`, `uResolution`, `uPointer`,
`uProgress` (posição normalizada dentro da estação) e `uMix`.

Shaders são compilados sob demanda, apenas para a estação visível e a próxima.
Nenhum shader é compilado antes do LCP.

### 4.4 Ilhas interativas

As mecânicas que exigem estado e interação real — ImageLab, CV-KNN, AirWatch,
VoleiArena, RVH — não usam WebGL. São ilhas Astro com `client:visible` desenhando
em **canvas 2D**, independentes entre si e do canvas de fundo. Isso as mantém
baratas, testáveis isoladamente e degradáveis sem afetar o resto da página.

### 4.5 Fallback

Quando `prefers-reduced-motion: reduce` estiver ativo ou WebGL2 não estiver
disponível, o canvas não monta. No lugar entra um **poster estático** por
estação, gerado no build pelo script `scripts/render-posters.ts` a partir dos
mesmos shaders, em WebP. A composição visual permanece idêntica; o custo de JS
cai a zero. As ilhas interativas, no mesmo cenário, renderizam seu estado inicial
e não animam.

### 4.6 Internacionalização

Rotas `/` (pt, padrão) e `/en/`. O seletor de idioma preserva a rota atual e a
âncora da estação. O schema da Content Collection exige o mesmo conjunto de
campos nos dois idiomas, então uma tradução faltando quebra o build em vez de
publicar conteúdo pela metade.

## 5. Direção de arte

### 5.1 Cor

| Token | Escuro | Claro |
|---|---|---|
| `--bg` | `#0B0D0E` | `#F4F2ED` |
| `--fg` | `#E8E6E1` | `#14161A` |
| `--accent` (site) | `#F0A33C` | `#F0A33C` |

O acento do site é um **âmbar de instrumento**, de bancada de laboratório antiga
— deliberadamente distante da paleta ciano-e-roxo de produto de IA. Cada estação
sobrescreve `--accent` com a cor do seu projeto (seção 6). Neutros em cinco
degraus interpolados entre `--bg` e `--fg`.

Todo par de cores, incluindo os dez acentos por projeto sobre ambos os fundos,
precisa passar em contraste **WCAG AA** e será verificado individualmente.

### 5.2 Tipografia

- **Display:** Instrument Serif — alto contraste, gratuita, e o nome dialoga com
  o conceito de instrumento.
- **Corpo:** Geist Sans.
- **Dados e código:** Geist Mono, sempre com `font-variant-numeric: tabular-nums`
  para que números não dancem ao atualizar.

Fontes servidas localmente (self-hosted, `woff2`, `font-display: swap`), sem
requisição a terceiros.

### 5.3 Movimento

Easing padrão `cubic-bezier(.2, .8, .2, 1)`. Três durações: 180 ms (resposta de
controle), 320 ms (transição de elemento), 600 ms (crossfade entre estações).
Nada pisca e nada salta. Todo movimento é suprimido sob `prefers-reduced-motion`.

### 5.4 O espécime

O slot do retrato já nasce com proporção e enquadramento definitivos. **Enquanto
a fotografia real não existir, o espécime é um bonequinho de palito** em SVG
(`public/specimen/placeholder.svg`), e ele passa exatamente pelo mesmo tratamento
de mosaico de Bayer e demosaicing — resolve do ruído de sensor como a foto vai
resolver. Trocar o placeholder pela fotografia final é substituir um arquivo;
nenhum outro código muda.

## 6. Elenco e personalidade

Cada estação define acento próprio, tratamento tipográfico de apoio, shader e
uma mecânica interativa. A regra que vale para todas: a mecânica executa o
algoritmo do projeto, não uma ilustração dele.

### VisionForge — "O Instrumento" · `#6EE7A8`
Plataforma local-first de experimentação em visão computacional. Cinco famílias
de tarefa, PyTorch + FastAPI + React em um processo, publicada no PyPI como
`visionforge-studio`, licença MIT.

*Mecânica:* uma métrica aparece como número único e confiante. O visitante clica
em **replicar** e ela se torna média ± IC 95% sobre cinco seeds — o valor encolhe
e ganha barra de erro. É a tese do projeto executada sobre quem visita.

*Página profunda:* `run.json` real e expansível, incluindo proveniência de
CUDA/cuDNN/GPU; a tabela das cinco famílias de tarefa com modelos e métricas; e a
linha do tempo dos ADRs apresentada como história de decisões técnicas.

### VampireAI — "O Jogador Míope" · `#C1272D` + fósforo `#9AE66E`
Agente que joga o deckbuilder *Vampire Crawlers* com um modelo visão-linguagem
local (Qwen2.5-VL 7B via Ollama), sem API paga.

*Mecânica:* replay de um turno real, encadeado — captura de tela, detector de
estado, saída JSON validada por pydantic, input no gamepad virtual. Um contador
de latência corre durante todo o replay. O modelo local é lento, e essa lentidão
é a pergunta de pesquisa, não um defeito escondido.

*Ângulo de conteúdo:* o jogo foi lançado em abril de 2026, o que garante zero
contaminação nos dados de treino dos modelos avaliados. Tratamento visual com
scanlines de CRT.

### Mestrado (UDA/OVD) — "O Nevoeiro" · `#8FA6B8`
Pesquisa em adaptação de domínio para detecção com vocabulário aberto: adaptação
source-free do lado textual de um detector congelado.

*Mecânica:* um slider de neblina interpola de Cityscapes para Foggy Cityscapes.
Conforme o visitante arrasta, as caixas de detecção perdem confiança e
desaparecem. A estação mostra o problema, não a solução.

*Conteúdo obrigatório:* a estação **relata o resultado negativo**. A ideia
inicial — usar CLIP como filtro de pseudo-rótulos — não funcionou, por razões
estruturais que o texto explica: teto de recall, e escore da âncora correlacionado
com a confiança do professor sob corrupção. Publicar o que não deu certo é o
sinal mais forte de seriedade que a página pode emitir para um leitor acadêmico.
Tom sóbrio, sem exagero visual.

### AirWatch — "A Rede" · `#4EC9E0`
Sistema distribuído para coleta e agregação de dados de qualidade do ar.

*Mecânica:* grafo vivo de nós coletores despejando lotes em um agregador central.
O visitante clica em um nó e o mata; os lotes se redistribuem e o agregador
absorve a falha, tolerando duplicatas — exatamente a propriedade que o projeto
implementa.

### ImageLab — "O Bisturi" · `#E040A0`
Aplicação de processamento digital de imagens com interface gráfica.

*Mecânica:* um ImageLab funcional em miniatura, rodando no browser: histograma,
limiarização de Otsu, filtros espaciais, operações morfológicas e domínio da
frequência. Opera sobre a imagem que o visitante arrastar para dentro da estação.
Nenhuma imagem sai do navegador.

### ComputerVision-CoffeeBean — "O Grão" · `#A9704B`
Avaliação de redes neurais sobre uma base de grãos de café, com artigo e vídeo.

*Mecânica:* grãos caindo e sendo classificados, com a matriz de confusão real ao
lado. Links para o artigo em PDF e para o vídeo explicativo. Tratamento
tipográfico mais quente que o resto do site.

### ComputerVision-KNN — "As Formas" · `#FF7A29`
k-NN e SVM sobre a base MPEG7 modificada, com extração de características.

*Mecânica:* silhuetas MPEG7 dispostas em um espaço bidimensional de
características. O visitante arrasta um ponto e ajusta o *k*; a fronteira de
decisão é redesenhada em tempo real.

### Sorting-Algorithms-Hub — "O Metrônomo" · neutro
Implementações de algoritmos de ordenação em C++.

*Mecânica:* visualização de ordenação com som via WebAudio, mudo por padrão.
Estação curta, e o texto é honesto sobre o que ela é: um repositório de
fundamentos, não uma entrega de produto.

### VoleiArena — "A Quadra" · temas do próprio projeto
SaaS white-label para gestão de torneios de futevôlei (React + Vite + Supabase).

*Mecânica:* os cinco presets de tema do próprio projeto — `ocean-deep`,
`sunset-pastel`, `forest-green`, `pastel-sky`, `volcanic` — viram um seletor que
retematiza a estação inteira ao vivo. Uma chave de torneio se preenche, e a
vitória dispara o sistema de partículas que já existe no código do projeto.

### RVH-Construtora — "A Obra" · concreto + `#F2B705`
Site institucional entregue para cliente.

*Mecânica:* deliberadamente sóbria — um slider de antes/depois. A função desta
estação no conjunto é provar entrega para cliente real, equilibrando o peso
acadêmico e de pesquisa das demais.

### Arquivo
Uma grade final, sem shader próprio, para repositórios menores e trabalhos
antigos que merecem existir mas não merecem uma estação.

## 7. Sobre

Tese em uma linha: **"Construo instrumentos para ver."**

A seção reúne:

- **Pix Force** — cargo e domínio de atuação: engenharia de visão computacional
  em produção, inferência sob streaming de vídeo, GPU. Sem nome de projeto, de
  cliente ou métrica interna.
- **Mestrado em andamento** e formação na UFV.
- **Uma restrição virada em identidade:** uma RTX 5060 Ti de 16 GB, sem cluster.
  "Tudo que eu publico roda numa GPU só." Isso distingue o portfólio de todo
  material que finge uma escala que não possui, e explica por que o trabalho é
  desenhado para caber — inferência, prompt tuning, backbone congelado.
- Contato e links (GitHub, LinkedIn, e-mail).

## 8. Acessibilidade e desempenho

- O trilho é navegável por teclado, com foco visível; cada estação é um landmark
  com heading próprio.
- Contraste AA verificado em ambos os modos, inclusive nos onze acentos por
  projeto.
- Toda mecânica interativa tem equivalente textual: o dado que a animação mostra
  também está escrito.
- `prefers-reduced-motion` suprime todo movimento e serve os posters estáticos.
- Orçamento: **JS inicial abaixo de 40 kB**, **LCP abaixo de 2,0 s**, Lighthouse
  **≥ 95** em Performance, Acessibilidade e Boas Práticas. O canvas só monta
  depois do LCP.

## 9. Fora de escopo

Deliberadamente ausentes desta versão: CMS ou painel de administração; blog e
sistema de comentários; modo de webcam ao vivo na abertura (fricção de
privacidade sem ganho proporcional); qualquer demo que exija GPU hospedada;
formulário de contato com backend — o contato é `mailto:` e links diretos.

## 10. Riscos

**Dez shaders é muito.** É o maior custo do plano e o mais fácil de subestimar.
Mitigação: as estações são independentes por construção, então a ordem de
implementação é por valor decrescente — VisionForge, VampireAI e Mestrado
primeiro. Uma estação sem shader próprio cai no tratamento neutro do Arquivo sem
quebrar nada.

**Desempenho em celular.** Um shader em tela cheia em GPU móvel pode custar caro.
Mitigação: resolução do canvas limitada por `devicePixelRatio` com teto, e uma
verificação de taxa de quadros que rebaixa para os posters estáticos se a média
cair abaixo do limite.

**Conteúdo em dois idiomas.** O gargalo real tende a ser escrever bem dez
estações duas vezes. Mitigação: o schema quebra o build se faltar tradução, o que
transforma o risco em erro visível em vez de página publicada pela metade.

## 11. Critérios de sucesso

1. Cada uma das dez estações de projeto tem acento, shader e mecânica próprios —
   nenhuma é um cartão genérico. O Arquivo, décimo primeiro bloco, é a única
   exceção deliberada: grade neutra, sem shader.
2. Nenhum projeto da Pix Force aparece; a empresa aparece apenas como experiência.
3. Paridade total PT/EN, verificada pelo build.
4. Lighthouse ≥ 95 e JS inicial < 40 kB na home.
5. O site é integralmente utilizável com `prefers-reduced-motion` ativo e sem
   WebGL2.
6. A estação do Mestrado relata o resultado negativo de forma clara.

---

## Apêndice — Opções de mercado que exigem trabalho manual

Coisas que elevariam bastante o resultado, mas que dependem de dinheiro, de
terceiros ou de tempo fora do código. Ordenadas por impacto.

### Alto impacto

**Retrato profissional.** É o espécime da abertura e a peça mais visível do site
inteiro. Fundo limpo, luz controlada, resolução alta. Todo o efeito de sensor e
demosaicing depende da qualidade dessa imagem. É o único item já bloqueado por
decisão sua — o bonequinho de palito segura o lugar até lá.

**Domínio próprio.** `marcusvreis.com`, `marcusdiniz.dev` ou similar. Custa pouco
e muda a percepção mais do que qualquer detalhe técnico do site.

**Capturas de tela em qualidade real.** VisionForge e VampireAI vivem de
demonstração. Ferramentas como Screen Studio ou Cursorful produzem gravações com
zoom suave e cursor tratado, muito acima de uma captura crua. Vale especialmente
para o replay do VampireAI.

**Vídeo curto de abertura por projeto.** É aqui que entram Higgsfield, Kling e
Runway: gerar um plano de 3 a 5 segundos como pano de fundo de uma estação. Usar
com parcimônia — o valor está no contraste com o resto, que é todo real. Se cada
estação tiver vídeo gerado, nenhuma se destaca.

### Médio impacto

**Fonte de display paga.** Instrument Serif é excelente e gratuita, mas uma
família com licença comercial dá assinatura difícil de copiar. Pangram Pangram,
Klim Type Foundry e Displaay são os caminhos usuais. Custo típico entre 50 e 300
dólares por estilo.

**Rive.** Animações interativas com máquina de estados, superior a Lottie quando
a animação precisa reagir. Serviria bem ao replay do VampireAI e ao grafo do
AirWatch, se você quiser mais expressividade do que canvas 2D à mão entrega.

**Spline.** Cena 3D sem código, uma opção para a lente da abertura se o resultado
em WebGL puro não convencer. Custo: peso de bundle.

**READMEs em inglês.** Vários repositórios estão só em português. O portfólio
manda o visitante para o GitHub, e ele chega numa página que não lê. É trabalho
puramente manual e de retorno alto.

**Currículo em PDF com tipografia própria.** Feito em Typst ou LaTeX, usando as
mesmas fontes do site. Coerência entre os dois materiais é notada.

### Menor impacto, ainda válido

**Analytics com respeito a privacidade.** Plausible (pago) ou Umami
(auto-hospedado), para saber quais estações prendem atenção.

**Cal.com** para agendamento direto, se o objetivo incluir conversas de
recrutamento.

**Cartões sociais desenhados à mão.** A geração automática via `@vercel/og` é
código barato, mas o desenho de cada card é trabalho de design.

**Design de som.** Sorting-Hub e VampireAI pedem áudio. Bibliotecas como
Freesound resolvem, mas seleção e mixagem são manuais. Sempre mudo por padrão.

**Notas técnicas escritas.** Um texto curto sobre o resultado negativo do
mestrado, ou sobre o IC por bootstrap do VisionForge, vale mais que qualquer
efeito visual para o leitor certo. É o item de maior retorno por real gasto — e o
que mais consome tempo.
