import { test, expect } from '@playwright/test';
import { buildMailto } from '../src/scripts/contact';
import { createHash } from 'node:crypto';

const paths = [
  '/',
  '/about/',
  '/contact/',
  '/cv/',
  '/work/cyclointel/',
  '/work/samenstad/',
  '/work/positioning/',
];
for (const path of paths) {
  test(`${path} has content, images, metadata and working internal links`, async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main h1')).toHaveCount(1);
    expect(await page.title()).toContain('Romina Veisy');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    await expect(page.locator('a:not([href])')).toHaveCount(0);
    const resources = await page
      .locator('img[src]')
      .evaluateAll((images) => [...new Set(images.map((image) => image.getAttribute('src')!))]);
    for (const src of resources) expect((await request.get(src)).status(), src).toBe(200);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((anchors) => [
        ...new Set(anchors.map((a) => a.getAttribute('href')!.split('#')[0] || '/')),
      ]);
    for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      1707,
    );
    expect(errors).toEqual([]);
  });
}

test('Work navigation enters the first project; skip shows every project', async ({ page }) => {
  await page.goto('/#work');
  await expect(page.locator('[data-project-link="cyclointel"]')).toHaveAttribute('tabindex', '0');
  await page.locator('[data-skip-motion]').click();
  await expect(page.locator('#work')).toBeVisible();
  await expect(page.locator('.project-card')).toHaveCount(3);
  await page.locator('.project-card').last().getByRole('link').click();
  await expect(page).toHaveURL(/work\/positioning/);
});

test('Gallery opens, changes images, closes with Escape and restores focus', async ({ page }) => {
  await page.goto('/about/');
  const first = page.locator('[data-lightbox]').first();
  await expect(page.locator('[data-lightbox]')).toHaveCount(55);
  await first.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const src = await page.locator('.lightbox img').getAttribute('src');
  await page.keyboard.press('ArrowRight');
  expect(await page.locator('.lightbox img').getAttribute('src')).not.toBe(src);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(first).toBeFocused();
});

test('Contact draft is encoded safely and fields are labelled and required', async ({ page }) => {
  const draft = buildMailto(
    'A & B\nSubject:',
    'visitor@example.com',
    'Hello & thank you?\nSecond line',
  );
  const url = new URL(draft);
  expect(url.pathname).toBe('rominaveisy.ar@gmail.com');
  expect(url.searchParams.get('subject')).toBe('Portfolio enquiry from A & B Subject:');
  expect(url.searchParams.get('body')).toContain('Hello & thank you?\nSecond line');
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByLabel('Your name')).toBeFocused();
  await expect(page.getByLabel('Email address')).toHaveAttribute('type', 'email');
  await expect(page.getByLabel('What would you like to talk about?')).toHaveAttribute(
    'required',
    '',
  );
  await expect(page.locator('a[href="tel:+31620435932"]')).toBeVisible();
});

test('CV serves the unchanged original PDF', async ({ request }) => {
  const response = await request.get('/documents/romina-veisy-cv.pdf');
  expect(response.status()).toBe(200);
  expect(
    createHash('sha256')
      .update(await response.body())
      .digest('hex'),
  ).toBe('99bdc7aa994832299762e10ea75d3a93e0073e53831b4539d7a4a65d3d3dfd79');
});

test('Studio is a non-link with a keyboard-accessible coming-soon hint', async ({ page }) => {
  await page.goto('/');
  const studio = page.locator('.studio');
  await studio.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await expect(studio).toHaveAttribute('aria-disabled', 'true');
  expect(await studio.getAttribute('href')).toBeNull();
});

test('Reduced motion exposes projects without scroll animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
  await expect(page.locator('#work')).toBeVisible();
});

test('Missing page returns a real 404', async ({ page }) => {
  const response = await page.goto('/a-page-that-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This page isn’t here.' })).toBeVisible();
});

test('Desktop visual checkpoints', async ({ page }) => {
  for (const path of [
    '/about/',
    '/contact/',
    '/cv/',
    '/work/cyclointel/',
    '/work/samenstad/',
    '/work/positioning/',
  ]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator('main img[src]')
      .evaluateAll((images) =>
        Promise.all(
          images
            .filter((image) => image.getBoundingClientRect().top < innerHeight)
            .map((image) => (image as HTMLImageElement).decode().catch(() => {})),
        ),
      );
    await page.screenshot({ path: '.cache/qa/' + path.replaceAll('/', '') + '.png' });
  }
});
