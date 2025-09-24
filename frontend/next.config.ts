import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode : false
};
module.exports = {
  images: {
    domains: ["flagcdn.com"],
  },
};

export default nextConfig;
