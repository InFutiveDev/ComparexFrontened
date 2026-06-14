"use client";

import Link from "next/link";
import { HiArrowUp } from "react-icons/hi2";

const footerLegalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

export function FooterLegalBar() {
  const year = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="border-t border-neutral-200 bg-slate-50">
      <div className="relative mx-auto overflow-hidden bg-neutral-100 px-4 py-5 sm:px-6 sm:py-4 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(0,0,0,0.045) 26px, rgba(0,0,0,0.045) 27px)",
          }}
        />

        <div className="relative flex flex-col gap-5">
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            aria-label="Legal and site links"
          >
            {footerLegalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-700 transition hover:!text-[#0a27c9]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base font-normal text-neutral-600">
              Comparex, {year} © All rights reserved
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group flex cursor-pointer items-center gap-3 self-start sm:self-auto"
            >
              <span className="text-base font-normal text-neutral-800">Back to top</span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D4CC8] text-white transition group-hover:bg-[#3B5BDB]">
                <HiArrowUp className="h-4 w-4" aria-hidden />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
