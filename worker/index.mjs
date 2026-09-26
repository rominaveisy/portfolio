// Keep canonical redirects in version control alongside the static site.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (
      url.hostname === 'www.rominaveisy.com' ||
      (url.hostname === 'rominaveisy.com' && url.protocol !== 'https:')
    ) {
      url.protocol = 'https:';
      url.hostname = 'rominaveisy.com';
      url.port = '';
      return Response.redirect(url.href, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
