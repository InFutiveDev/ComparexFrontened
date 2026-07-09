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
    return [
      ...websiteRoutes.map((route) => ({
        source: `/${route}`,
        destination: `/website/${route}`,
      })),
      {
        source: "/compare-pg/:slug",
        destination: "/website/compare-pg/:slug",
      },
    ];
  },
};

export default nextConfig;
