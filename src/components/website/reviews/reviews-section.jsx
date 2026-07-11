"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheck,
  HiOutlineChevronDown,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { IoStar } from "react-icons/io5";
import { FaGoogle, FaLinkedin } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { HiUser } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { submitReview } from "@/lib/review";

const steps = [
  { id: 1, label: "Select Provider" },
  { id: 2, label: "Leave a Review" },
  { id: 3, label: "Consent & Submit" },
  { id: 4, label: "Share on LinkedIn" },
  { id: 5, label: "Thank You" },
];

const categoryPills = [
  { value: "", label: "All" },
  { value: "online-pg", label: "Online PG" },
  { value: "pos-qr", label: "POS & QR" },
  { value: "crossborder", label: "Crossborder Payments" },
  { value: "payouts", label: "Payouts" },
  { value: "subscription", label: "Subscription Billing" },
  { value: "kyc-fraud", label: "KYC & Fraud" },
  { value: "infrastructure", label: "Payment Infrastructure" },
];

const popularProducts = [
  {
    id: "razorpay",
    name: "Razorpay",
    company: "Razorpay Software Pvt. Ltd.",
    logo: "/images/brand-logos/Razorpay_logo.svg",
    category: "online-pg",
  },
  {
    id: "cashfree",
    name: "Cashfree",
    company: "Cashfree Payments",
    logo: "/images/brand-logos/cashfree.png",
    category: "online-pg",
  },
  {
    id: "phonepe",
    name: "PhonePe PG",
    company: "PhonePe Pvt. Ltd.",
    logo: "/images/brand-logos/phonepe.png",
    category: "pos-qr",
  },
  {
    id: "payu",
    name: "PayU",
    company: "PayU Payments Pvt. Ltd.",
    logo: "/images/brand-logos/Payu.png",
    category: "online-pg",
  },
  {
    id: "paytm",
    name: "Paytm PG",
    company: "Paytm Payments Bank",
    logo: "/images/brand-logos/paytm.png",
    category: "pos-qr",
  },
  {
    id: "ccavenue",
    name: "CCAvenue",
    company: "Infibeam Avenues Ltd.",
    logo: "/images/brand-logos/ccavenue.png",
    category: "online-pg",
  },
  {
    id: "easebuzz",
    name: "Easebuzz",
    company: "Easebuzz Pvt. Ltd.",
    logo: "/images/brand-logos/easebuzz.png",
    category: "online-pg",
  },
  {
    id: "stripe",
    name: "Stripe",
    company: "Stripe Inc.",
    logo: "/images/brand-logos/stripe.png",
    category: "crossborder",
  },
  {
    id: "amazon-pay",
    name: "Amazon Pay",
    company: "Amazon Pay India",
    logo: "/images/brand-logos/amazon.jpg",
    category: "pos-qr",
  },
  {
    id: "instamojo",
    name: "Instamojo",
    company: "Instamojo Technologies Pvt. Ltd.",
    initials: "IM",
    category: "online-pg",
  },
  {
    id: "billdesk",
    name: "BillDesk",
    company: "IndiaIdeas.com Ltd.",
    initials: "BD",
    category: "infrastructure",
  },
  {
    id: "comparex",
    name: "CompareX",
    company: "CompareX",
    logo: "/images/logo-icon.svg",
    category: "infrastructure",
  },
  {
    id: "razorpayx",
    name: "RazorpayX",
    company: "Razorpay Software Pvt. Ltd.",
    initials: "RX",
    category: "payouts",
  },
  {
    id: "cashfree-payouts",
    name: "Cashfree Payouts",
    company: "Cashfree Payments",
    initials: "CP",
    category: "payouts",
  },
  {
    id: "chargebee",
    name: "Chargebee",
    company: "Chargebee Inc.",
    initials: "CB",
    category: "subscription",
  },
  {
    id: "zoho-subscriptions",
    name: "Zoho Subscriptions",
    company: "Zoho Corporation",
    initials: "ZS",
    category: "subscription",
  },
  {
    id: "signzy",
    name: "Signzy",
    company: "Signzy Technologies",
    initials: "SZ",
    category: "kyc-fraud",
  },
  {
    id: "hyperverge",
    name: "Hyperverge",
    company: "Hyperverge Technologies",
    initials: "HV",
    category: "kyc-fraud",
  },
];

const jobTitleOptions = [
  "Founder",
  "Co-Founder",
  "Operations",
  "Finance",
  "Product",
  "Developer",
  "Ecommerce Manager",
  "Consultant",
  "Agency",
  "Others",
];

const monthlyVolumeOptions = [
  "Below ₹1L/month",
  "₹1L–₹10L",
  "₹10L–₹50L",
  "₹50L–₹2Cr",
  "₹2Cr+",
];

const usageDurationOptions = [
  "Less than 3 months",
  "3–6 months",
  "6–12 months",
  "1–3 years",
  "3+ years",
];

const stoodOutPills = [
  { value: "fast-activation", label: "🚀 Fast Activation" },
  { value: "support", label: "🤝 Great Support" },
  { value: "pricing", label: "💰 Transparent Pricing" },
  { value: "dashboard", label: "📊 Easy Dashboard" },
  { value: "api", label: "⚙️ Strong API" },
  { value: "settlement", label: "⚡ Fast Settlement" },
];

const idealForOptions = [
  { value: "d2c", label: "🛍️ D2C Friendly" },
  { value: "startup", label: "🚀 Startup Friendly" },
  { value: "enterprise", label: "🏢 Enterprise Ready" },
  { value: "saas", label: "💻 SaaS & Subscriptions" },
  { value: "marketplace", label: "🏬 Marketplace Sellers" },
  { value: "offline", label: "🏪 Offline Retail" },
];

const onboardingPillOptions = [
  { value: "smooth", label: "⚡ Smooth Onboarding" },
  { value: "average", label: "🙂 Average Experience" },
  { value: "slow", label: "🐢 Slow & Complex" },
  { value: "difficult", label: "😓 Difficult Setup" },
];

const businessTypeOptions = [
  "🚀 Startup Friendly",
  "🛍️ D2C & Ecommerce",
  "💻 SaaS & Subscriptions",
  "🏢 Enterprise",
  "🏪 Offline Retail",
  "🌐 Cross-border Sellers",
];

const conditionalRatingFields = {
  "pos-qr": [
    { key: "deviceQuality", label: "Device Quality" },
    { key: "installationExperience", label: "Installation Experience" },
    { key: "soundboxReliability", label: "Soundbox Reliability" },
    { key: "fieldSupport", label: "Field Support Experience" },
  ],
  crossborder: [
    { key: "fxTransparency", label: "FX Transparency" },
    { key: "intlSettlementSpeed", label: "International Settlement Speed" },
    { key: "exportDocSupport", label: "Export Documentation Support" },
  ],
  subscription: [
    { key: "retryLogic", label: "Retry Logic" },
    { key: "subscriptionAnalytics", label: "Subscription Analytics" },
    { key: "dunningExperience", label: "Dunning Experience" },
  ],
  "kyc-fraud": [
    { key: "verificationAccuracy", label: "Verification Accuracy" },
    { key: "fraudDetection", label: "Fraud Detection Quality" },
    { key: "apiResponseTime", label: "API Response Time" },
  ],
};

const coreRatingFields = [
  { key: "onboardingRating", label: "Onboarding Experience" },
  { key: "supportRating", label: "Customer Support" },
  { key: "pricingRating", label: "Pricing Transparency" },
  { key: "dashboardRating", label: "Dashboard Experience" },
  { key: "apiRating", label: "API / Technical Experience" },
  { key: "reliabilityRating", label: "Reliability / Stability" },
  { key: "refundRating", label: "Refund / Dispute Experience" },
  { key: "settlementRating", label: "Settlement Experience" },
];

const products = popularProducts;

function normalizeSearchQuery(searchQuery = "") {
  return searchQuery.trim().toLowerCase();
}

function matchesSearchQuery(item, searchQuery = "") {
  const normalized = normalizeSearchQuery(searchQuery);
  if (!normalized) return true;

  const compact = normalized.replace(/\s+/g, "");
  const name = item.name.toLowerCase();
  const company = item.company.toLowerCase();
  const id = item.id.toLowerCase();

  return (
    name.includes(normalized) ||
    company.includes(normalized) ||
    id.includes(normalized) ||
    name.replace(/\s+/g, "").includes(compact) ||
    company.replace(/\s+/g, "").includes(compact)
  );
}

function filterProducts(items, categoryFilter, searchQuery = "") {
  let filtered = items;

  if (categoryFilter) {
    filtered = filtered.filter((item) => item.category === categoryFilter);
  }

  if (normalizeSearchQuery(searchQuery)) {
    filtered = filtered.filter((item) => matchesSearchQuery(item, searchQuery));
  }

  return filtered;
}

const initialForm = {
  productId: "",
  identityMethod: "",
  identityConnected: false,
  name: "",
  businessName: "",
  email: "",
  emailVerified: false,
  jobTitle: "",
  jobTitleOther: "",
  monthlyVolume: "",
  website: "",
  usageDuration: "",
  rating: 0,
  recommendNps: null,
  onboardingRating: 0,
  supportRating: 0,
  pricingRating: 0,
  dashboardRating: 0,
  apiRating: 0,
  reliabilityRating: 0,
  refundRating: 0,
  settlementRating: 0,
  internationalRating: 0,
  deviceQuality: 0,
  installationExperience: 0,
  soundboxReliability: 0,
  fieldSupport: 0,
  fxTransparency: 0,
  intlSettlementSpeed: 0,
  exportDocSupport: 0,
  retryLogic: 0,
  subscriptionAnalytics: 0,
  dunningExperience: 0,
  verificationAccuracy: 0,
  fraudDetection: 0,
  apiResponseTime: 0,
  title: "",
  reviewText: "",
  stoodOut: [],
  idealFor: [],
  onboardingExperience: "",
  businessTypesBenefit: "",
  businessTypesOther: "",
  doesWell: "",
  consentGenuine: false,
  consentGuidelines: false,
  consentModeration: false,
  shareOnLinkedIn: false,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-slate-600";

const sectionClass =
  "overflow-visible rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";

function StepHeader({ title, subtitle, children }) {
  return (
    <div className="space-y-2 text-left">
      <h2 className="text-lg font-bold text-[#13203F] sm:text-xl lg:text-[22px]">{title}</h2>
      {subtitle ? <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{subtitle}</p> : null}
      {children}
    </div>
  );
}

function SectionBlock({ title, subtitle, children }) {
  return (
    <section className={sectionClass}>
      <div className="mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-[#13203F] sm:text-lg">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FormSelect({ id, value, onChange, options, placeholder = "Select an option" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option
      ),
    [options]
  );

  const selectedLabel =
    normalizedOptions.find((option) => option.value === value)?.label ?? "";

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(optionValue) {
    onChange(optionValue);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[#2D4CC8]/25 ${
          open
            ? "border-[#2D4CC8] ring-2 ring-[#2D4CC8]/15"
            : value
              ? "border-slate-200 text-[#13203F] hover:border-[#2D4CC8]/30"
              : "border-slate-200 text-slate-400 hover:border-[#2D4CC8]/30"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${value ? "font-medium" : ""}`}>
          {selectedLabel || placeholder}
        </span>
        <HiOutlineChevronDown
          className={`size-4 shrink-0 text-[#2D4CC8] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-900/10"
        >
          {normalizedOptions.map((option) => {
            const isSelected = value === option.value;

            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "bg-[#EEF2FC] font-semibold text-[#2D4CC8]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#2D4CC8]"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <HiCheck className="size-4 shrink-0 text-[#2D4CC8]" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ProductLogo({ product, size = "md" }) {
  const boxClass = size === "md" ? "size-15" : "size-8";
  const imageSize = size === "md" ? 60 : 36;

  if (product.logo) {
    return (
      <div
        className={`${boxClass} pointer-events-none flex shrink-0 items-center justify-center`}
      >
        <Image
          src={product.logo}
          alt=""
          width={imageSize}
          height={imageSize}
          draggable={false}
          className="pointer-events-none max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${boxClass} pointer-events-none flex shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-bold text-[#2D4CC8]`}
      aria-hidden
    >
      {product.initials ?? product.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function ProductSelectCard({ product, selected, onSelect }) {
  function handleSelect() {
    if (typeof onSelect === "function") {
      onSelect(product.id);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      }}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 text-left shadow-[0_1px_4px_rgba(15,23,42,0.08)] transition hover:shadow-[0_4px_12px_rgba(15,23,42,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4CC8]/30 ${
        selected
          ? "border-[#2D4CC8] bg-[#EEF2FC] ring-2 ring-[#2D4CC8]/20"
          : "border-slate-200 hover:border-slate-300"
      }`}
      aria-pressed={selected}
    >
      <ProductLogo product={product} />
      <div className="pointer-events-none min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#13203F]">{product.name}</p>
        <p className="truncate text-xs text-slate-500">by {product.company}</p>
      </div>
    </div>
  );
}

function ProductGrid({ items, selectedId, onSelect, emptyMessage }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
        <p className="text-sm text-slate-500">{emptyMessage}</p>
        <p className="mt-3 text-sm text-slate-600">
          Can&apos;t find your provider?{" "}
          <Link
            href="/website/contact"
            className="font-semibold text-[#2D4CC8] hover:underline"
          >
            Suggest a New Provider
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((product) => (
        <ProductSelectCard
          key={product.id}
          product={product}
          selected={selectedId === product.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function CategoryPillFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {categoryPills.map((pill) => {
        const active = value === pill.value;
        return (
          <button
            key={pill.value || "all"}
            type="button"
            onClick={() => onChange(pill.value)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
              active
                ? "border-[#2D4CC8] bg-[#2D4CC8] text-white shadow-sm shadow-[#2D4CC8]/20"
                : "border-[#2D4CC8] bg-white text-slate-600 hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8]"
            }`}
            aria-pressed={active}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}

function ProviderSmartSearch({
  products: productList,
  categoryFilter,
  selectedId,
  query,
  onQueryChange,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const dropdownProducts = useMemo(() => {
    const matches = filterProducts(productList, categoryFilter, query);
    return query.trim() ? matches : matches.slice(0, 8);
  }, [productList, categoryFilter, query]);

  function handleSelect(product) {
    onSelect(product.id);
    onQueryChange("");
    setOpen(false);
  }

  const showDropdown = open && Boolean(query.trim());

  return (
    <div ref={containerRef} className="relative z-0">
      <label htmlFor="provider-search" className="sr-only">
        Search providers
      </label>
      <div className="relative">
        <HiOutlineMagnifyingGlass
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#2D4CC8]"
          aria-hidden
        />
        <input
          id="provider-search"
          type="text"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          placeholder="Search providers, platforms, or services..."
          className="w-full rounded-full border border-[#2D4CC8] bg-white py-3 pl-10 pr-4 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="provider-search-listbox"
          aria-autocomplete="list"
        />
      </div>

      {showDropdown && dropdownProducts.length > 0 ? (
        <ul
          id="provider-search-listbox"
          role="listbox"
          className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10"
        >
          {dropdownProducts.map((product) => (
            <li key={product.id} role="option" aria-selected={selectedId === product.id}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(product)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#EEF2FC]"
              >
                <ProductLogo product={product} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#13203F]">{product.name}</p>
                  <p className="truncate text-xs text-slate-500">by {product.company}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {showDropdown && query.trim() && dropdownProducts.length === 0 ? (
        <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg">
          No provider found. Try another name or suggest a new provider below.
        </div>
      ) : null}
    </div>
  );
}

function Step1SelectProvider({
  selectedId,
  onSelect,
  onContinue,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  filteredProducts,
}) {
  function handleProviderSelect(productId) {
    onSearchChange("");
    onSelect(productId);
  }

  return (
    <div className="relative space-y-6 overflow-visible">
      <StepHeader
        title="Help Businesses Make Smarter Platform Decisions"
        subtitle="Share your genuine experience with the provider and help other businesses make informed decisions."
      />

      <ProviderSmartSearch
        products={popularProducts}
        categoryFilter={categoryFilter}
        selectedId={selectedId}
        query={searchQuery}
        onQueryChange={onSearchChange}
        onSelect={handleProviderSelect}
      />

      <div className="relative z-20 space-y-6">
        <div>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-600">Filter by category</p>
            <p className="text-xs text-slate-500 sm:text-sm">
              Showing {filteredProducts.length} provider{filteredProducts.length === 1 ? "" : "s"}
            </p>
          </div>
          <CategoryPillFilter value={categoryFilter} onChange={onCategoryChange} />
        </div>

        <div>
        <p className="mb-3 text-sm font-medium text-slate-600">
          Here are some popular platforms businesses are reviewing right now.
        </p>
        {selectedId ? (
          <div className="mb-3 flex flex-col gap-3 rounded-xl border border-[#25a36f]/30 bg-[#25a36f]/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-[#25a36f]">Selected — </span>
              {popularProducts.find((item) => item.id === selectedId)?.name ?? "Provider"}
            </p>
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full bg-[#2D4CC8] px-4 py-2 text-xs font-semibold text-white sm:text-sm"
              style={{ color: "#fff" }}
            >
              Continue
              <HiArrowRight className="size-3.5" aria-hidden />
            </button>
          </div>
        ) : null}
        <ProductGrid
          items={filteredProducts}
          selectedId={selectedId}
          onSelect={handleProviderSelect}
          emptyMessage="No providers match your search or category."
        />
        </div>
      </div>

      <p className="border-t border-slate-200 pt-4 text-center text-sm text-slate-600">
        Can&apos;t find your provider?{" "}
        <Link
          href="/website/contact"
          className="inline-flex items-center gap-1 font-semibold text-[#2D4CC8] transition hover:text-[#2542b6] hover:underline"
        >
          Suggest a New Provider
          <HiArrowRight className="size-3.5" aria-hidden />
        </Link>
      </p>
    </div>
  );
}

function StarRating({ value, onChange, size = "md" }) {
  const starSize = size === "sm" ? "size-6" : "size-8";
  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Rating">
      {Array.from({ length: 5 }).map((_, index) => {
        const star = index + 1;
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded-md p-0.5 transition hover:scale-110"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={filled}
          >
            <IoStar
              className={`${starSize} ${filled ? "text-[#25a36f]" : "text-slate-200"}`}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

function StarRow({ count }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <IoStar
          key={i}
          className={`size-4 ${i < count ? "text-[#25a36f]" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function NpsScale({ value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Recommendation score">
        {Array.from({ length: 11 }).map((_, score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`flex size-9 items-center justify-center rounded-lg border text-xs font-bold transition sm:size-10 sm:text-sm ${
              value === score
                ? "border-[#2D4CC8] bg-[#2D4CC8] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/40"
            }`}
            aria-pressed={value === score}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>Not likely</span>
        <span>Very likely</span>
      </div>
    </div>
  );
}

function PillToggle({ options, value, onChange, max = null }) {
  function toggle(optionValue) {
    if (Array.isArray(value)) {
      if (value.includes(optionValue)) {
        onChange(value.filter((item) => item !== optionValue));
        return;
      }
      if (max && value.length >= max) return;
      onChange([...value, optionValue]);
      return;
    }
    onChange(value === optionValue ? "" : optionValue);
  }

  const selected = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
              active
                ? "border-[#2D4CC8] bg-[#2D4CC8] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/40"
            }`}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function IdentityButton({ icon: Icon, label, active, onClick, connected = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-[#2D4CC8] bg-[#EEF2FC] text-[#2D4CC8]"
          : "border-slate-200 bg-white text-slate-700 hover:border-[#2D4CC8]/30"
      }`}
      aria-pressed={active}
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      {label}
      {connected ? (
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#25a36f] text-white">
          <HiCheck className="size-3" aria-hidden />
        </span>
      ) : null}
    </button>
  );
}

function IdentityConnectedBanner({ method, email, onDisconnect }) {
  const labels = {
    google: "Google account connected",
    linkedin: "LinkedIn account connected",
    email: "Email sign-in selected",
    manual: "Manual entry selected",
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#25a36f]/25 bg-[#25a36f]/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#25a36f] text-white">
          <HiCheck className="size-5" aria-hidden />
        </span>
        <div className="text-left">
          <p className="text-sm font-semibold text-[#13203F]">{labels[method] ?? "Identity verified"}</p>
          {email ? <p className="text-xs text-slate-500">{email}</p> : null}
          <p className="text-[11px] text-slate-400">Demo mode — backend connection coming soon</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDisconnect}
        className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-[#2D4CC8] hover:underline"
      >
        Change method
      </button>
    </div>
  );
}

function EmailOtpVerification({ email, onEmailChange, verified, onVerifiedChange, showError }) {
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  function handleSendOtp() {
    if (!email.trim() || !email.includes("@")) {
      setOtpError("Enter a valid business email to receive OTP.");
      return;
    }
    setOtpError("");
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setOtpSent(true);
    }, 600);
  }

  function handleVerifyOtp() {
    if (otpCode.trim().length !== 6) {
      setOtpError("Enter the 6-digit OTP.");
      return;
    }
    setOtpError("");
    setVerifying(true);
    window.setTimeout(() => {
      setVerifying(false);
      onVerifiedChange(true);
    }, 500);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="reviewer-email"
          type="email"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            onVerifiedChange(false);
            setOtpSent(false);
            setOtpCode("");
          }}
          placeholder="you@business.com"
          className={`${inputClass} flex-1`}
          required
          disabled={verified}
        />
        {!verified ? (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sending || !email.trim()}
            className="shrink-0 rounded-xl border border-[#2D4CC8] bg-white px-4 py-3 text-sm font-semibold text-[#2D4CC8] transition hover:bg-[#EEF2FC] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Sending…" : otpSent ? "Resend OTP" : "Send OTP"}
          </button>
        ) : null}
      </div>

      {otpSent && !verified ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit OTP"
            className={`${inputClass} max-w-xs tracking-[0.3em]`}
          />
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={verifying || otpCode.length !== 6}
            className="rounded-xl bg-[#2D4CC8] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {verifying ? "Verifying…" : "Verify OTP"}
          </button>
          <p className="text-xs text-slate-400">Demo: any 6 digits work</p>
        </div>
      ) : null}

      {verified ? (
        <p className="flex items-center gap-2 text-sm font-medium text-[#25a36f]">
          <HiCheck className="size-4" aria-hidden />
          Business email verified
        </p>
      ) : null}

      {otpError || showError ? (
        <p className="text-xs text-red-500">{otpError || showError}</p>
      ) : null}
    </div>
  );
}

function FormValidationHint({ items }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
      <p className="text-sm font-semibold text-amber-900">Please complete the following to continue:</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ReviewSummaryCard({ form, selectedProduct }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="mb-3 text-base font-bold text-[#13203F]">Review summary</h3>
      <div className="space-y-3 text-sm">
        {selectedProduct ? (
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <ProductLogo product={selectedProduct} size="sm" />
            <div>
              <p className="font-semibold text-[#13203F]">{selectedProduct.name}</p>
              <p className="text-xs text-slate-500">{form.businessName || "Business name pending"}</p>
            </div>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-2 text-slate-600">
          <span>Overall rating</span>
          <span className="text-right font-medium text-[#13203F]">{form.rating}/5</span>
          <span>Recommend (NPS)</span>
          <span className="text-right font-medium text-[#13203F]">
            {form.recommendNps !== null ? `${form.recommendNps}/10` : "—"}
          </span>
          <span>Reviewer</span>
          <span className="text-right font-medium text-[#13203F]">{form.name || "—"}</span>
        </div>
        {form.title ? (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
            <span className="font-semibold text-[#13203F]">Title: </span>
            {form.title}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function RatingRow({ label, value, onChange, optional = false }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {optional ? <span className="ml-1 text-slate-400">(Optional)</span> : null}
      </span>
      <StarRating value={value} onChange={onChange} size="sm" />
    </div>
  );
}

function Step2LeaveReview({
  form,
  selectedProduct,
  updateField,
  onIdentitySelect,
  onIdentityDisconnect,
  showValidation,
}) {
  const conditionalFields = selectedProduct
    ? conditionalRatingFields[selectedProduct.category] ?? []
    : [];

  const missingItems = showValidation ? getStep2MissingItems(form, conditionalFields) : [];

  return (
    <div className="space-y-6">
      <StepHeader
        title={`Write a Review for ${selectedProduct?.name ?? "Your Provider"}`}
        subtitle="Your experience can genuinely help businesses choose the right platform faster."
      >
        <div className="space-y-2 pt-1 text-sm leading-relaxed text-slate-600">
          <p>
            It takes &lt;90 seconds to share insights around onboarding, support, pricing,
            reliability, and overall experience.
          </p>
          <p>Your feedback contributes to a more transparent and trusted ecosystem.</p>
          <p>
            <Link href="/website/terms-and-conditions" className="font-semibold text-[#2D4CC8] hover:underline">
              Review Guidelines
            </Link>
            {" | "}
            <Link href="/website/privacy-policy" className="font-semibold text-[#2D4CC8] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </StepHeader>

      {selectedProduct ? (
        <div className="flex items-center gap-3 rounded-xl border border-[#2D4CC8]/15 bg-white px-4 py-3">
          <ProductLogo product={selectedProduct} size="sm" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Reviewing</p>
            <p className="text-sm font-bold text-[#13203F]">{selectedProduct.name}</p>
            <p className="text-xs text-slate-500">by {selectedProduct.company}</p>
          </div>
        </div>
      ) : null}

      <SectionBlock title="Verify Your Identity">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <IdentityButton
            icon={FaGoogle}
            label="Continue with Google"
            active={form.identityMethod === "google"}
            connected={form.identityMethod === "google" && form.identityConnected}
            onClick={() => onIdentitySelect("google")}
          />
          <IdentityButton
            icon={FaLinkedin}
            label="Continue with LinkedIn"
            active={form.identityMethod === "linkedin"}
            connected={form.identityMethod === "linkedin" && form.identityConnected}
            onClick={() => onIdentitySelect("linkedin")}
          />
          <IdentityButton
            icon={MdEmail}
            label="Continue with Email"
            active={form.identityMethod === "email"}
            connected={form.identityMethod === "email" && form.identityConnected}
            onClick={() => onIdentitySelect("email")}
          />
          {/* <IdentityButton
            icon={HiUser}
            label="Enter Details Manually"
            active={form.identityMethod === "manual"}
            connected={form.identityMethod === "manual" && form.identityConnected}
            onClick={() => onIdentitySelect("manual")}
          /> */}
        </div>

        {form.identityMethod && form.identityConnected ? (
          <IdentityConnectedBanner
            method={form.identityMethod}
            email={
              form.identityMethod === "google"
                ? "demo.merchant@gmail.com"
                : form.identityMethod === "linkedin"
                  ? "demo.merchant@linkedin.com"
                  : form.email
            }
            onDisconnect={onIdentityDisconnect}
          />
        ) : null}
      </SectionBlock>

      {form.identityMethod ? (
        <SectionBlock title="Tell us about your business">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="reviewer-name" className={labelClass}>
                Full Name *
              </label>
              <input
                id="reviewer-name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="business-name" className={labelClass}>
                Business Name *
              </label>
              <input
                id="business-name"
                value={form.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="reviewer-email" className={labelClass}>
                Business Email * <span className="text-xs text-slate-400">(OTP verification)</span>
              </label>
              <EmailOtpVerification
                email={form.email}
                onEmailChange={(value) => updateField("email", value)}
                verified={form.emailVerified}
                onVerifiedChange={(value) => updateField("emailVerified", value)}
                showError={
                  showValidation && form.email.trim() && !form.emailVerified
                    ? "Verify your business email with OTP to continue."
                    : ""
                }
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="job-title" className={labelClass}>
                Job Title *
              </label>
              <FormSelect
                id="job-title"
                value={form.jobTitle}
                onChange={(value) => updateField("jobTitle", value)}
                placeholder="Select job title"
                options={jobTitleOptions}
              />
            </div>
            {form.jobTitle === "Others" ? (
              <div className="sm:col-span-1">
                <label htmlFor="job-title-other" className={labelClass}>
                  Specify job title *
                </label>
                <input
                  id="job-title-other"
                  value={form.jobTitleOther}
                  onChange={(e) => updateField("jobTitleOther", e.target.value)}
                  className={inputClass}
                  placeholder="Your role"
                  required
                />
              </div>
            ) : (
              <div className="hidden sm:block" aria-hidden />
            )}
            <div className="sm:col-span-1">
              <label htmlFor="monthly-volume" className={labelClass}>
                Monthly Business Volume *
              </label>
              <FormSelect
                id="monthly-volume"
                value={form.monthlyVolume}
                onChange={(value) => updateField("monthlyVolume", value)}
                placeholder="Select volume range"
                options={monthlyVolumeOptions}
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="business-website" className={labelClass}>
                Business Website
              </label>
              <input
                id="business-website"
                type="url"
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="usage-duration" className={labelClass}>
                How long have you used this provider? *
              </label>
              <FormSelect
                id="usage-duration"
                value={form.usageDuration}
                onChange={(value) => updateField("usageDuration", value)}
                placeholder="Select duration"
                options={usageDurationOptions}
              />
            </div>
          </div>
        </SectionBlock>
      ) : null}

      {form.identityMethod ? (
        <SectionBlock
          title="Tell us about your experience"
          subtitle="Your feedback helps businesses compare platforms beyond marketing claims."
        >
          <div>
            <label className={labelClass}>Overall Rating *</label>
            <StarRating value={form.rating} onChange={(value) => updateField("rating", value)} />
          </div>

          <div>
            <label className={labelClass}>Would you recommend this provider? *</label>
            <NpsScale
              value={form.recommendNps}
              onChange={(value) => updateField("recommendNps", value)}
            />
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            {coreRatingFields.map((field) => (
              <RatingRow
                key={field.key}
                label={field.label}
                value={form[field.key]}
                onChange={(value) => updateField(field.key, value)}
              />
            ))}
            <RatingRow
              label="International Payments Experience"
              value={form.internationalRating}
              onChange={(value) => updateField("internationalRating", value)}
              optional
            />
          </div>

          {conditionalFields.length > 0 ? (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-[#13203F]">Category-specific experience</p>
              {conditionalFields.map((field) => (
                <RatingRow
                  key={field.key}
                  label={field.label}
                  value={form[field.key]}
                  onChange={(value) => updateField(field.key, value)}
                />
              ))}
            </div>
          ) : null}
        </SectionBlock>
      ) : null}

      {form.identityMethod ? (
        <SectionBlock
          title="Help businesses understand your experience better"
          subtitle="Share specifics that go beyond a star rating."
        >
          <div>
            <label htmlFor="review-title" className={labelClass}>
              Review Title *
            </label>
            <input
              id="review-title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Smooth onboarding experience for startups"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="review-text" className={labelClass}>
              Your Review *
            </label>
            <textarea
              id="review-text"
              value={form.reviewText}
              onChange={(e) => updateField("reviewText", e.target.value)}
              rows={5}
              placeholder="Share your merchant experience in detail..."
              className={`${inputClass} min-h-[120px] resize-y`}
              required
            />
          </div>

          <div>
            <label className={labelClass}>What stood out the most? (Select up to 2)</label>
            <PillToggle
              options={stoodOutPills}
              value={form.stoodOut}
              onChange={(value) => updateField("stoodOut", value)}
              max={2}
            />
          </div>

          <div>
            <label className={labelClass}>Who is this provider ideal for?</label>
            <PillToggle
              options={idealForOptions}
              value={form.idealFor}
              onChange={(value) => updateField("idealFor", value)}
            />
          </div>

          <div>
            <label className={labelClass}>How was the onboarding experience?</label>
            <PillToggle
              options={onboardingPillOptions}
              value={form.onboardingExperience}
              onChange={(value) => updateField("onboardingExperience", value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="business-types" className={labelClass}>
                Which business types benefit most?
              </label>
              <FormSelect
                id="business-types"
                value={form.businessTypesBenefit}
                onChange={(value) => updateField("businessTypesBenefit", value)}
                placeholder="Select business type"
                options={businessTypeOptions}
              />
            </div>
            <div>
              <label htmlFor="business-types-other" className={labelClass}>
                Additional context (optional)
              </label>
              <input
                id="business-types-other"
                value={form.businessTypesOther}
                onChange={(e) => updateField("businessTypesOther", e.target.value)}
                placeholder="e.g. high-volume marketplaces"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="does-well" className={labelClass}>
              What does this provider genuinely do well?
            </label>
            <input
              id="does-well"
              value={form.doesWell}
              onChange={(e) => updateField("doesWell", e.target.value)}
              placeholder="e.g. fast settlements and responsive support"
              className={inputClass}
            />
          </div>
        </SectionBlock>
      ) : null}

      <FormValidationHint items={missingItems} />
    </div>
  );
}

function Step3Consent({ form, selectedProduct, updateField, showValidation }) {
  const consentItems = [
    {
      key: "consentGenuine",
      label: "I confirm this review is based on my genuine business experience",
    },
    {
      key: "consentGuidelines",
      label: "I agree to CompareX review guidelines",
    },
    {
      key: "consentModeration",
      label: "I understand CompareX may moderate reviews for authenticity",
    },
  ];

  return (
    <div className="space-y-6">
      <StepHeader
        title="Consent & Submit"
        subtitle="Please confirm the following before submitting your review."
      />

      <ReviewSummaryCard form={form} selectedProduct={selectedProduct} />

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        {consentItems.map((item) => (
          <label
            key={item.key}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-[#2D4CC8]/20"
          >
            <input
              type="checkbox"
              checked={form[item.key]}
              onChange={(e) => updateField(item.key, e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-[#2D4CC8] focus:ring-[#2D4CC8]/30"
            />
            <span className="text-sm leading-relaxed text-slate-700">{item.label}</span>
          </label>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500">
        By submitting, you agree to our{" "}
        <Link href="/website/terms-and-conditions" className="text-[#2D4CC8] hover:underline">
          Review Guidelines
        </Link>{" "}
        and{" "}
        <Link href="/website/privacy-policy" className="text-[#2D4CC8] hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      {showValidation && !(form.consentGenuine && form.consentGuidelines && form.consentModeration) ? (
        <FormValidationHint items={["Accept all consent checkboxes to submit your review"]} />
      ) : null}
    </div>
  );
}

function Step4ShareLinkedIn({ form, selectedProduct, onShare, onSkip }) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Help More Businesses Discover Better Solutions"
        subtitle="Share your review and contribute to a more transparent business ecosystem."
      />

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#13203F] via-[#2D4CC8] to-[#40C3CF] px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">{form.name}</p>
              <p className="text-xs text-white/75">
                {[form.jobTitle, form.businessName].filter(Boolean).join(" · ") || "CompareX reviewer"}
              </p>
            </div>
            <StarRow count={form.rating} />
          </div>
        </div>
        <div className="space-y-3 px-5 py-4">
          {selectedProduct ? (
            <div className="flex items-center gap-2">
              <ProductLogo product={selectedProduct} size="sm" />
              <div>
                <span className="text-sm font-semibold text-[#13203F]">{selectedProduct.name}</span>
                <p className="text-xs text-slate-500">by {selectedProduct.company}</p>
              </div>
            </div>
          ) : null}
          <h3 className="text-base font-bold text-[#13203F]">{form.title}</h3>
          <p className="text-sm leading-relaxed text-slate-600">{form.reviewText}</p>
        </div>
      </article>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onShare}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0A66C2]/25 transition hover:brightness-110"
          style={{ color: "#fff" }}
        >
          <FaLinkedin className="size-5" aria-hidden />
          Share on LinkedIn
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#2D4CC8]/40 hover:text-[#13203F]"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}

function Step5ThankYou({ selectedProduct, form, onReset }) {
  const nextActions = [
    { label: "Compare Providers", href: "/website/compare-pg" },
    { label: "Talk to an Expert", href: "/website/contact" },
    { label: "Explore Merchant Resources", href: "/website/resources" },
    { label: "Discover Best-Fit Solutions", href: "/website/get-started" },
  ];

  return (
    <div className="py-4 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#25a36f] text-white shadow-lg shadow-[#25a36f]/30">
        <HiCheck className="size-8" aria-hidden />
      </div>
      <h3 className="mt-6 text-2xl font-bold text-[#13203F]">Thank You for Your Review 🎉</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
        Your review is now under verification and will help businesses make smarter decisions
        {selectedProduct ? ` about ${selectedProduct.name}` : ""}.
      </p>
      {form.shareOnLinkedIn ? (
        <p className="mt-2 text-sm text-[#25a36f]">Thanks for sharing on LinkedIn!</p>
      ) : null}

      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {nextActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-[#13203F] shadow-sm transition hover:border-[#2D4CC8]/30 hover:shadow-md"
          >
            {action.label}
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#2D4CC8]/40 hover:text-[#13203F]"
      >
        Write Another Review
      </button>
    </div>
  );
}

function StepIndicator({ currentStep }) {
  return (
    <ol className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
      {steps.map((item) => {
        const done = currentStep > item.id;
        const active = currentStep === item.id;
        return (
          <li
            key={item.id}
            className={`flex items-center gap-2 rounded-xl border px-2 py-2 text-left transition sm:px-3 sm:py-2.5 ${
              active
                ? "border-[#2D4CC8]/30 bg-white shadow-sm"
                : done
                  ? "border-[#25a36f]/25 bg-[#25a36f]/5"
                  : "border-slate-200/80 bg-white/60"
            }`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold sm:size-7 sm:text-xs ${
                active
                  ? "bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-white"
                  : done
                    ? "bg-[#25a36f] text-white"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {done ? <HiCheck className="size-3.5 sm:size-4" aria-hidden /> : item.id}
            </span>
            <span
              className={`text-[10px] font-semibold leading-tight sm:text-[11px] ${
                active ? "text-[#13203F]" : done ? "text-[#25a36f]" : "text-slate-500"
              }`}
            >
              {item.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function getLinkedInShareUrl(form, productName) {
  const url = typeof window !== "undefined" ? window.location.href : "https://comparex.in/reviews";
  const title = `My review of ${productName} on CompareX`;
  const summary = `${form.title}\n\n${form.reviewText}\n\n— ${form.name}${form.businessName ? `, ${form.businessName}` : ""}`;
  const params = new URLSearchParams({
    mini: "true",
    url,
    title,
    summary,
  });
  return `https://www.linkedin.com/shareArticle?${params.toString()}`;
}

function hasRequiredRatings(form, conditionalFields) {
  if (form.rating < 1 || form.recommendNps === null) return false;

  for (const field of coreRatingFields) {
    if (form[field.key] < 1) return false;
  }

  for (const field of conditionalFields) {
    if (form[field.key] < 1) return false;
  }

  return true;
}

function getStep2MissingItems(form, conditionalFields) {
  const items = [];

  if (!form.identityMethod) items.push("Select a login or identity method");
  if (!form.name.trim()) items.push("Enter your full name");
  if (!form.businessName.trim()) items.push("Enter your business name");
  if (!form.email.trim()) items.push("Enter your business email");
  if (form.email.trim() && !form.emailVerified) items.push("Verify your business email with OTP");
  if (!form.jobTitle) items.push("Select your job title");
  if (form.jobTitle === "Others" && !form.jobTitleOther.trim()) items.push("Specify your job title");
  if (!form.monthlyVolume) items.push("Select monthly business volume");
  if (!form.usageDuration) items.push("Select how long you've used this provider");
  if (form.rating < 1) items.push("Add an overall rating");
  if (form.recommendNps === null) items.push("Rate how likely you are to recommend this provider");
  if (!hasRequiredRatings(form, conditionalFields)) {
    items.push("Complete all required experience ratings");
  }
  if (!form.title.trim()) items.push("Add a review title");
  if (!form.reviewText.trim()) items.push("Write your review");

  return items;
}

export default function ReviewsSection() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formCardRef = useRef(null);

  const selectedProduct = products.find((item) => item.id === form.productId);

  const filteredStep1Products = useMemo(
    () => filterProducts(popularProducts, categoryFilter, searchQuery),
    [categoryFilter, searchQuery]
  );

  const conditionalFields = selectedProduct
    ? conditionalRatingFields[selectedProduct.category] ?? []
    : [];

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleProductSelect(productId) {
    if (!productId) return;

    setForm((prev) => ({ ...prev, productId }));
    setShowValidation(false);
  }

  function handleContinueToReview() {
    if (!form.productId) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    setStep(2);
  }

  function handleCategoryChange(nextCategory) {
    setCategoryFilter(nextCategory);

    if (!form.productId) return;

    const visibleProducts = filterProducts(popularProducts, nextCategory, searchQuery);
    if (!visibleProducts.some((item) => item.id === form.productId)) {
      updateField("productId", "");
    }
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  function updateFields(patch) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function handleIdentitySelect(method) {
    const socialDemo = {
      google: { name: "Demo Merchant", email: "demo.merchant@gmail.com" },
      linkedin: { name: "Demo Merchant", email: "demo.merchant@linkedin.com" },
    };

    if (method === "google" || method === "linkedin") {
      const demo = socialDemo[method];
      updateFields({
        identityMethod: method,
        identityConnected: true,
        name: demo.name,
        email: demo.email,
        emailVerified: false,
      });
      return;
    }

    updateFields({
      identityMethod: method,
      identityConnected: true,
      emailVerified: false,
    });
  }

  function handleIdentityDisconnect() {
    updateFields({
      identityMethod: "",
      identityConnected: false,
      emailVerified: false,
    });
  }

  useEffect(() => {
    setShowValidation(false);
  }, [step]);

  function canGoNext() {
    if (step === 1) return Boolean(form.productId);

    if (step === 2) {
      const jobTitleValid =
        form.jobTitle && (form.jobTitle !== "Others" || form.jobTitleOther.trim());

      return Boolean(
        form.identityMethod &&
          form.identityConnected &&
          form.name.trim() &&
          form.businessName.trim() &&
          form.email.trim() &&
          form.emailVerified &&
          jobTitleValid &&
          form.monthlyVolume &&
          form.usageDuration &&
          hasRequiredRatings(form, conditionalFields) &&
          form.title.trim() &&
          form.reviewText.trim()
      );
    }

    if (step === 3) {
      return form.consentGenuine && form.consentGuidelines && form.consentModeration;
    }

    return false;
  }

  async function submitReviewToApi() {
    if (!selectedProduct) {
      setSubmitError("Please select a provider");
      return false;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitReview({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productCompany: selectedProduct.company,
        productCategory: selectedProduct.category,
        identityMethod: form.identityMethod,
        name: form.name.trim(),
        businessName: form.businessName.trim(),
        email: form.email.trim(),
        jobTitle: form.jobTitle,
        jobTitleOther: form.jobTitleOther.trim(),
        monthlyVolume: form.monthlyVolume,
        website: form.website.trim(),
        usageDuration: form.usageDuration,
        rating: form.rating,
        recommendNps: form.recommendNps,
        onboardingRating: form.onboardingRating,
        supportRating: form.supportRating,
        pricingRating: form.pricingRating,
        dashboardRating: form.dashboardRating,
        apiRating: form.apiRating,
        reliabilityRating: form.reliabilityRating,
        refundRating: form.refundRating,
        settlementRating: form.settlementRating,
        internationalRating: form.internationalRating,
        deviceQuality: form.deviceQuality,
        installationExperience: form.installationExperience,
        soundboxReliability: form.soundboxReliability,
        fieldSupport: form.fieldSupport,
        fxTransparency: form.fxTransparency,
        intlSettlementSpeed: form.intlSettlementSpeed,
        exportDocSupport: form.exportDocSupport,
        retryLogic: form.retryLogic,
        subscriptionAnalytics: form.subscriptionAnalytics,
        dunningExperience: form.dunningExperience,
        verificationAccuracy: form.verificationAccuracy,
        fraudDetection: form.fraudDetection,
        apiResponseTime: form.apiResponseTime,
        title: form.title.trim(),
        reviewText: form.reviewText.trim(),
        stoodOut: form.stoodOut,
        idealFor: form.idealFor,
        onboardingExperience: form.onboardingExperience,
        businessTypesBenefit: form.businessTypesBenefit,
        businessTypesOther: form.businessTypesOther.trim(),
        doesWell: form.doesWell.trim(),
        consentGenuine: form.consentGenuine,
        consentGuidelines: form.consentGuidelines,
        consentModeration: form.consentModeration,
        shareOnLinkedIn: form.shareOnLinkedIn,
      });
      return true;
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to submit review");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleNext() {
    if (step === 1 && form.productId) {
      handleContinueToReview();
      return;
    }

    if (!canGoNext()) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);

    if (step === 3) {
      const saved = await submitReviewToApi();
      if (!saved) return;
      setStep(4);
      return;
    }

    setStep((s) => Math.min(s + 1, 5));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleShareLinkedIn() {
    if (!selectedProduct) return;
    updateField("shareOnLinkedIn", true);
    window.open(getLinkedInShareUrl(form, selectedProduct.name), "_blank", "noopener,noreferrer");
    setStep(5);
  }

  function handleSkipShare() {
    setStep(5);
  }

  function handleReset() {
    setForm(initialForm);
    setCategoryFilter("");
    setSearchQuery("");
    setShowValidation(false);
    setSubmitError("");
    setIsSubmitting(false);
    setStep(1);
  }

  const activeStep = steps.find((item) => item.id === step) ?? steps[0];
  const progressWidth = `${(step / steps.length) * 100}%`;

  return (
    <section className="bg-[#f2f6fb] py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#13203F] sm:text-3xl">Write a Review</h2>
          <p className="mt-2 text-slate-600">
            Share your genuine experience and help businesses choose the right platform.
          </p>
        </div>

        <div
          ref={formCardRef}
          className={`relative scroll-mt-28 overflow-visible rounded-[28px] border border-slate-200 p-4 shadow-2xl shadow-[#13203F]/10 sm:p-6 ${
            step === 1 ? "bg-white" : "bg-[#eef2fa]"
          }`}
        >
          {step < 5 ? (
            <>
              <StepIndicator currentStep={step} />

              <div className="mb-4 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                <span>
                  Step {step} of {steps.length}
                </span>
                <span className="text-[#13203F]">{activeStep.label}</span>
              </div>
              <div className="mb-5 h-1 overflow-hidden rounded-full bg-[#2D4CC8]/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] transition-all duration-300"
                  style={{ width: progressWidth }}
                />
              </div>
            </>
          ) : null}

          <div className="space-y-4">
            {step === 1 && (
              <>
                <Step1SelectProvider
                  selectedId={form.productId}
                  onSelect={handleProductSelect}
                  onContinue={handleContinueToReview}
                  categoryFilter={categoryFilter}
                  onCategoryChange={handleCategoryChange}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filteredProducts={filteredStep1Products}
                />
                {!form.productId && showValidation ? (
                  <FormValidationHint items={["Select a provider to review"]} />
                ) : null}
              </>
            )}

            {step === 2 && (
              <Step2LeaveReview
                form={form}
                selectedProduct={selectedProduct}
                updateField={updateField}
                onIdentitySelect={handleIdentitySelect}
                onIdentityDisconnect={handleIdentityDisconnect}
                showValidation={showValidation}
              />
            )}

            {step === 3 && (
              <Step3Consent
                form={form}
                selectedProduct={selectedProduct}
                updateField={updateField}
                showValidation={showValidation}
              />
            )}

            {step === 4 && (
              <Step4ShareLinkedIn
                form={form}
                selectedProduct={selectedProduct}
                onShare={handleShareLinkedIn}
                onSkip={handleSkipShare}
              />
            )}

            {step === 5 && (
              <Step5ThankYou
                selectedProduct={selectedProduct}
                form={form}
                onReset={handleReset}
              />
            )}
          </div>

          {step > 0 && step < 4 ? (
            <div className="mt-6 space-y-3 border-t border-slate-200/70 pt-5">
              {submitError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              ) : null}
              <div className="flex items-center justify-end gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#2D4CC8]/40 hover:text-[#13203F] disabled:opacity-50"
                >
                  <HiArrowLeft className="size-4" aria-hidden />
                  Back
                </button>
              ) : (
                <div className="h-fit w-fit" />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext() || isSubmitting}
                className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ color: "#fff" }}
              >
                {step === 3
                  ? isSubmitting
                    ? "Submitting..."
                    : "Submit Review"
                  : "Next"}
                <HiArrowRight className="size-4" aria-hidden />
              </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
