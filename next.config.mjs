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
  "get-started",
  "careers",
  "why-comparex",
  "compare-pg",
  "merchant-support",
  "merchant",
  "merchant/form",
  "reseller",
  "reseller/form",
  "payment",
  "payment/form",
  "privacy-policy",
  "terms-and-conditions",
  "resources",
  "tools",
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
    return websiteRoutes.map((route) => ({
      source: `/${route}`,
      destination: `/website/${route}`,
    }));
  },
};

export default nextConfig;
