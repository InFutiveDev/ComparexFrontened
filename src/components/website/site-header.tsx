"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { headerNavItems, routes } from "@/lib/site-navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [playScrollIntro, setPlayScrollIntro] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

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

  return (
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
      <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-2.5 sm:px-6 lg:px-8">
        <Link href={routes.home} className={`text-lg font-bold ${isHome ? "text-white" : "text-slate-900"}`}>
          <Image src="/images/logo.svg" alt="Logo" width={100} height={100} className="h-10 w-auto object-cover" />

        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {headerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[16px] font-medium ${isHome ? "text-black hover:text-black" : "text-black hover:text-black"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={routes.home}
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
          className={`rounded-md px-3 py-2 text-sm md:hidden ${isHome ? "border border-white/40 text-white" : "border border-slate-300 text-slate-700"
            }`}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className={`px-4 py-3 md:hidden ${isHome ? "border-t border-white/15 bg-slate-950/95" : "border-t border-slate-200 bg-white"}`}>
          <div className="flex flex-col gap-3">
            {headerNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${isHome ? "text-slate-100" : "text-slate-700"}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <p className={`mt-2 text-xs font-semibold uppercase tracking-wide ${isHome ? "text-slate-400" : "text-slate-500"}`}>
              Tools
            </p>
            <Link
              href={routes.tools.pgMdrCalculator}
              className={`text-sm ${isHome ? "text-slate-100" : "text-slate-700"}`}
              onClick={() => setOpen(false)}
            >
              PG Cost (MDR) Calculator
            </Link>
            <Link
              href={routes.tools.pgAssessment}
              className={`text-sm ${isHome ? "text-slate-100" : "text-slate-700"}`}
              onClick={() => setOpen(false)}
            >
              PG Assessment
            </Link>
            <p className={`mt-2 text-xs font-semibold uppercase tracking-wide ${isHome ? "text-slate-400" : "text-slate-500"}`}>
              Resources
            </p>
            <Link
              href={routes.resources.blogs}
              className={`text-sm ${isHome ? "text-slate-100" : "text-slate-700"}`}
              onClick={() => setOpen(false)}
            >
              Blogs
            </Link>
            <Link
              href={routes.resources.learningCenter}
              className={`text-sm ${isHome ? "text-slate-100" : "text-slate-700"}`}
              onClick={() => setOpen(false)}
            >
              Learning Center
            </Link>
            <Link
              href={routes.resources.news}
              className={`text-sm ${isHome ? "text-slate-100" : "text-slate-700"}`}
              onClick={() => setOpen(false)}
            >
              News
            </Link>
            <Link
              href={routes.talkToExpert}
              className="mt-2 rounded-full bg-[#2D4CC8] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#3B5BDB]"
              onClick={() => setOpen(false)}
            >
              Talk to Expert
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
