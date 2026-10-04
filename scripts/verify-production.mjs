/** Read-only production checks. Contact checks prepare a draft and never send it. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect, request } from '@playwright/test';

const base = (process.argv[2] || 'https://rominaveisy.com').replace(/\/$/, '');
const routes = [
  '/',
  '/about/',
  '/contact/',
  '/cv/',
  '/work/cyclointel/',
  '/work/samenstad/',
  '/work/positioning/',
];
const output = `.cache/production-qa/${new URL(base).hostname}`;
await mkdir(output, { recursive: true });
const api = await request.newContext({ baseURL: base });
const browser = await chromium.launch({ channel: 'chrome' });
const report = { base, checkedAt: new Date().toISOString(), routes: [], assets: 0 };
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const resources = new Set();
  for (const route of routes) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
    const headers = response.headers();
    assert.doesNotMatch(headers['x-robots-tag'] || '', /noindex/i, route);
    assert.match(headers['content-security-policy'], /script-src 'self' 'sha256-/);
    assert.equal(headers['x-content-type-options'], 'nosniff');
    assert.equal(headers['x-frame-options'], 'DENY');
    if (base === 'https://rominaveisy.com') {
      assert.equal(headers['strict-transport-security'], 'max-age=86400');
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://rominaveisy.com' + route,
    );
    await expect(page.locator('main h1')).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    const urls = await page
      .locator('img[src], script[src], link[rel="stylesheet"], link[rel="icon"], a[href^="/"]')
      .evaluateAll((elements) =>
        elements
          .map((element) => element.getAttribute('src') || element.getAttribute('href'))
          .filter(Boolean),
      );
    for (const url of urls) if (url.startsWith('/')) resources.add(url.split('#')[0] || '/');
    if (route === '/') {
      await expect(page).toHaveTitle('a creative UX/UI & visual designer — Romina Veisy');
      await expect(page.locator('[data-figma-id="214:476"]')).toContainText(
        'a creative UX/UI & visual designer',
      );
      await expect(page.locator('html')).toHaveClass(/motion-ready/);
      await page.mouse.move(700, 500);
      await page.mouse.wheel(0, 600);
      await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
      await expect(page.locator('.work-arc')).toHaveCSS('opacity', '1');
    }
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} overflows at ${width}px`,
      );
    }
    report.routes.push(route);
  }
  const pending = [...resources];
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (pending.length) {
        const resource = pending.shift();
        const response = await api.get(resource);
        assert.equal(response.status(), 200, resource);
      }
    }),
  );
  report.assets = resources.size;
  const pdf = await api.get('/documents/romina-veisy-cv.pdf');
  assert.equal(
    createHash('sha256')
      .update(await pdf.body())
      .digest('hex'),
    '2912592dbfba320538d26f7fc58f321215b062109bd76768675fa2be67f69e81',
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/about/');
  await expect(page.locator('[data-lightbox]')).toHaveCount(55);
  const first = page.locator('[data-lightbox]').first();
  await first.click();
  const gallery = page.getByRole('dialog', { name: 'Gallery image viewer' });
  await expect(gallery).toBeVisible();
  const original = await gallery.locator('img').getAttribute('src');
  await gallery.getByRole('button', { name: 'Next image' }).click();
  assert.notEqual(await gallery.locator('img').getAttribute('src'), original);
  await page.keyboard.press('Escape');
  await expect(first).toBeFocused();

  await page.goto(base + '/contact/');
  await page.getByLabel('Your name').fill('Launch verification');
  await page.getByLabel('Email address', { exact: true }).fill('review@example.com');
  await page
    .getByLabel('What would you like to talk about?')
    .fill('Checking the draft chooser only.');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  const dialog = page.locator('.email-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Nothing has been sent yet.');
  const gmail = new URL(
    await dialog.getByRole('link', { name: 'Open Gmail' }).getAttribute('href'),
  );
  assert.equal(gmail.searchParams.get('to'), 'rominaveisy.ar@gmail.com');
  assert.match(gmail.searchParams.get('body'), /Checking the draft chooser only/);
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Your name')).toHaveValue('Launch verification');

  for (const [route, width, label] of [
    ['/', 1440, 'home-desktop'],
    ['/', 390, 'home-phone'],
    ['/contact/', 390, 'contact-phone'],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${output}/${label}.png` });
  }
  const plain = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const plainPage = await plain.newPage();
  await plainPage.goto(base + '/');
  await expect(plainPage.locator('.project-card')).toHaveCount(3);
  await plainPage.goto(base + '/contact/');
  await expect(plainPage.getByRole('button', { name: 'Send message' })).toBeDisabled();
  await expect(plainPage.getByRole('link', { name: 'Gmail', exact: true })).toBeVisible();
  await plain.close();
  assert.deepEqual(errors, []);

  const robots = await api.get('/robots.txt');
  assert.equal(robots.status(), 200);
  const robotText = await robots.text();
  assert.match(robotText, /Sitemap: https:\/\/rominaveisy\.com\/sitemap\.xml/);
  assert.doesNotMatch(robotText, /^Disallow:\s*\/\s*$/m);
  const sitemap = await api.get('/sitemap.xml');
  assert.equal(sitemap.status(), 200);
  assert.equal(((await sitemap.text()).match(/<loc>/g) || []).length, routes.length);
  const missing = await api.get('/not-a-real-page/');
  assert.equal(missing.status(), 404);
  assert.match(await missing.text(), /noindex, nofollow/);
  const redirect = await api.get('/about?from=launch', { maxRedirects: 0 });
  assert.equal(redirect.status(), 307);
  assert.match(redirect.headers().location, /\/about\/\?from=launch$/);
  if (base === 'https://rominaveisy.com') {
    for (const origin of [
      'http://rominaveisy.com',
      'http://www.rominaveisy.com',
      'https://www.rominaveisy.com',
    ]) {
      const response = await api.get(origin + '/about/?from=launch&message=a%20b', {
        maxRedirects: 0,
      });
      assert.equal(response.status(), 301, origin);
      if (origin.startsWith('https:')) {
        assert.equal(response.headers()['strict-transport-security'], 'max-age=86400');
      }
      assert.equal(
        response.headers().location,
        'https://rominaveisy.com/about/?from=launch&message=a%20b',
      );
    }
  }
  report.passed = true;
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log(
    'Production routing, indexing, security headers, assets, updated PDF, motion, responsive layouts, gallery, contact drafts and no-JavaScript fallback passed. No email sent.',
  );
} finally {
  await browser.close();
  await api.dispose();
}
