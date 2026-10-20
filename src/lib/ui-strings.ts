import type { Locale } from './i18n';
import type { Mood } from './mood';

export type CharacterId =
  | 'lente'
  | 'custodia'
  | 'fliperama'
  | 'estacao'
  | 'scanner'
  | 'cafeteira'
  | 'plotter'
  | 'esteira'
  | 'nevoeiro';

export interface SchematicSpec {
  code: string;
  formula: string;
  stages: [string, string, string];
  invariant: string;
  metric: string;
}

export interface PublicationItem {
  year: string;
  venue: string;
  badge: string;
  title: string;
  authors: string;
  note: string;
}

export interface TrajectoryItem {
  period: string;
  role: string;
  org: string;
  regime: string;
  detail: string;
}

export interface AcademicProjectItem {
  period: string;
  kind: string;
  code: string;
  title: string;
  org: string;
  advisor: string;
  detail: string;
}

export interface AwardItem {
  year: string;
  title: string;
  venue: string;
}

export interface EventItem {
  year: string;
  kind: string;
  event: string;
  work: string;
}

export interface IndicatorItem {
  value: string;
  label: string;
  detail: string;
}

export interface BioFieldItem {
  label: string;
  value: string;
}

export interface SkillGroupItem {
  category: string;
  items: string[];
}

export interface LanguageItem {
  language: string;
  level: string;
  detail: string;
}

export interface PillarItem {
  id: string;
  code: string;
  title: string;
  formula: string;
  summary: string;
  projects: string;
}

export interface UiStrings {
  siteTitle: string;
  siteDescription: string;
  thesis: string;
  intro: string;
  yearLabel: string;
  stackLabel: string;
  repoLabel: string;
  backLabel: string;
  lastCommitLabel: string;
  aboutHeading: string;
  aboutSubtitle: string;
  lattesSummaryHeading: string;
  lattesSummaryQuote: string;
  aboutBody: string[];
  profileCardHeading: string;
  bioFields: BioFieldItem[];
  indicatorsHeading: string;
  indicators: IndicatorItem[];
  experienceHeading: string;
  experience: TrajectoryItem[];
  educationHeading: string;
  education: TrajectoryItem[];
  academicProjectsHeading: string;
  academicProjects: AcademicProjectItem[];
  awardsHeading: string;
  awards: AwardItem[];
  eventsHeading: string;
  events: EventItem[];
  skillsHeading: string;
  skillGroups: SkillGroupItem[];
  languagesHeading: string;
  languages: LanguageItem[];
  contactHeading: string;
  contact: { label: string; value: string; href: string }[];
  name: string;
  fullName: string;
  citationShort: string;
  birthAndNationality: string;
  locationLabel: string;
  portraitAlt: string;
  authorPhotoAlt: string;
  projectsHeading: string;
  projectsSubtitle: string;
  researchHeading: string;
  researchSubtitle: string;
  publicationsHeading: string;
  publicationsSubtitle: string;
  trajectoryHeading: string;
  hardwareHeading: string;
  hardwareSpec: string;
  hardwareDetail: string;
  navProjects: string;
  navResearch: string;
  navPublications: string;
  navAbout: string;
  heroBadge: string;
  heroAffiliation: string;
  telemetryHeading: string;
  telemetrySnapshotLabel: string;
  telemetryCommitsLabel: string;
  telemetryActiveLabel: string;
  telemetryReleaseLabel: string;
  pillarsHeading: string;
  pillars: PillarItem[];
  filterAll: string;
  filterActive: string;
  filterGraduated: string;
  commits90dSuffix: string;
  starsSuffix: string;
  inspectLabel: string;
  schematicLabel: string;
  invariantLabel: string;
  statusLabel: string;
  commits90dLabel: string;
  releaseLabel: string;
  figuresLabel: string;
  prevProjectLabel: string;
  nextProjectLabel: string;
  moods: Record<Mood, string>;
  schematics: Record<CharacterId, SchematicSpec>;
  publications: PublicationItem[];
  trajectory: TrajectoryItem[];
}

export const UI: Record<Locale, UiStrings> = {
  pt: {
    siteTitle: 'Marcus Vinicius — visão computacional & engenharia de ML',
    siteDescription:
      'Portfólio e dossiê técnico-acadêmico de Marcus Vinicius Diniz dos Reis: visão computacional, detecção de objetos, pesquisa de mestrado na UFSCar e software open-source.',
    thesis: 'Construo instrumentos para ver.',
    intro:
      'Engenheiro de visão computacional na Pix Force e mestrando em Ciência da Computação na UFSCar. Cada entrada deste caderno documenta a arquitetura, a costura matemática e a telemetria real dos meus repositórios públicos.',
    yearLabel: 'Período',
    stackLabel: 'Stack',
    repoLabel: 'Repositório no GitHub',
    backLabel: 'Voltar para a bancada',
    lastCommitLabel: 'último commit',
    aboutHeading: 'Dossiê Pessoal, Acadêmico & Profissional',
    aboutSubtitle:
      'Registro integral extraído do Currículo Lattes (CNPq 8185221944541336), da Súmula Curricular FAPESP e do histórico acadêmico na UFSCar e na UFV.',
    lattesSummaryHeading: 'Resumo Curricular (Texto Oficial Lattes)',
    lattesSummaryQuote:
      'Engenheiro de Machine Learning e pesquisador em Visão Computacional, com experiência em pesquisa aplicada de IA e desenvolvimento de modelos de Deep Learning. Atua com CNNs, detecção de objetos e processamento de imagens, com histórico em treinamento e deploy de modelos dentro de pipelines de MLOps e sistemas escaláveis.',
    aboutBody: [
      'Nascido em 08 de março de 2004, sou engenheiro de visão computacional na Pix Force (onde ingressei como estagiário em janeiro de 2025 e atuo como engenheiro celetista em tempo integral desde janeiro de 2026) e mestrando em Ciência da Computação no PPGCC da UFSCar sob orientação do Prof. Dr. Jurandy Gomes de Almeida Junior.',
      'Graduado em Sistemas de Informação pela Universidade Federal de Viçosa (UFV — Campus Rio Paranaíba), construí minha base científica combinando processamento digital de sinais, redes neurais convolucionais e sistemas distribuídos: fui bolsista de Iniciação Científica da FAPESP (proc. 2024/08973-2) no projeto SFI2 sobre o testbed FIBRE-NG da RNP, pesquisador de IC em visão computacional para classificação de grãos de café e monitor remunerado de Matemática Discreta.',
      'Uma única RTX 5060 Ti de 16 GB (Blackwell sm_120, cu128). Sem cluster. Tudo que eu publico roda em uma GPU de estação de trabalho — e é por isso que cada sistema é desenhado para caber no orçamento, medir a própria incerteza e justificar cada chamada de modelo.',
    ],
    profileCardHeading: 'Ficha Cadastral & Identificação Bibliográfica',
    bioFields: [
      { label: 'Nome completo', value: 'Marcus Vinicius Diniz dos Reis' },
      {
        label: 'Nome em citações bibliográficas',
        value: 'REIS, M. V. D.; REIS, MARCUS VINICIUS DINIZ DOS; dos Reis, Marcus V. Diniz; REIS, Marcus Vinicius Diniz dos',
      },
      { label: 'Nascimento & Nacionalidade', value: '08/03/2004 · Brasileira' },
      { label: 'Base de atuação', value: 'São Carlos, SP · Rio Paranaíba / Viçosa, MG — Brasil' },
      { label: 'Vínculo na indústria', value: 'Pix Force Tecnologia Ltda. · Engenheiro de Visão Computacional (CLT, 40h)' },
      { label: 'Vínculo acadêmico', value: 'PPGCC / UFSCar · Mestrado em Ciência da Computação (RA 847647)' },
      { label: 'ID Currículo Lattes (CNPq)', value: '8185221944541336' },
      { label: 'ORCID iD', value: '0009-0002-1464-431X' },
    ],
    indicatorsHeading: 'Indicadores Quantitativos de Produção',
    indicators: [
      {
        value: '3+ anos',
        label: 'Atuação em Visão Computacional',
        detail: 'Pesquisa contínua desde 2023 e engenharia em produção desde jan/2025.',
      },
      {
        value: '1',
        label: 'Capítulo Internacional',
        detail: 'Springer Nature Switzerland (LNDECT, 2025, pp. 89–100) como 1º autor.',
      },
      {
        value: '3',
        label: 'Artigos Completos em Anais',
        detail: 'Publicados no WSIS 2024 e XV WSIS 2025 com revisão por pares.',
      },
      {
        value: '7',
        label: 'Eventos, Oficinas & Exposições',
        detail: 'Apresentações em WVC, WSIS, Mostra de Jogos Digitais e Mostra de Profissões.',
      },
      {
        value: '5',
        label: 'Prêmios, Bolsas & Distinções',
        detail: 'Melhor Artigo, 1º Lugar Hackathon CV, Bolsa FAPESP, Melhor Pôster e Maratona.',
      },
      {
        value: 'h = 1',
        label: 'Índice Bibliométrico',
        detail: 'Google Scholar (ID 5jCt_wYAAAAJ · citação registrada em 2025).',
      },
    ],
    experienceHeading: 'Atuação Profissional (Indústria)',
    experience: [
      {
        period: '01/2026 — atual',
        role: 'Engenheiro de Visão Computacional',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Celetista (CLT) · 40h semanais',
        detail:
          'Desenvolvimento, implantação e otimização de modelos de visão computacional com ênfase em detecção de objetos e análise de dados do mundo real: preparação e curadoria de dados, treinamento, avaliação rigorosa de modelos e integração de pipelines de inferência a sistemas em produção.',
      },
      {
        period: '01/2025 — 12/2025',
        role: 'Desenvolvedor de Visão Computacional',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Estágio · 30h semanais',
        detail:
          'Implementação, experimentação e validação de modelos de deep learning e rotinas de processamento de imagens e vídeo para soluções industriais de inspeção e monitoramento.',
      },
    ],
    educationHeading: 'Formação Acadêmica & Titulação',
    education: [
      {
        period: '2026 — 2028',
        role: 'Mestrado em Ciência da Computação',
        org: 'Universidade Federal de São Carlos (UFSCar) · São Carlos, SP',
        regime: 'Pós-Graduação Stricto Sensu · RA 847647',
        detail:
          'Orientador: Prof. Dr. Jurandy Gomes de Almeida Junior. Pesquisa em adaptação de domínio não supervisionada (UDA) e detectores de objetos de vocabulário aberto sob deslocamento composto.',
      },
      {
        period: '2022 — 2026',
        role: 'Bacharelado em Sistemas de Informação',
        org: 'Universidade Federal de Viçosa (UFV) · Campus Rio Paranaíba, MG',
        regime: 'Graduação Superior',
        detail:
          'TCC: "Análise da qualidade de grãos de café usando redes neurais convolucionais com técnicas como ensemble". Orientador: Prof. Dr. Pedro Moises de Sousa.',
      },
      {
        period: '2020 — 2021',
        role: 'Ensino Médio (2º Grau)',
        org: 'Instituto Samaritano (SAM) · Brasil',
        regime: 'Educação Básica',
        detail: 'Conclusão do ensino médio regular.',
      },
    ],
    academicProjectsHeading: 'Projetos Formais de Pesquisa & Ensino (Lattes)',
    academicProjects: [
      {
        period: '2024 — 2025',
        kind: 'Projeto de Pesquisa · Bolsa IC FAPESP',
        code: 'FAPESP proc. 2024/08973-2 · Projeto SFI2',
        title:
          'Construção e validação de um agente de Aprendizado por Reforço flexível para Arquiteturas de Fatiamento de Redes',
        org: 'UFV & Testbed FIBRE-NG da Rede Nacional de Ensino e Pesquisa (RNP)',
        advisor: 'Coordenador: Prof. Dr. Flávio de Oliveira Silva · Integrante: Rodrigo Moreira',
        detail:
          'Desenvolvimento e validação experimental no testbed FIBRE-NG da RNP de abordagens de aprendizado de máquina e monitoramento cross-domain voltadas à garantia de SLA em fatias de rede sobre arquiteturas de microsserviços conteinerizados. Resultou no capítulo internacional publicado pela Springer Nature (2025).',
      },
      {
        period: '2024 — 2025',
        kind: 'Projeto de Pesquisa · Iniciação Científica',
        code: 'IC Visão Computacional · UFV',
        title:
          'Análise da qualidade de grãos de café usando redes neurais convolucionais com técnicas como wavelet',
        org: 'Universidade Federal de Viçosa (UFV)',
        advisor: 'Coordenador: Prof. Dr. Pedro Moises de Sousa',
        detail:
          'Coleta e curadoria de bancos de dados públicos, pré-processamento morfológico, realce de contraste local (CLAHE), decomposição por Transformada Wavelet Discreta e treinamento/validação de arquiteturas CNN e comitês (ensemble).',
      },
      {
        period: '2024',
        kind: 'Projeto de Ensino · Monitoria Acadêmica',
        code: 'Bolsa de Monitoria por Processo Seletivo · UFV',
        title: 'Monitoria Remunerada da Disciplina de Matemática Discreta',
        org: 'Universidade Federal de Viçosa (UFV)',
        advisor: 'Coordenador: Prof. Dr. Pedro Moises de Sousa',
        detail:
          'Auxílio docente nas atividades de ensino de lógica formal, teoria dos conjuntos, relações, indução matemática e combinatória, com atendimento a estudantes e elaboração/correção de exercícios.',
      },
    ],
    awardsHeading: 'Prêmios, Bolsas & Distinções Acadêmicas',
    awards: [
      {
        year: '2025',
        title: 'Prêmio de Melhor Artigo',
        venue: 'XV Workshop de Sistemas de Informação (WSIS), UFV',
      },
      {
        year: '2024',
        title: '1º Lugar — Hackathon de Visão Computacional',
        venue: 'Workshop de Visão Computacional (WVC), UFV',
      },
      {
        year: '2024',
        title: 'Bolsa de Iniciação Científica FAPESP (Mérito Acadêmico)',
        venue: 'Fundação de Amparo à Pesquisa do Estado de São Paulo (proc. 2024/08973-2)',
      },
      {
        year: '2023',
        title: 'Prêmio de Melhor Pôster',
        venue: 'Workshop de Sistemas de Informação (WSIS), UFV',
      },
      {
        year: '2023',
        title: '2º Lugar — Maratona de Programação',
        venue: 'Universidade Federal de Viçosa (UFV)',
      },
    ],
    eventsHeading: 'Participação em Eventos, Congressos, Oficinas & Exposições',
    events: [
      {
        year: '2025',
        kind: 'Oficina · Apresentação de Artigo Premiado',
        event: 'XV Workshop de Sistemas de Informação (WSIS 2025)',
        work: 'Unsupervised Specialization of Visual Subclasses Using K-Means in YOLO-Based Detection Pipelines',
      },
      {
        year: '2025',
        kind: 'Oficina · Apresentação de Artigo Completo',
        event: 'XV Workshop de Sistemas de Informação (WSIS 2025)',
        work: 'Automated Correction of Multiple Choice Tests Using Computer Vision',
      },
      {
        year: '2024',
        kind: 'Oficina & Hackathon · 1º Lugar Geral',
        event: 'Workshop de Visão Computacional (WVC 2024)',
        work: 'Protótipo de Solução para Identificação dos Times aos Quais os Jogadores Pertencem em Vídeos de Esportes',
      },
      {
        year: '2024',
        kind: 'Exposição Tecnológica',
        event: 'Mostra de Jogos Digitais (UFV)',
        work: 'Alfabeto Mágico — Jogo digital educativo interativo',
      },
      {
        year: '2024',
        kind: 'Oficina · Apresentação Oral (1º Autor)',
        event: 'Workshop de Sistemas de Informação (WSIS 2024)',
        work: 'Quality Assessment of Coffee Beans Using Convolutional Neural Networks with Wavelet and CLAHE Techniques',
      },
      {
        year: '2023',
        kind: 'Oficina · Apresentação de Pôster Premiado',
        event: 'Workshop de Sistemas de Informação (WSIS 2023)',
        work: 'Desenvolvimento de IA: Análise da qualidade de grãos de café usando redes neurais convolucionais com técnicas como wavelet',
      },
      {
        year: '2023',
        kind: 'Exposição de Extensão',
        event: 'Mostra de Profissões (UFV)',
        work: 'Introdução ao ChatBot — Demonstração interativa de sistemas conversacionais',
      },
    ],
    skillsHeading: 'Matriz de Competências Técnicas',
    skillGroups: [
      {
        category: 'Visão Computacional & Processamento de Sinais',
        items: [
          'OpenCV',
          'Scikit-image',
          'Homografia de Plano de Solo',
          'CLAHE',
          'Transformada Wavelet Discreta (DWT)',
          'Espectro FFT 2D',
          'Morfologia Matemática',
          'Segmentação de Otsu',
          'Descritores de Forma MPEG7',
          'Rastreamento Multi-Objeto',
        ],
      },
      {
        category: 'Deep Learning & Modelos Multimodais (VLMs)',
        items: [
          'PyTorch',
          'TensorFlow / Keras',
          'Scikit-learn',
          'YOLO (v8 / v11 / v26)',
          'RT-DETR',
          'Faster R-CNN',
          'Grounding DINO',
          'OWLv2',
          'CLIP',
          'SigLIP 2',
          'DINOv2',
          'Qwen2.5-VL (Ollama)',
        ],
      },
      {
        category: 'Engenharia de Software, Sistemas & MLOps',
        items: [
          'Python 3.12',
          'C++',
          'TypeScript',
          'FastAPI',
          'React 19',
          'RabbitMQ',
          'WebSockets / SSE',
          'SQLite (WAL)',
          'Pydantic v2',
          'Docker & Kubernetes',
          'Linux',
          'Git / CI Pré-commit',
          'Pytest · Vitest · Playwright',
        ],
      },
    ],
    languagesHeading: 'Idiomas',
    languages: [
      {
        language: 'Português',
        level: 'Nativo',
        detail: 'Compreende bem · Fala bem · Lê bem · Escreve bem',
      },
      {
        language: 'Inglês',
        level: 'Proficiência Técnica & Científica',
        detail: 'Compreende bem · Lê bem · Escreve bem · Fala intermediária (autoria de artigos e documentação em inglês)',
      },
    ],
    contactHeading: 'Perfis Acadêmicos, Identificadores & Contato',
    contact: [
      { label: 'GitHub', value: '@marcus-vreis', href: 'https://github.com/marcus-vreis' },
      { label: 'LinkedIn', value: 'in/marcus-vinicius-diniz', href: 'https://www.linkedin.com/in/marcus-vinicius-diniz/' },
      { label: 'Google Scholar', value: '5jCt_wYAAAAJ (h = 1)', href: 'https://scholar.google.com/citations?user=5jCt_wYAAAAJ' },
      { label: 'ORCID', value: '0009-0002-1464-431X', href: 'https://orcid.org/0009-0002-1464-431X' },
      { label: 'Currículo Lattes', value: 'CNPq 8185221944541336', href: 'http://lattes.cnpq.br/8185221944541336' },
      { label: 'E-mail', value: 'marcusvinicius0083@gmail.com', href: 'mailto:marcusvinicius0083@gmail.com' },
    ],
    name: 'Marcus Vinicius',
    fullName: 'Marcus Vinicius Diniz dos Reis',
    citationShort: 'REIS, M. V. D.',
    birthAndNationality: '08/03/2004 · Brasil',
    locationLabel: 'São Carlos, SP · Viçosa / Rio Paranaíba, MG',
    portraitAlt: 'Console esquemático de calibração óptica e telemetria',
    authorPhotoAlt: 'Retrato de Marcus Vinicius Diniz dos Reis',
    projectsHeading: 'Instrumentos & Projetos Públicos',
    projectsSubtitle:
      'Oito repositórios públicos no GitHub. O estado operacional e a contagem de commits vêm do instantâneo diário commitado no repositório — o build nunca consulta a rede.',
    researchHeading: 'Pesquisa de Mestrado · UFSCar',
    researchSubtitle:
      'Estudo empírico e autotreinamento professor–aluno sob deslocamento de domínio (COCO-C, Foggy Cityscapes e BDD100K).',
    publicationsHeading: 'Publicações Científicas',
    publicationsSubtitle:
      'Trabalhos completos com revisão por pares em capítulo de livro internacional (Springer Nature) e anais de conferências.',
    trajectoryHeading: 'Histórico Profissional & Acadêmico',
    hardwareHeading: 'Restrição de Bancada',
    hardwareSpec: '1× NVIDIA RTX 5060 Ti · 16 GB VRAM · sm_120 (cu128)',
    hardwareDetail:
      'Orçamento computacional fixo: todo experimento, treino ou agente local é projetado para rodar de ponta a ponta numa única GPU de estação de trabalho.',
    navProjects: 'Instrumentos',
    navResearch: 'Pesquisa',
    navPublications: 'Publicações',
    navAbout: 'Dossiê',
    heroBadge: 'CADERNO DE ENGENHARIA // VISÃO COMPUTACIONAL',
    heroAffiliation: 'UFSCar M.Sc. (RA 847647) · Pix Force · UFV B.Sc.',
    telemetryHeading: 'Telemetria dos Repositórios',
    telemetrySnapshotLabel: 'Instantâneo UTC',
    telemetryCommitsLabel: 'Commits / 90 dias',
    telemetryActiveLabel: 'Projetos ativos',
    telemetryReleaseLabel: 'Última release',
    pillarsHeading: 'Três Costuras de Engenharia',
    pillars: [
      {
        id: 'seam',
        code: 'COSTURA 01 // GEOMETRIA vs. SEMÂNTICA',
        title: 'Pixels só vão até onde a geometria exige',
        formula: 'I(u,v) → H⁻¹ → (x, y, t) ∈ ℝ² × ℝ',
        summary:
          'Em custody-watch, tudo à direita do plano de solo consome apenas metros e segundos; no VampireAI (ADR-022), funções puras em NumPy resolvem cartas e minimapa em 3,3 ms para que o VLM decida só semântica (1–2× por turno).',
        projects: 'custody-watch · VampireAI · ImageLab',
      },
      {
        id: 'rigor',
        code: 'COSTURA 02 // PROVENIÊNCIA & RECUSA',
        title: 'O número reportado precisa ser defensável',
        formula: 'μ ± CI₉₅(bootstrap, K=5 seeds) · run.json',
        summary:
          'No VisionForge, toda execução grava ambiente e hiperparâmetros em run.json e compara modelos com réplicas multi-seed. No custody-watch, evaluate.py recusa calcular P_miss a 25 s quando o maior abandono do CAVIAR dura 13,3 s.',
        projects: 'VisionForge · custody-watch · CoffeeBean',
      },
      {
        id: 'domain',
        code: 'COSTURA 03 // DESVIO DE DOMÍNIO',
        title: 'Completar supera filtrar quando o recall colapsa',
        formula: 'Ŷ = Y_prof(τ) ∪ Y_GDINO(c ∉ Y_prof) → +0,077 Recall',
        summary:
          'Sob neblina e noite, filtros de recorte (CLIP/SigLIP) pioram o AUPRC em 100% das condições porque o professor sofre colapso de recall. Completar pseudo-rótulos com Grounding DINO recupera os objetos perdidos.',
        projects: 'Mestrado UFSCar (COCO-C · Foggy · BDD100K)',
      },
    ],
    filterAll: 'Todos',
    filterActive: 'Em operação',
    filterGraduated: 'Formados',
    commits90dSuffix: 'commits / 90d',
    starsSuffix: 'estrelas',
    inspectLabel: 'Ficha técnica',
    schematicLabel: 'Esquemático arquitetural',
    invariantLabel: 'Invariante de arquitetura',
    statusLabel: 'Estado operacional',
    commits90dLabel: 'Atividade (90d)',
    releaseLabel: 'Versão publicada',
    figuresLabel: 'Capturas de interface',
    prevProjectLabel: 'Instrumento anterior',
    nextProjectLabel: 'Próximo instrumento',
    moods: {
      formado: 'formado',
      'a-todo-vapor': 'a todo vapor',
      ativo: 'ativo',
      bocejando: 'bocejando',
      cochilando: 'cochilando',
      dormindo: 'dormindo',
    },
    schematics: {
      lente: {
        code: 'FIG. 01 // RÉPLICAS MULTI-SEED & PROVENIÊNCIA',
        formula: 'Config(Pydantic) → {Seed s₁..s₅} → Bootstrap CI₉₅ + run.json',
        stages: ['Pydantic v2 Config', '5× Seeds · GPU cu128', 'IC 95% + run.json'],
        invariant:
          'Falhar antes de alocar GPU (ADR-002) e gravar proveniência completa em run.json (ADR-013) com intervalo de confiança multi-seed.',
        metric: '5 famílias de tarefa · 121 ADRs · v0.17.0',
      },
      custodia: {
        code: 'FIG. 02 // COSTURA PIXELS → METROS & SEGUNDOS',
        formula: 'YOLO26(px) → GroundPlane(H⁻¹) ║ (x,y,t) → CustodyFSM → Queue',
        stages: ['YOLO26 + Homografia', 'Costura (x, y, t) m·s', 'CustodyFSM + Fila'],
        invariant:
          'Zero reconhecimento facial (bloqueado em pré-commit). Posse é depósito espacial no BagRegistry; evaluate.py recusa protocolo inexprimível.',
        metric: '397 testes · 0 falsos alarmes CAVIAR · 600k→fila',
      },
      fliperama: {
        code: 'FIG. 03 // DIVISÃO GEOMETRIA (CV) × SEMÂNTICA (VLM)',
        formula: 'Frame(78ms) → [CV NumPy 3,3ms: Cartas/BFS/Glifos] + [VLM 7B: 1–2×/turno]',
        stages: ['CV Pura (3,3 ms)', 'Qwen2.5-VL 7B (Ollama)', 'DS4 Virtual (vgamepad)'],
        invariant:
          'ADR-022: nunca pedir contagem, coordenada ou rota ao VLM. Glifos de mana aprendidos em runtime (digits.py) e travessia por gamepad.',
        metric: '3,3 ms slots · 1,6 ms HUD · 1–2 chamadas VLM/turno',
      },
      estacao: {
        code: 'FIG. 04 // TELEMETRIA DISTRIBUÍDA EM DUPLA FILA',
        formula: 'Coletores [N₁..Nₖ] → RabbitMQ(Batch + Token) → Core Idempotente → WS/REST',
        stages: ['Coletores em Lote', 'RabbitMQ + Token', 'Core → WebSocket'],
        invariant:
          'Desacoplamento por duas filas RabbitMQ e token de idempotência por lote para absorver reentregas sem duplicar leituras.',
        metric: 'Dupla fila RabbitMQ · Docker Compose · Tempo real',
      },
      scanner: {
        code: 'FIG. 05 // CADEIA DE SINAL ESPACIAL & FREQUÊNCIA',
        formula: 'I(x,y) → [Sobel / Morfologia / Otsu τ*] ∥ [ℱ{I}(u,v) FFT]',
        stages: ['Domínio Espacial', 'Espectro FFT ℱ(u,v)', 'Otsu τ* & Morfologia'],
        invariant:
          'Isolamento estrito entre eventos de interface (main.py) e os 6 módulos matemáticos puros de processamento digital de imagens.',
        metric: '6 módulos puros · Espacial + FFT + Morfologia',
      },
      cafeteira: {
        code: 'FIG. 06 // DECOMPOSIÇÃO WAVELET + CLAHE + ENSEMBLE',
        formula: 'RGB → CLAHE → DWT {LL, LH, HL, HH} → Ensemble CNN → Classe',
        stages: ['Realce CLAHE', 'Sub-bandas Wavelet', 'Ensemble de CNNs'],
        invariant:
          'Fusão de realce local de contraste (CLAHE) e textura multirresolução (Wavelet) antes da votação entre arquiteturas convolucionais.',
        metric: 'Artigo 1º autor WSIS 2024 · TCC UFV',
      },
      plotter: {
        code: 'FIG. 07 // ESPAÇO DE DESCRITORES DE FORMA MPEG7',
        formula: 'Silhueta → Descritores(scikit-image) → Projeção → k-NN (k=3) vs. SVM',
        stages: ['Silhueta MPEG7', 'Descritores Geométricos', 'Fronteira k-NN / SVM'],
        invariant:
          'Extração explícita de descritores morfológicos de contorno para contrastar decisão local (k-NN) e margem máxima (SVM).',
        metric: 'Benchmark MPEG7 · Acurácia, Precisão, Recall, F1',
      },
      esteira: {
        code: 'FIG. 08 // REGIME ASSINTÓTICO & ESCOLHA DE PIVÔ',
        formula: 'Entrada {Cresc, Decresc, Rand} × N ∈ [10¹, 10⁶] → Pivô → T(N)',
        stages: ['N = 10¹..10⁶ (3 regimes)', '4 Pivôs QuickSort + Heap', 'Curva Empírica T(N)'],
        invariant:
          'Medição direta do colapso O(N²) sob entrada ordenada e preservação do regime O(N log N) com pivô por mediana de três e aleatório.',
        metric: '7 algoritmos C++ · N até 1.000.000 · 3 distribuições',
      },
      nevoeiro: {
        code: 'FIG. 09 // TETO DE FILTRAGEM vs. COMPLETAÇÃO OPEN-VOCAB',
        formula: 'Alvo(β=0,02) → Prof(Colapso Recall) ∪ GDINO(Completação) → +0,023 F1',
        stages: ['Desvio (COCO-C / Foggy)', 'Teto: Filtro × Completação', 'Prof ∪ Grounding DINO'],
        invariant:
          'Achados A1–A3: filtrar recortes com CLIP/SigLIP degrada o AUPRC em 100% dos casos; completar objetos perdidos com Grounding DINO recupera o recall.',
        metric: '+0,077 Recall · +0,023 F1 · 1× RTX 5060 Ti',
      },
    },
    publications: [
      {
        year: '2025',
        venue: 'Springer Nature · Lecture Notes on Data Engineering and Communications Technologies (1 ed., pp. 89–100)',
        badge: 'Capítulo Internacional · 1º Autor',
        title:
          'Estimating Application Performance in Container-Based Environments: A Cross-Domain Monitoring Approach',
        authors: 'dos REIS, Marcus V. Diniz; MOREIRA, Rodrigo; RODRIGUES MOREIRA, Larissa F.; de OLIVEIRA SILVA, Flávio',
        note: 'Resultante da bolsa de IC FAPESP (proc. 2024/08973-2) no projeto SFI2, validado no testbed FIBRE-NG da RNP sob orçamento computacional controlado.',
      },
      {
        year: '2025',
        venue: 'Anais do XV Workshop de Sistemas de Informação (WSIS 2025, Rio Paranaíba, pp. 11–19)',
        badge: 'Prêmio de Melhor Artigo',
        title:
          'Unsupervised Specialization of Visual Subclasses Using K-Means in YOLO-Based Detection Pipelines',
        authors: 'MOREIRA, Pedro Henrique Campos; FERREIRA, Bianca Panacho; REIS, Marcus Vinicius Diniz dos',
        note: 'Especialização não supervisionada de subclasses visuais dentro de pipelines de detecção YOLO sem exigir anotação adicional.',
      },
      {
        year: '2025',
        venue: 'Anais do XV Workshop de Sistemas de Informação (WSIS 2025, Rio Paranaíba, pp. 1–10)',
        badge: 'Artigo Completo',
        title: 'Automated Correction of Multiple Choice Tests Using Computer Vision',
        authors: 'MOREIRA, Pedro Henrique Campos; FERREIRA, Bianca Panacho; REIS, Marcus Vinicius Diniz dos',
        note: 'Pipeline de visão computacional para leitura e correção óptica de cartões de resposta sob condições reais de captura fora de laboratório.',
      },
      {
        year: '2024',
        venue: 'Anais do Workshop de Sistemas de Informação (WSIS 2024, pp. 33–38)',
        badge: 'Artigo Completo · 1º Autor',
        title:
          'Quality Assessment of Coffee Beans Using Convolutional Neural Networks with Wavelet and CLAHE Techniques',
        authors: 'REIS, Marcus Vinicius Diniz dos; SOUSA, Pedro Moises de',
        note: 'Origem da linha experimental do TCC: combina realce CLAHE e decomposição Wavelet com redes convolucionais na classificação de grãos (trabalho com citação no Google Scholar).',
      },
    ],
    trajectory: [
      {
        period: '01/2026 — atual',
        role: 'Engenheiro de Visão Computacional',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Celetista (CLT) · 40h/semana',
        detail:
          'Desenvolvimento, implantação e otimização de modelos de detecção de objetos e inferência sobre fluxos de vídeo e dados industriais em produção.',
      },
      {
        period: '2026 — 2028',
        role: 'Mestrado em Ciência da Computação',
        org: 'Universidade Federal de São Carlos (UFSCar)',
        regime: 'PPGCC · RA 847647',
        detail:
          'Orientador: Prof. Dr. Jurandy Gomes de Almeida Junior. Pesquisa em adaptação de domínio e detectores de objetos de vocabulário aberto.',
      },
      {
        period: '01/2025 — 12/2025',
        role: 'Desenvolvedor de Visão Computacional (Estágio)',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Estagiário · 30h/semana',
        detail:
          'Desenvolvimento e validação de pipelines de visão computacional e modelos de deep learning aplicados a cenários industriais.',
      },
      {
        period: '2024 — 2025',
        role: 'Bolsista de Iniciação Científica FAPESP (proc. 2024/08973-2)',
        org: 'Projeto SFI2 · Testbed FIBRE-NG (RNP)',
        regime: 'Pesquisa Financiada FAPESP',
        detail:
          'Coordenador: Prof. Dr. Flávio de Oliveira Silva. Agentes de Aprendizado por Reforço e monitoramento cross-domain em ambientes conteinerizados.',
      },
      {
        period: '2022 — 2026',
        role: 'Bacharelado em Sistemas de Informação',
        org: 'Universidade Federal de Viçosa (UFV)',
        regime: 'Graduação · Campus Rio Paranaíba',
        detail:
          'TCC orientado pelo Prof. Dr. Pedro Moises de Sousa sobre análise da qualidade de grãos de café com CNNs e ensemble. Monitor remunerado de Matemática Discreta (2024).',
      },
    ],
  },
  en: {
    siteTitle: 'Marcus Vinicius — computer vision & ML engineering',
    siteDescription:
      'Portfolio and academic-engineering dossier of Marcus Vinicius Diniz dos Reis: computer vision, object detection, M.Sc. research at UFSCar and open-source software.',
    thesis: 'I build instruments for seeing.',
    intro:
      'Computer-vision engineer at Pix Force and M.Sc. candidate in Computer Science at UFSCar. Every entry in this notebook documents the architecture, the mathematical seam and the live telemetry of my public repositories.',
    yearLabel: 'Period',
    stackLabel: 'Stack',
    repoLabel: 'GitHub Repository',
    backLabel: 'Back to the bench',
    lastCommitLabel: 'last commit',
    aboutHeading: 'Personal, Academic & Professional Dossier',
    aboutSubtitle:
      'Complete record compiled from the CNPq Lattes CV (ID 8185221944541336), the FAPESP Curricular Summary, and academic records at UFSCar and UFV.',
    lattesSummaryHeading: 'Curricular Summary (Official Lattes Text)',
    lattesSummaryQuote:
      'Machine Learning Engineer and Computer Vision researcher with experience in applied AI research and Deep Learning model development. Works with CNNs, object detection and image processing, with a track record of training and deploying models within MLOps pipelines and scalable systems.',
    aboutBody: [
      'Born on 8 March 2004, I am a computer-vision engineer at Pix Force (having joined as an intern in January 2025 and transitioned to full-time engineer in January 2026) and an M.Sc. candidate in Computer Science at PPGCC/UFSCar advised by Prof. Dr. Jurandy Gomes de Almeida Junior.',
      'Holding a B.Sc. in Information Systems from the Federal University of Viçosa (UFV — Rio Paranaíba Campus), I built my research foundation across digital signal processing, convolutional neural networks and distributed systems: serving as a FAPESP Undergraduate Research Fellow (grant 2024/08973-2) on the SFI2 project over the RNP FIBRE-NG testbed, an undergraduate CV researcher on coffee-bean grading, and a stipendiary teaching assistant for Discrete Mathematics.',
      'A single 16 GB RTX 5060 Ti (Blackwell sm_120, cu128). No cluster. Everything I publish runs on one workstation GPU — which is why every system is engineered to fit its budget, measure its own uncertainty and justify every model call.',
    ],
    profileCardHeading: 'Biographical & Bibliographic Identification',
    bioFields: [
      { label: 'Full name', value: 'Marcus Vinicius Diniz dos Reis' },
      {
        label: 'Bibliographic citation names',
        value: 'REIS, M. V. D.; REIS, MARCUS VINICIUS DINIZ DOS; dos Reis, Marcus V. Diniz; REIS, Marcus Vinicius Diniz dos',
      },
      { label: 'Birth date & Nationality', value: '08/03/2004 · Brazilian' },
      { label: 'Location', value: 'São Carlos, SP · Rio Paranaíba / Viçosa, MG — Brazil' },
      { label: 'Industry role', value: 'Pix Force Tecnologia Ltda. · Computer Vision Engineer (Full-time, 40h/wk)' },
      { label: 'Academic affiliation', value: 'PPGCC / UFSCar · M.Sc. in Computer Science (RA 847647)' },
      { label: 'CNPq Lattes ID', value: '8185221944541336' },
      { label: 'ORCID iD', value: '0009-0002-1464-431X' },
    ],
    indicatorsHeading: 'Quantitative Production Indicators',
    indicators: [
      {
        value: '3+ yrs',
        label: 'Active in Computer Vision',
        detail: 'Continuous research since 2023 and production engineering since Jan/2025.',
      },
      {
        value: '1',
        label: 'International Book Chapter',
        detail: 'Springer Nature Switzerland (LNDECT, 2025, pp. 89–100) as 1st author.',
      },
      {
        value: '3',
        label: 'Full Conference Papers',
        detail: 'Peer-reviewed proceedings papers in WSIS 2024 and XV WSIS 2025.',
      },
      {
        value: '7',
        label: 'Events, Workshops & Exhibitions',
        detail: 'Presentations across WVC, WSIS, Digital Games Showcase and Professions Fair.',
      },
      {
        value: '5',
        label: 'Awards, Fellowships & Honours',
        detail: 'Best Paper, 1st Place CV Hackathon, FAPESP Fellowship, Best Poster & Marathon.',
      },
      {
        value: 'h = 1',
        label: 'Bibliometric Index',
        detail: 'Google Scholar (ID 5jCt_wYAAAAJ · indexed citation in 2025).',
      },
    ],
    experienceHeading: 'Professional Experience (Industry)',
    experience: [
      {
        period: '01/2026 — present',
        role: 'Computer Vision Engineer',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Full-time (CLT) · 40h / week',
        detail:
          'Developing, deploying and optimising computer-vision models with an emphasis on object detection and real-world data analysis: dataset curation, model training, rigorous evaluation and integration of inference pipelines into production systems.',
      },
      {
        period: '01/2025 — 12/2025',
        role: 'Computer Vision Developer',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Internship · 30h / week',
        detail:
          'Implementation, experimentation and validation of deep-learning models and image/video processing routines for industrial inspection and monitoring solutions.',
      },
    ],
    educationHeading: 'Academic Education & Degrees',
    education: [
      {
        period: '2026 — 2028',
        role: 'M.Sc. in Computer Science',
        org: 'Federal University of São Carlos (UFSCar) · São Carlos, SP',
        regime: 'Graduate Degree · RA 847647',
        detail:
          'Advisor: Prof. Dr. Jurandy Gomes de Almeida Junior. Research on unsupervised domain adaptation (UDA) and open-vocabulary object detectors under compound shift.',
      },
      {
        period: '2022 — 2026',
        role: 'B.Sc. in Information Systems',
        org: 'Federal University of Viçosa (UFV) · Rio Paranaíba Campus, MG',
        regime: 'Undergraduate Degree',
        detail:
          'B.Sc. Thesis: "Quality assessment of coffee beans using convolutional neural networks with ensemble techniques". Advisor: Prof. Dr. Pedro Moises de Sousa.',
      },
      {
        period: '2020 — 2021',
        role: 'High School Diploma (Ensino Médio)',
        org: 'Instituto Samaritano (SAM) · Brazil',
        regime: 'Secondary Education',
        detail: 'Completed secondary education.',
      },
    ],
    academicProjectsHeading: 'Formal Research & Teaching Projects (Lattes)',
    academicProjects: [
      {
        period: '2024 — 2025',
        kind: 'Research Project · FAPESP Fellowship',
        code: 'FAPESP grant 2024/08973-2 · SFI2 Project',
        title:
          'Building and validating a flexible Reinforcement Learning agent for Network Slicing Architectures',
        org: 'UFV & RNP FIBRE-NG National Testbed',
        advisor: 'Coordinator: Prof. Dr. Flávio de Oliveira Silva · Member: Rodrigo Moreira',
        detail:
          'Experimental design and validation on the RNP FIBRE-NG testbed of machine-learning and cross-domain monitoring approaches for SLA assurance in network slices over containerised microservice architectures. Resulted in the 1st-author Springer Nature chapter (2025).',
      },
      {
        period: '2024 — 2025',
        kind: 'Research Project · Undergraduate Research (IC)',
        code: 'Computer Vision IC · UFV',
        title:
          'Coffee-bean quality analysis using convolutional neural networks with wavelet techniques',
        org: 'Federal University of Viçosa (UFV)',
        advisor: 'Coordinator: Prof. Dr. Pedro Moises de Sousa',
        detail:
          'Public dataset curation, morphological preprocessing, local contrast enhancement (CLAHE), Discrete Wavelet Transform decomposition and training/validation of CNN architectures and ensembles.',
      },
      {
        period: '2024',
        kind: 'Teaching Project · Academic Teaching Assistantship',
        code: 'Competitive Stipendiary Fellowship · UFV',
        title: 'Stipendiary Teaching Assistantship in Discrete Mathematics',
        org: 'Federal University of Viçosa (UFV)',
        advisor: 'Coordinator: Prof. Dr. Pedro Moises de Sousa',
        detail:
          'Assisted instruction in formal logic, set theory, relations, mathematical induction and combinatorics, holding office hours and authoring/grading problem sets.',
      },
    ],
    awardsHeading: 'Awards, Fellowships & Academic Honours',
    awards: [
      {
        year: '2025',
        title: 'Best Paper Award',
        venue: 'XV Information Systems Workshop (WSIS), UFV',
      },
      {
        year: '2024',
        title: '1st Place — Computer Vision Hackathon',
        venue: 'Computer Vision Workshop (WVC), UFV',
      },
      {
        year: '2024',
        title: 'FAPESP Undergraduate Research Fellowship (Academic Merit)',
        venue: 'São Paulo Research Foundation (grant 2024/08973-2)',
      },
      {
        year: '2023',
        title: 'Best Poster Award',
        venue: 'Information Systems Workshop (WSIS), UFV',
      },
      {
        year: '2023',
        title: '2nd Place — Programming Marathon',
        venue: 'Federal University of Viçosa (UFV)',
      },
    ],
    eventsHeading: 'Conferences, Workshops, Hackathons & Exhibitions',
    events: [
      {
        year: '2025',
        kind: 'Workshop · Award-Winning Paper Presentation',
        event: 'XV Information Systems Workshop (WSIS 2025)',
        work: 'Unsupervised Specialization of Visual Subclasses Using K-Means in YOLO-Based Detection Pipelines',
      },
      {
        year: '2025',
        kind: 'Workshop · Full Paper Presentation',
        event: 'XV Information Systems Workshop (WSIS 2025)',
        work: 'Automated Correction of Multiple Choice Tests Using Computer Vision',
      },
      {
        year: '2024',
        kind: 'Workshop & Hackathon · 1st Place Overall',
        event: 'Computer Vision Workshop (WVC 2024)',
        work: 'Prototype Solution for Identifying Player Team Affiliation in Sports Videos',
      },
      {
        year: '2024',
        kind: 'Technology Exhibition',
        event: 'Digital Games Showcase (Mostra de Jogos Digitais — UFV)',
        work: 'Alfabeto Mágico — Interactive educational digital game',
      },
      {
        year: '2024',
        kind: 'Workshop · Oral Presentation (1st Author)',
        event: 'Information Systems Workshop (WSIS 2024)',
        work: 'Quality Assessment of Coffee Beans Using Convolutional Neural Networks with Wavelet and CLAHE Techniques',
      },
      {
        year: '2023',
        kind: 'Workshop · Award-Winning Poster Presentation',
        event: 'Information Systems Workshop (WSIS 2023)',
        work: 'AI Development: Coffee-bean quality analysis using convolutional neural networks with wavelet techniques',
      },
      {
        year: '2023',
        kind: 'Outreach Exhibition',
        event: 'Professions Fair (Mostra de Profissões — UFV)',
        work: 'Introduction to ChatBots — Interactive demonstration of conversational systems',
      },
    ],
    skillsHeading: 'Technical Competency Matrix',
    skillGroups: [
      {
        category: 'Computer Vision & Signal Processing',
        items: [
          'OpenCV',
          'Scikit-image',
          'Ground-Plane Homography',
          'CLAHE',
          'Discrete Wavelet Transform (DWT)',
          '2D FFT Spectrum',
          'Mathematical Morphology',
          'Otsu Segmentation',
          'MPEG7 Shape Descriptors',
          'Multi-Object Tracking',
        ],
      },
      {
        category: 'Deep Learning & Multimodal Models (VLMs)',
        items: [
          'PyTorch',
          'TensorFlow / Keras',
          'Scikit-learn',
          'YOLO (v8 / v11 / v26)',
          'RT-DETR',
          'Faster R-CNN',
          'Grounding DINO',
          'OWLv2',
          'CLIP',
          'SigLIP 2',
          'DINOv2',
          'Qwen2.5-VL (Ollama)',
        ],
      },
      {
        category: 'Software Engineering, Distributed Systems & MLOps',
        items: [
          'Python 3.12',
          'C++',
          'TypeScript',
          'FastAPI',
          'React 19',
          'RabbitMQ',
          'WebSockets / SSE',
          'SQLite (WAL)',
          'Pydantic v2',
          'Docker & Kubernetes',
          'Linux',
          'Git / Pre-commit CI',
          'Pytest · Vitest · Playwright',
        ],
      },
    ],
    languagesHeading: 'Languages',
    languages: [
      {
        language: 'Portuguese',
        level: 'Native',
        detail: 'Listens well · Speaks well · Reads well · Writes well',
      },
      {
        language: 'English',
        level: 'Technical & Scientific Proficiency',
        detail: 'Listens well · Reads well · Writes well · Intermediate spoken (scientific paper authorship and code documentation)',
      },
    ],
    contactHeading: 'Academic Profiles, Identifiers & Contact',
    contact: [
      { label: 'GitHub', value: '@marcus-vreis', href: 'https://github.com/marcus-vreis' },
      { label: 'LinkedIn', value: 'in/marcus-vinicius-diniz', href: 'https://www.linkedin.com/in/marcus-vinicius-diniz/' },
      { label: 'Google Scholar', value: '5jCt_wYAAAAJ (h = 1)', href: 'https://scholar.google.com/citations?user=5jCt_wYAAAAJ' },
      { label: 'ORCID', value: '0009-0002-1464-431X', href: 'https://orcid.org/0009-0002-1464-431X' },
      { label: 'Lattes CV', value: 'CNPq 8185221944541336', href: 'http://lattes.cnpq.br/8185221944541336' },
      { label: 'Email', value: 'marcusvinicius0083@gmail.com', href: 'mailto:marcusvinicius0083@gmail.com' },
    ],
    name: 'Marcus Vinicius',
    fullName: 'Marcus Vinicius Diniz dos Reis',
    citationShort: 'REIS, M. V. D.',
    birthAndNationality: '08/03/2004 · Brazil',
    locationLabel: 'São Carlos, SP · Viçosa / Rio Paranaíba, MG',
    portraitAlt: 'Optical calibration and telemetry schematic console',
    authorPhotoAlt: 'Portrait of Marcus Vinicius Diniz dos Reis',
    projectsHeading: 'Public Instruments & Projects',
    projectsSubtitle:
      'Eight public open-source repositories on GitHub. Operational mood and commit counts come from the daily snapshot committed to the repo — the build never touches the network.',
    researchHeading: 'Master’s Research · UFSCar',
    researchSubtitle:
      'Empirical study and teacher–student self-training under domain shift (COCO-C, Foggy Cityscapes and BDD100K).',
    publicationsHeading: 'Scientific Publications',
    publicationsSubtitle:
      'Peer-reviewed papers in an international book series (Springer Nature) and conference proceedings.',
    trajectoryHeading: 'Professional & Academic Timeline',
    hardwareHeading: 'Bench Constraint',
    hardwareSpec: '1× NVIDIA RTX 5060 Ti · 16 GB VRAM · sm_120 (cu128)',
    hardwareDetail:
      'Fixed compute budget: every experiment, training loop or local agent is designed to run end-to-end on a single workstation GPU.',
    navProjects: 'Instruments',
    navResearch: 'Research',
    navPublications: 'Publications',
    navAbout: 'Dossier',
    heroBadge: 'ENGINEERING NOTEBOOK // COMPUTER VISION',
    heroAffiliation: 'UFSCar M.Sc. (RA 847647) · Pix Force · UFV B.Sc.',
    telemetryHeading: 'Repository Telemetry',
    telemetrySnapshotLabel: 'UTC Snapshot',
    telemetryCommitsLabel: 'Commits / 90 days',
    telemetryActiveLabel: 'Active projects',
    telemetryReleaseLabel: 'Latest release',
    pillarsHeading: 'Three Engineering Seams',
    pillars: [
      {
        id: 'seam',
        code: 'SEAM 01 // GEOMETRY vs. SEMANTICS',
        title: 'Pixels only go as far as geometry requires',
        formula: 'I(u,v) → H⁻¹ → (x, y, t) ∈ ℝ² × ℝ',
        summary:
          'In custody-watch, everything right of the ground plane consumes only metres and seconds; in VampireAI (ADR-022), pure NumPy functions solve cards and minimap BFS in 3.3 ms so the VLM decides only semantics (1–2× per turn).',
        projects: 'custody-watch · VampireAI · ImageLab',
      },
      {
        id: 'rigor',
        code: 'SEAM 02 // PROVENANCE & REFUSAL',
        title: 'Every reported number must be defensible',
        formula: 'μ ± CI₉₅(bootstrap, K=5 seeds) · run.json',
        summary:
          'In VisionForge, every run records environment and hyperparameters to run.json and compares models across multi-seed replicates. In custody-watch, evaluate.py refuses to compute P_miss at 25 s when CAVIAR’s longest abandonment lasts 13.3 s.',
        projects: 'VisionForge · custody-watch · CoffeeBean',
      },
      {
        id: 'domain',
        code: 'SEAM 03 // DOMAIN SHIFT',
        title: 'Completion beats filtering when recall collapses',
        formula: 'Ŷ = Y_teacher(τ) ∪ Y_GDINO(c ∉ Y_teacher) → +0.077 Recall',
        summary:
          'Under fog and night shift, crop-level VLM filters (CLIP/SigLIP) degrade AUPRC across 100% of conditions because the teacher suffers recall collapse. Completing pseudo-labels with Grounding DINO recovers missed objects.',
        projects: 'UFSCar M.Sc. (COCO-C · Foggy · BDD100K)',
      },
    ],
    filterAll: 'All',
    filterActive: 'Active',
    filterGraduated: 'Graduated',
    commits90dSuffix: 'commits / 90d',
    starsSuffix: 'stars',
    inspectLabel: 'Spec sheet',
    schematicLabel: 'Architectural schematic',
    invariantLabel: 'Architectural invariant',
    statusLabel: 'Operational state',
    commits90dLabel: 'Activity (90d)',
    releaseLabel: 'Latest release',
    figuresLabel: 'Interface captures',
    prevProjectLabel: 'Previous instrument',
    nextProjectLabel: 'Next instrument',
    moods: {
      formado: 'graduated',
      'a-todo-vapor': 'full steam',
      ativo: 'active',
      bocejando: 'yawning',
      cochilando: 'napping',
      dormindo: 'asleep',
    },
    schematics: {
      lente: {
        code: 'FIG. 01 // MULTI-SEED REPLICATES & PROVENANCE',
        formula: 'Config(Pydantic) → {Seed s₁..s₅} → Bootstrap CI₉₅ + run.json',
        stages: ['Pydantic v2 Config', '5× Seeds · GPU cu128', '95% CI + run.json'],
        invariant:
          'Fail before touching GPU time (ADR-002) and record full provenance in run.json (ADR-013) with multi-seed confidence intervals.',
        metric: '5 task families · 121 ADRs · v0.17.0',
      },
      custodia: {
        code: 'FIG. 02 // PIXEL → METRE & SECOND SEAM',
        formula: 'YOLO26(px) → GroundPlane(H⁻¹) ║ (x,y,t) → CustodyFSM → Queue',
        stages: ['YOLO26 + Homography', 'Seam (x, y, t) m·s', 'CustodyFSM + Queue'],
        invariant:
          'Zero facial recognition (blocked by pre-commit). Ownership is a spatial deposit in BagRegistry; evaluate.py refuses unexpressible protocols.',
        metric: '397 tests · 0 CAVIAR false alarms · 600k→queue',
      },
      fliperama: {
        code: 'FIG. 03 // GEOMETRY (CV) × SEMANTICS (VLM) SPLIT',
        formula: 'Frame(78ms) → [NumPy CV 3.3ms: Cards/BFS/Glyphs] + [VLM 7B: 1–2×/turn]',
        stages: ['Pure CV (3.3 ms)', 'Qwen2.5-VL 7B (Ollama)', 'Virtual DS4 (vgamepad)'],
        invariant:
          'ADR-022: never ask the VLM for counts, coordinates or paths. Runtime-learned mana glyphs (digits.py) and virtual gamepad traversal.',
        metric: '3.3 ms slots · 1.6 ms HUD · 1–2 VLM calls/turn',
      },
      estacao: {
        code: 'FIG. 04 // DUAL-QUEUE DISTRIBUTED TELEMETRY',
        formula: 'Collectors [N₁..Nₖ] → RabbitMQ(Batch + Token) → Idempotent Core → WS/REST',
        stages: ['Batch Collectors', 'RabbitMQ + Token', 'Core → WebSocket'],
        invariant:
          'Decoupled via two RabbitMQ queues and per-batch idempotency tokens to absorb redeliveries without duplicating sensor readings.',
        metric: 'Dual RabbitMQ queues · Docker Compose · Live WS',
      },
      scanner: {
        code: 'FIG. 05 // SPATIAL & FREQUENCY SIGNAL CHAIN',
        formula: 'I(x,y) → [Sobel / Morphology / Otsu τ*] ∥ [ℱ{I}(u,v) FFT]',
        stages: ['Spatial Domain', 'FFT Spectrum ℱ(u,v)', 'Otsu τ* & Morphology'],
        invariant:
          'Strict separation between UI event handling (main.py) and the 6 pure mathematical digital image processing modules.',
        metric: '6 pure modules · Spatial + FFT + Morphology',
      },
      cafeteira: {
        code: 'FIG. 06 // WAVELET + CLAHE + CNN ENSEMBLE',
        formula: 'RGB → CLAHE → DWT {LL, LH, HL, HH} → CNN Ensemble → Grade',
        stages: ['CLAHE Contrast', 'Wavelet Subbands', 'CNN Ensemble'],
        invariant:
          'Fuses local contrast enhancement (CLAHE) and multiresolution texture subbands (Wavelet) prior to multi-CNN ensemble voting.',
        metric: '1st-author paper WSIS 2024 · B.Sc. Thesis',
      },
      plotter: {
        code: 'FIG. 07 // MPEG7 SHAPE DESCRIPTOR SPACE',
        formula: 'Silhouette → Descriptors(scikit-image) → Projection → k-NN (k=3) vs. SVM',
        stages: ['MPEG7 Silhouette', 'Geometric Descriptors', 'k-NN / SVM Boundary'],
        invariant:
          'Explicit contour and region descriptor extraction to contrast local neighbourhood decision (k-NN) against maximum-margin (SVM).',
        metric: 'MPEG7 benchmark · Accuracy, Precision, Recall, F1',
      },
      esteira: {
        code: 'FIG. 08 // ASYMPTOTIC REGIME & PIVOT SELECTION',
        formula: 'Input {Asc, Desc, Rand} × N ∈ [10¹, 10⁶] → Pivot → T(N)',
        stages: ['N = 10¹..10⁶ (3 regimes)', '4 QuickSort Pivots + Heap', 'Empirical T(N) Curve'],
        invariant:
          'Direct measurement of O(N²) collapse on ordered inputs and O(N log N) preservation via median-of-three and randomised pivots.',
        metric: '7 C++ algorithms · N up to 1,000,000 · 3 distributions',
      },
      nevoeiro: {
        code: 'FIG. 09 // FILTERING CEILING vs. OPEN-VOCAB COMPLETION',
        formula: 'Target(β=0.02) → Teacher(Recall Collapse) ∪ GDINO(Completion) → +0.023 F1',
        stages: ['Shift (COCO-C / Foggy)', 'Ceiling: Filter × Complete', 'Teacher ∪ Grounding DINO'],
        invariant:
          'Findings A1–A3: crop filtering with CLIP/SigLIP degrades AUPRC in 100% of cases; completing missed objects with Grounding DINO recovers recall.',
        metric: '+0.077 Recall · +0.023 F1 · 1× RTX 5060 Ti',
      },
    },
    publications: [
      {
        year: '2025',
        venue: 'Springer Nature · Lecture Notes on Data Engineering and Communications Technologies (1st ed., pp. 89–100)',
        badge: 'International Book Chapter · 1st Author',
        title:
          'Estimating Application Performance in Container-Based Environments: A Cross-Domain Monitoring Approach',
        authors: 'dos REIS, Marcus V. Diniz; MOREIRA, Rodrigo; RODRIGUES MOREIRA, Larissa F.; de OLIVEIRA SILVA, Flávio',
        note: 'Produced during the FAPESP undergraduate fellowship (grant 2024/08973-2) within the SFI2 project, validated on the RNP FIBRE-NG testbed under controlled compute budgets.',
      },
      {
        year: '2025',
        venue: 'Proceedings of the XV Information Systems Workshop (WSIS 2025, Rio Paranaíba, pp. 11–19)',
        badge: 'Best Paper Award',
        title:
          'Unsupervised Specialization of Visual Subclasses Using K-Means in YOLO-Based Detection Pipelines',
        authors: 'MOREIRA, Pedro Henrique Campos; FERREIRA, Bianca Panacho; REIS, Marcus Vinicius Diniz dos',
        note: 'Unsupervised visual subclass specialisation inside YOLO detection pipelines without requiring extra bounding-box labels.',
      },
      {
        year: '2025',
        venue: 'Proceedings of the XV Information Systems Workshop (WSIS 2025, Rio Paranaíba, pp. 1–10)',
        badge: 'Full Paper',
        title: 'Automated Correction of Multiple Choice Tests Using Computer Vision',
        authors: 'MOREIRA, Pedro Henrique Campos; FERREIRA, Bianca Panacho; REIS, Marcus Vinicius Diniz dos',
        note: 'Computer-vision pipeline for optical answer-sheet grading validated under real-world, non-laboratory capture conditions.',
      },
      {
        year: '2024',
        venue: 'Proceedings of the Information Systems Workshop (WSIS 2024, pp. 33–38)',
        badge: 'Full Paper · 1st Author',
        title:
          'Quality Assessment of Coffee Beans Using Convolutional Neural Networks with Wavelet and CLAHE Techniques',
        authors: 'REIS, Marcus Vinicius Diniz dos; SOUSA, Pedro Moises de',
        note: 'Origin of the B.Sc. thesis experimental line: pairs CLAHE contrast enhancement and Wavelet decomposition with CNN architectures (cited on Google Scholar).',
      },
    ],
    trajectory: [
      {
        period: '01/2026 — present',
        role: 'Computer Vision Engineer',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Full-time (CLT) · 40h/week',
        detail:
          'Developing, deploying and optimising object-detection models and production inference pipelines over real-world video streams and industrial data.',
      },
      {
        period: '2026 — 2028',
        role: 'M.Sc. in Computer Science',
        org: 'Federal University of São Carlos (UFSCar)',
        regime: 'PPGCC · RA 847647',
        detail:
          'Advisor: Prof. Dr. Jurandy Gomes de Almeida Junior. Research on domain adaptation and open-vocabulary object detectors.',
      },
      {
        period: '01/2025 — 12/2025',
        role: 'Computer Vision Developer (Intern)',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Internship · 30h/week',
        detail:
          'Developed and validated computer-vision pipelines and deep-learning models applied to industrial scenarios.',
      },
      {
        period: '2024 — 2025',
        role: 'FAPESP Undergraduate Research Fellow (grant 2024/08973-2)',
        org: 'SFI2 Project · RNP FIBRE-NG Testbed',
        regime: 'FAPESP Funded Research',
        detail:
          'Advisor: Prof. Dr. Flávio de Oliveira Silva. Reinforcement-learning agents for network slicing and cross-domain container monitoring.',
      },
      {
        period: '2022 — 2026',
        role: 'B.Sc. in Information Systems',
        org: 'Federal University of Viçosa (UFV)',
        regime: 'Undergraduate · Rio Paranaíba Campus',
        detail:
          'Thesis advised by Prof. Dr. Pedro Moises de Sousa on coffee-bean quality assessment using CNNs and ensembles. Stipendiary teaching assistant for Discrete Mathematics (2024).',
      },
    ],
  },
};
