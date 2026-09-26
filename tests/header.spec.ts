import { test, expect } from '@playwright/test';

test('Every page shares the translucent Home header before and after scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 720 });
  for (const path of [
    '/',
    '/about/',
    '/contact/',
    '/cv/',
    '/work/cyclointel/',
    '/work/samenstad/',
    '/work/positioning/',
    '/not-a-real-page/',
  ]) {
    await page.goto(path);
    const header = page.locator('.site-header');
    await expect(header, path).toHaveCSS('background-color', 'rgba(0, 0, 0, 0.8)');
    await expect(header).toHaveCSS('opacity', '1');
    await expect(header).toHaveCSS('position', 'fixed');
    await page.evaluate(() => window.scrollTo(0, 350));
    await expect(header, path).toHaveCSS('background-color', 'rgba(0, 0, 0, 0.8)');
    expect((await header.boundingBox())!.y, path).toBe(0);
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  }
});
