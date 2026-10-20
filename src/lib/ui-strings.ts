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

export type ContactIconId =
  | 'github'
  | 'scholar'
  | 'linkedin'
  | 'orcid'
  | 'lattes'
  | 'email';

export interface InlineSegment {
  text: string;
  href?: string;
  external?: boolean;
}

/**
 * Converte marcações `[rótulo](url)` de uma string de `ui-strings.ts`
 * em segmentos estruturados para renderização de links inline sem HTML bruto.
 */
export function parseInlineLinks(input: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: input.slice(lastIndex, match.index) });
    }
    const href = match[2];
    segments.push({
      text: match[1],
      href,
      external: href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:'),
    });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({ text: input.slice(lastIndex) });
  }

  return segments;
}

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
  doi: string;
  href: string;
  note: string;
}

export interface TrajectoryItem {
  period: string;
  role: string;
  org: string;
  orgHref?: string;
  regime: string;
  detail: string;
}

export interface AcademicProjectItem {
  period: string;
  kind: string;
  code: string;
  title: string;
  href?: string;
  org: string;
  advisor: string;
  detail: string;
}

export interface AwardItem {
  year: string;
  title: string;
  venue: string;
  href?: string;
}

export interface EventItem {
  year: string;
  kind: string;
  event: string;
  work: string;
  href?: string;
}

export interface IndicatorItem {
  value: string;
  label: string;
  detail: string;
}

export interface BioFieldItem {
  label: string;
  value: string;
  href?: string;
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
  projectLinks: { label: string; href: string }[];
}

export interface ContactItem {
  icon: ContactIconId;
  label: string;
  value: string;
  href: string;
}

export interface UiStrings {
  siteTitle: string;
  siteDescription: string;
  thesis: string;
  intro: string[];
  researchAreasLabel: string;
  researchAreas: string[];
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
  contact: ContactItem[];
  name: string;
  fullName: string;
  citationShort: string;
  heroRolePrimary: string;
  heroRoleSecondary: string;
  heroDegreeLine: string;
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
  doiLabel: string;
  trajectoryHeading: string;
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
    siteTitle: 'Marcus Vinicius Diniz dos Reis · Visão Computacional & Engenharia de ML',
    siteDescription:
      'Portfólio e currículo acadêmico de Marcus Vinicius Diniz dos Reis: visão computacional, detecção de objetos, pesquisa de mestrado na UFSCar e software open-source.',
    thesis: 'Visão computacional, detecção de objetos e sistemas de aprendizado de máquina.',
    intro: [
      'Sou engenheiro de visão computacional na Pix Force e mestrando em Ciência da Computação no [PPGCC da UFSCar](https://www.ppgcc.dc.ufscar.br/), orientado pelo [Prof. Dr. Jurandy Gomes de Almeida Junior](https://scholar.google.com/citations?user=a4L1sbcAAAAJ). Minha [pesquisa de mestrado](/projeto/uda-ovd) investiga a degradação de detectores de objetos e esquemas professor-aluno sob deslocamento de domínio (neblina, noite e corrupções sintéticas).',
      'Graduado em Sistemas de Informação pela [Universidade Federal de Viçosa (UFV)](https://www.crp.ufv.br/) e ex-bolsista de Iniciação Científica da [FAPESP](https://bv.fapesp.br/) no projeto SFI2, desenvolvo ferramentas de código aberto como o [VisionForge](/projeto/visionforge) (registrado no [Zenodo](https://doi.org/10.5281/zenodo.23425765) e no [PyPI](https://pypi.org/project/visionforge-studio/)), o sistema de rastreamento de bagagem [custody-watch](/projeto/custody-watch) e o agente multimodal [VampireAI](/projeto/vampireai).',
    ],
    researchAreasLabel: 'Linhas de atuação',
    researchAreas: [
      'Detecção de Objetos (YOLO / RT-DETR)',
      'Adaptação de Domínio (UDA)',
      'Detectores Open-Vocabulary & VLMs',
      'Inferência em Vídeo & MLOps',
    ],
    yearLabel: 'Período',
    stackLabel: 'Stack',
    repoLabel: 'Repositório no GitHub',
    backLabel: 'Voltar para o início',
    lastCommitLabel: 'último commit',
    aboutHeading: 'Currículo Acadêmico & Profissional',
    aboutSubtitle:
      'Dados compilados do [Currículo Lattes (CNPq 8185221944541336)](http://lattes.cnpq.br/8185221944541336), da Súmula Curricular FAPESP e dos registros na [UFSCar](https://www.ppgcc.dc.ufscar.br/) e na [UFV](https://www.crp.ufv.br/).',
    lattesSummaryHeading: 'Resumo Curricular (Currículo Lattes)',
    lattesSummaryQuote:
      'Engenheiro de Machine Learning e pesquisador em Visão Computacional, com experiência em pesquisa aplicada de IA e desenvolvimento de modelos de Deep Learning. Atua com CNNs, detecção de objetos e processamento de imagens, com histórico em treinamento e deploy de modelos dentro de pipelines de MLOps e sistemas escaláveis.',
    aboutBody: [
      'Ingressei na Pix Force em janeiro de 2025 como estagiário de visão computacional e passo a atuar como engenheiro celetista em tempo integral em janeiro de 2026, trabalhando com preparação de dados, treinamento, avaliação e implantação de detectores de objetos em vídeo. Paralelamente, curso o mestrado em Ciência da Computação na [UFSCar](https://www.ppgcc.dc.ufscar.br/) (RA 847647) sob orientação do [Prof. Dr. Jurandy Gomes de Almeida Junior](https://scholar.google.com/citations?user=a4L1sbcAAAAJ).',
      'Durante o bacharelado em Sistemas de Informação na [UFV](https://www.crp.ufv.br/) (2022–2026), fui bolsista de Iniciação Científica da [FAPESP](https://bv.fapesp.br/) (processo 2024/08973-2) no projeto SFI2, com experimentos executados no testbed nacional FIBRE-NG da RNP sob coordenação do Prof. Dr. Flávio de Oliveira Silva. Na mesma instituição, desenvolvi pesquisa de iniciação científica e TCC sobre inspeção de grãos de café com redes convolucionais, Transformada Wavelet e CLAHE ([ComputerVision-CoffeeBean](/projeto/coffeebean)), além de atuar como monitor remunerado de Matemática Discreta sob orientação do Prof. Dr. Pedro Moises de Sousa.',
    ],
    profileCardHeading: 'Identificação & Registros',
    bioFields: [
      { label: 'Nome completo', value: 'Marcus Vinicius Diniz dos Reis' },
      {
        label: 'Nome em citações bibliográficas',
        value: 'REIS, M. V. D.; REIS, MARCUS VINICIUS DINIZ DOS; dos Reis, Marcus V. Diniz; REIS, Marcus Vinicius Diniz dos',
      },
      { label: 'Nascimento & Nacionalidade', value: '08/03/2004 · Brasileira' },
      { label: 'Localização', value: 'São Carlos, SP · Rio Paranaíba / Viçosa, MG — Brasil' },
      { label: 'Atuação na indústria', value: 'Pix Force Tecnologia Ltda. · Engenheiro de Visão Computacional (CLT, 40h)' },
      {
        label: 'Pós-graduação',
        value: 'PPGCC / UFSCar · Mestrado em Ciência da Computação (RA 847647)',
        href: 'https://www.ppgcc.dc.ufscar.br/',
      },
      {
        label: 'Currículo Lattes (CNPq)',
        value: '8185221944541336',
        href: 'http://lattes.cnpq.br/8185221944541336',
      },
      {
        label: 'ORCID iD',
        value: '0009-0002-1464-431X',
        href: 'https://orcid.org/0009-0002-1464-431X',
      },
    ],
    indicatorsHeading: 'Indicadores de Produção',
    indicators: [
      {
        value: '3+ anos',
        label: 'Visão Computacional',
        detail: 'Pesquisa iniciada em 2023 e atuação industrial desde jan/2025.',
      },
      {
        value: '1',
        label: 'Capítulo Internacional',
        detail: 'Springer Nature Switzerland (LNDECT, 2025, pp. 89–100) como 1º autor.',
      },
      {
        value: '3',
        label: 'Artigos em Anais',
        detail: 'Artigos completos publicados no WSIS 2024 e no XV WSIS 2025 (SBC).',
      },
      {
        value: '7',
        label: 'Eventos & Exposições',
        detail: 'Apresentações no WVC, WSIS, Mostra de Jogos Digitais e Mostra de Profissões.',
      },
      {
        value: '5',
        label: 'Prêmios & Bolsas',
        detail: 'Melhor Artigo WSIS, 1º Lugar Hackathon WVC, Bolsa FAPESP, Melhor Pôster e Maratona.',
      },
      {
        value: 'h = 1',
        label: 'Google Scholar',
        detail: 'Citações indexadas no perfil acadêmico (ID 5jCt_wYAAAAJ).',
      },
    ],
    experienceHeading: 'Experiência Profissional',
    experience: [
      {
        period: '01/2026 — atual',
        role: 'Engenheiro de Visão Computacional',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Celetista (CLT) · 40h semanais',
        detail:
          'Desenvolvimento, treinamento, avaliação e implantação de modelos de visão computacional voltados à detecção de objetos e análise de vídeo em ambientes de produção.',
      },
      {
        period: '01/2025 — 12/2025',
        role: 'Desenvolvedor de Visão Computacional',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Estágio · 30h semanais',
        detail:
          'Implementação e validação de pipelines de processamento de imagens e modelos de deep learning para inspeção e monitoramento industrial.',
      },
    ],
    educationHeading: 'Formação Acadêmica',
    education: [
      {
        period: '2026 — 2028',
        role: 'Mestrado em Ciência da Computação',
        org: 'Universidade Federal de São Carlos (UFSCar) · São Carlos, SP',
        orgHref: 'https://www.ppgcc.dc.ufscar.br/',
        regime: 'Pós-Graduação Stricto Sensu · RA 847647',
        detail:
          'Orientador: [Prof. Dr. Jurandy Gomes de Almeida Junior](https://scholar.google.com/citations?user=a4L1sbcAAAAJ). Linha de pesquisa em adaptação de domínio não supervisionada e [detectores de vocabulário aberto](/projeto/uda-ovd).',
      },
      {
        period: '2022 — 2026',
        role: 'Bacharelado em Sistemas de Informação',
        org: 'Universidade Federal de Viçosa (UFV) · Campus Rio Paranaíba, MG',
        orgHref: 'https://www.crp.ufv.br/',
        regime: 'Graduação Superior',
        detail:
          'TCC sobre [análise da qualidade de grãos de café usando CNNs e ensemble](/projeto/coffeebean), orientado pelo Prof. Dr. Pedro Moises de Sousa.',
      },
      {
        period: '2020 — 2021',
        role: 'Ensino Médio (2º Grau)',
        org: 'Instituto Samaritano (SAM) · Brasil',
        regime: 'Educação Básica',
        detail: 'Conclusão do ensino médio regular.',
      },
    ],
    academicProjectsHeading: 'Projetos de Pesquisa & Ensino (Lattes)',
    academicProjects: [
      {
        period: '2024 — 2025',
        kind: 'Pesquisa · Bolsa IC FAPESP',
        code: 'FAPESP proc. 2024/08973-2 · Projeto SFI2',
        title:
          'Construção e validação de um agente de Aprendizado por Reforço flexível para Arquiteturas de Fatiamento de Redes',
        href: 'https://doi.org/10.1007/978-3-031-87772-8_8',
        org: 'UFV & Testbed FIBRE-NG da Rede Nacional de Ensino e Pesquisa (RNP)',
        advisor: 'Coordenador: Prof. Dr. Flávio de Oliveira Silva · Integrante: Rodrigo Moreira',
        detail:
          'Experimentos no testbed nacional FIBRE-NG da RNP com aprendizado de máquina e monitoramento cross-domain para garantia de SLA em fatias de rede sobre microsserviços conteinerizados. Resultou no [capítulo publicado pela Springer Nature (2025)](https://doi.org/10.1007/978-3-031-87772-8_8).',
      },
      {
        period: '2024 — 2025',
        kind: 'Pesquisa · Iniciação Científica',
        code: 'IC Visão Computacional · UFV',
        title:
          'Análise da qualidade de grãos de café usando redes neurais convolucionais com técnicas como wavelet',
        href: 'https://doi.org/10.5753/wsis.2024.33669',
        org: 'Universidade Federal de Viçosa (UFV)',
        advisor: 'Coordenador: Prof. Dr. Pedro Moises de Sousa',
        detail:
          'Curadoria de bases públicas, aplicação de CLAHE e Transformada Wavelet Discreta e comparação de arquiteturas CNN e comitês em PyTorch ([repositório CoffeeBean](/projeto/coffeebean) e [artigo no WSIS 2024](https://doi.org/10.5753/wsis.2024.33669)).',
      },
      {
        period: '2024',
        kind: 'Ensino · Monitoria Acadêmica',
        code: 'Bolsa de Monitoria por Processo Seletivo · UFV',
        title: 'Monitoria Remunerada da Disciplina de Matemática Discreta',
        org: 'Universidade Federal de Viçosa (UFV)',
        advisor: 'Coordenador: Prof. Dr. Pedro Moises de Sousa',
        detail:
          'Atendimento a alunos e apoio docente em lógica proposicional, teoria dos conjuntos, relações, indução matemática e combinatória.',
      },
    ],
    awardsHeading: 'Prêmios, Bolsas & Distinções',
    awards: [
      {
        year: '2025',
        title: 'Prêmio de Melhor Artigo',
        venue: 'XV Workshop de Sistemas de Informação (WSIS), UFV / SBC',
        href: 'https://doi.org/10.5753/wsis.2025.15733',
      },
      {
        year: '2024',
        title: '1º Lugar — Hackathon de Visão Computacional',
        venue: 'Workshop de Visão Computacional (WVC), UFV',
      },
      {
        year: '2024',
        title: 'Bolsa de Iniciação Científica FAPESP',
        venue: 'Fundação de Amparo à Pesquisa do Estado de São Paulo (proc. 2024/08973-2)',
        href: 'https://doi.org/10.1007/978-3-031-87772-8_8',
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
    eventsHeading: 'Eventos, Congressos, Oficinas & Exposições',
    events: [
      {
        year: '2025',
        kind: 'Oficina · Artigo Premiado',
        event: 'XV Workshop de Sistemas de Informação (WSIS 2025)',
        work: 'Unsupervised Specialization of Visual Subclasses Using K-Means in YOLO-Based Detection Pipelines',
        href: 'https://doi.org/10.5753/wsis.2025.15733',
      },
      {
        year: '2025',
        kind: 'Oficina · Artigo Completo',
        event: 'XV Workshop de Sistemas de Informação (WSIS 2025)',
        work: 'Automated Correction of Multiple Choice Tests Using Computer Vision',
        href: 'https://doi.org/10.5753/wsis.2025.15732',
      },
      {
        year: '2024',
        kind: 'Oficina & Hackathon · 1º Lugar',
        event: 'Workshop de Visão Computacional (WVC 2024)',
        work: 'Protótipo de Solução para Identificação dos Times aos Quais os Jogadores Pertencem em Vídeos de Esportes',
      },
      {
        year: '2024',
        kind: 'Exposição Tecnológica',
        event: 'Mostra de Jogos Digitais (UFV)',
        work: 'Alfabeto Mágico — Jogo digital educativo',
      },
      {
        year: '2024',
        kind: 'Oficina · Apresentação Oral (1º Autor)',
        event: 'Workshop de Sistemas de Informação (WSIS 2024)',
        work: 'Quality Assessment of Coffee Beans Using Convolutional Neural Networks with Wavelet and CLAHE Techniques',
        href: 'https://doi.org/10.5753/wsis.2024.33669',
      },
      {
        year: '2023',
        kind: 'Oficina · Pôster Premiado',
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
    skillsHeading: 'Competências Técnicas',
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
        category: 'Deep Learning & Modelos Visão-Linguagem',
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
        level: 'Leitura e Escrita Científica',
        detail: 'Compreende bem · Lê bem · Escreve bem · Fala intermediária',
      },
    ],
    contactHeading: 'Perfis Acadêmicos & Contato',
    contact: [
      { icon: 'github', label: 'GitHub', value: '@marcus-vreis', href: 'https://github.com/marcus-vreis' },
      {
        icon: 'scholar',
        label: 'Google Scholar',
        value: '5jCt_wYAAAAJ (h = 1)',
        href: 'https://scholar.google.com/citations?user=5jCt_wYAAAAJ',
      },
      {
        icon: 'linkedin',
        label: 'LinkedIn',
        value: 'in/marcus-vinicius-diniz',
        href: 'https://www.linkedin.com/in/marcus-vinicius-diniz/',
      },
      {
        icon: 'orcid',
        label: 'ORCID',
        value: '0009-0002-1464-431X',
        href: 'https://orcid.org/0009-0002-1464-431X',
      },
      {
        icon: 'lattes',
        label: 'Currículo Lattes',
        value: 'CNPq 8185221944541336',
        href: 'http://lattes.cnpq.br/8185221944541336',
      },
      {
        icon: 'email',
        label: 'E-mail',
        value: 'marcusvinicius0083@gmail.com',
        href: 'mailto:marcusvinicius0083@gmail.com',
      },
    ],
    name: 'Marcus Vinicius',
    fullName: 'Marcus Vinicius Diniz dos Reis',
    citationShort: 'REIS, M. V. D.',
    heroRolePrimary: 'Engenheiro de Visão Computacional · Pix Force',
    heroRoleSecondary: 'Mestrando em Ciência da Computação · UFSCar',
    heroDegreeLine: 'Bacharel em Sistemas de Informação · UFV',
    birthAndNationality: '08/03/2004 · Brasil',
    locationLabel: 'São Carlos, SP · MG, Brasil',
    portraitAlt: 'Painel de telemetria e decisões arquiteturais dos repositórios',
    authorPhotoAlt: 'Foto de perfil de Marcus Vinicius Diniz dos Reis',
    projectsHeading: 'Projetos & Repositórios Públicos',
    projectsSubtitle:
      'Oito repositórios open-source no [GitHub (@marcus-vreis)](https://github.com/marcus-vreis), acompanhados do diagrama do pipeline e das métricas colhidas automaticamente.',
    researchHeading: 'Pesquisa de Mestrado · UFSCar',
    researchSubtitle:
      'Estudo empírico sobre filtragem e completação de pseudo-rótulos sob deslocamento de domínio (COCO-C, Foggy Cityscapes e BDD100K).',
    publicationsHeading: 'Publicações Científicas',
    publicationsSubtitle:
      'Capítulo de livro internacional (Springer Nature) e artigos completos em anais (SBC / WSIS). Clique no título ou no DOI para abrir a publicação.',
    doiLabel: 'DOI',
    trajectoryHeading: 'Histórico Profissional & Acadêmico',
    navProjects: 'Projetos',
    navResearch: 'Pesquisa',
    navPublications: 'Publicações',
    navAbout: 'Currículo',
    heroBadge: 'MARCUS VINICIUS DINIZ DOS REIS // PORTFÓLIO & PESQUISA',
    heroAffiliation: 'UFSCar M.Sc. (RA 847647) · Pix Force · UFV B.Sc.',
    telemetryHeading: 'Atividade nos Repositórios',
    telemetrySnapshotLabel: 'Coleta UTC',
    telemetryCommitsLabel: 'Commits (90d)',
    telemetryActiveLabel: 'Repositórios ativos',
    telemetryReleaseLabel: 'Última release publicada',
    pillarsHeading: 'Recortes de Arquitetura',
    pillars: [
      {
        id: 'seam',
        code: 'NOTA 01 // GEOMETRIA × SEMÂNTICA',
        title: 'Separação entre coordenadas métricas e chamadas de modelo',
        formula: 'I(u,v) → H⁻¹ → (x, y, t) ∈ ℝ² × ℝ',
        summary:
          'No [custody-watch](/projeto/custody-watch), a máquina de estados consome apenas metros e segundos projetados no plano do solo. No [VampireAI](/projeto/vampireai) (ADR-022), funções em NumPy extraem cartas e rotas no minimapa em 3,3 ms antes de acionar o VLM (1 a 2 vezes por turno).',
        projectLinks: [
          { label: 'custody-watch', href: '/projeto/custody-watch' },
          { label: 'VampireAI', href: '/projeto/vampireai' },
          { label: 'ImageLab', href: '/projeto/imagelab' },
        ],
      },
      {
        id: 'rigor',
        code: 'NOTA 02 // REPRODUTIBILIDADE & AVALIAÇÃO',
        title: 'Réplicas multi-seed e validação de protocolo',
        formula: 'μ ± CI₉₅(bootstrap, K=5 seeds) · run.json',
        summary:
          'No [VisionForge](/projeto/visionforge), cada treino registra ambiente e hiperparâmetros em `run.json` e compara modelos com intervalos de confiança multi-seed. No [custody-watch](/projeto/custody-watch), o script `evaluate.py` interrompe o cálculo de `P_miss` a 25 s no CAVIAR porque o maior abandono anotado dura 13,3 s.',
        projectLinks: [
          { label: 'VisionForge', href: '/projeto/visionforge' },
          { label: 'custody-watch', href: '/projeto/custody-watch' },
          { label: 'CoffeeBean', href: '/projeto/coffeebean' },
        ],
      },
      {
        id: 'domain',
        code: 'NOTA 03 // DESLOCAMENTO DE DOMÍNIO',
        title: 'Completação de pseudo-rótulos sob queda de recall',
        formula: 'Ŷ = Y_prof(τ) ∪ Y_GDINO(c ∉ Y_prof) → +0,077 Recall',
        summary:
          'Na [pesquisa de mestrado na UFSCar](/projeto/uda-ovd), filtros de recorte (CLIP e SigLIP) reduziram o AUPRC em 100% dos cenários avaliados porque o detector professor sofre colapso de recall. A união com detecções do Grounding DINO recupera +0,077 de recall e +0,023 de F1.',
        projectLinks: [
          { label: 'Pesquisa UFSCar (UDA + OVD)', href: '/projeto/uda-ovd' },
        ],
      },
    ],
    filterAll: 'Todos',
    filterActive: 'Em operação',
    filterGraduated: 'Formados',
    commits90dSuffix: 'commits / 90d',
    starsSuffix: 'estrelas',
    inspectLabel: 'Ficha técnica',
    schematicLabel: 'Esquemático arquitetural',
    invariantLabel: 'Decisão de projeto',
    statusLabel: 'Estado operacional',
    commits90dLabel: 'Atividade (90d)',
    releaseLabel: 'Versão publicada',
    figuresLabel: 'Capturas de interface',
    prevProjectLabel: 'Projeto anterior',
    nextProjectLabel: 'Próximo projeto',
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
          'Validação de configuração antes de alocar GPU (ADR-002) e registro de proveniência em run.json (ADR-013) com intervalo de confiança multi-seed.',
        metric: '5 famílias de tarefa · 121 ADRs · v0.17.0',
      },
      custodia: {
        code: 'FIG. 02 // FRONTEIRA PIXELS → METROS & SEGUNDOS',
        formula: 'YOLO26(px) → GroundPlane(H⁻¹) ║ (x,y,t) → CustodyFSM → Queue',
        stages: ['YOLO26 + Homografia', 'Plano (x, y, t) m·s', 'CustodyFSM + Fila'],
        invariant:
          'Sem reconhecimento facial (bloqueado em pré-commit). Posse modelada como depósito espacial no BagRegistry; evaluate.py valida o protocolo de teste.',
        metric: '397 testes · 0 falsos alarmes CAVIAR · 600k→fila',
      },
      fliperama: {
        code: 'FIG. 03 // DIVISÃO GEOMETRIA (CV) × SEMÂNTICA (VLM)',
        formula: 'Frame(78ms) → [CV NumPy 3,3ms: Cartas/BFS/Glifos] + [VLM 7B: 1–2×/turno]',
        stages: ['CV Pura (3,3 ms)', 'Qwen2.5-VL 7B (Ollama)', 'DS4 Virtual (vgamepad)'],
        invariant:
          'ADR-022: visão em NumPy extrai contagens, coordenadas e rotas no minimapa; o VLM recebe apenas recortes semânticos e decide a jogada.',
        metric: '3,3 ms slots · 1,6 ms HUD · 1–2 chamadas VLM/turno',
      },
      estacao: {
        code: 'FIG. 04 // TELEMETRIA DISTRIBUÍDA EM DUPLA FILA',
        formula: 'Coletores [N₁..Nₖ] → RabbitMQ(Batch + Token) → Core Idempotente → WS/REST',
        stages: ['Coletores em Lote', 'RabbitMQ + Token', 'Core → WebSocket'],
        invariant:
          'Coleta e agregação separadas por duas filas do RabbitMQ, com token de idempotência por lote para descartar entregas duplicadas.',
        metric: 'Dupla fila RabbitMQ · Docker Compose · WebSocket',
      },
      scanner: {
        code: 'FIG. 05 // CADEIA ESPACIAL, MORFOLÓGICA & FREQUÊNCIA',
        formula: 'I(x,y) → [Sobel / Morfologia / Otsu τ*] ∥ [ℱ{I}(u,v) FFT]',
        stages: ['Domínio Espacial', 'Espectro FFT ℱ(u,v)', 'Otsu τ* & Morfologia'],
        invariant:
          'Despacho de eventos da interface gráfica (main.py) isolado dos 6 módulos matemáticos de processamento de imagens.',
        metric: '6 módulos puros · Espacial + FFT + Morfologia',
      },
      cafeteira: {
        code: 'FIG. 06 // DECOMPOSIÇÃO WAVELET + CLAHE + ENSEMBLE',
        formula: 'RGB → CLAHE → DWT {LL, LH, HL, HH} → Ensemble CNN → Classe',
        stages: ['Realce CLAHE', 'Sub-bandas Wavelet', 'Ensemble de CNNs'],
        invariant:
          'Combinação de realce adaptativo de contraste (CLAHE) e sub-bandas Wavelet antes da votação entre redes convolucionais.',
        metric: 'Artigo 1º autor WSIS 2024 · TCC UFV',
      },
      plotter: {
        code: 'FIG. 07 // ESPAÇO DE DESCRITORES DE FORMA MPEG7',
        formula: 'Silhueta → Descritores(scikit-image) → Projeção → k-NN (k=3) vs. SVM',
        stages: ['Silhueta MPEG7', 'Descritores Geométricos', 'Fronteira k-NN / SVM'],
        invariant:
          'Extração de descritores morfológicos de contorno e região para comparar fronteiras por vizinhança (k-NN) e margem máxima (SVM).',
        metric: 'Benchmark MPEG7 · Acurácia, Precisão, Recall, F1',
      },
      esteira: {
        code: 'FIG. 08 // REGIME ASSINTÓTICO & ESCOLHA DE PIVÔ',
        formula: 'Entrada {Cresc, Decresc, Rand} × N ∈ [10¹, 10⁶] → Pivô → T(N)',
        stages: ['N = 10¹..10⁶ (3 regimes)', '4 Pivôs QuickSort + Heap', 'Curva Empírica T(N)'],
        invariant:
          'Medição empírica da transição para O(N²) sob vetores ordenados com pivô fixo e manutenção de O(N log N) com mediana de três e pivô aleatório.',
        metric: '7 algoritmos C++ · N até 1.000.000 · 3 distribuições',
      },
      nevoeiro: {
        code: 'FIG. 09 // TETO DE FILTRAGEM vs. COMPLETAÇÃO OPEN-VOCAB',
        formula: 'Alvo(β=0,02) → Prof(Colapso Recall) ∪ GDINO(Completação) → +0,023 F1',
        stages: ['Desvio (COCO-C / Foggy)', 'Teto: Filtro × Completação', 'Prof ∪ Grounding DINO'],
        invariant:
          'Achados A1–A3: filtros de recorte (CLIP e SigLIP) reduzem o AUPRC em 100% dos casos; a completação com Grounding DINO recupera o recall do professor.',
        metric: '+0,077 Recall · +0,023 F1 · COCO-C / Foggy / BDD100K',
      },
    },
    publications: [
      {
        year: '2025',
        venue: 'Springer Nature · Lecture Notes in Networks and Systems / Data Engineering and Communications Technologies (pp. 89–100)',
        badge: 'Capítulo Internacional · 1º Autor',
        title:
          'Estimating Application Performance in Container-Based Environments: A Cross-Domain Monitoring Approach',
        authors: 'dos REIS, Marcus V. Diniz; MOREIRA, Rodrigo; RODRIGUES MOREIRA, Larissa F.; de OLIVEIRA SILVA, Flávio',
        doi: '10.1007/978-3-031-87772-8_8',
        href: 'https://doi.org/10.1007/978-3-031-87772-8_8',
        note: 'Resultante da bolsa de IC [FAPESP (proc. 2024/08973-2)](https://bv.fapesp.br/) no projeto SFI2, com validação experimental no testbed nacional FIBRE-NG da RNP.',
      },
      {
        year: '2025',
        venue: 'Anais do XV Workshop de Sistemas de Informação (WSIS 2025, SBC, pp. 11–19)',
        badge: 'Prêmio de Melhor Artigo',
        title:
          'Unsupervised Specialization of Visual Subclasses Using K-Means in YOLO-Based Detection Pipelines',
        authors: 'MOREIRA, Pedro Henrique Campos; FERREIRA, Bianca Panacho; REIS, Marcus Vinicius Diniz dos',
        doi: '10.5753/wsis.2025.15733',
        href: 'https://doi.org/10.5753/wsis.2025.15733',
        note: 'Descoberta não supervisionada de subclasses visuais via agrupamento K-Means sobre recortes extraídos por detectores YOLO.',
      },
      {
        year: '2025',
        venue: 'Anais do XV Workshop de Sistemas de Informação (WSIS 2025, SBC, pp. 1–10)',
        badge: 'Artigo Completo',
        title: 'Automated Correction of Multiple Choice Tests Using Computer Vision',
        authors: 'MOREIRA, Pedro Henrique Campos; FERREIRA, Bianca Panacho; REIS, Marcus Vinicius Diniz dos',
        doi: '10.5753/wsis.2025.15732',
        href: 'https://doi.org/10.5753/wsis.2025.15732',
        note: 'Pipeline de visão computacional para alinhamento geométrico e correção óptica de cartões de resposta capturados por câmera móvel.',
      },
      {
        year: '2024',
        venue: 'Anais do XIV Workshop de Sistemas de Informação (WSIS 2024, SBC, pp. 33–38)',
        badge: 'Artigo Completo · 1º Autor',
        title:
          'Quality Assessment of Coffee Beans Using Convolutional Neural Networks with Wavelet and CLAHE Techniques',
        authors: 'REIS, Marcus Vinicius Diniz dos; SOUSA, Pedro Moises de',
        doi: '10.5753/wsis.2024.33669',
        href: 'https://doi.org/10.5753/wsis.2024.33669',
        note: 'Avalia o impacto de realce CLAHE e Transformada Wavelet Discreta na classificação de grãos de café com CNNs ([código no repositório CoffeeBean](/projeto/coffeebean)).',
      },
    ],
    trajectory: [
      {
        period: '01/2026 — atual',
        role: 'Engenheiro de Visão Computacional',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Celetista (CLT) · 40h/semana',
        detail:
          'Desenvolvimento, treinamento e implantação de modelos de detecção de objetos e inferência sobre fluxos de vídeo em produção.',
      },
      {
        period: '2026 — 2028',
        role: 'Mestrado em Ciência da Computação',
        org: 'Universidade Federal de São Carlos (UFSCar)',
        orgHref: 'https://www.ppgcc.dc.ufscar.br/',
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
          'Coordenador: Prof. Dr. Flávio de Oliveira Silva. Aprendizado por reforço e monitoramento cross-domain em ambientes conteinerizados.',
      },
      {
        period: '2022 — 2026',
        role: 'Bacharelado em Sistemas de Informação',
        org: 'Universidade Federal de Viçosa (UFV)',
        orgHref: 'https://www.crp.ufv.br/',
        regime: 'Graduação · Campus Rio Paranaíba',
        detail:
          'TCC orientado pelo Prof. Dr. Pedro Moises de Sousa sobre classificação de grãos de café com CNNs e ensemble. Monitor remunerado de Matemática Discreta (2024).',
      },
    ],
  },
  en: {
    siteTitle: 'Marcus Vinicius Diniz dos Reis · Computer Vision & ML Engineering',
    siteDescription:
      'Portfolio and academic CV of Marcus Vinicius Diniz dos Reis: computer vision, object detection, M.Sc. research at UFSCar, and open-source software.',
    thesis: 'Computer vision, object detection, and machine-learning systems.',
    intro: [
      'I am a computer-vision engineer at Pix Force and an M.Sc. student in Computer Science at [PPGCC/UFSCar](https://www.ppgcc.dc.ufscar.br/), advised by [Prof. Dr. Jurandy Gomes de Almeida Junior](https://scholar.google.com/citations?user=a4L1sbcAAAAJ). My [M.Sc. research](/en/project/uda-ovd) studies how object detectors and teacher-student self-training behave under severe domain shift (fog, night scenes, and synthetic corruptions).',
      'I hold a B.Sc. in Information Systems from the [Federal University of Viçosa (UFV)](https://www.crp.ufv.br/) and was a [FAPESP](https://bv.fapesp.br/) undergraduate research fellow on the SFI2 project. My open-source work includes [VisionForge](/en/project/visionforge) (archived on [Zenodo](https://doi.org/10.5281/zenodo.23425765) and published on [PyPI](https://pypi.org/project/visionforge-studio/)), the airport luggage custody tracker [custody-watch](/en/project/custody-watch), and the multimodal game agent [VampireAI](/en/project/vampireai).',
    ],
    researchAreasLabel: 'Focus areas',
    researchAreas: [
      'Object Detection (YOLO / RT-DETR)',
      'Unsupervised Domain Adaptation (UDA)',
      'Open-Vocabulary Detectors & VLMs',
      'Video Inference & MLOps',
    ],
    yearLabel: 'Period',
    stackLabel: 'Stack',
    repoLabel: 'GitHub Repository',
    backLabel: 'Back to home',
    lastCommitLabel: 'last commit',
    aboutHeading: 'Academic & Professional Curriculum',
    aboutSubtitle:
      'Compiled from the [CNPq Lattes CV (ID 8185221944541336)](http://lattes.cnpq.br/8185221944541336), the FAPESP Curricular Summary, and academic records at [UFSCar](https://www.ppgcc.dc.ufscar.br/) and [UFV](https://www.crp.ufv.br/).',
    lattesSummaryHeading: 'Curricular Summary (Lattes CV)',
    lattesSummaryQuote:
      'Machine Learning Engineer and Computer Vision researcher with experience in applied AI research and Deep Learning model development. Works with CNNs, object detection and image processing, with a track record of training and deploying models within MLOps pipelines and scalable systems.',
    aboutBody: [
      'I joined Pix Force in January 2025 as a computer-vision intern and transitioned to a full-time computer-vision engineer role in January 2026, working on dataset curation, training, evaluation, and production deployment of video object-detection models. Concurrently, I am pursuing an M.Sc. in Computer Science at [UFSCar](https://www.ppgcc.dc.ufscar.br/) (RA 847647) under [Prof. Dr. Jurandy Gomes de Almeida Junior](https://scholar.google.com/citations?user=a4L1sbcAAAAJ).',
      'During my B.Sc. in Information Systems at [UFV](https://www.crp.ufv.br/) (2022–2026), I held a [FAPESP](https://bv.fapesp.br/) undergraduate research fellowship (grant 2024/08973-2) within the SFI2 project, running experiments on the national RNP FIBRE-NG testbed under Prof. Dr. Flávio de Oliveira Silva. At UFV, I also conducted undergraduate research and wrote my B.Sc. thesis on coffee-bean grading using convolutional neural networks, Discrete Wavelet Transform, and CLAHE ([ComputerVision-CoffeeBean](/en/project/coffeebean)), and served as a stipendiary teaching assistant for Discrete Mathematics advised by Prof. Dr. Pedro Moises de Sousa.',
    ],
    profileCardHeading: 'Identification & Academic Records',
    bioFields: [
      { label: 'Full name', value: 'Marcus Vinicius Diniz dos Reis' },
      {
        label: 'Bibliographic citation names',
        value: 'REIS, M. V. D.; REIS, MARCUS VINICIUS DINIZ DOS; dos Reis, Marcus V. Diniz; REIS, Marcus Vinicius Diniz dos',
      },
      { label: 'Birth date & Nationality', value: '08/03/2004 · Brazilian' },
      { label: 'Location', value: 'São Carlos, SP · Rio Paranaíba / Viçosa, MG — Brazil' },
      { label: 'Industry role', value: 'Pix Force Tecnologia Ltda. · Computer Vision Engineer (Full-time, 40h/wk)' },
      {
        label: 'Graduate program',
        value: 'PPGCC / UFSCar · M.Sc. in Computer Science (RA 847647)',
        href: 'https://www.ppgcc.dc.ufscar.br/',
      },
      {
        label: 'CNPq Lattes ID',
        value: '8185221944541336',
        href: 'http://lattes.cnpq.br/8185221944541336',
      },
      {
        label: 'ORCID iD',
        value: '0009-0002-1464-431X',
        href: 'https://orcid.org/0009-0002-1464-431X',
      },
    ],
    indicatorsHeading: 'Production Indicators',
    indicators: [
      {
        value: '3+ yrs',
        label: 'Computer Vision',
        detail: 'Continuous research since 2023 and industry engineering since Jan/2025.',
      },
      {
        value: '1',
        label: 'International Book Chapter',
        detail: 'Springer Nature Switzerland (LNDECT, 2025, pp. 89–100) as 1st author.',
      },
      {
        value: '3',
        label: 'Conference Papers',
        detail: 'Full papers published in WSIS 2024 and XV WSIS 2025 (SBC).',
      },
      {
        value: '7',
        label: 'Events & Exhibitions',
        detail: 'Presentations at WVC, WSIS, Digital Games Showcase, and Professions Fair.',
      },
      {
        value: '5',
        label: 'Awards & Fellowships',
        detail: 'Best Paper WSIS, 1st Place WVC Hackathon, FAPESP Fellowship, Best Poster, and Marathon.',
      },
      {
        value: 'h = 1',
        label: 'Google Scholar',
        detail: 'Indexed citations on Google Scholar (ID 5jCt_wYAAAAJ).',
      },
    ],
    experienceHeading: 'Professional Experience',
    experience: [
      {
        period: '01/2026 — present',
        role: 'Computer Vision Engineer',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Full-time (CLT) · 40h / week',
        detail:
          'Developing, training, evaluating, and deploying computer-vision models for object detection and real-world video analysis in production systems.',
      },
      {
        period: '01/2025 — 12/2025',
        role: 'Computer Vision Developer',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Internship · 30h / week',
        detail:
          'Implemented and validated image-processing pipelines and deep-learning models for industrial inspection and monitoring.',
      },
    ],
    educationHeading: 'Academic Education',
    education: [
      {
        period: '2026 — 2028',
        role: 'M.Sc. in Computer Science',
        org: 'Federal University of São Carlos (UFSCar) · São Carlos, SP',
        orgHref: 'https://www.ppgcc.dc.ufscar.br/',
        regime: 'Graduate Degree · RA 847647',
        detail:
          'Advisor: [Prof. Dr. Jurandy Gomes de Almeida Junior](https://scholar.google.com/citations?user=a4L1sbcAAAAJ). Research on unsupervised domain adaptation and [open-vocabulary object detectors](/en/project/uda-ovd).',
      },
      {
        period: '2022 — 2026',
        role: 'B.Sc. in Information Systems',
        org: 'Federal University of Viçosa (UFV) · Rio Paranaíba Campus, MG',
        orgHref: 'https://www.crp.ufv.br/',
        regime: 'Undergraduate Degree',
        detail:
          'B.Sc. thesis on [coffee-bean quality grading using CNNs and ensembles](/en/project/coffeebean), advised by Prof. Dr. Pedro Moises de Sousa.',
      },
      {
        period: '2020 — 2021',
        role: 'High School Diploma (Ensino Médio)',
        org: 'Instituto Samaritano (SAM) · Brazil',
        regime: 'Secondary Education',
        detail: 'Completed secondary education.',
      },
    ],
    academicProjectsHeading: 'Research & Teaching Projects (Lattes)',
    academicProjects: [
      {
        period: '2024 — 2025',
        kind: 'Research · FAPESP Fellowship',
        code: 'FAPESP grant 2024/08973-2 · SFI2 Project',
        title:
          'Building and validating a flexible Reinforcement Learning agent for Network Slicing Architectures',
        href: 'https://doi.org/10.1007/978-3-031-87772-8_8',
        org: 'UFV & RNP FIBRE-NG National Testbed',
        advisor: 'Coordinator: Prof. Dr. Flávio de Oliveira Silva · Member: Rodrigo Moreira',
        detail:
          'Experiments on the RNP FIBRE-NG national testbed with machine-learning and cross-domain monitoring for SLA assurance in containerised network slices. Produced the [1st-author Springer Nature chapter (2025)](https://doi.org/10.1007/978-3-031-87772-8_8).',
      },
      {
        period: '2024 — 2025',
        kind: 'Research · Undergraduate Research (IC)',
        code: 'Computer Vision IC · UFV',
        title:
          'Coffee-bean quality analysis using convolutional neural networks with wavelet techniques',
        href: 'https://doi.org/10.5753/wsis.2024.33669',
        org: 'Federal University of Viçosa (UFV)',
        advisor: 'Coordinator: Prof. Dr. Pedro Moises de Sousa',
        detail:
          'Public dataset curation, CLAHE and Discrete Wavelet Transform preprocessing, and comparison of CNN architectures and ensembles in PyTorch ([CoffeeBean repository](/en/project/coffeebean) and [WSIS 2024 paper](https://doi.org/10.5753/wsis.2024.33669)).',
      },
      {
        period: '2024',
        kind: 'Teaching · Academic Teaching Assistantship',
        code: 'Competitive Stipendiary Fellowship · UFV',
        title: 'Stipendiary Teaching Assistantship in Discrete Mathematics',
        org: 'Federal University of Viçosa (UFV)',
        advisor: 'Coordinator: Prof. Dr. Pedro Moises de Sousa',
        detail:
          'Student office hours and teaching support in propositional logic, set theory, relations, mathematical induction, and combinatorics.',
      },
    ],
    awardsHeading: 'Awards, Fellowships & Honours',
    awards: [
      {
        year: '2025',
        title: 'Best Paper Award',
        venue: 'XV Information Systems Workshop (WSIS), UFV / SBC',
        href: 'https://doi.org/10.5753/wsis.2025.15733',
      },
      {
        year: '2024',
        title: '1st Place — Computer Vision Hackathon',
        venue: 'Computer Vision Workshop (WVC), UFV',
      },
      {
        year: '2024',
        title: 'FAPESP Undergraduate Research Fellowship',
        venue: 'São Paulo Research Foundation (grant 2024/08973-2)',
        href: 'https://doi.org/10.1007/978-3-031-87772-8_8',
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
        kind: 'Workshop · Award-Winning Paper',
        event: 'XV Information Systems Workshop (WSIS 2025)',
        work: 'Unsupervised Specialization of Visual Subclasses Using K-Means in YOLO-Based Detection Pipelines',
        href: 'https://doi.org/10.5753/wsis.2025.15733',
      },
      {
        year: '2025',
        kind: 'Workshop · Full Paper Presentation',
        event: 'XV Information Systems Workshop (WSIS 2025)',
        work: 'Automated Correction of Multiple Choice Tests Using Computer Vision',
        href: 'https://doi.org/10.5753/wsis.2025.15732',
      },
      {
        year: '2024',
        kind: 'Workshop & Hackathon · 1st Place',
        event: 'Computer Vision Workshop (WVC 2024)',
        work: 'Prototype Solution for Identifying Player Team Affiliation in Sports Videos',
      },
      {
        year: '2024',
        kind: 'Technology Exhibition',
        event: 'Digital Games Showcase (Mostra de Jogos Digitais — UFV)',
        work: 'Alfabeto Mágico — Educational digital game',
      },
      {
        year: '2024',
        kind: 'Workshop · Oral Presentation (1st Author)',
        event: 'Information Systems Workshop (WSIS 2024)',
        work: 'Quality Assessment of Coffee Beans Using Convolutional Neural Networks with Wavelet and CLAHE Techniques',
        href: 'https://doi.org/10.5753/wsis.2024.33669',
      },
      {
        year: '2023',
        kind: 'Workshop · Award-Winning Poster',
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
    skillsHeading: 'Technical Competencies',
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
        category: 'Deep Learning & Vision-Language Models',
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
        level: 'Scientific Reading & Writing',
        detail: 'Listens well · Reads well · Writes well · Intermediate spoken',
      },
    ],
    contactHeading: 'Academic Profiles & Contact',
    contact: [
      { icon: 'github', label: 'GitHub', value: '@marcus-vreis', href: 'https://github.com/marcus-vreis' },
      {
        icon: 'scholar',
        label: 'Google Scholar',
        value: '5jCt_wYAAAAJ (h = 1)',
        href: 'https://scholar.google.com/citations?user=5jCt_wYAAAAJ',
      },
      {
        icon: 'linkedin',
        label: 'LinkedIn',
        value: 'in/marcus-vinicius-diniz',
        href: 'https://www.linkedin.com/in/marcus-vinicius-diniz/',
      },
      {
        icon: 'orcid',
        label: 'ORCID',
        value: '0009-0002-1464-431X',
        href: 'https://orcid.org/0009-0002-1464-431X',
      },
      {
        icon: 'lattes',
        label: 'Lattes CV',
        value: 'CNPq 8185221944541336',
        href: 'http://lattes.cnpq.br/8185221944541336',
      },
      {
        icon: 'email',
        label: 'Email',
        value: 'marcusvinicius0083@gmail.com',
        href: 'mailto:marcusvinicius0083@gmail.com',
      },
    ],
    name: 'Marcus Vinicius',
    fullName: 'Marcus Vinicius Diniz dos Reis',
    citationShort: 'REIS, M. V. D.',
    heroRolePrimary: 'Computer Vision Engineer · Pix Force',
    heroRoleSecondary: 'M.Sc. Student in Computer Science · UFSCar',
    heroDegreeLine: 'B.Sc. in Information Systems · UFV',
    birthAndNationality: '08/03/2004 · Brazil',
    locationLabel: 'São Carlos, SP · MG, Brazil',
    portraitAlt: 'Repository telemetry and architectural notes panel',
    authorPhotoAlt: 'Portrait of Marcus Vinicius Diniz dos Reis',
    projectsHeading: 'Public Projects & Repositories',
    projectsSubtitle:
      'Eight open-source repositories on [GitHub (@marcus-vreis)](https://github.com/marcus-vreis), paired with pipeline schematics and automated activity metrics.',
    researchHeading: 'Master’s Research · UFSCar',
    researchSubtitle:
      'Empirical study on pseudo-label filtering versus completion under domain shift (COCO-C, Foggy Cityscapes, and BDD100K).',
    publicationsHeading: 'Scientific Publications',
    publicationsSubtitle:
      'International book chapter (Springer Nature) and peer-reviewed conference papers (SBC / WSIS). Click any title or DOI to open the publication.',
    doiLabel: 'DOI',
    trajectoryHeading: 'Professional & Academic Timeline',
    navProjects: 'Projects',
    navResearch: 'Research',
    navPublications: 'Publications',
    navAbout: 'CV',
    heroBadge: 'MARCUS VINICIUS DINIZ DOS REIS // PORTFOLIO & RESEARCH',
    heroAffiliation: 'UFSCar M.Sc. (RA 847647) · Pix Force · UFV B.Sc.',
    telemetryHeading: 'Repository Activity',
    telemetrySnapshotLabel: 'UTC Snapshot',
    telemetryCommitsLabel: 'Commits (90d)',
    telemetryActiveLabel: 'Active repos',
    telemetryReleaseLabel: 'Latest release',
    pillarsHeading: 'Architectural Notes',
    pillars: [
      {
        id: 'seam',
        code: 'NOTE 01 // GEOMETRY × SEMANTICS',
        title: 'Separating metric coordinates from model calls',
        formula: 'I(u,v) → H⁻¹ → (x, y, t) ∈ ℝ² × ℝ',
        summary:
          'In [custody-watch](/en/project/custody-watch), the state machine consumes only ground-plane metres and seconds. In [VampireAI](/en/project/vampireai) (ADR-022), NumPy functions extract card slots and minimap BFS paths in 3.3 ms before calling the VLM (1–2 times per turn).',
        projectLinks: [
          { label: 'custody-watch', href: '/en/project/custody-watch' },
          { label: 'VampireAI', href: '/en/project/vampireai' },
          { label: 'ImageLab', href: '/en/project/imagelab' },
        ],
      },
      {
        id: 'rigor',
        code: 'NOTE 02 // REPRODUCIBILITY & EVALUATION',
        title: 'Multi-seed replicates and protocol verification',
        formula: 'μ ± CI₉₅(bootstrap, K=5 seeds) · run.json',
        summary:
          'In [VisionForge](/en/project/visionforge), each training run writes environment versions and hyperparameters to `run.json` and compares models across multi-seed replicates. In [custody-watch](/en/project/custody-watch), `evaluate.py` aborts `P_miss` at 25 s on CAVIAR because the longest annotated abandonment lasts 13.3 s.',
        projectLinks: [
          { label: 'VisionForge', href: '/en/project/visionforge' },
          { label: 'custody-watch', href: '/en/project/custody-watch' },
          { label: 'CoffeeBean', href: '/en/project/coffeebean' },
        ],
      },
      {
        id: 'domain',
        code: 'NOTE 03 // DOMAIN SHIFT',
        title: 'Pseudo-label completion under recall collapse',
        formula: 'Ŷ = Y_teacher(τ) ∪ Y_GDINO(c ∉ Y_teacher) → +0.077 Recall',
        summary:
          'In the [UFSCar M.Sc. study](/en/project/uda-ovd), crop-level filters (CLIP and SigLIP) reduced AUPRC across 100% of evaluated conditions because the teacher detector suffers recall collapse. Merging Grounding DINO detections recovers +0.077 recall and +0.023 F1.',
        projectLinks: [
          { label: 'UFSCar M.Sc. (UDA + OVD)', href: '/en/project/uda-ovd' },
        ],
      },
    ],
    filterAll: 'All',
    filterActive: 'Active',
    filterGraduated: 'Graduated',
    commits90dSuffix: 'commits / 90d',
    starsSuffix: 'stars',
    inspectLabel: 'Spec sheet',
    schematicLabel: 'Architectural schematic',
    invariantLabel: 'Design decision',
    statusLabel: 'Operational state',
    commits90dLabel: 'Activity (90d)',
    releaseLabel: 'Latest release',
    figuresLabel: 'Interface captures',
    prevProjectLabel: 'Previous project',
    nextProjectLabel: 'Next project',
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
          'Configuration validation before GPU allocation (ADR-002) and full provenance logging in run.json (ADR-013) with multi-seed confidence intervals.',
        metric: '5 task families · 121 ADRs · v0.17.0',
      },
      custodia: {
        code: 'FIG. 02 // PIXEL → METRE & SECOND BOUNDARY',
        formula: 'YOLO26(px) → GroundPlane(H⁻¹) ║ (x,y,t) → CustodyFSM → Queue',
        stages: ['YOLO26 + Homography', 'Plane (x, y, t) m·s', 'CustodyFSM + Queue'],
        invariant:
          'No facial recognition (blocked in pre-commit). Ownership is a spatial deposit in BagRegistry; evaluate.py validates the benchmark protocol.',
        metric: '397 tests · 0 CAVIAR false alarms · 600k→queue',
      },
      fliperama: {
        code: 'FIG. 03 // GEOMETRY (CV) × SEMANTICS (VLM) SPLIT',
        formula: 'Frame(78ms) → [NumPy CV 3.3ms: Cards/BFS/Glyphs] + [VLM 7B: 1–2×/turn]',
        stages: ['Pure CV (3.3 ms)', 'Qwen2.5-VL 7B (Ollama)', 'Virtual DS4 (vgamepad)'],
        invariant:
          'ADR-022: NumPy vision extracts counts, coordinates, and minimap paths; the VLM receives only semantic crops and selects the action.',
        metric: '3.3 ms slots · 1.6 ms HUD · 1–2 VLM calls/turn',
      },
      estacao: {
        code: 'FIG. 04 // DUAL-QUEUE DISTRIBUTED TELEMETRY',
        formula: 'Collectors [N₁..Nₖ] → RabbitMQ(Batch + Token) → Idempotent Core → WS/REST',
        stages: ['Batch Collectors', 'RabbitMQ + Token', 'Core → WebSocket'],
        invariant:
          'Collection and aggregation decoupled through two RabbitMQ queues, with batch idempotency tokens to discard duplicate deliveries.',
        metric: 'Dual RabbitMQ queues · Docker Compose · WebSocket',
      },
      scanner: {
        code: 'FIG. 05 // SPATIAL, MORPHOLOGICAL & FREQUENCY CHAIN',
        formula: 'I(x,y) → [Sobel / Morphology / Otsu τ*] ∥ [ℱ{I}(u,v) FFT]',
        stages: ['Spatial Domain', 'FFT Spectrum ℱ(u,v)', 'Otsu τ* & Morphology'],
        invariant:
          'GUI event dispatch (main.py) isolated from the 6 mathematical image-processing modules.',
        metric: '6 pure modules · Spatial + FFT + Morphology',
      },
      cafeteira: {
        code: 'FIG. 06 // WAVELET + CLAHE + CNN ENSEMBLE',
        formula: 'RGB → CLAHE → DWT {LL, LH, HL, HH} → CNN Ensemble → Grade',
        stages: ['CLAHE Contrast', 'Wavelet Subbands', 'CNN Ensemble'],
        invariant:
          'Combines adaptive local contrast (CLAHE) and Wavelet subbands prior to voting across convolutional architectures.',
        metric: '1st-author paper WSIS 2024 · B.Sc. Thesis',
      },
      plotter: {
        code: 'FIG. 07 // MPEG7 SHAPE DESCRIPTOR SPACE',
        formula: 'Silhouette → Descriptors(scikit-image) → Projection → k-NN (k=3) vs. SVM',
        stages: ['MPEG7 Silhouette', 'Geometric Descriptors', 'k-NN / SVM Boundary'],
        invariant:
          'Extracts morphological contour and region descriptors to compare neighbourhood boundaries (k-NN) against maximum-margin (SVM).',
        metric: 'MPEG7 benchmark · Accuracy, Precision, Recall, F1',
      },
      esteira: {
        code: 'FIG. 08 // ASYMPTOTIC REGIME & PIVOT SELECTION',
        formula: 'Input {Asc, Desc, Rand} × N ∈ [10¹, 10⁶] → Pivot → T(N)',
        stages: ['N = 10¹..10⁶ (3 regimes)', '4 QuickSort Pivots + Heap', 'Empirical T(N) Curve'],
        invariant:
          'Empirical measurement of O(N²) degradation on sorted arrays with fixed pivots and O(N log N) stability with median-of-three and random pivots.',
        metric: '7 C++ algorithms · N up to 1,000,000 · 3 distributions',
      },
      nevoeiro: {
        code: 'FIG. 09 // FILTERING CEILING vs. OPEN-VOCAB COMPLETION',
        formula: 'Target(β=0.02) → Teacher(Recall Collapse) ∪ GDINO(Completion) → +0.023 F1',
        stages: ['Shift (COCO-C / Foggy)', 'Ceiling: Filter × Complete', 'Teacher ∪ Grounding DINO'],
        invariant:
          'Findings A1–A3: crop filters (CLIP and SigLIP) reduce AUPRC in 100% of cases; completing pseudo-labels with Grounding DINO recovers teacher recall.',
        metric: '+0.077 Recall · +0.023 F1 · COCO-C / Foggy / BDD100K',
      },
    },
    publications: [
      {
        year: '2025',
        venue: 'Springer Nature · Lecture Notes in Networks and Systems / Data Engineering and Communications Technologies (pp. 89–100)',
        badge: 'International Book Chapter · 1st Author',
        title:
          'Estimating Application Performance in Container-Based Environments: A Cross-Domain Monitoring Approach',
        authors: 'dos REIS, Marcus V. Diniz; MOREIRA, Rodrigo; RODRIGUES MOREIRA, Larissa F.; de OLIVEIRA SILVA, Flávio',
        doi: '10.1007/978-3-031-87772-8_8',
        href: 'https://doi.org/10.1007/978-3-031-87772-8_8',
        note: 'Produced during the [FAPESP undergraduate fellowship (grant 2024/08973-2)](https://bv.fapesp.br/) in the SFI2 project, validated on the national RNP FIBRE-NG testbed.',
      },
      {
        year: '2025',
        venue: 'Proceedings of the XV Information Systems Workshop (WSIS 2025, SBC, pp. 11–19)',
        badge: 'Best Paper Award',
        title:
          'Unsupervised Specialization of Visual Subclasses Using K-Means in YOLO-Based Detection Pipelines',
        authors: 'MOREIRA, Pedro Henrique Campos; FERREIRA, Bianca Panacho; REIS, Marcus Vinicius Diniz dos',
        doi: '10.5753/wsis.2025.15733',
        href: 'https://doi.org/10.5753/wsis.2025.15733',
        note: 'Unsupervised visual subclass discovery via K-Means clustering over object crops extracted by YOLO detection pipelines.',
      },
      {
        year: '2025',
        venue: 'Proceedings of the XV Information Systems Workshop (WSIS 2025, SBC, pp. 1–10)',
        badge: 'Full Paper',
        title: 'Automated Correction of Multiple Choice Tests Using Computer Vision',
        authors: 'MOREIRA, Pedro Henrique Campos; FERREIRA, Bianca Panacho; REIS, Marcus Vinicius Diniz dos',
        doi: '10.5753/wsis.2025.15732',
        href: 'https://doi.org/10.5753/wsis.2025.15732',
        note: 'Computer-vision pipeline for geometric alignment and optical grading of answer sheets captured under mobile camera conditions.',
      },
      {
        year: '2024',
        venue: 'Proceedings of the XIV Information Systems Workshop (WSIS 2024, SBC, pp. 33–38)',
        badge: 'Full Paper · 1st Author',
        title:
          'Quality Assessment of Coffee Beans Using Convolutional Neural Networks with Wavelet and CLAHE Techniques',
        authors: 'REIS, Marcus Vinicius Diniz dos; SOUSA, Pedro Moises de',
        doi: '10.5753/wsis.2024.33669',
        href: 'https://doi.org/10.5753/wsis.2024.33669',
        note: 'Evaluates the impact of CLAHE contrast enhancement and Discrete Wavelet Transform on coffee-bean grading with CNNs ([code in CoffeeBean repo](/en/project/coffeebean)).',
      },
    ],
    trajectory: [
      {
        period: '01/2026 — present',
        role: 'Computer Vision Engineer',
        org: 'Pix Force Tecnologia Ltda.',
        regime: 'Full-time (CLT) · 40h/week',
        detail:
          'Developing, training, and deploying object-detection models and inference pipelines over production video streams.',
      },
      {
        period: '2026 — 2028',
        role: 'M.Sc. in Computer Science',
        org: 'Federal University of São Carlos (UFSCar)',
        orgHref: 'https://www.ppgcc.dc.ufscar.br/',
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
          'Advisor: Prof. Dr. Flávio de Oliveira Silva. Reinforcement learning and cross-domain monitoring in containerised environments.',
      },
      {
        period: '2022 — 2026',
        role: 'B.Sc. in Information Systems',
        org: 'Federal University of Viçosa (UFV)',
        orgHref: 'https://www.crp.ufv.br/',
        regime: 'Undergraduate · Rio Paranaíba Campus',
        detail:
          'Thesis advised by Prof. Dr. Pedro Moises de Sousa on coffee-bean grading using CNNs and ensembles. Stipendiary teaching assistant for Discrete Mathematics (2024).',
      },
    ],
  },
};
