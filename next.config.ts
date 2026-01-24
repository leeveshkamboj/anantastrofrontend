import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to support dynamic routes in admin pages
  // If static export is required, consider using query parameters instead of dynamic routes
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
