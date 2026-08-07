import { expect, test } from '@playwright/test';

// As oito estações sem capa nem shader cadastrado — nunca devem ganhar
// canvas, em nenhuma condição.
const PLAIN_SLUGS = [
  'airwatch',
  'coffeebean',
  'cv-knn',
  'imagelab',
  'rvh-construtora',
  'sorting-hub',
  'uda-ovd',
  'voleiarena',
];

test('a estação VisionForge monta canvas ao entrar em vista', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#visionforge');
  await section.scrollIntoViewIfNeeded();
  const canvas = section.locator('canvas');
  await expect(canvas).toHaveCount(1, { timeout: 5000 });
  // O canvas precisa ter buffer real, não 0x0.
  const size = await canvas.evaluate((c: HTMLCanvasElement) => [c.width, c.height]);
  expect(size[0]).toBeGreaterThan(0);
  expect(size[1]).toBeGreaterThan(0);
});

test('a estação VampireAI monta canvas ao entrar em vista', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#vampireai');
  await section.scrollIntoViewIfNeeded();
  const canvas = section.locator('canvas');
  await expect(canvas).toHaveCount(1, { timeout: 5000 });
  const size = await canvas.evaluate((c: HTMLCanvasElement) => [c.width, c.height]);
  expect(size[0]).toBeGreaterThan(0);
  expect(size[1]).toBeGreaterThan(0);
});

test('a imagem das duas estações com shader continua no DOM como fallback', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#visionforge .cover img')).toHaveCount(1);
  await expect(page.locator('#vampireai .cover img')).toHaveCount(1);
});

test('as oito estações sem capa nem shader nunca ganham canvas', async ({ page }) => {
  await page.goto('/');
  for (const slug of PLAIN_SLUGS) {
    await page.locator(`#${slug}`).scrollIntoViewIfNeeded();
  }
  for (const slug of PLAIN_SLUGS) {
    await expect(page.locator(`#${slug} canvas`)).toHaveCount(0);
  }
});

test.describe('com movimento reduzido', () => {
  test('nenhuma estação monta canvas, mesmo passando por VisionForge e VampireAI', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('#visionforge').scrollIntoViewIfNeeded();
    await page.locator('#vampireai').scrollIntoViewIfNeeded();
    await expect(page.locator('section canvas')).toHaveCount(0);
    await expect(page.locator('#visionforge .cover img')).toHaveCount(1);
    await expect(page.locator('#vampireai .cover img')).toHaveCount(1);
  });
});

test('o console fica limpo ao percorrer as estações', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/');
  await page.locator('#visionforge').scrollIntoViewIfNeeded();
  await page.locator('#vampireai').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  expect(errors).toEqual([]);
});
