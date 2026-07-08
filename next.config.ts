import type { NextConfig } from "next";

// Serve the site from a subpath (e.g. GitHub Pages project sites) by setting
// NEXT_PUBLIC_BASE_PATH to a path starting with "/" (e.g. "/my-portfolio").
// Left unset, the site is served from the root exactly as before.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
