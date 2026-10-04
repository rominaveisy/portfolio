# Production deployment record

## Work illustration balance — 4 October 2026, latest release

The owner requested a professional review of illustration size and position, and removal of the curved “Work” label. All three illustrations now share a responsive column centred in the available space to the right of the copy. They grow on wider screens and retain clear text and viewport margins on laptops. The curved label and its animation styling are removed.

- Source commit: `de7d43a`, preserved on `codex/work-layout-balance` and advanced to `main`.
- Cloudflare version: `3bd18d10-fae4-4ecd-95f0-221d96a0c8aa`; tag `de7d43a`; message `work-layout-balance-2026-10-04`.
- Astro check: zero errors, warnings or hints. Production build and deployment dry run passed.
- Chrome regression verification: 50 tests passed in the full run; the updated illustration check passed on a targeted rerun after allowing for the shorter ultrawide aspect ratio. All 51 checks passed across those runs.
- Before/after visual review covered five desktop widths and 390px mobile. All 15 live cover measurements match the reviewed local layouts, with no overflow or runtime errors. Text positions, wheel pivots, links and mobile alternatives are preserved.
- Live production verification passed at `2026-10-04T21:13:54.046Z`: seven routes, 125 assets/links, metadata, PDF, redirects, motion, responsive layouts, gallery, contact drafts and no-JavaScript fallback. The production check now expects the curved label to be absent.

The subsequent verification/documentation commit does not change the deployed bundle. The preceding deployed version remains `f149c296-927e-4910-85c0-176595859b95` for rollback.

## Circular favicon — 4 October 2026

The owner chose a black circle with centred red R_V lettering after reviewing the square variant. The circle fills the icon canvas, with transparency only outside its circular edge and no white fill or inset square.

- Source commit: `12a8ee7`, preserved on `codex/circular-favicon` and advanced to `main`.
- Cloudflare version: `f149c296-927e-4910-85c0-176595859b95`; tag `12a8ee7`; message `circular-favicon-2026-10-04`.
- Only the SVG and PNG assets changed in this deployment. Build and deployment dry run passed; live files matched the reviewed local files. Pixel checks verified an opaque circle interior, no white fill, transparent exterior corners and lettering centred within 1px.
- Google must recrawl the stable favicon URL to refresh its result. Its surrounding badge remains controlled by Google.

## Favicon clarification — 4 October 2026

The owner clarified that the entire favicon canvas, including the corners, must be black, with only R_V in red. Both SVG and PNG now have a fully opaque black background rather than transparent corners around a circle.

- Source commit: `65bc81d`, saved on `codex/solid-black-favicon` and advanced to `main`.
- Cloudflare version: `218065a3-f80f-4748-b5b9-ffbf5ff81460`; tag `65bc81d`; message `solid-black-favicon-2026-10-04`.
- Deployment changed only the two favicon assets. Production build and deployment dry run passed.
- Both live files matched the reviewed local files. Pixel checks verified the 96px PNG is fully opaque, all four corners are pure black, and there are no white pixels. Google still controls its surrounding search-result badge and refresh schedule.

## Current release — 4 October 2026

The owner-approved portfolio refinements are live at **https://rominaveisy.com/**. See [REFINEMENTS.md](REFINEMENTS.md) for the requested changes, preservation checks and HTTP entry investigation.

- Source commit: `8609d00dd0c2ac3184e836f6658e4e1e8e0c1bf7`, pushed to `codex/portfolio-refinements` and advanced onto `main` without rewriting history.
- Cloudflare version: `1cc88e47-7ab5-4a11-8081-082d3d812b60`, serving 100% of traffic since `2026-10-04T19:55:50.660Z`.
- Version tag: `8609d00`; release message: `portfolio-refinements-2026-10-04`.
- Preflight: 51 Chrome tests passed; Astro check returned zero errors/warnings/hints; production build, local production verification, updated routing checks and Wrangler dry run passed.
- Live verification passed starting at `2026-10-04T19:56:14.025Z`: all seven pages, 125 assets/links, updated title/PDF/favicon, indexing, canonical URLs, security headers, HTTP/www redirects with paths/queries, host-specific HSTS, layouts, motion, gallery, contact drafts, no-JavaScript fallback and 404/trailing-slash handling.
- Interactive deployment kept both existing custom domains and produced no DNS-conflict prompt. No DNS or firewall rule was changed.
- A clean profile in installed Firefox opened the original HTTP www entry successfully before deployment; this is a targeted navigation check, not a full Firefox regression suite. A later automated headless capture timed out, so the complete production regression evidence is from Chrome. The owner's Firefox failed on HTTP but opened HTTPS www. **After deployment, the owner visited the secure www URL to receive the new HTTPS policy and confirmed that Google's old Home result now opens successfully.**
- The revised one-page PDF was visually reviewed, its links/text verified, and a rendered comparison showed no changes outside the four approved edit regions. Its original remains recoverable from Git history.

A subsequent documentation-only commit records this release and does not alter the deployed bundle. Roll back to the September version below if needed, then revert the source change to prevent it being redeployed. The one-day, host-specific HSTS policy expires after a day without refresh; to remove it immediately for a browser that revisits securely, serve `Strict-Transport-Security: max-age=0` on that host.

## Original launch — 26 September 2026

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
