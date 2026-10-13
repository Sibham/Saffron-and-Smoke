/**
 * form.js — Contact form module
 * Real-time validation, inline error messages, accessible labels,
 * and a success state on submission.
 */

import { qs, qsa } from './dom.js';

/** Validation rules per field id */
const RULES = {
  'form-name': {
    required: true,
    minLength: 2,
    label: 'Full name',
    validate: (v) => {
      if (!v.trim()) return 'Please enter your full name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return null;
    },
  },
  'form-email': {
    required: true,
    label: 'Email address',
    validate: (v) => {
      if (!v.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
      return null;
    },
  },
  'form-phone': {
    required: false,
    label: 'Phone number',
    validate: (v) => {
      if (v && !/^[+\d\s\-().]{7,15}$/.test(v)) return 'Please enter a valid phone number.';
      return null;
    },
  },
  'form-date': {
    required: false,
    label: 'Preferred date',
    validate: (v) => {
      if (v) {
        const selected = new Date(v);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return 'Please select a future date.';
      }
      return null;
    },
  },
  'form-guests': {
    required: false,
    label: 'Number of guests',
    validate: () => null,
  },
  'form-message': {
    required: false,
    label: 'Message',
    validate: (v) => {
      if (v && v.length > 1000) return 'Message cannot exceed 1000 characters.';
      return null;
    },
  },
};

/**
 * Show or clear an error message for a field.
 * @param {HTMLElement} field
 * @param {string|null} error - null to clear
 */
function setFieldError(field, error) {
  const errorEl = field.closest('.form-group')?.querySelector('.form-error');
  if (!errorEl) return;

  if (error) {
    field.classList.add('is-error');
    field.classList.remove('is-valid');
    field.setAttribute('aria-invalid', 'true');
    errorEl.textContent = error;
  } else if (field.value.trim() || field.type === 'date') {
    field.classList.remove('is-error');
    field.classList.add('is-valid');
    field.removeAttribute('aria-invalid');
    errorEl.textContent = '';
  } else {
    field.classList.remove('is-error', 'is-valid');
    field.removeAttribute('aria-invalid');
    errorEl.textContent = '';
  }
}

/**
 * Validate a single field and update its state.
 * @param {HTMLElement} field
 * @returns {boolean} - true if valid
 */
function validateField(field) {
  const rule = RULES[field.id];
  if (!rule) return true;

  const error = rule.validate(field.value);
  setFieldError(field, error);
  return error === null;
}

/**
 * Validate all fields and return whether the whole form is valid.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateForm(form) {
  let valid = true;
  for (const id of Object.keys(RULES)) {
    const field = qs(`#${id}`, form);
    if (field && !validateField(field)) {
      valid = false;
    }
  }
  return valid;
}

/**
 * Show the success state and hide the form fields.
 * @param {HTMLFormElement} form
 */
function showSuccess(form) {
  const formContent = qs('.form-fields', form.closest('.contact-form'));
  const successEl   = qs('.form-success', form.closest('.contact-form'));

  if (formContent) formContent.style.display = 'none';
  if (successEl) successEl.classList.add('is-visible');
}

/**
 * Initialise contact form module.
 */
export function initForm() {
  /** @type {HTMLFormElement} */
  const form = qs('#contact-form');
  if (!form) return;

  // Real-time validation on blur and input
  for (const id of Object.keys(RULES)) {
    const field = qs(`#${id}`, form);
    if (!field) continue;

    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      // Only clear error once user starts correcting — don't flag on every keystroke
      if (field.classList.contains('is-error')) validateField(field);
    });
  }

  // Set min date on date input to today
  const dateInput = qs('#form-date', form);
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = validateForm(form);
    if (!isValid) {
      // Focus first error field
      const firstError = qs('.form-input.is-error, .form-textarea.is-error, .form-select.is-error', form);
      if (firstError) firstError.focus();
      return;
    }

    // Simulate async submission
    const submitBtn = qs('[type="submit"]', form);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    setTimeout(() => {
      showSuccess(form);
    }, 1200);
  });
}
