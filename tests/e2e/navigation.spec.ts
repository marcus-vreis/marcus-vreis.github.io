import { expect, test } from '@playwright/test';
import { PALETTE } from '../../src/lib/tokens';

const PROJECTS = [
  'visionforge',
  'custody-watch',
  'vampireai',
  'airwatch',
  'imagelab',
  'coffeebean',
  'cv-knn',
  'sorting-hub',
];
const MOODS = ['formado', 'a-todo-vapor', 'ativo', 'bocejando', 'cochilando', 'dormindo'];

function hexToRgb(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
}

test('o índice lista os oito projetos públicos na ordem do conteúdo', async ({ page }) => {
  await page.goto('/');
  const slugs = await page
    .locator('#projetos a[data-slug]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('data-slug')));
  expect(slugs).toEqual(PROJECTS);
});

// O humor exato muda com os dados de cada dia; o teste verifica a forma,
// e a regra fica coberta pelos testes de unidade de mood.ts.
test('cada ficha diz o humor em palavras, o dado que o justifica e traz esquemático', async ({ page }) => {
  await page.goto('/');
  for (const row of await page.locator('#projetos a[data-slug]').all()) {
    expect(MOODS).toContain(await row.getAttribute('data-mood'));
    await expect(row.locator('.mood')).not.toBeEmpty();
    await expect(row.locator('.detail')).not.toBeEmpty();
    await expect(row.locator('.detail')).toContainText('último commit');
    await expect(row.locator('.schematic svg')).toHaveCount(1);
  }
});

test('a pesquisa de mestrado e as publicações ficam no Sobre, com links diretos para os artigos', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#projetos a[data-slug="uda-ovd"]')).toHaveCount(0);
  await expect(page.locator('#pesquisa a.research-card[href="/projeto/uda-ovd"]')).toHaveCount(1);
  await expect(page.locator('#publicacoes .pub-card')).toHaveCount(4);
  await expect(page.locator('#publicacoes .pub-title-link')).toHaveCount(4);
  await expect(page.locator('.topbar-icons .icon-btn')).toHaveCount(6);
  await expect(page.locator('.stat-release-project')).toHaveText('VisionForge');
});

test('uma ficha do índice leva à especificação técnica do projeto', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projetos a[data-slug="custody-watch"]').click();
  await expect(page).toHaveURL(/\/projeto\/custody-watch\/?$/);
  await expect(page.locator('h1')).toHaveText('custody-watch');
  await expect(page.locator('.schematic svg')).toHaveCount(1);
});

test('o seletor de idioma preserva o projeto aberto', async ({ page }) => {
  await page.goto('/projeto/uda-ovd');
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/project\/uda-ovd\/?$/);
  await page.getByRole('link', { name: 'Português' }).click();
  await expect(page).toHaveURL(/\/projeto\/uda-ovd\/?$/);
});

test('o índice é percorrível por teclado', async ({ page }) => {
  await page.goto('/');
  const rows = page.locator('#projetos a[data-slug]');
  await rows.first().focus();
  await expect(rows.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(rows.nth(1)).toBeFocused();
});

test('a home em inglês aponta para as rotas em inglês', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#projetos a[data-slug="visionforge"]')).toHaveAttribute(
    'href',
    '/en/project/visionforge',
  );
});

test('o hero é palco escuro mesmo no modo claro', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const background = await page
    .locator('header.stage')
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).toBe(hexToRgb(PALETTE.dark.bg));
});
