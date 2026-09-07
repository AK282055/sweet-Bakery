import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          shop: path.resolve(__dirname, 'shop.html'),
          product: path.resolve(__dirname, 'product.html'),
          cart: path.resolve(__dirname, 'cart.html'),
          checkout: path.resolve(__dirname, 'checkout.html'),
          orderSuccess: path.resolve(__dirname, 'order-success.html'),
          about: path.resolve(__dirname, 'about.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          account: path.resolve(__dirname, 'account.html'),
          wishlist: path.resolve(__dirname, 'wishlist.html'),
          faq: path.resolve(__dirname, 'faq.html'),
          privacyPolicy: path.resolve(__dirname, 'privacy-policy.html'),
          terms: path.resolve(__dirname, 'terms.html'),
          shippingPolicy: path.resolve(__dirname, 'shipping-policy.html'),
          refundPolicy: path.resolve(__dirname, 'refund-policy.html'),
        },
      },
    },
  };
});
