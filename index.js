/* ============================================================
   THE MUSKETEERS — app.js
   Full application logic: State, Data, UI, Admin
============================================================ */

/* ── App State ─────────────────────────────────────────── */
const savedProducts = JSON.parse(localStorage.getItem('tm_products') || 'null');
const defaultProductList = defaultProducts();
const removedProductIds = [7, 8, 10, 13, 16];
const products = Array.isArray(savedProducts)
  ? [
      ...savedProducts
        .filter(saved => !removedProductIds.includes(saved.id))
        .map(saved => {
          const def = defaultProductList.find(d => d.id === saved.id);
          return def ? { ...def, ...saved, images: (saved.images && saved.images.length) ? saved.images : def.images } : saved;
        }),
      ...defaultProductList.filter(def => !savedProducts.some(s => s.id === def.id) && !removedProductIds.includes(def.id))
    ]
  : defaultProductList.filter(p => !removedProductIds.includes(p.id));

const State = {
  cart: JSON.parse(localStorage.getItem('tm_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('tm_wishlist') || '[]'),
  user: JSON.parse(localStorage.getItem('tm_user') || 'null'),
  orders: JSON.parse(localStorage.getItem('tm_orders') || '[]'),
  coupons: JSON.parse(localStorage.getItem('tm_coupons') || 'null') || defaultCoupons(),
  products,
  customers: defaultCustomers(),
  appliedCoupon: null,
  editingProductId: null,
  currentPage: 1,
  itemsPerPage: 12,
  currentFilters: { category: 'All', priceMin: 0, priceMax: 1000, rating: 0, inStock: false, sort: 'default' },
  currentProductId: null,
  reviewRating: 5,
};

function persist() {
  localStorage.setItem('tm_cart', JSON.stringify(State.cart));
  localStorage.setItem('tm_wishlist', JSON.stringify(State.wishlist));
  localStorage.setItem('tm_user', JSON.stringify(State.user));
  localStorage.setItem('tm_orders', JSON.stringify(State.orders));
  localStorage.setItem('tm_coupons', JSON.stringify(State.coupons));
  localStorage.setItem('tm_products', JSON.stringify(State.products));
}

/* ── Default Data ──────────────────────────────────────── */
function defaultProducts() {
  return [
    { id: 1,  name: 'Pro Noise-Cancelling Headphones', category: 'Electronics', price: 8999.00, origPrice: 11999.00, emoji: '🎧', images: ['Image/wiwu-elite-white-on-ear-bluetooth-headphone-11730117950.webp'], rating: 4.8, reviews: 2341, stock: 45, desc: 'Premium wireless headphones with 40-hour battery life, active noise cancellation, and studio-quality sound.', badge: 'sale', isNew: false },
    { id: 2,  name: 'Smart Fitness Watch', category: 'Electronics', price: 3999.00, origPrice: 5999.00, emoji: '⌚', images: ['Image/s5-black.jpg'], rating: 4.6, reviews: 1823, stock: 30, desc: 'Track your health 24/7 with GPS, heart rate, sleep monitoring and 200+ workout modes.', badge: 'sale', isNew: false },
    { id: 3,  name: '4K Ultra HD Camera', category: 'Electronics', price: 35999.00, origPrice: 47999.00, emoji: '📷', images: ['Image/4K Ultra HD Camera.jpg'], rating: 4.9, reviews: 987, stock: 12, desc: 'Capture every moment in stunning 4K with 20MP sensor, optical zoom, and waterproof body.', badge: 'hot', isNew: false },
    { id: 4,  name: 'Leather Crossbody Bag', category: 'Fashion', price: 3499.00, origPrice: 4999.00, emoji: '👜', images: ['Image/Leather Crossbody Bag 1.webp', 'Image/Leather Crossbody Bag 2.webp'], rating: 4.5, reviews: 654, stock: 78, desc: 'Genuine leather crossbody bag with multiple compartments and adjustable strap. Perfect for everyday use.', badge: 'sale', isNew: true },
    { id: 5,  name: 'Running Sneakers Pro', category: 'Sports', price: 4999.00, origPrice: 6999.00, emoji: '👟', images: ['Image/Running Sneakers Pro 2.webp', 'Image/Running Sneakers Pro 3.jpg'], rating: 4.7, reviews: 3201, stock: 200, desc: 'Lightweight breathable running shoes with advanced cushioning and energy-return foam.', badge: '', isNew: true },
    { id: 6,  name: 'Bamboo Desk Organizer', category: 'Home & Garden', price: 1999.00, origPrice: 2999.00, emoji: '🪴', images: ['Image/Desk Organizer 1.webp', 'Image/Desk Organizer 2.jpg'], rating: 4.3, reviews: 445, stock: 150, desc: 'Eco-friendly bamboo desk organizer with 6 compartments. Keeps your workspace tidy and stylish.', badge: 'new', isNew: true },
    { id: 9,  name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 3999.00, origPrice: 5999.00, emoji: '⌨️', images: ['Image/Mechanical Gaming Keyboard 1.webp', 'Image/Mechanical Gaming Keyboard 2.webp'], rating: 4.7, reviews: 2109, stock: 60, desc: 'RGB mechanical keyboard with tactile switches, N-key rollover, and custom macros for gaming.', badge: 'sale', isNew: false },
    { id: 12, name: 'Smart LED Desk Lamp', category: 'Home & Garden', price: 2499.00, origPrice: 3499.00, emoji: '💡', images: ['Image/Smart LED Desk Lamp 2.webp'], rating: 4.4, reviews: 789, stock: 130, desc: 'Smart desk lamp with USB-C charging, adjustable color temperature, and gesture control.', badge: 'new', isNew: true },
    { id: 13, name: 'Retinol Night Cream', category: 'Beauty', price: 2299.00, origPrice: 3299.00, emoji: '🌙', rating: 4.7, reviews: 3289, stock: 240, desc: 'Anti-aging retinol night cream that reduces wrinkles and improves skin texture while you sleep.', badge: '', isNew: false },
    { id: 14, name: 'Wireless Earbuds TWS', category: 'Electronics', price: 3999.00, origPrice: 5999.00, emoji: '🎵', images: ['Image/IMG_1725.JPG', 'Image/IMG_1739.JPG', 'Image/IMG_1740(1).JPG'], rating: 4.6, reviews: 4512, stock: 50, desc: 'True wireless earbuds with 8-hour battery, touch controls, and IPX5 water resistance.', badge: 'sale', isNew: false },
    { id: 15, name: 'Minimalist Wallet', category: 'Fashion', price: 1499.00, origPrice: 1999.00, emoji: '💳', images: ['Image/Minimalist Wallet 1.jpg'], rating: 4.4, reviews: 1102, stock: 400, desc: 'Ultra-slim RFID-blocking wallet in genuine leather. Holds up to 12 cards.', badge: '', isNew: true },
    { id: 17, name: 'Thanos Key Ring', category: 'Accessories', price: 200.00, origPrice: 299.00, emoji: '🧲', images: ['Image/Thanos key ring.jpg'], rating: 4.4, reviews: 128, stock: 75, desc: 'Collector key ring inspired by Thanos, crafted with premium detail and lasting metal finish.', badge: 'new', isNew: true },
    { id: 18, name: 'Storm Breaker Key Ring', category: 'Accessories', price: 200.00, origPrice: 299.00, emoji: '⚒️', images: ['Image/Storm Breaker key ring.jpg'], rating: 4.5, reviews: 94, stock: 80, desc: 'Premium Storm Breaker key ring for fans, featuring detailed engraving and sturdy construction.', badge: 'new', isNew: true },
    { id: 19, name: 'Katana', category: 'Collectibles', price: 200.00, origPrice: 299.00, emoji: '🗡️', images: ['Image/katana 1.jpg', 'Image/katana 2.jpg'], rating: 4.6, reviews: 112, stock: 60, desc: 'Decorative katana replica with premium finish and collectible display quality.', badge: 'new', isNew: true },
    { id: 20, name: 'Gaming Chair Pro', category: 'Furniture', price: 12999.00, origPrice: 16999.00, emoji: '🪑', images: ['Image/gaming chair 1.webp', 'Image/gaming Chair 2.webp'], rating: 4.7, reviews: 856, stock: 35, desc: 'Premium ergonomic gaming chair with lumbar support, adjustable armrests, and premium synthetic leather. Perfect for long gaming sessions.', badge: 'new', isNew: true },
  ];
}

function defaultCoupons() {
  return [
    { code: 'SUMMER30', type: 'percent', value: 30, minOrder: 0, expiry: '2025-12-31', uses: 234 },
    { code: 'WELCOME10', type: 'percent', value: 10, minOrder: 0, expiry: '2025-12-31', uses: 891 },
    { code: 'SAVE20', type: 'fixed', value: 2400, minOrder: 12000, expiry: '2025-09-30', uses: 103 },
    { code: 'FREESHIP', type: 'fixed', value: 1198.80, minOrder: 6000, expiry: '2025-08-31', uses: 412 },
  ];
}

function defaultCustomers() {
  return [
    { id: 1, name: 'Alice Johnson',  email: 'alice@example.com', orders: 12, spent: 1249.50, joined: '2023-03-15' },
    { id: 2, name: 'Bob Williams',   email: 'bob@example.com',   orders: 7,  spent: 534.20,  joined: '2023-07-22' },
    { id: 3, name: 'Carol Martinez', email: 'carol@example.com', orders: 24, spent: 2801.90, joined: '2022-11-08' },
    { id: 4, name: 'David Kim',      email: 'david@example.com', orders: 3,  spent: 189.99,  joined: '2024-01-30' },
    { id: 5, name: 'Eva Chen',       email: 'eva@example.com',   orders: 18, spent: 1876.40, joined: '2023-05-12' },
  ];
}

/* ── Utilities ─────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);
const fmt = (n) => 'TK' + Number(n).toFixed(2);
const stars = (r) => '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '☆' : '') + '☆'.repeat(5 - Math.ceil(r));
const randId = () => Math.random().toString(36).substr(2,9).toUpperCase();

function showToast(msg, type = 'default', icon = '✓') {
  const c = $('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icon}</span><span>${msg}</span><div class="progress"></div>`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(30px)'; setTimeout(()=>t.remove(),300); }, 3000);
}

/* ── Page Navigation ───────────────────────────────────── */
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = $('page-' + page);
  if (target) { target.classList.add('active'); window.scrollTo(0,0); }
  // Update nav active
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Close menus
  $('user-dropdown').classList.remove('open');
  $('search-bar').classList.remove('open');
  document.getElementById('main-nav').classList.remove('mobile-open');

  // On-page-load actions
  const actions = {
    home: renderHome,
    shop: renderShop,
    wishlist: renderWishlist,
    cart: renderCart,
    checkout: renderCheckout,
    orders: renderOrders,
    admin: renderAdmin,
    deals: renderDeals,
    profile: renderProfile,
  };
  if (actions[page]) actions[page]();
}

/* ── Header toggles ────────────────────────────────────── */
function toggleSearch() {
  $('search-bar').classList.toggle('open');
  if ($('search-bar').classList.contains('open')) $('search-input').focus();
}
function toggleUserMenu() {
  const dd = $('user-dropdown');
  dd.classList.toggle('open');
  renderDropdown();
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-btn') && !e.target.closest('#user-dropdown')) {
    $('user-dropdown').classList.remove('open');
  }
});
function toggleMobileMenu() {
  document.getElementById('main-nav').classList.toggle('mobile-open');
}

function renderDropdown() {
  if (State.user) {
    $('dropdown-guest').style.display = 'none';
    $('dropdown-user').style.display = 'block';
    $('user-name-display').textContent = State.user.fname || 'User';
    $('admin-link').style.display = State.user.isAdmin ? 'block' : 'none';
  } else {
    $('dropdown-guest').style.display = 'block';
    $('dropdown-user').style.display = 'none';
  }
}

function updateBadges() {
  const cc = State.cart.reduce((s,i) => s + i.qty, 0);
  const wc = State.wishlist.length;
  $('cart-count').textContent = cc || '';
  $('wishlist-count').textContent = wc || '';
}

/* ── Search ────────────────────────────────────────────── */
function handleSearch(q) {
  const r = $('search-results');
  if (!q.trim()) { r.innerHTML = ''; return; }
  const results = State.products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
  r.innerHTML = results.length
    ? results.map(p => `
      <div class="search-result-item" onclick="openProduct(${p.id}); toggleSearch();">
        <span class="search-result-icon">${p.images && p.images.length > 0 ? `<img src="${p.images[0]}" alt="${p.name}" class="search-result-img">` : p.emoji}</span>
        <div class="search-result-info">
          <strong>${p.name}</strong>
          <span>${p.category} — ${fmt(p.price)}</span>
        </div>
      </div>`).join('')
    : '<div class="search-result-item"><span>😔</span><div class="search-result-info"><strong>No results found</strong><span>Try a different search term</span></div></div>';
}

/* ── Home Page ─────────────────────────────────────────── */
function renderHome() {
  renderCategories();
  renderFeaturedProducts();
  renderNewArrivals();
  renderTestimonials();
}

const categories = [
  { name: 'Electronics', icon: '📱', count: State.products.filter(p=>p.category==='Electronics').length },
  { name: 'Fashion',     icon: '👗', count: State.products.filter(p=>p.category==='Fashion').length },
  { name: 'Home & Garden', icon: '🏡', count: State.products.filter(p=>p.category==='Home & Garden').length },
  { name: 'Sports',      icon: '⚽', count: State.products.filter(p=>p.category==='Sports').length },
];

function renderCategories() {
  $('category-grid').innerHTML = categories.map(c => `
    <div class="category-card" onclick="shopByCategory('${c.name}')">
      <span class="category-icon">${c.icon}</span>
      <div class="category-name">${c.name}</div>
      <div class="category-count">${c.count} items</div>
    </div>`).join('');
}

function renderFeaturedProducts() {
  const featured = State.products.filter(p => p.badge === 'hot' || p.badge === 'sale').slice(0,8);
  $('featured-products').innerHTML = featured.map(productCard).join('');
}
function renderNewArrivals() {
  const arrivals = State.products.filter(p => p.isNew).slice(0,8);
  $('new-arrivals').innerHTML = arrivals.map(productCard).join('');
}

function renderTestimonials() {
  const tests = [
    { name: 'Sarah M.', handle: '@sarahm', rating: 5, text: 'Absolutely love shopping here! The product quality is top-notch and delivery was faster than expected. Will definitely shop again.' },
    { name: 'James T.', handle: '@jamest', rating: 5, text: 'The customer service is phenomenal. Had an issue with my order and they resolved it within hours. 10/10 experience.' },
    { name: 'Priya K.', handle: '@priyak', rating: 4, text: 'Great selection of products at competitive prices. The website is easy to navigate and checkout is seamless.' },
    { name: 'Marcus R.', handle: '@marcusr', rating: 5, text: 'I\'ve been shopping here for 2 years. The quality is consistent and the deals are genuinely unbeatable.' },
    { name: 'Linda H.', handle: '@lindah', rating: 5, text: 'The wishlist feature is so useful! I saved a bunch of items and came back to buy them all. Smooth experience.' },
    { name: 'Chen W.', handle: '@chenw', rating: 4, text: 'Fast shipping, secure payments, and a beautiful website. The Musketeers is my go-to for online shopping.' },
  ];
  $('testimonials').innerHTML = tests.map(t => `
    <div class="testimonial-card">
      <div class="test-stars">${'★'.repeat(t.rating)}</div>
      <p class="test-text">"${t.text}"</p>
      <div class="test-author">
        <div class="test-avatar">${t.name[0]}</div>
        <div>
          <div class="test-name">${t.name}</div>
          <div class="test-handle">${t.handle}</div>
        </div>
      </div>
    </div>`).join('');
}

function subscribeNewsletter() {
  const email = $('newsletter-email').value.trim();
  if (!email || !email.includes('@')) { showToast('Please enter a valid email.','error','✕'); return; }
  $('newsletter-email').value = '';
  showToast('You\'re subscribed! 🎉 Check your inbox for a welcome gift.','success','📧');
}

/* ── Product Card Template ─────────────────────────────── */
function productCard(p) {
  const inWishlist = State.wishlist.includes(p.id);
  const outOfStock = p.stock <= 0;
  const discount = p.origPrice ? Math.round((1 - p.price / p.origPrice) * 100) : 0;
  return `
  <div class="product-card" onclick="openProduct(${p.id})">
    <div class="product-image">
      ${p.images && p.images.length > 0 ? `<img src="${p.images[0]}" alt="${p.name}" class="product-img">` : `<span class="product-emoji">${p.emoji}</span>`}
      ${p.badge ? `<span class="product-badge ${p.badge}">${p.badge === 'new' ? 'NEW' : p.badge === 'hot' ? '🔥 HOT' : `${discount}% OFF`}</span>` : ''}
      ${outOfStock ? '<span class="product-badge" style="background:#666">OUT OF STOCK</span>' : ''}
      <div class="product-actions" onclick="event.stopPropagation()">
        <button class="action-btn ${inWishlist ? 'active' : ''}" onclick="toggleWishlist(${p.id})" title="${inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">${inWishlist ? '❤' : '♡'}</button>
        <button class="action-btn" onclick="openProduct(${p.id})" title="Quick View">👁</button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating">
        <span class="stars">${stars(p.rating)}</span>
        <span class="rating-count">(${p.reviews.toLocaleString()})</span>
      </div>
      <div class="product-pricing">
        <span class="product-price">${fmt(p.price)}</span>
        ${p.origPrice ? `<span class="product-orig-price">${fmt(p.origPrice)}</span><span class="product-discount">-${discount}%</span>` : ''}
      </div>
      <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${p.id})" ${outOfStock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
        ${outOfStock ? 'Out of Stock' : '+ Add to Cart'}
      </button>
    </div>
  </div>`;
}

/* ── Shop Page ─────────────────────────────────────────── */
function renderShop() {
  renderFilterCategories();
  filterProducts();
}

function shopByCategory(cat) {
  State.currentFilters.category = cat;
  showPage('shop');
}

function renderFilterCategories() {
  const cats = ['All', ...new Set(State.products.map(p => p.category))];
  $('filter-categories').innerHTML = cats.map(c => `
    <div class="filter-cat-item ${State.currentFilters.category === c ? 'active' : ''}"
         onclick="setCategory('${c}')">
      ${c}
      <span>${c === 'All' ? State.products.length : State.products.filter(p=>p.category===c).length}</span>
    </div>`).join('');
}

function setCategory(c) {
  State.currentFilters.category = c;
  State.currentPage = 1;
  renderFilterCategories();
  filterProducts();
}

function filterProducts() {
  const min = parseInt($('price-min').value);
  const max = parseInt($('price-max').value);
  const rating = parseFloat(document.querySelector('input[name="rating"]:checked')?.value || 0);
  const inStock = $('in-stock-only').checked;
  const sort = $('sort-select').value;

  $('price-min-val').textContent = min;
  $('price-max-val').textContent = max;

  State.currentFilters = { ...State.currentFilters, priceMin: min, priceMax: max, rating, inStock, sort };

  let filtered = State.products.filter(p => {
    if (State.currentFilters.category !== 'All' && p.category !== State.currentFilters.category) return false;
    if (p.price < min || p.price > max) return false;
    if (p.rating < rating) return false;
    if (inStock && p.stock <= 0) return false;
    return true;
  });

  if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a,b) => b.rating - a.rating);
  else if (sort === 'newest') filtered.sort((a,b) => b.id - a.id);

  const total = filtered.length;
  const pages = Math.ceil(total / State.itemsPerPage);
  const start = (State.currentPage - 1) * State.itemsPerPage;
  const paged = filtered.slice(start, start + State.itemsPerPage);

  $('product-count-text').textContent = `Showing ${paged.length} of ${total} products`;
  $('shop-products').innerHTML = paged.length ? paged.map(productCard).join('') : '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#a0a0a0">No products match your filters.</div>';

  renderPagination(pages);
}

function clearFilters() {
  State.currentFilters = { category: 'All', priceMin: 0, priceMax: 1000, rating: 0, inStock: false, sort: 'default' };
  $('price-min').value = 0; $('price-max').value = 1000;
  document.querySelector('input[name="rating"][value="0"]').checked = true;
  $('in-stock-only').checked = false;
  $('sort-select').value = 'default';
  State.currentPage = 1;
  renderFilterCategories();
  filterProducts();
}

function renderPagination(pages) {
  if (pages <= 1) { $('pagination').innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn ${i === State.currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  $('pagination').innerHTML = html;
}

function goPage(n) { State.currentPage = n; filterProducts(); window.scrollTo(0,200); }

function setView(type) {
  const grid = $('shop-products');
  if (type === 'list') { grid.classList.add('list-view'); $('list-view-btn').classList.add('active'); $('grid-view-btn').classList.remove('active'); }
  else { grid.classList.remove('list-view'); $('grid-view-btn').classList.add('active'); $('list-view-btn').classList.remove('active'); }
}

/* ── Product Detail ────────────────────────────────────── */
function openProduct(id) {
  const p = State.products.find(p => p.id === id);
  if (!p) return;
  State.currentProductId = id;
  showPage('product');

  $('product-breadcrumb').innerHTML = `<a href="#" onclick="showPage('home')">Home</a><span>›</span><a href="#" onclick="showPage('shop')">Shop</a><span>›</span><span>${p.name}</span>`;

  const discount = p.origPrice ? Math.round((1 - p.price / p.origPrice) * 100) : 0;
  const inWishlist = State.wishlist.includes(p.id);

  $('product-detail').innerHTML = `
    <div class="pd-images">
      <div class="pd-main-image">${p.images && p.images.length > 0 ? `<img src="${p.images[0]}" alt="${p.name}" class="pd-main-img">` : `<span class="pd-main-emoji">${p.emoji}</span>`}</div>
      <div class="pd-thumbs">
        ${(p.images && p.images.length > 0 ? p.images.map((img, i) => `<div class="pd-thumb ${i===0?'active':''}" onclick="changeProductImage('${img}', this)"><img src="${img}" alt="${p.name}" class="pd-thumb-img"></div>`) : [p.emoji, '📦', '🔍', '⭐'].map((e,i) => `<div class="pd-thumb ${i===0?'active':''}">${e}</div>`)).join('')}
      </div>
    </div>
    <div class="pd-info">
      <div class="pd-category">${p.category}</div>
      <h1 class="pd-name">${p.name}</h1>
      <div class="pd-rating">
        <span class="stars">${stars(p.rating)}</span>
        <span style="font-weight:700;color:var(--navy)">${p.rating}</span>
        <span style="color:var(--gray-400)">(${p.reviews.toLocaleString()} reviews)</span>
        ${p.stock > 0 ? `<span style="color:var(--success);font-size:0.85rem;font-weight:600">● In Stock (${p.stock})</span>` : '<span style="color:var(--danger);font-size:0.85rem;font-weight:600">● Out of Stock</span>'}
      </div>
      <div class="pd-pricing">
        <span class="pd-price">${fmt(p.price)}</span>
        ${p.origPrice ? `<span class="pd-orig">${fmt(p.origPrice)}</span><span class="pd-save">Save ${discount}%</span>` : ''}
      </div>
      <p class="pd-desc">${p.desc}</p>
      <div class="pd-options">
        <label>Color</label>
        <div class="option-btns">
          <button class="option-btn active">Black</button>
          <button class="option-btn">White</button>
          <button class="option-btn">Navy</button>
        </div>
      </div>
      <div class="pd-qty">
        <label style="font-size:0.82rem;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:0.05em">Qty</label>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <span class="qty-num" id="pd-qty-num">1</span>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
      </div>
      <div class="pd-actions">
        <button class="btn-primary btn-lg" onclick="addToCart(${p.id})" ${p.stock<=0?'disabled style="opacity:0.5"':''}>
          🛒 Add to Cart
        </button>
        <button class="btn-wishlist ${inWishlist?'active':''}" onclick="toggleWishlist(${p.id}); this.classList.toggle('active');" title="${inWishlist?'Remove from Wishlist':'Add to Wishlist'}">
          ${inWishlist ? '❤' : '♡'}
        </button>
      </div>
      <div class="pd-features">
        <div class="pd-feature">🚚 Free shipping on $50+</div>
        <div class="pd-feature">↩ 30-day returns</div>
        <div class="pd-feature">🔒 Secure checkout</div>
        <div class="pd-feature">⭐ Authentic products</div>
      </div>
    </div>`;

  // Related products
  const related = State.products.filter(r => r.category === p.category && r.id !== p.id).slice(0,4);
  $('related-products').innerHTML = related.map(productCard).join('');

  renderReviews(p);
}

let pdQty = 1;
function changeQty(d) {
  pdQty = Math.max(1, pdQty + d);
  $('pd-qty-num').textContent = pdQty;
}

function changeProductImage(imgSrc, thumbElement) {
  const mainImage = $('product-detail').querySelector('.pd-main-img');
  if (mainImage) {
    mainImage.src = imgSrc;
  }
  // Update active thumbnail
  document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
  thumbElement.classList.add('active');
}

/* ── Reviews ───────────────────────────────────────────── */
function renderReviews(p) {
  const reviews = [
    { name:'Alice J.', rating: 5, text:'Absolutely love this product! The quality is exactly as described. Fast shipping too.', date:'2 days ago' },
    { name:'Marcus R.', rating: 4, text:'Great product overall. Very happy with my purchase. Only minor issue is packaging could be better.', date:'1 week ago' },
    { name:'Sarah K.', rating: 5, text:'Exceeded my expectations! Will definitely purchase again. Highly recommend to anyone.', date:'2 weeks ago' },
  ];
  const ratingDistribution = { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 };
  const sec = $('reviews-section');
  sec.innerHTML = `
    <h2>Customer Reviews</h2>
    <div class="review-summary">
      <div class="review-score">
        <div class="score">${p.rating}</div>
        <div class="score-stars">${stars(p.rating)}</div>
        <p>${p.reviews.toLocaleString()} reviews</p>
      </div>
      <div class="review-bars">
        ${[5,4,3,2,1].map(n=>`
          <div class="review-bar-row">
            <span>${n}★</span>
            <div class="review-bar-track"><div class="review-bar-fill" style="width:${ratingDistribution[n]}%"></div></div>
            <span>${ratingDistribution[n]}%</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="review-write">
      <h4>Write a Review</h4>
      <div class="star-picker" id="star-picker">
        ${[1,2,3,4,5].map(n=>`<span class="${n<=State.reviewRating?'active':''}" onclick="setReviewRating(${n})">★</span>`).join('')}
      </div>
      <textarea id="review-text" placeholder="Share your experience with this product…" rows="3"></textarea>
      <button class="btn-primary" onclick="submitReview()">Submit Review</button>
    </div>
    <div class="reviews-list">
      ${reviews.map(r=>`
        <div class="review-item">
          <div class="review-header">
            <div class="review-avatar">${r.name[0]}</div>
            <div class="review-meta">
              <strong>${r.name}</strong>
              <span>${r.date}</span>
            </div>
            <span class="review-stars">${stars(r.rating)}</span>
          </div>
          <p class="review-text">${r.text}</p>
        </div>`).join('')}
    </div>`;
}

function setReviewRating(n) {
  State.reviewRating = n;
  document.querySelectorAll('#star-picker span').forEach((s,i) => s.classList.toggle('active', i < n));
}

function submitReview() {
  const txt = $('review-text').value.trim();
  if (!txt) { showToast('Please write your review first.','error','✕'); return; }
  $('review-text').value = '';
  showToast('Review submitted! Thank you for your feedback. 🙏','success','⭐');
}

/* ── Cart ──────────────────────────────────────────────── */
function addToCart(id, qty = null) {
  if (qty === null) qty = pdQty || 1;
  const product = State.products.find(p => p.id === id);
  if (!product || product.stock <= 0) { showToast('This product is out of stock.','error','✕'); return; }
  const existing = State.cart.find(i => i.id === id);
  if (existing) existing.qty += qty;
  else State.cart.push({ id, qty });
  persist();
  updateBadges();
  showToast(`${product.name} added to cart!`, 'success', product.emoji);
  pdQty = 1;
  if ($('pd-qty-num')) $('pd-qty-num').textContent = 1;
}

function renderCart() {
  updateBadges();
  const items = State.cart;
  if (!items.length) {
    $('cart-items').innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button class="btn-primary" onclick="showPage('shop')">Start Shopping</button>
      </div>`;
    $('cart-summary').innerHTML = '';
    return;
  }
  $('cart-items').innerHTML = `
    <h3 style="color:var(--navy);margin-bottom:1rem">Cart (${items.reduce((s,i)=>s+i.qty,0)} items)</h3>
    ${items.map(item => {
      const p = State.products.find(p => p.id === item.id);
      if (!p) return '';
      return `
      <div class="cart-item">
        <div class="cart-item-img">${p.emoji}</div>
        <div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-cat">${p.category}</div>
          <div class="qty-control" style="display:inline-flex">
            <button class="qty-btn" onclick="updateCartQty(${p.id},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty(${p.id},1)">+</button>
          </div>
        </div>
        <div>
          <div class="cart-item-price">${fmt(p.price * item.qty)}</div>
          <div style="font-size:0.78rem;color:var(--gray-400)">${fmt(p.price)} each</div>
          <button class="cart-item-remove" onclick="removeFromCart(${p.id})">✕ Remove</button>
        </div>
      </div>`;
    }).join('')}`;
  renderCartSummary();
}

function updateCartQty(id, d) {
  const item = State.cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + d);
  persist(); renderCart(); updateBadges();
}

function removeFromCart(id) {
  State.cart = State.cart.filter(i => i.id !== id);
  persist(); renderCart(); updateBadges();
  showToast('Item removed from cart.', 'info', '🗑');
}

function cartSubtotal() {
  return State.cart.reduce((s, item) => {
    const p = State.products.find(p => p.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
}

function renderCartSummary(discount = 0) {
  const sub = cartSubtotal();
  const ship = sub >= 50 ? 0 : 9.99;
  const tax = sub * 0.1;
  const total = sub + ship + tax - discount;
  $('cart-summary').innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${ship === 0 ? '<span style="color:var(--success)">Free</span>' : fmt(ship)}</span></div>
    <div class="summary-row"><span>Tax (10%)</span><span>${fmt(tax)}</span></div>
    ${discount > 0 ? `<div class="summary-row" style="color:var(--success)"><span>Discount</span><span>-${fmt(discount)}</span></div>` : ''}
    <div class="summary-row total"><span>Total</span><span>${fmt(Math.max(0,total))}</span></div>
    <div class="cart-coupon">
      <input type="text" id="cart-coupon-input" placeholder="Promo code" />
      <button onclick="applyCartCoupon()">Apply</button>
    </div>
    <button class="btn-primary btn-full" style="margin-top:1rem" onclick="showPage('checkout')">Proceed to Checkout →</button>
    <button class="btn-outline btn-full" style="margin-top:0.75rem" onclick="showPage('shop')">Continue Shopping</button>`;
}

function applyCartCoupon() {
  const code = $('cart-coupon-input').value.trim().toUpperCase();
  const coupon = State.coupons.find(c => c.code === code);
  if (!coupon) { showToast('Invalid coupon code.', 'error', '✕'); return; }
  const sub = cartSubtotal();
  const discount = coupon.type === 'percent' ? sub * coupon.value / 100 : coupon.value;
  State.appliedCoupon = { ...coupon, discount };
  renderCartSummary(discount);
  showToast(`Coupon "${code}" applied! You save ${fmt(discount)} 🎉`, 'success', '🏷');
}

/* ── Wishlist ──────────────────────────────────────────── */
function toggleWishlist(id) {
  const product = State.products.find(p => p.id === id);
  if (State.wishlist.includes(id)) {
    State.wishlist = State.wishlist.filter(i => i !== id);
    showToast(`Removed from wishlist.`, 'info', '♡');
  } else {
    State.wishlist.push(id);
    showToast(`${product?.name} added to wishlist!`, 'success', '❤');
  }
  persist(); updateBadges();
  if ($('page-wishlist').classList.contains('active')) renderWishlist();
}

function renderWishlist() {
  const wp = $('wishlist-products');
  if (!State.wishlist.length) {
    wp.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:5rem 2rem">
        <div style="font-size:4rem;margin-bottom:1rem">❤</div>
        <h3 style="color:var(--navy);margin-bottom:0.5rem">Your wishlist is empty</h3>
        <p style="color:var(--gray-400);margin-bottom:1.5rem">Save items you love for later.</p>
        <button class="btn-primary" onclick="showPage('shop')">Browse Products</button>
      </div>`;
    wp.style.padding = '2rem';
    return;
  }
  wp.style.padding = '2rem';
  wp.innerHTML = State.wishlist.map(id => {
    const p = State.products.find(p => p.id === id);
    return p ? productCard(p) : '';
  }).join('');
}

/* ── Checkout ──────────────────────────────────────────── */
function renderCheckout() {
  if (!State.user) { showToast('Please sign in to checkout.','info','🔐'); showPage('login'); return; }
  if (!State.cart.length) { showPage('cart'); return; }
  renderCheckoutSummary();
  $('checkout-step-1').style.display = '';
  $('checkout-step-2').style.display = 'none';
  $('checkout-step-3').style.display = 'none';
  updateStepIndicator(1);
  // Card live preview
  $('card-number').addEventListener('input', updateCardPreview);
  $('card-name').addEventListener('input', updateCardPreview);
  $('card-expiry').addEventListener('input', updateCardPreview);
}

function renderCheckoutSummary() {
  const sub = cartSubtotal();
  const discount = State.appliedCoupon?.discount || 0;
  const ship = getShippingCost();
  const tax = sub * 0.1;
  const total = sub + ship + tax - discount;
  $('checkout-summary').innerHTML = `
    <h3>Order Summary</h3>
    ${State.cart.map(item => {
      const p = State.products.find(p => p.id === item.id);
      return p ? `<div class="summary-row"><span>${p.emoji} ${p.name} ×${item.qty}</span><span>${fmt(p.price*item.qty)}</span></div>` : '';
    }).join('')}
    <hr style="margin:1rem 0;border:none;border-top:1px solid var(--gray-200)"/>
    <div class="summary-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${ship===0?'<span style="color:var(--success)">Free</span>':fmt(ship)}</span></div>
    <div class="summary-row"><span>Tax</span><span>${fmt(tax)}</span></div>
    ${discount>0?`<div class="summary-row" style="color:var(--success)"><span>Discount</span><span>-${fmt(discount)}</span></div>`:''}
    <div class="summary-row total"><span>Total</span><span>${fmt(Math.max(0,total))}</span></div>`;
}

function getShippingCost() {
  const method = document.querySelector('input[name="shipping"]:checked')?.value;
  if (method === 'express') return 9.99;
  if (method === 'overnight') return 19.99;
  return 0;
}

function nextCheckoutStep(step) {
  [1,2,3].forEach(n => {
    $(`checkout-step-${n}`).style.display = n === step ? '' : 'none';
  });
  updateStepIndicator(step);
  if (step === 3) renderOrderReview();
  renderCheckoutSummary();
}

function updateStepIndicator(active) {
  [1,2,3].forEach(n => {
    const el = $(`step-${n}-indicator`);
    el.classList.remove('active','done');
    if (n < active) el.classList.add('done');
    else if (n === active) el.classList.add('active');
  });
}

function renderOrderReview() {
  $('order-review-items').innerHTML = State.cart.map(item => {
    const p = State.products.find(p => p.id === item.id);
    return p ? `
      <div class="order-review-item">
        <span style="font-size:2rem">${p.emoji}</span>
        <div style="flex:1"><strong>${p.name}</strong><br/><span style="font-size:0.8rem;color:var(--gray-400)">Qty: ${item.qty}</span></div>
        <strong>${fmt(p.price * item.qty)}</strong>
      </div>` : '';
  }).join('');
}

function setPayTab(tab, btn) {
  ['card','paypal','mobile','cod'].forEach(t => $(`pay-${t}`).style.display = t===tab?'':'none');
  document.querySelectorAll('.pay-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function formatCard(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
  updateCardPreview();
}

function updateCardPreview() {
  const num = $('card-number').value || '•••• •••• •••• ••••';
  const name = $('card-name').value.toUpperCase() || 'CARDHOLDER NAME';
  const exp = $('card-expiry').value || 'MM/YY';
  $('card-num-display').textContent = num || '•••• •••• •••• ••••';
  $('card-name-display').textContent = name;
  $('card-exp-display').textContent = exp;
}

function applyCoupon() {
  const code = $('coupon-input').value.trim().toUpperCase();
  const coupon = State.coupons.find(c => c.code === code);
  const msg = $('coupon-msg');
  if (!coupon) { msg.textContent = 'Invalid coupon code.'; msg.className = 'error'; return; }
  const sub = cartSubtotal();
  const discount = coupon.type === 'percent' ? sub * coupon.value / 100 : coupon.value;
  State.appliedCoupon = { ...coupon, discount };
  msg.textContent = `✓ Coupon applied! Saving ${fmt(discount)}`;
  msg.className = 'success';
  renderCheckoutSummary();
}

function placeOrder() {
  if (!State.user) { showToast('Please sign in to place an order.','error','🔐'); showPage('login'); return; }
  const sub = cartSubtotal();
  const discount = State.appliedCoupon?.discount || 0;
  const ship = getShippingCost();
  const total = sub + ship + (sub * 0.1) - discount;
  const orderId = '#' + randId();
  const order = {
    id: orderId,
    items: State.cart.map(item => {
      const p = State.products.find(p => p.id === item.id);
      return { name: p?.name, emoji: p?.emoji, qty: item.qty, price: p?.price };
    }),
    total: Math.max(0, total),
    status: 'processing',
    date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
    trackingStep: 1,
  };
  State.orders.unshift(order);
  // Reduce stock
  State.cart.forEach(item => {
    const p = State.products.find(p => p.id === item.id);
    if (p) p.stock = Math.max(0, p.stock - item.qty);
  });
  State.cart = [];
  State.appliedCoupon = null;
  persist();
  updateBadges();
  $('confirm-order-id').textContent = orderId;
  showPage('order-confirm');
  showToast('Order placed successfully! 🎉','success','📦');
}

/* ── Orders ────────────────────────────────────────────── */
function renderOrders() {
  const list = $('orders-list');
  if (!State.orders.length) {
    list.innerHTML = `<div style="text-align:center;padding:4rem 2rem"><div style="font-size:4rem;margin-bottom:1rem">📦</div><h3 style="color:var(--navy);margin-bottom:0.5rem">No orders yet</h3><p style="color:var(--gray-400);margin-bottom:1.5rem">When you place an order it will appear here.</p><button class="btn-primary" onclick="showPage('shop')">Start Shopping</button></div>`;
    return;
  }
  const trackLabels = ['Ordered','Processing','Shipped','Out for Delivery','Delivered'];
  list.innerHTML = State.orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div><div class="order-id">${order.id}</div><div class="order-date">${order.date}</div></div>
        <span class="order-status status-${order.status}">${order.status.charAt(0).toUpperCase()+order.status.slice(1)}</span>
      </div>
      <div class="order-items-preview">
        ${order.items.map(i=>`<span class="order-item-chip">${i.emoji} ${i.name} ×${i.qty}</span>`).join('')}
      </div>
      <div class="order-footer">
        <span class="order-total">Total: ${fmt(order.total)}</span>
        <button class="table-btn view" onclick="toggleTracking(this)">Track Order</button>
      </div>
      <div class="order-tracking" style="display:none">
        <div class="tracking-steps">
          ${trackLabels.map((label, i) => `
            <div class="track-step ${i < (order.trackingStep || 1) ? 'done' : ''} ${i === (order.trackingStep-1 || 0) ? 'active' : ''}">
              <div class="track-dot">${i < (order.trackingStep || 1) ? '✓' : i+1}</div>
              <span class="track-label">${label}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

function toggleTracking(btn) {
  const tr = btn.closest('.order-card').querySelector('.order-tracking');
  const isOpen = tr.style.display !== 'none';
  tr.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? 'Track Order' : 'Hide Tracking';
}

/* ── Auth ──────────────────────────────────────────────── */
function login() {
  const email = $('login-email').value.trim();
  const pass = $('login-password').value;
  if (!email || !pass) { showToast('Please fill in all fields.','error','✕'); return; }

  // Check for admin credentials
  if (email === 'Nemesis' && pass === 'Nemesis123') {
    State.user = { fname: 'Nemesis', email: 'admin@musketeers.com', lname: '', isAdmin: true };
    persist();
    renderDropdown();
    showToast('Welcome, Admin Nemesis! ⚙', 'success', '✓');
    showPage('home');
    return;
  }

  if (!email.includes('@')) { showToast('Invalid email address.','error','✕'); return; }
  State.user = { fname: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1), email, lname: '' };
  persist();
  renderDropdown();
  showToast(`Welcome back, ${State.user.fname}! 👋`, 'success', '✓');
  showPage('home');
}

function register() {
  const fname = $('reg-fname').value.trim();
  const lname = $('reg-lname').value.trim();
  const email = $('reg-email').value.trim();
  const pass = $('reg-password').value;
  const confirm = $('reg-confirm').value;
  const terms = $('reg-terms').checked;
  if (!fname || !email || !pass) { showToast('Please fill in all required fields.','error','✕'); return; }
  if (pass !== confirm) { showToast('Passwords do not match.','error','✕'); return; }
  if (pass.length < 8) { showToast('Password must be at least 8 characters.','error','✕'); return; }
  if (!terms) { showToast('Please accept the terms and conditions.','error','✕'); return; }
  State.user = { fname, lname, email };
  persist();
  renderDropdown();
  showToast(`Account created! Welcome, ${fname}! 🎉`, 'success', '✓');
  showPage('home');
}

function logout() {
  State.user = null;
  persist();
  renderDropdown();
  $('user-dropdown').classList.remove('open');
  showToast('You have been signed out.', 'info', '👋');
  showPage('home');
}

/* ── Profile ───────────────────────────────────────────── */
function renderProfile() {
  if (!State.user) { showPage('login'); return; }
  $('profile-avatar').textContent = State.user.fname?.[0] || 'U';
  $('profile-name').textContent = `${State.user.fname} ${State.user.lname || ''}`.trim();
  $('profile-email-display').textContent = State.user.email || '';
  $('prof-fname').value = State.user.fname || '';
  $('prof-lname').value = State.user.lname || '';
  $('prof-email').value = State.user.email || '';
  renderAddresses();
}

function showProfileTab(tab) {
  ['info','address','security'].forEach(t => {
    const el = $(`profile-tab-${t}`);
    if (el) el.style.display = t === tab ? '' : 'none';
  });
  document.querySelectorAll('.profile-nav a').forEach((a,i) => a.classList.toggle('active', i === ['info','address','security'].indexOf(tab)));
}

function saveProfile() {
  State.user.fname = $('prof-fname').value;
  State.user.lname = $('prof-lname').value;
  State.user.email = $('prof-email').value;
  persist();
  renderProfile();
  showToast('Profile updated successfully!', 'success', '✓');
}

function renderAddresses() {
  const addresses = [{ label:'Home', address:'123 Main St, New York, NY 10001', default: true }];
  $('address-list').innerHTML = addresses.map(a => `
    <div class="address-card ${a.default?'default':''}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem">
        <strong>${a.label}</strong>
        ${a.default ? '<span class="default-badge">Default</span>' : ''}
      </div>
      <p style="font-size:0.9rem;color:var(--gray-600)">${a.address}</p>
    </div>`).join('');
}

function addAddress() { showToast('Address management coming soon!','info','📍'); }

/* ── Deals Page ────────────────────────────────────────── */
function renderDeals() {
  const deals = State.products.filter(p => p.badge === 'sale' || p.badge === 'hot');
  $('deals-products').innerHTML = deals.map(productCard).join('');
  startCountdown();
}

function startCountdown() {
  let end = new Date();
  end.setHours(23,59,59,0);
  function tick() {
    const now = new Date();
    let diff = Math.max(0, end - now);
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000); diff %= 60000;
    const s = Math.floor(diff / 1000);
    const pad = n => String(n).padStart(2,'0');
    if ($('cd-h')) { $('cd-h').textContent = pad(h); $('cd-m').textContent = pad(m); $('cd-s').textContent = pad(s); }
  }
  tick();
  setInterval(tick, 1000);
}

/* ── Admin ─────────────────────────────────────────────── */
function renderAdmin() {
  if (!State.user || !State.user.isAdmin) {
    showToast('Access denied. Admin login required.', 'error', '✕');
    showPage('login');
    return;
  }
  showAdminTab('dashboard');
}

function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.style.display='none');
  document.querySelectorAll('.admin-link').forEach(l => l.classList.remove('active'));
  $(`admin-tab-${tab}`).style.display = '';
  document.querySelectorAll('.admin-link').forEach(l => {
    if (l.getAttribute('onclick')?.includes(tab)) l.classList.add('active');
  });
  const renders = { dashboard: renderDashboard, products: renderAdminProducts, orders: renderAdminOrders, customers: renderAdminCustomers, inventory: renderAdminInventory, promotions: renderAdminPromotions, analytics: renderAnalytics };
  if (renders[tab]) renders[tab]();
}

function renderDashboard() {
  const totalRev = State.orders.reduce((s,o) => s+o.total, 0);
  const cards = [
    { icon:'💰', value: fmt(totalRev), label:'Total Revenue', change:'+12.5%', dir:'up' },
    { icon:'🛒', value: State.orders.length, label:'Total Orders', change:'+8.2%', dir:'up' },
    { icon:'📦', value: State.products.length, label:'Products', change:'+3', dir:'up' },
    { icon:'👥', value: State.customers.length + 'K', label:'Customers', change:'+5.1%', dir:'up' },
    { icon:'⭐', value: '4.7', label:'Avg Rating', change:'+0.1', dir:'up' },
    { icon:'↩', value: '1.2%', label:'Return Rate', change:'-0.3%', dir:'up' },
  ];
  $('admin-stat-cards').innerHTML = cards.map(c=>`
    <div class="stat-card">
      <div class="stat-icon">${c.icon}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-label">${c.label}</div>
      <div class="stat-change ${c.dir}">${c.dir==='up'?'↑':'↓'} ${c.change} vs last month</div>
    </div>`).join('');

  // Recent Orders
  $('admin-recent-orders').innerHTML = State.orders.slice(0,5).map(o=>`
    <div class="recent-order-row">
      <span style="font-weight:600">${o.id}</span>
      <span class="order-status status-${o.status}">${o.status}</span>
      <span style="font-weight:700">${fmt(o.total)}</span>
    </div>`).join('') || '<p style="color:var(--gray-400);font-size:0.9rem">No orders yet.</p>';

  // Top Products
  const topProds = State.products.sort((a,b) => b.reviews - a.reviews).slice(0,5);
  $('admin-top-products').innerHTML = topProds.map(p=>`
    <div class="top-product-row">
      <span class="top-product-emoji">${p.emoji}</span>
      <div class="top-product-info"><strong>${p.name}</strong><span>${p.reviews.toLocaleString()} reviews</span></div>
      <span class="top-product-val">${fmt(p.price)}</span>
    </div>`).join('');

  // Revenue Chart
  drawRevenueChart();
}

function drawRevenueChart() {
  const canvas = $('revenue-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const data = [1200, 1900, 1500, 2800, 2200, 3500, 2900];
  const max = Math.max(...data);
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);
  const barW = (W / days.length) * 0.5;
  const gap = W / days.length;
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0,0,W,H);
  data.forEach((v,i) => {
    const bh = (v/max) * (H - 50);
    const x = gap * i + gap * 0.25;
    const y = H - bh - 30;
    const grad = ctx.createLinearGradient(0,y,0,H-30);
    grad.addColorStop(0,'#c9933f');
    grad.addColorStop(1,'#e8b86d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, bh, [4,4,0,0]);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.font = '11px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText(days[i], x + barW/2, H - 12);
    ctx.fillStyle = '#666';
    ctx.fillText('$'+v, x + barW/2, y - 5);
  });
}

function renderAdminProducts() {
  $('admin-products-tbody').innerHTML = State.products.map(p => `
    <tr>
      <td>#${p.id}</td>
      <td class="emoji-cell">${p.emoji}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>${fmt(p.price)}</td>
      <td><span class="stock-pill ${p.stock > 20 ? 'stock-ok' : p.stock > 0 ? 'stock-low' : 'stock-out'}">${p.stock > 0 ? p.stock : 'Out'}</span></td>
      <td class="table-actions">
        <button class="table-btn edit" onclick="editProduct(${p.id})">Edit</button>
        <button class="table-btn delete" onclick="deleteProduct(${p.id})">Delete</button>
      </td>
    </tr>`).join('');
}

function renderAdminOrders() {
  const allOrders = [...State.orders, ...sampleAdminOrders()];
  $('admin-orders-tbody').innerHTML = allOrders.slice(0,10).map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer || 'Customer'}</td>
      <td>${o.items.length} items</td>
      <td><strong>${fmt(o.total)}</strong></td>
      <td><span class="order-status status-${o.status}">${o.status}</span></td>
      <td>${o.date}</td>
      <td class="table-actions">
        <button class="table-btn view" onclick="showToast('Order ${o.id} details','info','📦')">View</button>
        <select style="font-size:0.75rem;border:1px solid #ddd;border-radius:6px;padding:0.2rem" onchange="updateOrderStatus('${o.id}',this.value)">
          <option value="processing" ${o.status==='processing'?'selected':''}>Processing</option>
          <option value="shipped" ${o.status==='shipped'?'selected':''}>Shipped</option>
          <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
          <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelled</option>
        </select>
      </td>
    </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#a0a0a0">No orders yet.</td></tr>';
}

function sampleAdminOrders() {
  return [
    { id: '#ABC123', customer: 'Alice J.', items:[{},{}], total: 249.99, status: 'delivered', date: 'Jan 15, 2025' },
    { id: '#DEF456', customer: 'Bob W.',   items:[{}],    total: 89.99,  status: 'shipped',   date: 'Jan 20, 2025' },
    { id: '#GHI789', customer: 'Carol M.', items:[{},{},{}], total: 534.50, status: 'processing', date: 'Jan 22, 2025' },
  ];
}

function updateOrderStatus(id, status) {
  const order = State.orders.find(o => o.id === id);
  if (order) { order.status = status; persist(); }
  showToast(`Order ${id} status updated to "${status}"`, 'success', '✓');
}

function renderAdminCustomers() {
  $('admin-customers-tbody').innerHTML = State.customers.map(c => `
    <tr>
      <td>#${c.id}</td>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.orders}</td>
      <td><strong>${fmt(c.spent)}</strong></td>
      <td>${c.joined}</td>
    </tr>`).join('');
}

function renderAdminInventory() {
  const lowStock = State.products.filter(p => p.stock > 0 && p.stock <= 20);
  const outStock = State.products.filter(p => p.stock <= 0);
  const alerts = $('inventory-alerts');
  alerts.innerHTML = [
    ...outStock.map(p=>`<div class="inventory-alert danger">⚠ <strong>${p.name}</strong> is out of stock! Restock immediately.</div>`),
    ...lowStock.map(p=>`<div class="inventory-alert warn">⚡ <strong>${p.name}</strong> has only ${p.stock} units left.</div>`),
  ].join('') || '<div class="inventory-alert" style="background:#d4edda;color:#155724;border-left-color:#38a169">✓ All inventory levels are healthy.</div>';

  $('admin-inventory-tbody').innerHTML = State.products.map(p => `
    <tr>
      <td><strong>${p.emoji} ${p.name}</strong></td>
      <td style="font-family:monospace">SKU-${String(p.id).padStart(4,'0')}</td>
      <td>${p.stock}</td>
      <td>${Math.floor(p.stock * 0.1)}</td>
      <td>${Math.floor(p.stock * 0.9)}</td>
      <td><span class="stock-pill ${p.stock > 20 ? 'stock-ok' : p.stock > 0 ? 'stock-low' : 'stock-out'}">${p.stock > 20 ? 'OK' : p.stock > 0 ? 'Low' : 'Out'}</span></td>
      <td><button class="table-btn edit" onclick="restockProduct(${p.id})">+ Restock</button></td>
    </tr>`).join('');
}

function restockProduct(id) {
  const p = State.products.find(p => p.id === id);
  if (!p) return;
  p.stock += 50;
  persist();
  renderAdminInventory();
  showToast(`${p.name} restocked by 50 units! 📦`, 'success', '✓');
}

function renderAdminPromotions() {
  $('coupons-grid').innerHTML = State.coupons.map((c,i) => `
    <div class="coupon-card">
      <div class="coupon-code">${c.code}</div>
      <div class="coupon-value">${c.type==='percent' ? c.value+'% OFF' : fmt(c.value)+' OFF'}</div>
      <div class="coupon-details">
        ${c.minOrder > 0 ? `Min. order: ${fmt(c.minOrder)} · ` : ''}
        Expires: ${c.expiry} · Used ${c.uses} times
      </div>
      <button class="table-btn delete" style="margin-top:0.75rem" onclick="deleteCoupon(${i})">Remove</button>
    </div>`).join('');
}

function deleteCoupon(i) {
  State.coupons.splice(i,1);
  persist();
  renderAdminPromotions();
  showToast('Coupon deleted.','info','🗑');
}

function renderAnalytics() {
  const cards = [
    { icon:'💰', value:'$48,291', label:'Revenue', change:'+18.2%', dir:'up' },
    { icon:'👁', value:'124K',   label:'Page Views', change:'+9.7%', dir:'up' },
    { icon:'🔄', value:'3.4%',  label:'Conversion Rate', change:'+0.8%', dir:'up' },
    { icon:'📊', value:'$38.50',label:'Avg. Order Value', change:'+4.1%', dir:'up' },
  ];
  $('analytics-cards').innerHTML = cards.map(c=>`
    <div class="stat-card">
      <div class="stat-icon">${c.icon}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-label">${c.label}</div>
      <div class="stat-change ${c.dir}">${c.dir==='up'?'↑':'↓'} ${c.change} vs last period</div>
    </div>`).join('');

  // Category chart
  const catData = [
    { name:'Electronics', pct: 38, color:'#c9933f' },
    { name:'Fashion',     pct: 22, color:'#3182ce' },
    { name:'Sports',      pct: 18, color:'#38a169' },
    { name:'Beauty',      pct: 12, color:'#d69e2e' },
    { name:'Other',       pct: 10, color:'#718096' },
  ];
  $('category-chart-wrap').innerHTML = `
    <div class="donut-chart-wrap">
      <svg width="160" height="160" viewBox="0 0 36 36">
        ${buildDonut(catData)}
      </svg>
      <div class="donut-legend">
        ${catData.map(d=>`<div class="legend-item"><span class="legend-dot" style="background:${d.color}"></span>${d.name} (${d.pct}%)</div>`).join('')}
      </div>
    </div>`;

  // Traffic sources
  const traffic = [
    { name:'Organic Search', pct: 42, color:'#c9933f' },
    { name:'Social Media',   pct: 28, color:'#3182ce' },
    { name:'Direct',         pct: 18, color:'#38a169' },
    { name:'Email',          pct: 12, color:'#d69e2e' },
  ];
  $('traffic-chart-wrap').innerHTML = `
    <div style="padding:1rem 0">
      ${traffic.map(t=>`
        <div style="margin-bottom:1rem">
          <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.4rem">
            <span>${t.name}</span><span style="font-weight:700">${t.pct}%</span>
          </div>
          <div style="height:10px;background:var(--gray-200);border-radius:5px;overflow:hidden">
            <div style="height:100%;width:${t.pct}%;background:${t.color};border-radius:5px;transition:width 1s ease"></div>
          </div>
        </div>`).join('')}
    </div>`;
}

function buildDonut(data) {
  let offset = 25;
  return data.map(d => {
    const dash = `${d.pct} ${100-d.pct}`;
    const el = `<circle cx="18" cy="18" r="15.9155" fill="none" stroke="${d.color}" stroke-width="3.5" stroke-dasharray="${dash}" stroke-dashoffset="${-offset}" />`;
    offset -= d.pct;
    return el;
  }).join('');
}

function setPeriod(p, btn) {
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAnalytics();
  showToast(`Showing data for last ${p === '7d' ? '7 days' : p === '30d' ? '30 days' : '90 days'}.`, 'info', '📊');
}

/* ── Product CRUD ──────────────────────────────────────── */
function openAddProduct() {
  State.editingProductId = null;
  $('product-modal-title').textContent = 'Add New Product';
  ['pm-name','pm-price','pm-orig-price','pm-stock','pm-desc','pm-emoji','pm-rating'].forEach(id => { const el = $(id); if(el) el.value=''; });
  $('product-modal').classList.add('open');
}

function editProduct(id) {
  const p = State.products.find(p => p.id === id);
  if (!p) return;
  State.editingProductId = id;
  $('product-modal-title').textContent = 'Edit Product';
  $('pm-name').value = p.name;
  $('pm-price').value = p.price;
  $('pm-orig-price').value = p.origPrice || '';
  $('pm-category').value = p.category;
  $('pm-stock').value = p.stock;
  $('pm-desc').value = p.desc;
  $('pm-emoji').value = p.emoji;
  $('pm-rating').value = p.rating;
  $('product-modal').classList.add('open');
}

function saveProduct() {
  const name = $('pm-name').value.trim();
  const price = parseFloat($('pm-price').value);
  const stock = parseInt($('pm-stock').value);
  if (!name || isNaN(price)) { showToast('Name and price are required.','error','✕'); return; }

  if (State.editingProductId) {
    const p = State.products.find(p => p.id === State.editingProductId);
    Object.assign(p, {
      name, price, origPrice: parseFloat($('pm-orig-price').value) || null,
      category: $('pm-category').value, stock: stock || 0,
      desc: $('pm-desc').value, emoji: $('pm-emoji').value || '🛍',
      rating: parseFloat($('pm-rating').value) || 4.0
    });
    showToast('Product updated!','success','✓');
  } else {
    const newId = Math.max(...State.products.map(p=>p.id)) + 1;
    State.products.push({
      id: newId, name, price, origPrice: parseFloat($('pm-orig-price').value) || null,
      category: $('pm-category').value, stock: stock || 0,
      desc: $('pm-desc').value || '', emoji: $('pm-emoji').value || '🛍',
      rating: parseFloat($('pm-rating').value) || 4.0, reviews: 0,
      badge: '', isNew: true
    });
    showToast('Product added!','success','✓');
  }
  persist();
  closeModal('product-modal');
  renderAdminProducts();
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  State.products = State.products.filter(p => p.id !== id);
  persist();
  renderAdminProducts();
  showToast('Product deleted.','info','🗑');
}

/* ── Coupon CRUD ───────────────────────────────────────── */
function openAddCoupon() { $('coupon-modal').classList.add('open'); }

function saveCoupon() {
  const code = $('coupon-code-input').value.trim().toUpperCase();
  const type = $('coupon-type').value;
  const value = parseFloat($('coupon-value').value);
  const minOrder = parseFloat($('coupon-min').value) || 0;
  const expiry = $('coupon-expiry').value;
  if (!code || isNaN(value)) { showToast('Code and value are required.','error','✕'); return; }
  State.coupons.push({ code, type, value, minOrder, expiry: expiry || '2025-12-31', uses: 0 });
  persist();
  closeModal('coupon-modal');
  renderAdminPromotions();
  showToast(`Coupon "${code}" created!`,'success','🏷');
}

/* ── Modal helpers ─────────────────────────────────────── */
function closeModal(id) { $(id).classList.remove('open'); }

/* ── Option Buttons (inline click) ────────────────────── */
document.addEventListener('click', e => {
  if (e.target.classList.contains('option-btn')) {
    e.target.closest('.option-btns').querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
  }
  if (e.target.classList.contains('crypto-btn')) {
    e.target.closest('.crypto-options').querySelectorAll('.crypto-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
  }
});

/* ── Init ──────────────────────────────────────────────── */
(function init() {
  updateBadges();
  renderDropdown();
  showPage('home');
  // Animate stat badge when 0
  document.querySelectorAll('.badge').forEach(b => {
    if (b.textContent === '0') b.style.display = 'none';
  });
  console.log('🗡 The Musketeers — Commerce Platform Initialized');
})();