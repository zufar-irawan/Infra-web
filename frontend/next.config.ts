import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode : false
};
module.exports = {
  images: {
    domains: ["flagcdn.com"],
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
