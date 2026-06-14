"use client";

import {
  HiBuildingOffice2,
  HiChatBubbleLeftRight,
  HiRocketLaunch,
  HiUserGroup,
} from "react-icons/hi2";

const steps = [
  {
    step: 1,
    label: "Join",
    title: "Join the CompareX Network",
    description:
      "Create your partner profile and highlight what makes your payment solution unique.",
    Icon: HiBuildingOffice2,
  },
  {
    step: 2,
    label: "Reach",
    title: "Reach High-Intent Businesses",
    description:
      "Be visible to businesses exploring payment infrastructure and evaluating their options.",
    Icon: HiUserGroup,
  },
  {
    step: 3,
    label: "Participate",
    title: "Participate in the Decision Journey",
    description:
      "Engage with merchants through consultations, comparisons, and expert-assisted conversations.",
    Icon: HiChatBubbleLeftRight,
  },
  {
    step: 4,
    label: "Build",
    title: "Build Meaningful Partnerships",
    description:
      "Support merchants throughout their growth journey and strengthen your market presence.",
    Icon: HiRocketLaunch,
  },
];

const cardStyles = [
  {
    cardBg: "bg-gradient-to-b from-[#EEF2FC] to-white",
    accent: "bg-[#2D4CC8]",
    chipBg: "bg-[#EEF2FC] text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC] border-[#2D4CC8]/25",
    iconColor: "text-[#2D4CC8]",
  },
  {
    cardBg: "bg-gradient-to-b from-[#ecfeff] to-white",
    accent: "bg-[#0891b2]",
    chipBg: "bg-[#ecfeff] text-[#0891b2]",
    iconBg: "bg-[#ecfeff] border-[#06b6d4]/25",
    iconColor: "text-[#0891b2]",
  },
  {
    cardBg: "bg-gradient-to-b from-[#EEF2FC] to-white",
    accent: "bg-[#2D4CC8]",
    chipBg: "bg-[#EEF2FC] text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC] border-[#2D4CC8]/25",
    iconColor: "text-[#2D4CC8]",
  },
  {
    cardBg: "bg-gradient-to-b from-[#ecfeff] to-white",
    accent: "bg-[#0891b2]",
    chipBg: "bg-[#ecfeff] text-[#0891b2]",
    iconBg: "bg-[#ecfeff] border-[#06b6d4]/25",
    iconColor: "text-[#0891b2]",
  },
  {
    cardBg: "bg-gradient-to-b from-[#EEF2FC] to-white",
    accent: "bg-[#2D4CC8]",
    chipBg: "bg-[#EEF2FC] text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC] border-[#2D4CC8]/25",
    iconColor: "text-[#2D4CC8]",
  },
];

export function PaymentHowItWorksSection() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-8xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            How It Works
          </span>
          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Four Simple Steps to Marketplace Success
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            From listing your payment gateway to converting qualified merchant leads — CompareX
            helps you grow through a trusted discovery platform.
          </p>
        </div>

        <div className="relative mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-slate-200 xl:block"
            aria-hidden
          />

          {steps.map((step, index) => {
            const style = cardStyles[index];
            const StepIcon = step.Icon;

            return (
              <article
                key={step.step}
                className={`relative overflow-hidden rounded-2xl border border-slate-200 px-5 py-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${style.cardBg}`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${style.accent}`} aria-hidden />

                <div
                  className={`absolute right-4 top-4 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${style.chipBg}`}
                >
                  0{step.step}
                </div>

                <p className="text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {step.label}
                </p>

                <div
                  className={`relative z-10 mt-5 flex size-14 items-center justify-center rounded-2xl border ${style.iconBg}`}
                >
                  <StepIcon className={`size-7 ${style.iconColor}`} aria-hidden />
                </div>

                <h3 className="mt-5 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
