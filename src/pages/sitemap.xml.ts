export function GET() {
  const paths = [
    '/',
    '/about/',
    '/contact/',
    '/cv/',
    '/work/cyclointel/',
    '/work/samenstad/',
    '/work/positioning/',
  ];
  const production = import.meta.env.PUBLIC_SITE_ENV === 'production';
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production ? paths.map((path) => `<url><loc>https://rominaveisy.com${path}</loc></url>`).join('') : ''}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
