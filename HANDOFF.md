# HANDOFF.md — Continuation Guide for Any AI Assistant

Read this first, then `agent.md` (rules), `skills.md` (how-to recipes), and
`design.md` (visual identity). Together these files contain everything
needed to continue this project without losing context.

---

## What This Project Is

A bilingual (EN/DE) website for **Skipping Mondays**, an indie-pop band with
members from Hanoi, New York, Mexico City, and Germany. Their one rule: they
never play on a Monday — the whole brand voice hangs off that joke.

The site is built with **Astro**, styled with vanilla CSS, and uses **Sanity CMS**
as a headless backend for dynamic content (gigs, news). It is hosted on **Vercel**
and utilizes serverless edge functions for secure APIs.

## Who You're Working With

The owner (Sagameister) is a **coding beginner** with a sharp design eye:

- Explain things simply, like to a five-year-old. Analogies land well
  (masks = "letterboxes", sticky = "pins then gets pushed away").
- **Every block of code needs a plain-English comment.** This is a hard
  requirement, not a preference.
- They speak in design outcomes, not code ("it should feel smoother",
  "not so attached"). Translate feeling → parameters, then tell them which
  single dial to turn if they want to adjust further.
- Messages arrive via speech-to-text: expect garbles ("mockdown file" = markdown file, 
  "handle file" = handoff file, "lenin smooth scroll" = Lenis, "without a snitch" = without a hitch).
  Infer generously, confirm by restating what you understood.
- They ask "what do you think?" often and value honest opinions — including
  pushback. Give a recommendation, implement it, and mention the escape hatch
  ("we can always revert").

## Current State (all working, all verified)

The site is fully responsive, bilingual, and cross-linked:

| Page / Route | File Path | Contents / Logic |
|---|---|---|
| Homepage | `src/pages/index.astro` | Pinned hero (shrinks + blurs as page slides over it) → pinned white "Never on a Monday" statement sheet → dark cover section: upcoming gigs rows, media grids, news rows, and the footer. Renders cursor-chasing GSAP hover previews for both news rows and gigs. |
| Gigs Page | `src/pages/gigs.astro` | Redesigned to match the blog-style news page structure. Dynamic date/city/venue pins on the left, quick find filtering index at the top, and gig description + stage image + ticketing metadata (time, setting, ticket buttons/badges) on the right. |
| News Page | `src/pages/news.astro` | Full articles, latest first. Left title column pins sticky below the navbar while reading on desktop. Includes the quick-find live-filtering search box at the top. |
| Media Page | `src/pages/media.astro` | Masonry photo wall (CSS columns) and video grids. |
| About Page | `src/pages/about.astro` | Hometown ticker, bio, and member cards. |
| Contact Page | `src/pages/contact.astro` | Contact form + direct line emails. |
| Translate Proxy | `api/translate.js` | Serverless proxy function deployed on Vercel to securely handle DeepL API calls without exposing the user's API key on the client-side. Handles CORS for the Sanity Studio origin. |

## The Signature Systems (all bespoke, all in the files)

1. **Sanity CMS Integration:** 
   - Sanity Project ID: `9mzj9v38`, Dataset: `production`.
   - Studio deployed at `https://skippingmondays.sanity.studio/`.
   - Uses a unified `post` schema supporting both `news` and `gig` types with conditional fields (venue/tickets only show up for gigs).
   - Syncs content changes to Vercel via a rebuild webhook on document publish.
2. **DeepL Auto-Translation Button:**
   - A custom Document Action `TranslateAction.ts` is registered in `sanity.config.ts`.
   - When editing a post, clicking `Translate EN ➔ DE` calls `/api/translate` on Vercel to translate English fields and fill in German fields automatically.
3. **Split-text mask reveals** — `data-split` on any headline; `splitWords()`
   wraps each word in `.w-mask`/`.w-inner`; ScrollTrigger `onEnter` slides
   words up. Language switching calls `refreshSplits()` to rebuild.
4. **Text-roll hovers** — `buildAllRolls()` wraps link text in a 1-line mask
   with two stacked copies; hover slides up one line (pure CSS transition).
5. **Cursor-lag physics** — News and Gigs list rows both use the cursor-chasing image preview drawer.
6. **Footer wordmark** — SVG path drawing of the vector wordmark (replaces plain text). Fades in the rainbow copy (radial gradient with animation) on hover.
7. **Bespoke Page Transitions:** Standard SPA router transitions (like Astro ViewTransitions) often conflict with persistent Three.js contexts, WebGL loops, and global GSAP tickers, causing memory leaks and double-binding glitches. Instead, the site uses a custom page-fade implementation: body opacity is set to `0` by default; JS transitions to `page-ready` (opacity 1) on load, intercepts internal link clicks to fade the page out, and navigates after 350ms. Restores opacity on browser back buttons using the `pageshow` (BFcache) listener.
8. **Interactive 3D Music Particles (Depth of Field):** The "Never on a Monday" statement sheet backdrop runs a custom Three.js WebGL rendering of floating musical notes (♩, ♪, ♫, ♬) drawn onto canvas sprites. It simulates depth of field by distributing blurred/medium/crisp canvas textures, varying sizes, and dimming opacities based on the randomly generated Z-depth. Interacts responsively by calculating 3D mouse vector distances and pushing nodes smoothly away from the cursor, easing them back to their home orbit path as the mouse leaves.
9. **Bespoke Lightbox & 4-Column Photo Wall:** The media page photo gallery renders as a responsive CSS masonry column layout. It is set to 4 columns on desktop (above 1024px), 2 columns on tablets, and 1 column on phones. Clicking any photo opens a custom overlay lightbox that displays the high-resolution image with bilingual caption translation handling. Features desktop arrow key/click navigation, automatic Lenis scrolling pause/resume toggling to prevent scroll glitches, and hardware-accelerated touch swipe detection (left/right) on mobile devices.


## Hard-Won Lessons (do not re-learn these the painful way)

- **Astro Scoped Limits:** Styles in Astro are scoped to the file. Elements generated or modified dynamically by scripts (like GSAP wraps) won't style correctly unless targeted globally via `<style is:global>` (which is used in `index.astro` and global style sheets).
- **Sanity Client Build Guard:** If `PUBLIC_SANITY_PROJECT_ID` is empty or a placeholder during static builds, it will crash. `src/lib/sanity.ts` guards this with a format validation check and falls back to a dummy valid ID format (`dummyid12`) to keep the build safe.
- **Never mix CSS transforms with GSAP transforms** on the same element.
- **CORS Limitations on APIs:** Direct client-side calls to DeepL fail in browsers due to CORS. Always route translation fetch requests through the secure `/api/translate` serverless proxy function.

## Placeholder Inventory

- Formspree IDs are placeholders: `YOUR_FORM_ID` (contact form) and `YOUR_NEWSLETTER_ID` (footer signup).
- Social links marked `href="#"`.

## Immediate Next Suggestions

- Connect both Formspree forms (setup instructions are in `skills.md`).
- Populate real content (photos, tour diaries) in `skippingmondays.sanity.studio`.
- Configure actual legal/imprint links in the footer.
