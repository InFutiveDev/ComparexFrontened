"use client";

import { RequireRole } from "@/components/auth/require-role";
import { PortalShell } from "@/components/portal/portal-shell";
import { USER_ROLES } from "@/lib/account-roles";

export default function PaymentGatewayDashboardLayout({ children }) {
  return (
    <RequireRole allowedRoles={USER_ROLES.PAYMENT_PROVIDER}>
      <PortalShell
        basePath="/payment-gateway-dashboard"
        role={USER_ROLES.PAYMENT_PROVIDER}
        title="Payment Gateway Dashboard"
      >
        {children}
      </PortalShell>
    </RequireRole>
  );
}
