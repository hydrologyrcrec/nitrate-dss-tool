import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = {
  transpilePackages: ['leaflet'],
};

export default nextConfig;
