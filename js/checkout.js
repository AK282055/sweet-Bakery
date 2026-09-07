/**
 * Sweet Crumbs - 5-Step Checkout Controller
 * Guides customers through Contact -> Address -> Slot -> Review -> Payment.
 */

let currentCheckoutStep = 1;
let checkoutFormData = {
  customer: {},
  delivery: {},
  paymentMethod: 'upi'
};

function initCheckoutPage() {
  const cart = typeof getCart === 'function' ? getCart() : [];
  if (cart.length === 0) {
    const mainWrap = document.getElementById('checkout-main-container');
    if (mainWrap) {
      mainWrap.innerHTML = `
        <div class="empty-cart-checkout">
          <div class="empty-icon">🍰</div>
          <h2>Your Cart is Empty</h2>
          <p>Please add some delicious cakes to your cart before proceeding to checkout.</p>
          <a href="shop.html" class="btn btn-primary" style="margin-top: 18px;">Browse Fresh Cakes</a>
        </div>
      `;
    }
    return;
  }

  // Pre-fill user data if available
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (user) {
    const nameInput = document.getElementById('cust-name');
    const emailInput = document.getElementById('cust-email');
    const phoneInput = document.getElementById('cust-phone');
    if (nameInput && user.name) nameInput.value = user.name;
    if (emailInput && user.email) emailInput.value = user.email;
    if (phoneInput && user.phone) phoneInput.value = user.phone;

    // Pre-fill primary address if available
    if (user.addresses && user.addresses.length > 0) {
      const addr = user.addresses[0];
      const houseInput = document.getElementById('addr-house');
      const streetInput = document.getElementById('addr-street');
      const areaInput = document.getElementById('addr-area');
      const cityInput = document.getElementById('addr-city');
      const stateInput = document.getElementById('addr-state');
      const pinInput = document.getElementById('addr-pincode');

      if (houseInput) houseInput.value = addr.house || '';
      if (streetInput) streetInput.value = addr.street || '';
      if (areaInput) areaInput.value = addr.area || '';
      if (cityInput) cityInput.value = addr.city || '';
      if (stateInput) stateInput.value = addr.state || '';
      if (pinInput) pinInput.value = addr.pincode || '';
    }
  }

  // Set minimum delivery date to today
  const deliveryDateInput = document.getElementById('del-date');
  if (deliveryDateInput) {
    const today = new Date().toISOString().split('T')[0];
    deliveryDateInput.min = today;
    deliveryDateInput.value = today;
  }

  renderCheckoutSummary();
  updateStepVisibility(1);
}

function updateStepVisibility(stepNumber) {
  currentCheckoutStep = stepNumber;

  // Update step navigation indicators
  document.querySelectorAll('.step-indicator-item').forEach((item, index) => {
    const stepIdx = index + 1;
    item.classList.remove('active', 'completed');
    if (stepIdx === stepNumber) {
      item.classList.add('active');
    } else if (stepIdx < stepNumber) {
      item.classList.add('completed');
    }
  });

  // Show only active step panel
  document.querySelectorAll('.checkout-step-panel').forEach(panel => {
    panel.style.display = 'none';
  });

  const activePanel = document.getElementById(`checkout-step-${stepNumber}`);
  if (activePanel) {
    activePanel.style.display = 'block';
  }

  // Scroll to step header for mobile comfort
  const header = document.querySelector('.checkout-steps-nav');
  if (header) {
    header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (stepNumber === 4) {
    renderStep4Review();
  }
}

function validateStep1() {
  const name = document.getElementById('cust-name').value.trim();
  const email = document.getElementById('cust-email').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();

  if (!name || name.length < 2) {
    showToast('Please enter your full name.', 'warning');
    return false;
  }
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address.', 'warning');
    return false;
  }
  if (!phone || phone.length < 8) {
    showToast('Please enter a valid phone number.', 'warning');
    return false;
  }

  checkoutFormData.customer = { name, email, phone };
  return true;
}

function validateStep2() {
  const house = document.getElementById('addr-house').value.trim();
  const street = document.getElementById('addr-street').value.trim();
  const area = document.getElementById('addr-area').value.trim();
  const city = document.getElementById('addr-city').value.trim();
  const state = document.getElementById('addr-state').value.trim();
  const pincode = document.getElementById('addr-pincode').value.trim();

  if (!house || !street || !city || !pincode) {
    showToast('Please complete all required delivery address fields.', 'warning');
    return false;
  }

  checkoutFormData.delivery = {
    ...checkoutFormData.delivery,
    house,
    street,
    area,
    city,
    state,
    pincode
  };
  return true;
}

function validateStep3() {
  const date = document.getElementById('del-date').value;
  const slot = document.getElementById('del-slot').value;
  const instructions = document.getElementById('del-instructions').value.trim();

  if (!date) {
    showToast('Please choose a preferred delivery date.', 'warning');
    return false;
  }
  if (!slot) {
    showToast('Please choose a delivery time window.', 'warning');
    return false;
  }

  checkoutFormData.delivery.date = date;
  checkoutFormData.delivery.slot = slot;
  checkoutFormData.delivery.instructions = instructions;
  return true;
}

function goToNextStep(fromStep) {
  if (fromStep === 1) {
    if (!validateStep1()) return;
    updateStepVisibility(2);
  } else if (fromStep === 2) {
    if (!validateStep2()) return;
    updateStepVisibility(3);
  } else if (fromStep === 3) {
    if (!validateStep3()) return;
    updateStepVisibility(4);
  } else if (fromStep === 4) {
    updateStepVisibility(5);
  }
}

function goToPrevStep(toStep) {
  updateStepVisibility(toStep);
}

function selectPaymentMethod(method) {
  checkoutFormData.paymentMethod = method;
  document.querySelectorAll('.payment-option-card').forEach(card => {
    card.classList.remove('selected');
  });

  const selectedCard = document.querySelector(`.payment-option-card[data-method="${method}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
    const radio = selectedCard.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  }

  // Toggle detail fields
  const upiDetails = document.getElementById('pay-details-upi');
  const cardDetails = document.getElementById('pay-details-card');
  const netbankDetails = document.getElementById('pay-details-netbanking');
  const codDetails = document.getElementById('pay-details-cod');

  if (upiDetails) upiDetails.style.display = method === 'upi' ? 'block' : 'none';
  if (cardDetails) cardDetails.style.display = method === 'card' ? 'block' : 'none';
  if (netbankDetails) netbankDetails.style.display = method === 'netbanking' ? 'block' : 'none';
  if (codDetails) codDetails.style.display = method === 'cod' ? 'block' : 'none';
}

function renderStep4Review() {
  const customerBox = document.getElementById('review-customer-details');
  const deliveryBox = document.getElementById('review-delivery-details');
  const itemsContainer = document.getElementById('review-items-list');

  if (customerBox) {
    customerBox.innerHTML = `
      <p><strong>${checkoutFormData.customer.name}</strong></p>
      <p>📱 ${checkoutFormData.customer.phone} | ✉️ ${checkoutFormData.customer.email}</p>
    `;
  }

  if (deliveryBox) {
    const d = checkoutFormData.delivery;
    deliveryBox.innerHTML = `
      <p>🏠 ${d.house}, ${d.street}${d.area ? ', ' + d.area : ''}</p>
      <p>${d.city}, ${d.state} - ${d.pincode}</p>
      <p>📅 <strong>Date:</strong> ${d.date} | ⏰ <strong>Slot:</strong> ${d.slot}</p>
      ${d.instructions ? `<p><em>Note: "${d.instructions}"</em></p>` : ''}
    `;
  }

  if (itemsContainer) {
    const cart = getCart();
    itemsContainer.innerHTML = cart.map(item => `
      <div class="review-item-row">
        <img src="${item.image}" alt="${item.name}" class="review-item-thumb" />
        <div class="review-item-content">
          <div class="review-item-title">${item.name}</div>
          <div class="review-item-meta">${item.weight} • ${item.eggless ? 'Eggless' : 'Regular'}</div>
          ${item.cakeMessage ? `<div class="review-item-cake-msg">Msg: "${item.cakeMessage}"</div>` : ''}
        </div>
        <div class="review-item-calc">
          ${item.quantity} × ₹${item.price} = <strong>₹${item.subtotal}</strong>
        </div>
      </div>
    `).join('');
  }
}

function renderCheckoutSummary() {
  const totals = typeof calculateCartTotals === 'function' ? calculateCartTotals() : { subtotal: 0, grandTotal: 0 };
  
  const subtotalEl = document.getElementById('checkout-subtotal');
  const discountEl = document.getElementById('checkout-discount');
  const couponDiscountEl = document.getElementById('checkout-coupon-discount');
  const couponRow = document.getElementById('checkout-coupon-row');
  const deliveryEl = document.getElementById('checkout-delivery');
  const taxEl = document.getElementById('checkout-tax');
  const totalEl = document.getElementById('checkout-grand-total');

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
    deliveryEl.innerHTML = totals.deliveryFee === 0 ? '<span class="free-text">FREE</span>' : `₹${totals.deliveryFee}`;
  }
  if (taxEl) taxEl.textContent = `₹${totals.tax.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${totals.grandTotal.toLocaleString('en-IN')}`;

  const placeOrderBtn = document.getElementById('final-place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.textContent = `Pay & Place Order • ₹${totals.grandTotal.toLocaleString('en-IN')}`;
  }
}

function executeFinalOrder() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }

  const totals = calculateCartTotals();
  const orderPayload = {
    customer: checkoutFormData.customer,
    delivery: checkoutFormData.delivery,
    items: cart,
    totals: totals,
    paymentMethod: checkoutFormData.paymentMethod
  };

  // Trigger modular payment integration
  if (typeof initializePayment === 'function') {
    initializePayment(orderPayload, (success, result) => {
      if (success) {
        window.location.href = `order-success.html?orderId=${result.orderId}`;
      }
    });
  }
}

// Global Exports
if (typeof window !== 'undefined') {
  window.initCheckoutPage = initCheckoutPage;
  window.updateStepVisibility = updateStepVisibility;
  window.goToNextStep = goToNextStep;
  window.goToPrevStep = goToPrevStep;
  window.selectPaymentMethod = selectPaymentMethod;
  window.executeFinalOrder = executeFinalOrder;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('checkout-main-container')) {
    initCheckoutPage();
  }
});
