# Skipping Mondays — Workspace Agent Rules & Guidelines

This file defines the technical guidelines, design patterns, and constraints for any AI agent working on the **Skipping Mondays** codebase. 

---

## Technical Stack & Architecture

- **Framework**: Astro (Static Site Generation / SSG).
- **CMS**: Sanity CMS (Studio located in `/studio`, schemas in `/studio/schemas`).
- **Styles & Scripts**: 
  - Shared CSS is in [`src/styles/styles.css`](file:///Users/hyunlee/Documents/_Apps/SkippingMondays/src/styles/styles.css).
  - Client-side JS is in [`public/site.js`](file:///Users/hyunlee/Documents/_Apps/SkippingMondays/public/site.js).
- **Libraries**:
  - **three.js** (r128): 3D dust particle canvas behind the statement headline.
  - **GSAP & ScrollTrigger** (3.12.5): Scroll-linked animations and entrance triggers.
  - **Lenis** (1.1.14): Global smooth scrolling.

---

## Casing and Capitalization Conventions

To prevent casing mismatch bugs between CMS inputs and frontend presentation, follow these rules:

1.  **Title Normalization**: All Sanity post/news/gig titles are normalized inside the Astro templates using the `capitalizeTitle(str)` helper:
    ```javascript
    function capitalizeTitle(str) {
      if (!str) return "";
      return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    ```
    This ensures that even if titles are entered in **ALL CAPS** in the Sanity CMS, they render cleanly in **Title Case** (e.g. `Promenadenfest In Der Bahnstadt`).
2.  **CSS Transforms**: The CSS classes `.post-title` and `.g-title` are styled with `text-transform: capitalize;` to complement this casing pipeline.

---

## Design & Layout Rules

- **Palette**: White `#ffffff` background, black `#111111` text, gray `#8a8a8a` secondary elements, hairlines `#e5e5e5` (except inside the dark footer/cover zone, which uses cream text and `rgba(255,248,240,.18)` lines).
- **Fonts**: `Inter Tight` (headlines), `Inter` (body/details). Google Fonts only.
- **Section sandwich**: Dark Hero (top) → White Statement Sheet (middle) → Dark Cover & Footer (bottom). The navbar handles black/white contrast transitions dynamically based on scroll triggers.

---

## Motion Rules

- **Easing**: CustomEase `'brand'` = `0.22, 1, 0.36, 1`. Never use bounce, spring, or back eases.
- **reveals**: Triggered via `.reveal-img` and `.post-title[data-split]` once (`once: true`) to maintain performance.
- **Reduced Motion**: Always wrap animation triggers and particle loops in `prefersReduced` guards.
