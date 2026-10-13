/**
 * ui.js — UI module
 * Handles: theme toggle, scroll-reveal (IntersectionObserver),
 * back-to-top button, and dynamic rendering of dishes, testimonials, pricing.
 */

import { qs, qsa, createElement, throttle } from './dom.js';

/* ═══════════════════════════════════
   DATA
   ═══════════════════════════════════ */

/** @type {Array<{category:string, title:string, desc:string, price:string, tag:string, badge?:string, img:string}>} */
const DISHES = [
  {
    category: 'Signature Starter',
    title: 'Gilded Galouti Kebab',
    desc: 'Melt-in-the-mouth minced lamb patties with 92 spices, saffron reduction, and pomegranate chutney on house-baked warqi paratha.',
    price: '₹1,850',
    tag: 'Chef\'s Favourite',
    badge: 'New',
    img: 'assets/images/dish-galouti.jpg',
    alt: 'Gilded Galouti Kebab — golden minced lamb patties on paratha',
  },
  {
    category: 'Main Course',
    title: 'Smoked Dum Biryani',
    desc: 'Aged basmati layered with 48-hour slow-cooked short ribs, truffle kewra water, and saffron-infused ghee, finished under slow dum steam.',
    price: '₹2,400',
    tag: 'Most Ordered',
    img: 'assets/images/dish-biryani.jpg',
    alt: 'Smoked Dum Biryani — aromatic saffron rice with slow-cooked ribs',
  },
  {
    category: 'Dessert',
    title: 'Saffron Constellation',
    desc: 'Compressed mango spheres, cardamom panna cotta, 24-karat gold dust, and rosewater fairy floss — a universe of flavour on one plate.',
    price: '₹1,200',
    tag: 'Award Winning',
    badge: 'Signature',
    img: 'assets/images/dish-dessert.jpg',
    alt: 'Saffron Constellation dessert — mango spheres with gold dust',
  },
];

/** @type {Array<{text:string, name:string, meta:string, stars:number, initial:string}>} */
const TESTIMONIALS = [
  {
    text: 'An extraordinary journey through modern Indian cuisine. Every dish told a story — complex yet harmonious. The Smoked Dum Biryani alone is worth making a reservation a month in advance.',
    name: 'Priya Mehrotra',
    meta: 'Food Critic, Saveur India',
    stars: 5,
    initial: 'P',
  },
  {
    text: 'Saffron & Smoke reimagines what Indian fine dining can be. The tasting menu is a masterclass in restraint and boldness simultaneously. Simply flawless.',
    name: 'Arjun Kapoor',
    meta: 'Michelin Inspector (ret.)',
    stars: 5,
    initial: 'A',
  },
  {
    text: 'The most beautiful dining room in the city paired with cooking that moves you to tears. The Galouti Kebab is nothing short of transcendent. We will return every anniversary.',
    name: 'Meera & Rohan Singhania',
    meta: 'Verified Guest',
    stars: 5,
    initial: 'M',
  },
];

/** @type {Array<{name:string, tagline:string, price:string, featured:boolean, features:string[]}>} */
const PRICING = [
  {
    name: 'The Heritage',
    tagline: 'Four courses of timeless classics',
    price: '4,500',
    featured: false,
    features: [
      'Amuse-bouche & bread service',
      'Chef\'s starter selection',
      'One Heritage main course',
      'Dessert & petit fours',
      'Still or sparkling water',
    ],
  },
  {
    name: 'The Signature',
    tagline: 'Seven courses — our complete vision',
    price: '8,500',
    featured: true,
    features: [
      'Everything in Heritage',
      'Additional two premium courses',
      'Paired wine / cocktail flights',
      'Palate cleanser',
      'Table-side cheese trolley',
      'Personalised menu card',
      'Chef\'s table available',
    ],
  },
  {
    name: 'The Private',
    tagline: 'Bespoke experience for special occasions',
    price: '14,000',
    featured: false,
    features: [
      'Everything in Signature',
      'Dedicated sommelier',
      'Private dining room (up to 12)',
      'Customised menu consultation',
      'Curated gift from the kitchen',
    ],
  },
];

/* ═══════════════════════════════════
   THEME TOGGLE
   ═══════════════════════════════════ */

/**
 * Load saved theme from localStorage, apply it, and wire the toggle button.
 */
export function initTheme() {
  const toggle = qs('.theme-toggle');
  if (!toggle) return;

  // Read saved preference
  let theme = 'dark';
  try {
    theme = localStorage.getItem('ss-theme') || 'dark';
  } catch (_) { /* storage blocked */ }

  applyTheme(theme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('ss-theme', next); } catch (_) { /* blocked */ }
  });
}

/**
 * @param {string} theme - 'dark' | 'light'
 */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const toggle = qs('.theme-toggle');
  if (toggle) {
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

/* ═══════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════ */

/**
 * Attach an IntersectionObserver to all `.reveal`, `.reveal-left`, `.reveal-right`
 * elements and add `is-visible` when they enter the viewport.
 */
export function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elements = qsa('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  if (prefersReduced) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Apply data-delay as transition-delay for stagger effect
          const delay = el.dataset.delay;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-visible');
          observer.unobserve(el); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ═══════════════════════════════════
   BACK TO TOP
   ═══════════════════════════════════ */

/**
 * Show/hide the back-to-top button based on scroll depth.
 */
export function initBackToTop() {
  const btn = qs('.back-to-top');
  if (!btn) return;

  const toggle = throttle(() => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, 200);

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ═══════════════════════════════════
   HERO IMAGE PARALLAX (subtle)
   ═══════════════════════════════════ */

/**
 * Add a subtle parallax drift to the hero background image on scroll.
 */
export function initHeroParallax() {
  const heroBg = qs('.hero-bg-img');
  if (!heroBg) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Mark image as loaded after first paint
  heroBg.classList.add('is-loaded');

  window.addEventListener('scroll', throttle(() => {
    const scrolled = window.scrollY;
    const hero = qs('.hero');
    if (!hero) return;
    const heroHeight = hero.offsetHeight;
    if (scrolled < heroHeight) {
      const ratio = scrolled / heroHeight;
      heroBg.style.transform = `scale(1) translateY(${ratio * 12}%)`;
    }
  }, 30), { passive: true });
}

/* ═══════════════════════════════════
   RENDER: DISHES
   ═══════════════════════════════════ */

/**
 * Dynamically build dish cards from the DISHES data array
 * and append them to `.dishes-grid` using a DocumentFragment.
 */
export function renderDishes() {
  const grid = qs('.dishes-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  DISHES.forEach((dish, i) => {
    const card = createElement('article', { class: 'dish-card reveal', dataset: { delay: String(i * 100) } });

    const imgWrap = createElement('div', { class: 'dish-card-img-wrap' });
    const img = createElement('img', {
      class: 'dish-card-img',
      src: dish.img,
      alt: dish.alt,
      loading: 'lazy',
      width: '800',
      height: '500',
    });
    imgWrap.append(img);

    if (dish.badge) {
      const badge = createElement('span', { class: 'dish-card-badge' }, dish.badge);
      imgWrap.append(badge);
    }

    const body = createElement('div', { class: 'dish-card-body' });
    body.append(
      createElement('p', { class: 'dish-card-category' }, dish.category),
      createElement('h3', { class: 'dish-card-title' }, dish.title),
      createElement('p', { class: 'dish-card-desc' }, dish.desc),
    );

    const footer = createElement('div', { class: 'dish-card-footer' });
    footer.append(
      createElement('span', { class: 'dish-card-price' }, dish.price),
      createElement('span', { class: 'dish-card-tag' }, dish.tag),
    );
    body.append(footer);

    card.append(imgWrap, body);
    fragment.append(card);
  });

  grid.append(fragment);
}

/* ═══════════════════════════════════
   RENDER: TESTIMONIALS
   ═══════════════════════════════════ */

/**
 * Dynamically build testimonial cards from TESTIMONIALS data.
 */
export function renderTestimonials() {
  const grid = qs('.testimonials-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  TESTIMONIALS.forEach((t, i) => {
    const card = createElement('article', { class: 'testimonial-card reveal', dataset: { delay: String(i * 150) } });

    // Stars
    const stars = createElement('div', { class: 'testimonial-stars', 'aria-label': `${t.stars} out of 5 stars` });
    for (let s = 0; s < t.stars; s++) {
      stars.append(createElement('span', { class: 'testimonial-star', 'aria-hidden': 'true' }, '★'));
    }

    // Quote decoration
    const quoteMark = createElement('span', { class: 'testimonial-quote', 'aria-hidden': 'true' }, '"');

    const text = createElement('blockquote', { class: 'testimonial-text' }, `"${t.text}"`);

    // Author
    const author = createElement('footer', { class: 'testimonial-author' });
    const avatar = createElement('div', { class: 'testimonial-avatar', 'aria-hidden': 'true' }, t.initial);
    const info = createElement('div', {});
    info.append(
      createElement('p', { class: 'testimonial-name' }, t.name),
      createElement('p', { class: 'testimonial-meta' }, t.meta),
    );
    author.append(avatar, info);

    card.append(quoteMark, stars, text, author);
    fragment.append(card);
  });

  grid.append(fragment);
}

/* ═══════════════════════════════════
   RENDER: PRICING
   ═══════════════════════════════════ */

/**
 * Dynamically build pricing cards from PRICING data.
 */
export function renderPricing() {
  const grid = qs('.pricing-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  PRICING.forEach((plan, i) => {
    const card = createElement('article', {
      class: `pricing-card reveal${plan.featured ? ' is-featured' : ''}`,
      dataset: { delay: String(i * 100) },
    });

    if (plan.featured) {
      const badge = createElement('div', { class: 'pricing-featured-badge' }, 'Most Popular');
      card.append(badge);
    }

    card.append(
      createElement('h3', { class: 'pricing-name' }, plan.name),
      createElement('p', { class: 'pricing-tagline' }, plan.tagline),
    );

    const priceEl = createElement('div', { class: 'pricing-price' });
    priceEl.append(
      createElement('span', { class: 'pricing-currency' }, '₹'),
      createElement('span', { class: 'pricing-amount' }, plan.price),
      createElement('span', { class: 'pricing-per' }, '/ person'),
    );
    card.append(priceEl);

    card.append(createElement('div', { class: 'pricing-divider' }));

    const featuresList = createElement('ul', { class: 'pricing-features' });
    plan.features.forEach((f) => {
      const item = createElement('li', { class: 'pricing-feature' });
      const icon = createElement('span', { class: 'pricing-feature-icon', 'aria-hidden': 'true' }, '✦');
      const label = createElement('span', {}, f);
      item.append(icon, label);
      featuresList.append(item);
    });
    card.append(featuresList);

    const cta = createElement('a', {
      href: '#contact',
      class: `btn ${plan.featured ? 'btn-primary' : 'btn-outline'} btn-lg`,
    }, 'Reserve This Menu');
    card.append(cta);

    fragment.append(card);
  });

  grid.append(fragment);
}

/* ═══════════════════════════════════
   FLOATING RESERVATION WIDGET
   ═══════════════════════════════════ */

/**
 * Show a floating reservation prompt after the user scrolls
 * past the hero section. Dismissible and honours sessionStorage.
 */
export function initReservationFloat() {
  const widget = qs('#reservation-float');
  const dismissBtn = qs('#reservation-float-dismiss');
  if (!widget) return;

  // Don't show if already dismissed this session
  try {
    if (sessionStorage.getItem('ss-float-dismissed') === '1') return;
  } catch (_) { /* blocked */ }

  const hero = qs('.hero');
  if (!hero) return;

  let shown = false;

  const handleScroll = throttle(() => {
    if (shown) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom < 0) {
      shown = true;
      widget.setAttribute('aria-hidden', 'false');
      widget.classList.add('is-visible');
      window.removeEventListener('scroll', handleScroll);
    }
  }, 200);

  window.addEventListener('scroll', handleScroll, { passive: true });

  dismissBtn?.addEventListener('click', () => {
    widget.classList.remove('is-visible');
    widget.setAttribute('aria-hidden', 'true');
    setTimeout(() => widget.classList.add('is-dismissed'), 500);
    try { sessionStorage.setItem('ss-float-dismissed', '1'); } catch (_) { /* blocked */ }
  });

  // Hide widget when user reaches the contact form
  const contact = qs('#contact');
  if (contact) {
    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          widget.classList.remove('is-visible');
          widget.setAttribute('aria-hidden', 'true');
        } else if (shown && !widget.classList.contains('is-dismissed')) {
          widget.classList.add('is-visible');
          widget.setAttribute('aria-hidden', 'false');
        }
      },
      { threshold: 0.1 }
    );
    contactObserver.observe(contact);
  }
}

/* ═══════════════════════════════════
   AWARDS BAR — duplicate for seamless loop
   ═══════════════════════════════════ */

/**
 * Duplicates .awards-bar-inner content so the marquee
 * scrolls infinitely without a visible reset jump.
 */
export function initAwardsBar() {
  const inner = qs('.awards-bar-inner');
  if (!inner) return;
  // Clone the inner children and append to create seamless loop
  const clone = inner.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  inner.parentElement.append(clone);
}
