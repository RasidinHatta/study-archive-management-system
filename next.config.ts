import type { NextConfig } from "next";
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) config.plugins.push(new PrismaPlugin());
    return config;
  },

  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'github.com', pathname: '/shadcn.png' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    qualities: [75, 80],              // <-- stops the quality warning
  },

  allowedDevOrigins: ['http://10.203.106.185'], // <-- space removed

  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
};

export default nextConfig;