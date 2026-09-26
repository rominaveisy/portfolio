import { test, expect } from '@playwright/test';

for (const width of [1280, 1440]) {
  test(`Desktop pages fit a ${width}px laptop`, async ({ page }) => {
    await page.setViewportSize({width,height:900});
    for(const path of ['/','/about/','/contact/','/cv/','/work/cyclointel/','/work/samenstad/','/work/positioning/']){
      await page.goto(path);
      await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth),path).toBeLessThanOrEqual(width);
      await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
    }
  });
}

test('Every case-study and gallery image has a nonempty rendered slot', async ({page})=>{
  for(const path of ['/about/','/contact/','/cv/','/work/cyclointel/','/work/samenstad/','/work/positioning/']){
    await page.goto(path);
    const slots=await page.locator('main img[src]').evaluateAll(images=>images.map(image=>{
      const box=image.getBoundingClientRect();return {src:image.getAttribute('src'),width:box.width,height:box.height};
    }));
    for(const slot of slots){expect(slot.width,slot.src || path).toBeGreaterThan(0);expect(slot.height,slot.src || path).toBeGreaterThan(0)}
  }
});

test('No JavaScript: projects are reachable and form cannot submit visitor data',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('.project-list')).toBeVisible();
  await page.goto('http://127.0.0.1:4321/contact/');
  await expect(page.getByRole('button',{name:'Send message'})).toBeDisabled();
  await expect(page.getByLabel('Your name')).toBeDisabled();
  await context.close();
});
