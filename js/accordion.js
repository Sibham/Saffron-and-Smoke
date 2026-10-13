/**
 * accordion.js — FAQ Accordion module
 * Renders FAQ items from data and handles expand/collapse
 * with full ARIA support (aria-expanded, aria-controls).
 */

import { qs, createElement, delegate } from './dom.js';

/** @type {Array<{q: string, a: string}>} */
const FAQ_DATA = [
  {
    q: 'Do you accommodate dietary restrictions or allergies?',
    a: 'Absolutely. We cater to vegetarian, vegan, Jain, gluten-free, and nut-free requirements. Please inform us at the time of booking so our chef can personalise your tasting menu accordingly. We cannot guarantee allergen-free environments but take every precaution.',
  },
  {
    q: 'What is your reservation and cancellation policy?',
    a: 'Reservations are recommended, especially on weekends and holidays. We hold tables for 15 minutes past the booking time. Cancellations made 24 hours in advance are fully refunded. For private dining events, a 50% deposit is required and cancellations within 48 hours forfeit the deposit.',
  },
  {
    q: 'Is there a dress code at Saffron & Smoke?',
    a: 'We encourage smart-casual to formal attire. We wish for all guests to feel at their finest while dining with us, which enhances the overall experience for everyone. Sportswear and beachwear are not permitted in the dining room.',
  },
  {
    q: 'Can the private dining room be booked for corporate events?',
    a: 'Yes. Our private dining room seats up to 12 guests and is available for corporate dinners, product launches, board meetings with dining, and celebration events. We offer bespoke menus and A/V equipment. Please contact us directly for a tailored proposal.',
  },
  {
    q: 'Do you offer wine or beverage pairings with tasting menus?',
    a: 'Our Signature and Private menus include curated beverage flights — either wine or our signature cocktail pairing, designed by our in-house sommelier to complement each course. Non-alcoholic pairings using rare teas, shrubs, and pressed juices are also available.',
  },
  {
    q: 'Is Saffron & Smoke suitable for children?',
    a: 'We welcome guests of all ages but our fine dining environment is best suited to adults and older children (12+). For families with young children, we recommend lunch service on weekdays, where the atmosphere is slightly more relaxed.',
  },
];

/**
 * Build and inject accordion items into `.faq-container`.
 */
function buildAccordion() {
  const container = qs('.faq-container');
  if (!container) return;

  const fragment = document.createDocumentFragment();

  FAQ_DATA.forEach((item, i) => {
    const id   = `faq-panel-${i}`;
    const btnId = `faq-trigger-${i}`;

    const el = createElement('div', { class: 'accordion-item reveal', dataset: { index: String(i) } });

    // Trigger button
    const trigger = createElement('button', {
      class: 'accordion-trigger',
      id: btnId,
      'aria-expanded': 'false',
      'aria-controls': id,
      type: 'button',
    });

    const question = createElement('span', { class: 'accordion-question' }, item.q);

    const icon = createElement('span', { class: 'accordion-icon', 'aria-hidden': 'true' });
    icon.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="4" y="0" width="2" height="10" rx="1"/><rect x="0" y="4" width="10" height="2" rx="1"/></svg>`;

    trigger.append(question, icon);

    // Panel
    const panel = createElement('div', {
      class: 'accordion-panel',
      id,
      role: 'region',
      'aria-labelledby': btnId,
    });

    const body = createElement('div', { class: 'accordion-body' }, item.a);
    panel.append(body);

    el.append(trigger, panel);
    fragment.append(el);
  });

  container.append(fragment);
}

/**
 * Toggle a single accordion item open/closed.
 * @param {HTMLElement} item - the `.accordion-item` element
 */
function toggleItem(item) {
  const isOpen = item.classList.contains('is-open');
  const trigger = item.querySelector('.accordion-trigger');
  const panel   = item.querySelector('.accordion-panel');

  if (!trigger || !panel) return;

  // Close all others first
  qs('.faq-container')?.querySelectorAll('.accordion-item.is-open').forEach((openItem) => {
    if (openItem !== item) closeItem(openItem);
  });

  if (isOpen) {
    closeItem(item);
  } else {
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
  }
}

/**
 * @param {HTMLElement} item
 */
function closeItem(item) {
  item.classList.remove('is-open');
  const trigger = item.querySelector('.accordion-trigger');
  const panel   = item.querySelector('.accordion-panel');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
  if (panel) panel.classList.remove('is-open');
}

/**
 * Initialise accordion module.
 */
export function initAccordion() {
  buildAccordion();

  const container = qs('.faq-container');
  if (!container) return;

  // Event delegation on container
  delegate(container, 'click', '.accordion-trigger', (e, trigger) => {
    const item = trigger.closest('.accordion-item');
    if (item) toggleItem(item);
  });

  // Keyboard: open first item by default
  // (nothing open on load — users can expand)
}
