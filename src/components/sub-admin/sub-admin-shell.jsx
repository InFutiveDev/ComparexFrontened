"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiArrowRightOnRectangle,
  HiClipboardDocumentList,
  HiCloudArrowUp,
  HiSquares2X2,
  HiUserGroup,
} from "react-icons/hi2";
import { useAuth } from "@/components/auth/auth-provider";
import { formatRoleLabel } from "@/lib/account-roles";

const navItems = [
  { href: "/sub-admin-dashboard", label: "Overview", icon: HiSquares2X2 },
  { href: "/sub-admin-dashboard/leads", label: "Lead Qualification", icon: HiClipboardDocumentList },
  { href: "/sub-admin-dashboard/assign", label: "Lead Assignment", icon: HiUserGroup },
  { href: "/sub-admin-dashboard/bulk-upload", label: "Bulk Upload", icon: HiCloudArrowUp },
];

function isActive(pathname, href) {
  if (href === "/sub-admin-dashboard") return pathname === "/sub-admin-dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ pathname, onNavigate }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const initials = (user?.name || "SA")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full flex-col bg-[#f4f7fc]">
      <div className="flex items-center gap-3 border-b border-slate-200/80 px-5 py-3">
        <Image
          src="/images/logo.svg"
          alt="CompareX"
          width={200}
          height={40}
          className="w-auto max-w-[180px] object-contain"
          priority
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Sub Admin Panel
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-500 !text-white shadow-md shadow-[#2D4CC8]/25"
                    : "text-blue-500 hover:bg-blue-500/10"
                }`}
              >
                <Icon
                  className={`size-5 shrink-0 ${active ? "text-white" : "text-blue-500"}`}
                  aria-hidden
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200/80 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#2D4CC8] text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#13203F]">{user?.name || "—"}</p>
            <p className="truncate text-xs text-slate-500">{formatRoleLabel(user?.role)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-600"
        >
          <HiArrowRightOnRectangle className="size-4" aria-hidden />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function SubAdminShell({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#13203F]/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-slate-200 bg-[#f4f7fc] shadow-xl">
            <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#13203F] lg:hidden"
          >
            Menu
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2D4CC8]">
              Lead operations
            </p>
            <h1 className="text-sm font-bold text-[#13203F] sm:text-base">
              Sub Admin Panel
            </h1>
          </div>
          <div className="hidden text-xs text-slate-500 sm:block">FR-SA-01 → FR-SA-05</div>
        </header>
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
