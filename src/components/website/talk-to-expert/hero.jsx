"use client";

import { HiCalendarDays } from "react-icons/hi2";

export default function HeroSection({ onTalkToExpert }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80">
      <div className="absolute inset-0 bg-gradient-to-br from-[#eff4ff] via-[#eef2fc] to-[#ecfdf5]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.06) 26px, rgba(45,76,200,0.06) 27px)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <span className="inline-block rounded-full border border-[#2D4CC8]/20 bg-white/80 px-4 py-1 text-sm font-medium text-[#2D4CC8] backdrop-blur-sm">
          Talk to Expert
        </span>

        <h1 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-[#13203F] sm:text-4xl lg:text-5xl">
          Get Expert Advice on Your Business Needs
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          Connect with PG representatives or independent industry experts and schedule a call at
          your convenience.
        </p>

        {onTalkToExpert ? (
          <button
            type="button"
            onClick={onTalkToExpert}
            className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110"
            style={{ color: "#fff" }}
          >
            <HiCalendarDays className="size-5" aria-hidden />
            Talk to Expert
          </button>
        ) : null}
      </div>
    </section>
  );
}
