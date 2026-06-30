"use client";

import { useState } from "react";
import { DashboardProvider } from "@/components/dashboard/layout/dashboard-context";
import { DashboardNavbar } from "@/components/dashboard/layout/navbar";
import { Sidebar } from "@/components/dashboard/layout/sidebar";

export function DashboardShell({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardNavbar onOpenMenu={() => setOpen(true)} />
          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
