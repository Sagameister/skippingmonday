/* ============================================================
   SKIPPING MONDAYS — shared JavaScript for the interior pages
   (gigs, media, news, about, contact)

   Everything is GUARDED: each feature first checks whether its
   elements exist on the current page, so one script safely
   serves five different pages. The homepage (index.html) keeps
   its own inline script.
   ============================================================ */

/* ---------- page transitions (fade out on click, fade in on load) ---------- */
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  document.body.classList.add('page-ready');
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-ready');
  });
}

function wirePageTransitions() {
  document.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      link.target !== '_blank' &&
      link.hostname === location.hostname
    ) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.remove('page-ready');
        setTimeout(() => {
          location.href = href;
        }, 350);
      });
    }
  });
}
wirePageTransitions();

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    document.body.classList.add('page-ready');
  }
});

/* ---------- motion system setup ---------- */
gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('brand', '0.22, 1, 0.36, 1');   // the house easing curve
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Lenis smooth scroll ---------- */
let lenis = null;
if (window.Lenis && !prefersReduced) {
  lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

/* ---------- header: highlight the page you're on ---------- */
const herePath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('header .nav-link').forEach((link) => {
  if (link.getAttribute('href') === herePath) link.classList.add('active');
});

/* ---------- burger menu (same curtain as the homepage) ---------- */
const burgerBtn   = document.querySelector('.burger');
const menuOverlay = document.querySelector('.menu-overlay');
let menuOpen = false;

if (burgerBtn && menuOverlay){
  gsap.set(menuOverlay, { y: 0, yPercent: -100, autoAlpha: 0 });  // parked up top

  burgerBtn.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });
}
function openMenu(){
  menuOpen = true;
  burgerBtn.classList.add('open');
  if (lenis) lenis.stop();
  gsap.killTweensOf([menuOverlay, '.menu-overlay .m-inner']);
  if (prefersReduced){
    gsap.set(menuOverlay, { yPercent: 0, autoAlpha: 1 });
    gsap.set('.menu-overlay .m-inner', { yPercent: 0 });
    return;
  }
  gsap.set(menuOverlay, { autoAlpha: 1 });
  gsap.to(menuOverlay, { yPercent: 0, duration: .8, ease: 'brand' });
  gsap.fromTo('.menu-overlay .m-inner',
    { yPercent: 110 },
    { yPercent: 0, duration: .9, ease: 'brand', stagger: .08, delay: .3 });
}
function closeMenu(){
  if (!menuOpen) return;
  menuOpen = false;
  burgerBtn.classList.remove('open');
  if (lenis) lenis.start();
  gsap.killTweensOf([menuOverlay, '.menu-overlay .m-inner']);
  if (prefersReduced){
    gsap.set(menuOverlay, { yPercent: -100, autoAlpha: 0 });
    return;
  }
  gsap.to('.menu-overlay .m-inner', { yPercent: 110, duration: .35, ease: 'brand', stagger: .04 });
  gsap.to(menuOverlay, {
    yPercent: -100, duration: .7, ease: 'brand', delay: .15,
    onComplete: () => gsap.set(menuOverlay, { autoAlpha: 0 })
  });
}

/* ---------- language switcher (EN pill + dropdown) ---------- */
let currentLang = 'en';
const langWrap       = document.querySelector('.lang');
const langCurrentBtn = document.getElementById('lang-current');
const langOptBtn     = document.getElementById('lang-opt');

function setLang(lang){
  document.querySelectorAll('[data-en]').forEach((el) => {
    el.textContent = el.dataset[lang];
  });
  const other = lang === 'en' ? 'de' : 'en';
  langCurrentBtn.textContent = lang.toUpperCase();
  langOptBtn.textContent = other.toUpperCase();
  langOptBtn.dataset.lang = other;
  langWrap.classList.remove('open');
  langCurrentBtn.setAttribute('aria-expanded', 'false');
  document.documentElement.lang = lang;
  currentLang = lang;
  refreshSplits();     // text swaps wipe the word-masks — rebuild them
  buildAllRolls();     // ...and the hover-roll wrappers too
  buildNewsIndex();    // news page: jump list shows the new language
  try { localStorage.setItem('sm-lang', lang); } catch(e){}  // remember across pages
}

if (langCurrentBtn){
  langCurrentBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = langWrap.classList.toggle('open');
    langCurrentBtn.setAttribute('aria-expanded', String(open));
  });
  langOptBtn.addEventListener('click', () => setLang(langOptBtn.dataset.lang));
  addEventListener('click', (e) => {
    if (!langWrap.contains(e.target)){
      langWrap.classList.remove('open');
      langCurrentBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- split-text engine (word mask reveals) ---------- */
function splitWords(el){
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = '';
  words.forEach((word, i) => {
    const mask  = document.createElement('span');  mask.className  = 'w-mask';
    const inner = document.createElement('span');  inner.className = 'w-inner';
    inner.textContent = word;
    mask.appendChild(inner);
    el.appendChild(mask);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
}
const splitEls = gsap.utils.toArray('[data-split]');
function refreshSplits(){
  if (prefersReduced) return;
  splitEls.forEach((el) => {
    splitWords(el);
    if (!el.classList.contains('revealed')){
      gsap.set(el.querySelectorAll('.w-inner'), { yPercent: 110 });
    }
  });
}
function revealSplit(el){
  gsap.to(el.querySelectorAll('.w-inner'), {
    yPercent: 0, duration: 1.2, ease: 'brand', stagger: 0.08,
    delay: parseFloat(el.dataset.splitDelay || 0),
    onComplete: () => el.classList.add('revealed')
  });
}

/* ---------- text-roll hover (links & buttons) ---------- */
const ROLL_TARGETS = [
  'header nav a.nav-link',
  '.menu-links .m-inner',
  '.lang button',
  '.btn-all',
  '.foot-grid ul a',
  '.legal a'
];
function buildRoll(el){
  if (el.querySelector('.roll-inner')) return;
  const text = el.textContent.trim();
  if (!text) return;
  el.textContent = '';
  const roll  = document.createElement('span');  roll.className  = 'roll';
  const inner = document.createElement('span');  inner.className = 'roll-inner';
  for (let i = 0; i < 2; i++){
    const line = document.createElement('span');
    line.className = 'roll-line';
    line.textContent = text;
    if (i === 1) line.setAttribute('aria-hidden', 'true');
    inner.appendChild(line);
  }
  roll.appendChild(inner);
  el.appendChild(roll);
  (el.closest('a,button') || el).classList.add('has-roll');
}
function buildAllRolls(){
  document.querySelectorAll(ROLL_TARGETS.join(',')).forEach(buildRoll);
}
buildAllRolls();

/* ---------- scroll reveals ---------- */
if (!prefersReduced){

  // headlines with data-split: words rise out of their masks
  refreshSplits();
  splitEls.forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => revealSplit(el)
    });
  });

  // anything marked data-reveal: quiet fade-up on its own arrival
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      opacity: 0, y: 16, duration: .9, ease: 'brand'
    });
  });

  // images marked for the cinematic "window opening" reveal
  gsap.utils.toArray('.reveal-img img').forEach((img) => {
    gsap.fromTo(img,
      { clipPath: 'inset(20% 20% 20% 20%)', opacity: 0 },
      {
        scrollTrigger: { trigger: img, start: 'top 85%', once: true },
        clipPath: 'inset(0% 0% 0% 0%)', opacity: 1,
        duration: 1.4, ease: 'brand'
      });
  });

  // page hero photo: gentle settle on load
  const heroImg = document.querySelector('.page-hero img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'brand' });
}

/* ---------- hometown ticker (about page) ---------- */
const tickerTrack = document.getElementById('ticker-track');
if (tickerTrack && !prefersReduced){
  const TICKER_SPEED = 90;   // px per second
  document.fonts.ready.then(() => {
    const half = tickerTrack.scrollWidth / 2;
    gsap.to(tickerTrack, { x: -half, ease: 'none', duration: half / TICKER_SPEED, repeat: -1 });
  });
}

/* ---------- footer: live city clocks ---------- */
function cityTime(timeZone){
  return new Intl.DateTimeFormat('de-DE', { hour:'2-digit', minute:'2-digit', timeZone }).format(new Date());
}
function updateClocks(){
  const b = document.getElementById('clock-berlin');
  if (!b) return;
  b.textContent = cityTime('Europe/Berlin');
  document.getElementById('clock-london').textContent = cityTime('Europe/London');
  document.getElementById('clock-ny').textContent     = cityTime('America/New_York');
}
updateClocks();
setInterval(updateClocks, 30000);

/* ---------- footer: rainbow Easter egg (cursor-chasing rings) ---------- */
const rainbowGrad = document.getElementById('rainbow');
const giantWrap   = document.querySelector('.giant-wrap');
const giantSvg    = document.querySelector('svg.giant');
if (rainbowGrad && giantWrap){
  if (prefersReduced){
    const a = document.getElementById('rainbow-anim-r');
    if (a) a.remove();
  } else {
    const rainbowPos = { x: 480, y: 220 };
    const rainbowAim = { x: 480, y: 220 };
    giantWrap.addEventListener('mousemove', (e) => {
      const r = giantSvg.getBoundingClientRect();
      rainbowAim.x = (e.clientX - r.left) / r.width  * 960;
      rainbowAim.y = (e.clientY - r.top)  / r.height * 78;
    });
    giantWrap.addEventListener('mouseleave', () => {
      rainbowAim.x = 480; rainbowAim.y = 220;
    });
    gsap.ticker.add(() => {
      rainbowPos.x += (rainbowAim.x - rainbowPos.x) * 0.035;
      rainbowPos.y += (rainbowAim.y - rainbowPos.y) * 0.035;
      rainbowGrad.setAttribute('cx', rainbowPos.x);
      rainbowGrad.setAttribute('cy', rainbowPos.y);
    });
  }
}

/* ---------- spam-safe email links ----------
   The HTML source never contains a full address (harvesters read
   source, most don't run JS). This assembles user + domain into a
   visible address and a working mailto link at load time. */
document.querySelectorAll('.email-protect').forEach((a) => {
  const addr = a.dataset.user + '@' + a.dataset.domain;
  a.textContent = addr;
  a.setAttribute('href', 'mailto:' + addr);
});

/* ---------- forms: contact form AND newsletter signup ----------
   Same recipe for both: honeypot check, "not connected" notice
   while the Formspree ID is still a placeholder, then a fetch
   submit with bilingual status messages from data-attributes. */
function wireAjaxForm(form){
  const statusEl = form.querySelector('.form-status');
  const msg = (key) => form.dataset[key + (currentLang === 'de' ? 'De' : 'En')] || '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.querySelector('[name="_gotcha"]').value) return;   // bot: ignore silently
    if (form.action.includes('YOUR_')){                          // service not connected yet
      statusEl.textContent = msg('off');
      return;
    }
    statusEl.textContent = msg('sending');
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok){ form.reset(); statusEl.textContent = msg('ok'); }
      else       { statusEl.textContent = msg('err'); }
    } catch (_){
      statusEl.textContent = msg('err');
    }
  });
}
document.querySelectorAll('.contact-form, .newsletter').forEach(wireAjaxForm);

/* ---------- news quick-find index (news page only) ----------
   Builds a jump list by READING the articles already on the page:
   one row per <article class="post">, using its date and title.
   Nothing to maintain — new articles appear in the index
   automatically. Rebuilt on language switch (titles change). */
const newsIndex = document.querySelector('.news-index');

function buildNewsIndex(){
  if (!newsIndex) return;
  const list = newsIndex.querySelector('.idx-list');
  list.innerHTML = '';
  document.querySelectorAll('article.post').forEach((post) => {
    const row = document.createElement('a');
    row.className = 'idx-row';
    row.href = '#' + post.id;

    const d = document.createElement('span');
    d.className = 'idx-date';
    d.textContent = post.querySelector('.post-date').textContent;

    const t = document.createElement('span');
    t.className = 'idx-title';
    t.textContent = post.querySelector('.post-title').textContent;

    row.append(d, t);
    // clicking glides down to the article (with room for the navbar)
    row.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) lenis.scrollTo(post, { duration: 1.3, offset: -110 });
      else post.scrollIntoView({ behavior: 'smooth' });
    });
    list.appendChild(row);
  });
  // placeholder text in the current language
  const filter = newsIndex.querySelector('.index-filter');
  filter.placeholder = currentLang === 'de' ? 'Artikel filtern…' : 'Filter articles…';
}

if (newsIndex){
  buildNewsIndex();
  // live filter: hide rows whose text doesn't contain what you typed
  newsIndex.querySelector('.index-filter').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    newsIndex.querySelectorAll('.idx-row').forEach((row) => {
      row.classList.toggle('hidden', q !== '' && !row.textContent.toLowerCase().includes(q));
    });
  });
}

/* ---------- restore the language chosen on a previous page ---------- */
try {
  const saved = localStorage.getItem('sm-lang');
  if (saved && saved !== 'en') setLang(saved);
} catch(e){}
