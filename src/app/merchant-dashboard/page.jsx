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
          href: "/merchant-dashboard/submit-lead",
          title: "Submit Lead",
          description: "Share your business category and estimated monthly payment volume.",
        },
        {
          href: "/merchant-dashboard/talk-to-expert",
          title: "Talk to Expert",
          description: "Select an available advisor and schedule a consultation in Calendly.",
        },
        {
          href: "/merchant-dashboard/reviews",
          title: "Ratings & Reviews",
          description: "Rate payment gateways and your overall CompareX platform experience.",
        },
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
