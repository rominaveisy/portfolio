import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/',
  '/about/',
  '/contact/',
  '/cv/',
  '/work/cyclointel/',
  '/work/samenstad/',
  '/work/positioning/',
];

// Real browser touch input exercises gesture arbitration (not dispatched DOM events).
async function swipe(page: Page, from: [number, number], to: [number, number]) {
  const session = await page.context().newCDPSession(page);
  try {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: from[0], y: from[1], id: 1 }],
    });
    for (let step = 1; step <= 6; step++) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          {
            x: from[0] + ((to[0] - from[0]) * step) / 6,
            y: from[1] + ((to[1] - from[1]) * step) / 6,
            id: 1,
          },
        ],
      });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } finally {
    await session.detach();
  }
}

test.describe('Phone interactions', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('Menu works with touch and keyboard, keeps focus inside, and restores it on close', async ({
    page,
  }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu', exact: true });
    const dialog = page.getByRole('dialog', { name: 'Site menu', exact: true });
    await toggle.tap();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused();
    for (let step = 0; step < 8; step++) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
    await page.screenshot({ path: '.cache/touch-review/after/menu-390.png' });
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Enter');
    await dialog.getByRole('link', { name: 'About', exact: true }).tap();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(dialog).not.toBeVisible();
    await toggle.tap();
    await expect(dialog.getByRole('link', { name: 'About', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await page.setViewportSize({ width: 834, height: 1112 });
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  });

  test('Phone Work swipes through the desktop sequence and opens the case study', async ({
    page,
  }) => {
    const imageRequests: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'image') imageRequests.push(request.url());
    });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/compact-motion/);
    for (const scene of ['cyclointel', 'samenstad', 'positioning']) {
      await swipe(page, [10, 700], [10, 300]);
      await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', scene);
      await expect(page.locator('[data-project-link][tabindex="0"]')).toHaveCount(1);
    }
    await page.getByRole('banner').getByRole('link', { name: 'Romina Veisy — home' }).tap();
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'intro');
    await page.getByRole('button', { name: 'Menu', exact: true }).tap();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Work', exact: true })
      .tap();
    await expect(page.getByRole('dialog', { name: 'Site menu' })).not.toBeVisible();
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
    expect(imageRequests.filter((url) => /\/images\/home\/.*\.png/.test(url))).toEqual([]);
    await page.locator('[data-project-link="cyclointel"]').tap();
    await expect(page).toHaveURL(/\/work\/cyclointel\/$/);
  });

  for (const route of ['/work/cyclointel/', '/work/samenstad/']) {
    test(`${route} chapter links reveal and focus the requested content below navigation`, async ({
      page,
    }) => {
      await page.goto(route);
      const contents = page.locator('.case-contents');
      await contents.locator('summary').tap();
      await contents.locator('a[href="#final-design"]').tap();
      await expect(page).toHaveURL(/#final-design$/);
      await expect(page.locator('#final-design')).toBeFocused();
      await expect(contents).not.toHaveAttribute('open');
      const target = (await page.locator('#final-design').boundingBox())!;
      expect(target.y).toBeGreaterThanOrEqual(120);
      expect(target.y).toBeLessThan(220);
      await page.screenshot({
        path: `.cache/touch-review/after/${route.includes('samenstad') ? 'samenstad' : 'cyclointel'}-chapter-390.png`,
      });
      await contents.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(contents).toHaveAttribute('open', '');
      await page.keyboard.press('Escape');
      await expect(contents).not.toHaveAttribute('open');
      await expect(contents.locator('summary')).toBeFocused();
    });
  }

  test('Reverse swipes, the rotating cue and the wheel stay active on phones', async ({ page }) => {
    await page.goto('/');
    const stage = page.locator('.home-stage');
    const cue = page.locator('[data-figma-id="214:483"]');
    const before = await cue.evaluate((el) => getComputedStyle(el).rotate);
    await expect.poll(() => cue.evaluate((el) => getComputedStyle(el).rotate)).not.toBe(before);
    await swipe(page, [10, 650], [10, 250]);
    await expect(stage).toHaveAttribute('data-scene', 'cyclointel');
    await swipe(page, [10, 650], [10, 250]);
    await expect(stage).toHaveAttribute('data-scene', 'samenstad');
    await swipe(page, [10, 250], [10, 650]);
    await expect(stage).toHaveAttribute('data-scene', 'cyclointel');
    await swipe(page, [10, 250], [10, 650]);
    await expect(stage).toHaveAttribute('data-scene', 'intro');
  });

  test('Short phones keep the full story readable and scroll into the next scene at its boundary', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/#work');
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
    const reader = page.locator('[data-cover-copy="cyclointel"]');
    expect(await reader.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    const box = (await reader.boundingBox())!;
    await swipe(page, [170, box.y + box.height - 15], [170, box.y + 15]);
    await expect.poll(() => reader.evaluate((el) => el.scrollTop)).toBeGreaterThan(20);
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
    await reader.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-cover-copy="cyclointel"]')!;
      return Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 2;
    });
    await swipe(page, [170, box.y + box.height - 15], [170, box.y + 15]);
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'samenstad');
    await expect(page.locator('[data-project-link="samenstad"]')).toBeInViewport();
  });

  test('Phone motion supports reduced motion, skips, menu isolation and orientation changes', async ({
    page,
  }) => {
    await page.goto('/#work');
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
    await page.getByRole('button', { name: 'Menu', exact: true }).tap();
    await swipe(page, [200, 600], [200, 200]);
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 844, height: 390 });
    await expect
      .poll(() =>
        page.evaluate(() => {
          const area = document.querySelector<HTMLElement>('.home-scroll')!;
          return (scrollY - area.offsetTop) / (area.offsetHeight - innerHeight);
        }),
      )
      .toBeCloseTo(1 / 3, 2);
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
    await expect(page.locator('[data-project-link="cyclointel"]')).toBeInViewport();
    await page.getByRole('button', { name: 'Next scene', exact: true }).tap();
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'samenstad');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
    await expect(page.locator('.project-card').first()).toBeVisible();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.locator('html')).toHaveClass(/motion-ready/);
    await page.locator('[data-skip-motion]').click();
    await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
    await expect(page.locator('.project-card').first().getByRole('link')).toBeVisible();
  });

  test('The final phone story scrolls into a readable footer and R_V returns to the intro', async ({
    page,
  }) => {
    await page.goto('/');
    await page.keyboard.press('End');
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'positioning');
    const reader = page.locator('[data-cover-copy="positioning"]');
    await reader.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    const box = (await reader.boundingBox())!;
    await swipe(page, [170, box.y + box.height - 20], [170, box.y + 20]);
    const footer = page.locator('.home-footer');
    await expect(footer).toBeInViewport();
    for (const link of await footer.getByRole('link').all()) {
      const bounds = (await link.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
    }
    await page.getByRole('banner').getByRole('link', { name: 'Romina Veisy — home' }).click();
    await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'intro');
  });

  test('Gallery swipes next and previous; vertical gestures do not advance; closing restores focus', async ({
    page,
  }) => {
    await page.goto('/about/');
    const opener = page.locator('[data-lightbox]').first();
    await opener.tap();
    const dialog = page.getByRole('dialog', { name: 'Gallery image viewer' });
    const image = dialog.locator('img');
    await image.evaluate((el: HTMLImageElement) => el.decode());
    const firstSource = await image.getAttribute('src');
    const bounds = (await image.boundingBox())!;
    const centerY = bounds.y + bounds.height / 2;
    await swipe(
      page,
      [bounds.x + bounds.width * 0.8, centerY],
      [bounds.x + bounds.width * 0.2, centerY],
    );
    await expect(image).not.toHaveAttribute('src', firstSource!);
    await image.evaluate((el: HTMLImageElement) => el.decode());
    const next = (await image.boundingBox())!;
    await swipe(
      page,
      [next.x + next.width * 0.2, next.y + next.height / 2],
      [next.x + next.width * 0.8, next.y + next.height / 2],
    );
    await expect(image).toHaveAttribute('src', firstSource!);
    await swipe(
      page,
      [bounds.x + bounds.width / 2, centerY + 40],
      [bounds.x + bounds.width / 2, centerY - 40],
    );
    await expect(image).toHaveAttribute('src', firstSource!);
    await page.screenshot({ path: '.cache/touch-review/after/gallery-390.png' });
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  });

  test('CV provides a full-size PDF and download beside a loaded preview', async ({
    page,
    request,
  }) => {
    await page.goto('/cv/');
    const fullSize = page.getByRole('link', { name: /Open full-size CV/ });
    await expect(fullSize).toBeVisible();
    await expect(fullSize).toHaveAttribute('target', '_blank');
    const pdf = await request.get((await fullSize.getAttribute('href'))!);
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()['content-type']).toContain('application/pdf');
    await expect(page.getByRole('link', { name: 'DOWNLOAD PDF' })).toBeVisible();
    await page
      .locator('[data-design-page="cv"] img')
      .evaluate((image: HTMLImageElement) => image.decode());
  });
});

for (const [width, height] of [
  [834, 1112],
  [1024, 768],
  [1366, 1024],
]) {
  test(`Touch tablet ${width}×${height} reflows every page and preserves Home motion`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      for (const route of routes) {
        await page.goto(`http://127.0.0.1:4321${route}`);
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBe(width);
        await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
        const board = page.locator('.desktop-artboard, .case-study');
        if (await board.count())
          expect(await board.evaluate((el) => getComputedStyle(el).zoom), route).toBe('1');
        if (route === '/') {
          await expect(page.locator('html')).toHaveClass(/motion-ready/);
          await swipe(page, [width - 30, height - 120], [width - 30, 180]);
          await expect(page.locator('.home-stage')).toHaveAttribute('data-scene', 'cyclointel');
          const button = (await page.locator('[data-project-link="cyclointel"]').boundingBox())!;
          expect(button.x).toBeGreaterThanOrEqual(0);
          expect(button.y).toBeGreaterThanOrEqual(68);
          expect(button.x + button.width).toBeLessThanOrEqual(width);
          expect(button.y + button.height).toBeLessThanOrEqual(height);
        }
      }
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}

test('Phone navigation stays usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 700 },
    hasTouch: true,
    isMobile: true,
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/');
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link')).toHaveCount(4);
    for (const link of await nav.getByRole('link').all()) {
      await expect(link).toBeVisible();
      const box = (await link.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    await nav.getByRole('link', { name: 'About', exact: true }).tap();
    await expect(page).toHaveURL(/\/about\/$/);
  } finally {
    await context.close();
  }
});
