import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/payment-success',
        destination: '/payment/success',
        permanent: false,
      },
      {
        source: '/payment-cancelled',
        destination: '/payment/cancel',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
