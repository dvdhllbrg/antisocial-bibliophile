const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: process.env.NODE_ENV !== 'production',
  },
  images: {
    domains: ['images.gr-assets.com', 'i.gr-assets.com', 's.gr-assets.com'],
  },
});
