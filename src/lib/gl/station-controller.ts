// O gerente de estações — descobre as seções da página, decide qual está
// ativa via IntersectionObserver, e usa `planStations` para saber o que deve
// ter shader vivo (a ativa e a seguinte, no máximo). O resto é descartado de
// verdade — nada de dez contextos WebGL abertos ao mesmo tempo.
//
// Este módulo só é buscado via `import()` dinâmico, depois do evento `load`
// (ver a chamada em `Station.astro`) — carregar o gerente inteiro (e suas
// próprias dependências) antes disso faria uma requisição a mais competir
// pelas conexões com o CSS e as fontes bem no caminho crítico de renderização,
// que é exatamente o tipo de coisa que derruba o LCP.
//
// Mesma degradação do espécime: sem WebGL2 ou com `prefers-reduced-motion`,
// este módulo não importa o renderer nem os shaders, e a <img> de cada
// estação — que nunca sai do DOM — é o conteúdo e o fallback.
import { shouldAnimate, browserProbes } from './support';
import { easeOutCubic } from './easing';
import { planStations } from './station-manager';
import { createFpsGuard, type FpsGuard } from './fps-guard';
import { hexToVec3 } from './accent';
import type { Renderer } from './renderer';

const ENTER_MS = 1200;
/** Amostras curtas: a animação de entrada dura pouco, então a guarda
 *  precisa decidir dentro dela, não depois. */
const FPS_GUARD_OPTIONS = { sampleSize: 15, minFps: 24 };

// Hook só para captura determinística em teste/script, por slug — não é
// texto de exibição, não afeta o efeito. Mesmo padrão do espécime.
declare global {
  interface Window {
    __stationEnter?: Record<string, number>;
  }
}

// O shader é escolhido pelo slug. Uma estação sem entrada aqui, ou sem capa,
// simplesmente não monta canvas — a decisão está nos dados deste registro,
// não num caso especial no template.
const SHADERS: Record<string, () => Promise<{ default: string }>> = {
  visionforge: () => import('../../shaders/stations/visionforge.frag?raw'),
  vampireai: () => import('../../shaders/stations/vampireai.frag?raw'),
};

interface StationState {
  slug: string;
  section: HTMLElement;
  host: HTMLElement;
  img: HTMLImageElement;
  canvas: HTMLCanvasElement | null;
  renderer: Renderer | null;
  accent: [number, number, number];
  pending: boolean;
  failed: boolean;
  raf: number;
  fpsGuard: FpsGuard | null;
  lastFrameTime: number | null;
  enterStart: number | null;
  enterDone: boolean;
  resizeObserver: ResizeObserver | null;
}

function currentAccent(section: HTMLElement): [number, number, number] {
  const light = window.matchMedia('(prefers-color-scheme: light)').matches;
  const hex = (light ? section.dataset.accentLight : section.dataset.accent) ?? '#FFFFFF';
  return hexToVec3(hex);
}

function redraw(state: StationState, enter: number): void {
  state.renderer?.draw({ accent: state.accent, enter });
  (window.__stationEnter ??= {})[state.slug] = enter;
}

function disposeStation(state: StationState, opts: { failed?: boolean } = {}): void {
  if (state.raf) cancelAnimationFrame(state.raf);
  state.raf = 0;
  state.resizeObserver?.disconnect();
  state.resizeObserver = null;
  state.renderer?.dispose();
  state.renderer = null;
  state.canvas?.remove();
  state.canvas = null;
  state.fpsGuard = null;
  state.lastFrameTime = null;
  state.enterStart = null;
  state.enterDone = false;
  state.pending = false;
  if (opts.failed) state.failed = true;
}

export async function bootStations(): Promise<void> {
  if (!shouldAnimate(browserProbes)) return;

  const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-station]'));
  const stations = new Map<string, StationState>();
  const order: string[] = [];

  for (const section of sections) {
    const slug = section.id;
    const host = section.querySelector<HTMLElement>('.cover');
    const img = host?.querySelector<HTMLImageElement>('img');
    // Sem capa, ou sem shader cadastrado para este slug: fica de fora.
    // Nenhuma dessas condições é um caso especial de slug — é o que os
    // dados desta página dizem.
    if (!host || !img || !SHADERS[slug]) continue;

    order.push(slug);
    stations.set(slug, {
      slug,
      section,
      host,
      img,
      canvas: null,
      renderer: null,
      accent: currentAccent(section),
      pending: false,
      failed: false,
      raf: 0,
      fpsGuard: null,
      lastFrameTime: null,
      enterStart: null,
      enterDone: false,
      resizeObserver: null,
    });
  }

  if (order.length === 0) return;

  let mounted: string[] = [];
  let active: string | null = null;

  async function mount(slug: string): Promise<void> {
    const state = stations.get(slug);
    if (!state || state.canvas || state.pending || state.failed) return;
    state.pending = true;

    try {
      await state.img.decode();
    } catch {
      state.pending = false;
      return; // Não decodificou — a <img> estática já está visível.
    }

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.opacity = '0';
    state.host.appendChild(canvas);
    state.canvas = canvas;

    let renderer: Renderer | null = null;
    try {
      const [{ createRenderer }, shaderModule] = await Promise.all([
        import('./renderer'),
        SHADERS[slug](),
      ]);
      renderer = createRenderer(canvas, shaderModule.default, state.img);
    } catch (error) {
      console.error(error);
    }

    // A estação pode ter saído de cena (e sido descartada por `apply`)
    // enquanto o import e a decodificação estavam em voo.
    if (!renderer || !mounted.includes(slug)) {
      renderer?.dispose();
      canvas.remove();
      state.canvas = null;
      state.pending = false;
      return;
    }

    state.renderer = renderer;
    state.fpsGuard = createFpsGuard(FPS_GUARD_OPTIONS);
    state.accent = currentAccent(state.section);
    state.enterStart = null;
    state.enterDone = false;
    state.pending = false;

    redraw(state, 0);
    canvas.style.opacity = '1';

    const tick = (now: number): void => {
      if (!state.renderer) return; // Já foi descartado.

      if (state.lastFrameTime !== null && state.fpsGuard) {
        const ok = state.fpsGuard.record(now - state.lastFrameTime);
        if (!ok) {
          // A GPU não aguenta o efeito — sai de cena sozinho, a imagem já
          // está visível. Marca como `failed` para não tentar de novo.
          mounted = mounted.filter((s) => s !== slug);
          disposeStation(state, { failed: true });
          return;
        }
      }
      state.lastFrameTime = now;

      if (state.enterStart === null) state.enterStart = now;
      const t = (now - state.enterStart) / ENTER_MS;
      if (t >= 1) {
        state.enterDone = true;
        redraw(state, 1);
        return;
      }
      redraw(state, easeOutCubic(t));
      state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(() => {
      state.renderer?.resize();
      redraw(state, state.enterDone ? 1 : 0);
    });
    resizeObserver.observe(state.host);
    state.resizeObserver = resizeObserver;
  }

  function apply(): void {
    const plan = planStations(order, active, mounted);
    for (const slug of plan.dispose) {
      const state = stations.get(slug);
      if (state) disposeStation(state);
    }
    mounted = mounted.filter((s) => !plan.dispose.includes(s));
    for (const slug of plan.mount) {
      mounted.push(slug);
      void mount(slug);
    }
  }

  // A aba sumiu no meio de uma entrada: pula pro fim em vez de animar em
  // segundo plano, mesma disciplina da abertura.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    for (const slug of mounted) {
      const state = stations.get(slug);
      if (state?.renderer && !state.enterDone) {
        if (state.raf) cancelAnimationFrame(state.raf);
        state.raf = 0;
        state.enterDone = true;
        redraw(state, 1);
      }
    }
  });

  const visibleRatios = new Map<string, number>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const slug = (entry.target as HTMLElement).id;
        if (entry.isIntersecting) {
          visibleRatios.set(slug, entry.intersectionRatio);
        } else {
          visibleRatios.delete(slug);
        }
      }

      // A ativa é a mais visível agora; empate resolvido pela ordem no
      // trilho (a primeira, em `order`, que estiver visível).
      let best: string | null = null;
      let bestRatio = 0;
      for (const slug of order) {
        const ratio = visibleRatios.get(slug);
        if (ratio !== undefined && ratio > bestRatio) {
          best = slug;
          bestRatio = ratio;
        }
      }
      active = best;
      apply();
    },
    { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
  );

  for (const slug of order) {
    observer.observe(stations.get(slug)!.section);
  }
}
