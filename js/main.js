/**
 * Sweet Crumbs - Main Application Script
 * Global behaviors: Sticky Header, Mobile Navigation, Toast Notifications,
 * Promotional Countdown, Testimonials Slider, Custom Cake Calculator, and Newsletter.
 */

// Toast Notifications System
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-notification-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-notification-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-pill toast-${type} animate-slide-in`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'warning') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-msg">${message}</span>
    <button type="button" class="toast-close" onclick="this.parentElement.remove()" aria-label="Dismiss">×</button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 400);
  }, 3500);
}

// Sticky Header on Scroll
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }, { passive: true });
}

// Mobile Hamburger Navigation Drawer
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');
  const closeBtn = document.getElementById('mobile-nav-close');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Close drawer on link navigation
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// Promotional Offer Countdown Timer
function initCountdownTimer() {
  const timerContainer = document.getElementById('promo-countdown');
  if (!timerContainer) return;

  // Set target 24 hours from session start if not in storage
  let targetTime = localStorage.getItem('sweet_crumbs_countdown_target');
  if (!targetTime || parseInt(targetTime, 10) < Date.now()) {
    targetTime = Date.now() + (14 * 60 * 60 * 1000) + (35 * 60 * 1000); // 14 hours 35 mins
    localStorage.setItem('sweet_crumbs_countdown_target', targetTime);
  }

  function updateClock() {
    const remaining = parseInt(targetTime, 10) - Date.now();
    if (remaining <= 0) {
      timerContainer.innerHTML = `<span class="timer-expired">Offer refreshed daily!</span>`;
      return;
    }

    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    const pad = (n) => n < 10 ? '0' + n : n;

    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-minutes');
    const secsEl = document.getElementById('timer-seconds');

    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(minutes);
    if (secsEl) secsEl.textContent = pad(seconds);
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// Testimonials Carousel (Pure Vanilla JS)
let currentTestimonial = 0;
function initTestimonialsCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonial-prev-btn');
  const nextBtn = document.getElementById('testimonial-next-btn');
  const dotsContainer = document.getElementById('testimonial-dots');

  if (slides.length === 0) return;

  if (dotsContainer) {
    dotsContainer.innerHTML = Array.from(slides).map((_, i) => `
      <button type="button" class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="goToTestimonial(${i})" aria-label="Go to review ${i + 1}"></button>
    `).join('');
  }

  function showSlide(index) {
    currentTestimonial = (index + slides.length) % slides.length;
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === currentTestimonial);
    });

    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentTestimonial);
      });
    }
  }

  window.goToTestimonial = showSlide;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentTestimonial - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentTestimonial + 1));
  }

  // Auto advance every 6 seconds
  setInterval(() => {
    showSlide(currentTestimonial + 1);
  }, 6000);
}

// Interactive Custom Cake Price Calculator
function initCustomCakeCalculator() {
  const form = document.getElementById('custom-cake-builder-form');
  if (!form) return;

  const flavorSelect = document.getElementById('custom-flavor');
  const weightSelect = document.getElementById('custom-weight');
  const shapeSelect = document.getElementById('custom-shape');
  const creamSelect = document.getElementById('custom-cream');
  const egglessCheck = document.getElementById('custom-eggless');
  const priceDisplay = document.getElementById('custom-estimated-price');

  // Base pricing matrix
  const flavorBase = {
    'chocolate': 600,
    'red_velvet': 650,
    'vanilla': 500,
    'black_forest': 550,
    'butterscotch': 550,
    'fruit': 600,
    'coffee': 650
  };

  const weightMultiplier = {
    '0.5': 0.7,
    '1.0': 1.0,
    '1.5': 1.45,
    '2.0': 1.85,
    '3.0': 2.7,
    '5.0': 4.2
  };

  const shapeAddons = {
    'round': 0,
    'heart': 80,
    'square': 60,
    'tier': 250,
    'number': 150
  };

  const creamAddons = {
    'whipped': 0,
    'buttercream': 50,
    'ganache': 100,
    'fondant': 200,
    'cream_cheese': 120
  };

  function calculateCustomPrice() {
    const f = flavorSelect ? flavorSelect.value : 'chocolate';
    const w = weightSelect ? weightSelect.value : '1.0';
    const s = shapeSelect ? shapeSelect.value : 'round';
    const c = creamSelect ? creamSelect.value : 'whipped';

    const base = flavorBase[f] || 600;
    const mult = weightMultiplier[w] || 1.0;
    const shapeFee = shapeAddons[s] || 0;
    const creamFee = creamAddons[c] || 0;

    const estimated = Math.round((base * mult) + shapeFee + creamFee);

    if (priceDisplay) {
      priceDisplay.textContent = `₹${estimated.toLocaleString('en-IN')}`;
    }
    return estimated;
  }

  // Bind change listeners
  [flavorSelect, weightSelect, shapeSelect, creamSelect, egglessCheck].forEach(el => {
    if (el) el.addEventListener('change', calculateCustomPrice);
  });

  // Calculate once on initialization
  calculateCustomPrice();

  // Submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const finalPrice = calculateCustomPrice();
    const customCakeItem = {
      id: 999, // Special custom cake ID
      name: `Custom Cake: ${flavorSelect.options[flavorSelect.selectedIndex].text}`,
      price: finalPrice,
      weight: `${weightSelect.value} Kg`,
      eggless: egglessCheck ? egglessCheck.checked : true,
      cakeMessage: (document.getElementById('custom-message') || {}).value || 'Custom Celebration',
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80",
      itemKey: `custom_${Date.now()}`
    };

    if (typeof addToCart === 'function') {
      const cart = getCart();
      cart.push({
        ...customCakeItem,
        quantity: 1,
        subtotal: finalPrice
      });
      saveCart(cart);
      showToast('Your bespoke custom cake was added to cart!', 'success');
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 700);
    }
  });
}

// Newsletter Subscription
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value.includes('@')) {
        showToast('Please enter a valid email address.', 'warning');
        return;
      }

      const email = emailInput.value.trim();
      const existing = JSON.parse(localStorage.getItem('sweet_crumbs_newsletter') || '[]');
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem('sweet_crumbs_newsletter', JSON.stringify(existing));
      }

      emailInput.value = '';
      showToast('Thank you for subscribing! Enjoy 10% OFF with coupon WELCOME10', 'success');
    });
  });
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contact-us-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('contact-name') || {}).value;
    showToast(`Thank you ${name || 'friend'}! We received your message and will respond shortly.`, 'success');
    form.reset();
  });
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

// Global Exports
if (typeof window !== 'undefined') {
  window.showToast = showToast;
  window.initStickyHeader = initStickyHeader;
  window.initMobileNav = initMobileNav;
  window.initCountdownTimer = initCountdownTimer;
  window.initTestimonialsCarousel = initTestimonialsCarousel;
  window.initCustomCakeCalculator = initCustomCakeCalculator;
  window.initNewsletter = initNewsletter;
}

// Page Ready
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initCountdownTimer();
  initTestimonialsCarousel();
  initCustomCakeCalculator();
  initNewsletter();
  initContactForm();
  initFaqAccordion();
});
