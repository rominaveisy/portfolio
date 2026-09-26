# Desktop review — 26 September 2026

## Verified locally

- Seven approved desktop routes and the custom 404 screen build successfully.
- Astro/TypeScript check: zero errors and zero warnings.
- Local Cloudflare Worker verification passes: seven routes, Content Security Policy, search/security headers, working scripts, 404 status and trailing-slash redirect with query preservation. This is local emulation, not a cloud deployment.
- Fresh handoff verification on 26 September 2026: all 41 browser tests pass in Chrome (2.0 minutes), Astro/TypeScript reports zero errors/warnings/hints, and the preview-safe static build succeeds. Nothing was deployed by these checks.
- Browser coverage includes Contact draft handoffs, 1280px and 1440px laptop widths, plus balanced 1900px and 2560px wide Home layouts.
- All page images have local, nonempty rendered slots; internal links and assets return successfully.
- One Home scroll gesture completes a transition to the next/previous cover. Native scrollbar input settles to a cover; trackpad inertia does not skip another cover. Keyboard navigation, resize settling, and normal scrolling out to the footer are covered by regression tests.
- Page-wide wheel handling is verified over introduction text, both circles, navigation, the skip link, project CTAs and empty space. Repeated fresh wheel input advances without requiring a pointer move or a quiet pause.
- Work and R_V animate forward/backward on Home, without a reload or immediate jump. The third project links to its coming-soon page.
- Pivot construction graphics are removed and the Home stage is clipped. The introduction's outer margins and column gap adapt to wide screens without changing the settled cover positions. “Scroll to explore” rotates continuously, then exits upward with the intro.
- The 55-image gallery opens, changes images, closes with Escape and restores keyboard focus.
- Contact fields are labelled and required, including rejecting whitespace-only names/messages. Both contact actions open Gmail/Outlook/email-app choices; draft text survives closing and reopening. Browser tests verify encoded recipient/subject/body, new-tab handoff, copy success and permission-denial fallback, keyboard close/focus restoration, and no network request before a provider is chosen. Provider handoff tests intercept navigation: they do not sign in or send email. No-JavaScript visitors get webmail links while the form remains disabled.
- Separate live checks reached Google's sign-in page and received a successful response from Outlook's compose endpoint. Signed-in provider behavior and actual delivery are not asserted by these checks. Both Contact actions also pass against the built local Cloudflare Worker with its Content Security Policy enabled.
- Studio is not a link; its keyboard/hover hint works.
- Every page, including the custom 404, keeps the shared fixed Home-style translucent header before and after scrolling. The regression checks its `rgba(0, 0, 0, 0.8)` background and visible navigation.
- The latest Home introduction reads “a creative UX & visual designer”; its single-line desktop presentation was checked at 1280px, 1440px and 1900px widths.
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

For transfer to a new computer, use [HANDOFF.md](HANDOFF.md) and [CONTINUE_PROMPT.md](CONTINUE_PROMPT.md). The fresh full test/check/build results above were run for this transfer; local Cloudflare and live provider endpoint checks were performed earlier during implementation and have the limits described above.
