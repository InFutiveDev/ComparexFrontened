"use client";

import { useEffect, useState } from "react";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import { heroFormStepOneFields } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";

const steps = [
  { id: 1, label: "Your details" },
  { id: 2, label: "Business info" },
  { id: 3, label: "Software needs" },
];

const businessPriorityOptions = [
  { value: "lower-transaction-fees", label: "Lower Transaction Fees" },
  { value: "faster-settlements", label: "Faster Settlements" },
  { value: "easy-onboarding-approval", label: "Easy Onboarding & Approval" },
  { value: "better-success-rates", label: "Better Success Rates" },
  { value: "international-payment-support", label: "International Payment Support" },
  { value: "subscription-recurring-billing", label: "Subscription / Recurring Billing" },
  { value: "better-customer-support", label: "Better Customer Support" },
  { value: "easy-website-app-integration", label: "Easy Website / App Integration" },
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  business: "",
  businessName: "",
  industry: "",
  role: "",
  department: "",
  companySize: "",
  region: "",
  timeline: "",
  teamSize: "",
  category: "",
  budget: "",
  message: "",
  marketing: false,
  termsAndConditions: false,
  privacyPolicy: false,
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

function IconToggle({
  checked,
  onToggle,
  children,
}) {
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

function OptionButtons({
  name,
  value,
  options,
  onChange,
}) {
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

export function HeroAdviceForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canGoNext() {
    if (step === 1) {
      return heroFormStepOneFields.every((field) => Boolean(form[field.name]));
    }
    if (step === 2) {
      return Boolean(form.business);
    }
    return Boolean(
      (form.businessName ?? "").trim() &&
      (form.email ?? "").trim() &&
      (form.phone ?? "").trim()
    );
  }

  function handleNext() {
    if (!canGoNext()) return;
    setStep((s) => Math.min(s + 1, 3));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canGoNext()) return;
    setSubmitted(true);
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
      <div className="w-full max-w-xl rounded-2xl border border-white/30 bg-white p-2 text-center shadow-xl shadow-slate-950/15 sm:p-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#25a36f] text-white">
          <HiCheck className="size-7" aria-hidden />
        </div>
        <h3 className="mt-5 text-xl font-bold text-slate-900">You’re One Step Closer to Choosing the Right PG</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
         Our team is reviewing the best-fit payment gateway options based on your business needs. Our team will connect with you shortly to help with comparisons, onboarding guidance, and activation support.
        </p>
        <p className="mt-2 text-[16px] font-semibold leading-relaxed text-slate-600">Meanwhile, Explore:</p>
        <div className="flex items-center justify-center gap-2">
        <Link href="/" className="mt-4 inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-4 py-3 text-[14px] font-medium !text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">PG Comparison Tools</Link>
        <Link href="/" className="mt-4 inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-4 py-3 text-[14px] font-medium !text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">Merchant Reviews</Link>
        <Link href="/" className="mt-4 inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-4 py-3 text-[14px] font-medium !text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">Payment Cost Calculator</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-50 w-full max-w-xl rounded-[28px] border border-slate-200 bg-[#eef2fa] p-4 shadow-2xl shadow-[#13203F]/10 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span>Step {step} of {steps.length}</span>
        <span className="text-[#13203F]">{activeStep.label}</span>
      </div>
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-[#2D4CC8]/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] transition-all duration-300"
          style={{ width: progressWidth }}
        />
      </div>

      <div className="p-3 sm:p-3">



        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div className="mb-3 flex items-start gap-3">

                <div>
                  <h2 className="text-left text-[22px] font-bold text-[#13203F]">What Kind of Business Are You Running?</h2>
                </div>
              </div>
              <h3 className="mb-4 text-left text-[16px] font-normal text-slate-600">We’ll recommend PGs best suited for your business model.</h3>
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-1">
                {heroFormStepOneFields.map((field) => (
                  <div key={field.id}>
                    {/* <label htmlFor={field.id} className={labelClass}>
                      {field.label}
                    </label> */}
                    <OptionButtons
                      name={field.name}
                      value={form[field.name]}
                      options={field.options}
                      onChange={(value) => updateField(field.name, value)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-3 flex items-start gap-3">

                <div>
                  <h2 className="text-left text-[22px] font-bold text-[#13203F]">What Matters Most to Your Business Right Now?</h2>
                </div>
              </div>
              <h3 className="mb-4 text-left text-[16px] font-normal text-slate-600">Choose the key factor influencing your decision.</h3>
              <div className="mb-4">
                {/* <label className={labelClass}>What matters most</label> */}
                <OptionButtons
                  name="business"
                  value={form.business}
                  options={businessPriorityOptions}
                  onChange={(value) => updateField("business", value)}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-3 flex items-start gap-3">
                <div>
                  <h2 className="text-left text-[22px] font-bold text-[#13203F]">Almost Done</h2>
                </div>
              </div>
              <h3 className="mb-4 text-left text-[16px] font-normal text-slate-600">Let’s connect you with the right Payment Gateway.</h3>
              <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="hero-category" className={labelClass}>
                    Business name
                  </label>
                  <input
                    id="hero-business-name"
                    value={form.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="hero-category" className={labelClass}>
                    Phone
                  </label>
                  <input
                    id="hero-phone"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="hero-category" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="hero-email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                
                
              </div>
              <div className="mb-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                   <Image src="/images/icon-1.svg" alt="Icon" width={20} height={20} />
                   <span className="text-sm leading-relaxed text-slate-600">
                   No Spam 
                   </span>
                </div>
                <div className="flex items-center gap-2">
                   <Image src="/images/icon-1.svg" alt="Icon" width={20} height={20} />
                   <span className="text-sm leading-relaxed text-slate-600">
                   No Sales Pressure
                   </span>
                </div>
                <div className="flex items-center gap-2">
                   <Image src="/images/icon-1.svg" alt="Icon" width={20} height={20} />
                   <span className="text-sm leading-relaxed text-slate-600">
                   Just Unbiased PG Recommendations
                   </span>
                </div>
              </div>
            </>
          )}
          

          <div className="flex items-center justify-end gap-3 pt-2">
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
              <div className="w-fit h-fit" />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext()}
                className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <HiArrowRight className="size-4" aria-hidden />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canGoNext()}
                className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit
                <HiCheck className="size-4" aria-hidden />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
