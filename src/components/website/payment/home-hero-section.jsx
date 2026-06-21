"use client";

import { PaymentAdviceForm } from "@/components/website/payment/advice-form";

const whyCompareItems = [
  {
    title: "Access High-Intent Merchants",
    description:
      "Showcase products, pricing, integrations, onboarding strengths, and smart tags through a structured marketplace profile.",
  },
  {
    title: "Higher Approval & Activation Rates",
    description:
      "Get matched with businesses actively looking for solutions aligned to your ideal merchant segment.",
  },
  {
    title: "Improve Merchant Acquisition Efficiency",
    description:
      "Track leads, respond to reviews, nominate experts, and strengthen merchant relationships through CompareX.",
  },
  {
    title: "Expand Into New Merchant Categories",
    description:
      "Expand reach through a neutral discovery platform trusted by businesses across India.",
  },
  {
    title: "Merchant Intent & Requirement Insights",
    description:
      "CompareX serves businesses across industries, helping you reach new markets and expand your customer base.",
  },
];

export function PaymentHomeHeroSection() {
  return (
    <section>
      <div className="relative overflow-hidden pt-4 sm:pt-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ecfeff] via-[#f0f9ff] to-[#e0e7ff]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.07) 26px, rgba(45,76,200,0.07) 27px)",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#2D4CC8]/12 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#2D4CC8]/10 blur-3xl" aria-hidden />

        <div className="relative z-30 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-0 items-center py-8 sm:min-h-[480px] sm:py-10 lg:min-h-[560px]">
            <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <div className="w-full max-w-xl text-[#13203F] lg:max-w-2xl">
                  <span className="inline-flex rounded-full border border-[#2D4CC8]/30 bg-white px-4 py-1.5 text-[17px] font-medium text-[#2D4CC8] shadow-sm">
                  For Solution Provider & Payment Gateway
                  </span>

                  <h1 className="mt-4 text-2xl font-medium leading-snug text-slate-900 sm:text-3xl lg:text-[32px] lg:leading-tight">
                  Acquire Merchants, Not Just Leads.
                  </h1>

                  <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                  Most acquisition channels generate enquiries. CompareX connects you with businesses that are actively evaluating providers and searching for the right partner, helping you reduce acquisition costs, improve conversion rates, and accelerate merchant onboarding.{" "}
                    <span className="font-semibold text-[#2D4CC8]">merchant onboarding.</span>
                  </p>

                  <div className="mt-8 rounded-2xl border border-[#2D4CC8]/15 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
                    <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#2D4CC8]">
                    Why CompareX?
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

              <div className="relative z-40 w-full lg:col-span-6 lg:flex lg:justify-end lg:self-center">
                <PaymentAdviceForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
