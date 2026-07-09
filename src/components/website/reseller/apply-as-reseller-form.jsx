"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiArrowLeft, HiArrowRight, HiCheck, HiEye, HiEyeSlash } from "react-icons/hi2";
import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import { FormSuccessScreen } from "@/components/website/shared/form-success-screen";
import {
  sanitizePhoneInput,
  validateContactFields,
} from "@/lib/validation";

const steps = [
  { id: 1, label: "Basic Registration" },
  { id: 2, label: "Business Details" },
  { id: 3, label: "KYC Details" },
  { id: 4, label: "Agreement & Approval" },
];

const resellerTypeOptions = [
  { value: "freelancer", label: "Freelancer" },
  { value: "web-app-developer", label: "Web/App Developer" },
  { value: "digital-agency", label: "Digital Agency" },
  { value: "ca-consultant", label: "CA / Consultant" },
  { value: "pg-sales-consultant", label: "PG Sales Consultant" },
  { value: "pg-integration-expert", label: "PG Integration Expert" },
  { value: "affiliate-partner", label: "Affiliate Partner" },
];

const experienceOptions = [
  { value: "0-1", label: "0–1 years" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10-plus", label: "10+ years" },
];

const networkSizeOptions = [
  { value: "none", label: "No existing network" },
  { value: "1-10", label: "1–10 merchants" },
  { value: "11-50", label: "11–50 merchants" },
  { value: "51-100", label: "51–100 merchants" },
  { value: "100-plus", label: "100+ merchants" },
];

const referralOptions = [
  { value: "1-5", label: "1–5 referrals" },
  { value: "6-15", label: "6–15 referrals" },
  { value: "16-30", label: "16–30 referrals" },
  { value: "30-plus", label: "30+ referrals" },
];

const bankAccountTypeOptions = [
  { value: "savings", label: "Savings Account" },
  { value: "current", label: "Current Account" },
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  otp: "",
  password: "",
  confirmPassword: "",
  businessName: "",
  resellerType: "",
  website: "",
  cityState: "",
  yearsExperience: "",
  merchantNetworkSize: "",
  monthlyReferrals: "",
  panCard: "",
  aadhaarId: "",
  gstCertificate: "",
  bankAccountHolderName: "",
  bankName: "",
  bankAccountNumber: "",
  confirmBankAccountNumber: "",
  bankIfsc: "",
  bankBranch: "",
  bankAccountType: "",
  bankProofName: "",
  resellerAgreement: false,
  commissionPolicy: false,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-slate-600";

const optionalMark = <span className="font-normal text-slate-400"> (Optional)</span>;

function SelectedCheckIcon() {
  return (
    <Image src="/images/icon-1.svg" alt="" width={20} height={20} className="shrink-0" aria-hidden />
  );
}

function EmptyCheckIcon() {
  return (
    <span className="size-5 shrink-0 rounded-md border border-slate-300 bg-white" aria-hidden />
  );
}

function IconToggle({ checked, onToggle, children }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex cursor-pointer items-start gap-3 text-left"
    >
      {checked ? <SelectedCheckIcon /> : <EmptyCheckIcon />}
      {children}
    </button>
  );
}

function OptionButtons({ name, value, options, onChange }) {
  return (
    <div>
      <input name={name} value={value} className="sr-only" readOnly tabIndex={-1} />
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

function StepHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-left text-lg font-bold text-[#13203F] sm:text-xl lg:text-[22px]">{title}</h2>
      {subtitle ? <p className="mt-1 text-left text-sm text-slate-600 sm:text-base">{subtitle}</p> : null}
    </div>
  );
}

function PasswordInput({ id, label, value, onChange, placeholder, required = true }) {
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
          value={value}
          onChange={onChange}
          className={`${inputClass} pr-12`}
          placeholder={placeholder}
          required={required}
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

function ResellerRegistrationForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validatePassword() {
    if (form.password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  }

  function canGoNext() {
    if (step === 1) {
      return Boolean(
        form.fullName.trim() &&
          form.email.trim() &&
          form.phone.trim() &&
          otpVerified &&
          form.password.trim() &&
          form.confirmPassword.trim()
      );
    }
    if (step === 2) {
      return Boolean(form.businessName.trim() && form.resellerType && form.cityState.trim() && form.yearsExperience);
    }
    if (step === 3) {
      return Boolean(
        form.panCard.trim() &&
          form.aadhaarId.trim() &&
          form.bankAccountHolderName.trim() &&
          form.bankName.trim() &&
          form.bankAccountNumber.trim() &&
          form.confirmBankAccountNumber.trim() &&
          form.bankIfsc.trim() &&
          form.bankAccountType &&
          form.bankProofName
      );
    }
    return form.resellerAgreement && form.commissionPolicy;
  }

  function validateCurrentStep() {
    if (step === 1) {
      const contactError = validateContactFields({ email: form.email, phone: form.phone });
      if (contactError) return contactError;
      if (!otpVerified) return "Please verify your mobile number with OTP";
      const passwordError = validatePassword();
      if (passwordError) return passwordError;
    }
    if (step === 3) {
      if (form.panCard.trim().length !== 10) return "Enter a valid 10-character PAN number";
      if (form.aadhaarId.replace(/\D/g, "").length !== 12) return "Enter a valid 12-digit Aadhaar number";
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.bankIfsc.trim().toUpperCase())) {
        return "Enter a valid 11-character IFSC code";
      }
      const accountDigits = form.bankAccountNumber.replace(/\D/g, "");
      if (accountDigits.length < 9 || accountDigits.length > 18) {
        return "Enter a valid bank account number";
      }
      if (form.bankAccountNumber !== form.confirmBankAccountNumber) {
        return "Bank account numbers do not match";
      }
    }
    return "";
  }

  async function handleSendOtp() {
    const phoneError = validateContactFields({ email: form.email, phone: form.phone });
    if (phoneError) {
      setError(phoneError);
      return;
    }

    setError("");
    setIsSendingOtp(true);
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setOtpSent(true);
    setOtpVerified(false);
    setIsSendingOtp(false);
  }

  function handleVerifyOtp() {
    if (form.otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setError("");
    setOtpVerified(true);
  }

  function handleNext() {
    const stepError = validateCurrentStep();
    if (stepError) {
      setError(stepError);
      return;
    }
    if (!canGoNext()) return;
    setError("");
    setStep((current) => Math.min(current + 1, steps.length));
  }

  function handleBack() {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const stepError = validateCurrentStep();
    if (stepError) {
      setError(stepError);
      return;
    }
    if (!canGoNext()) return;

    setError("");
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="flex w-full justify-center">
        <FormSuccessScreen>
        <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#13203F] sm:text-[25px]">
          Registration Submitted Successfully
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Thank you for applying as a CompareX reseller partner. Our team will review your KYC
          details and activate your account after final verification and approval.
        </p>
        <div className="mt-6">
          <Link
            href="/reseller"
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-6 py-3 text-sm font-semibold !text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110"
          >
            Back to Reseller Page
          </Link>
        </div>
        </FormSuccessScreen>
      </div>
    );
  }

  const activeStep = steps.find((item) => item.id === step) ?? steps[0];
  const progressWidth = `${(step / steps.length) * 100}%`;

  return (
    <div className="relative z-10 w-full max-w-3xl rounded-[28px] border border-slate-200 bg-[#eef2fa] p-4 shadow-2xl shadow-[#13203F]/10 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span>
          Step {step} of {steps.length}
        </span>
        <span className="text-[#13203F]">{activeStep.label}</span>
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-[#2D4CC8]/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] transition-all duration-300"
          style={{ width: progressWidth }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {step === 1 ? (
          <>
            <StepHeader
              title="Step 1: Basic Registration"
              subtitle="Create your reseller account with verified contact details."
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="full-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="full-name"
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email ID
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className={inputClass}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Mobile Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  value={form.phone}
                  onChange={(event) => {
                    updateField("phone", sanitizePhoneInput(event.target.value));
                    setOtpSent(false);
                    setOtpVerified(false);
                  }}
                  className={inputClass}
                  placeholder="10-digit (WhatsApp preferred)"
                  required
                />
              </div>
              <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-[#13203F]">OTP Verification</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.otp}
                    onChange={(event) => updateField("otp", event.target.value.replace(/\D/g, "").slice(0, 6))}
                    className={inputClass}
                    placeholder="Enter 6-digit OTP"
                    disabled={!otpSent}
                  />
                  <button
                    type="button"
                    onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                    disabled={isSendingOtp}
                    className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#2D4CC8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSendingOtp ? "Sending..." : otpSent ? "Verify OTP" : "Send OTP"}
                  </button>
                </div>
                {otpVerified ? (
                  <p className="mt-2 text-sm font-medium text-[#25a36f]">Mobile number verified</p>
                ) : null}
              </div>
              <PasswordInput
                id="password"
                label="Password Creation"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="Minimum 8 characters"
              />
              <PasswordInput
                id="confirm-password"
                label="Confirm Password"
                value={form.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
              />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <StepHeader
              title="Step 2: Business Details"
              subtitle="Tell us about your business and reseller profile."
            />
            <div className="space-y-4">
              <div>
                <label htmlFor="business-name" className={labelClass}>
                  Business / Agency Name
                </label>
                <input
                  id="business-name"
                  value={form.businessName}
                  onChange={(event) => updateField("businessName", event.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <p className={labelClass}>Type of Reseller</p>
                <OptionButtons
                  name="resellerType"
                  value={form.resellerType}
                  options={resellerTypeOptions}
                  onChange={(value) => updateField("resellerType", value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="website" className={labelClass}>
                    Website / LinkedIn Profile{optionalMark}
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={form.website}
                    onChange={(event) => updateField("website", event.target.value)}
                    className={inputClass}
                    placeholder="https://"
                  />
                </div>
                <div>
                  <label htmlFor="city-state" className={labelClass}>
                    City & State
                  </label>
                  <input
                    id="city-state"
                    value={form.cityState}
                    onChange={(event) => updateField("cityState", event.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <div>
                <p className={labelClass}>Years of Experience</p>
                <OptionButtons
                  name="yearsExperience"
                  value={form.yearsExperience}
                  options={experienceOptions}
                  onChange={(value) => updateField("yearsExperience", value)}
                />
              </div>
              <div>
                <p className={labelClass}>Existing Merchant Network Size{optionalMark}</p>
                <OptionButtons
                  name="merchantNetworkSize"
                  value={form.merchantNetworkSize}
                  options={networkSizeOptions}
                  onChange={(value) => updateField("merchantNetworkSize", value)}
                />
              </div>
              <div>
                <p className={labelClass}>Estimated Monthly Referrals{optionalMark}</p>
                <OptionButtons
                  name="monthlyReferrals"
                  value={form.monthlyReferrals}
                  options={referralOptions}
                  onChange={(value) => updateField("monthlyReferrals", value)}
                />
              </div>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <StepHeader
              title="Step 3: KYC Details and Verification"
              subtitle="Submit your identity and bank details for partner verification."
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pan-card" className={labelClass}>
                  PAN Card
                </label>
                <input
                  id="pan-card"
                  value={form.panCard}
                  onChange={(event) => updateField("panCard", event.target.value.toUpperCase().slice(0, 10))}
                  className={inputClass}
                  placeholder="ABCDE1234F"
                  required
                />
              </div>
              <div>
                <label htmlFor="aadhaar-id" className={labelClass}>
                  Aadhaar / Govt ID
                </label>
                <input
                  id="aadhaar-id"
                  inputMode="numeric"
                  value={form.aadhaarId}
                  onChange={(event) =>
                    updateField("aadhaarId", event.target.value.replace(/\D/g, "").slice(0, 12))
                  }
                  className={inputClass}
                  placeholder="12-digit Aadhaar"
                  required
                />
              </div>
              
              <div className="sm:col-span-2">
                <p className="mb-3 text-sm font-semibold text-[#13203F]">Bank Account Details</p>
              </div>
              <div>
                <label htmlFor="bank-account-holder" className={labelClass}>
                  Account Holder Name
                </label>
                <input
                  id="bank-account-holder"
                  value={form.bankAccountHolderName}
                  onChange={(event) => updateField("bankAccountHolderName", event.target.value)}
                  className={inputClass}
                  placeholder="As per bank records"
                  required
                />
              </div>
              <div>
                <label htmlFor="bank-name" className={labelClass}>
                  Bank Name
                </label>
                <input
                  id="bank-name"
                  value={form.bankName}
                  onChange={(event) => updateField("bankName", event.target.value)}
                  className={inputClass}
                  placeholder="e.g. HDFC Bank"
                  required
                />
              </div>
              <div>
                <label htmlFor="bank-account-number" className={labelClass}>
                  Account Number
                </label>
                <input
                  id="bank-account-number"
                  inputMode="numeric"
                  value={form.bankAccountNumber}
                  onChange={(event) =>
                    updateField("bankAccountNumber", event.target.value.replace(/\D/g, "").slice(0, 18))
                  }
                  className={inputClass}
                  placeholder="Enter account number"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-bank-account-number" className={labelClass}>
                  Confirm Account Number
                </label>
                <input
                  id="confirm-bank-account-number"
                  inputMode="numeric"
                  value={form.confirmBankAccountNumber}
                  onChange={(event) =>
                    updateField(
                      "confirmBankAccountNumber",
                      event.target.value.replace(/\D/g, "").slice(0, 18)
                    )
                  }
                  className={inputClass}
                  placeholder="Re-enter account number"
                  required
                />
              </div>
              <div>
                <label htmlFor="bank-ifsc" className={labelClass}>
                  IFSC Code
                </label>
                <input
                  id="bank-ifsc"
                  value={form.bankIfsc}
                  onChange={(event) =>
                    updateField("bankIfsc", event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11))
                  }
                  className={inputClass}
                  placeholder="e.g. HDFC0001234"
                  required
                />
              </div>
              <div>
                <label htmlFor="bank-branch" className={labelClass}>
                  Branch Name{optionalMark}
                </label>
                <input
                  id="bank-branch"
                  value={form.bankBranch}
                  onChange={(event) => updateField("bankBranch", event.target.value)}
                  className={inputClass}
                  placeholder="Branch location"
                />
              </div>
              <div className="sm:col-span-2">
                <p className={labelClass}>Account Type</p>
                <OptionButtons
                  name="bankAccountType"
                  value={form.bankAccountType}
                  options={bankAccountTypeOptions}
                  onChange={(value) => updateField("bankAccountType", value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bank-proof" className={labelClass}>
                  Cancelled Cheque / Bank Proof
                </label>
                <input
                  id="bank-proof"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => updateField("bankProofName", event.target.files?.[0]?.name ?? "")}
                  className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-[#EEF2FC] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#2D4CC8]`}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="gst-certificate" className={labelClass}>
                  GST Certificate{optionalMark}
                </label>
                <input
                  id="gst-certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => updateField("gstCertificate", event.target.files?.[0]?.name ?? "")}
                  className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-[#EEF2FC] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#2D4CC8]`}
                />
              </div>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <StepHeader
              title="Step 4: Final Verification & Approval"
              subtitle="Review and accept the partner terms to complete your registration."
            />
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
              <IconToggle
                checked={form.resellerAgreement}
                onToggle={() => updateField("resellerAgreement", !form.resellerAgreement)}
              >
                <span className="text-sm leading-relaxed text-slate-600">
                  I agree to the{" "}
                  <Link href="/terms-and-conditions" className="font-semibold text-[#2D4CC8] hover:underline">
                    Reseller Agreement
                  </Link>{" "}
                  and partner program terms.
                </span>
              </IconToggle>
              <IconToggle
                checked={form.commissionPolicy}
                onToggle={() => updateField("commissionPolicy", !form.commissionPolicy)}
              >
                <span className="text-sm leading-relaxed text-slate-600">
                  I accept the CompareX commission policy, payout schedule, and referral tracking
                  guidelines.
                </span>
              </IconToggle>
            </div>
            <div className="rounded-2xl border border-[#2D4CC8]/20 bg-[#EEF2FC] p-4 text-sm text-slate-600">
              After submission, our compliance team will verify your KYC documents and approve your
              reseller account within 2–3 business days.
            </div>
          </>
        ) : null}

        <div className="flex items-center justify-end gap-3 pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#2D4CC8]/40 hover:text-[#13203F]"
            >
              <HiArrowLeft className="size-4" aria-hidden />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext()}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <HiArrowRight className="size-4" aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canGoNext() || isSubmitting}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
              <HiCheck className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function ApplyAsResellerFormPage() {
  return (
    <MarketingPageShell>
      <section className="bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#e0f2fe] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="inline-flex rounded-full border border-blue-200 bg-white/90 px-4 py-1.5 text-xs font-semibold tracking-tight text-blue-700 shadow-sm">
              CompareX Reseller Program
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#13203F] sm:text-4xl">
              Reseller Registration Flow
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Complete all four steps to apply as a CompareX reseller partner.
            </p>
          </div>
          <ResellerRegistrationForm />
        </div>
      </section>
    </MarketingPageShell>
  );
}
