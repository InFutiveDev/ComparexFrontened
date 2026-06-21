    "use client";

    import Image from "next/image";
    import React, { useState } from "react";
    import {
    HiOutlineChevronDown,
    HiOutlineChevronUpDown,
    HiOutlineClipboardDocument,
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
        products: ["UPI", "Cards", "Subscription Billing"],
        platforms: [
        { icon: "/logos/shopy.webp", alt: "Shopify", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Google", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" },
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
        products: ["Payouts", "Smart Routing"],
        platforms: [
        { icon: "/logos/shopy.webp", alt: "Microsoft", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Google", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Filmora", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Swipe", tone: "light" },
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
        bestForTags: ["🇮🇳 UPI Strong", "💸 Fast Checkout", "💸 Enterprise Ready","💸 Low Failure Rate"],
        businessAge: "7 Years",
        location: "Bangalore",
        pricing: "1.8%",
        settlement: "Instant",
        onboarding: "18 Hours",
        products: ["UPI", "QR", "Payment Links"],
        platforms: [
        { icon: "/logos/shopy.webp", alt: "Quick Heal", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" },
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
        products: ["UPI", "QR", "Payment Links"],
        platforms: [
        { icon: "/logos/shopy.webp", alt: "Quick Heal", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" },
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
        products: ["UPI", "QR", "Payment Links"],
        platforms: [
        { icon: "/logos/shopy.webp", alt: "Quick Heal", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" },
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
        products: ["UPI", "QR", "Payment Links"],
        platforms: [
        { icon: "/logos/shopy.webp", alt: "Quick Heal", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Vyapar", tone: "light" },
        { icon: "/logos/shopy.webp", alt: "Keka", tone: "light" },
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
    
    "International",
    ];

    const paymentModeDropdowns = {
    "Credit Card": ["Visa", "Mastercard", "Rupay", "Amex"],
    "Debit Card": ["Visa Debit", "Mastercard Debit", "Rupay Debit"],
    "Net Banking": ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank"],
    };

    const firmModePricing = {
    Razorpay: {
        "UPI Payments": "0%",
        "Credit Card": "1.9%",
        Visa: "1.9%",
        Mastercard: "1.95%",
        Rupay: "1.75%",
        Amex: "2.5%",
        "Debit Card": "1.5%",
        "Visa Debit": "1.5%",
        "Mastercard Debit": "1.52%",
        "Rupay Debit": "1.35%",
        "Net Banking": "1.5%",
        "HDFC Bank": "1.45%",
        "ICICI Bank": "1.48%",
        "SBI": "1.5%",
        "Axis Bank": "1.52%",
        "Kotak Bank": "1.55%",
        "Wallet Payments": "1.8%",
        "QR Payments": "0%",
        International: "3%",
        "Subscription Billing": "2.2%",
    },
    Cashfree: {
        "UPI Payments": "0%",
        "Credit Card": "1.75%",
        Visa: "1.75%",
        Mastercard: "1.78%",
        Rupay: "1.6%",
        Amex: "2.4%",
        "Debit Card": "1.4%",
        "Visa Debit": "1.4%",
        "Mastercard Debit": "1.42%",
        "Rupay Debit": "1.25%",
        "Net Banking": "1.45%",
        "HDFC Bank": "1.4%",
        "ICICI Bank": "1.43%",
        "SBI": "1.45%",
        "Axis Bank": "1.47%",
        "Kotak Bank": "1.5%",
        "Wallet Payments": "1.7%",
        "QR Payments": "0%",
        International: "2.9%",
        "Subscription Billing": "2%",
    },
    "PhonePe PG": {
        "UPI Payments": "0%",
        "Credit Card": "1.8%",
        Visa: "1.8%",
        Mastercard: "1.82%",
        Rupay: "1.65%",
        Amex: "2.45%",
        "Debit Card": "1.45%",
        "Visa Debit": "1.45%",
        "Mastercard Debit": "1.47%",
        "Rupay Debit": "1.3%",
        "Net Banking": "1.5%",
        "HDFC Bank": "1.45%",
        "ICICI Bank": "1.48%",
        "SBI": "1.5%",
        "Axis Bank": "1.52%",
        "Kotak Bank": "1.54%",
        "Wallet Payments": "1.75%",
        "QR Payments": "0%",
        International: "2.95%",
        "Subscription Billing": "2.1%",
    },
    "PayU PG": {
        "UPI Payments": "0%",
        "Credit Card": "1.85%",
        Visa: "1.85%",
        Mastercard: "1.88%",
        Rupay: "1.7%",
        Amex: "2.55%",
        "Debit Card": "1.5%",
        "Visa Debit": "1.5%",
        "Mastercard Debit": "1.52%",
        "Rupay Debit": "1.35%",
        "Net Banking": "1.55%",
        "HDFC Bank": "1.5%",
        "ICICI Bank": "1.53%",
        "SBI": "1.55%",
        "Axis Bank": "1.57%",
        "Kotak Bank": "1.6%",
        "Wallet Payments": "1.8%",
        "QR Payments": "0%",
        International: "3.1%",
        "Subscription Billing": "2.15%",
    },
    "Paytm PG": {
        "UPI Payments": "0%",
        "Credit Card": "1.7%",
        Visa: "1.7%",
        Mastercard: "1.72%",
        Rupay: "1.55%",
        Amex: "2.35%",
        "Debit Card": "1.35%",
        "Visa Debit": "1.35%",
        "Mastercard Debit": "1.37%",
        "Rupay Debit": "1.2%",
        "Net Banking": "1.4%",
        "HDFC Bank": "1.35%",
        "ICICI Bank": "1.38%",
        "SBI": "1.4%",
        "Axis Bank": "1.42%",
        "Kotak Bank": "1.45%",
        "Wallet Payments": "1.65%",
        "QR Payments": "0%",
        International: "2.85%",
        "Subscription Billing": "1.95%",
    },
    "GPay PG": {
        "UPI Payments": "0%",
        "Credit Card": "1.82%",
        Visa: "1.82%",
        Mastercard: "1.84%",
        Rupay: "1.68%",
        Amex: "2.5%",
        "Debit Card": "1.48%",
        "Visa Debit": "1.48%",
        "Mastercard Debit": "1.5%",
        "Rupay Debit": "1.32%",
        "Net Banking": "1.52%",
        "HDFC Bank": "1.48%",
        "ICICI Bank": "1.5%",
        "SBI": "1.52%",
        "Axis Bank": "1.54%",
        "Kotak Bank": "1.56%",
        "Wallet Payments": "1.72%",
        "QR Payments": "0%",
        International: "3%",
        "Subscription Billing": "2.05%",
    },
    };

    function getPricingForMode(firm, modeIndex, subFilter = null) {
    const mode = paymentModes[modeIndex];
    const pricingMap = firmModePricing[firm.name];
    if (!pricingMap) return firm.pricing;

    if (subFilter && pricingMap[subFilter]) {
        return pricingMap[subFilter];
    }

    return pricingMap[mode] ?? firm.pricing;
    }

    const sortOptions = [
    { value: "all", label: "All" },
    { value: "emerging", label: "Emerging PG" },
    { value: "papgApproved", label: "PAPG Approved" },
    { value: "instantSettlement", label: "Instant Settlement" },
    { value: "bestForStartup", label: "Best for Startup" },
    { value: "dedicatedSupport", label: "Dedicated Support" },
    { value: "fastOnboarding", label: "Fast onboarding" },
    ];

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

    function FirmPgName({ name, logo }) {
    return (
        <div className="flex w-[130px] max-w-[130px] items-center gap-1.5 sm:w-[155px] sm:max-w-[155px] sm:gap-2">
        <div className="relative shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#2D4CC8] bg-white/80 text-xs font-bold text-black sm:h-10 sm:w-10 sm:text-sm">
            {logo}
            </div>
        </div>

        <div className="min-w-0">
            <h3 className="truncate text-[12px] font-bold leading-tight text-[#13203F] sm:text-[13px]">{name}</h3>
        </div>
        </div>
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

    function parseBusinessAgeYears(businessAge) {
    return parseHours(businessAge);
    }

    function businessAgeToActiveSegments(businessAge) {
    const years = parseBusinessAgeYears(businessAge);
    return Math.min(AGE_SEGMENT_COUNT, Math.max(1, years));
    }

    function BusinessAgeRing({ businessAge, size = AGE_RING_SIZE }) {
    const years = parseBusinessAgeYears(businessAge);
    const activeSegments = businessAgeToActiveSegments(businessAge);

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
        <div
        className="flex flex-col items-center gap-1.5"
        aria-label={`${rating} out of 5, ${reviewCount} reviews`}
        >
        <button
            type="button"
            className="mt-1 cursor-pointer rounded-full border border-[#2D4CC8] px-3 py-1 text-[12px] font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:text-white"
        >
            Add Review
        </button>
        </div>
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
    const baseButtonClass = `inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-semibold leading-none transition-colors ${
        isActive
        ? "border-[#2D4CC8] bg-[#2D4CC8] text-white shadow-md shadow-[#2D4CC8]/25"
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
        className="relative shrink-0"
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
            className={`size-3.5 transition-transform ${
                isOpen ? "rotate-180" : ""
            } ${isActive ? "text-white/90" : "text-[#2D4CC8]"}`}
            aria-hidden
            />
        </button>

        {isOpen ? (
            <div className="absolute left-0 top-full z-[60] w-max min-w-[180px] pt-1.5">
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
        <FirmPgName name={firm.name} logo={firm.logo} />
        </div>
    );
    }

    function ComparePGTable() { 
    const [activeFilter, setActiveFilter] = useState(0);
    const [activeSubFilter, setActiveSubFilter] = useState(null);
    const [compareModeOpen, setCompareModeOpen] = useState(false);
    const [selectedCompareFirms, setSelectedCompareFirms] = useState([]);
    const [sortBy, setSortBy] = useState("emerging");

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
        

        <div className="flex max-h-none flex-col rounded-2xl border border-slate-200 bg-white shadow-lg shadow-[#13203F]/5 ">
            {/* Filters — fixed */}
            <div className="relative z-30 shrink-0 overflow-visible border-b border-slate-200 bg-[#f8fafc] px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                <div className="min-w-0 flex-1 overflow-visible">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 lg:sr-only">
                    Filter by payment mode
                </p>
                <div className="flex flex-wrap items-center gap-2 overflow-visible">
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
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4">
                <button
                    type="button"
                    onClick={() => setCompareModeOpen((prev) => !prev)}
                    className={`inline-flex h-9 cursor-pointer items-center justify-center rounded-full border px-5 text-sm font-semibold leading-none transition-colors ${
                    compareModeOpen
                        ? "border-[#2D4CC8] bg-[#2D4CC8] text-white shadow-md shadow-[#2D4CC8]/25"
                        : "border-[#2D4CC8] bg-white text-slate-600 hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8]"
                    }`}
                >
                    Compare
                </button>

                <label className="flex h-9 items-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Sort by:</span>
                    <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-9 min-w-[9.5rem] cursor-pointer rounded-full border border-[#2D4CC8] bg-white px-4 text-sm font-semibold leading-none text-slate-600 outline-none transition-colors hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8] focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20"
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
            </div>

            {/* Table — horizontal scroll; mobile shows 4 rows */}
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
                            <BusinessAgeRing businessAge={firm.businessAge} />
                        </div>
                        </td>
                        <td className={tdBase}>{firm.location}</td>
                        <td className={`${tdBase} font-medium text-[#13203F]`}>
                        {getPricingForMode(firm, activeFilter, activeSubFilter)}
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
                            className="whitespace-nowrap cursor-pointer rounded-full border border-[#2D4CC8] px-3 py-1 text-[12px] font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:text-white"
                        >
                            Talk to Expert
                        </button>
                        </td>

                        <td className={tdBase}>
                        <button
                            type="button"
                            className="whitespace-nowrap cursor-pointer rounded-full border border-[#2D4CC8] px-3 py-1 text-[12px] font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:text-white"
                        >
                            Signup
                        </button>
                        </td>

                        <td className={tdBase}>
                        <button
                            type="button"
                            className="whitespace-nowrap cursor-pointer rounded-full bg-[#2D4CC8] px-3 py-1 text-[12px] font-semibold text-white shadow-md shadow-[#2D4CC8]/20 transition-colors hover:bg-[#2542b6]"
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

            {selectedCompareFirms.length > 0 && (
            <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-[#f8fafc] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <h3 className="font-bold text-[#13203F]">Comparing</h3>
                {selectedCompareFirms.map((firmName, index) => {
                    const firm = firms.find((item) => item.name === firmName);
                    if (!firm) return null;

                    return (
                    <button
                        key={firmName}
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2D4CC8] px-4 py-2 font-medium text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6]"
                    >
                        <span className="flex size-7 items-center justify-center rounded-md border border-white/30 bg-white/15 text-xs font-bold">
                        {firm.logo}
                        </span>
                        PG {index + 1}
                    </button>
                    );
                })}
                </div>
                <div className="flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={clearCompareFirms}
                    className="cursor-pointer rounded-xl bg-[#2D4CC8] px-6 py-2 font-medium text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6]"
                >
                    Clear
                </button>
                <button
                    type="button"
                    disabled={selectedCompareFirms.length < 2}
                    className="cursor-pointer rounded-xl bg-[#2D4CC8] px-6 py-2 font-medium text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                    Compare Side by Side
                </button>
                </div>
            </div>
            )}
        </div>
        </section>
    );
    }
    export default ComparePGTable;
