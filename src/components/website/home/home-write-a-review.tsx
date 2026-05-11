"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";
import Image from "next/image";

const NAVY = "#13203f";
const NAVY_SOFT = "#1e3a6e";

type Testimonial = {
    name: string;
    role: string;
    rating: string;
    excerpt: string;
    initials: string;
    avatarBg: string;
    /** Dark gradient avatars → white initials */
    avatarLightText?: boolean;
};

const testimonials: Testimonial[] = [
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

type ReviewedCard = {
    id: string;
    name: string;
    role: string;
    title: string;
    body: string;
    avatarClass: string;
    logoLabel: string;
};

/** Each slide = two cards side by side */
const sliderSlides: [ReviewedCard, ReviewedCard][] = [
    [
        {
            id: "svetlana",
            name: "Svetlana",
            role: "Financial Advisor",
            title: "Proxies that don't freeze when the market goes crazy",
            body:
                "Had a situation where volatility spiked hard, and I had to react fast across multiple platforms. Used dedicated IPv4 proxies in different regions....",
            avatarClass: "bg-gradient-to-br from-amber-100 via-orange-200 to-rose-300",
            logoLabel: "ProxyLine",
        },
        {
            id: "artur",
            name: "Artur Lykov",
            role: "Developer",
            title: "Predictable performance in long sessions, support handled my mistake professionally",
            body:
                "With SpaceProxy I get predictable behavior during long sessions. The connection remains stable, pages load consistently, and there are no random drops...",
            avatarClass: "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600",
            logoLabel: "SpaceProxy",
        },
    ],
    [
        {
            id: "nina-k",
            name: "Nina Kovacs",
            role: "Data Analyst",
            title: "Side‑by‑side pricing finally made our CFO say yes",
            body:
                "We stacked three analytics suites on Comparex — export limits and renewal clauses were visible without digging through PDFs. Procurement shaved almost two weeks off the cycle....",
            avatarClass: "bg-gradient-to-br from-fuchsia-200 via-purple-300 to-indigo-400",
            logoLabel: "DataLens",
        },
        {
            id: "omar-h",
            name: "Omar Hassan",
            role: "Security Engineer",
            title: "Honest SOC2 notes saved us from a bad shortlist",
            body:
                "Buyer reviews called out gaps in SSO that glossy demos skipped. We pivoted before legal spend kicked in — rare win for an infra bake‑off....",
            avatarClass: "bg-gradient-to-br from-teal-200 via-cyan-400 to-blue-600",
            logoLabel: "ShieldOne",
        },
    ],
    [
        {
            id: "mei-l",
            name: "Mei Lin",
            role: "HR Director",
            title: "Onboarding checklists matched real payroll quirks",
            body:
                "Past HR tools looked fine until month‑end. This stack lined up with how we split contractors vs employees — Comparex threads surfaced that early....",
            avatarClass: "bg-gradient-to-br from-rose-200 via-pink-300 to-red-400",
            logoLabel: "PeopleFlow",
        },
        {
            id: "diego-r",
            name: "Diego Ramos",
            role: "Sales Ops",
            title: "CRM migration without losing pipeline history",
            body:
                "Field reps were skeptical; staged rollout notes from other buyers calmed leadership. Sync stayed stable through quarter close....",
            avatarClass: "bg-gradient-to-br from-lime-200 via-emerald-400 to-green-700",
            logoLabel: "PipeHQ",
        },
    ],
    [
        {
            id: "yuki-t",
            name: "Yuki Tanaka",
            role: "Product Manager",
            title: "API docs matched what engineers saw in sandbox",
            body:
                "Webhook retries and rate limits were documented where reviews said they’d be — fewer midnight pages during integration week....",
            avatarClass: "bg-gradient-to-br from-orange-200 via-amber-400 to-yellow-600",
            logoLabel: "BridgeAPI",
        },
        {
            id: "claire-v",
            name: "Claire Vermeer",
            role: "Finance Controller",
            title: "Multi‑entity billing rules reviewed clearly upfront",
            body:
                "Subsidiary invoicing is messy for us. Peer reviews flagged rounding behaviour before we signed — avoided another spreadsheet workaround....",
            avatarClass: "bg-gradient-to-br from-violet-200 via-violet-400 to-purple-800",
            logoLabel: "LedgerCloud",
        },
    ],
];

function DarkLogoMark({ label }: { label: string }) {
    return (
        <div className="flex size-[52px] shrink-0 items-center justify-center rounded-lg bg-slate-950 px-1 text-center shadow-inner">
            <span className="text-[10px] font-bold leading-[1.15] tracking-tight text-white">{label}</span>
        </div>
    );
}

function ReviewedSoftwareCard({ item }: { item: ReviewedCard }) {
    return (
        <article className="overflow-hidden h-[280px] rounded-2xl bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between gap-4 bg-[#f2f6fb] px-5 py-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div
                        className={`size-11 shrink-0 rounded-lg bg-cover shadow-sm ring-1 ring-black/5 ${item.avatarClass}`}
                        aria-hidden
                    />
                    <div className="min-w-0">
                        <p className="truncate font-bold text-slate-950">{item.name}</p>
                        <p className="truncate text-[13px] text-slate-500">{item.role}</p>
                    </div>
                </div>
                <DarkLogoMark label={item.logoLabel} />
            </div>
            <div className="bg-white px-5 pb-5 pt-4">
                <h4 className="text-[15px] font-bold leading-snug text-slate-950">{item.title}</h4>
                <p className="mt-2 line-clamp-4 text-[16px] leading-relaxed text-slate-600">{item.body}</p>
            </div>
        </article>
    );
}

function TopReviewedSlider() {
    const [slide, setSlide] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const id = window.setInterval(() => {
            setSlide((s) => (s + 1) % sliderSlides.length);
        }, 5200);
        return () => window.clearInterval(id);
    }, [paused]);

    const pair = sliderSlides[slide];

    return (
        <div
            className="flex flex-col gap-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div
                className="grid gap-5 sm:grid-cols-2 sm:gap-6"
                aria-live="polite"
                aria-label={`Review slide ${slide + 1} of ${sliderSlides.length}`}
            >
                {pair.map((item) => (
                    <ReviewedSoftwareCard key={`${slide}-${item.id}`} item={item} />
                ))}
            </div>

            <div className="flex justify-center gap-2 pb-0.5">
                {sliderSlides.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setSlide(i)}
                        className={`h-2.5 rounded-full transition-all ${i === slide
                                ? "w-8 bg-[#25a36f]"
                                : "w-2.5 bg-slate-300 hover:bg-slate-400 lg:bg-white/40 lg:hover:bg-white/65"
                            }`}
                        aria-label={`Show reviews slide ${i + 1}`}
                        aria-current={i === slide ? "true" : undefined}
                    />
                ))}
            </div>
        </div>
    );
}

function TestimonialCard({
    t,
    className,
}: {
    t: Testimonial;
    className?: string;
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
                <span className="flex shrink-0 items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow-sm">
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
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <Image src="/images/review.webp" alt="Write a Review" width={500} height={500} className="w-full h-full object-cover" />

                    <div className="text-center lg:text-start">
                        <h2
                            className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.25rem]"
                            style={{ color: "#1e293b" }}
                        >
                            Because Your Voice Matters <br /> Be Heard!
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 lg:mx-0 mx-auto">
                            Share Your Review in Just 2 Minutes and Help Our Buyers Find the Right Software/Service
                            Provider.
                        </p>
                        <div className="mt-6">
                        <Link
                                href="/"
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

            {/* —— Top reviewed software — carousel —— */}
            <section className="relative mx-4 overflow-hidden sm:mx-6 lg:mx-auto lg:max-w-8xl">
                <div
                    className="absolute inset-0 lg:hidden"
                    style={{
                        background:
                            "linear-gradient(168deg, #f2f6fb 0%, #f2f6fb 40%,rgb(114, 162, 251) 44%,rgb(46, 94, 192) 100%)",
                    }}
                    aria-hidden
                />
                <div
                    className="absolute inset-0 hidden bg-[#f2f6fb] lg:block"
                    style={{ clipPath: "polygon(0 0, 50% 0, 30% 100%, 0 100%)" }}
                    aria-hidden
                />
                <div
                    className="absolute inset-0 hidden lg:block"
                    style={{
                        background: `linear-gradient(165deg, ${NAVY_SOFT} 0%, ${NAVY} 42%,rgb(66, 125, 243) 100%)`,
                        clipPath: "polygon(50% 0, 100% 0, 100% 100%, 30% 100%)",
                    }}
                    aria-hidden
                />

                <div className="relative z-10 grid gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.35fr)] lg:gap-14 lg:py-16 lg:pl-14 lg:pr-12">
                    <div className="flex flex-col justify-center lg:max-w-[380px] lg:pr-4">
                        <div className="relative">
                            {/* Watermark quote — layered behind heading (matches design) */}
                            <RiDoubleQuotesL
                                className="pointer-events-none absolute -left-1 -top-2 z-0 size-[clamp(88px,22vw,150px)] text-sky-300/55 sm:-left-2 sm:-top-20 sm:size-[clamp(122px,20vw,170px)]"
                                aria-hidden
                            />
                            <h3
                                className="relative z-10 text-[30px] font-bold leading-[1.2] tracking-tight sm:text-[35px]"
                                style={{ color: NAVY }}
                            >
                                Top 8 Most Reviewed Software of April 2026
                            </h3>
                        </div>
                    </div>

                    <TopReviewedSlider />
                </div>
            </section>
        </div>
    );
};
