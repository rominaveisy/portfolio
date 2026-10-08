# Romina Veisy — portfolio

Astro, CSS and JavaScript, built from the approved Figma desktop designs. The design takes priority over the original brief wherever they conflict.

## Continuing on another computer

Start with the [complete project handoff](docs/HANDOFF.md) and [copy-paste prompt for the next Codex task](docs/CONTINUE_PROMPT.md). They record the latest owner decisions, setup, verification limits and remaining work through launch.

**`main` is now the production source.** The historical handoff above preserves the original design decisions. See [the launch record](docs/LAUNCH.md) for current deployment status and [the responsive review](docs/NEW_COMPUTER_REVIEW.md) for verification.

```sh
git clone https://github.com/rominaveisy/portfolio.git
cd portfolio
```

The tracked source, assets, motion data and current CV are sufficient for a normal install/build. The old computer's folders, caches and sign-in sessions are not required or transferred.

## Current stage

The owner has authorized the production launch at **https://rominaveisy.com/**. The original desktop checkpoint remains on `feature/figma-desktop`; responsive work is preserved on `codex/responsive-and-launch`. All seven screens, the 55-image About gallery, scroll-controlled Home, email-draft form, CV and phone/tablet layouts are implemented. The approved October edits are recorded in [the refinement review](docs/REFINEMENTS.md). See the launch record for the exact deployed version and live verification.

The October 8 phone/tablet improvements are on `codex/phone-tablet-experience`, pending owner review and deployment. See [the design reference](docs/design-reference.md#phone-and-tablet-adaptation--october-8-2026) for the design decisions and verification. A branch push does not update the public site.

Studio and the third project's coming-soon status remain intentional. No custom social-sharing image has been approved; existing text metadata is retained.

Changing Figma does not automatically change the website. The code/assets must also be updated.

## Open the local preview

On this computer, open a terminal in `D:\projects\personal website\romina` and run:

```powershell
pnpm dlx pnpm@11.25.0 dev
```

Visit **http://127.0.0.1:4321/** and keep the terminal open. Press Ctrl+C there to stop the server. The project-specific pnpm invocation leaves the globally installed version unchanged.

On a fresh computer, install a supported Node.js LTS release (at least 22.12), then:

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

| Command                 | Purpose                                                                       |
| ----------------------- | ----------------------------------------------------------------------------- |
| `pnpm check`            | Astro/TypeScript validation                                                   |
| `pnpm test`             | Canonical routing and browser checks; server on port 4321 and Chrome required |
| `pnpm build`            | Static preview build in `dist`; search indexing disabled                      |
| `pnpm preview`          | Serve the built files locally                                                 |
| `pnpm build:production` | Build with indexing and sitemap enabled; does not publish                     |

Use `pnpm exec wrangler dev --local` to serve the built files on port 8787. `pnpm verify:production http://127.0.0.1:8787` checks a local production build; `pnpm verify:production` checks the live domain. Contact checks never send email. Restart the development server if a build/type check invalidates its Vite dependency cache.

## Where to edit

```text
src/pages/                  Page routes and metadata
src/components/design/      Real text/layout from each Figma frame
src/components/Header.astro  Shared navigation and Studio hint
src/components/ContactForm.astro
src/components/Lightbox.astro
src/layouts/Layout.astro     Shared structure, fonts and metadata
src/data/                   Projects, asset inventory and motion tracks
src/scripts/                Scroll behavior and email-draft logic
src/styles/                 Figma visual rules and application styles
public/images/              Local Figma artwork
public/documents/           Current CV PDF (original preserved in Git history)
scripts/                    Local/build helpers and one-time import tools
tests/                      Browser checks
docs/                       Design reference and review notes
```

Edit page words in `src/components/design/*.astro`. The `data-figma-id` attributes identify the corresponding Figma layers. Shared styles live in `global.css`; Home styles live in `home.css`. Do not edit `dist`; each build replaces it.

The import, download and image-optimization scripts are one-time preparation tools using ignored `.cache` inputs. **Do not rerun them for ordinary edits:** they can overwrite reviewed markup. Normal builds need only the checked-in source and assets.

Where pixel-identical WebP files replaced PNGs, the original PNGs remain locally in `.cache/originals`. JPEGs incorrectly labelled PNG by the export were renamed to `.jpg` without altering their contents.

## Agreed interactions

- Home's introduction reads “I’m Romina Veisy” / “a creative UX/UI & visual designer.” Desktop pages share Home's fixed translucent header. Phones and touch tablets use a solid dark header; phones have a large-link menu.
- On Home, Work animates to the first project and R_V animates back to the introduction, without reloading.
- One scroll gesture completes one Home transition: down advances to the next cover, up returns to the previous cover. Decaying trackpad momentum is filtered, but fresh wheel input is accepted after each transition without moving the pointer. Scrolling works over text, artwork, navigation and empty space. Scrollbar movement settles to the nearest complete cover; the last cover allows normal scrolling to the footer. Arrow/Page keys and Space also move between covers.
- “Scroll to explore” continuously rotates while the intro is visible and travels upward with the intro. The project sequence itself does not autoplay.
- The three animated project illustrations use the approved October 4 desktop positions. The curved “Work” label has been removed. On phones the illustrations lead each project; tablets pair the artwork and text in two columns.
- Phones and touch tablets use normal vertical scrolling. Long case studies have chapter links, and the CV offers a full-size PDF link as well as its download and preview.
- Skip animation and reduced-motion mode expose all three projects without motion.
- Studio is not clickable; hover or keyboard focus shows “Coming soon.”
- The third project links to its coming-soon page.
- Contact’s “Email me” and “Send message” open a chooser for Gmail, Outlook, or an installed email app. The form prepares an encoded draft, preserves the visitor’s fields, and provides a copyable backup if webmail sign-in drops the draft. Visitors review and send it in their own email account. Nothing is sent automatically or stored by this website. Without JavaScript, the form stays disabled and visible Gmail/Outlook links remain available.
- Public contact details are `rominaveisy.ar@gmail.com`, `+31 6 2043 5932` and the confirmed LinkedIn profile.
- The CV download and web preview contain the owner-approved October 2026 title, profile, Cyclomedia role and clickable portfolio address. All other CV content and layout are preserved; the original PDF remains in Git history.
- Gallery images open in a modal; Escape closes it and arrow keys change images. Touch visitors can swipe horizontally or use the previous/next buttons.

## Safe updates

A **branch** is a separate line of changes. A **commit** is a saved checkpoint. A **pull request** is a review before changes enter `main`.

The original desktop checkpoint remains preserved. New changes should branch from the finished `main` source.

1. Update local `main` from GitHub, with no unsaved changes left behind.
2. Create a descriptively named branch.
3. Edit and inspect the local preview.
4. Run the checks, build and browser tests.
5. Commit and push the branch to GitHub.
6. Open a pull request and review its changes and preview.
7. Merge only after approval; then verify the deployed website and Git commit.

GitHub Desktop can perform the Git steps through buttons. Compare desktop screenshots when changing responsive styles.

Passwords and two-factor codes belong in the services’ own sign-in pages, never in code or chat. No secrets, analytics, database, login, booking or payment features are required.

## Hosting and production updates

`wrangler.jsonc` configures the owner's `romina-portfolio` Worker, custom domains, nested-page routing and a real 404 fallback. `worker/index.mjs` permanently redirects HTTP and `www` to the HTTPS apex, preserving paths and query strings, then serves the static assets. `workers.dev` and version URLs are disabled. No token is stored in the repository.

Publishing uses Wrangler from a signed-in computer. GitHub pushes alone do not deploy the website; no automatic build integration has been configured.

After a reviewed source update and authorization to publish:

1. Commit and push the source; merge the approved change into `main`.
2. Run `pnpm build:production` and `pnpm exec wrangler deploy --dry-run`.
3. Run `pnpm exec wrangler deploy --tag <commit-sha> --message <release-description>`.
4. Run `pnpm verify:production` and record the source commit and Cloudflare version in [LAUNCH.md](docs/LAUNCH.md).

Use interactive deployment when custom-domain routing changes. Wrangler's noninteractive mode can overwrite conflicting DNS records; inspect any conflicts before proceeding. Preserve unrelated DNS and email records.

Preview builds include noindex metadata, robots exclusion and response headers. This discourages search indexing; it is **not access protection**. Use Cloudflare Access if previews need authentication. Security headers generated at build time must also be checked on a real Worker preview before launch.

Official references: [branch previews](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/), [headers](https://developers.cloudflare.com/workers/static-assets/headers/), [HTML routing](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).

## Rollback and maintenance

Before merging, keep unapproved work on its branch. After a bad merge, use GitHub’s Revert action or create a revert commit: this restores previous content without deleting history. For an urgent live problem, roll back the Cloudflare deployment, then revert the source too so the next build does not reintroduce it. Never delete the repository or use a destructive Git reset to undo an ordinary update.

Keep `pnpm-lock.yaml` in Git. Update dependencies on a branch and repeat the visual and automated checks. Astro’s checker currently uses TypeScript 6; do not upgrade it independently without checking compatibility.

Keep the domain under your Cloudflare account. Check its actual renewal price, expiry, payment method and auto-renew setting in the dashboard. This repository cannot renew the domain. Store account recovery codes in your own password manager.
