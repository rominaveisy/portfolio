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

- **Live and verified:** https://rominaveisy.com/
- Source commit: `5d888eb620e94977865d9ff74663e3e3057bfade`, pushed to both `main` and `codex/responsive-and-launch` before deployment.
- Cloudflare version: `1b97e09f-0504-45b3-8d6b-983bce6e86ae`.
- Deployment: `22052d6f-4eda-4642-8e07-f8af51382ed9`, serving 100% of traffic, created at `2026-09-26T20:45:54.224433Z`.
- Version tag: `5d888eb`; release message: `production-launch-2026-09-26`.
- Cloudflare confirms both custom domains are enabled with certificates. Interactive deployment completed without a conflicting DNS-record prompt.
- Public verification passed on 26 September 2026, starting at `20:47:46 UTC`: seven routes, 123 assets/internal links, HTTPS, all three HTTP/www canonical redirects with encoded paths/queries, indexable page metadata, canonical URLs, robots/sitemap, security headers, original PDF hash, Home motion, responsive layouts, gallery, contact drafts, no-JavaScript fallback, true 404 and trailing-slash routing.
- The first live run reached the final www check before encountering transient DNS propagation. Cloudflare and Google public DNS resolvers subsequently returned both hostnames, and the complete live verification passed on retry.
- Ignored local verification artifacts: `.cache/production-qa/rominaveisy.com/` (report and screenshots).

The subsequent documentation-only commit records these results; it does not change the deployed website bundle. The user-supplied `readme.txt` remains local and untracked. Original desktop history, artwork, CV and motion data are preserved.

## Future updates and rollback

Use `main` as the starting point. Review changes on a branch, run the checks described in README, save them to GitHub, then explicitly build production and deploy with the source commit as the Wrangler version tag. GitHub pushes alone do not deploy. Re-run `pnpm verify:production` after each release.

To restore this known-good release after a later deployment, run `pnpm exec wrangler rollback 1b97e09f-0504-45b3-8d6b-983bce6e86ae`, then revert the faulty source change in Git. Do not erase history or alter unrelated domain/email settings.

## Remaining optional review

No custom social-sharing artwork was invented. The existing text metadata remains. Firefox/Safari and physical devices remain unverified because the owner selected installed Chrome only. No real email was sent.
