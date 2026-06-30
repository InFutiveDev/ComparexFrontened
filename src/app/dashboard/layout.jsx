import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

export default function DashboardLayout({ children }) {
  return (
    <RequireAuth>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}
