import { buildComposeLinks, buildDraft, formatDraft, type EmailDraft } from './contact';

const dialog = document.querySelector<HTMLDialogElement>('.email-dialog')!;
const form = document.querySelector<HTMLFormElement>('[data-contact-form]')!;
const copyField = dialog.querySelector<HTMLTextAreaElement>('[data-email-draft]')!;
const copyButton = dialog.querySelector<HTMLButtonElement>('[data-copy-email]')!;
const copyStatus = dialog.querySelector<HTMLParagraphElement>('[data-copy-status]')!;
const handoff = dialog.querySelector<HTMLParagraphElement>('[data-email-handoff]')!;
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';

function openOptions(draft: EmailDraft) {
  previousFocus = document.activeElement as HTMLElement;
  const links = buildComposeLinks(draft);
  dialog.querySelectorAll<HTMLAnchorElement>('[data-email-provider]').forEach((link) => {
    link.href = links[link.dataset.emailProvider as keyof typeof links];
  });
  copyField.value = formatDraft(draft);
  copyField.rows = draft.body ? 6 : 2;
  dialog.querySelector('[data-copy-label]')!.textContent = draft.body
    ? 'Your email draft'
    : 'Recipient';
  copyButton.textContent = draft.body ? 'Copy email draft' : 'Copy email address';
  copyStatus.textContent = '';
  handoff.textContent = draft.body
    ? 'If sign-in or your browser drops any draft text, copy the complete draft below and paste it into your email.'
    : 'No email app installed? Use Gmail or Outlook in your browser, or copy the address below.';
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  dialog.showModal();
}

document.querySelectorAll<HTMLAnchorElement>('[data-email-options]').forEach((link) => {
  link.setAttribute('aria-haspopup', 'dialog');
  link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)
      return;
    event.preventDefault();
    openOptions(buildDraft());
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // Native required validation allows whitespace-only text, which isn't a useful enquiry.
  for (const name of ['name', 'message']) {
    const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
    input.setCustomValidity(
      input.value.trim() ? '' : 'Please enter ' + (name === 'name' ? 'your name.' : 'a message.'),
    );
  }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  openOptions(
    buildDraft(String(data.get('name')), String(data.get('email')), String(data.get('message'))),
  );
});
form.addEventListener('input', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    event.target.setCustomValidity('');
  }
});

dialog.querySelector('[data-close-email]')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  )
    dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = previousOverflow;
  previousFocus?.focus({ preventScroll: true });
});
dialog.querySelectorAll<HTMLAnchorElement>('[data-email-provider]').forEach((link) => {
  link.addEventListener('click', () => {
    handoff.textContent =
      link.dataset.emailProvider === 'mailto'
        ? 'If no email app opens, choose Gmail or Outlook above, or copy the draft below. Nothing has been sent yet.'
        : 'Continue in the new email tab. If it does not open or sign-in loses your text, copy the draft below. Nothing has been sent yet.';
  });
});
copyButton.addEventListener('click', async () => {
  const value = copyField.value;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = value.includes('\n')
      ? 'Draft copied. Paste it into your email and send it there.'
      : 'Email address copied.';
  } catch {
    // Selection works even when clipboard permission is denied or the browser blocks the API.
    copyField.focus();
    copyField.select();
    copyStatus.textContent =
      'Automatic copying is unavailable. The text is selected: press Ctrl+C (Windows) or Command+C (Mac), then paste it into your email.';
  }
});
form.querySelector('fieldset')!.disabled = false;
form.querySelector('button')!.disabled = false;
