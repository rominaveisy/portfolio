/** Builds a draft only; this website never transmits or stores form submissions. */
export function buildMailto(name: string, email: string, message: string): string {
  const cleanName = name.replace(/[\r\n]+/g, ' ').trim();
  const subject = `Portfolio enquiry from ${cleanName}`;
  const body = `Name: ${cleanName}\nEmail: ${email.trim()}\n\n${message.trim()}`;
  return `mailto:rominaveisy.ar@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
