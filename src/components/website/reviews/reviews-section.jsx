"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import { IoStar } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa6";

const steps = [
  { id: 1, label: "Select Product" },
  { id: 2, label: "Leave a Review" },
  { id: 3, label: "Share on LinkedIn" },
  { id: 4, label: "Finished!" },
];

const categories = [
  { value: "", label: "Select Category" },
  { value: "payment-gateway", label: "Payment Gateway" },
  { value: "upi", label: "UPI Solutions" },
  { value: "international", label: "International Payments" },
  { value: "payouts", label: "Payouts & Banking" },
  { value: "platform", label: "Platforms & Tools" },
];

const popularProducts = [
  {
    id: "razorpay",
    name: "Razorpay",
    company: "Razorpay Software Pvt. Ltd.",
    logo: "/images/brand-logos/Razorpay_logo.svg",
    category: "payment-gateway",
  },
  {
    id: "cashfree",
    name: "Cashfree",
    company: "Cashfree Payments",
    logo: "/images/brand-logos/cashfree.png",
    category: "payment-gateway",
  },
  {
    id: "phonepe",
    name: "PhonePe PG",
    company: "PhonePe Pvt. Ltd.",
    logo: "/images/brand-logos/phonepe.png",
    category: "upi",
  },
  {
    id: "payu",
    name: "PayU",
    company: "PayU Payments Pvt. Ltd.",
    logo: "/images/brand-logos/Payu.png",
    category: "payment-gateway",
  },
  {
    id: "paytm",
    name: "Paytm PG",
    company: "Paytm Payments Bank",
    logo: "/images/brand-logos/paytm.png",
    category: "upi",
  },
  {
    id: "ccavenue",
    name: "CCAvenue",
    company: "Infibeam Avenues Ltd.",
    logo: "/images/brand-logos/ccavenue.png",
    category: "payment-gateway",
  },
  {
    id: "easebuzz",
    name: "Easebuzz",
    company: "Easebuzz Pvt. Ltd.",
    logo: "/images/brand-logos/easebuzz.png",
    category: "payment-gateway",
  },
  {
    id: "stripe",
    name: "Stripe",
    company: "Stripe Inc.",
    logo: "/images/brand-logos/stripe.png",
    category: "international",
  },
  {
    id: "amazon-pay",
    name: "Amazon Pay",
    company: "Amazon Pay India",
    logo: "/images/brand-logos/amazon.jpg",
    category: "upi",
  },
  {
    id: "instamojo",
    name: "Instamojo",
    company: "Instamojo Technologies Pvt. Ltd.",
    initials: "IM",
    category: "payment-gateway",
  },
  {
    id: "billdesk",
    name: "BillDesk",
    company: "IndiaIdeas.com Ltd.",
    initials: "BD",
    category: "payment-gateway",
  },
  {
    id: "comparex",
    name: "CompareX",
    company: "CompareX",
    logo: "/images/logo-icon.svg",
    category: "platform",
  },
];

const products = popularProducts;

const initialForm = {
  productId: "",
  name: "",
  company: "",
  role: "",
  email: "",
  rating: 0,
  title: "",
  reviewText: "",
  shareOnLinkedIn: false,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-slate-600";

function StepHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="mb-1 text-left text-lg font-bold text-[#13203F] sm:text-xl lg:text-[22px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-left text-base font-normal text-slate-600">{subtitle}</p>
      ) : null}
    </>
  );
}

function ProductLogo({ product, size = "md" }) {
  const boxClass = size === "md" ? "size-15" : "size-8";
  const imageSize = size === "md" ? 60 : 36;

  if (product.logo) {
    return (
      <div className={`${boxClass} flex shrink-0 items-center justify-center`}>
        <Image
          src={product.logo}
          alt=""
          width={imageSize}
          height={imageSize}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${boxClass} flex shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-bold text-[#2D4CC8]`}
      aria-hidden
    >
      {product.initials ?? product.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function ProductSelectCard({ product, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product.id)}
      className={`flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left shadow-[0_1px_4px_rgba(15,23,42,0.08)] transition hover:shadow-[0_4px_12px_rgba(15,23,42,0.1)] ${
        selected
          ? "border-[#2D4CC8] ring-2 ring-[#2D4CC8]/15"
          : "border-slate-200 hover:border-slate-300"
      }`}
      aria-pressed={selected}
    >
      <ProductLogo product={product} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#13203F]">{product.name}</p>
        <p className="truncate text-xs text-slate-500">by {product.company}</p>
      </div>
    </button>
  );
}

function ProductGrid({ items, selectedId, onSelect, emptyMessage }) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

function Step1SelectProduct({ selectedId, onSelect, categoryFilter, onCategoryChange }) {
  const filteredPopular = useMemo(() => {
    if (!categoryFilter) return popularProducts;
    return popularProducts.filter((item) => item.category === categoryFilter);
  }, [categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-left text-xl font-bold text-[#13203F] sm:text-2xl">
          Here are some popular products to review
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <label htmlFor="review-category-filter" className="whitespace-nowrap text-sm text-slate-600">
            Filter by category:
          </label>
          <select
            id="review-category-filter"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="min-w-[160px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-[#13203F] outline-none focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/15"
          >
            {categories.map((category) => (
              <option key={category.value || "all"} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ProductGrid
        items={filteredPopular}
        selectedId={selectedId}
        onSelect={onSelect}
        emptyMessage="No products match this category."
      />
    </div>
  );
}

function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rating">
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
              className={`size-8 ${filled ? "text-[#25a36f]" : "text-slate-200"}`}
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

function StepIndicator({ currentStep }) {
  return (
    <ol className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
      {steps.map((item) => {
        const done = currentStep > item.id;
        const active = currentStep === item.id;
        return (
          <li
            key={item.id}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition ${
              active
                ? "border-[#2D4CC8]/30 bg-white shadow-sm"
                : done
                  ? "border-[#25a36f]/25 bg-[#25a36f]/5"
                  : "border-slate-200/80 bg-white/60"
            }`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active
                  ? "bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-white"
                  : done
                    ? "bg-[#25a36f] text-white"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {done ? <HiCheck className="size-4" aria-hidden /> : item.id}
            </span>
            <span
              className={`text-[11px] font-semibold leading-tight sm:text-xs ${
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
  const summary = `${form.title}\n\n${form.reviewText}\n\n— ${form.name}${form.company ? `, ${form.company}` : ""}`;
  const params = new URLSearchParams({
    mini: "true",
    url,
    title,
    summary,
  });
  return `https://www.linkedin.com/shareArticle?${params.toString()}`;
}

export default function ReviewsSection() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [categoryFilter, setCategoryFilter] = useState("");
  const formCardRef = useRef(null);

  const selectedProduct = products.find((item) => item.id === form.productId);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canGoNext() {
    if (step === 1) return Boolean(form.productId);
    if (step === 2) {
      return Boolean(
        form.name.trim() &&
          form.email.trim() &&
          form.rating > 0 &&
          form.title.trim() &&
          form.reviewText.trim()
      );
    }
    if (step === 3) return true;
    return false;
  }

  function handleNext() {
    if (!canGoNext()) return;
    if (step === 3) {
      setStep(4);
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleShareLinkedIn() {
    if (!selectedProduct) return;
    updateField("shareOnLinkedIn", true);
    window.open(getLinkedInShareUrl(form, selectedProduct.name), "_blank", "noopener,noreferrer");
  }

  function handleReset() {
    setForm(initialForm);
    setCategoryFilter("");
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
            Share your experience in four quick steps and help other businesses choose wisely.
          </p>
        </div>

        <div
          ref={formCardRef}
          className={`relative scroll-mt-28 rounded-[28px] border border-slate-200 p-4 shadow-2xl shadow-[#13203F]/10 sm:p-6 ${
            step === 1 ? "bg-white" : "bg-[#eef2fa]"
          }`}
        >
          {step < 4 ? (
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
              <Step1SelectProduct
                selectedId={form.productId}
                onSelect={(id) => updateField("productId", id)}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
              />
            )}

            {step === 2 && (
              <>
                <StepHeader
                  title="Leave a Review"
                  subtitle={
                    selectedProduct
                      ? `Tell us about your experience with ${selectedProduct.name}.`
                      : "Tell us about your experience."
                  }
                />

                {selectedProduct ? (
                  <div className="flex items-center gap-3 rounded-xl border border-[#2D4CC8]/15 bg-white px-4 py-3">
                    <ProductLogo product={selectedProduct} size="sm" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Reviewing
                      </p>
                      <p className="text-sm font-bold text-[#13203F]">{selectedProduct.name}</p>
                      <p className="text-xs text-slate-500">by {selectedProduct.company}</p>
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="reviewer-name" className={labelClass}>
                      Your Name *
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
                    <label htmlFor="reviewer-email" className={labelClass}>
                      Business Email *
                    </label>
                    <input
                      id="reviewer-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="reviewer-company" className={labelClass}>
                      Company
                    </label>
                    <input
                      id="reviewer-company"
                      value={form.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="reviewer-role" className={labelClass}>
                      Role / Designation
                    </label>
                    <input
                      id="reviewer-role"
                      value={form.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      placeholder="e.g. Founder, Finance Head"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Your Rating *</label>
                  <StarRating value={form.rating} onChange={(value) => updateField("rating", value)} />
                </div>

                <div>
                  <label htmlFor="review-title" className={labelClass}>
                    Review Title *
                  </label>
                  <input
                    id="review-title"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Summarise your experience in one line"
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
                    placeholder="What worked well? What could be improved?"
                    className={`${inputClass} resize-y min-h-[120px]`}
                    required
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <StepHeader
                  title="Share on LinkedIn"
                  subtitle="Spread the word — share your review with your professional network."
                />

                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="bg-gradient-to-r from-[#13203F] via-[#2D4CC8] to-[#40C3CF] px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-white">{form.name}</p>
                        <p className="text-xs text-white/75">
                          {[form.role, form.company].filter(Boolean).join(" · ") || "CompareX reviewer"}
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
                          <span className="text-sm font-semibold text-[#13203F]">
                            {selectedProduct.name}
                          </span>
                          <p className="text-xs text-slate-500">by {selectedProduct.company}</p>
                        </div>
                      </div>
                    ) : null}
                    <h3 className="text-base font-bold text-[#13203F]">{form.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{form.reviewText}</p>
                  </div>
                </article>

                <div className="rounded-2xl border border-[#0A66C2]/20 bg-[#0A66C2]/5 p-4">
                  <p className="text-sm leading-relaxed text-slate-600">
                    Click below to open LinkedIn with your review pre-filled. You can edit the post
                    before publishing.
                  </p>
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0A66C2]/25 transition hover:brightness-110 sm:w-auto"
                    style={{ color: "#fff" }}
                  >
                    <FaLinkedin className="size-5" aria-hidden />
                    Share on LinkedIn
                  </button>
                  {form.shareOnLinkedIn ? (
                    <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[#25a36f]">
                      <HiCheck className="size-4" aria-hidden />
                      LinkedIn share window opened
                    </p>
                  ) : null}
                </div>
              </>
            )}

            {step === 4 && (
              <div className="py-4 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#25a36f] text-white shadow-lg shadow-[#25a36f]/30">
                  <HiCheck className="size-8" aria-hidden />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#13203F]">Finished!</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                  Thank you for sharing your review
                  {selectedProduct ? ` of ${selectedProduct.name}` : ""}. Your feedback helps
                  businesses across India make smarter payment decisions.
                </p>
                {form.shareOnLinkedIn ? (
                  <p className="mt-2 text-sm text-[#25a36f]">
                    Your review was shared on LinkedIn successfully.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    Your review has been recorded on CompareX.
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#2D4CC8]/40 hover:text-[#13203F]"
                  >
                    Write Another Review
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110"
                    style={{ color: "#fff" }}
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>

          {step < 4 ? (
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200/70 pt-5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#2D4CC8]/40 hover:text-[#13203F]"
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
                disabled={!canGoNext()}
                className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ color: "#fff" }}
              >
                {step === 3 ? "Finish" : "Next"}
                <HiArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
