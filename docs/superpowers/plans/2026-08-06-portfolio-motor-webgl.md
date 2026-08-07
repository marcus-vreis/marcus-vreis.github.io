# Portfólio Banco Óptico — Plano 2, fatia 1: o motor e a abertura

**Goal:** Construir o motor WebGL2 mínimo do site e usá-lo na abertura, onde o
espécime se resolve de um mosaico de Bayer cru até a imagem final — o efeito que
dá nome ao conceito e a primeira coisa que qualquer visitante vê.

**Architecture:** Um renderer próprio de umas duzentas linhas: contexto WebGL2,
um quad em tela cheia, um par de shaders, uniforms. Sem three.js e sem ogl. A
abertura instancia esse renderer sobre a `<img>` do espécime, que continua no
DOM e é o fallback — se não houver WebGL2 ou se `prefers-reduced-motion` estiver
ativo, o canvas simplesmente não monta e o visitante vê a imagem, sem JavaScript
executado.

**Tech Stack:** WebGL2 escrito à mão, GLSL ES 3.00, TypeScript, Vite `?raw` para
carregar os shaders como string.

**Por que esta fatia primeiro:** ela prova o motor inteiro (contexto, programa,
uniforms, ciclo de animação, degradação) num lugar onde o resultado é visível e
o risco é contido. As dez estações vêm depois, reusando o mesmo renderer.

---

## Escopo

**Dentro:** o renderer, os shaders da abertura, a integração no espécime, o
caminho de degradação e os testes.

**Fora, fica para as próximas fatias:** os dez shaders por estação, o
`StationManager` com `IntersectionObserver` e crossfade, e os posters
pré-renderizados no build. A abertura não precisa de poster porque o próprio
`<img>` já é o estado final.

**Orçamento:** o JS inicial precisa ficar **abaixo de 40 kB** e o Lighthouse em
**100/100/100**. Hoje o site tem zero JS; qualquer regressão de LCP ou CLS
reprova a fatia.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/lib/gl/easing.ts` | Curvas de animação. Puro, testável. |
| `src/lib/gl/support.ts` | Decide se o efeito deve rodar: WebGL2 disponível e movimento permitido. Puro o suficiente para testar. |
| `src/lib/gl/renderer.ts` | Contexto, compilação, quad, uniforms, `dispose()`. Não sabe nada sobre Bayer nem sobre o site. |
| `src/shaders/quad.vert` | Vertex shader do quad. Compartilhado por tudo que vier. |
| `src/shaders/hero-bayer.frag` | O efeito da abertura. |
| `src/components/Specimen.astro` | Passa a montar o canvas por cima da `<img>` quando suportado. |

---

## Task 1: Easing

**Files:** Create `src/lib/gl/easing.ts`, `tests/unit/easing.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { describe, expect, it } from 'vitest';
import { easeOutCubic, clamp01 } from '../../src/lib/gl/easing';

describe('clamp01', () => {
  it('prende nos extremos', () => {
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(7)).toBe(1);
    expect(clamp01(0.42)).toBeCloseTo(0.42, 6);
  });
});

describe('easeOutCubic', () => {
  it('fixa os extremos', () => {
    expect(easeOutCubic(0)).toBeCloseTo(0, 6);
    expect(easeOutCubic(1)).toBeCloseTo(1, 6);
  });

  it('desacelera no fim — passa da metade antes da metade do tempo', () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });

  it('é monotônica', () => {
    let previous = -1;
    for (let i = 0; i <= 20; i++) {
      const value = easeOutCubic(i / 20);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it('prende a entrada fora de [0,1]', () => {
    expect(easeOutCubic(-1)).toBeCloseTo(0, 6);
    expect(easeOutCubic(2)).toBeCloseTo(1, 6);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha** — `npm test`, erro de import.

- [ ] **Step 3: Implementar**

```ts
export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Desacelera no fim: rápido a revelar, calmo a assentar. */
export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — `npm test`, 8 testes novos.

- [ ] **Step 5: Commit** — `feat: curvas de animação do motor`

---

## Task 2: Detecção de suporte

O efeito só roda quando o navegador dá WebGL2 **e** o visitante não pediu menos
movimento. Isolar essa decisão numa função permite testá-la sem WebGL de verdade.

**Files:** Create `src/lib/gl/support.ts`, `tests/unit/support.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { describe, expect, it } from 'vitest';
import { shouldAnimate } from '../../src/lib/gl/support';

const yes = () => true;
const no = () => false;

describe('shouldAnimate', () => {
  it('roda quando há WebGL2 e o movimento é permitido', () => {
    expect(shouldAnimate({ hasWebGL2: yes, prefersReducedMotion: no })).toBe(true);
  });

  it('não roda sem WebGL2', () => {
    expect(shouldAnimate({ hasWebGL2: no, prefersReducedMotion: no })).toBe(false);
  });

  it('não roda quando o visitante pediu menos movimento', () => {
    expect(shouldAnimate({ hasWebGL2: yes, prefersReducedMotion: yes })).toBe(false);
  });

  it('não roda quando falta os dois', () => {
    expect(shouldAnimate({ hasWebGL2: no, prefersReducedMotion: yes })).toBe(false);
  });

  it('nunca deixa uma exceção vazar — na dúvida, não anima', () => {
    const explode = () => {
      throw new Error('contexto negado');
    };
    expect(shouldAnimate({ hasWebGL2: explode, prefersReducedMotion: no })).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha.**

- [ ] **Step 3: Implementar**

```ts
export interface SupportProbes {
  hasWebGL2: () => boolean;
  prefersReducedMotion: () => boolean;
}

/** Sondas reais do navegador. Separadas para o teste poder substituí-las. */
export const browserProbes: SupportProbes = {
  hasWebGL2: () => {
    const canvas = document.createElement('canvas');
    return canvas.getContext('webgl2') !== null;
  },
  prefersReducedMotion: () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

/**
 * O efeito é enfeite: qualquer dúvida resolve em não animar, e o visitante
 * fica com a imagem estática, que já é o conteúdo real.
 */
export function shouldAnimate(probes: SupportProbes): boolean {
  try {
    return probes.hasWebGL2() && !probes.prefersReducedMotion();
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — 5 testes novos.

- [ ] **Step 5: Commit** — `feat: detecção de suporte do motor`

---

## Task 3: O renderer

Sem teste unitário: WebGL não existe no ambiente `node` do Vitest. A verificação
é o teste e2e da Task 6, que roda num Chromium de verdade.

**Files:** Create `src/lib/gl/renderer.ts`

- [ ] **Step 1: Implementar**

O renderer não sabe nada sobre o site — recebe um canvas e um fragment shader,
devolve um handle. Interface exata:

```ts
export interface Renderer {
  /** Redimensiona o buffer ao tamanho de exibição. Idempotente. */
  resize(): void;
  /** Desenha um quadro com os uniforms dados. */
  draw(uniforms: { progress: number; pointer: [number, number] }): void;
  /** Libera contexto, texturas e programa. */
  dispose(): void;
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  fragmentSource: string,
  image: HTMLImageElement,
): Renderer | null;
```

Requisitos:

- `#version 300 es`, GLSL ES 3.00. Se a compilação ou a ligação falhar, logar o
  `getShaderInfoLog`/`getProgramInfoLog` no console e **devolver `null`** — nunca
  lançar. O chamador degrada para a imagem estática.
- Um quad em tela cheia via dois triângulos num único `VERTEX_BUFFER`, com um
  atributo `aPosition` em clip space. Sem index buffer, sem VAO extra além do
  necessário.
- Textura a partir do `HTMLImageElement`: `NEAREST` na minificação e magnificação
  (é um efeito de sensor — interpolação suave estragaria o mosaico),
  `CLAMP_TO_EDGE` nos dois eixos, `UNPACK_FLIP_Y_WEBGL` ligado para o `uv` bater
  com o eixo do shader.
- `resize()` respeita `devicePixelRatio` **com teto em 2** — acima disso o custo
  cresce sem ganho visível.
- Uniforms: `uImage` (sampler), `uResolution` (vec2), `uProgress` (float),
  `uPointer` (vec2). Guardar as localizações uma vez, não a cada quadro.
- `dispose()` apaga textura, buffer e programa, e chama
  `getExtension('WEBGL_lose_context')?.loseContext()`.

- [ ] **Step 2: Verificar que o build passa** — `npm run build` e `npm run check`.

- [ ] **Step 3: Commit** — `feat: renderer WebGL2 do banco óptico`

---

## Task 4: Os shaders

**Files:** Create `src/shaders/quad.vert`, `src/shaders/hero-bayer.frag`

- [ ] **Step 1: O vertex shader**

`src/shaders/quad.vert` — trivial e compartilhado por tudo que vier depois:

```glsl
#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
```

- [ ] **Step 2: O fragment shader da abertura**

`src/shaders/hero-bayer.frag`. A ideia: em `uProgress = 0` o espécime é leitura
crua de sensor — blocos grandes, cada bloco carregando **um só** canal segundo o
padrão RGGB, mais ruído. Conforme `uProgress` cresce, o bloco encolhe até um
pixel, o ruído some e a cor completa entra. De pixel a pessoa.

```glsl
#version 300 es
precision highp float;

uniform sampler2D uImage;
uniform vec2 uResolution;
uniform float uProgress;
uniform vec2 uPointer;

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);

  // O bloco do sensor encolhe de 12px para 1px.
  float block = mix(12.0, 1.0, smoothstep(0.0, 0.85, p));
  vec2 px = gl_FragCoord.xy;
  vec2 snapped = (floor(px / block) + 0.5) * block;
  vec3 full = texture(uImage, snapped / uResolution).rgb;

  // Máscara de Bayer RGGB sobre a grade de blocos.
  vec2 cell = mod(floor(px / block), 2.0);
  vec3 mask = cell.x < 1.0
    ? (cell.y < 1.0 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0))
    : (cell.y < 1.0 ? vec3(0.0, 1.0, 0.0) : vec3(0.0, 0.0, 1.0));

  // Um canal por fotossítio: multiplica por 3 para o brilho não desabar.
  vec3 raw = full * mask * 3.0;

  // Ruído de leitura, some junto com o mosaico.
  raw += (hash(floor(px / block)) - 0.5) * 0.30 * (1.0 - p);

  vec3 color = mix(raw, full, smoothstep(0.30, 1.0, p));

  // O cursor é a fonte de luz: um realce âmbar discreto.
  if (uPointer.x >= 0.0) {
    float d = distance(gl_FragCoord.xy / uResolution, uPointer);
    color += vec3(0.16, 0.10, 0.03) * smoothstep(0.55, 0.0, d) * p;
  }

  fragColor = vec4(color, 1.0);
}
```

Ajuste os números se o resultado não convencer — os valores acima são ponto de
partida, não escritura. O critério é o da Task 6: você olha a captura e julga.

- [ ] **Step 3: Commit** — `feat: shaders da abertura`

---

## Task 5: Ligar no espécime

**Files:** Modify `src/components/Specimen.astro`

- [ ] **Step 1: Implementar**

A `<img>` continua exatamente onde está — ela é o conteúdo e o fallback. O canvas
é sobreposto e só existe se o efeito for rodar.

Requisitos:

- Marcação: envolver a `<img>` num contêiner posicionado e acrescentar um
  `<canvas>` irmão com `aria-hidden="true"`, `position: absolute`, cobrindo a
  imagem, começando com `opacity: 0`.
- Script: `<script>` de módulo dentro do componente (o Astro empacota e faz
  hashing). Fluxo:
  1. `shouldAnimate(browserProbes)` — se falso, **não fazer nada**: nem importar
     o renderer, nem criar contexto. Usar `import()` dinâmico para o renderer e
     os shaders, de modo que esse código nem seja baixado quando não for usado.
  2. Esperar a imagem estar decodificada (`img.decode()`, com `catch` que desiste
     em silêncio).
  3. Criar o renderer. Se vier `null`, desistir — a imagem já está visível.
  4. Revelar o canvas (`opacity: 1`), animar `progress` de 0 a 1 em **1400 ms**
     com `easeOutCubic`, via `requestAnimationFrame`.
  5. Ao terminar, desenhar um último quadro em `progress = 1` e **parar o laço**.
     Nada de `requestAnimationFrame` eterno — o site fica parado depois da
     revelação.
  6. Reagir a `pointermove` sobre o contêiner atualizando `uPointer` e pedindo
     **um** quadro; ao sair (`pointerleave`), mandar `[-1, -1]` e redesenhar.
     Não manter laço contínuo.
  7. `ResizeObserver` no contêiner chamando `resize()` e redesenhando um quadro.
  8. Se a aba ficar oculta durante a revelação, pular para o fim em vez de animar
     em segundo plano.
- Nada de texto novo: o componente não ganha string alguma, então
  `ui-strings.ts` não muda.

- [ ] **Step 2: Conferir o orçamento**

```bash
npm run build && find dist/_astro -name "*.js" -exec ls -l {} \; | awk '{s+=$5} END {print s" bytes de JS"}'
```

Precisa ficar bem abaixo de 40 kB. Reportar o número.

- [ ] **Step 3: Commit** — `feat: revelação do espécime por demosaicing`

---

## Task 6: Testes e julgamento visual

**Files:** Modify `tests/e2e/navigation.spec.ts` ou criar `tests/e2e/hero.spec.ts`

- [ ] **Step 1: Escrever os testes e2e**

Três comportamentos, todos verificáveis:

```ts
import { expect, test } from '@playwright/test';

test('a abertura monta o canvas quando há suporte', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('figure canvas');
  await expect(canvas).toHaveCount(1);
  // O canvas precisa ter buffer real, não 0x0.
  const size = await canvas.evaluate((c: HTMLCanvasElement) => [c.width, c.height]);
  expect(size[0]).toBeGreaterThan(0);
  expect(size[1]).toBeGreaterThan(0);
});

test('a imagem do espécime continua no DOM como conteúdo e fallback', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('figure img')).toHaveCount(1);
});

test.describe('com movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('não monta canvas nenhum', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('figure canvas')).toHaveCount(0);
    await expect(page.locator('figure img')).toHaveCount(1);
  });
});

test('o console fica limpo na abertura', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/');
  await page.waitForTimeout(2000);
  expect(errors).toEqual([]);
});
```

- [ ] **Step 2: Rodar** — `npm run test:e2e`, agora 9 testes.

- [ ] **Step 3: Capturar a revelação e julgar**

Acrescentar ao `scripts/screenshots.mjs` uma sequência da abertura: o mesmo
quadro em três momentos da revelação, salvos como `hero-reveal-1.png`,
`-2.png`, `-3.png`. Para congelar o instante, exponha o progresso em
`window` durante a animação, ou pause via `page.clock`, ou simplesmente capture
em três atrasos diferentes após o load.

**Depois abra os três arquivos e olhe.** O efeito precisa: começar irreconhecível
mas claramente *estruturado* (não ruído puro), passar por um estágio em que o
padrão RGGB é visível, e terminar idêntico à imagem original. Se qualquer um dos
três não acontecer, ajuste os números do shader e repita. Relate o que você viu.

- [ ] **Step 4: Lighthouse**

```bash
npm run build && npx serve dist -l 4331 &
npx lighthouse http://localhost:4331 --only-categories=performance,accessibility,best-practices --chrome-flags="--headless" --output=json --output-path=./lh.json
```

Precisa continuar **100/100/100**. Se performance cair, o suspeito provável é o
canvas competir com o LCP: adiar a montagem para depois do evento `load` resolve.
Apagar o `lh.json` e encerrar o servidor.

- [ ] **Step 5: Commit** — `test: cobertura e capturas da abertura`

---

## Definição de pronto

- [ ] `npm test` passa (108 testes: 95 + 8 de easing + 5 de suporte)
- [ ] `npm run check` limpo
- [ ] `npm run build` gera 22 páginas
- [ ] `npm run test:e2e` passa com 9 testes
- [ ] JS inicial bem abaixo de 40 kB, com o número reportado
- [ ] Lighthouse 100/100/100
- [ ] Sem WebGL2 ou com `prefers-reduced-motion`: nenhum canvas, imagem visível,
      nenhum erro no console
- [ ] As três capturas da revelação foram olhadas e o efeito convence

## Próximas fatias

**Fatia 2 — o `StationManager`:** `IntersectionObserver` trocando o shader por
estação, crossfade de 600 ms, compilação sob demanda apenas da estação visível e
da seguinte, e a guarda de FPS que rebaixa para poster em GPU fraca.

**Fatia 3 — os dez shaders**, em ordem de valor: VisionForge, VampireAI, UDA/OVD,
depois os demais. Cada um com o poster pré-renderizado no build.
