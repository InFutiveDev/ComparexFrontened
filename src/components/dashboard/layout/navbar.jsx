"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HiArrowRightOnRectangle,
  HiBell,
  HiCog6Tooth,
  HiOutlineMagnifyingGlass,
  HiUserCircle,
} from "react-icons/hi2";
import { useAuth } from "@/components/auth/auth-provider";
import { useDashboard } from "@/components/dashboard/layout/dashboard-context";

const initialNotifications = [
  {
    id: "ntf-1",
    title: "New lead assigned",
    message: "Meera Kapoor from Blue Orbit submitted a new inquiry.",
    time: "5 min ago",
    read: false,
    href: "/dashboard/leads",
  },
  {
    id: "ntf-2",
    title: "Meeting scheduled",
    message: "Talk to Expert call booked for tomorrow at 11:00 AM.",
    time: "1 hr ago",
    read: false,
    href: "/dashboard/leads",
  },
  {
    id: "ntf-3",
    title: "Weekly report ready",
    message: "Your leads performance report is ready to review.",
    time: "3 hrs ago",
    read: true,
    href: "/dashboard/reports",
  },
  {
    id: "ntf-4",
    title: "Onboarding update",
    message: "PayU merchant onboarding moved to the next stage.",
    time: "Yesterday",
    read: true,
    href: "/dashboard/leads",
  },
];

const searchInputClass =
  "w-full rounded-full border border-slate-200/90 bg-white py-2.5 pl-11 pr-4 text-sm text-[#13203F] shadow-[0_1px_4px_rgba(19,32,63,0.06)] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF]/40 focus:ring-2 focus:ring-[#40C3CF]/15";

export function DashboardNavbar({ onOpenMenu }) {
  const { leadSearch, setLeadSearch } = useDashboard();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return;

    function handleClickOutside(event) {
      if (profileOpen && !profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsOpen && !notificationsRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen, notificationsOpen]);

  function markNotificationRead(id) {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }

  function markAllNotificationsRead() {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  }

  function handleNotificationClick(notification) {
    markNotificationRead(notification.id);
    setNotificationsOpen(false);
    router.push(notification.href);
  }

  function handleSearchChange(value) {
    setLeadSearch(value);

    const onLeadsView = pathname === "/dashboard" || pathname === "/dashboard/leads";
    if (value.trim() && !onLeadsView) {
      router.push("/dashboard/leads");
    }
  }

  function handleSearchKeyDown(event) {
    if (event.key === "Enter" && leadSearch.trim()) {
      router.push("/dashboard/leads");
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f4f7fc]">
      <div className="relative flex items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm lg:hidden"
          >
            Menu
          </button>
          <h1 className="truncate text-base font-semibold text-[#13203F] sm:text-lg">Dashboard</h1>
        </div>

        <label className="absolute left-1/2 hidden w-full max-w-md -translate-x-1/2 sm:block">
          <span className="sr-only">Search leads</span>
          <HiOutlineMagnifyingGlass
            className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#13203F]/55"
            aria-hidden
          />
          <input
            type="search"
            value={leadSearch}
            onChange={(event) => handleSearchChange(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search.."
            className={searchInputClass}
          />
        </label>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                setNotificationsOpen((open) => !open);
              }}
              className="relative flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-[#13203F] transition hover:border-[#2D4CC8]/30 hover:bg-slate-50"
              aria-expanded={notificationsOpen}
              aria-haspopup="menu"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            >
              <HiBell className="size-5" aria-hidden />
              {unreadCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#25a36f] text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 sm:w-96"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-[#13203F]">Notifications</p>
                  {unreadCount > 0 ? (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="cursor-pointer text-xs font-semibold text-[#2D4CC8] transition hover:text-[#40C3CF]"
                    >
                      Mark all read
                    </button>
                  ) : null}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</p>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        role="menuitem"
                        onClick={() => handleNotificationClick(notification)}
                        className={`flex w-full cursor-pointer gap-3 border-b border-slate-50 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${
                          notification.read ? "bg-white" : "bg-[#EEF2FC]/60"
                        }`}
                      >
                        <span
                          className={`mt-1.5 size-2 shrink-0 rounded-full ${
                            notification.read ? "bg-transparent" : "bg-[#2D4CC8]"
                          }`}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-[#13203F]">{notification.title}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                            {notification.message}
                          </span>
                          <span className="mt-1 block text-[11px] text-slate-400">{notification.time}</span>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(false);
                setProfileOpen((open) => !open);
              }}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#2D4CC8] to-[#40C3CF] text-sm font-bold text-white shadow-sm shadow-[#2D4CC8]/20 transition hover:brightness-110"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label="Account menu"
            >
              CX
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
                  href="/dashboard/settings"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-[#13203F] transition hover:bg-slate-50"
                >
                  <HiUserCircle className="size-4 text-[#25a36f]" aria-hidden />
                  Profile & Settings
                </Link>
                <Link
                  href="/dashboard/settings"
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
      </div>

      <label className="relative block px-4 py-2.5 sm:hidden">
        <span className="sr-only">Search leads</span>
        <HiOutlineMagnifyingGlass
          className="pointer-events-none absolute left-8 top-1/2 size-[18px] -translate-y-1/2 text-[#13203F]/55"
          aria-hidden
        />
        <input
          type="search"
          value={leadSearch}
          onChange={(event) => handleSearchChange(event.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search.."
          className={searchInputClass}
        />
      </label>
    </header>
  );
}
