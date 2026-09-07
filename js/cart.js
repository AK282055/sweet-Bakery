/**
 * Sweet Crumbs - Cart Engine (Vanilla JS + LocalStorage)
 * Modular architecture ready for PHP / REST API synchronization.
 * 
 * Future PHP API Endpoints:
 * - GET    /backend/cart.php
 * - POST   /backend/cart.php (add/update)
 * - DELETE /backend/cart.php?id=X
 */

const CART_STORAGE_KEY = 'sweet_crumbs_cart';
const COUPON_STORAGE_KEY = 'sweet_crumbs_applied_coupon';

// Available Demo Coupons (Configurable later via MySQL `coupons` table)
const AVAILABLE_COUPONS = {
  'WELCOME10': { type: 'percent', value: 10, minOrder: 300, description: '10% OFF on your entire order' },
  'CAKE50': { type: 'flat', value: 50, minOrder: 400, description: 'Flat ₹50 OFF on orders above ₹400' },
  'FIRSTORDER': { type: 'percent', value: 15, minOrder: 500, description: '15% OFF for our special first-time celebration' }
};

// Retrieve current cart from localStorage
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse cart data", e);
    return [];
  }
}

// Persist cart to localStorage & refresh badges
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
  } catch (e) {
    console.error("Failed to save cart", e);
  }
}

// Generate unique item identifier based on product options
function generateItemKey(productId, weight, eggless, cakeMessage) {
  const sanitizedMsg = (cakeMessage || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${productId}_${weight || 'default'}_${eggless ? 'eggless' : 'regular'}_${sanitizedMsg}`;
}

// Add an item to the shopping cart
function addToCart(productId, weight, quantity = 1, eggless = true, cakeMessage = '') {
  const product = typeof getProductById === 'function' ? getProductById(productId) : null;
  if (!product) {
    console.error("Product not found:", productId);
    return false;
  }

  // Calculate price based on selected weight
  let unitPrice = product.price;
  if (product.weights && weight && product.weights[weight]) {
    unitPrice = product.weights[weight];
  }

  const cart = getCart();
  const itemKey = generateItemKey(productId, weight, eggless, cakeMessage);
  const existingIndex = cart.findIndex(item => item.itemKey === itemKey);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += parseInt(quantity, 10);
    cart[existingIndex].subtotal = cart[existingIndex].quantity * cart[existingIndex].price;
  } else {
    cart.push({
      itemKey: itemKey,
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      category: product.category,
      weight: weight || Object.keys(product.weights || {})[0] || 'Standard',
      price: unitPrice,
      quantity: parseInt(quantity, 10),
      eggless: Boolean(eggless),
      cakeMessage: cakeMessage ? cakeMessage.trim() : '',
      subtotal: unitPrice * parseInt(quantity, 10)
    });
  }

  saveCart(cart);
  if (typeof showToast === 'function') {
    showToast(`Added "${product.name}" to your cart!`, 'success');
  }
  return true;
}

// Remove item from cart
function removeFromCart(itemKey) {
  let cart = getCart();
  const itemToRemove = cart.find(item => item.itemKey === itemKey);
  cart = cart.filter(item => item.itemKey !== itemKey);
  saveCart(cart);

  if (itemToRemove && typeof showToast === 'function') {
    showToast(`Removed "${itemToRemove.name}" from cart.`, 'info');
  }

  // Re-render if on cart page
  if (document.getElementById('cart-items-container')) {
    renderCartPage();
  }
}

// Update quantity of an item
function updateCartQuantity(itemKey, changeOrNewVal, isDirectValue = false) {
  const cart = getCart();
  const item = cart.find(i => i.itemKey === itemKey);
  if (!item) return;

  if (isDirectValue) {
    item.quantity = Math.max(1, parseInt(changeOrNewVal, 10) || 1);
  } else {
    item.quantity += changeOrNewVal;
  }

  if (item.quantity <= 0) {
    removeFromCart(itemKey);
    return;
  }

  item.subtotal = item.price * item.quantity;
  saveCart(cart);

  if (document.getElementById('cart-items-container')) {
    renderCartPage();
  }
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(COUPON_STORAGE_KEY);
  updateCartBadge();
  if (document.getElementById('cart-items-container')) {
    renderCartPage();
  }
}

// Active Coupon Helpers
function getActiveCoupon() {
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function applyCoupon(code) {
  if (!code) return { success: false, message: 'Please enter a coupon code.' };
  const cleanCode = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[cleanCode];

  if (!coupon) {
    return { success: false, message: 'Invalid coupon code. Try WELCOME10, CAKE50 or FIRSTORDER' };
  }

  const totals = calculateCartTotals();
  if (totals.subtotal < coupon.minOrder) {
    return { 
      success: false, 
      message: `Coupon "${cleanCode}" requires a minimum order of ₹${coupon.minOrder}.` 
    };
  }

  const couponData = {
    code: cleanCode,
    type: coupon.type,
    value: coupon.value,
    description: coupon.description
  };

  localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(couponData));
  if (typeof showToast === 'function') {
    showToast(`Coupon "${cleanCode}" applied successfully!`, 'success');
  }

  if (document.getElementById('cart-items-container')) {
    renderCartPage();
  }
  return { success: true, message: `Coupon applied: ${coupon.description}`, data: couponData };
}

function removeCoupon() {
  localStorage.removeItem(COUPON_STORAGE_KEY);
  if (typeof showToast === 'function') {
    showToast('Coupon removed.', 'info');
  }
  if (document.getElementById('cart-items-container')) {
    renderCartPage();
  }
}

// Comprehensive Cart Totals Calculation
function calculateCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Automatic Bakery Store Discount (e.g. Orders above ₹1000 get 5% automatically)
  let standardDiscount = 0;
  if (subtotal >= 1000) {
    standardDiscount = Math.round(subtotal * 0.05);
  }

  // Coupon Discount
  const activeCoupon = getActiveCoupon();
  let couponDiscount = 0;
  if (activeCoupon) {
    if (activeCoupon.type === 'percent') {
      couponDiscount = Math.round((subtotal * activeCoupon.value) / 100);
    } else if (activeCoupon.type === 'flat') {
      couponDiscount = Math.min(activeCoupon.value, subtotal);
    }
  }

  // Delivery Charges (Free delivery on orders >= ₹799)
  const deliveryFee = subtotal === 0 ? 0 : (subtotal >= 799 ? 0 : 60);

  // GST / Tax (5% for fresh bakery confectionery)
  const taxableBase = Math.max(0, subtotal - standardDiscount - couponDiscount);
  const tax = Math.round(taxableBase * 0.05);

  const grandTotal = Math.max(0, taxableBase + deliveryFee + tax);

  return {
    itemCount: cart.reduce((acc, item) => acc + item.quantity, 0),
    subtotal,
    standardDiscount,
    couponDiscount,
    totalDiscount: standardDiscount + couponDiscount,
    deliveryFee,
    tax,
    grandTotal,
    activeCoupon
  };
}

// Update Navbar Cart Count Badge
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count-badge');
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

// Render the Cart Page DOM if on cart.html
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty-state');
  const summaryBox = document.getElementById('cart-summary-box');
  if (!container) return;

  const cart = getCart();
  const totals = calculateCartTotals();

  if (cart.length === 0) {
    if (container) container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (summaryBox) summaryBox.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (summaryBox) summaryBox.style.display = 'block';

  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item-card" data-key="${item.itemKey}">
        <div class="cart-item-img-wrap">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy" />
          <span class="diet-badge ${item.eggless ? 'diet-eggless' : 'diet-egg'}">
            <span class="dot"></span>
          </span>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-header">
            <h3 class="cart-item-title">
              <a href="product.html?id=${item.id}">${item.name}</a>
            </h3>
            <button type="button" class="cart-remove-btn" onclick="removeFromCart('${item.itemKey}')" title="Remove item" aria-label="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
              </svg>
            </button>
          </div>
          <div class="cart-item-meta">
            <span class="meta-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Weight: <strong>${item.weight}</strong></span>
            <span class="meta-pill">${item.eggless ? '100% Eggless' : 'Contains Egg'}</span>
          </div>
          ${item.cakeMessage ? `
            <div class="cart-item-msg">
              <span class="msg-label">Message on Cake:</span>
              <span class="msg-text">"${item.cakeMessage}"</span>
            </div>
          ` : ''}
          <div class="cart-item-bottom">
            <div class="qty-stepper">
              <button type="button" class="qty-btn" onclick="updateCartQuantity('${item.itemKey}', -1)" aria-label="Decrease quantity">-</button>
              <input type="number" class="qty-input" value="${item.quantity}" min="1" max="20" onchange="updateCartQuantity('${item.itemKey}', this.value, true)" aria-label="Quantity" />
              <button type="button" class="qty-btn" onclick="updateCartQuantity('${item.itemKey}', 1)" aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-item-pricing">
              <span class="unit-price">₹${item.price} each</span>
              <span class="item-subtotal">₹${item.subtotal}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Update Summary values
  const subtotalEl = document.getElementById('summary-subtotal');
  const discountEl = document.getElementById('summary-discount');
  const couponDiscountEl = document.getElementById('summary-coupon-discount');
  const couponRow = document.getElementById('summary-coupon-row');
  const deliveryEl = document.getElementById('summary-delivery');
  const taxEl = document.getElementById('summary-tax');
  const grandTotalEl = document.getElementById('summary-grand-total');
  const appliedCouponContainer = document.getElementById('applied-coupon-display');

  if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;
  if (discountEl) discountEl.textContent = `-₹${totals.standardDiscount.toLocaleString('en-IN')}`;
  
  if (couponRow && couponDiscountEl) {
    if (totals.couponDiscount > 0) {
      couponRow.style.display = 'flex';
      couponDiscountEl.textContent = `-₹${totals.couponDiscount.toLocaleString('en-IN')}`;
    } else {
      couponRow.style.display = 'none';
    }
  }

  if (deliveryEl) {
    deliveryEl.innerHTML = totals.deliveryFee === 0 
      ? '<span class="free-text">FREE</span>' 
      : `₹${totals.deliveryFee}`;
  }

  if (taxEl) taxEl.textContent = `₹${totals.tax.toLocaleString('en-IN')}`;
  if (grandTotalEl) grandTotalEl.textContent = `₹${totals.grandTotal.toLocaleString('en-IN')}`;

  if (appliedCouponContainer) {
    if (totals.activeCoupon) {
      appliedCouponContainer.innerHTML = `
        <div class="applied-coupon-tag">
          <span class="coupon-code">🏷️ ${totals.activeCoupon.code}</span>
          <span class="coupon-desc">${totals.activeCoupon.description}</span>
          <button type="button" class="remove-coupon-btn" onclick="removeCoupon()" aria-label="Remove coupon">×</button>
        </div>
      `;
    } else {
      appliedCouponContainer.innerHTML = '';
    }
  }
}

// Expose globally
if (typeof window !== 'undefined') {
  window.getCart = getCart;
  window.saveCart = saveCart;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateCartQuantity = updateCartQuantity;
  window.clearCart = clearCart;
  window.calculateCartTotals = calculateCartTotals;
  window.applyCoupon = applyCoupon;
  window.removeCoupon = removeCoupon;
  window.getActiveCoupon = getActiveCoupon;
  window.updateCartBadge = updateCartBadge;
  window.renderCartPage = renderCartPage;
}

// Auto update badge on load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});
