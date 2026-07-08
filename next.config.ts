import type { NextConfig } from "next";

// Serve the site from a subpath (e.g. GitHub Pages project sites) by setting
// NEXT_PUBLIC_BASE_PATH to a path starting with "/" (e.g. "/my-portfolio").
// Left unset, the site is served from the root exactly as before.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
        // Visiting the bare domain root redirects into the subpath, and any
        // other path outside it redirects to the same path inside it — which
        // renders the app's own 404 page for unknown paths instead of the
        // hosting platform's default error page.
        async redirects() {
          const subpath = basePath.slice(1);
          return [
            { source: "/", destination: basePath, basePath: false, permanent: false },
            {
              source: `/:path((?!${subpath}(?:/|$)).*)`,
              destination: `${basePath}/:path`,
              basePath: false,
              permanent: false,
            },
          ];
        },
      }
    : {}),
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
