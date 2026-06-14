"use client";

import React, { useState } from "react";
import {
  HiBuildingOffice2,
  HiBuildingStorefront,
  HiChartBarSquare,
  HiClipboardDocumentCheck,
  HiClipboardDocumentList,
  HiInboxArrowDown,
  HiRocketLaunch,
  HiShare,
  HiShieldCheck,
  HiSquares2X2,
} from "react-icons/hi2";

const stepsByRole = {
  merchant: [
    {
      title: "Tell Us About Your Business",
      description:
        "Answer a few simple questions so CompareX can understand your business model, payment needs, and operational challenges.",
      Icon: HiBuildingOffice2,
    },
    {
      title: "Compare & Discover the Right Solutions",
      description:
        "Explore side-by-side comparisons across pricing, onboarding, support, integrations, and merchant experience — all in one place.",
      Icon: HiSquares2X2,
    },
    {
      title: "Activate Faster with Expert Support",
      description:
        "Connect with experts, get onboarding assistance, and move from discovery to activation with CompareX managing the journey end-to-end.",
      Icon: HiRocketLaunch,
    },
  ],
  reseller: [
    {
      title: "Register & Refer Businesses",
      description:
        "Submit merchant leads through CompareX without managing multiple provider relationships separately.",
      Icon: HiShare,
    },
    {
      title: "We Handle Qualification & Coordination",
      description:
        "CompareX manages merchant qualification, provider coordination, onboarding support, and follow-ups for you.",
      Icon: HiClipboardDocumentList,
    },
    {
      title: "Track Growth & Earn Commissions",
      description:
        "Monitor lead progress, merchant activation, GMV, and payouts directly from your reseller dashboard.",
      Icon: HiChartBarSquare,
    },
  ],
  PA_PG: [
    {
      title: "List & Position Your Offering",
      description:
        "Showcase your products, pricing, integrations, onboarding strengths, and smart tags through a structured marketplace profile.",
        Icon: HiClipboardDocumentList,
    },
    {
      title: "Receive Qualified Business Leads",
      description:
        "Get matched with businesses actively looking for solutions aligned to your ideal merchant segment.",
      Icon: HiInboxArrowDown,
    },
    {
      title: "Manage Leads & Build Trust",
      description:
        "Track leads, respond to reviews, nominate experts, and strengthen merchant relationships through CompareX.",
      Icon: HiShieldCheck,
    },
  ],
};

const cardStyles = [
  {
    cardBg: "bg-gradient-to-b from-[#EEF2FC] to-white",
    accent: "bg-[#2D4CC8]",
    chipBg: "bg-[#EEF2FC] text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC] border-[#2D4CC8]/25",
    iconColor: "text-[#2D4CC8]",
  },
  {
    cardBg: "bg-gradient-to-b from-[#ECFDF5] to-white",
    accent: "bg-[#25a36f]",
    chipBg: "bg-[#ECFDF5] text-[#25a36f]",
    iconBg: "bg-[#ECFDF5] border-[#25a36f]/25",
    iconColor: "text-[#25a36f]",
  },
  {
    cardBg: "bg-gradient-to-b from-[#EEF2FC] to-white",
    accent: "bg-[#2D4CC8]",
    chipBg: "bg-[#EEF2FC] text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC] border-[#2D4CC8]/25",
    iconColor: "text-[#2D4CC8]",
  },
];

export const HowItWorksSection = () => {
  const [activeRole, setActiveRole] = useState("merchant");
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

        <div className="mx-auto mt-9 flex w-full max-w-xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveRole("merchant")}
            className={`inline-flex flex-1 min-w-[118px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
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
            className={`inline-flex flex-1 min-w-[118px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
              activeRole === "reseller"
                ? "bg-[#2D4CC8] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Reseller
          </button>
          <button
            type="button"
            onClick={() => setActiveRole("PA_PG")}
            className={`inline-flex flex-1 min-w-[118px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
              activeRole === "PA_PG"
                ? "bg-[#2D4CC8] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            PA PG
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
              className={`relative overflow-hidden rounded-2xl border border-slate-200 px-4 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${style.cardBg}`}
            >
              <div className={`absolute left-0 right-0 top-0 h-1 ${style.accent}`} />
              <div className={`absolute right-5 top-5 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${style.chipBg}`}>
                0{index + 1}
              </div>
              <div className={`relative z-10 mx-auto flex size-14 items-center justify-center rounded-2xl border ${style.iconBg}`}>
                <step.Icon className={`size-7 ${style.iconColor}`} aria-hidden />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-tight text-slate-900 sm:text-xl">
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