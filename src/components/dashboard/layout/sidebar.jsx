"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HiArrowRightOnRectangle,
  HiBuildingStorefront,
  HiCalendarDays,
  HiChartBarSquare,
  HiChatBubbleLeftRight,
  HiChevronUp,
  HiCog6Tooth,
  HiCreditCard,
  HiLifebuoy,
  HiSquares2X2,
  HiStar,
  HiUserGroup,
} from "react-icons/hi2";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: HiSquares2X2 },
  { href: "/dashboard/merchants", label: "Merchants", icon: HiBuildingStorefront },
  { href: "/dashboard/resellers", label: "Resellers", icon: HiUserGroup },
  { href: "/dashboard/payment-gateways", label: "Payment Gateways", icon: HiCreditCard },
  { href: "/dashboard/merchant-support", label: "Merchant Support", icon: HiChatBubbleLeftRight },
  { href: "/dashboard/talk-to-expert", label: "Talk to Expert", icon: HiCalendarDays },
  { href: "/dashboard/reviews-ratings", label: "Reviews & Ratings", icon: HiStar },
  { href: "/dashboard/reports", label: "Reports", icon: HiChartBarSquare },
  { href: "/dashboard/settings", label: "Settings", icon: HiCog6Tooth },
  { href: "/dashboard/help-support", label: "Help & Support", icon: HiLifebuoy },
];

function isActive(pathname, href) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ pathname, onNavigate }) {
  const [essentialsOpen, setEssentialsOpen] = useState(true);
  const activeCount = navItems.filter((item) => !item.comingSoon).length;

  return (
    <div className="flex h-full flex-col bg-[#f4f7fc]">
      <div className="border-b border-slate-200/80 px-5 py-3 flex justify-start items-center gap-3">
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
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Essentials</span>
          <span className="flex size-5 items-center justify-center rounded-full bg-[#25a36f] text-[10px] font-bold text-white">
            {activeCount}
          </span>
          <HiChevronUp
            className={`ml-auto size-4 text-slate-400 transition-transform ${essentialsOpen ? "" : "rotate-180"}`}
            aria-hidden
          />
        </button>

        {essentialsOpen ? (
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = !item.comingSoon && isActive(pathname, item.href);

              if (item.comingSoon) {
                return (
                  <div
                    key={item.label}
                    className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 opacity-45"
                    aria-disabled="true"
                  >
                    <Icon className="size-5 shrink-0 text-[#40C3CF]" aria-hidden />
                    <span className="text-sm font-medium text-[#13203F]">{item.label}</span>
                  </div>
                );
              }

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
            C
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">CompareX</p>
            <p className="truncate text-xs text-white/80">Admin</p>
          </div>
          <button
            type="button"
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

export function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden h-screen w-[272px] shrink-0 border-r border-slate-200/80 lg:sticky lg:top-0 lg:block">
        <SidebarContent pathname={pathname} />
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
            <SidebarContent pathname={pathname} onNavigate={onClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
