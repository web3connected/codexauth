
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Exclude archived files from page routing
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Server mode for dynamic rendering and API routes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  transpilePackages: ['@web3codex/global-assets', '@web3codex/react-codex-auth', '@web3codex/components'],
  experimental: {
    externalDir: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Allow importing from external directories (GlobalAssets)
    config.resolve.modules.push(path.resolve('./node_modules'));
    
    // STABLE DEV CONFIG: Enable proper HMR with optimized file watching
    if (dev && !isServer) {
      config.watchOptions = {
        ignored: /node_modules/,
        aggregateTimeout: 200,
      }
    }
    return config;
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Dev indicators (Turbopack compatible)
  devIndicators: {
    position: 'bottom-right',
  },
};

export default nextConfig;
