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
  let toggleBtn = document.getElementById('mobile-menu-btn');
  let drawer = document.getElementById('mobile-nav-drawer');
  let overlay = document.getElementById('mobile-nav-overlay');

  // If page lacks mobile menu toggle button in header, add it
  const headerActions = document.querySelector('.header-actions');
  if (!toggleBtn && headerActions) {
    toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'mobile-toggle-btn';
    toggleBtn.id = 'mobile-menu-btn';
    toggleBtn.setAttribute('aria-label', 'Open Navigation Menu');
    toggleBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    `;
    headerActions.appendChild(toggleBtn);
  }

  // If page lacks mobile drawer markup, inject standard bakehouse drawer
  if (!drawer) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mobile-nav-overlay';
      overlay.className = 'mobile-nav-overlay';
      document.body.appendChild(overlay);
    }

    drawer = document.createElement('aside');
    drawer.id = 'mobile-nav-drawer';
    drawer.className = 'mobile-nav-drawer';
    drawer.setAttribute('aria-label', 'Mobile Navigation');

    const path = window.location.pathname;
    const isHome = path === '/' || path.endsWith('index.html') || path.endsWith('/');
    const isShop = path.includes('shop.html');
    const isAbout = path.includes('about.html');
    const isContact = path.includes('contact.html');
    const isCart = path.includes('cart.html');
    const isWishlist = path.includes('wishlist.html');
    const isAccount = path.includes('account.html');

    drawer.innerHTML = `
      <div class="mobile-drawer-header">
        <div class="brand-logo">
          <span class="logo-symbol">🧁</span>
          <span class="logo-title" style="font-size: 1.25rem;">Sweet Crumbs</span>
        </div>
        <button type="button" class="mobile-drawer-close" id="mobile-nav-close" aria-label="Close menu">&times;</button>
      </div>
      
      <div class="mobile-drawer-nav">
        <a href="index.html" class="nav-link ${isHome ? 'active' : ''}">Home</a>
        <a href="shop.html" class="nav-link ${isShop ? 'active' : ''}">Shop All Cakes</a>
        <a href="cart.html" class="nav-link ${isCart ? 'active' : ''}">My Basket (<span class="cart-count-badge" style="display:inline;">0</span>)</a>
        <a href="wishlist.html" class="nav-link ${isWishlist ? 'active' : ''}">My Wishlist</a>
        <a href="account.html" class="nav-link ${isAccount ? 'active' : ''}">My Account & Orders</a>
        
        <div class="mobile-drawer-categories-title">Popular Categories</div>
        <div class="mobile-categories-list">
          <a href="shop.html?category=birthday-cakes">🎂 Birthday Cakes</a>
          <a href="shop.html?category=chocolate-cakes">🍫 Chocolate Truffles</a>
          <a href="shop.html?category=fruit-cakes">🍓 Fresh Fruit Cakes</a>
          <a href="shop.html?category=red-velvet">❤️ Red Velvet Cakes</a>
          <a href="shop.html?category=designer-cakes">🎨 Designer Cakes</a>
          <a href="shop.html?category=pastries">🥐 Gourmet Pastries</a>
        </div>

        <a href="about.html" class="nav-link ${isAbout ? 'active' : ''}" style="margin-top: 8px;">About Bakehouse</a>
        <a href="contact.html" class="nav-link ${isContact ? 'active' : ''}">Contact & Support</a>
        <a href="faq.html" class="nav-link">FAQs & Tracking</a>
      </div>

      <div class="mobile-drawer-footer">
        <a href="shop.html" class="btn btn-primary btn-block">Order Fresh Cakes</a>
        <div class="mobile-drawer-phone">📞 Bakehouse hotline: +91 98765 43210</div>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  const closeBtn = document.getElementById('mobile-nav-close');

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

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// Mobile Bottom Navigation Bar (Persistent app-like quick navigation)
function initMobileBottomNav() {
  if (document.querySelector('.mobile-bottom-bar')) return;

  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-bar';
  nav.setAttribute('aria-label', 'Mobile Quick Navigation');

  const path = window.location.pathname;
  const isHome = path === '/' || path.endsWith('index.html') || path.endsWith('/');
  const isShop = path.includes('shop.html');
  const isWishlist = path.includes('wishlist.html');
  const isCart = path.includes('cart.html');
  const isAccount = path.includes('account.html');

  nav.innerHTML = `
    <a href="index.html" class="bottom-nav-link ${isHome ? 'active' : ''}">
      <span class="bottom-nav-icon">🏠</span>
      <span>Home</span>
    </a>
    <a href="shop.html" class="bottom-nav-link ${isShop ? 'active' : ''}">
      <span class="bottom-nav-icon">🎂</span>
      <span>Shop</span>
    </a>
    <a href="wishlist.html" class="bottom-nav-link ${isWishlist ? 'active' : ''}">
      <span class="bottom-nav-icon">
        💖
        <span class="bottom-nav-badge wishlist-count-badge" style="display:none;">0</span>
      </span>
      <span>Wishlist</span>
    </a>
    <a href="cart.html" class="bottom-nav-link ${isCart ? 'active' : ''}">
      <span class="bottom-nav-icon">
        🛒
        <span class="bottom-nav-badge cart-count-badge" style="display:none;">0</span>
      </span>
      <span>Cart</span>
    </a>
    <a href="account.html" class="bottom-nav-link ${isAccount ? 'active' : ''}">
      <span class="bottom-nav-icon">👤</span>
      <span>Account</span>
    </a>
  `;

  document.body.appendChild(nav);

  // Sync badges with current counts
  if (typeof updateCartBadge === 'function') updateCartBadge();
  if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
}

// Mobile Filter Drawer Toggle for Catalog (shop.html)
function toggleMobileFilterModal(forceState) {
  const sidebar = document.getElementById('filter-sidebar');
  if (!sidebar) return;

  let overlay = document.getElementById('mobile-filter-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'mobile-filter-overlay';
    overlay.className = 'mobile-filter-overlay';
    overlay.addEventListener('click', () => toggleMobileFilterModal(false));
    document.body.appendChild(overlay);
  }

  const shouldOpen = forceState !== undefined ? forceState : !sidebar.classList.contains('open');
  if (shouldOpen) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
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
  window.initMobileBottomNav = initMobileBottomNav;
  window.toggleMobileFilterModal = toggleMobileFilterModal;
  window.initCountdownTimer = initCountdownTimer;
  window.initTestimonialsCarousel = initTestimonialsCarousel;
  window.initCustomCakeCalculator = initCustomCakeCalculator;
  window.initNewsletter = initNewsletter;
}

// Page Ready
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initMobileBottomNav();
  initCountdownTimer();
  initTestimonialsCarousel();
  initCustomCakeCalculator();
  initNewsletter();
  initContactForm();
  initFaqAccordion();
});
