export const CONTACT_EMAIL = 'rominaveisy.ar@gmail.com';
export interface EmailDraft {
  subject: string;
  body: string;
}

/** Builds a draft only; delivery happens in the visitor's chosen email service. */
export function buildDraft(name = '', email = '', message = ''): EmailDraft {
  const cleanName = name.replace(/[\r\n]+/g, ' ').trim();
  const cleanEmail = email.replace(/[\r\n]+/g, ' ').trim();
  if (!cleanName && !cleanEmail && !message.trim()) return { subject: '', body: '' };
  return {
    subject: `Portfolio enquiry from ${cleanName}`,
    body: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${message.trim()}`,
  };
}

function query(values: Record<string, string>) {
  // Percent-encode spaces explicitly: some webmail sign-in redirects mishandle '+'.
  return Object.entries(values)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

export function buildComposeLinks(draft: EmailDraft) {
  return {
    gmail: `https://mail.google.com/mail/?${query({ view: 'cm', fs: '1', to: CONTACT_EMAIL, su: draft.subject, body: draft.body })}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?${query({ to: CONTACT_EMAIL, subject: draft.subject, body: draft.body })}`,
    mailto: `mailto:${CONTACT_EMAIL}?${query({ subject: draft.subject, body: draft.body })}`,
  };
}

export function formatDraft(draft: EmailDraft) {
  return draft.body
    ? `To: ${CONTACT_EMAIL}\nSubject: ${draft.subject}\n\n${draft.body}`
    : CONTACT_EMAIL;
}

export function buildMailto(name: string, email: string, message: string): string {
  return buildComposeLinks(buildDraft(name, email, message)).mailto;
}
