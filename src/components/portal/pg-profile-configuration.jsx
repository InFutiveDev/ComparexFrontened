"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  fetchMyPaymentProfile,
  updateMyPgConfiguration,
  updateMyPgProfile,
  uploadPgOnboardingFile,
} from "@/lib/payment";
import {
  FEATURE_REPO,
  ONBOARDING_TAT_OPTIONS,
  SETTLEMENT_CYCLE_OPTIONS,
  getFeaturesForServiceType,
} from "@/lib/pg-onboarding-config";
import { sanitizePhoneInput, validateMobilePhone } from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";
const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

const emptyProfile = {
  companyName: "",
  brandName: "",
  legalEntityName: "",
  companyOverview: "",
  contactPerson: "",
  designation: "",
  email: "",
  phone: "",
  website: "",
  companyLogo: null,
};

const emptyConfig = {
  upiMdr: "",
  creditCardMdr: "",
  debitCardMdr: "",
  internationalMdr: "",
  walletCharges: "",
  netBankingCharges: "",
  emiBnplCharges: "",
  onboardingTat: "",
  settlementCycle: "",
  refundSla: "",
  features: [],
  suggestNewFeature: "",
};

const mdrFields = [
  ["upiMdr", "UPI MDR"],
  ["creditCardMdr", "Credit Card MDR"],
  ["debitCardMdr", "Debit Card MDR"],
  ["internationalMdr", "International MDR"],
  ["walletCharges", "Wallet Charges"],
  ["netBankingCharges", "Net Banking Charges"],
  ["emiBnplCharges", "EMI / BNPL Charges"],
];

function normalizeGateway(gateway) {
  const onboarding = gateway?.onboarding || {};
  return {
    profile: {
      companyName: gateway?.companyName || "",
      brandName: onboarding.brandName || gateway?.companyName || "",
      legalEntityName: onboarding.legalEntityName || gateway?.companyName || "",
      companyOverview: onboarding.companyOverview || "",
      contactPerson: gateway?.contactPerson || "",
      designation: gateway?.designation || "",
      email: gateway?.email || "",
      phone: gateway?.phone || "",
      website: gateway?.website || onboarding.websiteUrl || "",
      companyLogo: onboarding.companyLogo || null,
    },
    config: {
      ...emptyConfig,
      ...Object.fromEntries(
        Object.keys(emptyConfig).map((key) => [key, onboarding[key] ?? emptyConfig[key]]),
      ),
      features: Array.isArray(onboarding.features) ? onboarding.features : [],
    },
    serviceType: onboarding.serviceType || "",
    verificationStatus: gateway?.verificationStatus || "incomplete",
  };
}

export function PgProfileConfiguration() {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(emptyProfile);
  const [config, setConfig] = useState(emptyConfig);
  const [serviceType, setServiceType] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("incomplete");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const availableFeatures = useMemo(() => {
    const serviceFeatures = getFeaturesForServiceType(serviceType);
    if (serviceFeatures.length) return serviceFeatures;
    return [
      ...new Set(
        Object.values(FEATURE_REPO).flatMap((group) => group.features || []),
      ),
    ];
  }, [serviceType]);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyPaymentProfile();
      const normalized = normalizeGateway(data.paymentGateway);
      setProfile(normalized.profile);
      setConfig(normalized.config);
      setServiceType(normalized.serviceType);
      setVerificationStatus(normalized.verificationStatus);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load PG profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function updateProfile(key, value) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function updateConfig(key, value) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(file) {
    if (!file) return;
    setIsUploading(true);
    setError("");
    try {
      const uploaded = await uploadPgOnboardingFile(file, "pg-profile/logos");
      updateProfile("companyLogo", uploaded);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to upload company logo");
    } finally {
      setIsUploading(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    const phoneError = validateMobilePhone(profile.phone);
    if (phoneError) {
      setError(phoneError);
      setIsSaving(false);
      return;
    }

    try {
      const data = await updateMyPgProfile({
        companyName: profile.companyName,
        contactPerson: profile.contactPerson,
        designation: profile.designation,
        email: profile.email,
        phone: profile.phone,
        website: profile.website,
        onboarding: {
          brandName: profile.brandName,
          legalEntityName: profile.legalEntityName,
          companyOverview: profile.companyOverview,
          websiteUrl: profile.website,
          companyLogo: profile.companyLogo,
        },
      });
      const normalized = normalizeGateway(data.paymentGateway);
      setProfile(normalized.profile);
      setMessage(data.message || "PG profile updated");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update PG profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveConfiguration(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await updateMyPgConfiguration(config);
      const normalized = normalizeGateway(data.paymentGateway);
      setConfig(normalized.config);
      setMessage(data.message || "PG configuration updated");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update PG configuration");
    } finally {
      setIsSaving(false);
    }
  }

  function toggleFeature(feature) {
    setConfig((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((item) => item !== feature)
        : [...prev.features, feature],
    }));
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
        Loading profile and configuration…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Profile & Configuration Management
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage your public PG profile, commercial rates, operational TAT, and supported
          product features.
        </p>
        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
          Verification: {verificationStatus.replaceAll("_", " ")}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("profile")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "profile"
              ? "bg-[#2D4CC8] text-white"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
          style={tab === "profile" ? { color: "#fff" } : undefined}
        >
          PG Profile · FR-PG-01
        </button>
        <button
          type="button"
          onClick={() => setTab("configuration")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "configuration"
              ? "bg-[#2D4CC8] text-white"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
          style={tab === "configuration" ? { color: "#fff" } : undefined}
        >
          MDR, TAT & Features · FR-PG-02
        </button>
      </div>

      {(error || message) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      {tab === "profile" ? (
        <form
          onSubmit={saveProfile}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div>
            <h3 className="text-lg font-bold text-[#13203F]">PG profile</h3>
            <p className="mt-1 text-sm text-slate-600">
              These details identify your payment gateway throughout CompareX.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Company name *</label>
              <input
                required
                className={inputClass}
                value={profile.companyName}
                onChange={(e) => updateProfile("companyName", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Brand name</label>
              <input
                className={inputClass}
                value={profile.brandName}
                onChange={(e) => updateProfile("brandName", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Legal entity name</label>
              <input
                className={inputClass}
                value={profile.legalEntityName}
                onChange={(e) => updateProfile("legalEntityName", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input
                type="url"
                className={inputClass}
                value={profile.website}
                onChange={(e) => updateProfile("website", e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Company logo</label>
            <div className="flex flex-wrap items-center gap-3">
              {profile.companyLogo?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.companyLogo.url}
                  alt="Current company logo"
                  className="size-16 rounded-xl border border-slate-200 bg-white object-contain p-2"
                />
              ) : null}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                disabled={isUploading}
                onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                className="block text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#EEF2FC] file:px-4 file:py-2 file:font-semibold file:text-[#2D4CC8]"
              />
              {isUploading ? <span className="text-xs text-slate-500">Uploading…</span> : null}
            </div>
          </div>

          <div>
            <label className={labelClass}>Company description</label>
            <textarea
              rows={4}
              className={`${inputClass} resize-y`}
              value={profile.companyOverview}
              onChange={(e) => updateProfile("companyOverview", e.target.value)}
              placeholder="Describe your payment gateway, strengths, and merchant offering."
            />
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h4 className="font-bold text-[#13203F]">Primary contact</h4>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Contact person *</label>
                <input
                  required
                  className={inputClass}
                  value={profile.contactPerson}
                  onChange={(e) => updateProfile("contactPerson", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Designation</label>
                <input
                  className={inputClass}
                  value={profile.designation}
                  onChange={(e) => updateProfile("designation", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input
                  required
                  type="email"
                  className={inputClass}
                  value={profile.email}
                  onChange={(e) => updateProfile("email", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Phone *</label>
                <input
                  required
                  inputMode="numeric"
                  maxLength={11}
                  className={inputClass}
                  value={profile.phone}
                  onChange={(e) =>
                    updateProfile("phone", sanitizePhoneInput(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSaving ? "Saving…" : "Save PG profile"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={saveConfiguration}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div>
            <h3 className="text-lg font-bold text-[#13203F]">MDR & commercials</h3>
            <p className="mt-1 text-sm text-slate-600">
              Enter merchant-facing rates, such as 1.8% or ₹5 per transaction.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mdrFields.map(([key, label]) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  className={inputClass}
                  value={config[key]}
                  onChange={(e) => updateConfig(key, e.target.value)}
                  placeholder="e.g. 1.8% or ₹5"
                />
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-lg font-bold text-[#13203F]">TAT & operations</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Onboarding TAT</label>
                <select
                  className={inputClass}
                  value={config.onboardingTat}
                  onChange={(e) => updateConfig("onboardingTat", e.target.value)}
                >
                  <option value="">Choose TAT…</option>
                  {ONBOARDING_TAT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Settlement cycle</label>
                <select
                  className={inputClass}
                  value={config.settlementCycle}
                  onChange={(e) => updateConfig("settlementCycle", e.target.value)}
                >
                  <option value="">Choose cycle…</option>
                  {SETTLEMENT_CYCLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Refund SLA</label>
                <input
                  className={inputClass}
                  value={config.refundSla}
                  onChange={(e) => updateConfig("refundSla", e.target.value)}
                  placeholder="e.g. 5–7 business days"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-lg font-bold text-[#13203F]">Supported features</h3>
            <p className="mt-1 text-sm text-slate-600">
              Select the payment and platform capabilities currently supported by your PG.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  className="inline-flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#13203F]"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={config.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                  {feature}
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className={labelClass}>Suggest another feature</label>
              <input
                className={inputClass}
                value={config.suggestNewFeature}
                onChange={(e) => updateConfig("suggestNewFeature", e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSaving ? "Saving…" : "Save configuration"}
          </button>
        </form>
      )}
    </div>
  );
}
