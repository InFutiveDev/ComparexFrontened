"use client";

import { useEffect, useState } from "react";

const promoSlides = [
  {
    title: "List Your Software/Service to Expand Your Reach to Potential Buyers",
    buttonText: "Register For Free",
    bgImage: "/images/img-4.png",
  },
  {
    title: "Get More Qualified Leads by Showcasing Your Product to Buyers",
    buttonText: "Start Listing",
    bgImage: "/images/img-4.png",
  },
  {
    title: "Boost Visibility with Smart Promotion and High Intent Traffic",
    buttonText: "Promote Now",
    bgImage: "/images/img-4.png",
  },
];

const features = [
  {
   
    icon: "/images/img-1.jpeg",
  },
  {
   
    icon: "/images/img-2.jpg",
  },
  {
   
    icon: "/images/img-3.jpg",
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
          <a
            href="#"
            className="inline-flex items-center rounded-[10px] bg-[#FF944D] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#ff8535]"
          >
            {promoSlides[activeSlide].buttonText}
            <svg className="ms-2 h-4 w-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m0 0-4 4m4-4-4-4" />
            </svg>
          </a>
          <div className="mt-5 flex items-center gap-2">
            {promoSlides.map((slide, index) => (
              <button
                key={slide.buttonText}
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
