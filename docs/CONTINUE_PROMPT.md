# Copy-paste continuation prompt

Copy the text below into a new Codex task on the other computer. Ideally clone the repository's `feature/figma-desktop` branch and open its folder first. This prompt describes the intended future work; it does not authorize immediate production deployment or DNS changes.

---

I am continuing my existing Romina Veisy portfolio website from another computer and an earlier Codex task. Please continue the existing project, not rebuild it from scratch. I am a beginner: explain important steps simply, and ask for specific missing access when necessary. Do not ask me to paste passwords or tokens into chat.

## Start with the repository and handoff

Repository: https://github.com/rominaveisy/portfolio

The completed desktop work and handoff are on **`feature/figma-desktop`**. **Do not start from `main`: at handoff, it contains only the initial README.** The last application-code checkpoint before the handoff documents was `8078210`; use the latest feature-branch tip, not that older commit alone.

If the project is not already available, help me clone the correct branch after checking installed tools and GitHub access. If a local checkout exists, inspect its branch, remote, Git status and uncommitted changes before changing anything. Preserve existing work. Do not assume the old Windows path or old Codex conversation exists here.

Before implementation, read these repository files completely:

1. `docs/HANDOFF.md` — full project state, decisions, setup, technical notes, remaining work, access and launch safeguards.
2. `README.md` — commands, structure and prepared hosting plan.
3. `docs/design-reference.md` and `docs/review.md` — approved frames and verification scope.
4. `package.json`, `playwright.config.ts`, and relevant source/tests before editing.

Then give me a concise explanation of what is already done, what remains, whether the baseline runs on this computer, and your proposed next step. Do not repeat the original discovery process or ask me to reconfirm decisions already documented unless there is a genuine conflict.

## Project and source of truth

This is my professional UX/visual design portfolio for **Romina Veisy**, intended for **rominaveisy.com**, a domain I own through Cloudflare. It is an Astro static site with local artwork/fonts, TypeScript, GSAP/ScrollTrigger and exported Figma animation tracks.

Figma: https://www.figma.com/design/l1FhtdExdrOfrwiPk6XeIj/Untitled?node-id=0-1

The Figma design takes priority over the original written brief. My latest explicit decisions, summarized here and in the handoff, override older brief/prototype behavior. The approved Home frame is named “Home — Desktop Duplicate”; this is intentional.

Seven pages already exist: Home, About, CycloIntel, Samenstad, Cyclomedia Positioning coming soon, Contact and CV. There is a 55-image About gallery, working original-PDF download, custom 404, metadata and preview-safe Cloudflare configuration. The website has **not** been deployed or launched.

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

## Remaining work through launch

1. Reproduce the working desktop baseline and review any final desktop details with me. Save fresh screenshots for regression comparison.
2. Complete proper tablet/mobile layouts **on a separate branch from the latest approved desktop feature-branch tip**, not from stale `main`. A suitable new branch name would be `codex/responsive-and-launch`. Keep the original desktop branch available and verify desktop behavior after responsive changes. The current small-screen Home fallback is not a finished mobile website.
3. Obtain approval for a social-sharing image; finish content, accessibility, performance, real-device and Safari/Firefox checks. Do not invent project content or send a real test email without asking.
4. With my account access, verify the current official Cloudflare deployment instructions and existing account/DNS state, then prepare an approved branch preview. The repository has Worker configuration, but no actual deployment/domain connection has been completed. Keep previews non-indexable; `noindex` is not privacy protection.
5. After my explicit launch approval, review/merge the completed work to `main`, build production with indexing enabled, deploy to Cloudflare and connect `rominaveisy.com`. Review DNS before changes and preserve unrelated/email records. Verify HTTPS, www-to-apex redirect with paths/query strings, canonical URLs, sitemap/robots, CSP/security headers, all routes/404, CV/contact and the exact deployed commit.
6. Give me clear maintenance/update/rollback instructions when the public site is genuinely verified.

`pnpm build` creates a non-indexable preview build; `pnpm build:production` creates an indexable production build. Neither command alone deploys. Do not launch, change DNS, force-push, discard changes, add paid services, or replace Cloudflare with another provider without the necessary explicit approval. Sign-in sessions do not transfer between computers; tell me precisely which access is needed at each step and let me sign in securely.

Please start by inspecting the repository and reading the handoff, checking this computer's setup, and explaining your next step in plain language. Continue step by step toward a reviewed, responsive, safely launched site.
