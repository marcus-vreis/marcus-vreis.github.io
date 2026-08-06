import { expect, test } from '@playwright/test';

const SLUGS = [
  'visionforge', 'vampireai', 'uda-ovd', 'airwatch', 'imagelab',
  'coffeebean', 'cv-knn', 'sorting-hub', 'voleiarena', 'rvh-construtora',
];

test('a home lista as dez estações na ordem do trilho', async ({ page }) => {
  await page.goto('/');
  for (const slug of SLUGS) {
    await expect(page.locator(`section#${slug}`)).toHaveCount(1);
  }
  const links = page.locator('nav[aria-label] a[data-stop]');
  await expect(links).toHaveCount(SLUGS.length);
  await expect(links.first()).toHaveAttribute('data-stop', 'visionforge');
});

test('o seletor de idioma preserva a estação aberta', async ({ page }) => {
  await page.goto('/projeto/uda-ovd');
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/project\/uda-ovd\/?$/);

  await page.getByRole('link', { name: 'Português' }).click();
  await expect(page).toHaveURL(/\/projeto\/uda-ovd\/?$/);
});

test('cada estação leva à sua página profunda', async ({ page }) => {
  await page.goto('/');
  await page.locator('section#visionforge a.read').click();
  await expect(page).toHaveURL(/\/projeto\/visionforge\/?$/);
  await expect(page.locator('h1')).toHaveText('VisionForge');
});

test('o trilho é percorrível por teclado', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('nav[aria-label] a[data-stop]').first();
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('nav[aria-label] a[data-stop]').nth(1)).toBeFocused();
});

test('a home em inglês existe e aponta para as rotas em inglês', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('section#visionforge a.read')).toHaveAttribute(
    'href',
    '/en/project/visionforge',
  );
});
