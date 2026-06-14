"use client";

import {
  HiBuildingOffice2,
  HiClipboardDocumentCheck,
  HiRocketLaunch,
  HiSquares2X2,
} from "react-icons/hi2";

const steps = [
  {
    step: 1,
    title: "Tell us about your business.",
    Icon: HiBuildingOffice2,
  },
  {
    step: 2,
    title: "Receive curated recommendations.",
    Icon: HiClipboardDocumentCheck,
  },
  {
    step: 3,
    title: "Compare providers side-by-side.",
    Icon: HiSquares2X2,
  },
  {
    step: 4,
    title: "Choose confidently with expert support.",
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
  {
    cardBg: "bg-gradient-to-b from-[#ECFDF5] to-white",
    accent: "bg-[#25a36f]",
    chipBg: "bg-[#ECFDF5] text-[#25a36f]",
    iconBg: "bg-[#ECFDF5] border-[#25a36f]/25",
    iconColor: "text-[#25a36f]",
  },
];

export function MerchantHowItWorksSection() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-8xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            How It Works
          </span>
          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Four Simple Steps to the Right PG
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            From sharing your business needs to choosing the right payment gateway — CompareX
            guides you at every step, free and unbiased.
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
                className={`relative overflow-hidden rounded-2xl border border-slate-200 px-5 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${style.cardBg}`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${style.accent}`} aria-hidden />

                <div
                  className={`absolute right-4 top-4 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${style.chipBg}`}
                >
                  0{step.step}
                </div>

                <p className="text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Step {step.step}
                </p>

                <div
                  className={`relative z-10 mx-auto mt-5 flex size-14 items-center justify-center rounded-2xl border ${style.iconBg}`}
                >
                  <StepIcon className={`size-7 ${style.iconColor}`} aria-hidden />
                </div>

                <h3 className="mt-5 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                  {step.title}
                </h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
