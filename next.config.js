const runtimeCaching = require("next-pwa/cache");
const { createSecureHeaders } = require("next-secure-headers");

const isProduction = process.env.NODE_ENV === "production";

const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching,
  disable: !isProduction,
});

/**
 * @type {import('next').NextConfig}
 */
module.exports = withPWA({
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.gr-assets.com",
      },
    ],
  },
  experimental: {
    runtime: "experimental-edge",
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
