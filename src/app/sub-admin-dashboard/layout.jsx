"use client";

import { RequireRole } from "@/components/auth/require-role";
import { SubAdminShell } from "@/components/sub-admin/sub-admin-shell";
import { USER_ROLES } from "@/lib/account-roles";

export default function SubAdminDashboardLayout({ children }) {
  return (
    <RequireRole allowedRoles={[USER_ROLES.SUB_ADMIN, USER_ROLES.ADMIN]}>
      <SubAdminShell>{children}</SubAdminShell>
    </RequireRole>
  );
}
