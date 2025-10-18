import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode : false
};
module.exports = {
  images: {
    // no external flag CDN required; we use simple ID/EN labels instead
    domains: [],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
