# Sweet Crumbs — Artisan Cake Shop E-Commerce Website
## Technical Architecture & Backend Integration Guide (PHP / MySQL / Payment Gateway)

Welcome to the **Sweet Crumbs** e-commerce frontend codebase! This project was engineered from the ground up using **pure HTML5, CSS3, and Vanilla JavaScript (ES6+)** without any external UI frameworks (no React, Vue, Angular, or Bootstrap), prioritizing clean code readability, modularity, high performance, and effortless backend integration.

---

## 1. Directory Structure

```
├── index.html                # Homepage with hero slider, categories, bestsellers, custom cake builder, reviews
├── shop.html                 # Complete product catalog with real-time filters, search, price ranges, sort
├── product.html              # Dynamic product detail page (weights, eggless toggle, plaque message, reviews)
├── cart.html                 # Interactive shopping basket, coupon voucher engine, instructions, add-ons
├── checkout.html             # 5-step checkout flow (Contact -> Address -> Slot -> Celebration -> Payment)
├── order-success.html        # Order confirmation with live baking timeline, item summary, and print invoice
├── about.html                # Bakehouse story, artisan philosophy, master pastry chefs, certifications
├── contact.html              # Contact information, opening hours, interactive inquiry form
├── account.html              # Customer login/register, order history, profile settings, saved addresses
├── wishlist.html             # Saved favorites collection with 1-click "Move to Cart"
├── faq.html                  # Accordion FAQ (freshness, eggless baking, midnight delivery, packaging)
├── privacy-policy.html       # Customer data privacy policy
├── terms.html                # Terms of service and perishable goods policy
├── shipping-policy.html      # Delivery zones, temperature-controlled transit, and shipping rates
├── refund-policy.html        # Cancellation windows and damaged product replacement policy
├── css/
│   ├── style.css             # Design tokens, typography, header, product cards, buttons, footer
│   ├── responsive.css        # Adaptive mobile-first breakpoints (phones, tablets, desktops)
│   └── animations.css        # Smooth CSS transitions, fade-ins, micro-interactions, modal overlays
├── js/
│   ├── products.js           # Central product catalog, categories, search and query helpers
│   ├── cart.js               # Cart state management, weight pricing calculation, coupons, localStorage
│   ├── wishlist.js           # Wishlist toggle, persistence, count badge updates
│   ├── search.js             # Live search suggestions dropdown and query handling
│   ├── auth.js               # User session management, demo login, profile updates
│   ├── checkout.js           # Multi-step checkout controller, date/slot validations
│   ├── payment.js            # Payment architecture with Razorpay/Stripe hooks and mock fallback
│   ├── product.js            # Dynamic product page loader from URL parameter (?id=X)
│   └── main.js               # Global UI initialization (sticky header, toast notifications, badges)
└── metadata.json             # Application metadata configuration
```

---

## 2. How to Run the Website

### Option A: Local Development with Vite (Current Setup)
1. Run `npm run dev` to launch the local Vite development server.
2. The site will be available on `http://localhost:3000`.

### Option B: Standard Local Web Server (XAMPP / WampServer / Apache / MAMP)
1. Copy all project files into your web root (e.g. `C:/xampp/htdocs/sweetcrumbs/` or `/var/www/html/sweetcrumbs/`).
2. Open your browser and navigate to `http://localhost/sweetcrumbs/`.
3. All relative paths (`css/`, `js/`, `*.html`) will resolve seamlessly without any build step!

### Option C: VS Code "Live Server" Extension
1. Open the project folder in Visual Studio Code.
2. Right-click on `index.html` and select **"Open with Live Server"**.

---

## 3. Step-by-Step PHP & MySQL Integration

The frontend architecture was designed to transition directly from client-side `localStorage` to a relational PHP/MySQL backend.

### Step 3.1: Recommended MySQL Database Schema

```sql
CREATE DATABASE sweet_crumbs_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sweet_crumbs_db;

-- 1. Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    loyalty_points INT DEFAULT 0,
    role ENUM('customer', 'admin', 'baker') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories table
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    sort_order INT DEFAULT 0
);

-- 3. Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2) NULL,
    image_url VARCHAR(500) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 4.9,
    reviews_count INT DEFAULT 0,
    is_eggless_default BOOLEAN DEFAULT TRUE,
    tag VARCHAR(50) NULL,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    flavor VARCHAR(100),
    stock_status ENUM('in_stock', 'sold_out') DEFAULT 'in_stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 4. Customer Addresses table
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    flat VARCHAR(150) NOT NULL,
    society VARCHAR(150) NOT NULL,
    street VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    address_type ENUM('home', 'office', 'other') DEFAULT 'home',
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Orders table
CREATE TABLE orders (
    id VARCHAR(30) PRIMARY KEY, -- e.g. 'SC-584920'
    user_id INT NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(160) NOT NULL,
    delivery_flat VARCHAR(150) NOT NULL,
    delivery_society VARCHAR(150) NOT NULL,
    delivery_street VARCHAR(200) NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_pincode VARCHAR(10) NOT NULL,
    delivery_type ENUM('standard', 'fixed', 'midnight') DEFAULT 'standard',
    delivery_date DATE NOT NULL,
    delivery_slot VARCHAR(60) NOT NULL,
    recipient_name VARCHAR(120) NULL,
    occasion VARCHAR(60) NULL,
    card_message TEXT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) NOT NULL,
    grand_total DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('upi', 'card', 'netbanking', 'cod') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100) NULL,
    order_status ENUM('placed', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Order Items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(30) NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    weight VARCHAR(50) NOT NULL,
    is_eggless BOOLEAN DEFAULT TRUE,
    cake_message VARCHAR(255) NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    line_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 7. Coupons table
CREATE TABLE coupons (
    code VARCHAR(30) PRIMARY KEY,
    discount_type ENUM('percentage', 'flat') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    expiry_date DATE NULL
);

INSERT INTO coupons (code, discount_type, discount_value, min_order_amount) VALUES
('WELCOME10', 'percentage', 10.00, 400.00),
('SWEET50', 'flat', 50.00, 500.00),
('FESTIVE20', 'percentage', 20.00, 999.00);
```

---

### Step 3.2: Connecting JavaScript to PHP API Endpoints

Instead of reading from `js/products.js` or `localStorage`, simply swap the fetch calls:

#### Example: Fetching Products from `api/get_products.php`
```javascript
// In js/products.js (or shop page script)
async function fetchProductsFromBackend(category = 'all', sort = 'popular') {
  try {
    const res = await fetch(`/api/get_products.php?category=${category}&sort=${sort}`);
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error('Error loading products from server:', error);
    return window.SWEET_CRUMBS_PRODUCTS; // Graceful fallback to static array
  }
}
```

#### Example: Placing Order to `api/create_order.php`
In `js/checkout.js`, the `executeFinalOrderPlacement()` function is already structured with a payload ready for `POST`:

```javascript
async function sendOrderToBackend(orderPayload) {
  const response = await fetch('/api/create_order.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  return await response.json();
}
```

---

## 4. Payment Gateway Integration (Razorpay / Stripe)

The file `js/payment.js` contains clean hooks for payment gateway initialization.

### Razorpay Integration (India)
1. Add the Razorpay Checkout script to `<head>` in `checkout.html`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
2. In `js/payment.js`, set `activeGateway = 'razorpay'`:
   ```javascript
   const options = {
     key: "YOUR_RAZORPAY_KEY_ID",
     amount: order.totals.grandTotal * 100, // amount in paise
     currency: "INR",
     name: "Sweet Crumbs Bakery",
     description: "Celebration Cake Order " + order.id,
     order_id: serverRazorpayOrderId, // generated via PHP API
     handler: function (response) {
       // Send response.razorpay_payment_id and response.razorpay_signature to PHP for verification
       verifyPaymentOnServer(response);
     },
     prefill: {
       name: order.customer.name,
       email: order.customer.email,
       contact: order.customer.phone
     },
     theme: { color: "#E85D75" }
   };
   const rzp = new Razorpay(options);
   rzp.open();
   ```

---

## 5. WhatsApp & Email Notification Triggers

Whenever an order status changes in your PHP backend (`placed`, `baking`, `out_for_delivery`):

1. **WhatsApp Notifications (via Meta Cloud API or Twilio):**
   - Trigger a POST to `https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages` with your template (e.g. `cake_order_confirmed`).
2. **Email Invoices (via PHPMailer or SendGrid):**
   - Generate a clean HTML email receipt using the template styling found in `order-success.html`.

---

## 6. Full List of Completed Features

1. **Artisan Bakery Brand Identity:** Soft warm cream, blush pink (`#E85D75`), chocolate brown (`#3E2723`), and gold tones with Playfair Display & Plus Jakarta Sans typography.
2. **Catalog & Filtering (`shop.html`):** Category pills (Cakes, Pastries, Cheesecakes, Cupcakes, Breads, Hampers), dietary toggles (100% Eggless vs. Contains Egg), price slider (₹0 to ₹2000), search bar, and sorting.
3. **Product Detail Page (`product.html`):** Dynamic multi-weight pricing calculation (500g, 1kg, 1.5kg, 2kg, 3kg, 5kg), eggless option selector, custom edible chocolate plaque text input with live preview, gallery thumbnails, and customer reviews.
4. **Interactive Custom Cake Builder:** Pick flavor, weight, shape, frosting, edible toppers, and cake message with instant real-time price preview and 1-click cart addition.
5. **Shopping Basket (`cart.html`):** Item list, quantity increment/decrement, dynamic subtotal, GST 5% tax breakdown, free delivery threshold (₹799), special chef notes, celebration add-on items (poppers, cards), and active coupon system (`WELCOME10`, `SWEET50`, `FESTIVE20`).
6. **5-Step Checkout (`checkout.html`):** Contact Details -> Delivery Address -> Delivery Slot (Standard, Fixed 1-Hour, Midnight 11 PM-12 AM) -> Celebration Details (Occasion & Card Wishes) -> Payment Options (UPI, Cards, Net Banking, COD) with animated gateway modal.
7. **Order Tracking & Confirmation (`order-success.html`):** Unique Order ID generation, 5-stage live status tracker, delivery destination snapshot, itemized breakdown, and one-click printable invoice.
8. **User Account & History (`account.html`):** Tabbed dashboard for order history, saved addresses, profile settings, loyalty points balance, and instant 1-click demo login.
9. **Wishlist (`wishlist.html`):** Persistent saved favorites with heart toggles on every card and "Move to Cart" workflow.
10. **Information & Policy Pages:** `about.html`, `contact.html`, `faq.html` with interactive accordion, `privacy-policy.html`, `terms.html`, `shipping-policy.html`, and `refund-policy.html`.
11. **Responsive & Accessible:** Tested across smartphone screens (360px+), tablets, and widescreen displays with compliant touch target sizing (44px+) and semantic markup.
