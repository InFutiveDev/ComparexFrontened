"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";

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

  const slides = [
    {
      title: "Discover, Compare & Buy the Best Software for Your Business",
      subtitle: "Search for software, category or brand and compare options quickly.",
      ctaPrimary: "Get Free Advice",
      ctaSecondary: "Explore Software",
      image: "/images/banners.png",
      overlay: "from-[#13203F] via-[#2D4CC8] to-[#40C3CF]",
      stats: [
        { value: "20,000+", label: "Products" },
        { value: "300+", label: "Trusted Brands" },
        { value: "12M+", label: "Happy Customers" },
      ],
     
    },
    // {
    //   title: "Choose Smarter with Real Comparisons and Expert Guidance",
    //   subtitle: "Shortlist top software based on price, features and verified recommendations.",
    //   ctaPrimary: "Compare Now",
    //   ctaSecondary: "Open Dashboard",
    //   image: "/images/hero-slide-2.svg",
    //   stats: [
    //     { value: "8,500+", label: "Comparisons" },
    //     { value: "95%", label: "Satisfaction" },
    //     { value: "24x7", label: "Support" },
    //   ],
    //   overlay: "from-slate-950/84 via-indigo-950/70 to-slate-900/45",
    // },
    
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/dashboard?search=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section>
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${activeSlide.overlay}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.14),transparent_32%)]" />

        <div className="relative z-10 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[560px] items-center py-10 sm:min-h-[620px] sm:py-10">
            <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <div className="w-full max-w-xl text-white lg:max-w-2xl">
                  <h1 className="text-2xl font-bold pt-20 leading-tight sm:text-3xl lg:text-[40px]">
                    {activeSlide.title}
                  </h1>

                  <form
                    onSubmit={handleSearchSubmit}
                    className="mt-6 flex h-12 items-center rounded-full border border-white/35 bg-white/95 px-4 text-sm text-slate-600 shadow-lg shadow-slate-950/10 sm:h-14"
                  >
                    <IoSearch className="mr-2 text-2xl text-[#2d4cc8] cursor-pointer" aria-hidden="true" />
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
                    {activeSlide.stats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className={`sm:px-4 ${index !== 0 ? "sm:border-l sm:border-white/30" : ""}`}
                      >
                        <p className="text-3xl font-bold leading-none text-white">{stat.value}</p>
                        <p className="mt-2 text-sm text-white/80">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-sm text-white/85">{activeSlide.subtitle}</div>

                  <div className="mt-6 flex items-center gap-2">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.title}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/75"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 lg:self-end lg:-mb-25">
                <div className="relative mx-auto flex h-[360px] w-full max-w-xl items-end overflow-hidden backdrop-blur sm:h-[420px] lg:h-[500px]">
                  <Image
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    width={500}
                    height={500}
                    className="mt-auto h-auto w-full max-h-full object-contain object-bottom lg:scale-[1]"
                    priority
                  />
                </div>
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
