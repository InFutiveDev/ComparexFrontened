"use client";

import { ResellerAdviceForm } from "@/components/website/reseller/advice-form";

const whyCompareItems = [
  {
    title: "Earn Recurring Revenue",
    description:
      "Generate commissions by introducing businesses to relevant providers.",
  },
  {
    title: "Expand Your Service Portfolio",
    description:
      "Offer more value to your clients without building additional capabilities.",
  },
  {
    title: "Dedicated Partner Support",
    description:
      "Get access to our partner success team and sales resources.",
  },
  {
    title: "Multiple Solution Categories",
    description:
      "Refer opportunities across multiple business segments from a single platform.",
  },
];

export function ResellerHomeHeroSection() {
  return (
    <section>
      <div className="relative overflow-hidden pt-4 sm:pt-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#e0f2fe]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.07) 26px, rgba(45,76,200,0.07) 27px)",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#2D4CC8]/12 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#6366f1]/10 blur-3xl" aria-hidden />

        <div className="relative z-30 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-0 items-center py-8 sm:min-h-[480px] sm:py-10 lg:min-h-[560px]">
            <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <div className="w-full max-w-xl text-[#13203F] lg:max-w-2xl">
                  <span className="inline-flex rounded-full border border-[#2D4CC8]/30 bg-white px-4 py-1.5 text-[17px] font-medium text-[#2D4CC8] shadow-sm">
                  For Partner & Reseller 
                  </span>

                  <h1 className="mt-4 text-2xl font-medium leading-snug text-slate-900 sm:text-3xl lg:text-[32px] lg:leading-tight">
                  Turn Your Network Into Revenue.
                  </h1>

                  <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                  Join India's fastest-growing payment marketplace as a reseller partner. Earn commission for every merchant you onboard across 15+ payment gateways - no sales targets,{" "}
                    <span className="font-semibold text-[#2D4CC8]">no minimums.</span>
                  </p>

                  <div className="mt-8 rounded-2xl border border-[#2D4CC8]/15 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
                    <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#2D4CC8]">
                    Why Partner With CompareX?
                    </h2>
                    <ul className="mt-4 space-y-4">
                      {whyCompareItems.map((item) => (
                        <li key={item.title} className="flex items-start gap-3">
                          <span
                            className="mt-2.5 block size-1.5 shrink-0 rounded-full bg-[#2D4CC8]"
                            aria-hidden
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 sm:text-base">
                              {item.title}
                            </p>
                            {/* <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                              {item.description}
                            </p> */}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div
                id="reseller-banner-form"
                className="relative z-40 w-full scroll-mt-28 lg:col-span-6 lg:flex lg:justify-start lg:self-center"
              >
                <ResellerAdviceForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
