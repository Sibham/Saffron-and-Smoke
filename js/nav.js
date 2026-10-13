/**
 * nav.js — Navigation module
 * Handles: sticky header on scroll, hamburger toggle (with ARIA + Esc),
 * mobile drawer, smooth scroll for anchor links.
 */

import { qs, qsa, throttle, trapFocus } from './dom.js';

/** @type {HTMLElement} */
let header;
/** @type {HTMLButtonElement} */
let hamburger;
/** @type {HTMLElement} */
let mobileNav;
/** @type {boolean} */
let isNavOpen = false;

/**
 * Update the header's `is-scrolled` class based on scroll position.
 */
const handleScroll = throttle(() => {
  if (!header) return;
  const scrolled = window.scrollY > 50;
  header.classList.toggle('is-scrolled', scrolled);
}, 100);

/**
 * Open the mobile navigation drawer.
 */
function openNav() {
  isNavOpen = true;
  mobileNav.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';

  // Move focus to first link inside drawer
  const firstLink = qs('.mobile-nav-link', mobileNav);
  if (firstLink) firstLink.focus();
}

/**
 * Close the mobile navigation drawer.
 */
function closeNav() {
  isNavOpen = false;
  mobileNav.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  hamburger.focus();
}

/**
 * Toggle the mobile nav open/closed.
 */
function toggleNav() {
  isNavOpen ? closeNav() : openNav();
}

/**
 * Initialise all navigation behaviours.
 */
export function initNav() {
  header     = qs('.site-header');
  hamburger  = qs('.hamburger');
  mobileNav  = qs('.mobile-nav');

  if (!header || !hamburger || !mobileNav) return;

  // Sticky header
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // Hamburger toggle
  hamburger.addEventListener('click', toggleNav);

  // Close on mobile link click (event delegation)
  mobileNav.addEventListener('click', (e) => {
    const link = e.target.closest('.mobile-nav-link, .mobile-nav-cta');
    if (link) closeNav();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isNavOpen) closeNav();
  });

  // Trap focus inside mobile nav when open
  mobileNav.addEventListener('keydown', (e) => {
    if (isNavOpen) trapFocus(mobileNav, e);
  });

  // Close nav if window resizes to desktop
  window.addEventListener('resize', throttle(() => {
    if (window.innerWidth >= 768 && isNavOpen) closeNav();
  }, 200));

  // Smooth scroll for all anchor links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = qs(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/**
 * Initialise IntersectionObserver to highlight active nav link
 * as user scrolls through sections.
 * @param {string[]} sectionIds - IDs of sections to observe
 */
export function initActiveLinks(sectionIds) {
  const navLinks = qsa('.nav-link[data-section], .mobile-nav-link[data-section]');
  if (!navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const active = link.dataset.section === id;
            link.classList.toggle('is-active', active);
          });
        }
      }
    },
    {
      rootMargin: `-${(header?.offsetHeight || 72) + 16}px 0px -60% 0px`,
      threshold: 0,
    }
  );

  sectionIds.forEach((id) => {
    const el = qs(`#${id}`);
    if (el) observer.observe(el);
  });
}
