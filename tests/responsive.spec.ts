import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/about/',
  '/contact/',
  '/cv/',
  '/work/cyclointel/',
  '/work/samenstad/',
  '/work/positioning/',
];

for (const width of [320, 390, 768, 1023]) {
  test(`Content and image slots reflow at ${width}px without shrinking the whole page`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        route,
      ).toBeLessThanOrEqual(width);
      const board = page.locator('.desktop-artboard, .case-study');
      if (await board.count())
        expect(await board.evaluate((el) => getComputedStyle(el).zoom), route).toBe('1');
      const slots = await page.locator('main img[src]:not([alt=""])').evaluateAll((images) =>
        images
          .filter(
            (image) =>
              !image.closest('[data-project-wheel]') &&
              !image.closest('.motion-ready .project-list'),
          )
          .map((image) => {
            const box = image.getBoundingClientRect();
            return { src: image.getAttribute('src'), width: box.width, height: box.height };
          }),
      );
      for (const slot of slots) {
        expect(slot.width, slot.src || route).toBeGreaterThan(12);
        expect(slot.height, slot.src || route).toBeGreaterThan(12);
      }
      const nav = page.getByRole('navigation', { name: 'Main navigation' });
      for (const link of await nav.getByRole('link').all()) {
        const box = await link.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      }
    }
    expect(errors).toEqual([]);
  });
}

test('Mobile gallery preserves all 55 images and touch controls restore focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about/');
  const images = page.locator('[data-lightbox]');
  await expect(images).toHaveCount(55);
  for (const box of await images.evaluateAll((buttons) =>
    buttons.map((button) => {
      const rect = button.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }),
  )) {
    expect(box.width).toBeGreaterThan(100);
    expect(box.height).toBeGreaterThan(70);
  }
  const first = images.first();
  await first.click();
  const dialog = page.getByRole('dialog', { name: 'Gallery image viewer' });
  await expect(dialog).toBeVisible();
  const before = await dialog.locator('img').getAttribute('src');
  await dialog.getByRole('button', { name: 'Next image' }).click();
  expect(await dialog.locator('img').getAttribute('src')).not.toBe(before);
  await dialog.getByRole('button', { name: 'Close image viewer' }).click();
  await expect(first).toBeFocused();
});

test('The narrow contact form creates a readable draft chooser without sending', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/contact/');
  await page.getByLabel('Your name').fill('Responsive review');
  await page.getByLabel('Email address', { exact: true }).fill('review@example.com');
  await page
    .getByLabel('What would you like to talk about?')
    .fill('Checking the mobile layout only.');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  const dialog = page.locator('.email-dialog');
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.scrollWidth)).toBeLessThanOrEqual(288);
  const gmail = dialog.getByRole('link', { name: /Gmail/ });
  expect(await gmail.getAttribute('href')).toContain('Checking');
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Your name')).toHaveValue('Responsive review');
});

test('Complex diagrams can be explored by keyboard inside the page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/work/samenstad/');
  const diagrams = page.locator('.diagram-scroll');
  await expect(diagrams).toHaveCount(2);
  for (const diagram of await diagrams.all()) {
    await diagram.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => diagram.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  }
});

test('Resizing an animated cover to mobile preserves its scene and offers the static fallback', async ({
  page,
}) => {
  await page.goto('/#work');
  await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('html')).toHaveClass(/compact-motion/);
  await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
  await expect(page.locator('[data-project-link="cyclointel"]')).toBeVisible();
  await page.locator('[data-skip-motion]').click();
  await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
  await expect(page.locator('.project-card')).toHaveCount(3);
  const bounds = await page.locator('#work').boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(68);
});

test('Phone layouts and project links also work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('.project-card')).toHaveCount(3);
  await page.locator('.project-card').first().getByRole('link').click();
  await expect(page).toHaveURL(/work\/cyclointel\//);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.goto('http://127.0.0.1:4321/contact/');
  await expect(page.getByRole('button', { name: 'Send message' })).toBeDisabled();
  await expect(page.locator('noscript').getByRole('link', { name: 'Gmail' })).toBeVisible();
  await context.close();
});
