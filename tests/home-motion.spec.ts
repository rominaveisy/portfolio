import { test, expect, type Page } from '@playwright/test';

const scene = (page: Page, name: string) =>
  expect(page.locator('.home-stage')).toHaveAttribute('data-scene', name);
const progress = (page: Page) =>
  page.locator('.home-stage').evaluate((e) => Number((e as HTMLElement).dataset.progress));

test('One small gesture completes each cover and reverses without stopping halfway', async ({
  page,
}) => {
  await page.goto('/');
  await scene(page, 'intro');
  await page.screenshot({ path: '.cache/qa/home.png' });
  for (const name of ['cyclointel', 'samenstad', 'positioning']) {
    await page.mouse.wheel(0, 40);
    await scene(page, 'transition');
    await scene(page, name);
    await expect(page.locator('[data-project-link="' + name + '"]')).toHaveAttribute(
      'tabindex',
      '0',
    );
    await expect(page.locator('[data-project-link][tabindex="0"]')).toHaveCount(1);
    const resting = await progress(page);
    await page.waitForTimeout(250);
    expect(await progress(page)).toBe(resting);
    await page.screenshot({ path: '.cache/qa/home-' + name + '.png' });
  }
  for (const name of ['samenstad', 'cyclointel', 'intro']) {
    await page.mouse.wheel(0, -40);
    await scene(page, name);
  }
  await expect(page.locator('[data-project-link][tabindex="0"]')).toHaveCount(0);
});

test('A long trackpad gesture lands on only one cover', async ({ page }) => {
  await page.goto('/');
  await scene(page, 'intro');
  await page.mouse.wheel(0, 60);
  // Generate momentum in the browser, without test-runner latency creating fake new gestures.
  const consumed = await page.evaluate(async () => {
    const results = [];
    for (let i = 0; i < 60; i++) {
      await new Promise((resolve) => setTimeout(resolve, 40));
      const event = new WheelEvent('wheel', {
        deltaY: Math.max(1, 60 - i),
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
      results.push(event.defaultPrevented);
    }
    return results;
  });
  expect(consumed.every(Boolean)).toBe(true);
  await scene(page, 'cyclointel');
  await page.waitForTimeout(250);
  await page.mouse.wheel(0, 40);
  await scene(page, 'samenstad');
});

test('Work and R_V play the same motion without reloading Home', async ({ page }) => {
  await page.goto('/');
  await scene(page, 'intro');
  await page.evaluate(() => {
    document.body.dataset.navigationCheck = 'same-document';
  });
  await page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true }).click();
  await scene(page, 'transition');
  await page.waitForTimeout(300);
  expect(await progress(page)).toBeGreaterThan(0);
  expect(await progress(page)).toBeLessThan(1 / 3);
  await scene(page, 'cyclointel');
  await page.locator('.brand').click();
  await scene(page, 'transition');
  await page.waitForTimeout(300);
  expect(await progress(page)).toBeGreaterThan(0);
  expect(await progress(page)).toBeLessThan(1 / 3);
  await scene(page, 'intro');
  await expect(page.locator('body')).toHaveAttribute('data-navigation-check', 'same-document');
});

test('Explore cue rotates while idle and exits upward with the intro', async ({ page }) => {
  await page.goto('/');
  await scene(page, 'intro');
  const cue = page.locator('[data-figma-id="214:483"]');
  const pose = () =>
    cue.evaluate((e) => ({
      rotate: getComputedStyle(e).rotate,
      translate: getComputedStyle(e).translate,
      top: e.getBoundingClientRect().top,
    }));
  const before = await pose();
  await page.waitForTimeout(350);
  const idle = await pose();
  expect(idle.rotate).not.toEqual(before.rotate);
  expect(idle.translate).toEqual(before.translate);
  expect(await progress(page)).toBe(0);
  await page.mouse.wheel(0, 40);
  await page.waitForTimeout(450);
  const leaving = await pose();
  expect(leaving.top).toBeLessThan(before.top);
  expect(leaving.rotate).not.toEqual(idle.rotate);
  await scene(page, 'cyclointel');
  expect((await cue.boundingBox())!.y + (await cue.boundingBox())!.height).toBeLessThan(0);
});

test('Native scrollbar positions settle to complete covers, including after resize', async ({
  page,
}) => {
  await page.goto('/');
  await scene(page, 'intro');
  await page.evaluate(() => window.scrollTo(0, innerHeight * 1.7));
  await scene(page, 'samenstad');
  await page.setViewportSize({ width: 1920, height: 970 });
  await scene(page, 'samenstad');
  await page.waitForTimeout(2200);
  await scene(page, 'samenstad');
  await page.evaluate(() => window.scrollTo(0, innerHeight * 0.3));
  await scene(page, 'intro');
});

test('Keyboard steps work and the last cover allows normal scrolling to the footer', async ({
  page,
}) => {
  await page.goto('/');
  await scene(page, 'intro');
  await page.keyboard.press('PageDown');
  await scene(page, 'cyclointel');
  await page.keyboard.press('ArrowDown');
  await scene(page, 'samenstad');
  await page.keyboard.press('Space');
  await scene(page, 'positioning');
  const top = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(top);
  await page.locator('.home-footer').getByRole('link', { name: 'Let’s talk' }).click();
  await expect(page).toHaveURL(/contact/);
});

test('Skip and reduced-motion changes cancel an in-flight transition', async ({ page }) => {
  await page.goto('/');
  await scene(page, 'intro');
  await page.mouse.wheel(0, 40);
  await scene(page, 'transition');
  await page.locator('[data-skip-motion]').click();
  await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
  await expect(page.locator('#work')).toBeFocused();
  await expect(page.locator('.project-card')).toHaveCount(3);
  await page.goto('/');
  await scene(page, 'intro');
  await page.mouse.wheel(0, 40);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
  const top = await page.evaluate(() => scrollY);
  await page.waitForTimeout(2000);
  expect(await page.evaluate(() => scrollY)).toBe(top);
});

for (const size of [
  { width: 1900, height: 970 },
  { width: 2560, height: 1080 },
]) {
  test(
    'Wide Home at ' + size.width + 'px balances both columns without changing cover positions',
    async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto('/');
      await scene(page, 'intro');
      await expect(page.locator('img[src*="pivot"]')).toHaveCount(0);
      expect((await page.locator('.home-stage').boundingBox())!.x).toBe(0);
      const intro = (await page.locator('[data-figma-id="214:482"]').boundingBox())!;
      const circle = (await page.locator('[data-figma-id="214:477"]').boundingBox())!;
      const headline = (await page.locator('[data-figma-id="214:481"]').boundingBox())!;
      const rightMargin = size.width - circle.x - circle.width;
      expect(intro.x).toBeGreaterThan(size.width * 0.07);
      expect(intro.x).toBeLessThan(size.width * 0.12);
      expect(Math.abs(intro.x - rightMargin)).toBeLessThan(12);
      const gap = headline.x - intro.x - intro.width;
      expect(gap).toBeGreaterThan(size.width * 0.1);
      expect(gap).toBeLessThan(size.width * 0.23);
      expect(
        await page.locator('.project-orbit').evaluate((e) => getComputedStyle(e).backgroundColor),
      ).toBe('rgba(0, 0, 0, 0)');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        size.width,
      );
      await page.screenshot({ path: '.cache/qa/home-wide-' + size.width + '.png' });
      await page.mouse.wheel(0, 40);
      await scene(page, 'cyclointel');
      const cta = (await page.locator('[data-project-link="cyclointel"]').boundingBox())!;
      expect(cta.x).toBeCloseTo((370 * size.height) / 1030, 0);
      expect(cta.y).toBeGreaterThan(86);
      expect(cta.y + cta.height).toBeLessThan(size.height);
      await page.screenshot({ path: '.cache/qa/home-wide-cover-' + size.width + '.png' });
    },
  );
}

for (const targets of [
  [
    '[data-figma-id="214:480"]',
    '[data-figma-id="214:482"]',
    '[data-figma-id="214:477"]',
    '[data-figma-id="214:478"]',
  ],
  ['.site-header nav a:first-child', '.studio', '[data-skip-motion]', 'empty space'],
]) {
  test('Scrolling works over ' + targets.join(', '), async ({ page }) => {
    await page.setViewportSize({ width: 1900, height: 970 });
    await page.goto('/');
    await scene(page, 'intro');
    for (const target of targets) {
      if (target === 'empty space') await page.mouse.move(1880, 500);
      else {
        const box = (await page.locator(target).boundingBox())!;
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await page.mouse.wheel(0, 40);
      await scene(page, 'cyclointel');
      await page.mouse.wheel(0, -40);
      await scene(page, 'intro');
    }
  });
}

test('Fresh repeated wheel notches advance without requiring a pointer move or a pause', async ({
  page,
}) => {
  await page.goto('/');
  await scene(page, 'intro');
  await page.mouse.move(1200, 500);
  await page.mouse.wheel(0, 120);
  await page.evaluate(async () => {
    for (let i = 0; i < 32; i++) {
      await new Promise((resolve) => setTimeout(resolve, 75));
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }),
      );
    }
  });
  await scene(page, 'samenstad');
  // Artwork, project text and the CTA also receive page-wide scroll handling.
  const cta = (await page.locator('[data-project-link="samenstad"]').boundingBox())!;
  await page.mouse.move(cta.x + 20, cta.y + 20);
  await page.mouse.wheel(0, 40);
  await scene(page, 'positioning');
});

test('A child element cannot create a wheel dead zone', async ({ page }) => {
  await page.goto('/');
  await scene(page, 'intro');
  await page.locator('[data-figma-id="214:477"]').evaluate((e) => {
    e.addEventListener('wheel', (event) => event.stopPropagation());
  });
  await page.mouse.move(1450, 620);
  await page.mouse.wheel(0, 40);
  await scene(page, 'cyclointel');
});
