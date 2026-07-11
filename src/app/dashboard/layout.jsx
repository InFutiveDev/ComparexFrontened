"use client";

import { RequireRole } from "@/components/auth/require-role";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";
import { USER_ROLES } from "@/lib/account-roles";

export default function DashboardLayout({ children }) {
  return (
    <RequireRole allowedRoles={USER_ROLES.ADMIN}>
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  );
}
