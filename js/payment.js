/**
 * Sweet Crumbs - Payment Integration Engine
 * 
 * ARCHITECTURE & SECURITY NOTICE:
 * -------------------------------------------------------------
 * 1. NEVER store secret API keys (Razorpay Key Secret, Stripe Secret Key) 
 *    in client-side JavaScript.
 * 2. In production with a PHP backend:
 *    - Frontend calls `createPaymentOrder(orderPayload)` -> POST /backend/payment.php?action=create_order
 *    - PHP server calls Razorpay/Stripe API using your private API Secret to create an official order_id.
 *    - PHP server returns `{ razorpay_order_id, amount, currency, key_id }` back to this frontend script.
 *    - Frontend opens the Razorpay/Stripe checkout modal.
 *    - On customer payment completion, Razorpay returns `razorpay_payment_id`, `razorpay_signature`.
 *    - Frontend sends these signatures to `verifyPayment()` -> POST /backend/payment.php?action=verify_signature
 *    - PHP server validates HMAC SHA256 signature and records order in MySQL `payments` and `orders` tables.
 * -------------------------------------------------------------
 */

/**
 * Initializes and orchestrates payment based on chosen method.
 * @param {Object} orderData - The complete checkout payload.
 * @param {Function} onCompleteCallback - Callback triggered upon success or failure.
 */
function initializePayment(orderData, onCompleteCallback) {
  console.log("[Payment Gateway] Initializing transaction for order:", orderData);

  const selectedMethod = orderData.paymentMethod || 'cod';

  // Open the Processing Modal
  showPaymentModal({
    status: 'processing',
    method: selectedMethod,
    amount: orderData.totals.grandTotal
  });

  // Step 1: Request Payment Order Creation (Demo or PHP API)
  createPaymentOrder(orderData)
    .then(paymentOrder => {
      console.log("[Payment Gateway] Payment Order Created:", paymentOrder);

      // Branch based on method
      if (selectedMethod === 'cod') {
        // Cash on Delivery requires no online gateway charge
        setTimeout(() => {
          paymentSuccess(paymentOrder, orderData, onCompleteCallback);
        }, 1200);
      } else {
        // Online Gateways: UPI, Card, Net Banking
        // Simulate gateway authorization window
        setTimeout(() => {
          verifyPayment(paymentOrder)
            .then(verificationResult => {
              if (verificationResult.verified) {
                paymentSuccess(paymentOrder, orderData, onCompleteCallback);
              } else {
                paymentFailed("Signature verification failed", onCompleteCallback);
              }
            })
            .catch(err => paymentFailed(err.message, onCompleteCallback));
        }, 2200);
      }
    })
    .catch(err => {
      console.error("[Payment Gateway Error]:", err);
      paymentFailed(err.message, onCompleteCallback);
    });
}

/**
 * Step 1: Create Order ID
 * In PHP backend, this will call:
 *   $razorpayOrder = $api->order->create([...]);
 */
async function createPaymentOrder(orderData) {
  // Generate authentic bakery order ID
  const timestamp = Date.now().toString().slice(-6);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const orderId = `SC-${timestamp}-${randomSuffix}`;

  return new Promise((resolve) => {
    // In future PHP integration:
    /*
    fetch('/backend/payment.php?action=create_order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    .then(res => res.json())
    .then(data => resolve(data));
    */

    // Demo Simulation
    resolve({
      orderId: orderId,
      gatewayOrderId: `pay_order_${Date.now()}`,
      amount: orderData.totals.grandTotal,
      currency: 'INR',
      method: orderData.paymentMethod
    });
  });
}

/**
 * Step 2: Verify Payment Signature
 * In PHP backend, this validates server-side HMAC signature.
 */
async function verifyPayment(paymentOrder) {
  return new Promise((resolve) => {
    // In future PHP integration:
    /*
    fetch('/backend/payment.php?action=verify_signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: paymentOrder.gatewayOrderId,
        razorpay_payment_id: 'pay_mock_' + Date.now(),
        razorpay_signature: 'sha256_hash_here'
      })
    })
    .then(res => res.json())
    .then(data => resolve(data));
    */

    // Demo Simulation: always succeeds in demo mode
    resolve({
      verified: true,
      transactionId: `TXN-${Date.now()}`
    });
  });
}

/**
 * Step 3: Handle Payment Success
 * Records order into localStorage (and future MySQL `orders` table), clears cart, and redirects.
 */
function paymentSuccess(paymentOrder, orderData, callback) {
  console.log("[Payment Gateway] Payment Successful!");

  // Construct complete final order record
  const finalOrder = {
    orderId: paymentOrder.orderId,
    date: new Date().toISOString(),
    displayDate: new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    customer: orderData.customer,
    delivery: orderData.delivery,
    items: orderData.items,
    totals: orderData.totals,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: orderData.paymentMethod === 'cod' ? 'Cash on Delivery (Pending)' : 'Paid Online (Verified)',
    trackingStatus: 'Order Placed',
    trackingStages: [
      { name: 'Order Placed', time: 'Just Now', completed: true, active: true },
      { name: 'Order Confirmed', time: 'Expected in 15 mins', completed: false, active: false },
      { name: 'Baking with Love', time: 'Expected in 1 hour', completed: false, active: false },
      { name: 'Out for Delivery', time: 'Scheduled for ' + (orderData.delivery.date || 'Today'), completed: false, active: false },
      { name: 'Delivered', time: 'Pending', completed: false, active: false }
    ]
  };

  // Save to persistent Orders database in localStorage
  try {
    const existingOrders = JSON.parse(localStorage.getItem('sweet_crumbs_orders') || '[]');
    existingOrders.unshift(finalOrder);
    localStorage.setItem('sweet_crumbs_orders', JSON.stringify(existingOrders));
    
    // Also save current active order for order-success.html
    localStorage.setItem('sweet_crumbs_latest_order', JSON.stringify(finalOrder));
  } catch (e) {
    console.error("Failed to store order in localStorage", e);
  }

  // Clear current cart
  if (typeof clearCart === 'function') {
    clearCart();
  }

  showPaymentModal({
    status: 'success',
    orderId: finalOrder.orderId,
    amount: finalOrder.totals.grandTotal
  });

  setTimeout(() => {
    closePaymentModal();
    if (typeof callback === 'function') {
      callback(true, finalOrder);
    } else {
      window.location.href = `order-success.html?orderId=${finalOrder.orderId}`;
    }
  }, 1600);
}

/**
 * Step 4: Handle Payment Failure
 */
function paymentFailed(errorMessage, callback) {
  console.error("[Payment Gateway] Payment Failed:", errorMessage);
  showPaymentModal({
    status: 'failed',
    errorMessage: errorMessage || "The payment transaction could not be completed."
  });

  setTimeout(() => {
    closePaymentModal();
    if (typeof callback === 'function') {
      callback(false, { error: errorMessage });
    }
  }, 2500);
}

// Payment Status UI Modal Helpers
function showPaymentModal(config) {
  let modal = document.getElementById('payment-processing-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'payment-processing-modal';
    modal.className = 'payment-modal-overlay';
    document.body.appendChild(modal);
  }

  let contentHtml = '';
  if (config.status === 'processing') {
    contentHtml = `
      <div class="payment-modal-card">
        <div class="payment-spinner"></div>
        <h3 class="payment-modal-title">Processing Celebration Order...</h3>
        <p class="payment-modal-text">Connecting securely to payment gateway for <strong>₹${config.amount}</strong> via ${config.method.toUpperCase()}.</p>
        <p class="payment-modal-note">Please do not refresh or close this window.</p>
      </div>
    `;
  } else if (config.status === 'success') {
    contentHtml = `
      <div class="payment-modal-card payment-success-state">
        <div class="payment-icon-success">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 class="payment-modal-title">Payment Confirmed!</h3>
        <p class="payment-modal-text">Your order <strong>${config.orderId}</strong> has been secured.</p>
        <p class="payment-modal-note">Redirecting to order confirmation...</p>
      </div>
    `;
  } else if (config.status === 'failed') {
    contentHtml = `
      <div class="payment-modal-card payment-failed-state">
        <div class="payment-icon-failed">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h3 class="payment-modal-title">Payment Unsuccessful</h3>
        <p class="payment-modal-text">${config.errorMessage}</p>
        <p class="payment-modal-note">Please try another payment method.</p>
      </div>
    `;
  }

  modal.innerHTML = contentHtml;
  modal.style.display = 'flex';
}

function closePaymentModal() {
  const modal = document.getElementById('payment-processing-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Global Exports
if (typeof window !== 'undefined') {
  window.initializePayment = initializePayment;
  window.createPaymentOrder = createPaymentOrder;
  window.verifyPayment = verifyPayment;
  window.paymentSuccess = paymentSuccess;
  window.paymentFailed = paymentFailed;
}
