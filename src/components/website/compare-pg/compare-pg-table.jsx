"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUpDown,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { useTalkToExpert } from "@/components/website/talk-to-expert/talk-to-expert-provider";
import { ApiError } from "@/lib/api";
import { fetchPgComparison } from "@/lib/pg-compare";
import {
  getWebsitePricingForMode,
  mapPgCompareListToWebsiteRows,
  WEBSITE_PAYMENT_MODE_LABELS,
} from "@/lib/pg-website-compare";

const paymentModes = WEBSITE_PAYMENT_MODE_LABELS;

const paymentModeDropdowns = {
  "Credit Card": ["Visa", "Mastercard", "Rupay", "Amex"],
  "Debit Card": ["Visa Debit", "Mastercard Debit", "Rupay Debit"],
  "Net Banking": ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank"],
};

const sortOptions = [
    { value: "all", label: "All" },
    { value: "emerging", label: "Emerging PG" },
    { value: "papgApproved", label: "PAPG Approved" },
    { value: "instantSettlement", label: "Instant Settlement" },
    { value: "bestForStartup", label: "Best for Startup" },
    { value: "dedicatedSupport", label: "Dedicated Support" },
    { value: "fastOnboarding", label: "Fast onboarding" },
    ];

const FILTER_DROPDOWN_TITLE = "Filter by PG";

const MAX_COMPARE_PG = 3;

    const tableColumns = [
    { label: "PG Name", sortable: true, sticky: true, width: 125 },
    { label: "Best For / Smart Tags", sortable: true, width: 150 },
    { label: <>Business<br />Age</>, sortable: false, width: 72 },
    { label: "Location", sortable: false, width: 88 },
    { label: <>Pricing<br />(MDR)</>, sortable: false, width: 88 },
    { label: <>Settlement<br />Cycle</>, sortable: false, width: 96 },
    { label: <>Onboarding<br />TAT</>, sortable: false, width: 88 },
    { label: "Products", sortable: true, width: 150 },
    { label: "Supported Platforms", sortable: true, width: 130 },
    { label: "Offers", sortable: true, width: 112 },
    { label: "Review Link", sortable: true, width: 108 },
    { label: "Talk to Expert", sortable: false, width: 118 },
    { label: "Signup", sortable: false, width: 88 },
    { label: "Personalised Quote", sortable: false, width: 128 },
    ];

    const colDivider =
    "relative [&:not(:last-child)]:after:pointer-events-none [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:top-1/2 [&:not(:last-child)]:after:h-[58%] [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:-translate-y-1/2 [&:not(:last-child)]:after:bg-[#2D4CC8]/20 [&:not(:last-child)]:after:content-['']";

    const thBase = `whitespace-nowrap px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4 sm:py-3.5 sm:text-[11px] ${colDivider}`;

    const tdBase = `border-t border-slate-100 px-3 py-2 align-middle text-[12px] text-slate-700 sm:px-4 sm:py-4 sm:text-sm ${colDivider}`;

    const stickyCellShadow =
    "shadow-[4px_0_12px_-4px_rgba(19,32,63,0.12)]";

function FirmPgName({ name, logo, logoUrl, slug }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const href = slug ? `/compare-pg/${slug}` : "#";

  return (
    <Link
      href={href}
      className="flex w-[130px] max-w-[130px] items-center gap-1.5 transition-opacity hover:opacity-90 sm:w-[155px] sm:max-w-[155px] sm:gap-2"
    >
      <div className="relative shrink-0">
        {logoUrl && !logoFailed ? (
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border-2 border-[#2D4CC8] bg-white sm:h-10 sm:w-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt=""
              className="max-h-full max-w-full object-contain p-0.5"
              onError={() => setLogoFailed(true)}
            />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#2D4CC8] bg-white/80 text-xs font-bold text-black sm:h-10 sm:w-10 sm:text-sm">
            {logo}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-[12px] font-bold leading-tight text-[#13203F] transition-colors hover:text-[#2D4CC8] sm:text-[13px]">
          {name}
        </h3>
      </div>
    </Link>
  );
}
    function SmartTags({ labels, compact = false }) {
    return (
        <div
        className={`flex flex-wrap items-start justify-start gap-x-1 gap-y-0.5 sm:gap-x-2 sm:gap-y-1 ${
            compact ? "max-w-[138px]" : "max-w-[138px] sm:max-w-none"
        }`}
        >
        {labels.map((label) => (
            <span
            key={label}
            className="inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded-full border border-[#2D4CC8] bg-white/80 px-1.5 py-0.5 text-[9px] font-semibold text-black sm:px-3 sm:py-1 sm:text-xs"
            >
            {label}
            </span>
        ))}
        </div>
    );
    }

    const AGE_SEGMENT_COUNT = 10;
    const AGE_RING_SIZE = 64;
    const AGE_RING_STROKE = 12;
    const AGE_RING_ACTIVE = "#2D4CC8";
    const AGE_RING_INACTIVE = "#D1D5DB";

    const AGE_RING_PATHS = [
    "M 59.76 16.15 A 32 32 0 0 0 44 12",
    "M 73.12 30.73 A 32 32 0 0 0 62.81 18.11",
    "M 75.36 50.38 A 32 32 0 0 0 74.43 34.11",
    "M 65.62 67.59 A 32 32 0 0 0 74.43 53.89",
    "M 47.62 75.79 A 32 32 0 0 0 62.81 69.89",
    "M 28.24 71.85 A 32 32 0 0 0 44 76",
    "M 14.88 57.27 A 32 32 0 0 0 25.19 69.89",
    "M 12.64 37.62 A 32 32 0 0 0 13.57 53.89",
    "M 22.38 20.41 A 32 32 0 0 0 13.57 34.11",
    "M 40.38 12.21 A 32 32 0 0 0 25.19 18.11",
    ];

    function parseBusinessAgeYears(businessAge, businessAgeYears) {
    if (Number.isFinite(businessAgeYears)) return businessAgeYears;
    return parseHours(businessAge);
    }

    function businessAgeToActiveSegments(businessAge, businessAgeYears) {
    const years = parseBusinessAgeYears(businessAge, businessAgeYears);
    if (!years) return 0;
    return Math.min(AGE_SEGMENT_COUNT, Math.max(1, years));
    }

    function BusinessAgeRing({ businessAge, businessAgeYears, size = AGE_RING_SIZE }) {
    if (!businessAge && !businessAgeYears) {
      return (
        <span className="mx-auto block text-center text-xs text-slate-400">—</span>
      );
    }

    const years = parseBusinessAgeYears(businessAge, businessAgeYears);
    const activeSegments = businessAgeToActiveSegments(businessAge, businessAgeYears);

    return (
        <div
        className="relative mx-auto shrink-0"
        style={{ width: size, height: size }}
        aria-label={`${businessAge}, ${activeSegments} out of ${AGE_SEGMENT_COUNT}`}
        title={businessAge}
        >
        <svg
            width={size}
            height={size}
            viewBox="0 0 88 88"
            fill="none"
            aria-hidden
        >
            {AGE_RING_PATHS.map((path, index) => (
            <path
                key={index}
                d={path}
                stroke={index < activeSegments ? AGE_RING_ACTIVE : AGE_RING_INACTIVE}
                strokeWidth={AGE_RING_STROKE}
                strokeLinecap="round"
            />
            ))}
        </svg>

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span
            className={`font-bold leading-none text-gray-600 tabular-nums ${
                String(years).length > 2 ? "text-[11px]" : "text-[12px]"
            }`}
            >
            {years}
            </span>
        </div>
        </div>
    );
    }

    function SettlementBadge({ value }) {
    const isInstant = value.toLowerCase().includes("instant");
    return (
        <span
        className={`inline-flex px-3 py-1 text-[12px] font-semibold border border-[#2D4CC8] rounded-full ${
            isInstant
            ? "bg-white border border-[#2D4CC8] rounded-full text-gray-600"
            : "bg-white border border-[#2D4CC8] rounded-full text-gray-600"
        }`}
        >
        {value}
        </span>
    );
    }

    function maskCouponCode(code) {
    return `${code.charAt(0)}${"*".repeat(6)}`;
    }

    function OfferCoupon({
    headline,
    code,
    }) {
    const masked = maskCouponCode(code);

    const copyCode = () => {
        void navigator.clipboard.writeText(code);
    };

    return (
        <div className="w-[7.5rem] overflow-hidden rounded-xl border border-[#2D4CC8] bg-white p-1 shadow-sm">
        <p className="px-1 py-2 text-center text-[11px] font-bold uppercase leading-tight text-[#13203F]">
            {headline}
        </p>
        <div className="flex items-center justify-between gap-1 rounded-lg bg-white px-2 py-2">
            <span className="text-[11px] font-bold tracking-wide text-gray-600">
            {masked}
            </span>
            
        </div>
        </div>
    );
    }

function FirmReview({ rating, reviewCount }) {
  return (
    <Link
      href="/reviews"
      className="flex flex-col items-center gap-1.5"
      aria-label={`${rating} out of 5, ${reviewCount} reviews — open reviews page`}
    >
      <span className="mt-1 cursor-pointer rounded-full border border-[#2D4CC8] px-3 py-1 text-[12px] font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:text-white">
        Add Review
      </span>
    </Link>
  );
}

    function PlatformCircle({ icon, alt, tone }) {
    const isDark = tone === "dark";
    return (
        <span
        className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/80 ${
            isDark
            ? "bg-white/80"
            : "border border-gray-200 bg-white/80"
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
    }) {
    const items = [
        ...platforms.map((platform, index) => ({
        type: "platform",
        platform,
        index,
        })),
        ...(extra > 0 ? [{ type: "extra", extra }] : []),
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

    function rowBg(featured) {
    if (featured) return "bg-gradient-to-r from-[#eef3ff]/80 via-white to-white";
    return "bg-white";
    }

function parseHours(value) {
  return Number.parseInt(value, 10) || 0;
}

const toolbarPillBaseClass =
  "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-xs font-semibold leading-none transition-colors sm:px-3";

function PaymentModeFilterButton({
  mode,
  index,
  isActive,
  subOptions,
  activeSubFilter,
  onSelectMode,
  onSelectSub,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasDropdown = Boolean(subOptions?.length);
  const baseButtonClass = `${toolbarPillBaseClass} ${
    isActive
      ? "border-[#2D4CC8] bg-[#2D4CC8] text-white shadow-sm shadow-[#2D4CC8]/20"
      : "border-[#2D4CC8] bg-white text-slate-600 hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8]"
  }`;

  function handleButtonClick() {
    onSelectMode(index);
    if (hasDropdown) {
      setIsOpen((prev) => !prev);
    }
  }

  if (!hasDropdown) {
    return (
      <button type="button" onClick={() => onSelectMode(index)} className={baseButtonClass}>
        {mode}
      </button>
    );
  }

  return (
    <div
      className="relative inline-flex shrink-0 items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={handleButtonClick}
        className={baseButtonClass}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {mode}
        <HiOutlineChevronDown
          className={`size-3.5 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          } ${isActive ? "text-white/90" : "text-[#2D4CC8]"}`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-[60] w-max min-w-[180px] pt-1.5"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg shadow-slate-900/10">
            {subOptions.map((option) => {
              const isSubActive = isActive && activeSubFilter === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelectSub(index, option)}
                  className={`block w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                    isSubActive
                      ? "bg-[#EEF2FC] text-[#2D4CC8]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#2D4CC8]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ToolbarFilterDropdown({ title, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div
      className="relative inline-flex shrink-0 items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${toolbarPillBaseClass} border-[#2D4CC8] bg-white text-slate-600 hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8]`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={title}
      >
        {title}
        <HiOutlineChevronDown
          className={`size-3.5 shrink-0 text-[#2D4CC8] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-full z-[60] w-max min-w-[200px] pt-1.5 sm:left-auto sm:right-0"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
            <div className="bg-[#2D4CC8] px-4 py-2 text-left text-sm font-medium text-white">
              {title}
            </div>
            <div className="py-1.5" role="listbox" aria-label={title}>
              {options.map((option) => {
                const isSelected = value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={`block w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-[#EEF2FC] text-[#2D4CC8]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#2D4CC8]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ComparePgCell({
    firm,
    compareModeOpen,
    isSelected,
    onToggle,
    disableUnchecked,
    }) {
    return (
        <div className="flex items-center gap-3">
        {compareModeOpen ? (
            <input
            type="checkbox"
            checked={isSelected}
            disabled={disableUnchecked}
            onChange={onToggle}
            className="size-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#2D4CC8] focus:ring-[#2D4CC8]/30 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Compare ${firm.name}`}
            />
        ) : null}
        <FirmPgName
          name={firm.name}
          logo={firm.logo}
          logoUrl={firm.logoUrl}
          slug={firm.slug}
        />
        </div>
    );
    }

function ComparePGTable() {
  const { openTalkToExpert } = useTalkToExpert();
  const [firms, setFirms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);
  const [activeSubFilter, setActiveSubFilter] = useState(null);
  const [compareModeOpen, setCompareModeOpen] = useState(false);
  const [selectedCompareFirms, setSelectedCompareFirms] = useState([]);
  const [sortBy, setSortBy] = useState("emerging");
  const [searchQuery, setSearchQuery] = useState("");

  const loadFirms = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await fetchPgComparison({ sort: "name_asc" });
      setFirms(mapPgCompareListToWebsiteRows(data));
    } catch (err) {
      setFirms([]);
      setLoadError(
        err instanceof ApiError
          ? err.message
          : "Failed to load payment gateways. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirms();
  }, [loadFirms]);

  function selectPaymentMode(index, subOption = null) {
    setActiveFilter(index);
    setActiveSubFilter(subOption);
  }

  function toggleCompareFirm(firmName) {
    setSelectedCompareFirms((prev) => {
      if (prev.includes(firmName)) {
        return prev.filter((name) => name !== firmName);
      }
      if (prev.length >= MAX_COMPARE_PG) return prev;
      return [...prev, firmName];
    });
  }

  function clearCompareFirms() {
    setSelectedCompareFirms([]);
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const sortedFirms = [...firms]
    .filter((firm) => {
      if (!normalizedSearch) return true;

      return (
        firm.name.toLowerCase().includes(normalizedSearch) ||
        firm.location.toLowerCase().includes(normalizedSearch) ||
        firm.products.some((product) =>
          product.toLowerCase().includes(normalizedSearch)
        ) ||
        firm.bestForTags.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch)
        )
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "all":
          return 0;
        case "emerging":
          return (a.tatOrder ?? 99) - (b.tatOrder ?? 99);
        case "papgApproved":
          return Number(b.featured) - Number(a.featured);
        case "instantSettlement":
          return Number(b.settlementInstant) - Number(a.settlementInstant);
        case "bestForStartup":
          return (
            Number(b.bestForTags.some((tag) => tag.toLowerCase().includes("startup"))) -
            Number(a.bestForTags.some((tag) => tag.toLowerCase().includes("startup")))
          );
        case "dedicatedSupport":
          return b.reviewCount - a.reviewCount;
        case "fastOnboarding":
          return a.onboardingHours - b.onboardingHours;
        default:
          return 0;
      }
    });

  return (
    <section className="mx-auto max-w-8xl px-4 py-14 sm:px-6 lg:px-8">
      {loadError ? (
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={loadFirms}
            className="rounded-full border border-red-300 bg-white px-4 py-1.5 text-sm font-semibold text-red-700"
          >
            Retry
          </button>
        </div>
      ) : null}
      <div className="flex max-h-none flex-col rounded-2xl border border-slate-200 bg-white shadow-lg shadow-[#13203F]/5 lg:max-h-[min(85vh,780px)]">
        <div className="relative z-30 shrink-0 overflow-visible border-b border-slate-200 bg-[#f8fafc] px-4 py-4 sm:px-5">
          {selectedCompareFirms.length > 0 ? (
            <div className="mb-4 flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-sm font-bold text-[#13203F]">Comparing</span>
                <div
                  className="flex flex-wrap items-center gap-2"
                  role="tablist"
                  aria-label="Selected payment gateways to compare"
                >
                  {selectedCompareFirms.map((firmName) => {
                    const firm = firms.find((item) => item.name === firmName);
                    if (!firm) return null;

                    return (
                      <button
                        key={firmName}
                        type="button"
                        role="tab"
                        aria-selected="true"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#2D4CC8] bg-[#2D4CC8] px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-[#2D4CC8]/20 transition-colors hover:bg-[#2542b6]"
                      >
                        <span className="flex size-6 items-center justify-center rounded-md border border-white/30 bg-white/15 text-[10px] font-bold">
                          {firm.logo}
                        </span>
                        {firm.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={clearCompareFirms}
                  className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-[#2D4CC8] bg-white px-5 text-sm font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8]/5"
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={selectedCompareFirms.length < 2}
                  className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-[#2D4CC8] px-5 text-sm font-semibold text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  style={{ color: "#fff" }}
                >
                  Compare Side by Side
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-nowrap items-center gap-1.5 overflow-visible">
            <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-visible">
              {paymentModes.map((mode, index) => (
                <PaymentModeFilterButton
                  key={mode}
                  mode={mode}
                  index={index}
                  isActive={activeFilter === index}
                  subOptions={paymentModeDropdowns[mode]}
                  activeSubFilter={activeSubFilter}
                  onSelectMode={(modeIndex) => selectPaymentMode(modeIndex)}
                  onSelectSub={(modeIndex, subOption) =>
                    selectPaymentMode(modeIndex, subOption)
                  }
                />
              ))}
            </div>

            <div className="relative w-50 shrink-0 sm:w-80">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search PG"
                aria-label="Search payment gateways"
                className="h-8 w-full rounded-full border border-[#2D4CC8] bg-white py-0 pl-3 pr-8 text-xs font-medium text-slate-600 placeholder:text-slate-400 outline-none transition-colors hover:border-[#2D4CC8]/40 focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20"
              />
              <HiOutlineMagnifyingGlass
                className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#2D4CC8]"
                aria-hidden
              />
            </div>

            <div className="ml-auto flex shrink-0 flex-nowrap items-center gap-1.5 overflow-visible pl-2">
              <button
                type="button"
                onClick={() => setCompareModeOpen((prev) => !prev)}
                className={`${toolbarPillBaseClass} ${
                  compareModeOpen
                    ? "border-[#2D4CC8] bg-[#4f39f6] text-white shadow-sm shadow-[#4f39f6]/20"
                    : "border-[#2D4CC8] bg-white text-slate-600 hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8]"
                }`}
              >
                Compare
              </button>

              <ToolbarFilterDropdown
                title={FILTER_DROPDOWN_TITLE}
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>
        </div>

        <div className="h-[252px] min-h-0 shrink-0 overflow-auto sm:h-[300px] lg:h-auto lg:max-h-none lg:flex-1">
          <table className="w-full min-w-[2135px] border-collapse">
            <thead className="sticky top-0 z-10 bg-[#f4f6fc] shadow-sm">
              <tr>
                {tableColumns.map((col, index) => (
                  <TableHeaderCell
                    key={typeof col.label === "string" ? col.label : `col-${index}`}
                    label={col.label}
                    sortable={col.sortable}
                    sticky={Boolean(col.sticky)}
                  />
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={tableColumns.length}
                    className="px-4 py-16 text-center text-sm text-slate-500"
                  >
                    Loading active payment gateways…
                  </td>
                </tr>
              ) : sortedFirms.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColumns.length}
                    className="px-4 py-16 text-center text-sm text-slate-500"
                  >
                    No active payment gateways match your search.
                  </td>
                </tr>
              ) : (
              sortedFirms.map((firm) => {
                const bg = rowBg(firm.featured);

                return (
                  <tr
                    key={firm.id || firm.slug || firm.name}
                    className={`group transition-colors hover:bg-[#f8fafc] ${bg}`}
                  >
                    <td
                      className={`sticky left-0 z-[5] ${tdBase} ${bg} group-hover:bg-[#f8fafc] ${stickyCellShadow} ${firm.featured ? "border-l-4 border-l-[#2D4CC8]" : ""}`}
                    >
                      <ComparePgCell
                        firm={firm}
                        compareModeOpen={compareModeOpen}
                        isSelected={selectedCompareFirms.includes(firm.name)}
                        onToggle={() => toggleCompareFirm(firm.name)}
                        disableUnchecked={
                          !selectedCompareFirms.includes(firm.name) &&
                          selectedCompareFirms.length >= MAX_COMPARE_PG
                        }
                      />
                    </td>

                    <td className={tdBase}>
                      <SmartTags labels={firm.bestForTags} compact />
                    </td>
                    <td className={tdBase}>
                      <div className="mx-auto w-fit origin-center scale-[0.72] sm:scale-100">
                        <BusinessAgeRing
                          businessAge={firm.businessAge}
                          businessAgeYears={firm.businessAgeYears}
                        />
                      </div>
                    </td>
                    <td className={tdBase}>{firm.location}</td>
                    <td className={`${tdBase} font-medium text-[#13203F]`}>
                      {getWebsitePricingForMode(firm, activeFilter, activeSubFilter)}
                    </td>
                    <td className={tdBase}>
                      <SettlementBadge value={firm.settlement} />
                    </td>
                    <td className={`${tdBase} font-medium text-[#13203F]`}>
                      {firm.onboarding}
                    </td>
                    <td className={tdBase}>
                      <SmartTags labels={firm.products} compact />
                    </td>
                    <td className={tdBase}>
                      {firm.platforms?.length ? (
                        <SupportedPlatforms
                          platforms={firm.platforms}
                          extra={firm.platformsExtra}
                        />
                      ) : (
                        <span className="block text-center text-xs text-slate-400">—</span>
                      )}
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
                        onClick={openTalkToExpert}
                        className="whitespace-nowrap cursor-pointer rounded-full border border-[#2D4CC8] px-3 py-1 text-[12px] font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:text-white"
                      >
                        Talk to Expert
                      </button>
                    </td>

                    <td className={tdBase}>
                      <Link
                        href="/login"
                        className="inline-block whitespace-nowrap cursor-pointer rounded-full border border-[#2D4CC8] px-3 py-1 text-[12px] font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:!text-white"
                      >
                        Signup
                      </Link>
                    </td>

                    <td className={tdBase}>
                      <button
                        type="button"
                        className="whitespace-nowrap cursor-pointer rounded-full bg-[#2D4CC8] px-3 py-1 text-[12px] font-semibold text-white shadow-md shadow-[#2D4CC8]/20 transition-colors hover:bg-[#2542b6]"
                        style={{ color: "#fff" }}
                      >
                        Request Quote
                      </button>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ComparePGTable;
