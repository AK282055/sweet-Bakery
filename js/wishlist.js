/**
 * Sweet Crumbs - Wishlist Engine (Vanilla JS + LocalStorage)
 * Modular architecture ready for MySQL `wishlist` table synchronization.
 * 
 * Future PHP API:
 * - GET    /backend/wishlist.php
 * - POST   /backend/wishlist.php?productId=X
 * - DELETE /backend/wishlist.php?productId=X
 */

const WISHLIST_STORAGE_KEY = 'sweet_crumbs_wishlist';

function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(list) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
    updateWishlistBadge();
    updateWishlistHeartIcons();
  } catch (e) {
    console.error("Failed to save wishlist", e);
  }
}

function isInWishlist(productId) {
  const list = getWishlist();
  return list.includes(parseInt(productId, 10));
}

function toggleWishlist(productId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const id = parseInt(productId, 10);
  let list = getWishlist();
  const product = typeof getProductById === 'function' ? getProductById(id) : null;
  const productName = product ? product.name : 'Item';

  if (list.includes(id)) {
    list = list.filter(item => item !== id);
    saveWishlist(list);
    if (typeof showToast === 'function') {
      showToast(`Removed "${productName}" from Wishlist.`, 'info');
    }
  } else {
    list.push(id);
    saveWishlist(list);
    if (typeof showToast === 'function') {
      showToast(`Added "${productName}" to your Wishlist!`, 'success');
    }
  }

  // If on wishlist page, re-render
  if (document.getElementById('wishlist-grid')) {
    renderWishlistPage();
  }
}

function updateWishlistBadge() {
  const badges = document.querySelectorAll('.wishlist-count-badge');
  const count = getWishlist().length;
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function updateWishlistHeartIcons() {
  const buttons = document.querySelectorAll('.wishlist-toggle-btn');
  const list = getWishlist();
  buttons.forEach(btn => {
    const id = parseInt(btn.getAttribute('data-id'), 10);
    if (list.includes(id)) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}

function moveWishlistToCart(productId) {
  const product = typeof getProductById === 'function' ? getProductById(productId) : null;
  if (!product) return;

  const defaultWeight = Object.keys(product.weights || {})[0] || '1kg';
  if (typeof addToCart === 'function') {
    addToCart(product.id, defaultWeight, 1, product.eggless, '');
  }

  // Remove from wishlist
  let list = getWishlist();
  list = list.filter(id => id !== parseInt(productId, 10));
  saveWishlist(list);

  if (document.getElementById('wishlist-grid')) {
    renderWishlistPage();
  }
}

function renderWishlistPage() {
  const grid = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('wishlist-empty-state');
  if (!grid) return;

  const list = getWishlist();
  if (list.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  let html = '';
  list.forEach(id => {
    const p = typeof getProductById === 'function' ? getProductById(id) : null;
    if (!p) return;

    html += `
      <div class="product-card">
        <div class="product-badge-group">
          ${p.tag ? `<span class="badge badge-tag">${p.tag}</span>` : ''}
          <span class="diet-indicator ${p.eggless ? 'eggless' : 'contains-egg'}">
            <span class="diet-dot"></span>
          </span>
        </div>

        <button type="button" class="wishlist-toggle-btn active" data-id="${p.id}" onclick="toggleWishlist(${p.id}, event)" aria-label="Remove from wishlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
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
            <button type="button" class="btn btn-primary btn-sm btn-block" onclick="moveWishlistToCart(${p.id})">
              Move to Cart
            </button>
            <button type="button" class="btn btn-outline btn-sm" onclick="toggleWishlist(${p.id}, event)">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// Global Exports
if (typeof window !== 'undefined') {
  window.getWishlist = getWishlist;
  window.saveWishlist = saveWishlist;
  window.isInWishlist = isInWishlist;
  window.toggleWishlist = toggleWishlist;
  window.updateWishlistBadge = updateWishlistBadge;
  window.updateWishlistHeartIcons = updateWishlistHeartIcons;
  window.moveWishlistToCart = moveWishlistToCart;
  window.renderWishlistPage = renderWishlistPage;
}

document.addEventListener('DOMContentLoaded', () => {
  updateWishlistBadge();
  updateWishlistHeartIcons();
});
