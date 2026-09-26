export function GET() {
  const production = import.meta.env.PUBLIC_SITE_ENV === 'production';
  return new Response(
    production
      ? 'User-agent: *\nAllow: /\nSitemap: https://rominaveisy.com/sitemap.xml\n'
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
