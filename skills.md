# skills.md — Developer Instructions (How-To Recipes)

Practical, step-by-step instructions for common changes to the Skipping Mondays
site. Written for beginners — no build tools needed, just a text editor and a
browser.

---

## Running the Site

1. Open `skipping-mondays.html` in any modern browser (double-click it).
2. Internet is required: fonts, GSAP, three.js, Lenis, and the placeholder
   photos load from CDNs.
3. After editing, save the file and refresh the browser (Cmd+R / F5).

---

## Recipe: Add or Edit a Gig

Find the `<!-- =========== GIGS =========== -->` section. Each show is one block:

```html
<div class="gig">
  <div class="date">12.09.2026</div>
  <div class="city">Berlin</div>
  <div class="venue">Lido, Kreuzberg</div>
  <a class="tix" href="TICKET-LINK-HERE" data-en="Tickets" data-de="Tickets">Tickets</a>
</div>
```

- Copy a whole block and edit the text to add a show.
- Sold out? Add the `soldout` class and both translations:
  `<a class="tix soldout" href="#" data-en="Sold out" data-de="Ausverkauft">Sold out</a>`
- Delete a block to remove a show. Rows animate in automatically.

---

## Recipe: Change the Cycling Song Titles (Hero)

In the `<script>` block, find PART 2:

```js
const songs = ['Call In Sad', 'Snooze Button Love', ...];
```

Edit the list. Timing: change `setInterval(nextSong, 3500)` — the number is
milliseconds between titles.

---

## Recipe: Swap the Hero Photo

1. Put the new photo in `Images/`.
2. Compress it first (huge photos make the site slow). With Python/Pillow:

```python
from PIL import Image
img = Image.open("Images/YOUR-PHOTO.jpeg").convert("RGB")
w, h = img.size
img = img.resize((1920, int(h * 1920 / w)), Image.LANCZOS)
img.save("Images/hero.jpg", "JPEG", quality=80, optimize=True, progressive=True)
```

3. If you name it `hero.jpg` (replacing the old one), no code change is needed.
   Otherwise update `src="Images/hero.jpg"` in the hero `<img>` tag.

---

## Recipe: Add a Photo to the Media Collage

Each photo is a `<figure>` inside `.collage`:

```html
<figure class="ph p2">
  <img src="Images/your-photo.jpg" alt="describe the photo">
  <figcaption data-en="English caption" data-de="German caption">English caption</figcaption>
</figure>
```

- Media has two sub-blocks, each under its own subtitle:
  **Video** — a plain 3-across grid. Copy a `<figure class="vid">` block
  (thumbnail link + caption) to add a video.
  **Photos** — the editorial collage. The `p1`–`p5` classes control
  size/position (grid-column = width/placement, aspect-ratio = shape,
  margin-top = offset). Add a `.p6` rule for a sixth photo.
- Window reveals attach automatically to collage photos AND video thumbs;
  the inner parallax applies to collage photos only.

---

## Recipe: Add Translatable Text (DE/EN)

Any element that shows text needs both attributes:

```html
<p data-en="English text" data-de="Deutscher Text">English text</p>
```

The visible content should match the `data-en` version (English is the default).
The switcher copies the right attribute into the element when clicked.

**Headlines only:** if the new text is a big headline that should get the
word-by-word mask reveal, also add `data-split`:

```html
<h2 data-split data-en="Title" data-de="Titel">Title</h2>
```

---

## Recipe: Tune the Motion

All values live in the `<script>` PART 4 (and are governed by `agent.md`):

- Slower/faster reveals → change `duration:` (keep 0.8–1.4s).
- Tighter/looser cascade → change `stagger:` (default 0.12 for lists,
  0.08 for headline words).
- Parallax strength → the `yPercent: -5 / 5` pair on collage images and
  `yPercent: 6` on the hero (keep subtle; the image is only oversized ~12–15%).
- Scroll feel → `new Lenis({ duration: 1.2 })`: higher = floatier.

---

## Recipe: Resize the Navbar Logo

In the CSS, find:

```css
header .wordmark img{ height: 22px; ... }
```

Change the height — width scales automatically.

---

## Recipe: Change Footer City Clocks

In PART 5 of the script, edit the timezone names (must be valid IANA zones,
e.g. `'Europe/Paris'`, `'Asia/Tokyo'`) and update the matching labels in the
footer HTML.

---

## Recipe: Connect the Contact Form (one-time setup)

The form on `contact.html` posts to Formspree (free form-to-email service).
Until connected, it shows a friendly "not connected yet" message.

1. Create a free account at https://formspree.io and add a new form.
2. Copy your form ID (looks like `xzbqwxyz`).
3. In `contact.html`, find `action="https://formspree.io/f/YOUR_FORM_ID"`
   and replace `YOUR_FORM_ID` with your real ID.
4. Submit a test — the first submission asks you to confirm your email.

Spam protection already built in: a honeypot field (`_gotcha`) that only
bots fill (those submissions are silently dropped), plus Formspree's own
server-side filtering.

**Mailing list (footer, all pages):** same setup — create a SECOND
Formspree form for signups and replace `YOUR_NEWSLETTER_ID` in the footer
form (it appears in every .html file; find-and-replace across files).
Later, this can point at a real mailing provider instead (Mailchimp,
Buttondown, Brevo) — swap the form `action` to their endpoint.

## Recipe: Displaying an Email Address (spam-safe)

Never write `mailto:` or a full address in the HTML. Use the protected
pattern — JavaScript assembles it at load time, so source-scanning
harvesters never see a complete address:

```html
<a class="email-protect" data-user="booking" data-domain="skippingmondays.example">booking [at] skippingmondays.example</a>
```

The visible `[at]` text is only the no-JavaScript fallback.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Page loads but nothing animates | No internet / CDN blocked | Check the `<script src>` URLs load (browser DevTools → Network) |
| Hero shows a random photo | `Images/hero.jpg` missing or renamed | The `onerror` fallback kicked in — restore the file/name |
| Logo missing in navbar | `Images/logo-horiz-wht.svg` moved | Keep the Images folder next to the HTML file |
| Headline words never appear | JS error before the reveal ran | Open DevTools → Console, fix the reported line |
| German text shows masks/spans oddly | `refreshSplits()` not called after a text swap | Always change text via `setLang` or call `refreshSplits()` after |
| Scroll feels normal, not smooth | Lenis CDN failed (site falls back on purpose) | Check the lenis script URL in Network tab |

---

## Verifying Changes (do this after every edit)

1. Refresh the page — check the browser Console (F12) for red errors.
2. Scroll top to bottom — every section should reveal once, smoothly.
3. Click DE, then EN — all text should switch, headlines should stay visible.
4. Resize the window — the footer wordmark must always span edge to edge.
5. Optional: extract the inline `<script>` and run `node --check` on it.
