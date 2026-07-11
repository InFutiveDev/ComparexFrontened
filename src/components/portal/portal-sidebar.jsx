"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiArrowRightOnRectangle,
  HiChartBarSquare,
  HiChatBubbleLeftRight,
  HiChevronUp,
  HiCog6Tooth,
  HiCreditCard,
  HiDocumentText,
  HiLifebuoy,
  HiSquares2X2,
  HiUserCircle,
  HiUserGroup,
} from "react-icons/hi2";
import { useAuth } from "@/components/auth/auth-provider";
import { formatRoleLabel } from "@/lib/account-roles";

const PORTAL_ICONS = {
  squares: HiSquares2X2,
  user: HiUserCircle,
  document: HiDocumentText,
  chat: HiChatBubbleLeftRight,
  cog: HiCog6Tooth,
  users: HiUserGroup,
  chart: HiChartBarSquare,
  card: HiCreditCard,
  lifebuoy: HiLifebuoy,
};

function isActive(pathname, href, basePath) {
  if (href === basePath) return pathname === basePath;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function PortalSidebarContent({ pathname, navItems, basePath, roleLabel, onNavigate }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [essentialsOpen, setEssentialsOpen] = useState(true);
  const initials = (user?.name || roleLabel || "CX")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full flex-col bg-[#f4f7fc]">
      <div className="flex items-center justify-start gap-3 border-b border-slate-200/80 px-5 py-3">
        <Image
          src="/images/logo.svg"
          alt="CompareX"
          width={200}
          height={40}
          className="w-auto max-w-[200px] object-contain"
          priority
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <button
          type="button"
          onClick={() => setEssentialsOpen((open) => !open)}
          className="mb-2 flex w-full cursor-pointer items-center gap-2 px-2 py-1 text-left"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Essentials
          </span>
          <span className="flex size-5 items-center justify-center rounded-full bg-[#25a36f] text-[10px] font-bold text-white">
            {navItems.length}
          </span>
          <HiChevronUp
            className={`ml-auto size-4 text-slate-400 transition-transform ${
              essentialsOpen ? "" : "rotate-180"
            }`}
            aria-hidden
          />
        </button>

        {essentialsOpen ? (
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = PORTAL_ICONS[item.icon] || HiSquares2X2;
              const active = isActive(pathname, item.href, basePath);

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
        ) : null}
      </div>

      <div className="border-t border-slate-200/80 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-blue-500 p-3 shadow-lg shadow-[#2D4CC8]/20">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user?.name || "CompareX"}</p>
            <p className="truncate text-xs text-white/80">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white text-[#2D4CC8] transition hover:bg-white/90"
            aria-label="Log out"
          >
            <HiArrowRightOnRectangle className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function PortalSidebar({ open, onClose, navItems, basePath, role }) {
  const pathname = usePathname();
  const roleLabel = formatRoleLabel(role);

  return (
    <>
      <aside className="hidden h-screen w-[272px] shrink-0 border-r border-slate-200/80 lg:sticky lg:top-0 lg:block">
        <PortalSidebarContent
          pathname={pathname}
          navItems={navItems}
          basePath={basePath}
          roleLabel={roleLabel}
        />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#13203F]/40 backdrop-blur-[1px]"
            onClick={onClose}
            aria-label="Close menu"
          />
          <aside className="relative h-full w-[288px] border-r border-slate-200/80 shadow-2xl">
            <PortalSidebarContent
              pathname={pathname}
              navItems={navItems}
              basePath={basePath}
              roleLabel={roleLabel}
              onNavigate={onClose}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}
