import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const websiteRoutes = [
  "home",
  "about",
  "how-it-works",
  "contact",
  "features",
  "pricing",
  "login",
  "register",
  "get-started",
  "careers",
  "why-comparex",
  "compare-pg",
  "merchant-support",
  "merchant",
  "merchant/form",
  "reseller",
  "reseller/apply-as-reseller-form",
  "reseller/form",
  "payment",
  "payment/form",
  "privacy-policy",
  "terms-and-conditions",
  "resources",
  "tools",
  "reviews",
  "talk-to-expert",
  "pg-plugin",
  "compare-side",
];

const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    const rewrites = [
      ...websiteRoutes.map((route) => ({
        source: `/${route}`,
        destination: `/website/${route}`,
      })),
      {
        source: "/compare-pg/:slug",
        destination: "/website/compare-pg/:slug",
      },
    ];

    const apiProxyTarget = (
      process.env.API_PROXY_TARGET ||
      process.env.LIVE_API_URL ||
      "http://100.54.237.0/api"
    ).replace(/\/$/, "");
    const useLocalBackend = process.env.USE_LOCAL_API === "true";
    const localApiTarget = (
      process.env.LOCAL_API_URL || "http://127.0.0.1:3001/api"
    ).replace(/\/$/, "");

    if (process.env.NODE_ENV === "development" && process.env.DISABLE_API_PROXY !== "true") {
      rewrites.unshift({
        source: "/api/:path*",
        destination: useLocalBackend
          ? `${localApiTarget}/:path*`
          : `${apiProxyTarget}/:path*`,
      });
    }

    return rewrites;
  },
};

export default nextConfig;
