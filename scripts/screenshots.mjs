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

const SHOTS = [
  { file: 'home-dark.png', path: '/', width: 1280, height: 900, scheme: 'dark' },
  { file: 'home-light.png', path: '/', width: 1280, height: 900, scheme: 'light' },
  { file: 'home-en.png', path: '/en/', width: 1280, height: 900, scheme: 'dark' },
  { file: 'index.png', path: '/#projetos', width: 1280, height: 900, scheme: 'dark' },
  { file: 'project-page.png', path: '/projeto/uda-ovd', width: 1280, height: 900, scheme: 'dark' },
  { file: 'mobile.png', path: '/', width: 390, height: 844, scheme: 'dark' },
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

await browser.close();
