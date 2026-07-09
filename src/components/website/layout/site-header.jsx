"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiChevronDown, HiXMark } from "react-icons/hi2";
import { useTalkToExpert } from "@/components/website/talk-to-expert/talk-to-expert-provider";

const routes = {
  home: "/",
  login: "/login",
};

const toolsNavItems = [
  { href: "/tools", label: "PG Calculator" },
  { href: "/pg-plugin", label: "PG Plugin Finder" },
];

const headerNavItems = [
  { href: "/about", label: "About Us" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/why-comparex", label: "Why CompareX" },
  { href: "/compare-pg", label: "Compare" },
  { action: "talk-to-expert", label: "Talk to Expert" },
  { label: "Tools", children: toolsNavItems },
  // { href: "/resources", label: "Resources" },
  { href: "/#merchant-assistance-desk", label: "Merchant Support" },
];

function isNavItemActive(pathname, href, hash = "") {
  if (href.includes("#")) {
    const [, anchor] = href.split("#");
    if (!anchor) return false;
    return hash === `#${anchor}`;
  }
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const desktopNavLinkClass =
  "relative inline-block pb-0.5 text-[16px] font-medium text-black transition-colors duration-300 after:pointer-events-none after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-[#2D4CC8] after:transition-transform after:duration-300 after:ease-out hover:!text-[#2D4CC8] hover:after:scale-x-100";

const desktopNavLinkActiveClass = "!text-[#2D4CC8] after:scale-x-100";

function MenuIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function isToolsNavActive(pathname) {
  return pathname === "/tools" || pathname.startsWith("/tools/");
}

function DesktopToolsDropdown({ pathname, onNavigate }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isActive = isToolsNavActive(pathname);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${desktopNavLinkClass} inline-flex items-center gap-1 ${isActive ? desktopNavLinkActiveClass : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Tools
        <HiChevronDown
          className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 min-w-[220px] -translate-x-1/2 pt-3 transition-all duration-200 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
        role="menu"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-[0_16px_40px_-20px_rgba(19,32,63,0.35)]">
          {toolsNavItems.map((child) => {
            const childActive = isNavItemActive(pathname, child.href);

            return (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                className={`block px-4 py-2.5 text-[15px] font-medium transition hover:bg-[#f2f6fb] hover:text-[#2D4CC8] ${
                  childActive ? "bg-[#2D4CC8]/10 text-[#2D4CC8]" : "text-[#13203F]"
                }`}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileToolsNav({ pathname, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const isActive = isToolsNavActive(pathname);

  return (
    <li>
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-[15px] font-medium transition ${
          isActive
            ? "bg-[#2D4CC8]/10 font-semibold text-[#2D4CC8]"
            : "text-[#13203F] hover:bg-[#f2f6fb] hover:text-[#2D4CC8]"
        }`}
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        Tools
        <HiChevronDown
          className={`size-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {expanded ? (
        <ul className="mt-1 space-y-1 pl-3">
          {toolsNavItems.map((child) => {
            const childActive = isNavItemActive(pathname, child.href);

            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={`block rounded-xl px-4 py-3 text-[14px] font-medium transition ${
                    childActive
                      ? "bg-[#2D4CC8]/10 font-semibold text-[#2D4CC8]"
                      : "text-[#13203F] hover:bg-[#f2f6fb] hover:text-[#2D4CC8]"
                  }`}
                  onClick={onNavigate}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [playScrollIntro, setPlayScrollIntro] = useState(false);
  const [hash, setHash] = useState("");
  const { openTalkToExpert } = useTalkToExpert();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      setPlayScrollIntro(false);
      return;
    }

    let rafA = 0;
    let rafB = 0;
    const onScroll = () => {
      const nextScrolled = window.scrollY > 20;
      setIsScrolled((prev) => {
        if (!prev && nextScrolled) {
          setPlayScrollIntro(true);
          rafA = window.requestAnimationFrame(() => {
            rafB = window.requestAnimationFrame(() => setPlayScrollIntro(false));
          });
        }
        return nextScrolled;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, [isHome]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header
        className={`top-0 z-40 w-full ${isHome
            ? isScrolled
              ? "fixed left-0 right-0 border-b border-white/20 bg-[#f4f6fc] backdrop-blur-md"
              : "absolute left-0 right-0 border-b border-white/20 bg-[#f4f6fc] backdrop-blur-md"
            : "sticky border-b border-white/20 bg-[#f4f6fc] backdrop-blur"
          } transition-all duration-500 ease-out ${isHome
            ? isScrolled && playScrollIntro
              ? "-translate-y-4 opacity-0"
              : "translate-y-0 opacity-100"
            : "translate-y-0 opacity-100"
          }`}
      >
        <div className="mx-auto flex max-w-8xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href={routes.home} className="text-lg font-bold text-slate-900">
            <Image src="/images/logo.svg" alt="Logo" width={100} height={100} className="h-10 w-auto object-contain sm:h-12 lg:h-14" />
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {headerNavItems.map((item) => {
              if (item.action === "talk-to-expert") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={openTalkToExpert}
                    className={desktopNavLinkClass}
                  >
                    {item.label}
                  </button>
                );
              }

              if (item.children) {
                return <DesktopToolsDropdown key={item.label} pathname={pathname} />;
              }

              const isActive = isNavItemActive(pathname, item.href, hash);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${desktopNavLinkClass} ${isActive ? desktopNavLinkActiveClass : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={routes.login}
              className="group relative inline-flex h-[calc(40px+6px)] items-center justify-center rounded-full bg-[#2D4CC8] py-1  pl-6 pr-14 font-medium text-white"
              style={{ color: "#fff" }}
            >
              <span className="z-10 pr-2 text-white">Login</span>
              <div className="absolute right-1 inline-flex h-10 w-10 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
                <div className="mr-3.5 flex items-center justify-center">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-50"
                  >
                    <path
                      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex size-10 items-center justify-center rounded-lg border border-[#2D4CC8]/20 bg-white text-[#2D4CC8] shadow-sm transition hover:border-[#2D4CC8]/40 hover:bg-[#2D4CC8]/5 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <HiXMark className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#13203F]/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[88%] max-w-[340px] flex-col bg-white shadow-[4px_0_40px_rgba(19,32,63,0.18)] transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        {/* Drawer header */}
        <div className="relative shrink-0 border-b border-slate-100 px-5 py-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#40C3CF] via-[#2D4CC8] to-[#25a36f]" aria-hidden />
          <div className="flex items-center justify-between pt-1">
            <Link href={routes.home} onClick={() => setOpen(false)}>
              <Image
                src="/images/logo.svg"
                alt="CompareX"
                width={100}
                height={100}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-[#2D4CC8]/30 hover:bg-[#2D4CC8]/5 hover:text-[#2D4CC8]"
              aria-label="Close menu"
            >
              <HiXMark className="size-5" />
            </button>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Navigation
          </p>
          <ul className="space-y-1">
            {headerNavItems.map((item) => {
              if (item.action === "talk-to-expert") {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      className="block w-full rounded-xl px-4 py-3.5 text-left text-[15px] font-medium text-[#13203F] transition hover:bg-[#f2f6fb] hover:text-[#2D4CC8]"
                      onClick={() => {
                        openTalkToExpert();
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              }

              if (item.children) {
                return (
                  <MobileToolsNav
                    key={item.label}
                    pathname={pathname}
                    onNavigate={() => setOpen(false)}
                  />
                );
              }

              const isActive = isNavItemActive(pathname, item.href, hash);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-xl px-4 py-3.5 text-[15px] font-medium transition ${
                      isActive
                        ? "bg-[#2D4CC8]/10 font-semibold text-[#2D4CC8]"
                        : "text-[#13203F] hover:bg-[#f2f6fb] hover:text-[#2D4CC8]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer CTA */}
        <div className="shrink-0 border-t border-slate-100 bg-[#f8fafc] px-5 py-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Get Started
          </p>
          <Link
            href={routes.login}
            className="mb-3 flex w-full items-center justify-center rounded-full border-2 border-[#2D4CC8] px-4 py-3 text-sm font-semibold text-[#2D4CC8] transition hover:bg-[#2D4CC8]/5"
            onClick={() => setOpen(false)}
          >
           Login
          </Link>
          
        </div>
      </aside>
    </>
  );
}
