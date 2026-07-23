"use client";

import { useCallback, useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { OnboardingForm } from "@/components/portal/onboarding-form";
import { PgRatingSummary } from "@/components/shared/pg-rating-summary";
import { ApiError } from "@/lib/api";
import { fetchMyPaymentProfile } from "@/lib/payment";
import {
  ONBOARDING_TAT_OPTIONS,
  PCI_DSS_OPTIONS,
  RBI_PAPG_OPTIONS,
  SERVICE_TYPES,
  SETTLEMENT_CYCLE_OPTIONS,
  SMART_TAG_OPTIONS,
  SORT_BY_OPTIONS,
  isFieldVisible,
} from "@/lib/pg-onboarding-config";
import {
  loadPgOnboardingProfile,
  savePgOnboardingProfile,
} from "@/lib/pg-onboarding-storage";

function LabelValue({ label, value }) {
  const display =
    value === true
      ? "Yes"
      : value === false
        ? "No"
        : Array.isArray(value)
          ? value.length
            ? value.join(", ")
            : "—"
          : value || "—";

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#13203F]">{display}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-base font-bold text-[#13203F] sm:text-lg">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function optionLabel(options, value) {
  if (!value) return "—";
  const found = options.find((item) =>
    typeof item === "string" ? item === value : item.value === value
  );
  if (!found) return value;
  return typeof found === "string" ? found : found.label;
}

function show(profile, key) {
  return isFieldVisible(profile?.serviceType, key);
}

function hasOnboardingContent(profile) {
  if (!profile) return false;
  return Boolean(
    profile.serviceType ||
      profile.legalEntityName ||
      profile.brandName ||
      profile.websiteUrl ||
      profile.companyOverview
  );
}

function statusStyles(status) {
  const map = {
    incomplete: "bg-slate-100 text-slate-700 ring-slate-200",
    pending_review: "bg-amber-50 text-amber-700 ring-amber-200",
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
  };
  return map[status] || map.incomplete;
}

export function PgProviderProfile() {
  const [profile, setProfile] = useState(null);
  const [gateway, setGateway] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const applyGateway = useCallback((paymentGateway) => {
    if (!paymentGateway) {
      setGateway(null);
      setProfile(null);
      return;
    }

    setGateway(paymentGateway);
    const onboarding = {
      ...(paymentGateway.onboarding || {}),
      companyName: paymentGateway.companyName,
      contactPerson: paymentGateway.contactPerson,
      email: paymentGateway.email,
      phone: paymentGateway.phone,
      websiteUrl:
        paymentGateway.onboarding?.websiteUrl || paymentGateway.website || "",
      brandName:
        paymentGateway.onboarding?.brandName || paymentGateway.companyName || "",
      legalEntityName:
        paymentGateway.onboarding?.legalEntityName ||
        paymentGateway.companyName ||
        "",
      verificationStatus: paymentGateway.verificationStatus,
      profileCompletion: paymentGateway.profileCompletion,
    };
    setProfile(onboarding);
    savePgOnboardingProfile(onboarding);
  }, []);

  const loadProfile = useCallback(async () => {
    setLoadError("");
    try {
      const data = await fetchMyPaymentProfile();
      applyGateway(data.paymentGateway);
    } catch (err) {
      const cached = loadPgOnboardingProfile();
      if (cached) {
        setProfile(cached);
      }
      setLoadError(
        err instanceof ApiError ? err.message : "Failed to load onboarding profile"
      );
    } finally {
      setLoaded(true);
    }
  }, [applyGateway]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const serviceType =
    SERVICE_TYPES.find((item) => item.value === profile?.serviceType) || null;

  const selectedTags = SMART_TAG_OPTIONS.filter((tag) =>
    (profile?.smartTags || []).includes(tag.value)
  );

  const sortByLabels = (profile?.sortByCategories || []).map((value) =>
    optionLabel(SORT_BY_OPTIONS, value)
  );

  const completion = gateway?.profileCompletion || profile?.profileCompletion;
  const verificationStatus =
    gateway?.verificationStatus || profile?.verificationStatus || "incomplete";
  const isApproved = verificationStatus === "approved";
  const showProfile = hasOnboardingContent(profile);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
            Complete Profile
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Finish your onboarding form so merchants can discover your payment solution.
          </p>
        </div>
        {!isApproved ? (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
            style={{ color: "#fff" }}
          >
            <HiPencilSquare className="size-4" aria-hidden />
            {showProfile ? "Edit Onboarding" : "Start Onboarding"}
          </button>
        ) : null}
      </div>

      {completion ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Profile completion
              </p>
              <p className="mt-1 text-2xl font-bold text-[#13203F]">
                {completion.percent ?? 0}%
              </p>
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusStyles(
                verificationStatus
              )}`}
            >
              {String(verificationStatus).replaceAll("_", " ")}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF]"
              style={{ width: `${completion.percent ?? 0}%` }}
            />
          </div>
        </div>
      ) : null}

      {gateway ? (
        <Section title="Merchant ratings">
          <PgRatingSummary rating={gateway.rating} showReviews />
        </Section>
      ) : null}

      {loadError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadError}
        </div>
      ) : null}

      {!loaded ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading profile...</p>
        </div>
      ) : !showProfile ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <h3 className="text-lg font-bold text-[#13203F]">Profile not completed yet</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            Complete the onboarding form to publish your service type, commercials, smart tags,
            and integration details.
          </p>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="mt-5 inline-flex cursor-pointer rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-6 py-3 text-sm font-semibold text-white"
            style={{ color: "#fff" }}
          >
            Start Onboarding
          </button>
        </div>
      ) : (
        <>
          <Section title="Service Type">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-[#2D4CC8]/20 bg-[#EEF2FC] px-4 py-3">
              <span className="text-2xl" aria-hidden>
                {serviceType?.emoji || "💳"}
              </span>
              <div>
                <p className="text-sm font-bold text-[#13203F]">
                  {serviceType?.label || profile.serviceType}
                </p>
                <p className="text-xs text-slate-500">Primary offering</p>
              </div>
            </div>
          </Section>

          <Section title="Company Information">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <LabelValue label="Legal Entity Name" value={profile.legalEntityName} />
              <LabelValue label="Brand Name" value={profile.brandName} />
              <LabelValue label="Website URL" value={profile.websiteUrl} />
              <div className="sm:col-span-2 lg:col-span-3">
                {profile.companyLogo?.fileName || profile.companyLogo?.url ? (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium text-slate-500">Company Logo</p>
                    <div className="mt-2 flex items-center gap-3">
                      {profile.companyLogo?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.companyLogo.url}
                          alt={profile.companyLogo.fileName || "Company logo"}
                          className="h-14 w-14 rounded-lg border border-slate-200 bg-white object-contain"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#13203F]">
                          {profile.companyLogo.fileName || "Logo uploaded"}
                        </p>
                        {profile.companyLogo.url ? (
                          <a
                            href={profile.companyLogo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-[#2D4CC8] hover:underline"
                          >
                            View file
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <LabelValue label="Company Logo" value="—" />
                )}
              </div>
              <LabelValue
                label="Headquarters"
                value={
                  [profile.headquartersCity, profile.headquartersCountry]
                    .filter(Boolean)
                    .join(", ") || "—"
                }
              />
              <LabelValue label="Year Established" value={profile.yearEstablished} />
              <LabelValue label="Merchant Base Count" value={profile.merchantBaseCount} />
              <LabelValue
                label="RBI / PAPG Status"
                value={optionLabel(RBI_PAPG_OPTIONS, profile.rbiPapgStatus)}
              />
              <LabelValue
                label="PCI DSS Status"
                value={optionLabel(PCI_DSS_OPTIONS, profile.pciDssStatus)}
              />
              <LabelValue label="Countries Supported" value={profile.countriesSupported} />
              <div className="sm:col-span-2 lg:col-span-3">
                <LabelValue label="Company Overview" value={profile.companyOverview} />
              </div>
            </div>
          </Section>

          <Section title="Pricing & Commercials">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {show(profile, "upiMdr") ? (
                <LabelValue label="UPI MDR (%)" value={profile.upiMdr} />
              ) : null}
              {show(profile, "creditCardMdr") ? (
                <LabelValue label="Credit Card MDR (%)" value={profile.creditCardMdr} />
              ) : null}
              {show(profile, "debitCardMdr") ? (
                <LabelValue label="Debit Card MDR (%)" value={profile.debitCardMdr} />
              ) : null}
              {show(profile, "internationalMdr") ? (
                <LabelValue label="International MDR (%)" value={profile.internationalMdr} />
              ) : null}
              {show(profile, "setupFees") ? (
                <LabelValue label="Setup Fees (₹)" value={profile.setupFees} />
              ) : null}
              {show(profile, "amcPlatformFees") ? (
                <LabelValue label="AMC / Platform Fees" value={profile.amcPlatformFees} />
              ) : null}
              {show(profile, "hardwareCost") ? (
                <LabelValue label="Hardware Cost (₹)" value={profile.hardwareCost} />
              ) : null}
              {show(profile, "forexMarkup") ? (
                <LabelValue label="Forex Markup (%)" value={profile.forexMarkup} />
              ) : null}
              {show(profile, "settlementCurrency") ? (
                <LabelValue label="Settlement Currency" value={profile.settlementCurrency} />
              ) : null}
              {show(profile, "perTransactionFee") ? (
                <LabelValue label="Per Transaction Fee (₹)" value={profile.perTransactionFee} />
              ) : null}
              {show(profile, "offersPromotions") ? (
                <div className="sm:col-span-2 lg:col-span-3">
                  <LabelValue label="Offers / Promotions" value={profile.offersPromotions} />
                </div>
              ) : null}
            </div>
          </Section>

          <Section title="Operational & Onboarding">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-3">
                {profile.onboardingChecklist?.fileName || profile.onboardingChecklist?.url ? (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium text-slate-500">Onboarding Checklist</p>
                    <p className="mt-1 truncate text-sm font-semibold text-[#13203F]">
                      {profile.onboardingChecklist.fileName || "Checklist uploaded"}
                    </p>
                    {profile.onboardingChecklist.url ? (
                      <a
                        href={profile.onboardingChecklist.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex text-xs font-semibold text-[#2D4CC8] hover:underline"
                      >
                        View / download
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <LabelValue label="Onboarding Checklist" value="—" />
                )}
              </div>
              <LabelValue
                label="Onboarding TAT"
                value={optionLabel(ONBOARDING_TAT_OPTIONS, profile.onboardingTat)}
              />
              {show(profile, "settlementCycle") ? (
                <LabelValue
                  label="Settlement Cycle"
                  value={optionLabel(SETTLEMENT_CYCLE_OPTIONS, profile.settlementCycle)}
                />
              ) : null}
              <LabelValue
                label="Dedicated Account Manager"
                value={profile.dedicatedAccountManager}
              />
              <LabelValue label="Escalation Support" value={profile.escalationSupport} />
              {show(profile, "instantSettlementAvailability") ? (
                <LabelValue
                  label="Instant Settlement"
                  value={profile.instantSettlementAvailability}
                />
              ) : null}
              {show(profile, "internationalPaymentsSupport") ? (
                <LabelValue
                  label="International Payments"
                  value={profile.internationalPaymentsSupport}
                />
              ) : null}
              <div className="sm:col-span-2 lg:col-span-3">
                <LabelValue
                  label="Best Suited Business Types"
                  value={profile.bestSuitedBusinessTypes}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <LabelValue label="Restricted Categories" value={profile.restrictedCategories} />
              </div>
            </div>
          </Section>

          <Section title="Smart Tags">
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.value}
                    className="inline-flex items-center gap-2 rounded-full border border-[#c7d2fe] bg-[#eef2ff] px-3 py-1.5 text-sm font-medium text-[#13203F]"
                  >
                    <span aria-hidden>{tag.emoji}</span>
                    {tag.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No smart tags selected.</p>
            )}
          </Section>

          <Section title="Sort By Mapping">
            <LabelValue label="Categories" value={sortByLabels} />
          </Section>

          <Section title="Product Features">
            {profile.features?.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-[#2D4CC8]/20 bg-[#EEF2FC] px-3 py-1.5 text-xs font-semibold text-[#2D4CC8]"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No features added.</p>
            )}
          </Section>

          <Section title="Technical Integration">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-3">
                <LabelValue label="API Documentation URL" value={profile.apiDocumentationUrl} />
              </div>
              <LabelValue label="SDK Availability" value={profile.sdkAvailability} />
              <LabelValue label="Plugin Availability" value={profile.pluginAvailability} />
              <LabelValue label="Mobile SDK Support" value={profile.mobileSdkSupport} />
              <LabelValue label="Sandbox Access" value={profile.sandboxAccess} />
              <LabelValue label="Webhook Support" value={profile.webhookSupport} />
            </div>
          </Section>

          <Section title="Talk to Expert">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <LabelValue label="Enabled" value={profile.talkToExpertEnabled} />
              <LabelValue label="Expert Name" value={profile.expertName} />
              <LabelValue label="Expert Designation" value={profile.expertDesignation} />
              <LabelValue label="Expert Email" value={profile.expertEmail} />
              <LabelValue label="Expert Mobile" value={profile.expertMobile} />
              <LabelValue label="Calendar Synced" value={profile.calendarSynced} />
              <LabelValue label="Calendly URL" value={profile.calendlyUrl} />
              <LabelValue label="Availability Slots" value={profile.availabilitySlots} />
              <div className="sm:col-span-2 lg:col-span-3">
                <LabelValue label="Expert Description" value={profile.expertDescription} />
              </div>
            </div>
          </Section>
        </>
      )}

      <OnboardingForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={profile || undefined}
        onSaved={(saved, paymentGateway) => {
          if (paymentGateway) {
            applyGateway(paymentGateway);
          } else {
            setProfile(saved);
          }
        }}
      />
    </div>
  );
}
