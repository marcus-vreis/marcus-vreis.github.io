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
  // `test.use({ reducedMotion: 'reduce' })` não propaga de forma confiável
  // para `matchMedia` na fixture `page` automática nesta versão do
  // Playwright (verificado: a media query fica `false` mesmo com a opção
  // setada). `page.emulateMedia` antes do `goto` funciona de forma
  // determinística, então é isso que o teste usa.
  test('não monta canvas nenhum', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
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
