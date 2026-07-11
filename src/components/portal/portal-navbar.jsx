"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiArrowRightOnRectangle, HiCog6Tooth, HiUserCircle } from "react-icons/hi2";
import { useAuth } from "@/components/auth/auth-provider";
import { formatRoleLabel } from "@/lib/account-roles";

export function PortalNavbar({ title, settingsHref, onOpenMenu, role }) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();
  const initials = (user?.name || "CX")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!profileOpen) return;

    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f4f7fc]">
      <div className="flex items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm lg:hidden"
          >
            Menu
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-[#13203F] sm:text-lg">{title}</h1>
            <p className="truncate text-xs text-slate-500">{formatRoleLabel(role)} portal</p>
          </div>
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#2D4CC8] to-[#40C3CF] text-sm font-bold text-white shadow-sm shadow-[#2D4CC8]/20 transition hover:brightness-110"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
          >
            {initials}
          </button>

          {profileOpen ? (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10"
            >
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-[#13203F]">{user?.name || "CompareX User"}</p>
                <p className="text-xs text-slate-500">{user?.email || ""}</p>
              </div>
              <Link
                href={settingsHref}
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-[#13203F] transition hover:bg-slate-50"
              >
                <HiUserCircle className="size-4 text-[#25a36f]" aria-hidden />
                Profile & Settings
              </Link>
              <Link
                href={settingsHref}
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-[#13203F] transition hover:bg-slate-50"
              >
                <HiCog6Tooth className="size-4 text-[#40C3CF]" aria-hidden />
                Settings
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                  router.push("/login");
                }}
                className="flex w-full cursor-pointer items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-[#13203F] transition hover:bg-slate-50"
              >
                <HiArrowRightOnRectangle className="size-4 text-[#2D4CC8]" aria-hidden />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
