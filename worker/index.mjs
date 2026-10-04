// Keep canonical redirects in version control alongside the static site.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const publicHost = ['rominaveisy.com', 'www.rominaveisy.com'].includes(url.hostname);
    const secureRequest = url.protocol === 'https:';
    let response;
    if (
      url.hostname === 'www.rominaveisy.com' ||
      (url.hostname === 'rominaveisy.com' && url.protocol !== 'https:')
    ) {
      url.protocol = 'https:';
      url.hostname = 'rominaveisy.com';
      url.port = '';
      response = Response.redirect(url.href, 301);
    } else {
      response = await env.ASSETS.fetch(request);
    }
    if (publicHost && secureRequest) {
      // Remember HTTPS for this host after a secure visit, including www redirects.
      // Start with one day; do not impose a policy on unrelated subdomains.
      response = new Response(response.body, response);
      response.headers.set('Strict-Transport-Security', 'max-age=86400');
    }
    return response;
  },
};
