# New computer baseline and responsive review — 26 September 2026

**Launch update:** the owner subsequently authorized the GitHub update and production launch. See [LAUNCH.md](LAUNCH.md) for the current release status; the remaining-decision notes below describe the earlier review stage.

## Source and setup

- Checkout: `D:\projects\personal website\romina`.
- Baseline: `feature/figma-desktop` at `221803abf3d3b250f77ec222db51c9436f7253c5`.
- Continuation branch: `codex/responsive-and-launch`, created from that baseline.
- The surrounding workspace repository and the user-supplied `readme.txt` were preserved.
- Node: 24.19.0. Google Chrome is installed.
- Existing pnpm: 11.19.0. With owner approval, pnpm 11.25.0 was used through `pnpm dlx pnpm@11.25.0`; the global installation was not replaced.
- Dependency installation used the frozen lockfile. No application source, lockfile, original PDF, or Figma export was changed during setup.

## Verified on this computer

- Astro/TypeScript: zero errors, warnings, or hints across 39 files.
- All 41 Chrome browser regressions passed (1.7 minutes).
- Preview build passed with search indexing disabled.
- Local Cloudflare Worker checks passed: seven routes, scripts, CSP and security/search headers, real 404 response, and trailing-slash redirect preserving the query string.
- Existing tests verified the original CV hash and contact draft behavior without sending email.
- Fresh screenshots are in `.cache/qa/`. Additional 390px, 768px, and 1440px captures and layout measurements are in `.cache/baseline/`. These are local, ignored artifacts.

The initial browser run had 27 passes and 14 Home motion failures. Browser diagnostics found HTTP 504 `Outdated Optimize Dep` responses for the GSAP development bundles. Restarting the development server refreshed its dependency cache; the complete suite then passed without any application change. If `check` or `build` invalidates a running development server's dependency cache, restart the server before browser testing. Do not change motion code to work around that cache condition.

## Local commands

From this checkout:

```sh
pnpm dlx pnpm@11.25.0 dev
pnpm dlx pnpm@11.25.0 check
pnpm dlx pnpm@11.25.0 test
pnpm dlx pnpm@11.25.0 build
```

The development preview uses `http://127.0.0.1:4321/`. Tests expect that server to be running. The local Worker emulator uses port 8787 and is separate from the development preview. Neither starts a cloud deployment.

## Figma access confirmed

The connected account successfully retrieved Home (214:475), the active About content (450:361), Contact (323:146), Positioning (418:328), root metadata, and Home motion data from `l1FhtdExdrOfrwiPk6XeIj`. The sharing issue is resolved. The file contains desktop layouts; no mobile/tablet design frames were found. The latest handoff wording and interaction decisions remain authoritative where they differ from older Figma content.

Subsequent reference requests reached the connector's plan/seat usage limit. This is a separate quota issue, not another file-sharing failure. No Figma nodes were changed. No plan upgrade is required to run or continue reviewing this local implementation.

## Responsive implementation

- Added `src/styles/responsive.css`, scoped below the existing 1024px motion breakpoint. About, Contact, CV, Positioning and case studies now reflow instead of shrinking the entire desktop canvas.
- Home retains static mobile navigation and its three project cards, with a flowing introduction, the original circle artwork, and a direct selected-work link. Desktop motion/controller data were not changed.
- About preserves the portrait and all 55 gallery images, with two-column phone and four-column tablet galleries, natural image proportions, usable image buttons and the existing lightbox/focus behavior.
- Contact retains its original orbit artwork, real validation, provider chooser, no-JavaScript links, copy fallbacks, and honest email-draft behavior. No backend or email delivery was added.
- Case-study rows wrap, phone screenshots retain proportions, and the two detailed Samenstad diagrams have labelled keyboard-scrollable regions on narrow screens. Content and reading order remain shared with desktop.
- Added intrinsic dimensions to 97 existing raster images to reserve space during loading. No image files were modified. The Positioning poster retains its original image markup and reserves its mobile space through its container's aspect ratio; changing its HTML dimensions altered Chrome's texture resampling on desktop.
- The original CV PDF, package versions, lockfile, imported design primitives, Home controller, and Figma motion tracks are unchanged.

## Verification after responsive work

- Astro check: 40 files, zero errors, warnings or hints.
- Complete Chrome suite: **50 tests passed**, including all 41 existing regressions and nine new responsive tests.
- After the final poster markup correction, all 24 affected portfolio/responsive checks passed again; the preview build and local Worker verification were refreshed successfully.
- New tests cover all seven routes at 320, 390, 768 and 1023 CSS pixels, page overflow, unscaled artboards, nonempty image slots, navigation targets, all gallery buttons, lightbox touch/focus, the narrow email chooser, keyboard diagram scrolling, desktop-to-mobile resize, and no-JavaScript behavior.
- Preview-safe build and local Worker route/CSP/security/indexing/script/404/redirect checks passed.
- All six static desktop page checkpoints match the saved baseline pixel-for-pixel after preserving the poster image markup. Home motion tests pass; animated cue and transition capture timing can produce small screenshot differences. Wide-screen geometry checks at 1900 and 2560 pixels pass.
- Reviewed phone/tablet first-screen captures and ten representative sections below the fold, including gallery, footers, case-study screenshots/diagrams, and Positioning artwork.
- Screenshots and diagnostics are ignored local artifacts in `.cache/responsive/`; the preserved baseline is `.cache/baseline/approved-desktop/`. Existing tests refresh `.cache/qa/`.

The owner requested testing with installed Chrome only. Firefox/WebKit were not downloaded. Firefox, Safari and physical-device verification remain unverified, as does sending from an actual signed-in email account. No real email was sent.

## Remaining access and owner decisions

Cloudflare authentication is now confirmed. The first OAuth attempt timed out, but the owner completed the retried browser authorization on 26 September 2026. `wrangler whoami` identifies `romina.veisy@gmail.com`. Read-only account inspection found no Workers or Pages projects; the configured `romina-portfolio` Worker does not yet exist. The `rominaveisy.com` zone is active. This account has not initialized a `workers.dev` subdomain, so no preview URL is available yet. DNS records and repository integrations have not been inspected or changed. No temporary preview account was created. See [PREVIEW_PLAN.md](PREVIEW_PLAN.md) for the prepared workflow and current official references. Preview publishing and production launch remain separate owner decisions. Production also needs explicit launch approval, review of existing DNS, the production indexing build, and deployed verification.

Owner review of desktop/mobile content and the responsive adaptations is still pending. An approved social-sharing image is also still missing; none was generated or added without that decision. The work remains in the local continuation branch. No cloud deployment, DNS change, GitHub push, merge, paid service, or real email was performed.
