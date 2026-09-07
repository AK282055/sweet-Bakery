/**
 * Sweet Crumbs - User Authentication & Account Manager
 * Frontend demo auth layer storing session in localStorage.
 * 
 * Future PHP API:
 * - POST /backend/login.php
 * - POST /backend/register.php
 * - GET  /backend/profile.php
 * - POST /backend/update_profile.php
 * - POST /backend/orders.php (fetch user orders)
 */

const AUTH_USER_KEY = 'sweet_crumbs_user';

// Default Demo User for effortless preview & testing
const DEFAULT_USER = {
  isLoggedIn: true,
  id: "USR-1082",
  name: "Kanchan Rajput",
  email: "rajputkanchan601@gmail.com",
  phone: "+91 98765 43210",
  memberSince: "January 2025",
  addresses: [
    {
      id: "addr_1",
      title: "Home",
      house: "Flat 402, Sunshine Heights",
      street: "Baker Avenue, Sector 14",
      area: "Civil Lines",
      city: "Sonipat",
      state: "Haryana",
      pincode: "131001",
      isDefault: true
    },
    {
      id: "addr_2",
      title: "Office",
      house: "Suite 3B, Cyber Park",
      street: "Grand Trunk Road",
      area: "Industrial Area",
      city: "Sonipat",
      state: "Haryana",
      pincode: "131028",
      isDefault: false
    }
  ]
};

// Seed initial orders if empty
function seedSampleOrders() {
  const existing = localStorage.getItem('sweet_crumbs_orders');
  if (!existing || JSON.parse(existing).length === 0) {
    const sampleOrders = [
      {
        orderId: "SC-84920-112",
        date: "2026-09-02T14:30:00.000Z",
        displayDate: "02 Sep 2026, 02:30 PM",
        customer: {
          name: "Kanchan Rajput",
          email: "rajputkanchan601@gmail.com",
          phone: "+91 98765 43210"
        },
        delivery: {
          house: "Flat 402, Sunshine Heights",
          street: "Baker Avenue, Sector 14",
          city: "Sonipat",
          state: "Haryana",
          pincode: "131001",
          date: "2026-09-03",
          slot: "5:00 PM - 8:00 PM (Evening)"
        },
        items: [
          {
            name: "Belgian Chocolate Truffle Cake",
            weight: "1kg",
            price: 599,
            quantity: 1,
            eggless: true,
            cakeMessage: "Happy Birthday Kanchan!",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
          },
          {
            name: "Gourmet Cupcake Assortment Box",
            weight: "6 Pcs Box",
            price: 499,
            quantity: 1,
            eggless: true,
            cakeMessage: "",
            image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80"
          }
        ],
        totals: {
          subtotal: 1098,
          totalDiscount: 100,
          deliveryFee: 0,
          tax: 50,
          grandTotal: 1048
        },
        paymentMethod: "UPI (Google Pay)",
        paymentStatus: "Paid Online (Verified)",
        trackingStatus: "Delivered",
        trackingStages: [
          { name: 'Order Placed', time: '02 Sep, 02:30 PM', completed: true, active: false },
          { name: 'Order Confirmed', time: '02 Sep, 02:45 PM', completed: true, active: false },
          { name: 'Baking with Love', time: '02 Sep, 04:00 PM', completed: true, active: false },
          { name: 'Out for Delivery', time: '03 Sep, 05:15 PM', completed: true, active: false },
          { name: 'Delivered', time: '03 Sep, 06:20 PM', completed: true, active: true }
        ]
      }
    ];
    localStorage.setItem('sweet_crumbs_orders', JSON.stringify(sampleOrders));
  }
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      // Initialize with default demo user
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USER;
  }
}

function updateCurrentUser(updatedFields) {
  const user = getCurrentUser();
  const newUser = { ...user, ...updatedFields };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  if (typeof showToast === 'function') {
    showToast('Profile updated successfully!', 'success');
  }
  return newUser;
}

function userLogout() {
  const user = getCurrentUser();
  user.isLoggedIn = false;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  if (typeof showToast === 'function') {
    showToast('Logged out safely.', 'info');
  }
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

function userLogin(email, password) {
  const user = getCurrentUser();
  user.isLoggedIn = true;
  user.email = email;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  if (typeof showToast === 'function') {
    showToast(`Welcome back, ${user.name}!`, 'success');
  }
  setTimeout(() => {
    window.location.reload();
  }, 600);
}

function getUserOrders() {
  try {
    const raw = localStorage.getItem('sweet_crumbs_orders');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Global Exports
if (typeof window !== 'undefined') {
  window.getCurrentUser = getCurrentUser;
  window.updateCurrentUser = updateCurrentUser;
  window.userLogout = userLogout;
  window.userLogin = userLogin;
  window.getUserOrders = getUserOrders;
  window.seedSampleOrders = seedSampleOrders;
}

document.addEventListener('DOMContentLoaded', () => {
  seedSampleOrders();
});
