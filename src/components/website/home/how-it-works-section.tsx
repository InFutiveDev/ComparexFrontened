"use client";

import React, { useState } from "react";
import { HiRocketLaunch, HiSparkles, HiUserPlus } from "react-icons/hi2";

type RoleKey = "merchant" | "reseller" | "vendor";

type Step = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const stepsByRole: Record<RoleKey, Step[]> = {
  merchant: [
    {
      title: "Sign Up & Set Up",
      description:
        "Create your merchant account quickly and configure checkout preferences to match your business flow.",
      Icon: HiUserPlus,
    },
    {
      title: "Connect & Automate",
      description:
        "Integrate payment tools, import catalogs, and automate order or settlement workflows in a few clicks.",
      Icon: HiSparkles,
    },
    {
      title: "Launch & Grow",
      description:
        "Go live confidently, track payment performance, and scale your business with real-time reporting.",
      Icon: HiRocketLaunch,
    },
  ],
  reseller: [
    {
      title: "Create Partner Profile",
      description:
        "Register as a reseller and set your partner profile with service regions and preferred categories.",
      Icon: HiUserPlus,
    },
    {
      title: "Add Clients & Tools",
      description:
        "Onboard client accounts, connect the right software stack, and automate repeated setup tasks.",
      Icon: HiSparkles,
    },
    {
      title: "Manage & Scale",
      description:
        "Monitor client outcomes from one dashboard and grow recurring revenue with smoother operations.",
      Icon: HiRocketLaunch,
    },
  ],
  vendor: [
    {
      title: "List Your Product",
      description:
        "Create your vendor profile, publish product details, and highlight key capabilities for buyers.",
      Icon: HiUserPlus,
    },
    {
      title: "Capture Qualified Leads",
      description:
        "Connect lead channels, automate follow-ups, and route prospects to the right sales workflows.",
      Icon: HiSparkles,
    },
    {
      title: "Convert & Expand",
      description:
        "Close deals faster with better visibility and expand reach through consistent platform exposure.",
      Icon: HiRocketLaunch,
    },
  ],
};

const cardStyles = [
  {
    cardBg: "bg-gradient-to-b from-blue-50 to-white",
    accent: "bg-blue-500",
    chipBg: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-100 border-blue-200",
    iconColor: "text-blue-700",
  },
  {
    cardBg: "bg-gradient-to-b from-violet-50 to-white",
    accent: "bg-violet-500",
    chipBg: "bg-violet-100 text-violet-700",
    iconBg: "bg-violet-100 border-violet-200",
    iconColor: "text-violet-700",
  },
  {
    cardBg: "bg-gradient-to-b from-emerald-50 to-white",
    accent: "bg-emerald-500",
    chipBg: "bg-emerald-100 text-emerald-700",
    iconBg: "bg-emerald-100 border-emerald-200",
    iconColor: "text-emerald-700",
  },
] as const;

export const HowItWorksSection = () => {
  const [activeRole, setActiveRole] = useState<RoleKey>("merchant");
  const steps = stepsByRole[activeRole];

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-8xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            How It Works
          </span>
          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Easy Steps to Get Started
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Pick your role and follow a simple 3-step flow to start faster with the right setup, workflows, and growth path.
          </p>
        </div>

        <div className="mx-auto mt-9 flex w-fit flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveRole("merchant")}
            className={`inline-flex min-w-[118px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeRole === "merchant"
                ? "bg-[#2D4CC8] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Merchant
          </button>
          <button
            type="button"
            onClick={() => setActiveRole("reseller")}
            className={`inline-flex min-w-[118px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeRole === "reseller"
                ? "bg-[#2D4CC8] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Reseller
          </button>
          <button
            type="button"
            onClick={() => setActiveRole("vendor")}
            className={`inline-flex min-w-[118px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeRole === "vendor"
                ? "bg-[#2D4CC8] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Vendor(PG)
          </button>
        </div>

        <div className="relative mt-10 grid gap-5 md:grid-cols-3">
          <div
            className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-slate-200 md:block"
            aria-hidden
          />
          {steps.map((step, index) => (
            (() => {
              const style = cardStyles[index % cardStyles.length];
              return (
            <article
              key={step.title}
              className={`relative overflow-hidden rounded-2xl border border-slate-200 px-6 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${style.cardBg}`}
            >
              <div className={`absolute left-0 right-0 top-0 h-1 ${style.accent}`} />
              <div className={`absolute right-5 top-5 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${style.chipBg}`}>
                0{index + 1}
              </div>
              <div className={`relative z-10 mx-auto flex size-14 items-center justify-center rounded-2xl border ${style.iconBg}`}>
                <step.Icon className={`size-7 ${style.iconColor}`} aria-hidden />
              </div>
              <h3 className="mt-6 text-2xl font-semibold leading-tight text-slate-900">
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {step.description}
              </p>
            </article>
              );
            })()
          ))}
        </div>
      </div>
    </section>
  );
};