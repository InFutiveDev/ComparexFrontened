"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { fetchMyPaymentProfile, updateMyPgProfile, uploadPgOnboardingFile } from "@/lib/payment";
import { sanitizePhoneInput, validateMobilePhone } from "@/lib/validation";
import { OnboardingForm } from "@/components/portal/onboarding-form";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";
const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

const FR_PG_01_STEPS = ["features", "talk-to-expert", "technical"];
const FR_PG_02_STEPS = [
  "service-type",
  "company",
  "pricing",
  "operations",
  "smart-tags",
  "sort-by",
  "merchant-experience",
];

const emptyProfile = {
  companyName: "",
  contactPerson: "",
  designation: "",
  email: "",
  phone: "",
  website: "",
  companyLogo: null,
  offersPromotions: "",
};

function profileFromGateway(gateway) {
  const onboarding = gateway?.onboarding || {};
  return {
    companyName: gateway?.companyName || "",
    contactPerson: gateway?.contactPerson || "",
    designation: gateway?.designation || "",
    email: gateway?.email || "",
    phone: gateway?.phone || "",
    website: gateway?.website || onboarding.websiteUrl || "",
    companyLogo: onboarding.companyLogo || null,
    offersPromotions: onboarding.offersPromotions || "",
  };
}

export function PgProfileConfiguration() {
  const [tab, setTab] = useState("fr-pg-01");
  const [profile, setProfile] = useState(emptyProfile);
  const [onboardingInitial, setOnboardingInitial] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("incomplete");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyPaymentProfile();
      const gateway = data.paymentGateway;
      setProfile(profileFromGateway(gateway));
      setOnboardingInitial(gateway?.onboarding || {});
      setVerificationStatus(gateway?.verificationStatus || "incomplete");
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

  function applyGateway(gateway) {
    if (!gateway) return;
    setProfile(profileFromGateway(gateway));
    setOnboardingInitial(gateway.onboarding || {});
    setVerificationStatus(gateway.verificationStatus || "incomplete");
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

  async function saveFrPg01Profile(event) {
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
          websiteUrl: profile.website,
          companyLogo: profile.companyLogo,
          offersPromotions: profile.offersPromotions,
        },
      });
      applyGateway(data.paymentGateway);
      setMessage(data.message || "FR-PG-01 profile updated");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
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
          FR-PG-01 covers identity, offers, product features, talk to expert, and technical
          integration. FR-PG-02 covers MDR, operations, tags, and merchant experience fields.
        </p>
        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
          Verification: {verificationStatus.replaceAll("_", " ")}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("fr-pg-01")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "fr-pg-01"
              ? "bg-[#2D4CC8] text-white"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
          style={tab === "fr-pg-01" ? { color: "#fff" } : undefined}
        >
          PG Profile · FR-PG-01
        </button>
        <button
          type="button"
          onClick={() => setTab("fr-pg-02")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "fr-pg-02"
              ? "bg-[#2D4CC8] text-white"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
          style={tab === "fr-pg-02" ? { color: "#fff" } : undefined}
        >
          MDR, TAT & Operations · FR-PG-02
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

      {tab === "fr-pg-01" ? (
        <div className="space-y-5">
          <form
            onSubmit={saveFrPg01Profile}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div>
              <h3 className="text-lg font-bold text-[#13203F]">Identity & contact · FR-PG-01</h3>
              <p className="mt-1 text-sm text-slate-600">
                Company identity and primary contact shown across CompareX.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Company / PG name *</label>
                <input
                  required
                  className={inputClass}
                  value={profile.companyName}
                  onChange={(e) => updateProfile("companyName", e.target.value)}
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
                {isUploading ? (
                  <span className="text-xs text-slate-500">Uploading…</span>
                ) : null}
              </div>
            </div>

            <div>
              <label className={labelClass}>Offers / promotions</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                value={profile.offersPromotions}
                onChange={(e) => updateProfile("offersPromotions", e.target.value)}
                placeholder="Describe current merchant offers, promo codes, or seasonal campaigns."
              />
            </div>

            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ color: "#fff" }}
            >
              {isSaving ? "Saving…" : "Save identity & offers"}
            </button>
          </form>

          {onboardingInitial ? (
            <OnboardingForm
              variant="management"
              open
              initialData={onboardingInitial}
              managementStepIds={FR_PG_01_STEPS}
              managementSaveSection="profile"
              accountProfile={{
                companyName: profile.companyName,
                contactPerson: profile.contactPerson,
                designation: profile.designation,
                email: profile.email,
                phone: profile.phone,
                website: profile.website,
              }}
              onSaved={(_saved, gateway) => {
                if (gateway) {
                  applyGateway(gateway);
                  setMessage("FR-PG-01 fields saved (features, talk to expert, technical)");
                  setError("");
                }
              }}
            />
          ) : null}

          <p className="text-xs text-slate-500">
            For multiple internal advisors and Calendly routing (FR-PG-06 / FR-PG-07), use{" "}
            <span className="font-semibold text-slate-600">Expert Routing</span> in the sidebar.
          </p>
        </div>
      ) : onboardingInitial ? (
        <OnboardingForm
          variant="management"
          open
          initialData={onboardingInitial}
          managementStepIds={FR_PG_02_STEPS}
          managementSaveSection="management"
          onSaved={(_saved, gateway) => {
            if (gateway) {
              applyGateway(gateway);
              setMessage("FR-PG-02 configuration saved");
              setError("");
            }
          }}
        />
      ) : null}
    </div>
  );
}
