import type { NextConfig } from "next";

/**
 * Ednova Next.js Configuration
 *
 * BUILD MODES:
 * 1. npm run build (default): Server-side rendering with Server Actions support
 * 2. npm run build:mobile: Static export for Capacitor mobile builds
 *
 * Static export cannot use Server Actions - mobile builds should use API routes
 * or the pre-built web assets in android/app/src/main/assets/public/
 */
const nextConfig: NextConfig = {
  /* Default: Server-side rendering (supports Server Actions) */
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  pageExtensions: ['tsx', 'ts'],
};

export default nextConfig;
