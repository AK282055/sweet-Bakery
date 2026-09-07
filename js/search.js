/**
 * Sweet Crumbs - Live Search Engine
 * Searches through products by name, category, flavor, and tags in real-time.
 * 
 * Future PHP API:
 * - GET /backend/search.php?q=keyword
 */

function searchProducts(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const all = typeof getAllProducts === 'function' ? getAllProducts() : (window.productsDB || []);

  return all.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(q);
    const categoryMatch = p.category.toLowerCase().includes(q);
    const flavorMatch = (p.flavor || '').toLowerCase().includes(q);
    const tagMatch = (p.tag || '').toLowerCase().includes(q);
    const descMatch = (p.description || '').toLowerCase().includes(q);
    return nameMatch || categoryMatch || flavorMatch || tagMatch || descMatch;
  });
}

function initLiveSearch() {
  const searchInputs = document.querySelectorAll('.live-search-input');
  const searchResultsContainers = document.querySelectorAll('.live-search-results');

  searchInputs.forEach((input, index) => {
    const resultsContainer = searchResultsContainers[index] || document.getElementById('search-dropdown-results');
    if (!resultsContainer) return;

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length < 2) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
      }

      const results = searchProducts(query);
      renderSearchResults(results, query, resultsContainer);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  });

  // Close search on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box-wrap')) {
      searchResultsContainers.forEach(container => {
        if (container) container.style.display = 'none';
      });
    }
  });
}

function renderSearchResults(results, query, container) {
  if (!container) return;
  container.style.display = 'block';

  if (results.length === 0) {
    container.innerHTML = `
      <div class="search-no-results">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <p>No bakery treats found matching <strong>"${query}"</strong></p>
        <span class="search-hint">Try searching "Chocolate", "Velvet", "Fruit", or "Pastry"</span>
      </div>
    `;
    return;
  }

  let html = `<div class="search-results-header">Found ${results.length} delicious item${results.length > 1 ? 's' : ''}</div>`;
  html += `<div class="search-results-list">`;
  
  results.slice(0, 6).forEach(p => {
    html += `
      <a href="product.html?id=${p.id}" class="search-result-row">
        <img src="${p.image}" alt="${p.name}" class="search-thumb" />
        <div class="search-meta">
          <div class="search-item-title">${p.name}</div>
          <div class="search-item-sub">
            <span class="search-cat">${p.category}</span>
            <span class="search-price">₹${p.price}</span>
            ${p.eggless ? '<span class="badge-eggless-mini">Eggless</span>' : ''}
          </div>
        </div>
      </a>
    `;
  });

  if (results.length > 6) {
    html += `
      <div class="search-view-all">
        <a href="shop.html?search=${encodeURIComponent(query)}" class="view-all-link">
          View all ${results.length} results →
        </a>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

if (typeof window !== 'undefined') {
  window.searchProducts = searchProducts;
  window.initLiveSearch = initLiveSearch;
}

document.addEventListener('DOMContentLoaded', () => {
  initLiveSearch();
});
