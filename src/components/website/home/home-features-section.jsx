"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const promoSlides = [
  {
    id: "promo-list-software",
    title: "Best Payment Gateways in India for Startups",
    buttonText: "Read More",
    bgImage: "/images/hero-slide-1.svg",
  },
  {
    id: "promo-qualified-leads",
    title: "Razorpay vs Cashfree vs PayU: Complete Comparison",
    buttonText: "Read More",
    bgImage: "/images/hero-slide-2.svg",
  },
  {
    id: "promo-visibility",
    title: "How to Choose the Right Payment Gateway for Your Business",
    buttonText: "Read More",
    bgImage: "/images/hero-slide-3.svg",
  },
];

const features = [
  {
    icon: "/images/hero-slide-1.svg",
  },
  {
    icon: "/images/hero-slide-2.svg",
  },
  {
    icon: "/images/hero-slide-3.svg",
  },
];
export function HomeFeaturesSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % promoSlides.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto max-w-8xl py-10 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div
          className="relative overflow-hidden rounded-[30px] p-6 shadow-xs md:col-span-5"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(16,37,125,0.95) 15%, rgba(16,37,125,0.78) 45%, rgba(16,37,125,0.2) 100%), url(${promoSlides[activeSlide].bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h5 className="mb-6 max-w-[380px] text-3xl font-bold leading-[1.2] tracking-tight text-white">
            {promoSlides[activeSlide].title}
          </h5>
          <Link href="/" className="relative inline-flex items-center px-10 py-2 overflow-hidden text-[14px] font-medium !text-white border-2 border-white rounded-full hover:text-white group hover:bg-white/10">
            <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
            <span className="absolute right-0 flex items-center justify-start w-6 h-6 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
            <span className="relative">{promoSlides[activeSlide].buttonText}</span>
          </Link>
          <div className="mt-5 flex items-center gap-2">
            {promoSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80"}`}
                aria-label={`Go to promo slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div
          className="overflow-hidden rounded-[30px] border border-neutral-200 bg-neutral-100 shadow-xs md:col-span-7"
          style={{
            backgroundImage: `url(${features[activeSlide].icon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "290px",
          }}
          aria-label={`Feature ${activeSlide + 1}`}
        />

      </div>
    </section>
  );
}
