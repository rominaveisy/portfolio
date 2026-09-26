import { test, expect, type Page } from '@playwright/test';
import { CONTACT_EMAIL, buildComposeLinks, buildDraft, formatDraft } from '../src/scripts/contact';

const visitor = {
  name: 'A & B — Zoë',
  email: 'visitor+design@example.com',
  message:
    'Hello Romina,\nA project with 50% research & design?\n<script>not executable</script> ✨',
};
async function fillForm(page: Page) {
  await page.getByLabel('Your name').fill(visitor.name);
  await page.getByLabel('Email address', { exact: true }).fill(visitor.email);
  await page.getByLabel('What would you like to talk about?').fill(visitor.message);
}

test('Compose links encode recipient, subject and the complete draft as plain text', () => {
  const draft = buildDraft(visitor.name + '\nSubject:', visitor.email, visitor.message);
  const links = buildComposeLinks(draft);
  for (const provider of ['gmail', 'outlook'] as const) {
    const url = new URL(links[provider]);
    expect(url.searchParams.get('to')).toBe(CONTACT_EMAIL);
    expect(url.searchParams.get(provider === 'gmail' ? 'su' : 'subject')).toBe(draft.subject);
    expect(url.searchParams.get('body')).toBe(draft.body);
  }
  expect(draft.subject).not.toContain('\n');
  expect(draft.body).toContain(visitor.message);
  expect(buildDraft()).toEqual({ subject: '', body: '' });
  expect(formatDraft(buildDraft())).toBe(CONTACT_EMAIL);
  const longMessage = 'é✨&? '.repeat(350);
  expect(
    new URL(
      buildComposeLinks(buildDraft('Visitor', visitor.email, longMessage)).gmail,
    ).searchParams.get('body'),
  ).toContain(longMessage.trim());
});

test('Email me opens visible choices without an installed email app and restores focus', async ({
  page,
}) => {
  await page.goto('/contact/');
  const trigger = page.getByRole('link', { name: 'Email me' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Open Gmail' })).toBeFocused();
  await expect(dialog.getByRole('link', { name: 'Open Outlook' })).toBeVisible();
  await expect(page.getByLabel('Recipient', { exact: true })).toHaveValue(CONTACT_EMAIL);
  await expect(dialog).toContainText('Nothing has been sent yet.');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('Send message keeps fields intact, validates input and refreshes edited drafts', async ({
  page,
}) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByLabel('Your name')).toBeFocused();
  await fillForm(page);
  await page.getByLabel('Your name').fill('   ');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByLabel('Your name').fill(visitor.name);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByLabel('Your email draft')).toHaveValue(
    formatDraft(buildDraft(visitor.name, visitor.email, visitor.message)),
  );
  await page.getByRole('button', { name: 'Close email options' }).click();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeFocused();
  await expect(page.getByLabel('What would you like to talk about?')).toHaveValue(visitor.message);
  await page.getByLabel('What would you like to talk about?').fill('A revised message');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByLabel('Your email draft')).toHaveValue(/A revised message/);
  await expect(page.getByLabel('Your email draft')).not.toHaveValue(/not executable/);
});

for (const provider of ['gmail', 'outlook'] as const) {
  test(
    provider + ' opens a new tab with the complete draft only when selected',
    async ({ page, context }) => {
      // Intercept the handoff: tests never log into a mailbox or send a real email.
      const host = provider === 'gmail' ? 'mail.google.com' : 'outlook.live.com';
      await context.route('https://' + host + '/**', (route) =>
        route.fulfill({ contentType: 'text/html', body: '<title>Compose handoff</title>' }),
      );
      const external: string[] = [];
      context.on('request', (request) => {
        if (request.url().startsWith('https://')) external.push(request.url());
      });
      await page.goto('/contact/');
      await fillForm(page);
      await page.getByRole('button', { name: 'Send message' }).click();
      expect(external).toEqual([]);
      const link = page.locator('[data-email-provider="' + provider + '"]');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      const popupPromise = context.waitForEvent('page');
      await link.click();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      const url = new URL(popup.url());
      expect(url.hostname).toBe(host);
      expect(url.searchParams.get('to')).toBe(CONTACT_EMAIL);
      expect(url.searchParams.get('body')).toBe(
        buildDraft(visitor.name, visitor.email, visitor.message).body,
      );
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('[data-email-handoff]')).toContainText(
        'Nothing has been sent yet.',
      );
      await popup.close();
    },
  );
}

test('Copy works for the address and full message without touching the host clipboard in tests', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (value: string) => {
          document.documentElement.dataset.copied = value;
        },
      },
    });
  });
  await page.goto('/contact/');
  await page.getByRole('link', { name: 'Email me' }).click();
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-copied', CONTACT_EMAIL);
  await page.keyboard.press('Escape');
  await fillForm(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.getByRole('button', { name: 'Copy email draft' }).click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-copied',
    formatDraft(buildDraft(visitor.name, visitor.email, visitor.message)),
  );
  await expect(page.locator('[data-copy-status]')).toContainText('Draft copied');
});

test('Clipboard denial leaves a selected, manually copyable draft', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {
          throw new Error('Permission denied');
        },
      },
    });
  });
  await page.goto('/contact/');
  await fillForm(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.getByRole('button', { name: 'Copy email draft' }).click();
  const field = page.getByLabel('Your email draft');
  await expect(field).toBeFocused();
  expect(
    await field.evaluate((e: HTMLTextAreaElement) =>
      e.value.slice(e.selectionStart, e.selectionEnd),
    ),
  ).toBe(formatDraft(buildDraft(visitor.name, visitor.email, visitor.message)));
  await expect(page.locator('[data-copy-status]')).toContainText('Ctrl+C');
});

test('Email choices fit a narrow browser and no-JavaScript visitors get webmail links', async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 390, height: 750 });
  await page.goto('/contact/');
  await page.getByRole('link', { name: 'Email me' }).click();
  const bounds = (await page.getByRole('dialog').boundingBox())!;
  expect(bounds.width).toBeLessThan(390);
  expect(bounds.height).toBeLessThan(750);
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto('http://127.0.0.1:4321/contact/');
  await expect(plain.getByRole('link', { name: 'Gmail', exact: true })).toBeVisible();
  await expect(plain.getByRole('link', { name: 'Outlook', exact: true })).toBeVisible();
  await expect(plain.getByRole('button', { name: 'Send message' })).toBeDisabled();
  await context.close();
});
