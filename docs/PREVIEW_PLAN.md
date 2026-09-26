# Cloudflare preview preparation

Prepared on 26 September 2026. **This is a local plan, not a deployment record.**

**Superseded for this release:** the owner subsequently requested the production launch. See [LAUNCH.md](LAUNCH.md). A separate public branch preview is not needed for the authorized direct production release; this document preserves the earlier proposal.

## Reviewable local result

- Source: `codex/responsive-and-launch`, based on `feature/figma-desktop` commit `221803abf3d3b250f77ec222db51c9436f7253c5`.
- Build: `pnpm dlx pnpm@11.25.0 build`, serving the generated `dist` directory.
- Local review: `http://127.0.0.1:4321/`.
- Preview output includes `noindex, nofollow` in HTML and response headers. The original PDF, local artwork and email draft flow are preserved.
- The complete Chrome suite passed 50 tests. See [NEW_COMPUTER_REVIEW.md](NEW_COMPUTER_REVIEW.md) for responsive coverage, screenshot comparisons and verification limits.

## Account inspection before publication

The owner completed Cloudflare's normal OAuth login on 26 September 2026 after an earlier timeout. `wrangler whoami` confirms access as `romina.veisy@gmail.com` to `Romina.veisy@gmail.com's Account` (account ID `312ad57dea8de7f76470fae8fd01bb78`). Read-only inspection confirmed:

- No existing Workers or Pages projects; `romina-portfolio` does not yet exist.
- The `rominaveisy.com` zone is active. DNS records were not inspected or changed.
- No `workers.dev` subdomain has been initialized, so no preview URL exists yet. Cloudflare's API directs the owner to initialize it through the Workers & Pages dashboard.
- No deployment or account configuration was created during this access check. Repository integration has not been inspected.

The proposed target is a new `romina-portfolio` Worker in this account, with the `responsive-review` preview. The site's public contact email remains unchanged; it is separate from the Cloudflare sign-in email.

Inspect existing Preview base configuration and bindings as well as the Worker itself. This static website needs no database, secret, email service, storage binding or paid service. Preserve existing DNS and email records. GitHub push authorization and a reviewed source commit must be confirmed before setting up an automatic build integration.

## Proposed preview path

Current official Cloudflare documentation supports Worker Previews for both new and existing Workers without a production deployment. It requires Wrangler 4.135.0 or later; this project's existing 4.139.0 meets that requirement. The installed CLI's `wrangler preview --help` confirms the command and `--name` option. No dependency upgrade is needed.

After account inspection, prepare the documented `previews` configuration and select a nonconflicting preview name, proposed `responsive-review`. Present the exact account, Worker, preview name, source commit, visibility and any existing configuration changes to the owner. Confirm whether public access is acceptable or authentication is required; search exclusion is not access control.

Only after that concrete proposal is approved, the intended command is:

```sh
pnpm dlx pnpm@11.25.0 exec wrangler preview --name responsive-review
```

This is intentionally not a command to run against an uninspected account. A preview is still an external publication. Production launch, merging into `main`, domain routing and DNS changes need the separate explicit launch approval described in the original handoff.

After preview publication, verify the returned deployment URL: seven routes and refreshes, scripts and images under CSP, search exclusion, real 404, redirects with query strings, CV hash/download, gallery controls, contact drafts, and phone/tablet layouts. Record the deployed commit and both preview/deployment URLs. With the owner's participation, review real-device and signed-in email behavior without sending mail unless explicitly requested.

## Current references

- [Worker Previews: get started](https://developers.cloudflare.com/workers/previews/get-started/)
- [Preview workflow comparison](https://developers.cloudflare.com/workers/previews/compare-workflows/)
- [Version URLs and access controls](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/)

The older handoff mentions `versions upload`. Current documentation distinguishes version URLs from isolated branch Previews, so confirm the account's existing workflow before choosing or changing it.
