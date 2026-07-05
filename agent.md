# agent.md — Rules for AI Agents Working on This Project

This file defines the rules for any AI agent (Claude, Copilot, etc.) making changes
to the Skipping Mondays website. Read it fully before touching code.

---

## Project Overview

A one-page band website for **Skipping Mondays**, inspired by the minimal editorial
style of bennettandclive.com. Everything lives in a **single HTML file** — no build
step, no framework, no npm. Open `skipping-mondays.html` in a browser and it runs.

## File Structure

```
SkippingMondays/
├── index.html                 # HOMEPAGE — self-contained (own inline CSS+JS)
├── gigs.html                  # interior pages — share styles.css + site.js
├── media.html
├── news.html                  # full articles w/ sticky title columns
├── about.html
├── contact.html
├── styles.css                 # shared styles for INTERIOR pages only
├── site.js                    # shared JS for INTERIOR pages only (all guarded)
├── agent.md                   # this file
├── skills.md                  # developer how-to instructions
├── design.md                  # visual identity spec
└── Images/
    ├── hero.jpg               # compressed hero photo (1920px wide, ~370 KB)
    ├── logo-horiz-wht.svg     # white horizontal logo (navbar)
    └── Impulse - 1.jpeg       # original photo — never modify or delete
```

**Two-tier architecture (important):** the homepage keeps its own inline
CSS/JS (it has unique features: pinned hero, statement sheet, rotation,
3D dust). Interior pages are DARK throughout (dark hero + dark body →
navbar always white) and share `styles.css` + `site.js`. If you change a
shared component (header, footer, buttons, rolls, splits), change it in
BOTH the homepage's inline code and the shared files. A build step or CMS
templating will eventually unify these.
The language choice persists across pages via `localStorage('sm-lang')`.
The news page's pinned-title effect is pure `position: sticky` — no JS.

**Rule:** all image assets go in `Images/`. Reference them with relative paths
(`Images/filename`). Never inline large SVGs or base64 images into the HTML.

## Tech Stack (fixed — do not add or swap libraries)

| Library | Version | Loaded from | Purpose |
|---------|---------|-------------|---------|
| three.js | r128 | cdnjs | subtle 3D dust behind the statement headline |
| GSAP | 3.12.5 | cdnjs | all animations |
| ScrollTrigger | 3.12.5 | cdnjs | scroll-linked animations |
| CustomEase | 3.12.5 | cdnjs | the brand easing curve |
| Lenis | 1.1.14 | cdnjs | smooth scrolling (global, always on) |

**Never** install additional animation libraries. **Never** re-initialize Lenis or
add a competing smooth-scroll. **Never** use jQuery.

## Design Rules

- Palette: white `#ffffff` background, black `#111111` text, gray `#8a8a8a`
  secondary labels, hairlines `#e5e5e5`. No other colors without explicit request.
- Fonts: `Inter Tight` (headlines), `Inter` (body). Google Fonts only.
- Small labels use the `.micro` class: 11px, uppercase, letter-spaced, gray.
- Headlines are HUGE (clamp-based, up to 13rem) with tight tracking (-0.03em).
- Whitespace is a feature. Do not densify layouts.
- **Every page starts with a dark hero at the top. Always.** A full-viewport
  photo (or dark section) with a soft dark scrim sits under the navbar on
  every page, and everything below it is white. This is a hard layout rule —
  the navbar theme system depends on it, and it keeps the brand consistent.
- The header uses a **two-theme system**, not blend modes: everything in the
  bar is colored by the `--nav-ink` CSS variable (white by default over the
  dark hero, black when JS adds the `.dark` class after scrolling past it).
  New header elements must use `var(--nav-ink)` — never hardcoded colors. The
  white logo SVG flips via `filter: invert(1)` in dark mode.
- The page is a **three-zone sandwich**: dark hero (top, pinned) → white
  statement sheet (pinned, gets covered) → dark cover (Gigs to footer).
  The navbar watcher in `updateHeaderTheme()` knows these zones and picks
  white or black text accordingly. If you add or reorder full-width
  light/dark zones, you MUST update that function's zone logic to match —
  otherwise the navbar will disappear against a same-colored background.
- Dark-section styling lives in the `.cover` override block in the CSS
  (`.cover .gig`, `.cover .micro`, etc.). New components inside the cover
  need cream/white text and `rgba(255,248,240,.18)` hairlines, not the
  light-theme grays.

## Motion Rules (the Motion Stack Guide)

The motion personality is **unhurried, confident, quiet**. A page that breathes,
never performs.

- Ease: always the named CustomEase `'brand'` = `0.22, 1, 0.36, 1`.
  Never `spring`, `bounce`, `elastic`, or `back` eases.
- Durations: 0.8–1.2s scroll reveals · 1.2–1.4s large elements/images ·
  0.6–0.9s small UI.
- Movement is **vertical only**, max 32px offset (16–24px preferred).
  Exception: the marquee ticker scrolls horizontally by design.
- Stagger: 0.12s between list items, 0.06–0.08s between words in headlines.
- Every scroll reveal fires **once** (`once: true`) and stays. No re-triggering.
- Headlines animate with **mask reveals**: words wrapped in `.w-mask`/`.w-inner`
  spans rise out of hidden slots. Use the existing `splitWords()` /
  `revealSplit()` system — mark new headlines with `data-split`.
- Images use **clip-path window reveals** (inset 20% → 0%, 1.4s) plus subtle
  **inner parallax** (scaled to 115%, sliding −5% → +5%, scrubbed).
- Small labels are **opacity-only** and settle at 0.7 opacity, never 1.0.
- `prefers-reduced-motion` must always be respected: all decorative motion
  (GSAP reveals, Lenis, three.js loop, title cycling) is wrapped in the
  `prefersReduced` guard. Never remove this.

## Language (i18n) Rules

- The site is bilingual: **EN / DE**, switched by the nav buttons.
- Every user-visible string carries `data-en="..."` and `data-de="..."`
  attributes. `setLang()` swaps `textContent` from these.
- **Both attributes are mandatory** — if you add text, add both translations.
- After any programmatic text swap, `refreshSplits()` must run so headline
  word-masks are rebuilt (setLang already does this).

## Code Style

- Keep everything in the single HTML file unless the user asks otherwise.
- The maintainer is a coding beginner: **every block of code must carry a
  plain-English comment explaining what it does and why.**
- Preserve the existing numbered PART sections in the `<script>` block.
- After any JS change, verify syntax (e.g. extract the inline script and run
  `node --check`).

## Do Not

- Do not modify or delete originals in `Images/` (e.g. `Impulse - 1.jpeg`).
- Do not add scroll-jacking, pinned horizontal galleries, or autoplaying
  audio. (A pinned filmstrip was tried in Media and deliberately retired —
  do not reintroduce it.)
- **Roadmap: every primary nav link (Home, Gigs, Media, News, Contact)
  will eventually become its own page.** Keep each section self-contained
  — its own heading, data, and animations — so it can be lifted onto a
  dedicated page without untangling. Media is already structured this way
  (Video sub-block + Photos sub-block).
- Do not remove the `onerror` fallback on the hero image.
- Do not convert the footer SVG wordmark back to plain text — the SVG
  `textLength` technique is what guarantees exact 100% width.
- Do not remove the descender fix (`padding-bottom/margin-bottom` on `.w-mask`).
