"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiChartBar, HiOutlineChartBarSquare } from "react-icons/hi2";

const promoSlides = [
  {
    id: "list-offering",
    title: "List & Position Your Offering",
    buttonText: "Read More",
    bgImage: "/images/hero-slide-1.svg",
    href: "/pg-marketplace",
  },
  {
    id: "qualified-leads",
    title: "Receive Qualified Business Leads",
    buttonText: "Read More",
    bgImage: "/images/hero-slide-2.svg",
    href: "/pg-marketplace",
  },
  {
    id: "build-trust",
    title: "Manage Leads & Build Trust",
    buttonText: "Read More",
    bgImage: "/images/hero-slide-3.svg",
    href: "/talk-to-expert",
  },
];

function PromoCardDecor() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 w-[42%] overflow-hidden" aria-hidden>
      <div className="absolute right-8 top-10 space-y-3 opacity-15">
        <div className="h-2.5 w-28 rounded-full bg-white" />
        <div className="h-2.5 w-36 rounded-full bg-white" />
        <div className="h-2.5 w-24 rounded-full bg-white" />
      </div>
      <div className="absolute bottom-8 right-8 flex gap-3 opacity-15">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-white/40 bg-white/10">
          <HiOutlineChartBarSquare className="size-7 text-white" />
        </div>
        <div className="flex size-14 items-center justify-center rounded-2xl border border-white/40 bg-white/10">
          <HiChartBar className="size-7 text-white" />
        </div>
      </div>
    </div>
  );
}

function ComparisonPromoCard() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = promoSlides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % promoSlides.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <div
        className="absolute -right-3 top-3 -z-20 h-full w-full rounded-[30px] bg-[#5c6bc0]/25"
        aria-hidden
      />
      <div
        className="absolute -right-1.5 top-1.5 -z-10 h-full w-full rounded-[30px] bg-[#7986cb]/35"
        aria-hidden
      />

      <div
        className="relative min-h-[220px] overflow-hidden rounded-2xl p-5 shadow-xs sm:min-h-[260px] sm:rounded-[30px] sm:p-6 lg:min-h-[290px]"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(16,37,125,0.95) 15%, rgba(16,37,125,0.78) 45%, rgba(16,37,125,0.2) 100%), url(${slide.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <PromoCardDecor />

        <div className="relative z-10 flex h-full min-h-[190px] flex-col justify-between sm:min-h-[220px]">
          <div>
            <h5 className="max-w-[380px] text-xl font-bold leading-[1.2] tracking-tight text-white sm:text-2xl lg:text-3xl">
              {slide.title}
            </h5>
            <Link
              href={slide.href}
              className="group relative mt-6 inline-flex items-center overflow-hidden rounded-full border-2 border-white px-10 py-2 text-[14px] font-medium !text-white hover:bg-white/10"
            >
              <span className="absolute left-0 top-1/2 block h-0 w-full bg-indigo-600 opacity-100 transition-all duration-400 ease group-hover:top-0 group-hover:h-full" />
              <span className="absolute right-0 flex h-6 w-6 translate-x-full transform items-center justify-start duration-300 ease group-hover:translate-x-0">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <span className="relative">{slide.buttonText}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 pt-5">
            {promoSlides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80"
                }`}
                aria-label={`Go to promo slide ${index + 1}`}
                aria-current={index === activeSlide ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const whyPaymentItems = [
  "Increase visibility among businesses evaluating payment solutions",
  "Showcase your strengths, capabilities, and industry expertise",
  "Engage with merchants through expert-assisted consultations",
  "Build trust through transparent profiles and merchant reviews",
  "Reach businesses across multiple industries and segments",
  "Build relationships with businesses aligned to your target market",
];

export function WhyPaymentProvidersSection() {
  return (
    <section className="bg-[#f2f6fb] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-8xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <ComparisonPromoCard />

        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Leading Providers Partner With CompareX
          </h2>

          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {whyPaymentItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#2D4CC8]/30 hover:shadow-md"
              >
                <span
                  className="mt-2 block size-1.5 shrink-0 rounded-full bg-[#0891b2]"
                  aria-hidden
                />
                <p className="text-sm font-semibold leading-snug text-slate-900 sm:text-base">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
