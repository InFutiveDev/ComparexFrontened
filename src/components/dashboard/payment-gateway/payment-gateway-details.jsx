"use client";

import { use, useState } from "react";
import {
  HiDocumentText,
  HiGlobeAlt,
  HiTag,
  HiUserCircle,
} from "react-icons/hi2";
import {
  AccountStatusBadge,
  DetailErrorState,
  DetailField,
  DetailHeader,
  DetailLoadingState,
  formatDetailDate,
  formatDetailLabel,
  getInitials,
  InfoCard,
  useDashboardDetail,
} from "@/components/dashboard/shared/record-details";
import { PgRatingSummary } from "@/components/shared/pg-rating-summary";
import {
  fetchPaymentGatewayById,
  updatePaymentOnboardingDocuments,
  updatePaymentVerificationStatus,
} from "@/lib/dashboard-api";
import { pickPaymentGateway } from "@/lib/dashboard-detail-pickers";
import { uploadPgOnboardingFile } from "@/lib/payment";
import { formatVerificationLabel } from "@/lib/reseller-profile-options";
import { ApiError } from "@/lib/api";

function VerificationBadge({ status }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending_review: "bg-amber-50 text-amber-700 ring-amber-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
    incomplete: "bg-slate-50 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${
        styles[status] || styles.incomplete
      }`}
    >
      {formatVerificationLabel(status)}
    </span>
  );
}

function FileLink({ file }) {
  if (!file?.fileName && !file?.url) return "—";
  if (file.url) {
    return (
      <a href={file.url} target="_blank" rel="noreferrer" className="text-[#2D4CC8] hover:underline">
        {file.fileName || "View file"}
      </a>
    );
  }
  return file.fileName;
}

function formatListValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "—";
  }
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function getPgExperts(onboarding = {}) {
  if (Array.isArray(onboarding.experts) && onboarding.experts.length > 0) {
    return onboarding.experts;
  }

  if (!onboarding.expertName) return [];

  return [
    {
      name: onboarding.expertName,
      designation: onboarding.expertDesignation,
      email: onboarding.expertEmail,
      mobile: onboarding.expertMobile,
      calendlyUrl: onboarding.calendlyUrl,
    },
  ];
}

export function PaymentGatewayDetails({ id }) {
  const { data, isLoading, error, reload } = useDashboardDetail(
    id,
    fetchPaymentGatewayById,
    pickPaymentGateway,
  );
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploading, setUploading] = useState("");

  async function handleVerification(status) {
    setIsUpdating(true);
    setActionError("");
    setActionMessage("");
    try {
      const result = await updatePaymentVerificationStatus(id, status);
      setActionMessage(result.message || "Verification updated");
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update verification");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDocUpload(field, file) {
    if (!file) return;
    setUploading(field);
    setActionError("");
    setActionMessage("");
    try {
      const uploaded = await uploadPgOnboardingFile(
        file,
        field === "companyLogo" ? "pg-onboarding/logos" : "pg-onboarding/checklists"
      );
      const result = await updatePaymentOnboardingDocuments(id, { [field]: uploaded });
      setActionMessage(result.message || "Document uploaded");
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to upload document");
    } finally {
      setUploading("");
    }
  }

  if (isLoading) return <DetailLoadingState />;
  if (error || !data) {
    return (
      <DetailErrorState
        message={error || "Payment gateway not found"}
        onRetry={reload}
        backHref="/dashboard/payment-gateways"
        backLabel="Back to Payment Gateways"
      />
    );
  }

  const onboarding = data.onboarding || {};
  const verificationStatus = data.verificationStatus || "incomplete";
  const experts = getPgExperts(onboarding);
  const performance = data.performance || {};

  return (
    <div className="space-y-5">
      <DetailHeader
        backHref="/dashboard/payment-gateways"
        backLabel="Back to Payment Gateways"
        title={data.companyName}
        subtitle={data.contactPerson}
        initials={getInitials(data.companyName)}
        badges={[
          <AccountStatusBadge key="status" status={data.accountStatus} />,
          <VerificationBadge key="verification" status={verificationStatus} />,
        ]}
      />

      {(actionError || actionMessage) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            actionError
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {actionError || actionMessage}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#13203F]">Onboarding verification</h3>
        <p className="mt-1 text-sm text-slate-600">
          Review uploaded documents, then approve or reject this payment gateway.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["pending_review", "approved", "rejected"].map((status) => (
            <button
              key={status}
              type="button"
              disabled={isUpdating || verificationStatus === status}
              onClick={() => handleVerification(status)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold capitalize text-slate-700 disabled:opacity-50"
            >
              {status.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Contact Person</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{data.contactPerson}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Designation</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{data.designation || "—"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Average Rating</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {data.rating?.count > 0 ? `${Number(data.rating.average).toFixed(1)} / 5` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Reviews</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{data.rating?.count ?? 0}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Onboarding %</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {data.profileCompletionPercent ?? data.profileCompletion?.percent ?? 0}%
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Submitted</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatDetailDate(data.createdAt)}</p>
        </div>
      </div>

      <PgRatingSummary rating={data.rating} showReviews hideStats />

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Organisation" icon={HiUserCircle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Company Name">{data.companyName}</DetailField>
            <DetailField label="Contact Person">{data.contactPerson}</DetailField>
            <DetailField label="Designation">{data.designation || "—"}</DetailField>
            <DetailField label="Phone Number">
              <a href={`tel:${data.phone}`} className="text-[#2D4CC8] hover:underline">
                {data.phone}
              </a>
            </DetailField>
            <DetailField label="Email Address">
              <a href={`mailto:${data.email}`} className="text-[#40C3CF] hover:underline">
                {data.email}
              </a>
            </DetailField>
            <DetailField label="Source">{formatDetailLabel(data.source)}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Onboarding Documents (FR-MA-06)" icon={HiDocumentText}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Company Logo">
              <FileLink file={onboarding.companyLogo} />
            </DetailField>
            <DetailField label="Onboarding Checklist">
              <FileLink file={onboarding.onboardingChecklist} />
            </DetailField>
            <DetailField label="Brand Name">{onboarding.brandName || "—"}</DetailField>
            <DetailField label="Legal Entity">{onboarding.legalEntityName || "—"}</DetailField>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Upload / replace logo
              </p>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                disabled={Boolean(uploading)}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  handleDocUpload("companyLogo", file);
                }}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#EEF2FC] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#2D4CC8]"
              />
              {uploading === "companyLogo" ? (
                <p className="mt-1 text-xs text-[#2D4CC8]">Uploading…</p>
              ) : null}
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Upload / replace checklist
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                disabled={Boolean(uploading)}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  handleDocUpload("onboardingChecklist", file);
                }}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#EEF2FC] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#2D4CC8]"
              />
              {uploading === "onboardingChecklist" ? (
                <p className="mt-1 text-xs text-[#2D4CC8]">Uploading…</p>
              ) : null}
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Capabilities" icon={HiTag}>
          <DetailField label="Payment Capabilities">
            {formatDetailLabel(data.paymentCapabilities)}
          </DetailField>
        </InfoCard>

        <InfoCard title="Online Presence" icon={HiGlobeAlt}>
          <DetailField label="Company Website">
            {data.website || onboarding.websiteUrl ? (
              <a
                href={data.website || onboarding.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#2D4CC8] hover:underline"
              >
                {data.website || onboarding.websiteUrl}
              </a>
            ) : (
              "Not provided"
            )}
          </DetailField>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <DetailField label="Login Access">
              <AccountStatusBadge status={data.accountStatus} />
            </DetailField>
            <DetailField label="Created At">{formatDetailDate(data.createdAt)}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Onboarding Profile" icon={HiDocumentText}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Service Type">{formatDetailLabel(onboarding.serviceType)}</DetailField>
            <DetailField label="Company Overview">{onboarding.companyOverview || "—"}</DetailField>
            <DetailField label="Headquarters">
              {[onboarding.headquartersCity, onboarding.headquartersCountry]
                .filter(Boolean)
                .join(", ") || "—"}
            </DetailField>
            <DetailField label="Year Established">{onboarding.yearEstablished || "—"}</DetailField>
            <DetailField label="Merchant Base">{onboarding.merchantBaseCount || "—"}</DetailField>
            <DetailField label="Countries Supported">
              {formatListValue(onboarding.countriesSupported)}
            </DetailField>
            <DetailField label="RBI PAPG Status">{formatDetailLabel(onboarding.rbiPapgStatus)}</DetailField>
            <DetailField label="PCI DSS Status">{formatDetailLabel(onboarding.pciDssStatus)}</DetailField>
            <DetailField label="Best Suited Business Types">
              {formatListValue(onboarding.bestSuitedBusinessTypes)}
            </DetailField>
            <DetailField label="Restricted Categories">
              {formatListValue(onboarding.restrictedCategories)}
            </DetailField>
            <DetailField label="Smart Tags">{formatListValue(onboarding.smartTags)}</DetailField>
            <DetailField label="Onboarding Submitted">
              {formatDetailDate(data.onboardingSubmittedAt)}
            </DetailField>
          </div>
        </InfoCard>

        <InfoCard title="MDR & Commercials" icon={HiTag}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="UPI MDR">{onboarding.upiMdr || "—"}</DetailField>
            <DetailField label="Credit Card MDR">{onboarding.creditCardMdr || "—"}</DetailField>
            <DetailField label="Debit Card MDR">{onboarding.debitCardMdr || "—"}</DetailField>
            <DetailField label="International MDR">{onboarding.internationalMdr || "—"}</DetailField>
            <DetailField label="Wallet Charges">{onboarding.walletCharges || "—"}</DetailField>
            <DetailField label="Net Banking Charges">{onboarding.netBankingCharges || "—"}</DetailField>
            <DetailField label="EMI / BNPL Charges">{onboarding.emiBnplCharges || "—"}</DetailField>
            <DetailField label="Setup Fees">{onboarding.setupFees || "—"}</DetailField>
            <DetailField label="AMC / Platform Fees">{onboarding.amcPlatformFees || "—"}</DetailField>
            <DetailField label="Instant Settlement Charges">
              {onboarding.instantSettlementCharges || "—"}
            </DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Settlement & Support" icon={HiGlobeAlt}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Onboarding TAT">{onboarding.onboardingTat || "—"}</DetailField>
            <DetailField label="Settlement Cycle">{onboarding.settlementCycle || "—"}</DetailField>
            <DetailField label="Refund SLA">{onboarding.refundSla || "—"}</DetailField>
            <DetailField label="Approval Complexity">
              {formatDetailLabel(onboarding.approvalComplexity)}
            </DetailField>
            <DetailField label="Dedicated Account Manager">
              {onboarding.dedicatedAccountManager ? "Yes" : "No"}
            </DetailField>
            <DetailField label="Merchant Support">
              {onboarding.merchantSupportAvailability || "—"}
            </DetailField>
            <DetailField label="Average Response Time">
              {onboarding.averageResponseTime || "—"}
            </DetailField>
            <DetailField label="Features">{formatListValue(onboarding.features)}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Performance Metrics" icon={HiUserCircle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Success Rate">
              {performance.successRate ? `${performance.successRate}%` : "—"}
            </DetailField>
            <DetailField label="Settlement Score">
              {performance.settlementScore ? `${performance.settlementScore}/10` : "—"}
            </DetailField>
            <DetailField label="Avg Settlement Hours">
              {performance.avgSettlementHours ?? "—"}
            </DetailField>
            <DetailField label="Total Merchants">{performance.totalMerchants ?? "—"}</DetailField>
            <DetailField label="Partnership Goals">
              {formatListValue(data.partnershipGoals)}
            </DetailField>
            <DetailField label="Location">{data.location || "—"}</DetailField>
          </div>
        </InfoCard>

        {experts.length > 0 ? (
          <InfoCard title="Talk to Expert Advisors" icon={HiUserCircle}>
            <div className="space-y-4">
              {experts.map((expert, index) => (
                <div
                  key={expert.id || `${expert.email || expert.name}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailField label="Name">{expert.name || "—"}</DetailField>
                    <DetailField label="Designation">{expert.designation || "—"}</DetailField>
                    <DetailField label="Email">{expert.email || "—"}</DetailField>
                    <DetailField label="Mobile">{expert.mobile || "—"}</DetailField>
                    <DetailField label="Calendly URL">
                      {expert.calendlyUrl ? (
                        <a
                          href={expert.calendlyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2D4CC8] hover:underline"
                        >
                          View schedule
                        </a>
                      ) : (
                        "—"
                      )}
                    </DetailField>
                    <DetailField label="Status">{formatDetailLabel(expert.status || "active")}</DetailField>
                  </div>
                  {expert.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{expert.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </InfoCard>
        ) : null}
      </div>
    </div>
  );
}

export default function PaymentGatewayDetailsPage({ params }) {
  const { id } = use(params);
  return <PaymentGatewayDetails id={id} />;
}
