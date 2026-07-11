"use client";

import { useState } from "react";
import { PortalNavbar } from "@/components/portal/portal-navbar";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { USER_ROLES } from "@/lib/account-roles";
import {
  MERCHANT_PORTAL_NAV,
  PAYMENT_GATEWAY_PORTAL_NAV,
  RESELLER_PORTAL_NAV,
} from "@/lib/portal-nav";

const NAV_BY_ROLE = {
  [USER_ROLES.MERCHANT]: MERCHANT_PORTAL_NAV,
  [USER_ROLES.RESELLER]: RESELLER_PORTAL_NAV,
  [USER_ROLES.PAYMENT_PROVIDER]: PAYMENT_GATEWAY_PORTAL_NAV,
};

export function PortalShell({ children, basePath, role, title }) {
  const [open, setOpen] = useState(false);
  const navItems = NAV_BY_ROLE[role] || [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <PortalSidebar
        open={open}
        onClose={() => setOpen(false)}
        navItems={navItems}
        basePath={basePath}
        role={role}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <PortalNavbar
          title={title}
          settingsHref={`${basePath}/settings`}
          onOpenMenu={() => setOpen(true)}
          role={role}
        />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
