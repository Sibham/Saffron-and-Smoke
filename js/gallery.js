/**
 * gallery.js — Gallery filter and lightbox module
 * Handles: filter tab switching (event delegation), lightbox open/close,
 * keyboard navigation (arrow keys, Esc), and focus management.
 */

import { qs, qsa, createElement, delegate } from './dom.js';

/** Gallery image data */
const GALLERY_ITEMS = [
  { src: 'assets/images/gallery-galouti.jpg',   alt: 'Gilded Galouti Kebab close-up',            label: 'Galouti Kebab',     category: 'starters' },
  { src: 'assets/images/gallery-biryani.jpg',   alt: 'Smoked Dum Biryani opened at the table',   label: 'Dum Biryani',       category: 'mains'    },
  { src: 'assets/images/gallery-dessert.jpg',   alt: 'Saffron Constellation dessert plating',    label: 'Constellation',     category: 'desserts' },
  { src: 'assets/images/gallery-ambiance1.jpg', alt: 'Saffron & Smoke restaurant dining room',   label: 'The Dining Room',   category: 'ambiance' },
  { src: 'assets/images/gallery-dal.jpg',       alt: 'Black Dal Makhani with truffle oil',       label: 'Dal Makhani',       category: 'mains'    },
  { src: 'assets/images/gallery-tikka.jpg',     alt: 'Tandoor-fired chicken tikka on skewers',   label: 'Royal Tikka',       category: 'starters' },
  { src: 'assets/images/gallery-ambiance2.jpg', alt: 'Candlelit private dining table setup',     label: 'Private Dining',    category: 'ambiance' },
  { src: 'assets/images/gallery-gulab.jpg',     alt: 'Deconstructed gulab jamun with ice cream', label: 'Deconstructed Gulab', category: 'desserts' },
];

/** Currently visible items for lightbox navigation */
let visibleItems = [...GALLERY_ITEMS];
/** Current lightbox index */
let currentIndex = 0;

/** @type {HTMLElement} */
let lightbox;
/** @type {HTMLImageElement} */
let lightboxImg;
/** @type {HTMLElement} */
let lightboxCaption;
/** @type {HTMLElement} */
let lightboxCounter;

/**
 * Build gallery items from data array and inject into DOM.
 */
function buildGallery() {
  const grid = qs('.gallery-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  GALLERY_ITEMS.forEach((item, i) => {
    const figure = createElement('figure', {
      class: 'gallery-item reveal',
      dataset: { category: item.category, index: String(i) },
      role: 'button',
      tabindex: '0',
      'aria-label': `View ${item.label} in lightbox`,
    });

    const img = createElement('img', {
      class: 'gallery-item-img',
      src: item.src,
      alt: item.alt,
      loading: 'lazy',
      width: '600',
      height: '600',
    });

    const overlay = createElement('div', { class: 'gallery-item-overlay', 'aria-hidden': 'true' });
    const labelEl = createElement('figcaption', { class: 'gallery-item-label' }, item.label);
    overlay.append(labelEl);

    const zoomIcon = createElement('div', { class: 'gallery-zoom-icon', 'aria-hidden': 'true' });
    zoomIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>`;

    figure.append(img, overlay, zoomIcon);
    fragment.append(figure);
  });

  grid.append(fragment);
}

/**
 * Filter gallery items by category.
 * @param {string} category - 'all' or a specific category string
 */
function filterGallery(category) {
  const items = qsa('.gallery-item');

  if (category === 'all') {
    visibleItems = [...GALLERY_ITEMS];
    items.forEach((item) => item.classList.remove('is-hidden'));
  } else {
    visibleItems = GALLERY_ITEMS.filter((d) => d.category === category);
    items.forEach((item) => {
      const match = item.dataset.category === category;
      item.classList.toggle('is-hidden', !match);
    });
  }
}

/**
 * Open the lightbox at the given data index within GALLERY_ITEMS.
 * @param {number} dataIndex - index in GALLERY_ITEMS
 */
function openLightbox(dataIndex) {
  const item = GALLERY_ITEMS[dataIndex];
  if (!item) return;

  currentIndex = visibleItems.findIndex((d) => d.src === item.src);
  if (currentIndex === -1) currentIndex = 0;

  updateLightboxContent();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = qs('.lightbox-close');
  if (closeBtn) closeBtn.focus();
}

/**
 * Close the lightbox.
 */
function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Navigate lightbox to an adjacent item.
 * @param {number} dir - +1 or -1
 */
function navigateLightbox(dir) {
  currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
  updateLightboxContent();
}

/**
 * Update lightbox image/caption/counter to match currentIndex.
 */
function updateLightboxContent() {
  const item = visibleItems[currentIndex];
  if (!item || !lightboxImg) return;

  lightboxImg.style.opacity = '0';
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;

  lightboxImg.onload = () => {
    lightboxImg.style.transition = 'opacity 0.25s ease';
    lightboxImg.style.opacity = '1';
  };

  if (lightboxCaption) lightboxCaption.textContent = item.label;
  if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
}

/**
 * Initialise the gallery module.
 */
export function initGallery() {
  buildGallery();

  lightbox        = qs('.lightbox');
  lightboxImg     = qs('.lightbox-img');
  lightboxCaption = qs('.lightbox-caption');
  lightboxCounter = qs('.lightbox-counter');

  if (!lightbox) return;

  // Filter buttons (event delegation)
  const filtersEl = qs('.gallery-filters');
  if (filtersEl) {
    delegate(filtersEl, 'click', '.gallery-filter-btn', (e, btn) => {
      qsa('.gallery-filter-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      filterGallery(btn.dataset.filter);
    });
  }

  // Gallery item click (event delegation)
  const grid = qs('.gallery-grid');
  if (grid) {
    delegate(grid, 'click', '.gallery-item', (e, item) => {
      openLightbox(Number(item.dataset.index));
    });

    // Keyboard access for gallery items
    grid.addEventListener('keydown', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(Number(item.dataset.index));
      }
    });
  }

  // Lightbox controls
  const closeBtn = qs('.lightbox-close');
  const prevBtn  = qs('.lightbox-prev');
  const nextBtn  = qs('.lightbox-next');

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => navigateLightbox(-1));
  nextBtn?.addEventListener('click', () => navigateLightbox(+1));

  // Click outside content to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    switch (e.key) {
      case 'Escape':     closeLightbox(); break;
      case 'ArrowLeft':  navigateLightbox(-1); break;
      case 'ArrowRight': navigateLightbox(+1); break;
    }
  });
}
