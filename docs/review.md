# Desktop review — 26 September 2026

## Verified locally

- Seven approved desktop routes and the custom 404 screen build successfully.
- Astro/TypeScript check: zero errors and zero warnings.
- Local Cloudflare Worker verification passes: seven routes, Content Security Policy, search/security headers, working scripts, 404 status and trailing-slash redirect with query preservation. This is local emulation, not a cloud deployment.
- 20 browser tests pass in Chrome, including 1280px and 1440px laptop widths.
- All page images have local, nonempty rendered slots; internal links and assets return successfully.
- Home motion advances with scroll position, remains unchanged while stopped, and returns to the same state when scrolled back.
- Work opens the first project; the third project links to its coming-soon page.
- The 55-image gallery opens, changes images, closes with Escape and restores keyboard focus.
- Contact fields are labelled and required. The email draft encodes visitor input, and the no-JavaScript form is disabled with an email fallback.
- Studio is not a link; its keyboard/hover hint works.
- The CV download’s SHA-256 matches the original supplied PDF exactly.
- The reduced-motion and skip-animation versions expose all projects.
- Visual checkpoints reviewed for Home and all three project stages, About, Contact, CV and the three case-study introductions.

## Still needs approval or later work

- Owner review of desktop visual details and Home scroll pacing.
- Full tablet/mobile reflow on a separate branch from the approved desktop version. Current proportional desktop fitting is not the final mobile design.
- Approved social-sharing preview image.
- Cloudflare account connection, branch-preview deployment, production deployment and domain activation.
- Verification on the actual deployed host: HTTPS, www redirect preserving path/query, indexing rules and matching Git commit.
- Additional Safari/Firefox and real-device testing before launch.

Local verification does not mean the site has been published, and it does not replace the owner's design approval.
