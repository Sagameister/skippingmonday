# design.md — Skipping Mondays Design System

The visual identity of the Skipping Mondays website: what it looks like, why it
looks that way, and the exact values to keep it consistent. For motion rules see
`agent.md`; for how-to recipes see `skills.md`.

---

## Design Direction

**"Premium editorial, quiet confidence."**

Inspired by high-end studio sites (reference: bennettandclive.com). The design
gets out of the way and lets two things carry everything: photography and huge
typography. If a choice feels decorative, it's probably wrong. If it feels like
a fashion magazine spread, it's probably right.

Three words to test every change against: **unhurried · confident · quiet**.

---

## Color

| Token | Hex | Usage |
|-------|-----|-------|
| `--white` | `#ffffff` | page background |
| `--black` | `#111111` | all primary text (softer than pure black) |
| `--gray` | `#8a8a8a` | secondary labels, captions, venue names |
| `--line` | `#e5e5e5` | hairline borders and dividers |

Rules of thumb:

- Color comes from **photographs**, never from the UI itself.
- Buttons and links are black-on-white or inverted on hover — no accent color.
- Small labels settle at 70% opacity by design; they whisper, not shout.
- The header is pure white (`#fff`) because `mix-blend-mode: difference`
  inverts it over whatever it overlaps — readable on any photo.

## Typography

| Role | Font | Weight | Size | Tracking |
|------|------|--------|------|----------|
| Statement headline | Inter Tight | 500 | clamp(3.2rem → 13rem, 11.5vw) | −0.03em |
| Section titles (h2) | Inter Tight | 500 | clamp(2.8rem → 8rem, 7.5vw) | −0.03em |
| Hero song titles | Inter Tight | 500 | clamp(2.6rem → 6.5rem, 7vw) | −0.02em |
| Gig city names | Inter Tight | 500 | 22px | −0.01em |
| Body text | Inter | 400 | 15px, line-height 1.5 | normal |
| Micro labels (`.micro`) | Inter | 400 | 11px, UPPERCASE | +0.14em |

Principles:

- Headlines are **huge and tight**; supporting text is small and airy.
  The contrast between the two IS the design.
- Micro labels: always uppercase, always letter-spaced, always gray.
  They act as quiet signposts ("Booking", "Season 2026", "Now playing").
- Line-heights on display text are sub-1.0 (0.98) — the tightness reads
  as intentional and modern.
- The footer wordmark is an SVG `<text>` with `textLength` so it always
  spans exactly 100% of the viewport width — treat it as an end credit.

## Layout & Spacing

- Horizontal page margin: `3vw` on both sides, everywhere.
- Section padding: `14vh` vertical — generous, screen-relative.
- The grid is a 12-column CSS grid only where needed (media collage);
  everything else is simple flex or block flow.
- Hairline rules (`1px --line`) separate list rows and the footer.
- Whitespace is the main layout tool. When in doubt, add space, not boxes.

## Components

**Header** — fixed, thin, blend-mode inverted. Logo left (SVG, 22px tall),
nav + DE/EN pill right. Links get a growing underline on hover.

**Hero** — full-viewport photo (`Images/hero.jpg`) with soft dark gradients
top (navbar legibility) and bottom (info legibility). Bottom-left: rotating
label + title (gigs, releases, announcements) with word-mask reveals.
**Rule: every page opens with a dark hero like this — no exceptions.** The
white navbar lives on it; the page turns white only below the fold.

**Statement** — the emotional core. Two-line huge headline over faint 3D dust
particles, followed by an uppercase micro-style tagline (max-width 520px).

**Ticker** — full-width marquee strip between hairlines; gray words separated
by black dots, looping at constant speed. The only horizontal motion allowed.

**Gigs list** — table-like rows: date (gray, small) / city (large) / venue
(gray) / pill-shaped ticket button. Hovering one row dims the others to 35%.
Sold-out buttons are hairline-gray and inert.

**Media collage** — editorial, hand-placed feel: 12-column grid, mixed aspect
ratios, staggered vertical offsets (`margin-top` offsets per item), tiny
uppercase captions below each photo. Photos live behind their frames
(oversized 115%) and drift for depth.

**Footer / Contact** — three columns: live city clocks (Berlin / London /
New York), booking email (the only large link on the page), social list.
Then the full-width SVG wordmark as an end credit, then a hairline and legal
micro-links.

## Imagery

- Photography style: live shows, stages, rehearsal rooms — real moments,
  not posed press shots. The hero should feel like you're IN the band.
- All images: max 1920px wide, JPEG quality ~80, progressive. Keep files
  under ~400 KB (see `skills.md` for the compression recipe).
- Every `<img>` needs a descriptive `alt` text.
- Placeholders (picsum.photos) are acceptable in development only; captions
  should already be real.

## The 3D Dust

The only ornament: ~120 faint gray points drifting behind the statement
headline (three.js). It must stay barely perceptible — if a visitor
consciously notices it, it's too strong. Light gray `#999`, opacity ≤ 0.7,
very slow rotation, gentle mouse lean.

## Accessibility Notes

- `prefers-reduced-motion` disables all decorative movement (mandatory).
- Contrast: black-on-white body text passes WCAG AA easily; gray `#8a8a8a`
  is reserved for non-essential labels — never for body copy.
- The language switcher sets `document.documentElement.lang` for screen
  readers.
- The footer wordmark SVG carries `aria-label="Skipping Mondays"`.
- Interactive targets (nav links, ticket pills, lang buttons) keep generous
  padding for touch.

## Voice & Microcopy

- Bilingual EN/DE, dry humor welcome ("The opposite of a Monday."), never
  corporate.
- Dates in European format: `12.09.2026`.
- Cities in their local spelling: Köln, München, Wien.
