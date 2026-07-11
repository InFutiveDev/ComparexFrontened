import { PortalHome } from "@/components/portal/portal-home";
import { USER_ROLES } from "@/lib/account-roles";

export default function PaymentGatewayDashboardPage() {
  return (
    <PortalHome
      role={USER_ROLES.PAYMENT_PROVIDER}
      title="Welcome to your payment gateway portal"
      description="Manage your provider profile, integrations, and CompareX partnership from one place."
      cards={[
        {
          href: "/payment-gateway-dashboard/profile",
          title: "My Profile",
          description: "View and update your payment provider profile.",
        },
        {
          href: "/payment-gateway-dashboard/integrations",
          title: "Integrations",
          description: "Track integration status and technical readiness.",
        },
        {
          href: "/payment-gateway-dashboard/support",
          title: "Help & Support",
          description: "Get help with onboarding and partnership requests.",
        },
      ]}
    />
  );
}
