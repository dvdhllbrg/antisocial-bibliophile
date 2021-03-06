const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
const { createSecureHeaders } = require("next-secure-headers");

const isProduction = process.env.NODE_ENV === "production";

/**
 * @type {import('next').NextConfig}
 */
module.exports = withPWA({
  swcMinify: true,
  pwa: {
    dest: "public",
    runtimeCaching,
    disable: !isProduction,
  },
  images: {
    domains: ["images.gr-assets.com", "i.gr-assets.com", "s.gr-assets.com"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders(),
      },
    ];
  },
});
