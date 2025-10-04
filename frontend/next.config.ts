import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'flagcdn.com'
            },
            {
                protocol: 'https',
                hostname: 'cdn-icons-png.flaticon.com'
            },
        ]
    }
};

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig);
