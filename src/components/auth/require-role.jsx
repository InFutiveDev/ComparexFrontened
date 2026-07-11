"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { RequireAuth } from "@/components/auth/require-auth";
import { getDashboardPathForRole } from "@/lib/account-roles";

function RoleGate({ allowedRoles, children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const role = user?.role;
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const isAllowed = Boolean(role && allowed.includes(role));

  useEffect(() => {
    if (isLoading || !user) return;
    if (!isAllowed) {
      router.replace(getDashboardPathForRole(role));
    }
  }, [isAllowed, isLoading, role, router, user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return children;
}

export function RequireRole({ allowedRoles, children }) {
  return (
    <RequireAuth>
      <RoleGate allowedRoles={allowedRoles}>{children}</RoleGate>
    </RequireAuth>
  );
}
