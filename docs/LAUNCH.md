# Production launch — 26 September 2026

The owner explicitly requested updating the remote Git repository, deploying the latest version and finalizing the site. This authorizes this production launch and supersedes the earlier preview-only plan.

## Prepared release

- Repository: https://github.com/rominaveisy/portfolio
- Production source: `main`, advanced from the reviewed `codex/responsive-and-launch` branch without rewriting history.
- Original desktop checkpoint: `feature/figma-desktop` at `221803abf3d3b250f77ec222db51c9436f7253c5`.
- Cloudflare account: the owner's account signed in as `romina.veisy@gmail.com`.
- Worker: `romina-portfolio`.
- Public URL: `https://rominaveisy.com/`; `www` and HTTP redirect permanently to the HTTPS apex with paths and query strings retained.
- Production builds enable indexing. The custom 404 remains excluded. Worker development and version URLs are disabled.
- Deployment is manual through Wrangler; no automatic GitHub build integration is configured.

## Preflight evidence

- Full existing Chrome suite plus responsive regressions: 50 tests passed; all six static desktop screenshots matched the baseline.
- Production build and Wrangler dry run passed.
- Canonical routing checks passed for both hostnames, HTTP/HTTPS, paths and encoded query strings.
- Local production runtime passed seven routes; 123 referenced assets and internal links; CSP/security headers; indexing, robots and seven-entry sitemap; real 404 and trailing-slash redirect; original CV hash; Home motion; 320/390/768/1440px overflow checks; gallery controls; contact drafts; and no-JavaScript fallbacks.
- Existing Worker/domain routes were empty. Direct DNS-list permission was unavailable to the standard Wrangler OAuth token. Public DNS showed no A/AAAA/CNAME records on the apex or `www`, and no MX records on those names. Domain creation must still respect Cloudflare's conflict check; no unrelated DNS changes are needed.

## Deployment status

Prepared and locally verified. Remote push, Cloudflare version and live verification will be recorded after each succeeds.

## Remaining optional review

No custom social-sharing artwork was invented. The existing text metadata remains. Firefox/Safari and physical devices remain unverified because the owner selected installed Chrome only. No real email was sent.
