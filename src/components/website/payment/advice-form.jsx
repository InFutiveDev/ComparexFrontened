"use client";

import { useEffect, useState } from "react";
import { HiArrowLeft, HiArrowRight, HiEye, HiEyeSlash } from "react-icons/hi2";
import Image from "next/image";
import { FormSuccessScreen } from "@/components/website/shared/form-success-screen";
import { ApiError } from "@/lib/api";
import { submitPaymentProvider, updatePaymentProvider } from "@/lib/payment";
import { bindField, extractFormRecordId } from "@/lib/form-record-id";
import {
  sanitizePhoneInput,
  validateContactFields,
} from "@/lib/validation";

const steps = [
  { id: 1, label: "Organisation" },
  { id: 2, label: "Capabilities" },
  { id: 3, label: "Partnership" },
];

const paymentCapabilityOptions = [
  { value: "online-payment", label: "Online Payment Acceptance" },
  { value: "upi", label: "UPI Payment Solutions" },
  { value: "subscription-billing", label: "Subscription & Recurring Billing" },
  { value: "cross-border", label: "International & Cross-Border Payments" },
  { value: "checkout-optimization", label: "Checkout & Conversion Optimization" },
  { value: "routing-orchestration", label: "Payment Routing & Orchestration" },
  { value: "payouts", label: "Payouts & Disbursements" },
  { value: "pos-offline", label: "POS & Offline Payments" },
  { value: "merchant-banking", label: "Merchant Banking & Financial Services" },
  { value: "fraud-risk", label: "Fraud Prevention & Risk Management" },
  { value: "other", label: "Other" },
];

const partnershipGoalOptions = [
  { value: "visibility", label: "Increase Visibility Among Businesses Evaluating Solutions" },
  { value: "connect-segments", label: "Connect with Relevant Business Segments" },
  { value: "acquisition-efficiency", label: "Improve Merchant Acquisition Efficiency" },
  { value: "showcase-strengths", label: "Showcase Product Strengths & Differentiators" },
  { value: "partnership-opportunities", label: "Explore Partnership Opportunities" },
  { value: "learn-more", label: "Learn More About CompareX" },
  { value: "multiple-objectives", label: "Multiple Objectives" },
];

const initialForm = {
  companyName: "",
  contactPerson: "",
  designation: "",
  email: "",
  phone: "",
  website: "",
  password: "",
  paymentCapabilities: [],
  partnershipGoals: [],
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

function MultiCheckboxList({ options, values, onChange }) {
  function toggle(value) {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
      return;
    }
    onChange([...values, value]);
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <IconToggle
          key={option.value}
          checked={values.includes(option.value)}
          onToggle={() => toggle(option.value)}
        >
          <span className="text-sm leading-relaxed text-slate-700">{option.label}</span>
        </IconToggle>
      ))}
    </div>
  );
}

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

function PasswordInput({ id, label, value, onChange, onInput, placeholder = "Minimum 8 characters" }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value ?? ""}
          onChange={onChange}
          onInput={onInput}
          className={`${inputClass} pr-12`}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <HiEyeSlash className="size-5" aria-hidden /> : <HiEye className="size-5" aria-hidden />}
        </button>
      </div>
    </div>
  );
}

export function PaymentAdviceForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [recordId, setRecordId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [error, setError] = useState("");

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canGoNext() {
    if (step === 1) {
      return Boolean(
        form.companyName.trim() &&
          form.contactPerson.trim() &&
          form.email.trim() &&
          form.phone.trim() &&
          form.password.trim()
      );
    }
    if (step === 2) {
      return form.paymentCapabilities.length > 0;
    }
    return form.partnershipGoals.length > 0 && form.consent;
  }

  function validateStepOne() {
    const contactError = validateContactFields({
      email: form.email,
      phone: form.phone,
    });

    if (contactError) {
      setError(contactError);
      return false;
    }

    if (form.password.trim().length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    setError("");
    return true;
  }

  async function saveCurrentStep() {
    setIsSavingStep(true);
    setError("");

    try {
      if (step === 1) {
        const stepOnePayload = {
          step: 1,
          companyName: form.companyName.trim(),
          contactPerson: form.contactPerson.trim(),
          designation: form.designation.trim() || "Not specified",
          email: form.email.trim(),
          phone: form.phone.trim(),
          website: form.website.trim(),
        };

        if (recordId) {
          await updatePaymentProvider(recordId, stepOnePayload);
        } else {
          const data = await submitPaymentProvider({
            companyName: stepOnePayload.companyName,
            contactPerson: stepOnePayload.contactPerson,
            designation: stepOnePayload.designation,
            email: stepOnePayload.email,
            phone: stepOnePayload.phone,
            website: stepOnePayload.website,
            password: form.password.trim(),
          });
          const id = extractFormRecordId(data);
          if (!id) {
            throw new ApiError("Failed to save your details. Please try again.");
          }
          setRecordId(id);
        }
        return true;
      }

      if (!recordId) {
        setError("Please complete step 1 first");
        return false;
      }

      if (step === 2) {
        await updatePaymentProvider(recordId, {
          step: 2,
          paymentCapabilities: form.paymentCapabilities,
        });
        return true;
      }

      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save your progress");
      return false;
    } finally {
      setIsSavingStep(false);
    }
  }

  async function handleNext() {
    if (isSavingStep) return;

    if (step === 1) {
      if (!canGoNext()) {
        setError("Please fill in all required fields");
        return;
      }
      if (!validateStepOne()) return;
    } else if (!canGoNext()) {
      setError(
        step === 2
          ? "Please select at least one payment capability"
          : "Please select partnership goals and provide consent",
      );
      return;
    }

    const saved = await saveCurrentStep();
    if (!saved) return;

    setStep((s) => Math.min(s + 1, 3));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (step !== 3) return;
    if (!canGoNext()) return;

    if (!recordId) {
      setError("Please complete step 1 first");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await updatePaymentProvider(recordId, {
        step: 3,
        partnershipGoals: form.partnershipGoals,
        consent: form.consent,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit partnership inquiry");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => {
      setSubmitted(false);
      setForm(initialForm);
      setRecordId("");
      setStep(1);
    }, 30000);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  const activeStep = steps.find((item) => item.id === step) ?? steps[0];
  const progressWidth = `${(step / steps.length) * 100}%`;

  if (submitted) {
    return (
      <FormSuccessScreen>
        <h3 className="mt-6 text-2xl text-center font-bold tracking-tight text-[#13203F] sm:text-[25px]">
          Thank You for Your Interest
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-start text-sm leading-relaxed text-slate-600 sm:text-base">
          We appreciate your interest in partnering with CompareX.
        </p>
        <p className="mx-auto mt-2 max-w-xl text-start text-sm leading-relaxed text-slate-600 sm:text-base">
          Our team will review the information provided and connect with you to better understand
          your solutions, business priorities, and partnership objectives.
        </p>
        <p className="mx-auto mt-2 max-w-xl text-start text-sm leading-relaxed text-slate-600 sm:text-base">
          If additional information is required, a member of our team may reach out to you.
        </p>
        <p className="mx-auto mt-2 max-w-xl text-start text-sm leading-relaxed text-slate-600 sm:text-base">
          Your dashboard login will be enabled once an admin activates your account.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-start text-sm font-semibold text-slate-700 sm:text-base">
          We look forward to exploring potential opportunities together.
        </p>
      </FormSuccessScreen>
    );
  }

  return (
    <div className="relative z-50 w-full max-w-2xl rounded-[28px] border border-slate-200 bg-[#eef2fa] p-4 shadow-2xl shadow-[#13203F]/10 sm:p-5">
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

        <div className="max-h-[min(26rem,54vh)] space-y-4 overflow-y-auto overscroll-y-contain pr-3 [scrollbar-color:#2D4CC8_#EEF2FC] [scrollbar-width:thin] sm:pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#2D4CC8] [&::-webkit-scrollbar-thumb]:hover:bg-[#2542b6] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#EEF2FC]">
          {step === 1 && (
            <>
              <StepHeader
                title="Let's Get Acquainted"
                subtitle="Share a few details about your organisation so we can better understand your business and partnership interests."
              />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="company-name" className={labelClass}>
                    Company Name *
                  </label>
                  <input
                    id="company-name"
                    value={form.companyName}
                    {...bindField(updateField, "companyName")}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-person" className={labelClass}>
                    Contact Person *
                  </label>
                  <input
                    id="contact-person"
                    value={form.contactPerson}
                    {...bindField(updateField, "contactPerson")}
                    className={inputClass}
                    required
                  />
                </div>
                {/* <div>
                  <label htmlFor="designation" className={labelClass}>
                    Designation *
                  </label>
                  <input
                    id="designation"
                    value={form.designation}
                    onChange={(e) => updateField("designation", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div> */}
                <div>
                  <label htmlFor="business-email" className={labelClass}>
                    Business Email *
                  </label>
                  <input
                    id="business-email"
                    type="email"
                    value={form.email}
                    {...bindField(updateField, "email")}
                    className={inputClass}
                    placeholder="you@company.com"
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
                    inputMode="numeric"
                    maxLength={11}
                    value={form.phone}
                    onChange={(e) => updateField("phone", sanitizePhoneInput(e.target.value))}
                    onInput={(e) => updateField("phone", sanitizePhoneInput(e.target.value))}
                    className={inputClass}
                    placeholder="10-digit (WhatsApp preferred)"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="company-website" className={labelClass}>
                    Company Website
                  </label>
                  <input
                    id="company-website"
                    type="url"
                    value={form.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://"
                    className={inputClass}
                  />
                </div>
                <PasswordInput
                  id="password"
                  label="Password *"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  onInput={(e) => updateField("password", e.target.value)}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeader
                title="Who Do You Serve Best?"
                subtitle="Which payment capabilities or solutions does your organisation currently support? (Select all that apply)"
              />

              <div className="mt-4">
                <MultiCheckboxList
                  options={paymentCapabilityOptions}
                  values={form.paymentCapabilities}
                  onChange={(values) => updateField("paymentCapabilities", values)}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeader
                title="Explore Partnership Opportunities"
                subtitle="What would you like to achieve through CompareX?"
              />

              <div className="mt-4">
                <MultiCheckboxList
                  options={partnershipGoalOptions}
                  values={form.partnershipGoals}
                  onChange={(values) => updateField("partnershipGoals", values)}
                />
              </div>

              <div className="border-t border-slate-200/70 pt-4">
                <IconToggle
                  checked={form.consent}
                  onToggle={() => updateField("consent", !form.consent)}
                >
                  <span className="text-sm leading-relaxed text-slate-600">
                    I consent to being contacted by CompareX regarding partnership opportunities,
                    platform updates, and merchant engagement initiatives.
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
              disabled={isSavingStep}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingStep ? "Saving..." : step === 2 ? "Continue" : "Next"}
              <HiArrowRight className="size-4" aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Explore Partnership Opportunities"}
              <HiArrowRight className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
