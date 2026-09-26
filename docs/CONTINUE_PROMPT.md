# Copy-paste continuation prompt

Copy the text below into a new Codex task on the other computer. Clone the repository's `main` branch and open its folder first. The site is live; this prompt does not independently authorize a new publication or DNS change.

---

I am continuing my existing Romina Veisy portfolio website from another computer and an earlier Codex task. Please continue the existing project, not rebuild it from scratch. I am a beginner: explain important steps simply, and ask for specific missing access when necessary. Do not ask me to paste passwords or tokens into chat.

## Start with the repository and handoff

Repository: https://github.com/rominaveisy/portfolio

The responsive, published website is on **`main`**. The approved original desktop work remains on `feature/figma-desktop`, and the responsive release checkpoint is on `codex/responsive-and-launch`. Start from the current `main`, preserve history, and use `docs/LAUNCH.md` for the deployed source commit and Cloudflare version.

If the project is not already available, help me clone the correct branch after checking installed tools and GitHub access. If a local checkout exists, inspect its branch, remote, Git status and uncommitted changes before changing anything. Preserve existing work. Do not assume the old Windows path or old Codex conversation exists here.

Before implementation, read these repository files completely:

1. `README.md`, `docs/LAUNCH.md` and `docs/NEW_COMPUTER_REVIEW.md` — current source, commands, published release, responsive work and verification limits.
2. `docs/HANDOFF.md` — historical pre-launch state and preserved design/interaction decisions; do not treat old branch or pending-launch statements as current.
3. `docs/design-reference.md` and `docs/review.md` — approved frames and original verification scope.
4. `package.json`, `playwright.config.ts`, and relevant source/tests before editing.

Then give me a concise explanation of what is already done, what remains, whether the baseline runs on this computer, and your proposed next step. Do not repeat the original discovery process or ask me to reconfirm decisions already documented unless there is a genuine conflict.

## Project and source of truth

This is my professional UX/visual design portfolio for **Romina Veisy**, intended for **rominaveisy.com**, a domain I own through Cloudflare. It is an Astro static site with local artwork/fonts, TypeScript, GSAP/ScrollTrigger and exported Figma animation tracks.

Figma: https://www.figma.com/design/l1FhtdExdrOfrwiPk6XeIj/Untitled?node-id=0-1

The Figma design takes priority over the original written brief. My latest explicit decisions, summarized here and in the handoff, override older brief/prototype behavior. The approved Home frame is named “Home — Desktop Duplicate”; this is intentional.

Seven pages are live: Home, About, CycloIntel, Samenstad, Cyclomedia Positioning coming soon, Contact and CV. The responsive website includes the 55-image gallery, original-PDF download, custom 404 and production metadata. Cloudflare serves https://rominaveisy.com/ and permanently redirects HTTP and www to that HTTPS apex. Deployment is manual through Wrangler; a GitHub push does not automatically publish.

## Preserve these approved behaviors

- Home: one intentional scroll gesture completes one transition from introduction to cover 1, then 2, then 3; scrolling up reverses. Do not switch to autoplay or continuous scrubbing, and do not leave covers halfway rotated. Scrolling must work over the whole screen, not only certain pointer positions.
- Work on Home and R_V use the same forward/backward motion, without hard jumps or reloads. Keep inertia filtering, keyboard navigation, reduced-motion and skip/static alternatives.
- Keep pivot construction graphics invisible while preserving transform wrappers/origins. Preserve the corrected balanced Home margins/column gap and settled cover positions.
- “Scroll to explore” rotates continuously and moves upward with the introduction; its rotation is independent of scrolling.
- Home wording is “I’m Romina Veisy” / **“a creative UX & visual designer”**. Preserve “I design experiences” and the circle-aligned “from the inside out.”
- All pages share the fixed Home-style translucent header, `rgba(0, 0, 0, 0.8)`, so content remains visible behind it. Do not restore solid headers elsewhere.
- Studio is non-clickable with a hover/keyboard “Coming soon” hint. The third project's coming-soon page remains publicly linked from Home.
- Public email: **rominaveisy.ar@gmail.com**. Public phone: **+31 6 2043 5932**. LinkedIn: https://www.linkedin.com/in/rominaveisy/. Do not substitute my account-login email.
- Keep the Figma Contact form. I selected **email drafts with Gmail/Outlook options**, not automatic sending. Email me and Send message open provider choices; visitors review and send in their own account. Preserve email-app and copy-draft/address fallbacks, validation, field preservation and no-JavaScript alternatives. Do not add an email service or claim a draft was sent.
- Keep the original PDF in `public/documents/romina-veisy-cv.pdf`; no file from the old Downloads folder is needed.

## Next-computer setup and checks

Use Node at least 22.12 (24.19 was used previously), pnpm 11.25.0, Git and installed Google Chrome. Ask before installing tools or changing system settings. Install dependencies with `pnpm install --frozen-lockfile`; run `pnpm dev` and leave it running at http://127.0.0.1:4321/.

In another terminal run `pnpm check`, `pnpm test`, and `pnpm build`. Playwright uses installed Chrome and expects the server already running; it does not start the server itself. The handoff records the exact last verified results; rerun them here. Contact tests do not send real email, and local Cloudflare checks do not prove a cloud deployment works.

Normal builds need no secret environment variables or old `.cache` folder. Do not rerun the one-time Figma import/download/optimization scripts, edit generated `dist`, or upgrade major dependencies as part of the move. Use the existing organized structure and lockfile.

## Future work

1. Reproduce the current site before making the newly requested changes. Preserve the approved desktop composition, original assets, CV and Home motion.
2. Make updates on a fresh branch from current `main`. Mobile/tablet reflow is already implemented; do not restart it from the old desktop branch.
3. Keep the owner's choice to test with installed Chrome only. Firefox/Safari, physical-device review and a custom social-sharing image remain optional outstanding work. Do not install browsers, invent artwork or send real email without the necessary instruction.
4. Before an authorized publication, verify account access and the existing Worker/domain configuration. Do not replace unrelated DNS or email records. Keep local preview builds non-indexable.
5. Follow README's production update commands and run `pnpm verify:production` after deployment. Record the exact source commit and Cloudflare version in `docs/LAUNCH.md`.

`pnpm build` creates a non-indexable preview build; `pnpm build:production` creates an indexable production build. Neither command alone deploys. Do not launch, change DNS, force-push, discard changes, add paid services, or replace Cloudflare with another provider without the necessary explicit approval. Sign-in sessions do not transfer between computers; tell me precisely which access is needed at each step and let me sign in securely.

Please start by inspecting the repository, current launch record and this computer's setup, then explain the next step for the change I request in plain language.
