"use client";

import { RequireRole } from "@/components/auth/require-role";
import { PortalShell } from "@/components/portal/portal-shell";
import { USER_ROLES } from "@/lib/account-roles";

export default function ResellerDashboardLayout({ children }) {
  return (
    <RequireRole allowedRoles={USER_ROLES.RESELLER}>
      <PortalShell
        basePath="/reseller-dashboard"
        role={USER_ROLES.RESELLER}
        title="Reseller Dashboard"
      >
        {children}
      </PortalShell>
    </RequireRole>
  );
}
