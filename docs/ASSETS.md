# O que falta capturar

Guia do que só você pode produzir. O site não tem mais estações: cada projeto
agora é uma máquina no chão, mais um painel que abre no lugar. As capturas
listadas aqui continuam sendo exatamente o que os painéis dos projetos
precisam — capas e vídeos —, e o aviso sobre o `Metodologia.png` mais abaixo
continua valendo. Oito dos dez projetos ainda não têm imagem, e é a diferença
entre o site parecer um índice e parecer um portfólio.

## Antes de tudo: sobre gerar com IA

**Não compre uma assinatura de gerador de imagem por causa deste site.**

O portfólio inteiro se apoia em mostrar trabalho real — é o mesmo argumento do
retrato. Uma captura *gerada* do VisionForge não é uma captura do VisionForge; é
uma ilustração de um software que não existe, num site cuja tese é "o número que
eu reporto é um número que eu defendo". Quem entende vai perceber, e o que era
para provar competência passa a levantar dúvida.

O que este site precisa é de **capturas de tela e gravações do seu próprio
software**. Isso é trabalho manual, não é caro, e é insubstituível.

Há exatamente dois lugares onde geração faz sentido, e os dois são atmosfera, não
representação de trabalho — ver a seção [Onde IA cabe](#onde-ia-cabe) no fim.

## Especificação técnica

Vale para tudo desta lista:

| Item | Valor |
|---|---|
| Largura mínima | 1600 px (2400 px se for capturar tela cheia) |
| Proporção | livre, mas evite mais alto que largo — o layout é de duas colunas |
| Formato | PNG para interface, JPG para foto, MP4 ou GIF para movimento |
| Tema | escuro quando o software tiver os dois — combina com o site |
| Cuidado | nada de dado pessoal, caminho de arquivo com seu usuário, nome de cliente, ou aba de navegador com outras coisas abertas |

Coloque em `src/assets/projects/<slug>.png` e me avise — eu ligo no frontmatter,
escrevo o texto alternativo nos dois idiomas e otimizo.

---

## Por projeto

### 1. VisionForge — *tem duas, mas dá para melhorar*
Já no site: painel de classificação e a visão de réplicas.

**Valeria muito:** uma **gravação de tela de 10 a 20 segundos** de um treino
rodando — clicar em Treinar, as épocas avançando, o gráfico se preenchendo, o
resultado aparecendo. É o ativo mais forte que você pode produzir para o site
inteiro, porque mostra a coisa funcionando em vez de parada.

Ferramenta: Screen Studio ou Cursorful dão zoom suave e tratam o cursor. Uma
gravação crua também serve.

### 2. VampireAI — *tem uma, e precisa de vídeo*
Já no site: uma tela de batalha.

**O ativo que falta:** o agente **jogando**. Trinta segundos de captura com o
overlay de percepção visível, se você tiver — caixas nas cartas, o JSON da decisão
saindo, o gamepad virtual agindo. Se não tiver overlay, a tela do jogo com o log
do agente ao lado numa janela já conta a história.

Isso e o vídeo do VisionForge são os dois que mais mudam o site.

### 3. UDA/OVD (mestrado) — *você tem os dados*
Você tem acesso a Cityscapes e Foggy Cityscapes desde julho de 2025.

**Capture:** o **mesmo quadro**, lado a lado, limpo e com neblina, com as caixas
preditas desenhadas em cima e o score em cada uma. Duas imagens separadas de
mesma dimensão, que eu monto como par no site. É a imagem que explica sua
pesquisa sem uma linha de texto.

**Não use o `Metodologia.png`** que está em `Mestrado-artigo/`. Ele mostra a
ancoragem híbrida VFM+VLM com portão de concordância — a linha que você
descartou. Publicar isso te representa errado. Se quiser um diagrama, precisa ser
um novo, da direção atual (adaptação source-free do lado textual).

### 4. AirWatch
`docker-compose up --build` e capture o **dashboard com dados fluindo**. Se der,
capture um segundo quadro logo depois de derrubar um nó coletor, mostrando o
agregador absorvendo — é a propriedade que o projeto implementa.

### 5. ImageLab
Rode a aplicação, abra uma imagem e capture com **um filtro aplicado e o
histograma visível ao lado**. Se puder, um par antes/depois de Otsu ou Sobel.
Interface Tkinter é feia por natureza; capture só a janela, não a área de
trabalho.

### 6. ComputerVision-CoffeeBean
Do notebook: a **matriz de confusão** e uma **grade de amostras de grãos** com o
rótulo predito. Exporte em PNG com fundo transparente ou escuro, não branco.

### 7. ComputerVision-KNN
Duas opções, a segunda é melhor: uma grade de silhuetas MPEG7, ou o **espaço de
características em 2D** com as classes coloridas e a fronteira de decisão. Se
exportar do matplotlib, use `savefig(..., transparent=True, dpi=200)`.

### 8. Sorting-Algorithms-Hub
O mais fraco do conjunto e tudo bem. Um quadro de uma visualização de ordenação,
ou nada. Não invente sofisticação para um repositório de fundamentos — o texto
do site já é honesto sobre o que ele é.

### 9. VoleiArena
`npm run dev` e capture a **chave de torneio preenchida**. Se der, capture a
mesma tela em dois dos cinco temas (`ocean-deep` e `volcanic` são os mais
distintos) — eu mostro os dois lado a lado, que é a prova do white-label.

O `hero.png` que está no repositório tem 343×361, pequeno demais para servir.

### 10. RVH Construtora
Capture o **site publicado**, não o local. Página inicial, tela cheia, 2400 px. Se
tiver antes/depois de alguma obra no site do cliente, melhor ainda.

---

## O retrato

Continua sendo o item mais visível do site. Cabeça e ombros, fundo liso, luz
lateral suave, olhar na câmera, 2000 px no lado maior. Celular perto de uma
janela resolve. O bonequinho de palito segura o lugar até lá sem parecer
inacabado.

---

## Onde IA cabe

Dois lugares, e nos dois ela é atmosfera — nunca representação do seu trabalho.

**1. A abertura.** Se você quiser movimento no hero além do efeito de sensor que
o Plano 2 vai construir. Mas avalie: o efeito planejado já é movimento, é
programático, e é temático. Um vídeo gerado por cima disso provavelmente briga
em vez de somar.

**2. Uma textura de neblina** para a estação do mestrado, *se* as imagens reais
do Foggy Cityscapes não renderem bem no layout. Mas as reais são melhores e você
já as tem — só considere isso como plano B.

Fora disso: se você assinar o Higgsfield, assine porque quer usar em outra coisa.
Para este site, o dinheiro rende muito mais numa boa gravação de tela do
VisionForge treinando e do VampireAI jogando.

---

## Prioridade

Se você só fizer três coisas:

1. **Vídeo do VisionForge treinando**
2. **Vídeo do VampireAI jogando**
3. **O par limpo/neblina do mestrado**

Esses três cobrem as três estações que mais te representam, e as duas primeiras
transformam o site de estático em vivo.
