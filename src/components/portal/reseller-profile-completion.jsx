"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import {
  fetchMyResellerProfile,
  updateMyResellerProfile,
  uploadResellerKycFile,
} from "@/lib/reseller";
import {
  BANK_ACCOUNT_TYPE_OPTIONS,
  formatKycStatusLabel,
  formatVerificationLabel,
  MERCHANT_NETWORK_OPTIONS,
  MONTHLY_REFERRAL_OPTIONS,
  PARTNERSHIP_MODEL_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
} from "@/lib/reseller-profile-options";
import { StatusBadge, kycStatusTone } from "@/lib/reseller-finance-ui";

const STEPS = [
  { id: "business", label: "Business details" },
  { id: "kyc", label: "KYC details" },
  { id: "agreements", label: "Agreements" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-600";
const optionalMark = <span className="font-normal text-slate-400"> (Optional)</span>;

function SelectedCheckIcon() {
  return (
    <Image src="/images/icon-1.svg" alt="" width={20} height={20} className="shrink-0" aria-hidden />
  );
}

function EmptyCheckIcon() {
  return <span className="size-5 shrink-0 rounded-md border border-slate-300 bg-white" aria-hidden />;
}

function OptionToggle({ options, value, onChange }) {
  return (
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
                : "border-gray-300 bg-white text-slate-600 hover:border-[#2D4CC8]/60"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function PartnershipToggle({ value, onChange }) {
  return (
    <div className="inline-flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:w-auto sm:flex-row">
      {PARTNERSHIP_MODEL_OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition ${
              selected
                ? "bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-white shadow-sm"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function ProfileCompletionBanner({ percent, verificationStatus, kycStatus, profile, checks }) {
  const displayKycStatus = kycStatus || profile?.kycStatus || "incomplete";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D4CC8]">
            Profile completion
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#13203F]">{percent}% completed</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-sm text-slate-600">
              Account: {formatVerificationLabel(verificationStatus)}
            </p>
            <StatusBadge
              label={`KYC: ${formatKycStatusLabel(displayKycStatus)}`}
              tone={kycStatusTone(displayKycStatus)}
            />
          </div>
          {profile?.panCard ? (
            <p className="mt-2 text-xs text-slate-500">
              FR-RS-09 · PAN/Aadhaar submitted via{" "}
              {profile.kycVerificationProvider === "document_upload"
                ? "document upload"
                : profile.kycVerificationProvider || "document upload"}
              {profile.kycSubmittedAt
                ? ` · ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                    new Date(profile.kycSubmittedAt),
                  )}`
                : ""}
            </p>
          ) : null}
        </div>
        <div className="h-3 w-full max-w-xs overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#25a36f] transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      {checks?.length ? (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {checks.map((item) => (
            <li
              key={item.key}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                item.complete ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"
              }`}
            >
              {item.complete ? <HiCheck className="size-4 shrink-0" /> : <EmptyCheckIcon />}
              <span>
                {item.label}
                {!item.required ? " (O)" : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function getInitialStep(reseller) {
  if (!reseller?.partnershipModel || !reseller?.cityState || !reseller?.yearsExperience) {
    return 0;
  }
  if (
    !reseller?.panCard ||
    !reseller?.aadhaarId ||
    !reseller?.bankAccountNumber ||
    !reseller?.bankProof
  ) {
    return 1;
  }
  if (!reseller?.resellerAgreement || !reseller?.commissionPolicy) {
    return 2;
  }
  return 2;
}

export function ResellerProfileCompletion() {
  const [profile, setProfile] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingSection, setSavingSection] = useState("");
  const [uploading, setUploading] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [business, setBusiness] = useState({
    partnershipModel: "",
    cityState: "",
    yearsExperience: "",
    merchantNetworkSize: "",
    monthlyReferrals: "",
  });

  const [kyc, setKyc] = useState({
    panCard: "",
    aadhaarId: "",
    gstCertificate: null,
    bankAccountHolderName: "",
    bankName: "",
    bankAccountNumber: "",
    confirmBankAccountNumber: "",
    bankIfsc: "",
    bankBranch: "",
    bankAccountType: "",
    bankProof: null,
  });

  const [agreements, setAgreements] = useState({
    resellerAgreement: false,
    commissionPolicy: false,
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyResellerProfile();
      const reseller = data.reseller;
      setProfile(reseller);
      setStepIndex(getInitialStep(reseller));
      setSubmitted(Boolean(reseller.profileCompletion?.requiredComplete));
      setBusiness({
        partnershipModel: reseller.partnershipModel || "",
        cityState: reseller.cityState || "",
        yearsExperience: reseller.yearsExperience || "",
        merchantNetworkSize: reseller.merchantNetworkSize || "",
        monthlyReferrals: reseller.monthlyReferrals || "",
      });
      setKyc({
        panCard: reseller.panCard || "",
        aadhaarId: reseller.aadhaarId || "",
        gstCertificate: reseller.gstCertificate || null,
        bankAccountHolderName: reseller.bankAccountHolderName || "",
        bankName: reseller.bankName || "",
        bankAccountNumber: reseller.bankAccountNumber || "",
        confirmBankAccountNumber: reseller.bankAccountNumber || "",
        bankIfsc: reseller.bankIfsc || "",
        bankBranch: reseller.bankBranch || "",
        bankAccountType: reseller.bankAccountType || "",
        bankProof: reseller.bankProof || null,
      });
      setAgreements({
        resellerAgreement: Boolean(reseller.resellerAgreement),
        commissionPolicy: Boolean(reseller.commissionPolicy),
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function saveSection(section, payload, { advance = true } = {}) {
    setSavingSection(section);
    setError("");
    setSuccess("");
    try {
      const data = await updateMyResellerProfile({ section, ...payload });
      setProfile(data.reseller);

      if (data.reseller?.profileCompletion?.requiredComplete) {
        setSubmitted(true);
        setSuccess(data.message || "Profile submitted for admin verification");
        return true;
      }

      if (advance) {
        setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
        setSuccess("Saved. Continue with the next step.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSuccess(data.message || "Saved successfully");
      }
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save section");
      return false;
    } finally {
      setSavingSection("");
    }
  }

  async function handleFileUpload(field, file) {
    if (!file) return;
    setUploading(field);
    setError("");
    try {
      const uploaded = await uploadResellerKycFile(file);
      setKyc((prev) => ({ ...prev, [field]: uploaded }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to upload file");
    } finally {
      setUploading("");
    }
  }

  const locked = profile?.verificationStatus === "approved";
  const currentStep = STEPS[stepIndex];
  const progressWidth = `${((stepIndex + 1) / STEPS.length) * 100}%`;

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading your profile...</p>;
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "Reseller profile not found"}
      </div>
    );
  }

  if (submitted || locked) {
    return (
      <div className="space-y-5">
        <ProfileCompletionBanner
          percent={profile.profileCompletionPercent ?? 0}
          verificationStatus={profile.verificationStatus}
          kycStatus={profile.kycStatus}
          profile={profile}
          checks={profile.profileCompletion?.checks}
        />
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h3 className="text-lg font-bold text-emerald-900">
            {locked ? "Profile approved" : "Registration submitted"}
          </h3>
          <p className="mt-2 text-sm text-emerald-800">
            {locked
              ? "Your reseller profile has been approved by admin."
              : "Your profile is with CompareX admin for final verification. You can track status from the dashboard overview."}
          </p>
          <Link
            href="/reseller-dashboard"
            className="mt-4 inline-flex rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ProfileCompletionBanner
        percent={profile.profileCompletionPercent ?? 0}
        verificationStatus={profile.verificationStatus}
        kycStatus={profile.kycStatus}
        profile={profile}
        checks={profile.profileCompletion?.checks}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <span className="text-[#13203F]">{currentStep.label}</span>
        </div>
        <div className="mb-5 h-1 overflow-hidden rounded-full bg-[#2D4CC8]/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] transition-all duration-300"
            style={{ width: progressWidth }}
          />
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        {currentStep.id === "business" ? (
          <div className="space-y-4">
            <div>
              <p className={labelClass}>Preferred Partnership Model *</p>
              <PartnershipToggle
                value={business.partnershipModel}
                onChange={(value) => setBusiness((prev) => ({ ...prev, partnershipModel: value }))}
              />
            </div>
            <div>
              <label htmlFor="city-state" className={labelClass}>
                City & State *
              </label>
              <input
                id="city-state"
                className={inputClass}
                value={business.cityState}
                onChange={(e) => setBusiness((prev) => ({ ...prev, cityState: e.target.value }))}
                placeholder="e.g. Mumbai, Maharashtra"
              />
            </div>
            <div>
              <p className={labelClass}>Years of Experience *</p>
              <OptionToggle
                options={YEARS_EXPERIENCE_OPTIONS}
                value={business.yearsExperience}
                onChange={(value) => setBusiness((prev) => ({ ...prev, yearsExperience: value }))}
              />
            </div>
            <div>
              <p className={labelClass}>Existing Merchant Network Size{optionalMark}</p>
              <OptionToggle
                options={MERCHANT_NETWORK_OPTIONS}
                value={business.merchantNetworkSize}
                onChange={(value) =>
                  setBusiness((prev) => ({ ...prev, merchantNetworkSize: value }))
                }
              />
            </div>
            <div>
              <p className={labelClass}>Estimated Monthly Referrals{optionalMark}</p>
              <OptionToggle
                options={MONTHLY_REFERRAL_OPTIONS}
                value={business.monthlyReferrals}
                onChange={(value) => setBusiness((prev) => ({ ...prev, monthlyReferrals: value }))}
              />
            </div>
          </div>
        ) : null}

        {currentStep.id === "kyc" ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pan-card" className={labelClass}>
                  PAN Card *
                </label>
                <input
                  id="pan-card"
                  className={inputClass}
                  value={kyc.panCard}
                  onChange={(e) =>
                    setKyc((prev) => ({ ...prev, panCard: e.target.value.toUpperCase() }))
                  }
                  placeholder="ABCDE1234F"
                />
              </div>
              <div>
                <label htmlFor="aadhaar-id" className={labelClass}>
                  Aadhaar / Govt ID *
                </label>
                <input
                  id="aadhaar-id"
                  className={inputClass}
                  value={kyc.aadhaarId}
                  onChange={(e) => setKyc((prev) => ({ ...prev, aadhaarId: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label htmlFor="gst-certificate" className={labelClass}>
                GST Certificate{optionalMark}
              </label>
              <input
                id="gst-certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                disabled={Boolean(uploading)}
                onChange={(e) => handleFileUpload("gstCertificate", e.target.files?.[0])}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#EEF2FC] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#2D4CC8]"
              />
              {kyc.gstCertificate?.fileName ? (
                <p className="mt-1 text-xs text-slate-500">
                  Uploaded: {kyc.gstCertificate.fileName}
                </p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="bank-holder" className={labelClass}>
                  Account Holder Name *
                </label>
                <input
                  id="bank-holder"
                  className={inputClass}
                  value={kyc.bankAccountHolderName}
                  onChange={(e) =>
                    setKyc((prev) => ({ ...prev, bankAccountHolderName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="bank-name" className={labelClass}>
                  Bank Name *
                </label>
                <input
                  id="bank-name"
                  className={inputClass}
                  value={kyc.bankName}
                  onChange={(e) => setKyc((prev) => ({ ...prev, bankName: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="bank-account" className={labelClass}>
                  Account Number *
                </label>
                <input
                  id="bank-account"
                  className={inputClass}
                  value={kyc.bankAccountNumber}
                  onChange={(e) =>
                    setKyc((prev) => ({ ...prev, bankAccountNumber: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="bank-account-confirm" className={labelClass}>
                  Confirm Account Number *
                </label>
                <input
                  id="bank-account-confirm"
                  className={inputClass}
                  value={kyc.confirmBankAccountNumber}
                  onChange={(e) =>
                    setKyc((prev) => ({ ...prev, confirmBankAccountNumber: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="bank-ifsc" className={labelClass}>
                  IFSC *
                </label>
                <input
                  id="bank-ifsc"
                  className={inputClass}
                  value={kyc.bankIfsc}
                  onChange={(e) =>
                    setKyc((prev) => ({ ...prev, bankIfsc: e.target.value.toUpperCase() }))
                  }
                />
              </div>
              <div>
                <label htmlFor="bank-branch" className={labelClass}>
                  Branch{optionalMark}
                </label>
                <input
                  id="bank-branch"
                  className={inputClass}
                  value={kyc.bankBranch}
                  onChange={(e) => setKyc((prev) => ({ ...prev, bankBranch: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <p className={labelClass}>Account Type *</p>
              <OptionToggle
                options={BANK_ACCOUNT_TYPE_OPTIONS}
                value={kyc.bankAccountType}
                onChange={(value) => setKyc((prev) => ({ ...prev, bankAccountType: value }))}
              />
            </div>
            <div>
              <label htmlFor="bank-proof" className={labelClass}>
                Cancelled Cheque / Bank Proof *
              </label>
              <input
                id="bank-proof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                disabled={Boolean(uploading)}
                onChange={(e) => handleFileUpload("bankProof", e.target.files?.[0])}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#EEF2FC] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#2D4CC8]"
              />
              {kyc.bankProof?.fileName ? (
                <p className="mt-1 text-xs text-slate-500">Uploaded: {kyc.bankProof.fileName}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {currentStep.id === "agreements" ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() =>
                setAgreements((prev) => ({
                  ...prev,
                  resellerAgreement: !prev.resellerAgreement,
                }))
              }
              className="flex w-full cursor-pointer items-start gap-3 text-left"
            >
              {agreements.resellerAgreement ? <SelectedCheckIcon /> : <EmptyCheckIcon />}
              <span className="text-sm text-slate-700">
                I agree to the CompareX Reseller Agreement *
              </span>
            </button>
            <button
              type="button"
              onClick={() =>
                setAgreements((prev) => ({
                  ...prev,
                  commissionPolicy: !prev.commissionPolicy,
                }))
              }
              className="flex w-full cursor-pointer items-start gap-3 text-left"
            >
              {agreements.commissionPolicy ? <SelectedCheckIcon /> : <EmptyCheckIcon />}
              <span className="text-sm text-slate-700">I accept the Commission Policy *</span>
            </button>
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Final verification & approval is completed by CompareX admin after you submit.
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setStepIndex((current) => Math.max(current - 1, 0));
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600"
            >
              <HiArrowLeft className="size-4" aria-hidden />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep.id === "business" ? (
            <button
              type="button"
              disabled={savingSection === "business"}
              onClick={() => saveSection("business", business)}
              className="inline-flex items-center gap-2 rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {savingSection === "business" ? "Saving..." : "Save & continue"}
              <HiArrowRight className="size-4" aria-hidden />
            </button>
          ) : null}

          {currentStep.id === "kyc" ? (
            <button
              type="button"
              disabled={savingSection === "kyc" || Boolean(uploading)}
              onClick={() =>
                saveSection("kyc", {
                  panCard: kyc.panCard,
                  aadhaarId: kyc.aadhaarId,
                  gstCertificate: kyc.gstCertificate,
                  bankAccountHolderName: kyc.bankAccountHolderName,
                  bankName: kyc.bankName,
                  bankAccountNumber: kyc.bankAccountNumber,
                  confirmBankAccountNumber: kyc.confirmBankAccountNumber,
                  bankIfsc: kyc.bankIfsc,
                  bankBranch: kyc.bankBranch,
                  bankAccountType: kyc.bankAccountType,
                  bankProof: kyc.bankProof,
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {savingSection === "kyc" ? "Saving..." : "Save & continue"}
              <HiArrowRight className="size-4" aria-hidden />
            </button>
          ) : null}

          {currentStep.id === "agreements" ? (
            <button
              type="button"
              disabled={savingSection === "agreements"}
              onClick={() => saveSection("agreements", agreements)}
              className="inline-flex items-center gap-2 rounded-full bg-[#25a36f] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {savingSection === "agreements" ? "Submitting..." : "Submit for verification"}
              <HiCheck className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ResellerProfileCompletionSummary({ profile }) {
  if (!profile) return null;

  return (
    <ProfileCompletionBanner
      percent={profile.profileCompletionPercent ?? 0}
      verificationStatus={profile.verificationStatus}
      kycStatus={profile.kycStatus}
      profile={profile}
      checks={profile.profileCompletion?.checks}
    />
  );
}
