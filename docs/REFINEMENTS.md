# Approved portfolio refinements — 4 October 2026

The owner approved implementation after reviewing the requested edits. This supersedes the earlier instruction to preserve the original professional title and PDF verbatim. The existing layout, case-study content, interaction model and contact details remain unchanged.

## Changes

- Home adds only `/UI` to its visible professional title: “a creative UX/UI & visual designer”. Search/browser and sharing titles use the same phrase followed by “— Romina Veisy”.
- Home and About descriptions now describe interfaces, prototypes, visual communication and the existing architecture/service/Cyclomedia experience. About's profession label and Contact/CV metadata use the same professional identity.
- Following the owner's latest choice, the favicon is a full-size black circle with red R_V lettering centred inside it, supplied as SVG and 96px PNG. Only the corners outside the circle are transparent; there is no white fill or inset square. This replaces the preceding opaque square variant. Google controls its own surrounding badge, cropping, crawling and search-result presentation.
- Following the owner's layout review, the three animated Work illustrations share a responsive visual column centred in the space to the right of the text. Their size grows with the available width, with an upper limit to preserve breathing room. This replaces the earlier uniform 30% enlargement and separate offsets. Text, rotation origins and project links keep their existing positions.
- The curved “Work” label has been removed at the owner's request, including its SVG, styles and animation property. Mobile, reduced-motion and skipped-animation alternatives remain unchanged.
- The one-page CV and matching web preview have the updated title and profile, “UX/UI & Visual Designer (Project-Based)” at Cyclomedia, and a clickable `www.rominaveisy.com` address targeting `https://rominaveisy.com/`. The web preview also has an accessible link over that address.

## PDF preservation

The original PDF remains at commit `00b9f68`, SHA-256 `99bdc7aa994832299762e10ea75d3a93e0073e53831b4539d7a4a65d3d3dfd79`.

The revised PDF has SHA-256 `2912592dbfba320538d26f7fc58f321215b062109bd76768675fa2be67f69e81`. Only the selected text operators were replaced and the portfolio address added. Existing contact links, factual history and permanent-work-permit statement remain. The matching Zilla Slab fonts are embedded; their license is in `public/licenses/zilla-slab.txt`.

Both PDFs were rendered with PDFium at the same resolution. A pixel comparison confirmed no differences outside the four approved edit regions (title, profile, Cyclomedia role and portfolio address). The revised one-page rendering was visually inspected, and its hyperlinks and text were checked.

## Verification

- Astro/TypeScript: zero errors, warnings or hints; production build passed.
- Local production runtime: all seven routes and 125 assets/internal links passed, including current title, favicon resources, PDF hash, canonical URLs, indexing, robots/sitemap, CSP/security headers, responsive overflow checks, Home motion, gallery, email drafts, no-JavaScript fallback and real 404 routing.
- The latest Work balance was visually reviewed at 1024, 1280, 1440, 1900 and 2560px, plus the unchanged 390px mobile layout. At 1900×970 the artwork canvases are approximately 564px wide, with 145px between text and artwork and a matching right margin. Regression coverage checks text clearance, viewport bounds and excessive right-side whitespace at four desktop widths, alongside forward/reverse motion.
- Full Chrome browser suite: 51 tests passed. Cloudflare deployment dry run passed.
- No dependency updates, new browser downloads, DNS changes or email sending are part of this revision.

## Reported Google entry error — mitigation verified by the owner

The owner sees `403 Forbidden` in Firefox after opening Google's old Home URL, `http://www.rominaveisy.com/`. The HTTPS About result works. A private-window retry of the HTTP www URL also failed for the owner.

Checks from this computer using HTTP requests, installed Chrome with a Google referrer and an isolated profile in already-installed Firefox all reached the live website successfully. HTTP and www redirect to the HTTPS apex. During a five-minute Worker log observation, successful HTTPS requests were visible but no matching HTTP www failure or 403 appeared. These observations do not prove the owner's problem is resolved or exclude a denial before the Worker executes.

The owner subsequently confirmed that `https://www.rominaveisy.com/` opens successfully in the same Firefox session. The failure is therefore specific to the HTTP entry path in that session; its exact source is still unconfirmed.

The existing canonical redirect remains intact. A host-specific one-day HSTS header is added to HTTPS responses for the apex and www (including www redirects), so a successful secure visit teaches the browser to upgrade later HTTP visits before making an insecure request. No `includeSubDomains` or preload directive is used. This mitigation needs a secure visit to each hostname first and does not repair an external HTTP block for a first-time visitor. Routing checks verify policy scope and preservation of redirects, response headers, bodies and 404 status. No DNS, firewall or browser-setting change was made.

After deployment, the owner opened `https://www.rominaveisy.com/?https-check=20261004` in the same Firefox window, retried Google's old Home result, and confirmed: “Yes, the Google result now opens”. This verifies the mitigation in the previously failing session. The underlying HTTP-only denial was not reproduced or conclusively attributed to a network/browser component.

Google must recrawl the pages before changed metadata and icons can appear; its final title/snippet wording is not directly controllable by this repository.
