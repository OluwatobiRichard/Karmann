/* script.js
 - Mobile nav toggle (created if missing)
 - Contact form validation + fake submit
 - Smooth scroll for internal anchor links
 - Resize handling to restore nav layout
*/

document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  initFormHandler();
  initSmoothLinks();
  window.addEventListener('resize', handleResize);
});

function initNavToggle() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const leftList = nav.querySelector('.first');
  const rightList = nav.querySelector('.second');

  // Create toggle button if not present
  let toggle = document.getElementById('nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.id = 'nav-toggle';
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Toggle navigation menu');
    toggle.innerHTML = '☰ Menu';
    // Basic inline styles so it's visible without extra CSS
    toggle.style.cursor = 'pointer';
    toggle.style.border = 'none';
    toggle.style.background = 'transparent';
    toggle.style.fontSize = '18px';
    toggle.style.padding = '8px 12px';
    toggle.style.color = '#302a18';
    // Put the toggle at the start of nav for mobile ordering
    nav.insertBefore(toggle, nav.firstChild);
  }

  function setListsDisplay(show) {
    const displayValue = show ? 'flex' : 'none';
    if (leftList) leftList.style.display = displayValue;
    if (rightList) rightList.style.display = displayValue;
  }

  // Toggle click
  toggle.addEventListener('click', function () {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    const show = !expanded;
    setListsDisplay(show);
  });

  // Initialize display depending on window size
  handleResize(); // sets appropriate visibility initially

  // When nav contains a brand/logo centered, ensure lists are flex when desktop
  function handleResize() {
    const w = window.innerWidth;
    const breakpoint = 900; // match CSS logic for mobile/tablet
    if (w <= breakpoint) {
      // collapse by default on small screens
      toggle.style.display = ''; // visible (default inline-block)
      toggle.setAttribute('aria-expanded', 'false');
      setListsDisplay(false);
      // make lists column for mobile if not already in CSS
      if (leftList) leftList.style.flexDirection = 'column';
      if (rightList) rightList.style.flexDirection = 'column';
    } else {
      // show lists on larger screens and hide the toggle
      toggle.style.display = 'none';
      if (leftList) leftList.style.display = '';
      if (rightList) rightList.style.display = '';
      // restore direction
      if (leftList) leftList.style.flexDirection = '';
      if (rightList) rightList.style.flexDirection = '';
    }
  }

  // Keep a reference so outer resize listener can call it
  toggle._handleResize = handleResize;
}

function handleResize() {
  // run nav toggle internal handler if exists
  const toggle = document.getElementById('nav-toggle');
  if (toggle && typeof toggle._handleResize === 'function') {
    toggle._handleResize();
  }
}

/* CONTACT FORM HANDLER */
function initFormHandler() {
  const form = document.querySelector('form');
  if (!form) return;

  // Create a simple message container (success/error)
  let msgContainer = document.querySelector('.form-message');
  if (!msgContainer) {
    msgContainer = document.createElement('div');
    msgContainer.className = 'form-message';
    msgContainer.setAttribute('aria-live', 'polite');
    msgContainer.style.marginTop = '12px';
    form.parentNode.insertBefore(msgContainer, form.nextSibling);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors(form);
    msgContainer.textContent = '';

    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const message = form.querySelector('[name="message"]');

    const errors = [];
    if (!name || !name.value.trim()) errors.push({ el: name, msg: 'Please enter your name.' });
    if (!email || !validateEmail(email.value)) errors.push({ el: email, msg: 'Please enter a valid email.' });
    if (!phone || !phone.value.trim()) errors.push({ el: phone, msg: 'Please enter a phone number.' });
    if (!message || !message.value.trim()) errors.push({ el: message, msg: 'Please enter a message.' });

    if (errors.length) {
      showErrors(errors);
      msgContainer.textContent = 'Please correct the fields above and try again.';
      msgContainer.style.color = '#a00';
      return;
    }

    // Simulate submit: replace with fetch() to server endpoint if you have one
    msgContainer.textContent = 'Sending...';
    msgContainer.style.color = '#333';
    // Example simulated network call
    setTimeout(function () {
      // On success
      msgContainer.textContent = 'Thanks — your message has been sent!';
      msgContainer.style.color = '#0a7';
      form.reset();
    }, 800);
  });

  // show inline error messages
  function showErrors(list) {
    for (const item of list) {
      if (!item.el) continue;
      item.el.classList.add('input-error');
      const err = document.createElement('div');
      err.className = 'field-error';
      err.textContent = item.msg;
      err.style.color = '#a00';
      err.style.fontSize = '13px';
      err.style.marginTop = '6px';
      // place after the field (or inside input-group)
      const parent = item.el.parentNode;
      if (parent) {
        parent.appendChild(err);
      }
    }
  }

  function clearErrors(formEl) {
    const errs = formEl.querySelectorAll('.field-error');
    errs.forEach(n => n.remove());
    const inputs = formEl.querySelectorAll('.input-error');
    inputs.forEach(i => i.classList.remove('input-error'));
  }

  function validateEmail(email) {
    if (!email) return false;
    // basic email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
}

/* SMOOTH SCROLL FOR INTERNAL LINKS */
function initSmoothLinks() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(a => {
    // only handle if it references an actual id or is '#'
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (href === '#' || href === '') {
        // prevent page jump on placeholder links
        e.preventDefault();
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}