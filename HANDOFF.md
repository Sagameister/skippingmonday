# HANDOFF.md — Continuation Guide for Any AI Assistant

Read this first, then `agent.md` (rules), `skills.md` (how-to recipes), and
`design.md` (visual identity). Together these four files contain everything
needed to continue this project without losing context.

---

## What This Project Is

A bilingual (EN/DE) website for **Skipping Mondays**, an indie-pop band with
members from Hanoi, New York, Mexico City, and Germany. Their one rule: they
never play on a Monday — the whole brand voice hangs off that joke.

Static site, **no build step, no framework, no npm**. Open `index.html` in a
browser; everything runs from CDN libraries (GSAP 3.12.5 + ScrollTrigger +
CustomEase, Lenis 1.1.14, three.js r128 — homepage only) and vanilla JS.

## Who You're Working With

The owner (Sagameister) is a **coding beginner** with a sharp design eye:

- Explain things simply, like to a five-year-old. Analogies land well
  (masks = "letterboxes", sticky = "pins then gets pushed away").
- **Every block of code needs a plain-English comment.** This is a hard
  requirement, not a preference.
- They speak in design outcomes, not code ("it should feel smoother",
  "not so attached"). Translate feeling → parameters, then tell them which
  single dial to turn if they want to adjust further.
- Messages arrive via speech-to-text: expect garbles ("lenin smooth scroll"
  = Lenis, "without a snitch" = without a hitch, "lion gradient" = linear
  gradient, "seal media" = see-all media). Infer generously, confirm by
  restating what you understood.
- They ask "what do you think?" often and value honest opinions — including
  pushback (they were talked through retiring their own scroll-hijack idea).
  Give a recommendation, implement it, and mention the escape hatch
  ("we can always revert").

## Current State (all working, all verified)

Six pages, cross-linked, language choice persists between pages:

| File | Contents |
|------|----------|
| `index.html` | Homepage. Pinned hero (fixed, shrinks+blurs as page slides over it) → pinned white "Never on a Monday." statement sheet (sticky, gets covered by the dark section) → dark cover: Gigs list, Media (3 videos + auto-sliding photo carousel), News (5 headline rows with cursor-chasing hover thumbnails), footer. Hero rotates gig/release/announcement items. 3D dust behind statement (three.js). |
| `gigs.html` | Upcoming (5) + dimmed Past shows (4). Announcement rows: date · "City — Venue" title (word-mask reveal) · optional sold-out note. NOT links, no hover effects — deliberate. |
| `media.html` | 6-video grid + masonry photo wall (CSS columns). |
| `news.html` | **Full articles, latest first. Desktop: 2-column spread where the left title column is `position: sticky` — pins below the navbar while reading, pushed away when the next article arrives. Pure CSS, no JS. Mobile: single column, sticky off.** Articles have ids `post-1..5`. Top of page: a **quick-find index** that BUILDS ITSELF by reading the articles in the DOM (date+title jump rows, Lenis glide with −110px offset, live type-to-filter). Rebuilt on language switch. |
| `about.html` | Bio (uses `Images/hero.jpg` — the band's real photo), hometown ticker, 4 member cards (INVENTED placeholder names: An Nguyen, Maya Brooks, Diego Ramírez, Jonas Weber). |
| `contact.html` | Contact FORM first (name, email, topic select, message → Formspree, ID still a `YOUR_FORM_ID` placeholder), then three spam-protected "Direct lines" emails, then the "no Monday emails" bit. |

**Two-tier architecture:** `index.html` is fully self-contained (inline CSS+JS
— it has unique machinery). Interior pages share `styles.css` + `site.js`
(every feature in site.js is guarded by element-existence checks, so one
script serves five pages). Consequence: **shared components (header, footer,
buttons, rolls, splits, lang switcher) exist in TWO places** — change both.
This duplication is acknowledged tech debt, waiting for the CMS/build step.

## The Signature Systems (all bespoke, all in the files)

1. **Split-text mask reveals** — `data-split` on any headline; `splitWords()`
   wraps each word in `.w-mask`/`.w-inner`; ScrollTrigger `onEnter` slides
   words up. Language switching calls `refreshSplits()` to rebuild.
   Descender fix: `.w-mask` has padding-bottom .22em / margin-bottom −.22em.
2. **Text-roll hovers** — `buildAllRolls()` wraps link text in a 1-line mask
   with two stacked copies; hover slides up one line (pure CSS transition,
   reverses free). Rebuilt after every `setLang()`.
3. **News arrow roll** — same idea rotated 90°: two arrows in a horizontal
   letterbox; hover slides right (old exits right, twin enters from left).
4. **Cursor-lag physics** — rainbow center & news hover-thumbnail both use
   `pos += (aim - pos) * k` per tick (k = 0.035 rainbow, 0.12 thumbnail).
5. **Footer wordmark** — SVG `<text textLength="960">` inside width:100%
   SVG = always exactly full width, no JS. Two stacked text layers; hovering
   fades in the rainbow copy (radial gradient, SMOOTH blend currently —
   the hard-band retro version is preserved in a comment inside the SVG defs
   in every file for one-swap revert).
6. **Language system** — every user-visible string has `data-en` + `data-de`;
   `setLang()` swaps textContent, then rebuilds splits & rolls. Switcher =
   one pill showing active language + dropdown with the other.
   Persisted via `localStorage('sm-lang')`.
7. **Navbar theme (homepage only)** — three vertical zones (dark hero →
   white statement → dark cover); watcher picks white/black text via
   `--nav-ink`. Interior pages are all-dark → navbar always white.
8. **Spam-safe emails** — NO complete address or `mailto:` exists in any
   HTML source. Links use `class="email-protect" data-user=".." data-domain=".."`;
   JS assembles address + mailto at load. Fallback text shows `[at]`.
   Assembler exists in BOTH site.js and index.html's inline script.
9. **Forms (contact page form + newsletter signup in every footer)** —
   both post to Formspree with placeholder IDs (`YOUR_FORM_ID`,
   `YOUR_NEWSLETTER_ID`). Shared recipe: `_gotcha` honeypot (filled →
   silently dropped), "not connected yet" status while the action still
   contains `YOUR_`, then fetch + bilingual status messages read from the
   form's data-attributes (`data-ok-en/-de`, `data-err-…`, `data-off-…`).
   Handler: `wireAjaxForm()` in site.js; a newsletter-only copy lives in
   index.html's inline script. Connection steps are in skills.md.

## Hard-Won Lessons (do not re-learn these the painful way)

- **Never put a CSS `transform` on an element GSAP also transforms.** The
  offsets combine and things animate off-screen (this bug shipped once, on
  the menu overlay). CSS hides with `visibility`; GSAP owns position.
- **`display` can't animate.** The burger menu is a `visibility` + GSAP
  curtain for exactly that reason.
- **One shared ScrollTrigger for content below variable-height sections
  goes stale** (news rows vanished this way). Always use per-element
  triggers: `trigger: theElementItself, once: true`.
- **`var(--undefined)` fails silently** — the dark-section text was
  invisible because `--cream` didn't exist yet. If a style "isn't applying,"
  check the variable exists.
- **Pinned horizontal galleries were tried and retired** (buggy when
  filtered content got narrower than the viewport; clamp fixed it, but the
  owner disliked the pattern). Don't reintroduce scroll-jacking.
- **align-items: baseline** looks broken when mixing big and small text in
  a row; use `center` for these list rows.
- Edit workflow that works well here: Python heredocs with **exact-match
  `assert old in html` guards** (a failed assert aborts before writing —
  file stays intact), then `node --check` on the extracted inline script,
  plus data-en/data-de count parity and div balance checks. Anchor strings
  drift as the file evolves — grep before you slice, and beware removing
  CSS between two anchors (the news CSS was once deleted collaterally).

## Placeholder Inventory (things that are fake and waiting for real content)

- All photos except `Images/hero.jpg` are picsum.photos seeds.
- All links marked `href="#"`: socials, video plays, news row targets,
  legal pages. Emails use `@skippingmondays.example`.
- Band member names/roles on about.html are invented.
- Gig dates/venues and news articles are plausible fiction (2026 dates).
- Manager "Mel Okafor" is invented.
- Formspree IDs are placeholders: `YOUR_FORM_ID` (contact form) and
  `YOUR_NEWSLETTER_ID` (footer signup — appears in ALL six html files;
  fix with find-and-replace across files). Until replaced, both forms
  show a polite "not connected yet" message instead of submitting.

## Roadmap (owner's stated intentions)

1. **Headless CMS** (Sanity/Storyblok/Payload class) feeding: gigs (date,
   city, venue, sold-out flag), news posts (title, date, thumb, hero image,
   body, both languages), media items, hero rotation items. The markup was
   deliberately shaped as repeatable self-contained blocks for this.
   (The news quick-find index and hover thumbnails already build
   themselves from the DOM, so CMS output "just works" with them.)
2. Real content: band photos, video embeds, actual bios, real emails/socials.
3. Connect the forms: Formspree IDs for contact + newsletter (skills.md
   has step-by-step). Longer term, point the newsletter at a real mailing
   provider (Buttondown / Mailchimp / Brevo) — swap the form `action`;
   GDPR matters for the German audience.
4. Unify the two-tier CSS/JS via templating or a build step when CMS lands.

## Immediate Next Suggestions (if the owner asks "what's next?")

- Connect both Formspree forms (10 minutes, biggest functional win).
- Real favicon + Open Graph/social share meta tags (none exist yet).
- Replace picsum placeholders with real photos (compression recipe in
  skills.md: 1920px wide, JPEG q80, progressive, under ~400 KB).
- Privacy Policy / Imprint pages (legally required in Germany — Impressum!)
  — the footer links for them are still `href="#"`.

## House Rules Quick-Fire (full versions in agent.md)

Dark hero tops every page, always. Ease = CustomEase `'brand'`
(0.22, 1, 0.36, 1) — never bounce/elastic. Vertical-only reveals, ≤32px,
`once: true`. Small labels settle at 0.7 opacity. `prefers-reduced-motion`
must disable ALL decorative motion (every system above already does — keep
it that way). No new libraries. Comment everything in plain English.
