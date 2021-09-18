const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const { createSecureHeaders } = require('next-secure-headers');

const isProduction = process.env.node === 'production';

module.exports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: !isProduction,
  },
  images: {
    domains: ['images.gr-assets.com', 'i.gr-assets.com', 's.gr-assets.com'],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: createSecureHeaders({
        contentSecurityPolicy: {
          directives: {
            baseURI: "'self'",
            defaultSrc: "'self'",
            scriptSrc: `'self' ${isProduction ? '' : 'unsafe-eval'}`,
            styleSrc: "'self' 'unsafe-inline' data:",
            imgSrc: "'self' https://*.gr-assets.com data: blob:",
          },
        },
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
        referrerPolicy: 'same-origin',
      }),
    }];
  },
});
