/**
 * main.js — Entry point
 * Orchestrates all modules. Runs after DOM is ready.
 */

import { initNav, initActiveLinks } from './nav.js';
import {
  initTheme,
  initScrollReveal,
  initBackToTop,
  initHeroParallax,
  renderDishes,
  renderTestimonials,
  renderPricing,
  initReservationFloat,
  initAwardsBar,
} from './ui.js';
import { initGallery } from './gallery.js';
import { initAccordion } from './accordion.js';
import { initForm } from './form.js';

/**
 * Bootstrap all modules once DOM content is loaded.
 */
function init() {
  // 1. Apply theme immediately (prevents flash)
  initTheme();

  // 2. Render dynamic content (before reveal observer fires)
  renderDishes();
  renderTestimonials();
  renderPricing();
  initAccordion();

  // 3. Awards bar — duplicate for seamless marquee loop
  initAwardsBar();

  // 4. Navigation
  initNav();
  initActiveLinks(['hero', 'about', 'chef', 'dishes', 'gallery', 'testimonials', 'pricing', 'faq', 'contact']);

  // 5. UI behaviours
  initScrollReveal();
  initBackToTop();
  initHeroParallax();

  // 6. Gallery & lightbox
  initGallery();

  // 7. Contact form
  initForm();

  // 8. Floating reservation widget
  initReservationFloat();
}

// Run after DOM is fully parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
