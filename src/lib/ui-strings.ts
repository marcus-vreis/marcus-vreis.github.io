import type { Locale } from './i18n';
import type { Mood } from './mood';

export interface UiStrings {
  siteTitle: string;
  siteDescription: string;
  thesis: string;
  intro: string;
  yearLabel: string;
  stackLabel: string;
  repoLabel: string;
  backLabel: string;
  aboutHeading: string;
  aboutBody: string[];
  contactHeading: string;
  contact: { label: string; href: string }[];
  name: string;
  portraitAlt: string;
  projectsHeading: string;
  researchHeading: string;
  moods: Record<Mood, string>;
}

export const UI: Record<Locale, UiStrings> = {
  pt: {
    siteTitle: 'Marcus Vinicius — visão computacional',
    siteDescription:
      'Portfólio de Marcus Vinicius: visão computacional, engenharia de machine learning e software.',
    thesis: 'Construo instrumentos para ver.',
    intro:
      'Engenheiro de visão computacional. Cada máquina da bancada é um projeto meu — e o estado dela vem do repositório de verdade.',
    yearLabel: 'Ano',
    stackLabel: 'Stack',
    repoLabel: 'Repositório',
    backLabel: 'Voltar para a bancada',
    aboutHeading: 'Sobre',
    aboutBody: [
      'Engenheiro de visão computacional na Pix Force, onde trabalho com inferência em produção, streaming de vídeo e GPU.',
      'Mestrado em andamento em adaptação de domínio para detecção com vocabulário aberto. Graduação na UFV.',
      'Uma RTX 5060 Ti de 16 GB. Sem cluster. Tudo que eu publico roda numa GPU só — e é por isso que o trabalho é desenhado para caber.',
    ],
    contactHeading: 'Contato',
    contact: [
      { label: 'GitHub', href: 'https://github.com/marcus-vreis' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/marcus-vinicius-diniz/' },
      { label: 'E-mail', href: 'mailto:marcusvinicius0083@gmail.com' },
    ],
    name: 'Marcus Vinicius',
    portraitAlt: 'Bonequinho de palito no lugar do retrato',
    projectsHeading: 'Projetos',
    researchHeading: 'Pesquisa',
    moods: {
      formado: 'formado',
      'a-todo-vapor': 'a todo vapor',
      ativo: 'ativo',
      bocejando: 'bocejando',
      cochilando: 'cochilando',
      dormindo: 'dormindo',
    },
  },
  en: {
    siteTitle: 'Marcus Vinicius — computer vision',
    siteDescription:
      'Portfolio of Marcus Vinicius: computer vision, machine-learning engineering and software.',
    thesis: 'I build instruments for seeing.',
    intro:
      'Computer-vision engineer. Every machine on the bench is one of my projects — and its state comes from the real repository.',
    yearLabel: 'Year',
    stackLabel: 'Stack',
    repoLabel: 'Repository',
    backLabel: 'Back to the bench',
    aboutHeading: 'About',
    aboutBody: [
      'Computer-vision engineer at Pix Force, working on production inference, video streaming and GPU workloads.',
      'Ongoing master’s research on domain adaptation for open-vocabulary detection. Undergraduate degree at UFV.',
      'One RTX 5060 Ti, 16 GB. No cluster. Everything I publish runs on a single GPU — which is why the work is designed to fit.',
    ],
    contactHeading: 'Contact',
    contact: [
      { label: 'GitHub', href: 'https://github.com/marcus-vreis' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/marcus-vinicius-diniz/' },
      { label: 'Email', href: 'mailto:marcusvinicius0083@gmail.com' },
    ],
    name: 'Marcus Vinicius',
    portraitAlt: 'Stick figure standing in for the portrait',
    projectsHeading: 'Projects',
    researchHeading: 'Research',
    moods: {
      formado: 'graduated',
      'a-todo-vapor': 'full steam',
      ativo: 'active',
      bocejando: 'yawning',
      cochilando: 'napping',
      dormindo: 'asleep',
    },
  },
};
