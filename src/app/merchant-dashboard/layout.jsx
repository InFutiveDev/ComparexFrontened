"use client";

import { RequireRole } from "@/components/auth/require-role";
import { PortalShell } from "@/components/portal/portal-shell";
import { USER_ROLES } from "@/lib/account-roles";

export default function MerchantDashboardLayout({ children }) {
  return (
    <RequireRole allowedRoles={USER_ROLES.MERCHANT}>
      <PortalShell
        basePath="/merchant-dashboard"
        role={USER_ROLES.MERCHANT}
        title="Merchant Dashboard"
      >
        {children}
      </PortalShell>
    </RequireRole>
  );
}
