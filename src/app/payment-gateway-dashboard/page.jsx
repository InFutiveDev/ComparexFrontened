import { PortalHome } from "@/components/portal/portal-home";
import { USER_ROLES } from "@/lib/account-roles";

export default function PaymentGatewayDashboardPage() {
  return (
    <PortalHome
      role={USER_ROLES.PAYMENT_PROVIDER}
      title="Welcome to your payment gateway portal"
      description="Manage your provider profile and CompareX partnership from one place."
      cards={[
        {
          href: "/payment-gateway-dashboard/profile",
          title: "Complete Profile",
          description: "Finish onboarding and publish your marketplace profile.",
        },
        {
          href: "/payment-gateway-dashboard/support",
          title: "Help & Support",
          description: "Get help with onboarding and partnership requests.",
        },
        {
          href: "/payment-gateway-dashboard/settings",
          title: "Settings",
          description: "Manage account preferences for your payment gateway portal.",
        },
      ]}
    />
  );
}
