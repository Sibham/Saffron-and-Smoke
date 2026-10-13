/**
 * dom.js — DOM helper utilities
 * Provides lightweight selector shortcuts, element creation helpers,
 * debounce, throttle, and event delegation.
 */

/**
 * Shorthand querySelector
 * @param {string} selector - CSS selector
 * @param {Element|Document} [ctx=document] - search context
 * @returns {Element|null}
 */
export const qs = (selector, ctx = document) => ctx.querySelector(selector);

/**
 * Shorthand querySelectorAll (returns Array, not NodeList)
 * @param {string} selector - CSS selector
 * @param {Element|Document} [ctx=document] - search context
 * @returns {Element[]}
 */
export const qsa = (selector, ctx = document) =>
  Array.from(ctx.querySelectorAll(selector));

/**
 * Create an element with optional properties and children
 * @param {string} tag - HTML tag name
 * @param {Object} [props={}] - attributes / properties to assign
 * @param {...(Node|string)} children - child nodes or text
 * @returns {HTMLElement}
 */
export function createElement(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else if (key.startsWith('aria-') || key === 'role' || key === 'type') {
      el.setAttribute(key, value);
    } else {
      el[key] = value;
    }
  }
  for (const child of children) {
    if (child == null) continue;
    el.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
}

/**
 * Safely set text content (prevents XSS)
 * @param {HTMLElement} el
 * @param {string} text
 */
export const setText = (el, text) => { el.textContent = text; };

/**
 * Debounce: delays function execution until after `wait` ms have passed
 * since the last invocation.
 * @param {Function} fn
 * @param {number} wait - milliseconds
 * @returns {Function}
 */
export function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Throttle: limits function to at most once per `limit` ms.
 * @param {Function} fn
 * @param {number} limit - milliseconds
 * @returns {Function}
 */
export function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Event delegation — attach a single listener to a parent element
 * that fires when a child matching `selector` triggers `event`.
 * @param {Element} parent - container element
 * @param {string} event - event name (e.g., 'click')
 * @param {string} selector - CSS selector for matching children
 * @param {Function} handler - callback(event, matchedElement)
 */
export function delegate(parent, event, selector, handler) {
  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler(e, target);
    }
  });
}

/**
 * Trap focus inside a container (for modals/drawers)
 * @param {HTMLElement} container
 * @param {KeyboardEvent} e
 */
export function trapFocus(container, e) {
  const focusable = qsa(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    container
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
