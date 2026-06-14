"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { HeroAdviceForm } from "@/components/website/home/hero-advice-form";
import Link from "next/link";

const heroStats = [
  { label: "How it works", value: "How it works" },
  { label: "Compare PG", value: "Compare PG" },
  { label: "Talk to Expert", value: "Talk to Expert" },
];

const scrollTickerMessages = [
  "Compare 20,000+ software products in one place",
  "Get free expert advice — no spam, just recommendations",
  "Trusted by 300+ brands and 12M+ happy customers",
  "Find the right CRM, billing, HR & more for your business",
  "Side-by-side comparisons to buy with confidence",
];

export function HomeHeroSection() {
  const router = useRouter();
  const brandLogos = [
    { name: "", src: "/images/brand-logos/razorpay_logo.svg" },
    { name: "", src: "/images/brand-logos/cashfree.png" },
    { name: "", src: "/images/brand-logos/Payu.png" },
    { name: "", src: "/images/brand-logos/ccavenue.png" },
    { name: "", src: "/images/brand-logos/easebuzz.png" },
    { name: "", src: "/images/brand-logos/stripe.png" },
    { name: "", src: "/images/brand-logos/paytm.png" },
    { name: "", src: "/images/brand-logos/amazon.jpg" },
    { name: "", src: "/images/brand-logos/phonepe.png" },
    
  ];

  const marqueeItems = [...brandLogos, ...brandLogos];
  const tickerItems = [...scrollTickerMessages, ...scrollTickerMessages];
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/dashboard?search=${encodeURIComponent(query)}`);
  };

  return (
    <section>
      <div className="relative overflow-hidden pt-16 sm:pt-21 lg:pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#13203F] via-[#2D4CC8] to-[#40C3CF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.14),transparent_32%)]" />

        <div className="relative z-20 w-full border-b border-white/15 bg-[#0025bb] backdrop-blur-md">
          <div className="cx-marquee cx-marquee--ticker py-2.5" aria-label="Latest updates">
            <div className="cx-marquee__track items-center gap-10 px-4">
              <Link href="/">
                <div className="flex items-center gap-10">
                  {tickerItems.map((message, index) => (
                    <span
                      key={`${message}-${index}`}
                      className="inline-flex shrink-0 items-center gap-2.5 text-xs font-medium tracking-wide text-white/95 sm:gap-3 sm:text-sm"
                    >
                      <Image
                        src="/images/logo-icon.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 shrink-0 object-contain"
                        aria-hidden
                      />
                      {message}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-30 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">

          <div className="flex min-h-0 items-center py-8 sm:min-h-[480px] sm:py-10 lg:min-h-[560px]">

            <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:items-center">

              <div className="lg:col-span-6">
                <div className="w-full max-w-xl text-white lg:max-w-2xl">
                  <p className="text-[16px] border border-white/50 rounded-full px-4 py-1.5 w-fit font-normal leading-tight text-white mb-2">
                  India’s 1st PG Comparison Platform
                  </p>
                  <h1 className="mt-4 text-2xl font-medium leading-snug sm:text-3xl lg:text-[32px] lg:leading-tight">
                  Discover, Compare & Choose the Right Payment Gateway for Your Business.
                  </h1>

                  <div className="mt-6 w-full sm:max-w-[520px]">
                    <form
                      onSubmit={handleSearchSubmit}
                      className="flex h-12 w-full items-center rounded-full border border-white/35 bg-white/95 px-4 text-sm text-slate-600 shadow-lg shadow-slate-950/10"
                    >
                      <IoSearch className="mr-2 shrink-0 cursor-pointer text-2xl text-[#2d4cc8]" aria-hidden="true" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search Payment Gateway"
                        className="h-full w-full border-0 bg-transparent text-[16px] text-slate-700 placeholder:text-slate-400 outline-none"
                        aria-label="Search software"
                      />
                    </form>

                    <div className="mt-4 flex w-full items-center">
                      {heroStats.map((stat, index) => (
                        <div
                          key={stat.label}
                          className={`flex flex-1 items-center ${
                            index === 0
                              ? "justify-start"
                              : index === heroStats.length - 1
                                ? "justify-end"
                                : "justify-center"
                          } ${index !== 0 ? "border-l border-white/50 pl-3 sm:pl-4" : ""}`}
                        >
                          <p className="text-sm font-medium leading-tight text-white sm:text-base lg:text-lg">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-6 text-base font-normal leading-tight text-white sm:text-lg">
                  Get Started As
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href="/merchant"
                      className="group relative inline-flex items-center overflow-hidden rounded-full border-2 border-white px-5 py-2 text-sm font-semibold text-indigo-600 hover:text-white hover:bg-gray-50 sm:px-8 sm:text-base lg:px-12 lg:text-lg"
                    >
                      <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                      <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </span>
                      <span className="relative">Merchant</span>
                    </Link>
                    <Link
                      href="/reseller"
                      className="group relative inline-flex items-center overflow-hidden rounded-full border-2 border-white px-5 py-2 text-sm font-semibold text-indigo-600 hover:text-white hover:bg-gray-50 sm:px-8 sm:text-base lg:px-12 lg:text-lg"
                    >
                      <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                      <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </span>
                      <span className="relative">Reseller</span>
                    </Link>
                    <Link
                      href="/payment"
                      className="group relative inline-flex items-center overflow-hidden rounded-full border-2 border-white px-5 py-2 text-sm font-semibold text-indigo-600 hover:text-white hover:bg-gray-50 sm:px-8 sm:text-base lg:px-12 lg:text-lg"
                    >
                      <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                      <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </span>
                      <span className="relative">PA PG</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative z-40 w-full lg:col-span-6 lg:flex lg:justify-end lg:self-center">
                <HeroAdviceForm />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/20 bg-slate-950/30 backdrop-blur-sm">
          <div className="cx-marquee mx-auto max-w-8xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="cx-marquee__track gap-10">
              {marqueeItems.map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex h-10 w-fit items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-3 text-white/95"
                >
                  <Image src={brand.src} alt={brand.name} width={92} height={26} className="h-6 w-auto object-contain object-center" />
                  <span className="whitespace-nowrap text-xs font-semibold tracking-wide">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
