const notificationsEnabled =
  process.env.NEXT_PUBLIC_NOTIFICATIONS_ENABLED === "true";

export const MERCHANT_PORTAL_NAV = [
  { href: "/merchant-dashboard", label: "Overview", icon: "squares" },
  { href: "/merchant-dashboard/submit-lead", label: "Submit Lead", icon: "document" },
  {
    href: "/merchant-dashboard/talk-to-expert",
    label: "Talk to Expert",
    icon: "chat",
  },
  {
    href: "/merchant-dashboard/reviews",
    label: "Ratings & Reviews",
    icon: "document",
  },
  { href: "/merchant-dashboard/profile", label: "My Profile", icon: "user" },
  {
    href: "/merchant-dashboard/recommendations",
    label: "Compare Payment Gateways",
    icon: "document",
  },
  ...(notificationsEnabled
    ? [{ href: "/merchant-dashboard/notifications", label: "Notifications", icon: "document" }]
    : []),
  { href: "/merchant-dashboard/support", label: "Support", icon: "chat" },
  { href: "/merchant-dashboard/settings", label: "Settings", icon: "cog" },
];

export const RESELLER_PORTAL_NAV = [
  { href: "/reseller-dashboard", label: "Overview", icon: "squares" },
  { href: "/reseller-dashboard/profile", label: "Complete Profile", icon: "user" },
  { href: "/reseller-dashboard/merchants", label: "Merchants", icon: "users" },
  { href: "/reseller-dashboard/commissions", label: "Commissions", icon: "chart" },
  { href: "/reseller-dashboard/settings", label: "Settings", icon: "cog" },
];

export const PAYMENT_GATEWAY_PORTAL_NAV = [
  { href: "/payment-gateway-dashboard", label: "Overview", icon: "squares" },
  { href: "/payment-gateway-dashboard/leads", label: "Leads", icon: "document" },
  {
    href: "/payment-gateway-dashboard/experts",
    label: "Expert Routing",
    icon: "users",
  },
  { href: "/payment-gateway-dashboard/profile", label: "Onboarding Profile", icon: "user" },
  { href: "/payment-gateway-dashboard/support", label: "Help & Support", icon: "lifebuoy" },
  {
    href: "/payment-gateway-dashboard/settings",
    label: "Profile & Configuration",
    icon: "cog",
  },
];
