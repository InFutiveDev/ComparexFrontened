"use client";

import { useEffect, useState } from "react";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import Image from "next/image";
import { ApiError } from "@/lib/api";
import { submitResellerPartner } from "@/lib/reseller";

const steps = [
  { id: 1, label: "Partner profile" },
  { id: 2, label: "Business network" },
  { id: 3, label: "Partnership" },
];

const partnerTypeOptions = [
  { value: "consultant-advisor", label: "Consultant / Advisor" },
  { value: "digital-marketing-agency", label: "Digital / Marketing Agency" },
  { value: "finance-compliance", label: "Finance & Compliance Professional" },
  { value: "technology-integration", label: "Technology & Integration Partner" },
  { value: "business-services", label: "Business Services Provider" },
  { value: "other", label: "Other" },
];

const businessTypeOptions = [
  { value: "ecommerce-d2c", label: "Ecommerce & D2C" },
  { value: "saas-technology", label: "SaaS & Technology" },
  { value: "retail-offline", label: "Retail & Offline Businesses" },
  { value: "travel-utilities", label: "Travel & Utilities" },
  { value: "exporters-international", label: "Exporters & International Businesses" },
  { value: "multiple-types", label: "Multiple Business Types" },
];

const monthlyBusinessOptions = [
  { value: "1-5", label: "1–5" },
  { value: "6-10", label: "6–10" },
  { value: "11-25", label: "11–25" },
  { value: "25-plus", label: "25+" },
];

const paymentFamiliarityOptions = [
  { value: "new", label: "New to the Payments Ecosystem" },
  { value: "familiar", label: "Familiar with Common Payment Solutions" },
  { value: "experienced", label: "Experienced in Payment Gateway Evaluation & Onboarding" },
  { value: "regular-advisor", label: "Regularly Advise Businesses on Payment Solutions" },
];

const initialForm = {
  fullName: "",
  businessName: "",
  phone: "",
  email: "",
  website: "",
  partnerType: "",
  businessTypes: [],
  monthlyBusinessCount: "",
  paymentFamiliarity: "",
  consent: false,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-slate-600";

const checkboxRowClass = "flex cursor-pointer items-start gap-3 text-left";

function SelectedCheckIcon() {
  return (
    <Image
      src="/images/icon-1.svg"
      alt=""
      width={20}
      height={20}
      className="shrink-0"
      aria-hidden
    />
  );
}

function EmptyCheckIcon() {
  return (
    <span
      className="size-5 shrink-0 rounded-md border border-slate-300 bg-white"
      aria-hidden
    />
  );
}

function IconToggle({ checked, onToggle, children }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={checkboxRowClass}
    >
      {checked ? <SelectedCheckIcon /> : <EmptyCheckIcon />}
      {children}
    </button>
  );
}

function OptionButtons({ name, value, options, onChange }) {
  return (
    <div>
      <input name={name} value={value} required className="sr-only" readOnly tabIndex={-1} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                selected
                  ? "border-[#2D4CC8] bg-[#2D4CC8]/15 text-[#13203F] ring-2 ring-[#2D4CC8]/25"
                  : "border-gray-300 bg-white text-slate-600 hover:border-[#2D4CC8]/60 hover:text-[#13203F]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MultiOptionButtons({ options, values, onChange }) {
  function toggle(value) {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
      return;
    }
    onChange([...values, value]);
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const selected = values.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={`cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
              selected
                ? "border-[#2D4CC8] bg-[#2D4CC8]/15 text-[#13203F] ring-2 ring-[#2D4CC8]/25"
                : "border-gray-300 bg-white text-slate-600 hover:border-[#2D4CC8]/60 hover:text-[#13203F]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function StepHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="text-left text-lg mb-1 font-bold text-[#13203F] sm:text-xl lg:text-[22px]">
        {title}
      </h2>
      {subtitle ? (
        <p className=" text-left text-base font-normal text-slate-600">{subtitle}</p>
      ) : null}
    </>
  );
}

export function ResellerAdviceForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canGoNext() {
    if (step === 1) {
      return Boolean(
        form.fullName.trim() &&
          form.businessName.trim() &&
          form.phone.trim() &&
          form.email.trim() &&
          form.partnerType
      );
    }
    if (step === 2) {
      return form.businessTypes.length > 0 && Boolean(form.monthlyBusinessCount);
    }
    return Boolean(form.paymentFamiliarity && form.consent);
  }

  function handleNext() {
    if (!canGoNext()) return;
    setStep((s) => Math.min(s + 1, 3));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canGoNext()) return;

    setError("");
    setIsSubmitting(true);

    try {
      await submitResellerPartner({
        fullName: form.fullName.trim(),
        businessName: form.businessName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        partnerType: form.partnerType,
        businessTypes: form.businessTypes,
        monthlyBusinessCount: form.monthlyBusinessCount,
        paymentFamiliarity: form.paymentFamiliarity,
        consent: form.consent,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit partner application");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => {
      setSubmitted(false);
      setForm(initialForm);
      setStep(1);
    }, 30000);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  const activeStep = steps.find((item) => item.id === step) ?? steps[0];
  const progressWidth = `${(step / steps.length) * 100}%`;

  if (submitted) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-white/30 bg-white p-4 text-center shadow-xl shadow-slate-950/15 sm:p-6">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#25a36f] text-white">
          <HiCheck className="size-7" aria-hidden />
        </div>
        <h3 className="mt-5 text-xl font-bold text-slate-900">
          Thank You for Your Interest in CompareX
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          We&apos;ve received your application and appreciate your interest in becoming a
          CompareX Partner.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Our team will review the information provided and connect with you to better understand
          your business, partnership objectives, and the types of solutions most relevant to your
          network.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          If additional information is required, a member of our team may reach out to you.
        </p>
        <p className="mt-4 text-sm font-semibold text-slate-700">
          We look forward to exploring how we can create value together.
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-50 w-full max-w-xl rounded-[28px] border border-slate-200 bg-[#eef2fa] p-4 shadow-2xl shadow-[#13203F]/10 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span>
          Step {step} of {steps.length}
        </span>
        <span className="text-[#13203F]">{activeStep.label}</span>
      </div>
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-[#2D4CC8]/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] transition-all duration-300"
          style={{ width: progressWidth }}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="max-h-[min(26rem,50vh)] space-y-4 overflow-y-auto overscroll-y-contain pr-3 [-ms-overflow-style:none] [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin] sm:pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
          {step === 1 && (
            <>
              <StepHeader
                title="Let's Build Your Partner Profile"
                subtitle="Help us understand your business and how you support other businesses."
              />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div >
                  <label htmlFor="full-name" className={labelClass}>
                    Full Name *
                  </label>
                  <input
                    id="full-name"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="business-company-name" className={labelClass}>
                    Business / Company Name *
                  </label>
                  <input
                    id="business-company-name"
                    value={form.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobile-number" className={labelClass}>
                    Mobile Number *
                  </label>
                  <input
                    id="mobile-number"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="business-email" className={labelClass}>
                    Business Email *
                  </label>
                  <input
                    id="business-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="website-linkedin" className={labelClass}>
                    Website / LinkedIn Profile{" "}
                    <span className="font-normal text-slate-500">(Optional)</span>
                  </label>
                  <input
                    id="website-linkedin"
                    type="url"
                    value={form.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="mb-3 text-left text-base font-medium text-slate-700">
                  Which best describes your business?
                </p>
                <OptionButtons
                  name="partnerType"
                  value={form.partnerType}
                  options={partnerTypeOptions}
                  onChange={(value) => updateField("partnerType", value)}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeader
                title="Tell Us About Your Business Network"
                subtitle="Help us understand the types of businesses you currently support or intend to work with."
              />

              <div className="mt-4">
                <MultiOptionButtons
                  options={businessTypeOptions}
                  values={form.businessTypes}
                  onChange={(values) => updateField("businessTypes", values)}
                />
              </div>

              <div className="pt-4">
                <p className="mb-3 text-left text-base font-medium text-slate-700">
                  Approximately how many businesses do you interact with or support in a typical
                  month?
                </p>
                <OptionButtons
                  name="monthlyBusinessCount"
                  value={form.monthlyBusinessCount}
                  options={monthlyBusinessOptions}
                  onChange={(value) => updateField("monthlyBusinessCount", value)}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeader
                title="Let's Explore Partnership Opportunities"
                subtitle="How familiar are you with payment gateways and merchant onboarding processes?"
              />

              <div className="mt-4">
                <OptionButtons
                  name="paymentFamiliarity"
                  value={form.paymentFamiliarity}
                  options={paymentFamiliarityOptions}
                  onChange={(value) => updateField("paymentFamiliarity", value)}
                />
              </div>

              <div className="pt-4">
                <p className="mb-3 text-left text-sm font-semibold text-slate-700">Consent</p>
                <IconToggle
                  checked={form.consent}
                  onToggle={() => updateField("consent", !form.consent)}
                >
                  <span className="text-sm leading-relaxed text-slate-600">
                    I consent to being contacted by CompareX regarding partnership opportunities,
                    program updates, and relevant business solutions.
                  </span>
                </IconToggle>
              </div>
            </>
          )}

        </div>

        <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-200/70 pt-4">
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

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext()}
                className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {step === 2 ? "Continue" : "Next"}
                <HiArrowRight className="size-4" aria-hidden />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canGoNext() || isSubmitting}
                className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Apply as Partner"}
                <HiCheck className="size-4" aria-hidden />
              </button>
            )}
        </div>
      </form>
    </div>
  );
}
