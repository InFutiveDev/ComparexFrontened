"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  HiOutlineChevronUpDown,
  HiOutlineClipboardDocument,
  HiOutlineStar,
  HiStar,
} from "react-icons/hi2";

const firms = [
  {
    name: "Razorpay",
    logo: "RP",
    bestForTags: ["🚀 Startup Friendly", "💸 Easy Integration", "💸 Low Failure Rate"],
    businessAge: "10 Years",
    location: "Bangalore",
    pricing: "1.9%",
    settlement: "T+2",
    onboarding: "24 Hours",
    products: "UPI, Cards, Subscription Billing",
    platforms: [
      { icon: "/logos/shopy.webp", alt: "Shopify", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Google", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" as const },
    ],
    platformsExtra: 1,
    offer: { headline: "Zero Setup", code: "RAZFREE" },
    review: "4.8",
    reviewCount: 1250,
    trust: "9.2",
    featured: true,
  },
  {
    name: "Cashfree",
    logo: "CF",
    bestForTags: ["💸 Instant Settlement", "💸 Payouts", "💸 High Success Rate"],
    businessAge: "8 Years",
    location: "Bangalore",
    pricing: "1.75%",
    settlement: "Instant",
    onboarding: "12 Hours",
    products: "Payouts, Smart Routing",
    platforms: [
      { icon: "/logos/shopy.webp", alt: "Microsoft", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Google", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Filmora", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Swipe", tone: "light" as const },
    ],
    platformsExtra: 0,
    offer: { headline: "Startup Offer", code: "CFSTART" },
    review: "4.7",
    reviewCount: 980,
    trust: "9.0",
    featured: false,
  },
  {
    name: "PhonePe PG",
    logo: "PP",
    bestForTags: ["🇮🇳 UPI Strong", "💸 Fast Checkout", "💸 Enterprise Ready"],
    businessAge: "7 Years",
    location: "Bangalore",
    pricing: "1.8%",
    settlement: "Instant",
    onboarding: "18 Hours",
    products: "UPI, QR, Payment Links",
    platforms: [
      { icon: "/logos/shopy.webp", alt: "Quick Heal", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" as const },
    ],
    platformsExtra: 1,
    offer: { headline: "Special Pricing", code: "PPDEAL" },
    review: "4.9",
    reviewCount: 850,
    trust: "9.5",
    featured: false,
  },
  {
    name: "PayU PG",
    logo: "PP",
    bestForTags: ["🇮🇳 UPI Strong", "💸 Fast Checkout", "💸 Enterprise Ready"],
    businessAge: "7 Years",
    location: "Bangalore",
    pricing: "1.8%",
    settlement: "Instant",
    onboarding: "18 Hours",
    products: "UPI, QR, Payment Links",
    platforms: [
      { icon: "/logos/shopy.webp", alt: "Quick Heal", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" as const },
    ],
    platformsExtra: 1,
    offer: { headline: "Special Pricing", code: "PPDEAL" },
    review: "4.9",
    reviewCount: 850,
    trust: "9.5",
    featured: false,
  },
  {
    name: "Paytm PG",
    logo: "PP",
    bestForTags: ["🇮🇳 UPI Strong", "💸 Fast Checkout", "💸 Enterprise Ready"],
    businessAge: "7 Years",
    location: "Bangalore",
    pricing: "1.8%",
    settlement: "Instant",
    onboarding: "18 Hours",
    products: "UPI, QR, Payment Links",
    platforms: [
      { icon: "/logos/shopy.webp", alt: "Quick Heal", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" as const },
    ],
    platformsExtra: 1,
    offer: { headline: "Special Pricing", code: "PPDEAL" },
    review: "4.9",
    reviewCount: 850,
    trust: "9.5",
    featured: false,
  },
  {
    name: "GPay PG",
    logo: "PP",
    bestForTags: ["🇮🇳 UPI Strong", "💸 Fast Checkout", "💸 Enterprise Ready"],
    businessAge: "7 Years",
    location: "Bangalore",
    pricing: "1.8%",
    settlement: "Instant",
    onboarding: "18 Hours",
    products: "UPI, QR, Payment Links",
    platforms: [
      { icon: "/logos/shopy.webp", alt: "Quick Heal", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" as const },
      { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" as const },
    ],
    platformsExtra: 1,
    offer: { headline: "Special Pricing", code: "PPDEAL" },
    review: "4.9",
    reviewCount: 850,
    trust: "9.5",
    featured: false,
  },
];

const paymentModes = [
  "UPI Payments",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Wallet Payments",
  "QR Payments",
  "International",
  "Subscription Billing",
];

const sortOptions = [
  { value: "emerging", label: "Emerging PG" },
  { value: "papgApproved", label: "PAPG Approved" },
  { value: "instantSettlement", label: "Instant Settlement" },
  { value: "bestForStartup", label: "Best for Startup" },
  { value: "dedicatedSupport", label: "Dedicated Support" },
  { value: "fastOnboarding", label: "Fast onboarding" },
] as const;

type SortOption = (typeof sortOptions)[number]["value"];

const tableColumns = [
  { label: "PG Name", sortable: true, sticky: true },
  { label: "Best For / Smart Tags", sortable: true },
  { label: <>Business<br />Age</>, sortable: false },
  { label: "Location", sortable: false },
  { label: <>Pricing<br />(MDR)</>, sortable: false },
  { label: <>Settlement<br />Cycle</>, sortable: false },
  { label: <>Onboarding<br />TAT</>, sortable: false },
  { label: "Products", sortable: true },
  { label: "Supported Platforms", sortable: true },
  { label: "Offers", sortable: true },
  { label: "Review Link", sortable: true },
  { label: "Talk to Expert", sortable: false },
  { label: "Signup / Get Started CTA", sortable: false },
  { label: "Personalised Quote", sortable: false },
] as const;

const colDivider =
  "relative [&:not(:last-child)]:after:pointer-events-none [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:top-1/2 [&:not(:last-child)]:after:h-[58%] [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:-translate-y-1/2 [&:not(:last-child)]:after:bg-[#2D4CC8]/20 [&:not(:last-child)]:after:content-['']";

const thBase = `whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#13203F]/70 ${colDivider}`;

const tdBase = `border-t border-slate-100 px-4 py-4 align-middle text-sm text-slate-700 ${colDivider}`;

const stickyCellShadow =
  "shadow-[4px_0_12px_-4px_rgba(19,32,63,0.12)]";

function FirmPgName({
  name,
  logo,
  rating,
  reviewCount,
}: {
  name: string;
  logo: string;
  rating: string;
  reviewCount: number;
}) {
  const numericRating = Number.parseFloat(rating);

  return (
    <div className="flex min-w-[220px] items-center gap-3">
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#2D4CC8] bg-[#13203F] text-lg font-bold text-white">
          {logo}
        </div>
        {/* <span
          className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#2D4CC8] bg-[#40C3CF] text-[10px] leading-none text-[#13203F]"
          aria-hidden
        >
          ★
        </span> */}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] leading-tight font-bold text-[#13203F]">{name}</h3>
        </div>
        <div className="mt-1.5">
          <div className="flex items-center gap-2">
            <div className="w-fit rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] p-px">
              <div className="rounded-full bg-[#13203F] px-2.5 py-0.5">
                <span className="text-[13px] font-bold text-white">{rating}</span>
              </div>
            </div>
            <StarRating rating={numericRating} />
          </div>
          <p className="mt-1 text-sm font-medium text-[#2D4CC8]">
            {reviewCount.toLocaleString()}{" "}
            <span className="text-slate-500">reviews</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function SmartTags({ labels }: { labels: string[] }) {
  return (
    <div className="flex w-fit mx-auto justify-center gap-x-2 gap-y-1 flex-wrap items-center">
      {labels.map((label) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#13203F] px-3 py-1 text-xs font-semibold text-white shadow-sm"
        >
          
          {label}
        </span>
      ))}
    </div>
  );
}

function SettlementBadge({ value }: { value: string }) {
  const isInstant = value.toLowerCase().includes("instant");
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold ${
        isInstant
          ? "bg-[#40C3CF]/20 text-[#0f766e]"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {value}
    </span>
  );
}

function maskCouponCode(code: string) {
  return `${code.charAt(0)}${"*".repeat(6)}`;
}

function OfferCoupon({
  headline,
  code,
}: {
  headline: string;
  code: string;
}) {
  const masked = maskCouponCode(code);

  const copyCode = () => {
    void navigator.clipboard.writeText(code);
  };

  return (
    <div className="w-[7.5rem] overflow-hidden rounded-xl bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] p-1 shadow-sm">
      <p className="px-1 py-2 text-center text-[11px] font-bold uppercase leading-tight text-white">
        {headline}
      </p>
      <div className="flex items-center justify-between gap-1 rounded-lg bg-[#13203F] px-2 py-2">
        <span className="text-[11px] font-bold tracking-wide text-white">
          {masked}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="shrink-0 cursor-pointer rounded p-0.5 text-[#40C3CF] transition-opacity hover:opacity-80"
          aria-label={`Copy coupon code ${code}`}
        >
          <HiOutlineClipboardDocument className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        const starIndex = i + 1;
        const fill = Math.min(1, Math.max(0, rating - (starIndex - 1)));

        if (fill <= 0) {
          return (
            <HiOutlineStar key={starIndex} className="size-4 text-slate-300" />
          );
        }

        if (fill >= 1) {
          return <HiStar key={starIndex} className="size-4 text-[#40C3CF]" />;
        }

        return (
          <span key={starIndex} className="relative inline-block size-4">
            <HiOutlineStar className="size-4 text-slate-300" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <HiStar className="size-4 text-[#40C3CF]" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function FirmReview({
  rating,
  reviewCount,
}: {
  rating: string;
  reviewCount: number;
}) {
  const numericRating = parseFloat(rating);

  return (
    <div
      className="flex flex-col items-center gap-1.5"
      aria-label={`${rating} out of 5, ${reviewCount} reviews`}
    >
      {/* <div className="rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] p-px">
        <div className="rounded-full bg-[#13203F] px-4 py-0.5">
          <span className="text-sm font-bold text-white">{rating}</span>
        </div>
      </div>

      <StarRating rating={numericRating} />

      <p className="text-xs">
        <span className="font-semibold text-[#2D4CC8]">
          {reviewCount.toLocaleString()}
        </span>{" "}
        <span className="text-slate-500">reviews</span>
      </p> */}

      <button
        type="button"
        className="mt-1 cursor-pointer rounded-full border border-[#2D4CC8] px-3 py-1 text-sm font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:text-white"
      >
        Add Review
      </button>
    </div>
  );
}

type PlatformIcon = {
  icon: string;
  alt: string;
  tone: "dark" | "light";
};

function PlatformCircle({ icon, alt, tone }: PlatformIcon) {
  const isDark = tone === "dark";
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white ${
        isDark
          ? "bg-[#13203F]"
          : "border border-[#2D4CC8]/40 bg-[#1b2d57]"
      }`}
      title={alt}
    >
      <Image
        src={icon}
        alt={alt}
        width={25}
        height={25}
        className="object-contain"
      />
    </span>
  );
}

function SupportedPlatforms({
  platforms,
  extra = 0,
}: {
  platforms: PlatformIcon[];
  extra?: number;
}) {
  const items = [
    ...platforms.map((platform, index) => ({
      type: "platform" as const,
      platform,
      index,
    })),
    ...(extra > 0 ? [{ type: "extra" as const, extra }] : []),
  ];

  return (
    <div
      className="flex justify-center"
      role="img"
      aria-label={`${platforms.length + extra} supported platforms`}
    >
      <div className="flex items-center">
        {items.map((item, i) => {
          const zIndex = items.length - i;

          if (item.type === "extra") {
            return (
              <span
                key="extra"
                style={{ zIndex }}
                className="relative -ml-2 flex size-9 shrink-0 items-center justify-center rounded-full border border-[#2D4CC8]/40 bg-gradient-to-br from-[#13203F] to-[#1b2d57] text-xs font-extrabold text-[#40C3CF] ring-2 ring-white shadow-sm first:ml-0"
              >
                +{item.extra}
              </span>
            );
          }

          return (
            <span
              key={`${item.platform.alt}-${item.index}`}
              className={i === 0 ? "relative" : "relative -ml-2"}
              style={{ zIndex }}
            >
              <PlatformCircle {...item.platform} />
            </span>
          );
        })}
      </div>
    </div>
  );
}

function TableHeaderCell({
  label,
  sortable,
  sticky,
}: {
  label: ReactNode;
  sortable: boolean;
  sticky?: boolean;
}) {
  return (
    <th
      scope="col"
      className={`${thBase} ${sticky ? `sticky left-0 z-20 bg-[#f4f6fc] ${stickyCellShadow}` : ""}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        {sortable && (
          <HiOutlineChevronUpDown
            className="size-4 text-[#2D4CC8]/50"
            aria-hidden
          />
        )}
      </span>
    </th>
  );
}

function rowBg(featured: boolean) {
  if (featured) return "bg-gradient-to-r from-[#eef3ff]/80 via-white to-white";
  return "bg-white";
}

function parseHours(value: string) {
  return Number.parseInt(value, 10) || 0;
}

export function HomeComparisonTable() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("emerging");
  const sortedFirms = [...firms].sort((a, b) => {
    switch (sortBy) {
      case "emerging":
        return parseHours(a.businessAge) - parseHours(b.businessAge);
      case "papgApproved":
        return Number(b.featured) - Number(a.featured);
      case "instantSettlement":
        return Number(b.settlement.toLowerCase().includes("instant")) - Number(a.settlement.toLowerCase().includes("instant"));
      case "bestForStartup":
        return Number(b.bestForTags.some((tag) => tag.toLowerCase().includes("startup"))) - Number(a.bestForTags.some((tag) => tag.toLowerCase().includes("startup")));
      case "dedicatedSupport":
        return b.reviewCount - a.reviewCount;
      case "fastOnboarding":
        return parseHours(a.onboarding) - parseHours(b.onboarding);
      default:
        return 0;
    }
  });

  return (
    <section className="mx-auto max-w-8xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#40C3CF]">
          CompareX
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#13203F] sm:text-4xl">
          Compare Payment Gateways
        </h2>
        <p className="mt-3 text-slate-600">
          Compare pricing, settlement speed, onboarding timelines and features
          side by side.
        </p>
      </div>

      <div className="flex max-h-[min(85vh,780px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-[#13203F]/5">
        {/* Filters — fixed */}
        <div className="shrink-0 border-b border-slate-200 bg-[#f8fafc] px-4 py-4 sm:px-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Filter by payment mode
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {paymentModes.map((mode, index) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setActiveFilter(index)}
                    className={`shrink-0 h-9 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors ${
                      activeFilter === index
                        ? "bg-[#2D4CC8] text-white shadow-md shadow-[#2D4CC8]/25"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8]"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-end gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="h-9 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-[#13203F] outline-none ring-[#2D4CC8]/30 focus:ring"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Table — scrollable */}
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[2200px] border-collapse">
            <thead className="sticky top-0 z-10 bg-[#f4f6fc] shadow-sm">
              <tr>
                {tableColumns.map((col, index) => (
                  <TableHeaderCell
                    key={typeof col.label === "string" ? col.label : `col-${index}`}
                    label={col.label}
                    sortable={col.sortable}
                    sticky={"sticky" in col ? col.sticky : false}
                  />
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedFirms.map((firm) => {
                const bg = rowBg(firm.featured);

                return (
                  <tr
                    key={firm.name}
                    className={`group transition-colors hover:bg-[#f8fafc] ${bg}`}
                  >
                    <td
                      className={`sticky left-0 z-[5] ${tdBase} ${bg} group-hover:bg-[#f8fafc] ${stickyCellShadow} ${firm.featured ? "border-l-4 border-l-[#2D4CC8]" : ""}`}
                    >
                      <FirmPgName
                        name={firm.name}
                        logo={firm.logo}
                        rating={firm.review}
                        reviewCount={firm.reviewCount}
                      />
                    </td>

                    <td className={tdBase}>
                      <SmartTags labels={firm.bestForTags} />
                    </td>
                    <td className={`${tdBase} font-medium text-[#13203F]`}>
                      {firm.businessAge}
                    </td>
                    <td className={tdBase}>{firm.location}</td>
                    <td className={tdBase}>
                      <span className="text-lg font-bold text-[#13203F]">
                        {firm.pricing}
                      </span>
                    </td>
                    <td className={tdBase}>
                      <SettlementBadge value={firm.settlement} />
                    </td>
                    <td className={`${tdBase} font-medium text-[#13203F]`}>
                      {firm.onboarding}
                    </td>
                    <td className={`${tdBase} max-w-[220px] leading-snug text-slate-600`}>
                      {firm.products}
                    </td>
                    <td className={tdBase}>
                      <SupportedPlatforms
                        platforms={firm.platforms}
                        extra={firm.platformsExtra}
                      />
                    </td>
                    <td className={tdBase}>
                      <OfferCoupon
                        headline={firm.offer.headline}
                        code={firm.offer.code}
                      />
                    </td>

                    <td className={tdBase}>
                      <FirmReview
                        rating={firm.review}
                        reviewCount={firm.reviewCount}
                      />
                    </td>

                    <td className={tdBase}>
                      <button
                        type="button"
                        className="whitespace-nowrap cursor-pointer rounded-full border-2 border-[#2D4CC8] px-4 py-2 text-sm font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:text-white"
                      >
                        Talk to Expert
                      </button>
                    </td>

                    <td className={tdBase}>
                      <button
                        type="button"
                        className="whitespace-nowrap cursor-pointer rounded-full border-2 border-[#2D4CC8] px-4 py-2 text-sm font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:text-white"
                      >
                        Signup / Get Started
                      </button>
                    </td>

                    <td className={tdBase}>
                      <button
                        type="button"
                        className="whitespace-nowrap cursor-pointer rounded-full bg-[#2D4CC8] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#2D4CC8]/20 transition-colors hover:bg-[#2542b6]"
                      >
                        Request Quote
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom bar — fixed */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-[#f8fafc] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-bold text-[#13203F]">
              Comparing 
            </h3>
            <button
            type="button"
            className="cursor-pointer rounded-xl bg-[#2D4CC8] px-6 py-2 font-medium text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            PG 1 
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-[#2D4CC8] px-6 py-2 font-medium text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            PG 2
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-[#2D4CC8] px-6 py-2 font-medium text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            PG 3
          </button>
          </div>
          <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-[#2D4CC8] px-6 py-2 font-medium text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Clear
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-[#2D4CC8] px-6 py-2 font-medium text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Compare Side by Side
          </button>
        </div>
          
        </div>
        

      </div>
    </section>
  );
}
