/**
 * Sweet Crumbs - Single Product Page Engine
 * Handles dynamic product loading, weight-based price recalculation,
 * thumbnail switching, cake message customization, delivery slot, and bundle purchase.
 */

let currentProduct = null;
let selectedWeight = null;
let selectedPrice = 0;
let isEggless = true;
let currentQuantity = 1;

function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'), 10) || 1;
  const product = typeof getProductById === 'function' ? getProductById(productId) : null;

  if (!product) {
    const mainContainer = document.getElementById('product-detail-section');
    if (mainContainer) {
      mainContainer.innerHTML = `
        <div class="container text-center" style="padding: 80px 20px;">
          <h2>Delicious Cake Not Found</h2>
          <p>We couldn't locate this specific sweet treat.</p>
          <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Browse All Cakes</a>
        </div>
      `;
    }
    return;
  }

  currentProduct = product;
  renderProductDetails(product);
  renderRelatedProducts(product);
  renderFrequentlyBoughtTogether(product);
}

function renderProductDetails(product) {
  // Page Title & Meta
  document.title = `${product.name} | Sweet Crumbs Bakery`;

  // Breadcrumbs
  const breadcrumbCat = document.getElementById('crumb-category');
  const breadcrumbTitle = document.getElementById('crumb-title');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = product.category;
    breadcrumbCat.href = `shop.html?category=${encodeURIComponent(product.categorySlug || '')}`;
  }
  if (breadcrumbTitle) breadcrumbTitle.textContent = product.name;

  // Title, Category, Rating
  const titleEl = document.getElementById('product-title');
  const catEl = document.getElementById('product-category-name');
  const ratingEl = document.getElementById('product-rating-score');
  const reviewsEl = document.getElementById('product-reviews-count');
  const tagEl = document.getElementById('product-tag-badge');
  const descEl = document.getElementById('product-description-text');

  if (titleEl) titleEl.textContent = product.name;
  if (catEl) catEl.textContent = product.category;
  if (ratingEl) ratingEl.textContent = product.rating;
  if (reviewsEl) reviewsEl.textContent = `(${product.reviewsCount} customer reviews)`;
  if (tagEl) {
    if (product.tag) {
      tagEl.textContent = product.tag;
      tagEl.style.display = 'inline-block';
    } else {
      tagEl.style.display = 'none';
    }
  }
  if (descEl) descEl.textContent = product.description;

  // Main Image & Gallery
  const mainImg = document.getElementById('product-main-img');
  const thumbContainer = document.getElementById('product-thumbnails-wrap');
  if (mainImg) {
    mainImg.src = product.image;
    mainImg.alt = product.name;
  }

  if (thumbContainer) {
    const thumbs = product.thumbnails && product.thumbnails.length ? product.thumbnails : [product.image];
    thumbContainer.innerHTML = thumbs.map((t, idx) => `
      <button type="button" class="thumb-btn ${idx === 0 ? 'active' : ''}" onclick="switchProductImage('${t}', this)" aria-label="View angle ${idx + 1}">
        <img src="${t}" alt="${product.name} angle ${idx + 1}" />
      </button>
    `).join('');
  }

  // Weight Options & Price
  const weightContainer = document.getElementById('weight-options-container');
  const weights = product.weights || { "1kg": product.price };
  const weightKeys = Object.keys(weights);
  selectedWeight = weightKeys[0];
  selectedPrice = weights[selectedWeight];

  if (weightContainer) {
    weightContainer.innerHTML = weightKeys.map((w, idx) => `
      <label class="weight-chip-label ${idx === 0 ? 'active' : ''}">
        <input type="radio" name="cake_weight" value="${w}" ${idx === 0 ? 'checked' : ''} onchange="handleWeightChange('${w}')" />
        <span class="weight-chip-name">${w}</span>
        <span class="weight-chip-price">₹${weights[w]}</span>
      </label>
    `).join('');
  }

  updatePriceDisplay();

  // Eggless default
  isEggless = product.eggless !== false;
  const egglessCheckbox = document.getElementById('eggless-toggle');
  if (egglessCheckbox) {
    egglessCheckbox.checked = isEggless;
  }

  // Delivery Date (Minimum today)
  const datePicker = document.getElementById('delivery-date-input');
  if (datePicker) {
    const today = new Date().toISOString().split('T')[0];
    datePicker.min = today;
    datePicker.value = today;
  }

  // Tabs content
  const ingredientsTab = document.getElementById('tab-ingredients-content');
  const allergensTab = document.getElementById('tab-allergens-content');
  const storageTab = document.getElementById('tab-storage-content');
  const shelfLifeTab = document.getElementById('tab-shelf-content');

  if (ingredientsTab) ingredientsTab.textContent = product.ingredients || "Fresh dairy cream, pure chocolate, cake flour, butter, cane sugar.";
  if (allergensTab) allergensTab.textContent = product.allergens || "Contains Dairy and Wheat (Gluten). May contain traces of nuts.";
  if (storageTab) storageTab.textContent = product.storageInstructions || "Store refrigerated at 2°C - 5°C. Best enjoyed within 48 hours.";
  if (shelfLifeTab) shelfLifeTab.textContent = product.shelfLife || "3 days from delivery date.";

  // Update Wishlist button active state
  if (typeof isInWishlist === 'function') {
    const wishlistBtn = document.getElementById('product-wishlist-btn');
    if (wishlistBtn) {
      if (isInWishlist(product.id)) {
        wishlistBtn.classList.add('active');
      } else {
        wishlistBtn.classList.remove('active');
      }
    }
  }
}

function switchProductImage(src, buttonElement) {
  const mainImg = document.getElementById('product-main-img');
  if (mainImg) {
    mainImg.src = src;
  }
  document.querySelectorAll('.thumb-btn').forEach(btn => btn.classList.remove('active'));
  if (buttonElement) {
    buttonElement.classList.add('active');
  }
}

function handleWeightChange(weight) {
  if (!currentProduct || !currentProduct.weights) return;
  selectedWeight = weight;
  selectedPrice = currentProduct.weights[weight] || currentProduct.price;

  // Update chip labels active style
  document.querySelectorAll('.weight-chip-label').forEach(label => {
    const input = label.querySelector('input');
    if (input && input.value === weight) {
      label.classList.add('active');
    } else {
      label.classList.remove('active');
    }
  });

  updatePriceDisplay();
}

function updatePriceDisplay() {
  const priceCurrent = document.getElementById('product-price-current');
  const priceOld = document.getElementById('product-price-old');
  const discountBadge = document.getElementById('product-discount-badge');

  if (priceCurrent) priceCurrent.textContent = `₹${selectedPrice}`;
  
  // Estimate old price (roughly 15-20% higher)
  const estimatedOld = Math.round(selectedPrice * 1.18);
  if (priceOld) priceOld.textContent = `₹${estimatedOld}`;
  if (discountBadge) discountBadge.textContent = `Save 15%`;
}

function adjustQuantity(delta) {
  currentQuantity = Math.max(1, Math.min(20, currentQuantity + delta));
  const qtyInput = document.getElementById('product-qty-input');
  if (qtyInput) qtyInput.value = currentQuantity;
}

function handleAddToCartFromDetail(isBuyNow = false) {
  if (!currentProduct) return;

  const msgInput = document.getElementById('cake-message-input');
  const cakeMessage = msgInput ? msgInput.value.trim() : '';

  const egglessToggle = document.getElementById('eggless-toggle');
  const egglessValue = egglessToggle ? egglessToggle.checked : true;

  const dateInput = document.getElementById('delivery-date-input');
  const slotSelect = document.getElementById('delivery-slot-select');

  if (typeof addToCart === 'function') {
    addToCart(currentProduct.id, selectedWeight, currentQuantity, egglessValue, cakeMessage);
  }

  if (isBuyNow) {
    window.location.href = 'checkout.html';
  }
}

function handleWishlistFromDetail() {
  if (!currentProduct) return;
  if (typeof toggleWishlist === 'function') {
    toggleWishlist(currentProduct.id);
    const wishlistBtn = document.getElementById('product-wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.classList.toggle('active');
    }
  }
}

function switchTab(tabName, event) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  const targetPane = document.getElementById(`tab-pane-${tabName}`);
  if (targetPane) targetPane.classList.add('active');
}

// Render "Frequently Bought Together" bundle
function renderFrequentlyBoughtTogether(currentP) {
  const container = document.getElementById('frequently-bought-container');
  if (!container) return;

  const addonItem1 = { name: "Artisan Sparkle Birthday Candles (Pack of 10)", price: 99, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80" };
  const addonItem2 = { name: "Handcrafted Celebration Greeting Card", price: 79, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80" };

  container.innerHTML = `
    <div class="fbt-card">
      <div class="fbt-items-row">
        <div class="fbt-item">
          <img src="${currentP.image}" alt="${currentP.name}" />
          <div class="fbt-name">${currentP.name}</div>
          <div class="fbt-price">₹${currentP.price}</div>
        </div>
        <span class="fbt-plus">+</span>
        <div class="fbt-item">
          <img src="${addonItem1.image}" alt="${addonItem1.name}" />
          <div class="fbt-name">${addonItem1.name}</div>
          <div class="fbt-price">₹${addonItem1.price}</div>
        </div>
        <span class="fbt-plus">+</span>
        <div class="fbt-item">
          <img src="${addonItem2.image}" alt="${addonItem2.name}" />
          <div class="fbt-name">${addonItem2.name}</div>
          <div class="fbt-price">₹${addonItem2.price}</div>
        </div>
      </div>
      <div class="fbt-cta-col">
        <div class="fbt-total-wrap">
          <span class="fbt-total-label">Total Bundle Price:</span>
          <span class="fbt-total-val">₹${currentP.price + addonItem1.price + addonItem2.price}</span>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="addBundleToCart(${currentP.id})">
          Add All 3 to Cart
        </button>
      </div>
    </div>
  `;
}

function addBundleToCart(productId) {
  if (typeof addToCart === 'function') {
    addToCart(productId, selectedWeight || '1kg', 1, true, '');
    showToast('Added Celebration Bundle to Cart!', 'success');
  }
}

// Render "Related Products"
function renderRelatedProducts(product) {
  const container = document.getElementById('related-products-grid');
  if (!container) return;

  const all = typeof getAllProducts === 'function' ? getAllProducts() : (window.productsDB || []);
  const related = all
    .filter(p => p.id !== product.id && (p.categorySlug === product.categorySlug || p.flavor === product.flavor))
    .slice(0, 4);

  // If not enough by category, pick featured
  if (related.length < 4) {
    const extra = all.filter(p => p.id !== product.id && !related.find(r => r.id === p.id)).slice(0, 4 - related.length);
    related.push(...extra);
  }

  container.innerHTML = related.map(p => `
    <div class="product-card">
      <div class="product-badge-group">
        ${p.tag ? `<span class="badge badge-tag">${p.tag}</span>` : ''}
        <span class="diet-indicator ${p.eggless ? 'eggless' : 'contains-egg'}">
          <span class="diet-dot"></span>
        </span>
      </div>

      <button type="button" class="wishlist-toggle-btn ${typeof isInWishlist === 'function' && isInWishlist(p.id) ? 'active' : ''}" data-id="${p.id}" onclick="toggleWishlist(${p.id}, event)" aria-label="Add to wishlist">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <a href="product.html?id=${p.id}" class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
      </a>

      <div class="product-content">
        <span class="product-category">${p.category}</span>
        <h3 class="product-title">
          <a href="product.html?id=${p.id}">${p.name}</a>
        </h3>
        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span class="score">${p.rating}</span>
          <span class="count">(${p.reviewsCount})</span>
        </div>
        <div class="product-pricing">
          <span class="price-current">₹${p.price}</span>
          ${p.oldPrice ? `<span class="price-old">₹${p.oldPrice}</span>` : ''}
        </div>
        <div class="product-actions">
          <button type="button" class="btn btn-primary btn-sm btn-block" onclick="addToCart(${p.id}, '1kg', 1, ${p.eggless})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Global Exports
if (typeof window !== 'undefined') {
  window.initProductPage = initProductPage;
  window.switchProductImage = switchProductImage;
  window.handleWeightChange = handleWeightChange;
  window.adjustQuantity = adjustQuantity;
  window.handleAddToCartFromDetail = handleAddToCartFromDetail;
  window.handleWishlistFromDetail = handleWishlistFromDetail;
  window.switchTab = switchTab;
  window.addBundleToCart = addBundleToCart;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-detail-section')) {
    initProductPage();
  }
});
