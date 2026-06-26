/* ============================================================
   STOMATOLOGIJA LUMA — main.js
   Vanilla JS, no dependencies
   ============================================================ */

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. FOOTER YEAR ───────────────────────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── 2. HEADER SCROLL SHADOW ─────────────────────────────── */
const siteHeader = document.getElementById('site-header');

function onHeaderScroll() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 10);
}

window.addEventListener('scroll', onHeaderScroll, { passive: true });
onHeaderScroll();

/* ── 3. HAMBURGER / MOBILE NAV ───────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');

function closeNav() {
  hamburger.setAttribute('aria-expanded', 'false');
  mainNav.classList.remove('open');
  hamburger.setAttribute('aria-label', 'Open menu');
}

function openNav() {
  hamburger.setAttribute('aria-expanded', 'true');
  mainNav.classList.add('open');
  hamburger.setAttribute('aria-label', 'Close menu');
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  isOpen ? closeNav() : openNav();
});

/* Close nav when a link is clicked */
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

/* Close nav on outside click */
document.addEventListener('click', (e) => {
  if (!siteHeader.contains(e.target)) closeNav();
});

/* Close nav on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

/* ── 4. SCROLL REVEAL ─────────────────────────────────────── */
if (!prefersReducedMotion) {
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      /* Stagger siblings in the same parent */
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const staggerIndex = siblings.indexOf(entry.target);
      const delay = Math.min(staggerIndex * 80, 320);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  /* Reduced motion — show everything immediately */
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

/* ── 5. STATS COUNTER ─────────────────────────────────────── */
const statItems = document.querySelectorAll('.stat-item');

function animateCounter(el, target, duration) {
  const numEl  = el.querySelector('.stat-number');
  const start  = performance.now();

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOutQuart(progress) * target);
    numEl.textContent = value.toLocaleString('sr-RS');
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const dur    = prefersReducedMotion ? 0 : 1800;
    animateCounter(el, target, dur);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statItems.forEach(el => counterObserver.observe(el));

/* ── 6. FAQ ACCORDION ─────────────────────────────────────── */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const trigger = item.querySelector('.faq-trigger');
  const answer  = item.querySelector('dd');

  /* Initial state */
  answer.style.maxHeight = '0px';
  answer.removeAttribute('hidden');

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    /* Close all others */
    faqItems.forEach(other => {
      if (other === item) return;
      const otherTrigger = other.querySelector('.faq-trigger');
      const otherAnswer  = other.querySelector('dd');
      otherTrigger.setAttribute('aria-expanded', 'false');
      otherAnswer.style.maxHeight = '0px';
    });
    /* Toggle this one */
    if (isOpen) {
      trigger.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = '0px';
    } else {
      trigger.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });

  /* Keyboard: Space and Enter already fire click on buttons.
     Arrow keys for roving focus between triggers. */
  trigger.addEventListener('keydown', (e) => {
    const triggers = Array.from(document.querySelectorAll('.faq-trigger'));
    const idx      = triggers.indexOf(trigger);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      triggers[(idx + 1) % triggers.length].focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      triggers[(idx - 1 + triggers.length) % triggers.length].focus();
    }
    if (e.key === 'Home') { e.preventDefault(); triggers[0].focus(); }
    if (e.key === 'End')  { e.preventDefault(); triggers[triggers.length - 1].focus(); }
  });
});

/* ── 7. FORM VALIDATION ───────────────────────────────────── */
const forma    = document.getElementById('zakazivanje-forma');
const uspeh    = document.getElementById('forma-uspeh');
const formaWrap = document.querySelector('.forma-wrap');

/* Set min date to today */
const datumInput = document.getElementById('f-datum');
if (datumInput) {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  datumInput.min = `${yyyy}-${mm}-${dd}`;
}

const VALIDATORS = {
  'f-ime': {
    validate: v => v.trim().length >= 2,
    message: 'Please enter your full name (min. 2 characters).',
  },
  'f-telefon': {
    validate: v => /^[\d\s\+\-\(\)]{7,20}$/.test(v.trim()),
    message: 'Please enter a valid phone number.',
  },
  'f-email': {
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: 'Please enter a valid email address.',
  },
  'f-usluga': {
    validate: v => v !== '',
    message: 'Please select a service.',
  },
  'f-datum': {
    validate: v => {
      if (!v) return false;
      const selected = new Date(v);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    },
    message: 'Please select a date that is not in the past.',
  },
};

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + '-err');
  if (!field || !errEl) return;
  field.classList.add('invalid');
  field.setAttribute('aria-invalid', 'true');
  errEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + '-err');
  if (!field || !errEl) return;
  field.classList.remove('invalid');
  field.removeAttribute('aria-invalid');
  errEl.textContent = '';
}

function validateField(fieldId) {
  const config = VALIDATORS[fieldId];
  if (!config) return true;
  const field = document.getElementById(fieldId);
  if (!field) return true;
  const isValid = config.validate(field.value);
  if (isValid) {
    clearError(fieldId);
  } else {
    showError(fieldId, config.message);
  }
  return isValid;
}

/* Blur: validate on leave */
Object.keys(VALIDATORS).forEach(id => {
  const field = document.getElementById(id);
  if (!field) return;
  field.addEventListener('blur', () => validateField(id));
  /* Re-validate while typing after first error */
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) validateField(id);
  });
  field.addEventListener('change', () => {
    if (field.classList.contains('invalid')) validateField(id);
  });
});

/* Submit */
if (forma) {
  forma.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    let firstInvalidId = null;

    Object.keys(VALIDATORS).forEach(id => {
      const valid = validateField(id);
      if (!valid && !firstInvalidId) firstInvalidId = id;
      if (!valid) allValid = false;
    });

    if (!allValid) {
      const firstField = document.getElementById(firstInvalidId);
      if (firstField) firstField.focus();
      return;
    }

    /* Success */
    forma.hidden = true;
    uspeh.hidden = false;
    formaWrap.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });

    /* Reset after 6s so user can submit again if needed */
    setTimeout(() => {
      forma.reset();
      Object.keys(VALIDATORS).forEach(id => clearError(id));
      forma.hidden = false;
      uspeh.hidden = true;
    }, 6000);
  });
}
