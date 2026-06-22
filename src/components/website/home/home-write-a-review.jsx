"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";
import Image from "next/image";

const NAVY = "#13203F";
const PRIMARY = "#2D4CC8";
const CYAN = "#40C3CF";
const GREEN = "#25a36f";

const CARD_THEMES = [
    { header: "from-[#13203F] via-[#2D4CC8] to-[#2D4CC8]", avatar: "from-[#2D4CC8] to-[#13203F]" },
    { header: "from-[#2D4CC8] via-[#40C3CF] to-[#40C3CF]", avatar: "from-[#40C3CF] to-[#2D4CC8]" },
    { header: "from-[#13203F] to-[#25a36f]", avatar: "from-[#25a36f] to-[#13203F]" },
    { header: "from-[#2D4CC8] to-[#25a36f]", avatar: "from-[#13203F] to-[#40C3CF]" },
];

const testimonials = [
    {
        name: "Niklas Weisz",
        role: "Marketing Coordinator",
        rating: "4.8",
        excerpt:
            "GUSHO has completely transformed the way I market my video. This helped me eliminate the need for multiple apps to host, edit, post and schedule my videos.",
        initials: "NW",
        avatarBg: "from-stone-100 via-slate-200 to-slate-300",
    },
    {
        name: "Silke Bader",
        role: "Marketing Executive",
        rating: "5.0",
        excerpt:
            "Comparex buyer reviews replaced guesswork for our team — we compared onboarding timelines and real renewal clauses before signing and skipped two mismatched vendors.",
        initials: "SB",
        avatarBg: "from-rose-50 via-orange-50 to-amber-100",
    },
];

const reviewCards = [
    {
        id: "priya-patel",
        name: "Priya Patel",
        role: "SaaS Startup, Bangalore",
        initials: "PP",
        rating: 5,
        title: "A payment solution built to scale with our startup",
        body:
            "As a tech startup, we needed a payment solution that could scale with us. CompareX didn't just find us the best option—they found us the most reliable.",
        logoLabel: "SaaS",
    },
    {
        id: "vikram-singh",
        name: "Vikram Singh",
        role: "Retail Chain, Delhi NCR",
        initials: "VS",
        rating: 5,
        title: "Seamless omnichannel payments at lower costs",
        body:
            "Our omnichannel business needed different payment solutions for online and offline. CompareX helped us integrate everything seamlessly while reducing our overall processing costs.",
        logoLabel: "Retail",
    },
    {
        id: "sunil-mehta",
        name: "Sunil Mehta",
        role: "Manufacturing Business, Ahmedabad",
        initials: "SM",
        rating: 5,
        title: "Better rates and support for high-value B2B transactions",
        body:
            "As a manufacturer selling B2B, we needed specific payment features. CompareX found us a gateway with excellent support management and better rates for high-value transactions.",
        logoLabel: "Manufacturing",
    },
    {
        id: "rajesh-sharma",
        name: "Rajesh Sharma",
        role: "E-commerce Founder, Mumbai",
        initials: "RS",
        rating: 5,
        title: "A gateway matched to our volume and customers",
        body:
            "CompareX detailed comparison helped us switch to a gateway that perfectly matched our business volume and customer demographics.",
        logoLabel: "E-commerce",
    },
];

function StarRow({ count = 5, onDark = false }) {
    return (
        <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <IoStar
                    key={i}
                    className={`size-3.5 ${i < count ? "text-[#25a36f]" : onDark ? "text-white/30" : "text-slate-200"}`}
                    aria-hidden
                />
            ))}
        </div>
    );
}

function ReviewedSoftwareCard({ item, cardIndex }) {
    const theme = CARD_THEMES[cardIndex % CARD_THEMES.length];

    return (
        <article className="group relative flex h-full min-h-[320px] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-24px_rgba(19,32,63,0.45)] ring-1 ring-[#2D4CC8]/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_70px_-20px_rgba(45,76,200,0.35)]">
            <div className={`relative bg-gradient-to-r px-4 pb-4 pt-3 sm:px-5 ${theme.header}`}>
                
                

                <div className="relative z-10 flex items-center gap-3">
                    <div
                        className={`flex size-[52px] mt-2 shrink-0 items-center justify-center rounded-2xl border-[3px] border-white bg-gradient-to-br shadow-md sm:size-[58px] ${theme.avatar}`}
                    >
                        <span className="text-sm font-bold text-white sm:text-base">{item.initials}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-bold text-white">{item.name}</p>
                        <p className="truncate text-[12px] text-white/75">{item.role}</p>
                    </div>
                    <div className="items-center gap-2">
                    <span className="rounded-lg mb-2 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#2D4CC8] shadow-sm">
                    {item.logoLabel}
                    </span>
                    
                    </div>
                    
                </div>
            </div>

            <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
            <RiDoubleQuotesL
                    className="pointer-events-none left-0 absolute bottom-40 size-[72px] text-[#2D4CC8]/10 sm:left-2 sm:size-20"
                    aria-hidden
                />
                <h4 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#13203F]">
                    {item.title}
                </h4>
                <p className="mt-2.5 line-clamp-3 flex-1 text-[16px] leading-relaxed text-slate-500">
                    {item.body}
                </p>

                
            </div>
        </article>
    );
}

function useVisibleCount() {
    const [visibleCount, setVisibleCount] = useState(1);

    useEffect(() => {
        function update() {
            setVisibleCount(window.innerWidth >= 640 ? 2 : 1);
        }
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return visibleCount;
}

function TopReviewedSlider() {
    const visibleCount = useVisibleCount();
    const maxSlide = Math.max(0, reviewCards.length - visibleCount);
    const [slide, setSlide] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        setSlide((s) => Math.min(s, maxSlide));
    }, [maxSlide]);

    useEffect(() => {
        if (paused) return;
        const id = window.setInterval(() => {
            setSlide((s) => (s >= maxSlide ? 0 : s + 1));
        }, 5200);
        return () => window.clearInterval(id);
    }, [paused, maxSlide]);

    function goToSlide(index) {
        setSlide(Math.min(index, maxSlide));
    }

    function goPrev() {
        setSlide((s) => (s <= 0 ? maxSlide : s - 1));
    }

    function goNext() {
        setSlide((s) => (s >= maxSlide ? 0 : s + 1));
    }

    return (
        <div
            className="flex flex-col gap-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="overflow-hidden" aria-live="polite" aria-label={`Reviews ${slide + 1} to ${slide + visibleCount} of ${reviewCards.length}`}>
                <div
                    className="flex gap-6 transition-transform duration-500 ease-out"
                    style={{
                        transform: `translateX(calc(-${slide} * ((100% + 24px) / ${visibleCount})))`,
                    }}
                >
                    {reviewCards.map((item, cardIndex) => (
                        <div
                            key={item.id}
                            className="shrink-0 grow-0"
                            style={{ flexBasis: `calc((100% - ${(visibleCount - 1) * 24}px) / ${visibleCount})` }}
                        >
                            <ReviewedSoftwareCard item={item} cardIndex={cardIndex} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="items-center gap-4 sm:flex-row sm:justify-between">
                

                <div className="flex justify-center items-center gap-3">
                    <button
                        type="button"
                        onClick={goPrev}
                        className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-lg text-white backdrop-blur transition hover:bg-white/25"
                        aria-label="Previous review"
                    >
                        ‹
                    </button>

                    <div className="flex max-w-[220px] flex-wrap items-center justify-center gap-2">
                        {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goToSlide(i)}
                                className={`rounded-full transition-all ${
                                    i === slide
                                        ? "size-2.5 bg-[#25a36f] ring-4 ring-[#25a36f]/30"
                                        : "size-2 bg-white/40 hover:bg-white/70"
                                }`}
                                aria-label={`Show reviews from position ${i + 1}`}
                                aria-current={i === slide ? "true" : undefined}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={goNext}
                        className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-lg text-white backdrop-blur transition hover:bg-white/25"
                        aria-label="Next review"
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}

function TestimonialCard({
    t,
    className,
}) {
    return (
        <article
            className={`relative z-10 w-full max-w-[360px] overflow-hidden rounded-2xl bg-white p-6 shadow-[0_12px_40px_-14px_rgba(15,23,42,0.12)] sm:p-7 ${className ?? ""}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className={`flex size-[52px] shrink-0 items-center justify-center rounded-full border-2 border-blue-100 bg-gradient-to-br text-[13px] font-bold tracking-tight shadow-sm ring-2 ring-white ${t.avatarLightText ? "text-white" : "text-slate-800"} ${t.avatarBg}`}
                    >
                        {t.initials}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate font-bold text-slate-950">{t.name}</p>
                        <p className="truncate text-[13px] text-slate-500">{t.role}</p>
                    </div>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-md bg-[#25a36f] px-2 py-1 text-xs font-semibold text-white shadow-sm">
                    <IoStar className="size-3.5" aria-hidden />
                    {t.rating}
                </span>
            </div>

            <div className="relative mt-5 min-h-[4.5rem]">
                <RiDoubleQuotesL
                    className="pointer-events-none absolute -left-1 top-[-6px] z-0 text-[5.75rem] leading-none text-slate-900/[0.06] sm:text-[6.75rem]"
                    aria-hidden
                />
                <p className="relative z-10 text-[14px] leading-relaxed text-slate-600">{t.excerpt}</p>
            </div>

            <Link
                href="#"
                className="mt-6 inline-flex items-center gap-2.5 text-sm font-semibold hover:underline"
                style={{ color: NAVY }}
            >
                <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                    style={{ backgroundColor: NAVY }}
                    aria-hidden
                >
                    <IoStar className="size-3.5" />
                </span>
                Read Review
            </Link>
        </article>
    );
}

export const HomeWriteAReview = () => {
    return (
        <div className="bg-white">
            {/* —— Write a Review —— */}
            <section className="mx-auto max-w-8xl px-4 pt-10 pb-5 sm:px-6 lg:px-8">
                <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
                    <Image src="/images/review.png" alt="Write a Review" className="mx-auto h-auto w-full max-w-md object-contain rounded-lg lg:max-w-none" width={500} height={500} />

                    <div className="text-center lg:text-start">
                        <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#13203F] sm:text-4xl lg:text-[2.25rem]">
                            Because Your Voice Matters <br /> Be Heard!
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 lg:mx-0 mx-auto">
                            Share Your Review in Just 2 Minutes and Help Our Buyers Find the Right Software/Service
                            Provider.
                        </p>
                        <div className="mt-6">
                        <Link
                                href="/reviews"
                                className="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 font-medium text-white"
                                style={{ color: "#fff" }}
                            >
                                <span className="z-10 pr-2 text-white">Write a Review</span>
                                <div className="absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
                                    <div className="mr-3.5 flex items-center justify-center">
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 15 15"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-neutral-50"
                                        >
                                            <path
                                                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* —— Merchant testimonials — carousel —— */}
            <section className="mx-auto">
                <div className="overflow-hidden">
                    <div className="grid lg:grid-cols-[2fr_4fr]">
                        {/* Left panel */}
                        <div className="relative overflow-hidden bg-[#f2f6fb] px-5 py-10 sm:px-10 sm:py-12 lg:py-16">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-40"
                                aria-hidden
                                style={{
                                    backgroundImage:
                                        "radial-gradient(circle at 1px 1px, #2D4CC8 1px, transparent 0)",
                                    backgroundSize: "28px 28px",
                                }}
                            />
                            <div className="relative">
                                
                                <div className="mt-1 flex items-end gap-3">
                                   
                                    <RiDoubleQuotesL className="mb-3 size-[72px] text-[#2D4CC8]/30" aria-hidden />
                                </div>
                                <h3 className="text-2xl font-bold leading-tight text-[#13203F] sm:text-3xl lg:text-[40px]">
                                    What Businesses Say About{" "}
                                    <span className="text-[#2D4CC8]">CompareX</span>
                                </h3>
                                <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
                                    Real stories from merchants across India who compared, chose, and switched to the
                                    right payment gateway.
                                </p>

                               
                            </div>
                        </div>

                        {/* Right panel — cards */}
                        <div
                            className="relative overflow-hidden px-4 py-10 sm:px-10 sm:py-12 lg:py-16"
                            style={{
                                background: `linear-gradient(145deg, ${NAVY} 0%, ${PRIMARY} 55%, ${CYAN} 100%)`,
                            }}
                        >
                            <div
                                className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-[#40C3CF]/25 blur-3xl"
                                aria-hidden
                            />
                            <div
                                className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-[#25a36f]/20 blur-3xl"
                                aria-hidden
                            />
                            <div className="relative">
                                <TopReviewedSlider />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
