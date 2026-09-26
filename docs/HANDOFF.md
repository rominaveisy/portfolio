# Project handoff — Romina Veisy portfolio

Prepared on 26 September 2026 for continuing on another computer and in a new Codex task. Read this together with [the continuation prompt](CONTINUE_PROMPT.md), [README](../README.md), [design reference](design-reference.md), and [verification notes](review.md).

## 1. Start here: the correct repository and branch

- Repository: <https://github.com/rominaveisy/portfolio>
- Working desktop branch: **`feature/figma-desktop`**.
- **`main` does not yet contain the website.** At handoff it still points to the initial README commit, `4e36a96`. Do not start the remaining work from `main`.
- The latest application-code checkpoint before these handoff documents is `8078210`. Clone the latest feature-branch tip to include the handoff documents as well.
- This is a working, locally reviewed desktop implementation, **not a launched website**. Pushing to GitHub is not deployment. No production merge or domain activation is part of this handoff.
- The previous computer's path was `F:\romina\project\portfolio`; that exact path is not required on the new computer.

The owner is a beginner. Explain access requests and important decisions in plain language, one step at a time. Inspect the repository and existing work before proposing changes; do not rebuild this project from scratch.

## 2. What the project is

A personal professional portfolio for **Romina Veisy**, a creative UX and visual designer. It presents her introduction, project case studies, creative gallery, contact information, and downloadable CV. The intended public domain is **`rominaveisy.com`**, purchased through Cloudflare.

The visual source is an existing Figma design, with real text and interactive HTML rather than page screenshots. Its main visual feature is a black/red/white Home composition whose circles and project-label wheel move between an introduction and three work covers.

### Sources of authority

1. The owner's latest explicit decisions, recorded below, take priority.
2. The approved Figma design takes priority over the original written brief.
3. Existing reviewed code and regression tests preserve the implementation of those decisions.

Important superseded instructions: the original brief said not to add a form, but the owner chose to keep the Figma form. An earlier request described continuous scroll scrubbing; the later approved behavior is **one scroll gesture completing one transition**. Do not undo these later decisions.

### Pages and Figma frames

Figma file: <https://www.figma.com/design/l1FhtdExdrOfrwiPk6XeIj/Untitled?node-id=0-1>

| Website route        | Purpose / approved Figma frame                                                      |
| -------------------- | ----------------------------------------------------------------------------------- |
| `/`                  | Home — Desktop Duplicate, `214:475`; the duplicate name is intentional and approved |
| `/about/`            | About — Desktop, `232:65`                                                           |
| `/work/cyclointel/`  | CycloIntel / From Signals to Strategy, `269:74`                                     |
| `/work/samenstad/`   | Samenstad / Report to Resolution, `350:154`                                         |
| `/work/positioning/` | Cyclomedia / Positioning with Confidence — Coming Soon, `418:328`                   |
| `/contact/`          | Contact, `323:146`                                                                  |
| `/cv/`               | CV — Original PDF, `430:345`                                                        |

There is also a custom 404, `robots.txt`, and `sitemap.xml`. About's active content is `450:361` and its footer is `450:616`; hidden Figma backups are not part of the implementation. Desktop reference width is 1707px (Home height 1030px); case studies use a 1120px editorial column.

## 3. Decisions that must be preserved

### Home layout and motion

- One deliberate downward scroll moves from the introduction to cover 1, then cover 2, then cover 3. An upward scroll reverses the sequence. Each movement finishes at a readable, settled cover instead of stopping halfway through the rotation.
- This is scroll-triggered motion, **not autoplay and not continuous scroll scrubbing**. Native scrollbar dragging settles to the nearest cover.
- Wheel input works across the viewport, including text, circles, navigation, links and empty space. Trackpad inertia must not skip a second cover, but fresh input must work after a transition without moving the pointer.
- Work on Home plays the transition to the first cover. R_V plays the transition back to the introduction. Neither should hard-jump or reload Home. From other pages, Work links to `/#work` and the logo to `/`.
- Arrow/Page keys and Space are supported. After the final cover, normal scrolling can reach the footer.
- The small “Scroll to explore” lettering rotates continuously on an independent 12-second CSS loop while visible, then travels upward with the intro. Its rotation must not wait for scrolling or remain pinned after the intro leaves.
- Construction/pivot dots and the unwanted white strip are hidden. Their invisible wrappers and rotation origins remain necessary for the motion.
- The latest layout balances the left introduction, right circle/headline, outer margins and column gap on wide screens. Do not reintroduce the earlier excessive right shift or the subsequent excessive left shift.
- Reduced-motion preference, Skip animation, and narrower screens expose a static list of all three projects. Do not remove this accessible fallback.
- The logo fading in during the Home transition is intentional; an initially hidden Home logo is not automatically a bug.

### Copy and navigation

- Home introduction: **“I’m Romina Veisy”** and **“a creative UX & visual designer”**. Keep “creative” and “visual” lowercase and “UX” uppercase.
- Preserve “I design experiences” and “from the inside out,” including the visual arrangement of “inside” over the white circle. Do not flatten the artistic layout into an ordinary paragraph.
- Every page uses the same fixed, **translucent** header as Home: `#000c` / `rgba(0, 0, 0, 0.8)`. Content remains visible behind it while navigation stays legible. This is the owner-accepted implementation of “transparent,” not zero-opacity navigation or an opaque black bar.
- Studio is not clickable and has no destination page. Hover or keyboard focus displays “Coming soon.”
- The third project's coming-soon page is publicly linked from Home. Do not hide it or invent a completed case study.
- About's gallery contains 55 images: 39 photographs, 9 paintings, and 7 physical models. Lightbox navigation, Escape close, and focus restoration are implemented.

### Contact: prepare drafts, do not send automatically

Public details:

- Email: **`rominaveisy.ar@gmail.com`**.
- Phone: **`+31 6 2043 5932`**, with `tel:+31620435932`; the owner explicitly approved public display.
- LinkedIn: <https://www.linkedin.com/in/rominaveisy/>.

The Google/Cloudflare login address is different; it is not the site's public contact email.

The owner explicitly selected **“Keep email drafts with Gmail/Outlook options”** instead of direct server sending. Keep the Figma name/email/message form. “Email me” and “Send message” open a dialog offering Gmail, Outlook, or an installed email app. The visitor reviews and sends from their own account. The website must not claim a message has already been sent.

The old mailto-only workflow could appear to do nothing on computers without a configured mail app. It has been replaced with visible provider choices and copy-address/copy-draft fallbacks. Preserve these fallbacks: sign-in can lose prefilled content, popups can be restricted, and clipboard permissions can be denied.

Fields remain intact when the chooser closes; reopening uses the latest edits. Required-field and whitespace validation, length limits, encoded plain-text drafts, subject newline cleanup, keyboard close/focus return, and a selectable copy fallback are implemented. No visitor input is persisted by application code or sent to a backend. Without JavaScript, the form stays disabled and visible webmail links remain available.

No email-service account, SMTP password, backend form endpoint, or API key is required for the chosen behavior. Do not add one without a new owner decision. A visitor's own signed-in email account is needed to actually send; automated tests intentionally do not send real messages.

### CV

The real original PDF is already tracked at `public/documents/romina-veisy-cv.pdf`. The original supplied filename was `Romina_Veisy_FlowCV_Resume_2026-09-25.pdf`. The new computer does not need access to the previous Downloads folder.

Expected SHA-256:

```text
99bdc7aa994832299762e10ea75d3a93e0073e53831b4539d7a4a65d3d3dfd79
```

The CV page includes a visual preview, but its download button serves this actual PDF, not a PNG. Do not modify or regenerate the CV without permission.

## 4. Stack and repository map

Astro static site, native Astro/HTML/CSS/TypeScript, GSAP + ScrollTrigger, and browser Web Animations API. No React, Tailwind, database, authentication system, analytics, payment, or direct email delivery is required. Fonts are locally bundled through Fontsource: Inter, Archivo, Newsreader, Source Serif 4, and IBM Plex Mono. Font licenses are included.

The handoff uses Astro 7.3.5, GSAP 3.15, TypeScript 6.0.3, Playwright 1.63, and Wrangler 4.139. The lockfile is authoritative. TypeScript 6 was retained for Astro checker compatibility; do not independently upgrade major versions during the handoff.

| Location                                                    | Responsibility                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/pages/`                                                | Routes, titles and page metadata, robots/sitemap endpoints                |
| `src/components/design/*.astro`                             | Figma-derived page content and composition; editable text                 |
| `src/components/Header.astro`                               | Shared navigation and Studio hint                                         |
| `src/components/ContactForm.astro`, `ContactComposer.astro` | Form and provider-choice dialog                                           |
| `src/components/Lightbox.astro`                             | About gallery dialog                                                      |
| `src/layouts/Layout.astro`                                  | Document structure, fonts, metadata and shared assets                     |
| `src/styles/design.css`                                     | Imported Figma visual primitives                                          |
| `src/styles/global.css`, `home.css`, `contact.css`          | Shared and feature-specific adaptations                                   |
| `src/scripts/home-motion.ts`                                | Home transition controller, gesture handling and responsive offsets       |
| `src/scripts/contact.ts`, `contact-ui.ts`                   | Encoded drafts and chooser/copy interactions                              |
| `src/data/home-motion.json`                                 | Exported Figma motion tracks                                              |
| `src/data/projects.ts`, `assets.json`                       | Project metadata and asset inventory                                      |
| `public/images/`                                            | 115 checked-in local artwork/image files                                  |
| `public/documents/`, `public/licenses/`                     | Original CV and font licenses                                             |
| `tests/`                                                    | Functional, layout, motion, Contact and shared-header browser regressions |
| `scripts/build.mjs`                                         | Preview/production builds and generated CSP/security headers              |
| `scripts/verify-worker.mjs`                                 | Read-only checks against local Wrangler on port 8787                      |
| `wrangler.jsonc`                                            | Cloudflare static-assets Worker configuration                             |

`data-figma-id` attributes help map code back to design layers. The textured Home circle is an export of the individual ellipse, not a screenshot of the page.

### Motion implementation notes

The motion controller seeks paused Figma animation tracks using four scene stops. Cover stops are `[0.31382, 0.5073, 0.58096, 0.63747]`; label stops are `[0.31382, 0.5057, 0.56499, 0.63083]`. They intentionally differ so labels settle cleanly rather than double or drift between covers. Intro transitions take 1.65 seconds; other transitions take 1.15 seconds.

The stage uses the 1707 × 1030 reference geometry and scales to the viewport. Additional logical width shifts the introduction by 25% of that surplus and the hero by 75%; the hero offset returns to zero during the original circle travel, preserving settled project positions. Do not replace these offsets with a blanket centering transform without comparing all four scenes. The hidden pivot wrappers must remain real transformable boxes, not `display: contents`.

Motion is enabled for widths of at least 1024px with no reduced-motion preference. The static fallback is already present, but this does **not** mean the whole website has a finished mobile design.

### What Git transfers / what it does not

Git contains the source, lockfile, motion data, images, fonts' dependency declarations/licenses, original PDF, tests and these documents. A normal install/build does not require the old computer or Figma access.

Ignored/generated items include `node_modules`, `dist`, `.astro`, `.cache`, `.wrangler`, test reports, logs, and `.env` files. The old `.cache` includes raw Figma exports, pre-optimization originals and QA screenshots. These are not required to run the website; fresh QA screenshots can be generated. If future work needs an unoptimized original absent from Git, re-export it from Figma or ask the owner for that specific asset.

**Do not rerun** `scripts/import-design.mjs`, `download-assets.mjs`, or `optimize-images.mjs` for ordinary work. They are one-time import/preparation tools using ignored inputs and can overwrite reviewed markup. Do not edit `dist` as source.

Git does not transfer signed-in browser sessions, service permissions, passwords, or the old Codex conversation. These documents are the portable context. Do not copy account/session files into the repository.

## 5. Set up the new computer

Install Git, Node.js meeting `package.json`'s requirement (at least 22.12; Node 24.19 was used for this handoff), pnpm 11.25.0, and Google Chrome. Follow normal trusted installer/sign-in flows; ask before installing tools or changing machine settings. No project secrets are needed for local development.

Clone the correct branch:

```sh
git clone --branch feature/figma-desktop https://github.com/rominaveisy/portfolio.git
cd portfolio
git status --short --branch
```

If GitHub requests access, the owner should sign in through GitHub's normal authentication flow. Do not ask for an account password in chat. If a clone already exists, inspect its current branch and uncommitted work before switching or pulling; never discard changes.

Install dependencies and start the preview:

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

Skip the global installation if the correct pnpm version is already available. Keep the dev-server terminal open and visit <http://127.0.0.1:4321/>. If that port is occupied, resolve it before testing; do not accidentally test a different project's server.

In a second terminal, from the same repository:

```sh
pnpm check
pnpm test
pnpm build
```

`playwright.config.ts` uses installed **Google Chrome** (`channel: 'chrome'`) and a server already running at port 4321. It does not start the server itself. Installing only Playwright's bundled Chromium does not satisfy that configuration. Tests can run on other operating systems with equivalent prerequisites.

`pnpm preview` serves a completed build locally. `pnpm build` is preview-safe and disables indexing. **`pnpm build:production` enables indexing but does not publish anything.** Do not deploy a preview-safe build as the final indexed production site.

On Windows, `scripts/local.ps1` is an optional helper for dev/build/check/test/preview. It first tries installed Node and then a Codex-bundled fallback. Prefer the portable pnpm commands on the new computer; do not depend on the old computer's runtime paths or change global PowerShell execution policy.

Optional local Cloudflare validation, after `pnpm build`:

```sh
pnpm exec wrangler dev --local --ip 127.0.0.1 --port 8787
```

Keep that process running and, in another terminal, run `node scripts/verify-worker.mjs`. This verifies a **preview** build and expects `noindex`; it is not a production-indexing test. Local emulation is not a deployment. Stop/restart the local Worker after rebuilding if its file watcher has trouble, particularly on Windows.

## 6. What is implemented and how it was checked

- All seven routes, shared navigation, custom 404, original CV download, local assets/fonts, and the 55-image gallery.
- Desktop Figma compositions, Home motion, later pivot/layout corrections, continuous explore cue, complete scroll transitions, page-wide wheel input, and animated Work/R_V navigation.
- Latest introduction wording and shared translucent header across all routes.
- Contact provider chooser, validation, encoded drafts, copy fallbacks, field preservation, keyboard behavior and no-JavaScript alternatives.
- Page titles/descriptions, canonical/Open Graph/Twitter metadata, environment-dependent robots/sitemap, and generated security headers. An approved social-sharing image is still missing.
- Preview-safe Cloudflare Worker configuration and local routing/security checks; no cloud account or domain was changed.

See [review.md](review.md) for the exact latest test results. Tests cover 1280/1440px desktop fitting, 1900/2560px Home balancing, assets/links, motion and keyboard/reduced-motion behavior, gallery, PDF hash, Contact, and headers on all pages.

Verification limits: Chrome automation is not a substitute for owner review or real-device testing. Gmail/Outlook tests inspect/intercept generated navigation and separately checked public endpoint reachability; they do **not** establish signed-in delivery. No real email was sent. Local Worker verification is not proof that deployed Cloudflare routing, TLS, DNS or headers are correct.

## 7. Remaining work, in recommended order

### A. Reproduce and approve the desktop baseline

1. Confirm the correct branch, dependencies, local preview and passing checks on the new machine.
2. Review Home, all three covers and case studies, About/gallery, Contact and CV with the owner. The owner reported the recent fixes working, but no final production acceptance has been recorded.
3. Record desktop screenshots at representative laptop and wide-screen sizes before responsive changes. Generated screenshot files are ignored by Git; recreate them on the new machine.

### B. Responsive/tablet/mobile pass on a separate branch

The owner explicitly requested preserving the desktop version. After approval, create a separate branch from the **latest approved `feature/figma-desktop` tip**, for example `codex/responsive-and-launch`. This name is a suggestion, not an existing branch. Do not branch from the stale `main`.

Implement real narrow-screen reflow instead of merely shrinking the 1707px artboards. Cover navigation, typography, case-study reading order/images, gallery, Contact form/dialog, CV and footer. Preserve the existing static Home/reduced-motion fallback; discuss any materially different mobile motion with the owner. Add responsive regressions and rerun desktop tests/screenshots after each substantive layout change. A separate branch preserves a recoverable baseline; it does not by itself guarantee visual equivalence.

### C. Pre-launch content and quality review

- Obtain owner approval of a social-sharing image; do not invent branding/content or generate artwork without approval.
- Verify all visible text, links, phone/email, CV, image descriptions and coming-soon labels.
- Test Chrome, Firefox and Safari, actual phones/tablets, touch, mouse wheel and trackpad. Check keyboard/focus, contrast, reduced motion, overflow, image loading and performance.
- With the owner's participation, manually review signed-in Gmail/Outlook draft handoff and installed-email-app behavior. Only send a real test email if expressly authorized; a compose window alone is not delivery.
- Review the built site with actual CSP/security headers, not only the development server. Fix failures without silently deleting security protections.
- If adding third-party services later, assess their privacy/accessibility impact first. No such service is needed for the currently agreed form.

### D. Cloudflare preview, then approved launch

The owner chose Cloudflare. Keep that provider unless they explicitly change the decision. The prepared configuration is a static-assets Worker named `romina-portfolio`, serving `dist`, with trailing-slash routing and a real 404 fallback. There is no embedded account token or custom-domain route.

Ask the owner to sign into their own Cloudflare account and authorize the repository when needed. Check current official Cloudflare documentation/dashboard behavior before applying the deployment plan in README; it has not been exercised against a real cloud account. Do not assume an existing project, DNS record, custom domain or build integration is safe to overwrite.

1. Inspect existing account, zone, DNS and repository integration. Preserve unrelated records, especially any email records. Ask for missing access specifically.
2. Create/configure an approved branch preview with indexing disabled. Review it before production. `noindex` is not access control; ask whether a private preview needs authentication.
3. Verify preview headers, scripts, nested-route refresh, real 404 status, CV and contact drafts under deployed CSP. Confirm the exact deployed Git commit.
4. After explicit launch approval, review/merge the finished branch into `main` without losing the desktop baseline. Only then use `main` as the production source. Do not deploy the current initial-README `main`.
5. Use the production build mode so intended production pages are indexable. Connect `rominaveisy.com`; configure a permanent `www` → apex redirect preserving paths and query strings, after reviewing existing DNS. Verify HTTPS and canonical URLs.
6. Verify production robots/sitemap, response/security headers, preview exclusion from indexing, nested routes, assets, 404, email drafts, CV and mobile behavior on the public domain. Confirm the deployed commit matches the approved source.
7. Give the owner the live URL, deployment/update instructions, and rollback procedure. Domain renewal/payment/recovery remain in the owner's account.

Stop for missing access or consequential choices; do not declare launch complete from a local build or Git push. Do not merge, publish, change DNS, send real messages, or add paid services merely because this handoff describes a future launch.

## 8. Access and safety

- **Local run:** no service credentials needed once the repository is available.
- **GitHub:** new computer may need fresh authentication with repository read/push permission.
- **Figma:** new session may need separate access/connection for design inspection or re-export. Existing code runs without it. When using Figma tools, follow the installed Figma skills' prerequisites.
- **Cloudflare:** owner sign-in, appropriate Worker/domain permissions and repository authorization are needed for deployment; not yet supplied through a connected deployment tool.
- **Email:** visitors use their own accounts for drafts. The developer does not need the owner's inbox password.

Never put passwords, tokens, two-factor codes, recovery codes, `.env` secrets, or browser session data in Git, chat, or the handoff. Ask the owner to complete sign-in in the service's own interface. Do not copy previously shared credentials into any new prompt.

Keep the repository organized. Preserve unrelated edits. Use feature branches and additive commits; never force-push, erase history or use destructive resets to handle routine changes. For rollback, prefer a revert commit or provider deployment rollback with a matching source correction. Run the regression suite and inspect screenshots before claiming a visual change is safe.

## 9. Recent history for orientation

| Commit    | What changed                                                                             |
| --------- | ---------------------------------------------------------------------------------------- |
| `cd7fca6` | Initial full Figma desktop portfolio and motion implementation                           |
| `44fdc2d` | Hidden pivots, complete scroll transitions, continuous explore cue and navigation motion |
| `492ce32` | Balanced Home columns and fresh page-wide wheel input                                    |
| `1cf2631` | Gmail/Outlook/email-app draft choices and Contact fallbacks                              |
| `6f7196a` | “a creative UX & visual designer” introduction wording                                   |
| `8078210` | Shared translucent Home-style header on every page                                       |

Later commits on the branch include these handoff documents. Treat the actual checked-out source and fresh test results as current if development continues after this handoff.
