import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["api.smkprestasiprima.sch.id"],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "api.smkprestasiprima.sch.id",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "api.smkprestasiprima.sch.id",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000",
                pathname: "/storage/**",
            },
        ],
    },
    typedRoutes: false,
};

export default nextConfig;
