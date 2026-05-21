"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { HeroAdviceForm } from "@/components/website/home/hero-advice-form";
import Link from "next/link";

const heroStats = [
  { value: "20,000+", label: "Products" },
  { value: "300+", label: "Trusted Brands" },
  { value: "12M+", label: "Happy Customers" },
] as const;

const scrollTickerMessages = [
  "Compare 20,000+ software products in one place",
  "Get free expert advice — no spam, just recommendations",
  "Trusted by 300+ brands and 12M+ happy customers",
  "Find the right CRM, billing, HR & more for your business",
  "Side-by-side comparisons to buy with confidence",
] as const;

export function HomeHeroSection() {
  const router = useRouter();
  const brandLogos = [
    { name: "", src: "/images/brand-1.svg" },
    { name: "", src: "/images/brand-2.svg" },
    { name: "", src: "/images/brand-3.svg" },
    { name: "", src: "/images/brand-4.svg" },
    { name: "", src: "/images/brand-5.svg" },
    { name: "", src: "/images/brand-1.svg" },
    { name: "", src: "/images/brand-2.svg" },
    { name: "", src: "/images/brand-3.svg" },
    { name: "", src: "/images/brand-4.svg" },
    { name: "", src: "/images/brand-5.svg" },
    { name: "", src: "/images/brand-1.svg" },
    { name: "", src: "/images/brand-2.svg" },
    { name: "", src: "/images/brand-3.svg" },
    { name: "", src: "/images/brand-4.svg" },
    { name: "", src: "/images/brand-5.svg" },
  ];

  const marqueeItems = [...brandLogos, ...brandLogos];
  const tickerItems = [...scrollTickerMessages, ...scrollTickerMessages];
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/dashboard?search=${encodeURIComponent(query)}`);
  };

  return (
    <section>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#13203F] via-[#2D4CC8] to-[#40C3CF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.14),transparent_32%)]" />

        <div className="relative z-20 mt-17 w-full border-b border-white/15 bg-[#0a1428]/80 backdrop-blur-md">
          <div className="cx-marquee cx-marquee--ticker py-2.5" aria-label="Latest updates">
            <div className="cx-marquee__track items-center gap-10 px-4">
              <Link href="/">
                <div className="flex items-center gap-10">
                  {tickerItems.map((message, index) => (
                    <span
                      key={`${message}-${index}`}
                      className="inline-flex shrink-0 items-center gap-10 text-xs font-medium tracking-wide text-white/95 sm:text-sm"
                    >
                      {message}
                      <span className="size-1.5 shrink-0 rounded-full bg-[#40C3CF]" aria-hidden />
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">

          <div className="flex min-h-[560px] items-center py-1 sm:min-h-[560px] sm:py-1">

            <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:items-center">

              <div className="lg:col-span-7">
                <div className="w-full max-w-xl text-white lg:max-w-2xl">
                  <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-[40px]">
                    Discover, Compare & Buy the Best Software for Your Business
                  </h1>

                  <form
                    onSubmit={handleSearchSubmit}
                    className="mt-6 flex h-12 items-center rounded-full border border-white/35 bg-white/95 px-4 text-sm text-slate-600 shadow-lg shadow-slate-950/10 sm:h-14"
                  >
                    <IoSearch className="mr-2 cursor-pointer text-2xl text-[#2d4cc8]" aria-hidden="true" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search for software, category or brand..."
                      className="h-full w-full border-0 bg-transparent text-[16px] text-slate-700 placeholder:text-slate-400 outline-none"
                      aria-label="Search software"
                    />
                  </form>

                  <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0">
                    {heroStats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className={`sm:px-4 ${index !== 0 ? "sm:border-l sm:border-white/30" : ""}`}
                      >
                        <p className="text-3xl font-bold leading-none text-white">{stat.value}</p>
                        <p className="mt-2 text-sm text-white/80">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 text-sm text-white/85">
                    Search for software, category or brand and compare options quickly.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <Link href="/" className="relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-white rounded-full hover:text-white group hover:bg-gray-50">
                      <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                      <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </span>
                      <span className="relative">Merchant</span>
                    </Link>
                    <Link href="/" className="relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-white rounded-full hover:text-white group hover:bg-gray-50">
                      <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                      <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </span>
                      <span className="relative">Reseller</span>
                    </Link>
                    <Link href="/" className="relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-white rounded-full hover:text-white group hover:bg-gray-50">
                      <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                      <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </span>
                      <span className="relative">Vendor PG</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 lg:self-center">
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
                  className="flex h-10 w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 text-white/95"
                >
                  <Image src={brand.src} alt={brand.name} width={92} height={26} className="h-6 w-auto opacity-95" />
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
