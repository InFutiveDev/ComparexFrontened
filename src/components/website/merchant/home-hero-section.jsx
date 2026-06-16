"use client";

import { HeroAdviceForm } from "@/components/website/home/hero-advice-form";

const whyCompareItems = [
  {
    title: "Save Time on Research",
    description:
      "No more comparing dozens of websites, sales pitches, and pricing sheets.",
  },
  {
    title: "Make Better Decisions",
    description:
      "Access side-by-side comparisons, reviews, benchmarks, and recommendations tailored to your business.",
  },
  {
    title: "Unlock Better Pricing",
    description:
      "Leverage our partner network to access competitive pricing and exclusive offers.",
  },
  {
    title: "Expert Guidance",
    description:
      "Our specialists help you shortlist the right providers based on your business goals.",
  },
];

export function MerchantHomeHeroSection() {
  return (
    <section>
      <div className="relative overflow-hidden pt-4 sm:pt-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#eff6ff]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(37,163,111,0.06) 26px, rgba(37,163,111,0.06) 27px)",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#25A36F]/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#2D4CC8]/10 blur-3xl" aria-hidden />

        <div className="relative z-30 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-0 items-center py-8 sm:min-h-[480px] sm:py-10 lg:min-h-[560px]">
            <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <div className="w-full max-w-xl text-[#13203F] lg:max-w-2xl">
                  <span className="inline-flex rounded-full border border-[#25A36F]/30 bg-white px-4 py-1.5 text-sm font-medium text-[#25A36F] shadow-sm">
                  For Business & Merchant
                  </span>

                  <h1 className="mt-4 text-2xl font-medium leading-snug text-slate-900 sm:text-3xl lg:text-[32px] lg:leading-tight">
                    Find the payment gateway your business actually needs.
                  </h1>

                  <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                    Stop guessing. Answer quick questions and CompareX matches you with the right
                    payment gateway — based on your industry, volume, and priorities.{" "}
                    <span className="font-semibold text-[#25A36F]">Free, unbiased, instant.</span>
                  </p>

                  <div className="mt-8 rounded-2xl border border-[#25A36F]/15 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
                    <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#25A36F]">
                      Why CompareX?
                    </h2>
                    <ul className="mt-4 space-y-4">
                      {whyCompareItems.map((item) => (
                        <li key={item.title} className="flex items-start gap-3">
                          <span
                            className="mt-2.5 block size-1.5 shrink-0 rounded-full bg-[#25A36F]"
                            aria-hidden
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 sm:text-base">
                              {item.title}
                            </p>
                            
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="relative z-40 w-full lg:col-span-6 lg:flex lg:justify-end lg:self-center">
                <HeroAdviceForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
