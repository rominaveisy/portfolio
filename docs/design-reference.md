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

The label-wheel stops are synchronized with the completed cover poses, rather than drifting toward the next label during a reading pause. Pivot construction graphics are omitted, but their invisible wrappers and transform origins remain. The Home stage is left-anchored and clipped to keep off-canvas geometry off screen, including on wide/short displays.

The Home textured circle uses Figma’s export of that **individual ellipse**, avoiding inconsistent SVG grain rendering. It is not a screenshot of the page; page content remains interactive HTML.

Desktop artboards retain the 1707px reference geometry, proportionally fitted on smaller laptops. Case studies use the 1120px editorial column. Full responsive reflow belongs to a separate next-stage branch after desktop approval.

Owner review: Home scroll pacing, visual agreement, form expectations and coming-soon presentation. A social-sharing image is still awaiting approval; none was invented.
