# Approved design reference

[Figma source](https://www.figma.com/design/l1FhtdExdrOfrwiPk6XeIj/Untitled)

| Route                | Approved frame                                   |
| -------------------- | ------------------------------------------------ |
| `/`                  | `214:475` — Home — Desktop Duplicate             |
| `/about/`            | `232:65` — About — Desktop                       |
| `/work/cyclointel/`  | `269:74` — CycloIntel                            |
| `/work/samenstad/`   | `350:154` — Samenstad                            |
| `/work/positioning/` | `418:328` — Cyclomedia Positioning — Coming Soon |
| `/contact/`          | `323:146` — Contact                              |
| `/cv/`               | `430:345` — CV — Original PDF                    |

The active About content is `450:361`, footer `450:616`. Hidden backups are excluded. The gallery has 39 photographs, 9 paintings and 7 physical models.

Motion values from Figma are retained in `src/data/home-motion.json`. Following the owner's latest correction, a scroll gesture triggers a complete transition to the next/previous cover. `home-motion.ts` animates native scroll between four stops and seeks the Figma tracks to match. Scrollbar movement also settles to a complete cover. Work and R_V reuse the same transition controller. The decorative “Scroll to explore” rotation is an independent, continuous CSS animation; its upward translation still follows the intro.

The label-wheel stops are synchronized with the completed cover poses, rather than drifting toward the next label during a reading pause. Pivot construction graphics are omitted, but their invisible wrappers and transform origins remain. The Home stage is clipped to keep off-canvas geometry off screen. On wide/short displays, the introduction distributes surplus width between the outer margins and the space between its two columns. The circle's responsive offset returns to zero during its original transition, preserving the project covers' positions and rotation origins.

Wheel input is captured at the window level, including over artwork, text, navigation and empty space. The gesture filter suppresses decaying trackpad momentum, while accepting a renewed push, direction reversal or repeated mouse-wheel notch after a transition, without requiring the pointer to move.

The Home textured circle uses Figma’s export of that **individual ellipse**, avoiding inconsistent SVG grain rendering. It is not a screenshot of the page; page content remains interactive HTML.

Desktop artboards retain the 1707px reference geometry, proportionally fitted on smaller laptops. Case studies use the 1120px editorial column. Supporting pages reflow into a reading layout on narrow screens; Home preserves its animated experience as described below.

The latest Home copy is “I’m Romina Veisy” / “a creative UX/UI & visual designer.” Desktop routes share Home's fixed translucent header (`rgba(0, 0, 0, 0.8)`), including after scrolling. Phone and tablet navigation uses a solid dark background for readability over scrolling content.

Contact's agreed behavior is a visible Gmail/Outlook/email-app draft chooser with copy fallbacks, not direct website sending. The Figma form is retained, overriding the original brief's instruction to omit a form.

Owner review still covers Home scroll pacing, visual agreement and coming-soon presentation. A social-sharing image is still awaiting approval; none was invented. See [HANDOFF.md](HANDOFF.md) for all latest decisions and the responsive/launch sequence.

## Phone and tablet adaptation — October 8, 2026

Branch: `codex/phone-tablet-experience`. This is an adaptation of the approved red, black and paper identity, with the existing typefaces, illustrations and content. The public site is not deployed as part of this branch work.

- Phones use a full-screen menu with large links, keyboard focus containment, Escape dismissal and focus restoration. Without JavaScript the original navigation remains visible.
- Home preserves the desktop actions and movements on phones and tablets: the spinning exploration cue, expanding red and white circles, rotating project sequence, illustrations, full stories, Explore links, forward/back gestures, Work navigation and R_V return. Static content is reserved for the explicit Skip animation action, reduced motion or no JavaScript.
- Screens below 1024px and portrait touch tablets through 1366px use compact geometry driven by the same four-scene controller and transition timing. The existing text and image elements are reused; the compact renderer changes positions, sizing and orbit geometry. Wider landscape tablets retain the original desktop Figma tracks. Orientation changes preserve the active scene.
- Project stories scroll internally when they exceed the available height. A swipe at the beginning/end of that text moves to the adjacent scene; swipes elsewhere on the stage move the wheel directly. Tap/keyboard arrow buttons supplement the gestures. The controller leaves open dialogs, horizontal gestures and zoomed viewports alone. Scene links and off-screen copy leave the focus/accessibility order while inactive.
- Six transparent WebP derivatives serve the three project illustrations at 640px and 1280px. The original desktop PNGs remain intact. The 1280px set totals 581,420 bytes versus 7,007,840 bytes for the original set; this is an asset-size comparison, not a measured page-load or Core Web Vitals result.
- About gains section links, a portrait-and-biography tablet composition and a three-column tablet gallery. The image viewer accepts horizontal touch swipes as well as its existing buttons and keyboard arrows; vertical gestures do not advance images.
- CycloIntel and Samenstad gain a compact chapter menu with native fragment links. With JavaScript it closes on selection, focuses the section and stays below the header. Without JavaScript it remains in normal document flow so expanded navigation does not cover the destination.
- Contact keeps its email-draft behavior, adds comfortable field/control spacing and uses two columns on wider touch screens. The CV page adds a visible introduction and full-size PDF link above the existing download and preview. The reviewed PDF content is unchanged.
- Safe-area insets, visible focus, reduced motion and the original no-JavaScript content paths are preserved. No new framework, font, package or external service was added.

The professional-web-design, Impeccable adaptation and Web Design Guidelines skills informed the review. The owner's direction to preserve the desktop motion takes priority over generic mobile-layout recommendations. The manual detector reported no findings on the revised motion surfaces. These heuristics are design guidance, not evidence of user research.

### Verification on this branch

- `pnpm check`: 0 errors, warnings or hints. `pnpm build`: successful preview build with indexing disabled. Routing checks passed; no routing or hosting configuration changed.
- The 64-test Playwright regression suite passed in installed Chrome, including the existing desktop motion, illustration separation, contact draft, PDF hash, reduced-motion and no-JavaScript checks. After the final story-to-footer handoff correction, all 14 touch tests passed again, including the new footer regression (65 distinct tests in the suite).
- New interaction checks cover the phone menu's Tab loop, Escape, focus restoration, page navigation and resize; animated Work and R_V navigation; forward/reverse swipes and the spinning exploration cue; short-screen story reading; the final story's swipe into the footer; orientation changes; chapter destinations below the fixed navigation; full-size PDF access; and gallery next/previous swipes without advancing on vertical gestures.
- Synthesized browser touch input exercised scrolling and gallery gestures. Coarse-pointer tablet contexts at 834×1112, 1024×768 and 1366×1024 checked all seven routes for overflow and reflow. Existing narrow-layout checks cover 320, 390, 768 and 1023px. These are Chrome emulations, not physical devices or Safari.
- Visual inspection covered the animated phone introduction and project scenes, menu, About portrait/approach/gallery, Contact, CV and case-study chapters; portrait/landscape tablets; and desktop preservation. Final motion captures at seven viewport sizes reported no horizontal overflow or JavaScript errors. The interactive local preview and tablet rotation between compact and desktop layouts were also checked. The additional empty gallery space in an early capture was an image-decode timing artifact; the loaded image slots were verified.
- The phone Home image-request check confirms the original large project PNGs are not downloaded. All 55 gallery images remain present. Desktop artwork-position tests passed from 1024px through wide monitors.
- Physical iPhone/iPad, Safari, on-screen keyboard and screen-reader testing remain unperformed. Safe-area handling was reviewed in CSS; real notch/system-bar behavior needs device verification. There are no field performance measurements or user-research claims.

Local evidence is in ignored `.cache/phone-motion/`, `.cache/touch-review/` and `.cache/qa/`; reproducible functional checks are committed under `tests/`. The optional local review helper on port 4322 embeds the actual site from port 4321 at phone/tablet dimensions. It is not a production page. The production site still uses the separately recorded live release in `LAUNCH.md`.
