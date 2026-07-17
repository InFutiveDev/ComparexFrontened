import { PortalHome } from "@/components/portal/portal-home";
import { USER_ROLES } from "@/lib/account-roles";

export default function MerchantDashboardPage() {
  return (
    <PortalHome
      role={USER_ROLES.MERCHANT}
      title="Welcome to your merchant portal"
      description="Track your CompareX application, review payment recommendations, and get support — all in one place."
      cards={[
        {
          href: "/merchant-dashboard/profile",
          title: "My Profile",
          description: "View and manage your merchant account details.",
        },
        {
          href: "/merchant-dashboard/recommendations",
          title: "Compare Payment Gateways",
          description: "Compare active PGs by MDR, TAT, categories, features, and ratings.",
        },
        {
          href: "/merchant-dashboard/support",
          title: "Support",
          description: "Raise tickets and follow up with the CompareX support team.",
        },
      ]}
    />
  );
}
