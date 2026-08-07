// Gera as capturas usadas no README.
//
// Rode contra o site BUILDADO, não contra `astro dev` — a barra de ferramentas
// do modo de desenvolvimento aparece no rodapé e suja toda captura:
//
//   npm run build && npx serve dist -l 4331 &
//   SHOTS_BASE=http://localhost:4331 npm run shots
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.SHOTS_BASE ?? 'http://localhost:4321';
const OUT = 'docs/images';

/** Cada captura: arquivo, rota, viewport, tema e um recorte opcional. */
const SHOTS = [
  { file: 'home-dark.png', path: '/', width: 1280, height: 800, scheme: 'dark' },
  { file: 'home-light.png', path: '/', width: 1280, height: 800, scheme: 'light' },
  { file: 'station.png', path: '/#visionforge', width: 1280, height: 800, scheme: 'dark' },
  { file: 'station-vampireai.png', path: '/#vampireai', width: 1280, height: 800, scheme: 'dark' },
  { file: 'project-page.png', path: '/projeto/uda-ovd', width: 1280, height: 900, scheme: 'dark' },
  { file: 'home-en.png', path: '/en/', width: 1280, height: 800, scheme: 'dark' },
  { file: 'mobile.png', path: '/#imagelab', width: 390, height: 780, scheme: 'dark' },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const shot of SHOTS) {
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
    colorScheme: shot.scheme,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(BASE + shot.path, { waitUntil: 'networkidle' });
  // As fontes chegam depois do load e mudam a métrica do texto.
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}/${shot.file}` });
  await context.close();
  console.log('ok', shot.file);
}

// A abertura: três momentos da revelação do espécime (mosaico de Bayer cru
// até a imagem final). `window.__specimenProgress` é atualizado a cada
// quadro pelo script de Specimen.astro — usamos isso para travar cada
// captura num ponto exato do progresso em vez de adivinhar por tempo.
const REVEAL_STOPS = [
  { file: 'hero-reveal-1.png', progress: 0 }, // leitura crua, mosaico grande
  { file: 'hero-reveal-2.png', progress: 0.25 }, // padrão RGGB legível
  { file: 'hero-reveal-3.png', progress: 1 }, // resolvida
];

{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark',
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const frame = page.locator('.specimen-frame');
  const box = await frame.boundingBox();

  for (const stop of REVEAL_STOPS) {
    await page.waitForFunction(
      (p) => (window.__specimenProgress ?? -1) >= p,
      stop.progress,
    );
    await page.screenshot({ path: `${OUT}/${stop.file}`, clip: box });
    console.log('ok', stop.file);
  }

  await context.close();
}

// As estações: cada uma trata a própria capa com o shader do projeto.
// `window.__stationEnter[slug]` é atualizado a cada quadro pelo script de
// Station.astro — usamos isso para travar a captura num ponto exato da
// entrada, em vez de adivinhar por tempo. Um recorte no meio da entrada
// (a varredura do VisionForge) e um depois de assentada (VampireAI, e o
// VisionForge só com a grade).
const STATION_STOPS = [
  { file: 'station-visionforge-sweep.png', slug: 'visionforge', progress: 0.45 },
  { file: 'station-visionforge-settled.png', slug: 'visionforge', progress: 1 },
  { file: 'station-vampireai-settled.png', slug: 'vampireai', progress: 1 },
];

{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark',
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  for (const stop of STATION_STOPS) {
    const section = page.locator(`#${stop.slug}`);
    await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      ({ slug, p }) => (window.__stationEnter?.[slug] ?? -1) >= p,
      { slug: stop.slug, p: stop.progress },
    );
    const box = await section.locator('.cover').boundingBox();
    await page.screenshot({ path: `${OUT}/${stop.file}`, clip: box });
    console.log('ok', stop.file);
  }

  await context.close();
}

await browser.close();
