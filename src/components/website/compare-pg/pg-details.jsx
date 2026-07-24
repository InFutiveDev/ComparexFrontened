"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiCheck,
  HiChevronDown,
  HiHeart,
  HiOutlineClipboardDocument,
  HiOutlineCurrencyRupee,
  HiOutlineHeart,
  HiOutlineTag,
  HiStar,
} from "react-icons/hi2";
import { useTalkToExpert } from "@/components/website/talk-to-expert/talk-to-expert-provider";
import {
  firmModePricing,
  getPgBySlug,
  paymentModes,
  pgFirms,
} from "@/lib/pg-catalog";
import {
  buildWebsitePricingMap,
  mapPgToWebsiteCompareRow,
} from "@/lib/pg-website-compare";
import { ApiError } from "@/lib/api";
import { extractFormRecordId } from "@/lib/form-record-id";
import { submitMerchantLead, updateMerchantLead } from "@/lib/merchant";
import { fetchPgComparison } from "@/lib/pg-compare";
import { pgNameToSlug } from "@/lib/pg-slug";
import { sanitizePhoneInput, validateContactFields } from "@/lib/validation";

const pgFaqs = [
  {
    question: "How long does onboarding usually take?",
    answer:
      "Onboarding timelines vary by business category and documentation readiness. CompareX can help you coordinate activation with the provider team.",
  },
  {
    question: "Are the MDR rates shown final?",
    answer:
      "Displayed rates are indicative starting MDRs. Final pricing depends on your business model, monthly volume, risk profile, and payment mix.",
  },
  {
    question: "Can I switch from my current PG?",
    answer:
      "Yes. Many merchants evaluate alternatives for better settlement cycles, success rates, or support. CompareX helps you compare options before switching.",
  },
  {
    question: "Does CompareX charge merchants for recommendations?",
    answer:
      "No. Exploring providers, comparing features, and talking to experts through CompareX is free for merchants.",
  },
];

function maskCouponCode(code) {
  return `${code.charAt(0)}${"*".repeat(6)}`;
}

function parseYears(businessAge) {
  return Number.parseInt(businessAge, 10) || 0;
}

function getFoundedYear(businessAge) {
  const years = parseYears(businessAge);
  return years > 0 ? new Date().getFullYear() - years : "—";
}

function getRatingDistribution(reviewCount, rating) {
  const ratingValue = Number(rating);
  const bias = Math.min(0.15, Math.max(-0.1, (ratingValue - 4.5) * 0.2));
  const weights = [
    0.58 + bias,
    0.24,
    0.09 - bias * 0.3,
    0.05,
    0.04 - bias * 0.2,
  ].map((weight) => Math.max(0.02, weight));

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  return [5, 4, 3, 2, 1].map((stars, index) => {
    const ratio = weights[index] / totalWeight;
    return {
      stars,
      count: Math.round(reviewCount * ratio),
      percent: ratio * 100,
    };
  });
}

function StarRating({ rating, size = "sm" }) {
  const value = Number(rating);
  const starClass = size === "lg" ? "size-5" : "size-4";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = value >= index + 1;
        const half = !filled && value > index && value < index + 1;

        return (
          <HiStar
            key={index}
            className={`${starClass} ${
              filled || half ? "text-amber-400" : "text-slate-200"
            }`}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

function MetaItem({ label, children }) {
  return (
    <div className="min-w-[9.5rem] shrink-0 px-5 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className="mt-1 flex h-6 leading-relaxed items-center text-sm font-semibold text-[#13203F] sm:text-base">
        {children}
      </div>
    </div>
  );
}

function PgDetailsHero({ firm, openTalkToExpert }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [pgMenuOpen, setPgMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const ratingDistribution = getRatingDistribution(firm.reviewCount, firm.review);
  const years = parseYears(firm.businessAge);
  const foundedYear = getFoundedYear(firm.businessAge);

  async function copyOfferCode() {
    try {
      await navigator.clipboard.writeText(firm.offer.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200/80">
      <div className="absolute inset-0 bg-gradient-to-br from-[#eff4ff] via-[#eef2fc] to-[#ecfdf5]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.06) 26px, rgba(45,76,200,0.06) 27px)",
        }}
      />

      <div className="relative mx-auto max-w-8xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Top nav */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/compare-pg"
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-[#13203F] shadow-sm transition-colors hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8]"
              aria-label="Back to Compare PG"
            >
              <HiArrowLeft className="size-5" aria-hidden />
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setPgMenuOpen(true)}
              onMouseLeave={() => setPgMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setPgMenuOpen((prev) => !prev)}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-[#13203F] shadow-sm transition-colors hover:border-[#2D4CC8]/40 sm:px-4"
                aria-haspopup="listbox"
                aria-expanded={pgMenuOpen}
              >
                <span className="flex size-7 items-center justify-center rounded-lg border-2 border-[#2D4CC8] bg-white text-[10px] font-bold text-[#13203F]">
                  {firm.logo}
                </span>
                <span className="max-w-[120px] truncate sm:max-w-none">{firm.name}</span>
                <HiChevronDown
                  className={`size-4 shrink-0 text-[#2D4CC8] transition-transform ${
                    pgMenuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>

              {pgMenuOpen ? (
                <div className="absolute left-0 top-full z-20 w-56 pt-2">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10">
                    {pgFirms.map((item) => (
                      <Link
                        key={item.name}
                        href={`/compare-pg/${pgNameToSlug(item.name)}`}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-[#EEF2FC] ${
                          item.name === firm.name
                            ? "bg-[#EEF2FC] font-semibold text-[#2D4CC8]"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="flex size-7 items-center justify-center rounded-md border border-[#2D4CC8]/30 bg-white text-[10px] font-bold text-[#13203F]">
                          {item.logo}
                        </span>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setIsFavorite((prev) => !prev)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8]"
              aria-pressed={isFavorite}
            >
              {isFavorite ? (
                <HiHeart className="size-4 text-[#2D4CC8]" aria-hidden />
              ) : (
                <HiOutlineHeart className="size-4" aria-hidden />
              )}
              Set as Favorite
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/reviews"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#2D4CC8] bg-white px-4 text-sm font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8]/5 sm:px-5"
            >
              Leave a Review
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-5 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition-opacity hover:opacity-90"
              style={{ color: "#fff" }}
            >
              Signup
            </Link>
          </div>
        </div>

        {/* Main hero */}
        <div className="mt-8 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-4 sm:gap-5">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-2 border-[#2D4CC8] bg-white text-2xl font-bold text-[#13203F] shadow-md shadow-[#2D4CC8]/10 sm:size-24 sm:text-3xl">
                {firm.logo}
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight text-[#13203F] sm:text-4xl lg:text-5xl">
                  {firm.name}
                </h1>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-600">
                  <HiHeart className="size-4 text-[#2D4CC8]" aria-hidden />
                  <span className="font-semibold text-[#13203F]">
                    {firm.reviewCount.toLocaleString()}
                  </span>
                  <span>merchant reviews</span>
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {firm.bestForTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full border border-[#2D4CC8]/30 bg-white/80 px-3 py-1 text-xs font-semibold text-[#13203F]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 overflow-hidden">
              <div className="flex flex-nowrap divide-x divide-[#2D4CC8]/30 overflow-x-auto">
                <MetaItem label="Location">
                  {/* <HiOutlineMapPin
                    className="mr-1 size-[18px] shrink-0 text-[#2D4CC8]"
                    aria-hidden
                  /> */}
                  <span className="truncate">{firm.location}</span>
                </MetaItem>
                <MetaItem label="Country">
                  <span className="truncate">India</span>
                </MetaItem>
                <MetaItem label="Trust Score">
                  <span className="rounded bg-[#25a36f]/10 px-1.5 py-0.5 text-xs font-bold leading-none text-[#25a36f]">
                    {firm.trust}
                  </span>
                  <span className="ml-1.5">/ 10</span>
                </MetaItem>
                <MetaItem label="Founded">
                  <span>{foundedYear}</span>
                </MetaItem>
                <MetaItem label="Years in Operation">
                  <span>{years || "—"}</span>
                </MetaItem>
              </div>
            </div>

            

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {firm.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openTalkToExpert}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-[#2D4CC8] bg-white px-5 text-sm font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8]/5"
              >
                Talk to Expert
              </button>
              <button
                type="button"
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#2D4CC8] px-5 text-sm font-semibold text-white shadow-md shadow-[#2D4CC8]/25 transition-colors hover:bg-[#2542b6]"
                style={{ color: "#fff" }}
              >
                Request Quote
              </button>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-[#13203F]/5 sm:p-6 xl:max-w-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-5xl font-bold leading-none text-[#13203F]">{firm.review}</p>
                <StarRating rating={firm.review} size="lg" />
                <p className="mt-2 text-sm font-medium text-[#2D4CC8]">
                  {firm.reviewCount.toLocaleString()} total reviews
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              {ratingDistribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <div className="flex w-8 items-center gap-1 text-xs font-semibold text-slate-600">
                    <HiStar className="size-3.5 text-amber-400" aria-hidden />
                    {row.stars}
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF]"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs font-medium text-slate-500">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo banner */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#2D4CC8]/30 bg-white p-4 shadow-md shadow-[#2D4CC8]/10 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl border border-[#2D4CC8]/25 bg-[#EEF2FC]">
              <span className="text-lg leading-none" aria-hidden>
                🔥
              </span>
              <span className="mt-1 text-center text-xs font-bold uppercase leading-tight text-[#2D4CC8]">
                {firm.offer.headline}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg border-2 border-[#2D4CC8] bg-white text-[10px] font-bold text-[#13203F]">
                  {firm.logo}
                </span>
                <span className="font-bold text-[#13203F]">{firm.name}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-[#f8fafc] px-2 py-0.5 text-xs text-slate-600">
                  {firm.review}
                  <HiStar className="size-3 text-amber-400" aria-hidden />
                  {firm.reviewCount.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {firm.offer.headline} — activate through CompareX
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyOfferCode}
            className="inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-full border border-dashed border-[#2D4CC8]/50 bg-[#f8fafc] px-4 py-2.5 text-sm transition-colors hover:border-[#2D4CC8] hover:bg-[#EEF2FC] sm:w-auto sm:min-w-[200px]"
          >
            <span className="text-slate-500">Code</span>
            <span className="font-bold tracking-wide text-[#13203F]">
              {copied ? "Copied!" : maskCouponCode(firm.offer.code)}
            </span>
            <HiOutlineClipboardDocument className="size-4 shrink-0 text-[#2D4CC8]" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

const PG_TABS = [
  { id: "product-information", label: "PG Information" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "user-reviews", label: "User Reviews" },
  { id: "offers", label: "Offers" },
];

const businessTypeOptions = [
  { value: "ecommerce-d2c", label: "Ecommerce / D2C" },
  { value: "saas-subscription-platforms", label: "SaaS / Subscription" },
  { value: "b2b-manufacturing", label: "Enterprise / B2B" },
  { value: "other-businesses", label: "Retail / Marketplace / Other" },
];

function buildKeyFeatures(firm) {
  const tagFeatures = firm.bestForTags.map((tag) =>
    tag.replace(/[^\p{L}\p{N}\s]/gu, "").trim()
  );

  return [
    ...firm.products.map((product) => `${product} Support`),
    `${firm.settlement} Settlement Cycle`,
    `${firm.onboarding} Onboarding TAT`,
    "Multi-platform Checkout Integration",
    "Real-time Transaction Dashboard",
    "Refund & Dispute Management",
    "Dedicated Merchant Support",
    ...tagFeatures,
    ...firm.platforms.map((platform) => `${platform.alt} Integration`),
  ].filter(Boolean);
}

function getPgOffers(firm) {
  return [
    {
      id: "primary",
      title: firm.offer.headline,
      code: firm.offer.code,
      description: `Activate ${firm.name} through CompareX and apply this exclusive partner offer at onboarding.`,
      featured: true,
    },
    {
      id: "mdr",
      title: "Introductory MDR Pricing",
      description: `New merchants may qualify for reduced MDR on ${firm.name} for the first billing cycle based on business category.`,
      badge: "New Merchant",
    },
    {
      id: "setup",
      title: "Partner Onboarding Support",
      description:
        "Get guided KYC, integration, and go-live support from CompareX when you activate through our platform.",
      badge: "CompareX Exclusive",
    },
    {
      id: "settlement",
      title: `${firm.settlement} Settlement Advantage`,
      description: `Evaluate how ${firm.name}'s ${firm.settlement.toLowerCase()} settlement cycle fits your cash-flow needs before you switch.`,
      badge: "Cash Flow",
    },
  ];
}

function OfferCard({ offer }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (!offer.code) return;
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        offer.featured
          ? "border-[#2D4CC8]/30 bg-gradient-to-br from-[#EEF2FC] via-white to-[#ecfdf5]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
              offer.featured ? "bg-[#2D4CC8] text-white" : "bg-[#EEF2FC] text-[#2D4CC8]"
            }`}
          >
            <HiOutlineTag className="size-5" aria-hidden />
          </span>
          <div>
            {offer.badge ? (
              <span className="inline-flex rounded-full bg-[#25a36f]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#25a36f]">
                {offer.badge}
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-[#2D4CC8]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#2D4CC8]">
                Featured Offer
              </span>
            )}
            <h3 className="mt-2 text-lg font-bold text-[#13203F]">{offer.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{offer.description}</p>
          </div>
        </div>
      </div>

      {offer.code ? (
        <button
          type="button"
          onClick={copyCode}
          className="mt-4 inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-[#2D4CC8]/40 bg-white px-4 py-3 text-sm transition-colors hover:border-[#2D4CC8] hover:bg-[#f8fafc] sm:w-auto sm:min-w-[220px]"
        >
          <span className="text-slate-500">Code</span>
          <span className="font-bold tracking-wide text-[#13203F]">
            {copied ? "Copied!" : maskCouponCode(offer.code)}
          </span>
          <HiOutlineClipboardDocument className="size-4 shrink-0 text-[#2D4CC8]" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

function PgTabNav({ activeTab, onChange }) {
  return (
    <div className="sticky top-20 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-8xl flex-wrap gap-x-6 gap-y-1 px-4 sm:px-6 lg:px-8">
        {PG_TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`shrink-0 cursor-pointer border-b-2 py-4 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-[#2D4CC8] text-[#2D4CC8]"
                  : "border-transparent text-slate-500 hover:text-[#13203F]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PgQuoteSidebar({ firm }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: businessTypeOptions[0].value,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const contactError = validateContactFields({
      email: form.email,
      phone: form.phone,
    });

    if (contactError) {
      setSubmitError(contactError);
      setIsSubmitting(false);
      return;
    }

    if (!form.name.trim()) {
      setSubmitError("Name is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await submitMerchantLead({
        businessName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        pgId: firm.id || undefined,
      });
      const leadId = extractFormRecordId(data);

      if (!leadId) {
        throw new ApiError("Failed to save your request. Please try again.");
      }

      await updateMerchantLead(leadId, {
        step: 2,
        industry: form.businessType,
        pgId: firm.id || undefined,
      });

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Failed to submit callback request",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/15";

  return (
    <aside className="lg:sticky lg:top-32 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-[#13203F]/8">
        <div className="bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-5 py-5 text-white">
          <h3 className="text-lg font-bold leading-snug">Get Best Quote for {firm.name}</h3>
          <p className="mt-1 text-sm text-white/85">
            Get a free consultation from our payment experts.
          </p>
        </div>

        {submitted ? (
          <div className="px-5 py-8 text-center">
            <p className="text-base font-semibold text-[#13203F]">Request received!</p>
            <p className="mt-2 text-sm text-slate-600">
              Our team will connect with you shortly to discuss {firm.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            {submitError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </div>
            ) : null}
            <div>
              <label htmlFor="quote-name" className="mb-1.5 block text-sm font-medium text-slate-600">
                Name
              </label>
              <input
                id="quote-name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="quote-email" className="mb-1.5 block text-sm font-medium text-slate-600">
                Business Email
              </label>
              <input
                id="quote-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass}
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label htmlFor="quote-phone" className="mb-1.5 block text-sm font-medium text-slate-600">
                Phone Number
              </label>
              <input
                id="quote-phone"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={form.phone}
                onChange={(e) => handleChange("phone", sanitizePhoneInput(e.target.value))}
                className={inputClass}
                placeholder="10–11 digits (WhatsApp preferred)"
                required
              />
            </div>
            <div>
              <label htmlFor="quote-business" className="mb-1.5 block text-sm font-medium text-slate-600">
                Business Type
              </label>
              <select
                id="quote-business"
                value={form.businessType}
                onChange={(e) => handleChange("businessType", e.target.value)}
                className={inputClass}
              >
                {businessTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-sm font-bold text-white shadow-md shadow-[#2D4CC8]/25 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ color: "#fff" }}
            >
              {isSubmitting ? "Submitting…" : "Request A Call Back"}
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}

function PgDetailsMainContent({
  firm,
  activeTab,
  pricingMap,
  openFaq,
  onToggleFaq,
  onPricingTab,
}) {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const keyFeatures = buildKeyFeatures(firm);
  const visibleFeatures = showAllFeatures ? keyFeatures : keyFeatures.slice(0, 8);

  if (activeTab === "product-information") {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-[#13203F] sm:text-3xl">What is {firm.name}?</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">{firm.overview}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#25a36f]/20 bg-gradient-to-br from-[#ecfdf5] via-white to-[#eef2fc] p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#25a36f]/15 text-[#25a36f]">
                <HiOutlineCurrencyRupee className="size-7" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-600">Starting MDR</p>
                <p className="mt-1 text-3xl font-bold text-[#13203F]">{firm.pricing}</p>
                <button
                  type="button"
                  onClick={onPricingTab}
                  className="mt-3 cursor-pointer text-sm font-semibold text-[#2D4CC8] hover:underline"
                >
                  View Detailed Pricing
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#EEF2FC] text-2xl">
                🏆
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#13203F]">
                  {firm.featured ? "Featured on CompareX" : "Trusted by merchants on CompareX"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Trust score {firm.trust}/10 with {firm.reviewCount.toLocaleString()} merchant
                  reviews and {firm.settlement} settlement support.
                </p>
                <Link
                  href="/reviews"
                  className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#2D4CC8] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2542b6]"
                  style={{ color: "#fff" }}
                >
                  View Reviews
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#13203F] sm:text-2xl">
            Key Features of {firm.name}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Explore the core capabilities merchants evaluate before choosing this payment gateway.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {visibleFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                <HiCheck className="mt-0.5 size-4 shrink-0 text-[#25a36f]" aria-hidden />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          {keyFeatures.length > 8 ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllFeatures((prev) => !prev)}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2542b6]"
                style={{ color: "#fff" }}
              >
                {showAllFeatures ? "Show Less" : "Show More"}
                <HiChevronDown
                  className={`size-4 transition-transform ${showAllFeatures ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (activeTab === "features") {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-[#13203F]">Products & Capabilities</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {firm.products.map((product) => (
              <span
                key={product}
                className="inline-flex rounded-full border border-[#2D4CC8]/25 bg-white px-4 py-2 text-sm font-semibold text-[#13203F] shadow-sm"
              >
                {product}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#13203F]">Supported Platforms</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {firm.platforms.map((platform, index) => (
              <div
                key={`${platform.alt}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-[#f8fafc]">
                  <Image
                    src={platform.icon}
                    alt={platform.alt}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </span>
                <span className="text-sm font-semibold text-[#13203F]">{platform.alt}</span>
              </div>
            ))}
            {firm.platformsExtra > 0 ? (
              <span className="inline-flex size-12 items-center justify-center rounded-full border border-[#2D4CC8]/30 bg-[#EEF2FC] text-sm font-bold text-[#2D4CC8]">
                +{firm.platformsExtra}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Settlement
            </p>
            <p className="mt-1 text-lg font-bold text-[#13203F]">{firm.settlement}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Onboarding TAT
            </p>
            <p className="mt-1 text-lg font-bold text-[#13203F]">{firm.onboarding}</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "pricing") {
    return (
      <div>
        <h2 className="text-2xl font-bold text-[#13203F]">Payment Mode Pricing (MDR)</h2>
        <p className="mt-2 text-sm text-slate-600">
          Indicative transaction rates for {firm.name} across popular payment methods.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#f4f6fc]">
              <tr>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#13203F]/70">
                  Payment Mode
                </th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#13203F]/70">
                  MDR
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentModes.map((mode) => (
                <tr key={mode} className="border-t border-slate-100">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">{mode}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#13203F]">
                    {pricingMap[mode] ?? firm.pricing}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-[#2D4CC8]/25 bg-[#EEF2FC] p-5">
          <p className="text-sm font-semibold text-[#13203F]">Exclusive Offer: {firm.offer.headline}</p>
          <p className="mt-1 text-sm text-slate-600">
            Use code <span className="font-bold text-[#2D4CC8]">{firm.offer.code}</span> when you
            activate through CompareX.
          </p>
        </div>
      </div>
    );
  }

  if (activeTab === "offers") {
    const offers = getPgOffers(firm);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#13203F]">Exclusive Offers for {firm.name}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Partner-led promotions and onboarding benefits available through CompareX.
          </p>
        </div>

        <div className="space-y-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>

        <div className="rounded-2xl border border-[#2D4CC8]/20 bg-[#EEF2FC] p-5">
          <p className="text-sm font-semibold text-[#13203F]">How to redeem offers</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Share your business details using the quote form on the right. Our team will help you
            validate eligibility and apply the best available offer for {firm.name}.
          </p>
        </div>
      </div>
    );
  }

  if (activeTab === "user-reviews") {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <span className="text-5xl font-bold text-[#13203F]">{firm.review}</span>
            <div>
              <StarRating rating={firm.review} size="lg" />
              <p className="mt-1 text-sm text-slate-600">
                Based on {firm.reviewCount.toLocaleString()} reviews
              </p>
            </div>
          </div>
          <Link
            href="/reviews"
            className="mt-6 inline-flex rounded-full border border-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-[#2D4CC8] transition-colors hover:bg-[#2D4CC8] hover:text-white"
          >
            Read & Add Reviews
          </Link>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#13203F]">Common Questions</h3>
          <div className="mt-4 space-y-3">
            {pgFaqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => onToggleFaq(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 text-center text-sm text-slate-500">Select a tab to view details.</div>
  );
}

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-[#13203F]">{question}</span>
        <HiChevronDown
          className={`size-5 shrink-0 text-[#2D4CC8] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>
      {isOpen ? (
        <div className="border-t border-slate-100 px-5 pb-4 pt-1">
          <p className="text-sm leading-relaxed text-slate-600">{answer}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function PgDetails({ slug }) {
  const { openTalkToExpert } = useTalkToExpert();
  const catalogFirm = getPgBySlug(slug);
  const [apiFirm, setApiFirm] = useState(null);
  const [isLoadingApi, setIsLoadingApi] = useState(!catalogFirm);
  const [activeTab, setActiveTab] = useState("product-information");
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (catalogFirm) return undefined;

    let cancelled = false;
    setIsLoadingApi(true);

    fetchPgComparison()
      .then((data) => {
        if (cancelled) return;
        const match = (data.paymentGateways || []).find((pg) => pg.slug === slug);
        if (!match) {
          setApiFirm(null);
          return;
        }

        const mapped = mapPgToWebsiteCompareRow(match);
        setApiFirm({
          ...mapped,
          overview:
            mapped._raw?.companyName || mapped.name
              ? `${mapped.name} is an active payment gateway on CompareX. Compare MDR, settlement, onboarding timelines, and merchant ratings before you sign up.`
              : "Payment gateway profile on CompareX.",
        });
      })
      .catch(() => {
        if (!cancelled) setApiFirm(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingApi(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, catalogFirm]);

  const firm = catalogFirm || apiFirm;
  const firmId = firm?.id ?? apiFirm?.id ?? null;
  const firmSlug = firm?.slug ?? slug ?? (firm ? pgNameToSlug(firm.name) : null);
  const resolvedFirm = firm
    ? {
        ...firm,
        id: firmId,
        slug: firmSlug,
      }
    : null;

  if (isLoadingApi) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-[#f8fafc] px-4 text-sm text-slate-500">
        Loading payment gateway details…
      </div>
    );
  }

  if (!resolvedFirm) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 bg-[#f8fafc] px-4 text-center">
        <p className="text-lg font-semibold text-[#13203F]">Payment gateway not found</p>
        <p className="max-w-md text-sm text-slate-600">
          This provider is not available on CompareX yet, or the link may be outdated.
        </p>
        <Link
          href="/compare-pg"
          className="rounded-full bg-[#2D4CC8] px-5 py-2 text-sm font-semibold text-white"
        >
          Back to Compare PG
        </Link>
      </div>
    );
  }

  const pricingMap =
    firmModePricing[resolvedFirm.name] ?? buildWebsitePricingMap(resolvedFirm);

  return (
    <div className="bg-[#f8fafc]">
      <PgDetailsHero firm={resolvedFirm} openTalkToExpert={openTalkToExpert} />

      <PgTabNav activeTab={activeTab} onChange={setActiveTab} />

      <section className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <PgDetailsMainContent
              firm={resolvedFirm}
              activeTab={activeTab}
              pricingMap={pricingMap}
              openFaq={openFaq}
              onToggleFaq={(index) => setOpenFaq((prev) => (prev === index ? -1 : index))}
              onPricingTab={() => setActiveTab("pricing")}
            />
          </div>

          <PgQuoteSidebar firm={resolvedFirm} />
        </div>
      </section>
    </div>
  );
}
