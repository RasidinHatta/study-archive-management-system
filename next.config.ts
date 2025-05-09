import type { NextConfig } from "next";
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  },
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google's image domain for profile pics
      },
      {
        protocol: "https",
        hostname: "github.com", // GitHub image domain
        pathname: "/shadcn.png", // Optional: specific image path pattern if needed
      },
    ],
  },
};

export default nextConfig;
