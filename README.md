# Romina Veisy — portfolio

Astro, CSS and JavaScript, built from the approved Figma desktop designs. The design takes priority over the original brief wherever they conflict.

## Current stage

The desktop review build is on `feature/figma-desktop`. `main` is unchanged. All seven screens, the 55-image About gallery, scroll-controlled Home, email-draft form and original CV are implemented.

This is **not a launched website**. Cloudflare deployment, domain/HTTPS checks, the approved social-sharing image and the full responsive pass are still pending. Mobile currently has a basic Home fallback; the other desktop compositions need proper responsive reflow on a separate branch after desktop approval.

Changing Figma does not automatically change the website. The code/assets must also be updated.

## Open the local preview

On this computer, open PowerShell in `F:\romina\project\portfolio` and run:

```powershell
.\scripts\local.ps1 dev
```

Visit **http://127.0.0.1:4321/** and keep the terminal open. Press Ctrl+C there to stop the server. The helper uses installed Node.js or the existing Codex-bundled runtime. If Windows blocks the script, ask for help rather than changing the computer’s execution policy globally.

On a fresh computer, install a supported Node.js LTS release (at least 22.12), then:

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

| Command                 | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `pnpm check`            | Astro/TypeScript validation                                   |
| `pnpm test`             | Browser checks; local server on port 4321 and Chrome required |
| `pnpm build`            | Static preview build in `dist`; search indexing disabled      |
| `pnpm preview`          | Serve the built files locally                                 |
| `pnpm build:production` | Build with indexing and sitemap enabled; does not publish     |

On this computer `scripts/local.ps1` also accepts `build`, `check`, `test` and `preview`.

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
public/documents/           Original CV PDF
scripts/                    Local/build helpers and one-time import tools
tests/                      Browser checks
docs/                       Design reference and review notes
```

Edit page words in `src/components/design/*.astro`. The `data-figma-id` attributes identify the corresponding Figma layers. Shared styles live in `global.css`; Home styles live in `home.css`. Do not edit `dist`; each build replaces it.

The import, download and image-optimization scripts are one-time preparation tools using ignored `.cache` inputs. **Do not rerun them for ordinary edits:** they can overwrite reviewed markup. Normal builds need only the checked-in source and assets.

Where pixel-identical WebP files replaced PNGs, the original PNGs remain locally in `.cache/originals`. JPEGs incorrectly labelled PNG by the export were renamed to `.jpg` without altering their contents.

## Agreed interactions

- On Home, Work animates to the first project and R_V animates back to the introduction, without reloading.
- One scroll gesture completes one Home transition: down advances to the next cover, up returns to the previous cover. Decaying trackpad momentum is filtered, but fresh wheel input is accepted after each transition without moving the pointer. Scrolling works over text, artwork, navigation and empty space. Scrollbar movement settles to the nearest complete cover; the last cover allows normal scrolling to the footer. Arrow/Page keys and Space also move between covers.
- “Scroll to explore” continuously rotates while the intro is visible and travels upward with the intro. The project sequence itself does not autoplay.
- Skip animation and reduced-motion mode expose all three projects without motion.
- Studio is not clickable; hover or keyboard focus shows “Coming soon.”
- The third project links to its coming-soon page.
- The Contact form opens an email draft. Visitors review and send it in their own email application. Nothing is sent or stored by this website; without JavaScript, use the email link.
- Public contact details are `rominaveisy.ar@gmail.com`, `+31 6 2043 5932` and the confirmed LinkedIn profile.
- The CV download is the unchanged original user-supplied PDF.
- Gallery images open in a modal; Escape closes it and arrow keys change images.

## Safe updates

A **branch** is a separate line of changes. A **commit** is a saved checkpoint. A **pull request** is a review before changes enter `main`.

1. Update local `main` from GitHub, with no unsaved changes left behind.
2. Create a descriptively named branch.
3. Edit and inspect the local preview.
4. Run the checks, build and browser tests.
5. Commit and push the branch to GitHub.
6. Open a pull request and review its changes and preview.
7. Merge only after approval; then verify the deployed website and Git commit.

GitHub Desktop can perform the Git steps through buttons. Create the mobile branch from the **approved desktop commit** and compare desktop screenshots during mobile work.

Passwords and two-factor codes belong in the services’ own sign-in pages, never in code or chat. No secrets, analytics, database, login, booking or payment features are required.

## Hosting — prepared, not deployed

`wrangler.jsonc` prepares a static-assets Worker named `romina-portfolio`, with nested-page routing and a real 404 fallback. No account token or custom-domain route is embedded.

After design approval:

1. Sign into Cloudflare directly and connect the private `rominaveisy/portfolio` repository to a Worker.
2. Choose `main` as production and enable preview builds for other branches.
3. Set the build command to `pnpm build` (preview-safe).
4. Set the **production** deploy command to `pnpm build:production && pnpm exec wrangler deploy`. The explicit second build enables indexing only for production.
5. Set the **preview** command to `pnpm exec wrangler preview`, never the production deploy command.
6. Review a branch preview before connecting the domain.
7. Connect `rominaveisy.com` as the production custom domain. Configure a permanent `www` → apex redirect preserving paths and query strings. Verify HTTPS, redirects, nested-page refresh, 404 status, search headers and the deployed commit.

Preview builds include noindex metadata, robots exclusion and response headers. This discourages search indexing; it is **not access protection**. Use Cloudflare Access if previews need authentication. Security headers generated at build time must also be checked on a real Worker preview before launch.

Official references: [branch previews](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/), [headers](https://developers.cloudflare.com/workers/static-assets/headers/), [HTML routing](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).

## Rollback and maintenance

Before merging, keep unapproved work on its branch. After a bad merge, use GitHub’s Revert action or create a revert commit: this restores previous content without deleting history. For an urgent live problem, roll back the Cloudflare deployment, then revert the source too so the next build does not reintroduce it. Never delete the repository or use a destructive Git reset to undo an ordinary update.

Keep `pnpm-lock.yaml` in Git. Update dependencies on a branch and repeat the visual and automated checks. Astro’s checker currently uses TypeScript 6; do not upgrade it independently without checking compatibility.

Keep the domain under your Cloudflare account. Check its actual renewal price, expiry, payment method and auto-renew setting in the dashboard. This repository cannot renew the domain. Store account recovery codes in your own password manager.
