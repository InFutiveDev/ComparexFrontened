"use client";

import { use, useState } from "react";
import {
  HiBuildingLibrary,
  HiDocumentText,
  HiGlobeAlt,
  HiIdentification,
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
import {
  fetchResellerById,
  updateResellerVerificationStatus,
} from "@/lib/dashboard-api";
import { pickReseller } from "@/lib/dashboard-detail-pickers";
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

export function ResellerDetails({ id }) {
  const { data, isLoading, error, reload } = useDashboardDetail(
    id,
    fetchResellerById,
    pickReseller,
  );
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleVerification(status) {
    setIsUpdating(true);
    setActionError("");
    setActionMessage("");
    try {
      const result = await updateResellerVerificationStatus(id, status);
      setActionMessage(result.message || "Verification updated");
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update verification");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) return <DetailLoadingState />;
  if (error || !data) {
    return (
      <DetailErrorState
        message={error || "Reseller not found"}
        onRetry={reload}
        backHref="/dashboard/resellers"
        backLabel="Back to Resellers"
      />
    );
  }

  return (
    <div className="space-y-5">
      <DetailHeader
        backHref="/dashboard/resellers"
        backLabel="Back to Resellers"
        title={data.fullName}
        subtitle={data.businessName}
        initials={getInitials(data.fullName)}
        badges={[
          <AccountStatusBadge key="status" status={data.accountStatus} />,
          <VerificationBadge key="verification" status={data.verificationStatus} />,
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Profile completion</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {data.profileCompletionPercent ?? 0}%
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Partnership model</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {formatDetailLabel(data.partnershipModel)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Verification</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {formatVerificationLabel(data.verificationStatus)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Submitted</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatDetailDate(data.createdAt)}</p>
        </div>
      </div>

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

      <div className="rounded-2xl border border-[#2D4CC8]/15 bg-[#EEF2FC] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#13203F]">Admin verification guide</h3>
        <p className="mt-1 text-sm text-slate-600">
          {data.verificationStatus === "pending_review"
            ? "This reseller finished registration. Review the checklist below, then Approve or Reject."
            : data.verificationStatus === "incomplete"
              ? "Reseller is still filling post-login details. Wait until status becomes Pending admin review."
              : data.verificationStatus === "approved"
                ? "Already approved. No further verification action needed."
                : "This application was rejected. You can mark pending review again if they resubmit."}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(data.profileCompletion?.checks || []).map((item) => (
            <div
              key={item.key}
              className={`rounded-xl px-3 py-2 text-xs font-medium ${
                item.complete
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                  : "bg-white text-slate-500 ring-1 ring-slate-200"
              }`}
            >
              {item.complete ? "✓" : "○"} {item.label}
              {!item.required ? " (optional)" : ""}
            </div>
          ))}
        </div>

        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>Open KYC section — verify PAN, Aadhaar/Govt ID, and bank proof file.</li>
          <li>Confirm bank account holder/name/IFSC match the proof document.</li>
          <li>Check partnership model, city/state, and agreements are accepted.</li>
          <li>
            If everything looks correct and completion is{" "}
            {data.profileCompletionPercent ?? 0}% with required fields done, click{" "}
            <strong>Approve reseller</strong>.
          </li>
        </ol>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#13203F]">Final verification & approval</h3>
        <p className="mt-1 text-sm text-slate-600">
          Next step:{" "}
          {data.verificationStatus === "pending_review"
            ? "Approve or Reject after reviewing fields below."
            : data.verificationStatus === "incomplete"
              ? "No action yet — reseller must complete profile first."
              : data.verificationStatus === "approved"
                ? "Done — reseller is verified."
                : "Rejected — contact reseller or mark pending review again."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isUpdating || data.verificationStatus === "incomplete"}
            onClick={() => handleVerification("approved")}
            className="rounded-full bg-[#25a36f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Approve reseller
          </button>
          <button
            type="button"
            disabled={isUpdating || data.verificationStatus === "incomplete"}
            onClick={() => handleVerification("rejected")}
            className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-60"
          >
            Reject
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleVerification("pending_review")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
          >
            Mark pending review
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Partner Profile" icon={HiUserCircle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Full Name">{data.fullName}</DetailField>
            <DetailField label="Business / Company">{data.businessName}</DetailField>
            <DetailField label="Phone Number">{data.phone}</DetailField>
            <DetailField label="Email Address">{data.email}</DetailField>
            <DetailField label="City & State">{data.cityState || "—"}</DetailField>
            <DetailField label="Years of Experience">
              {formatDetailLabel(data.yearsExperience)}
            </DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Partnership" icon={HiTag}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Preferred Partnership Model">
              {formatDetailLabel(data.partnershipModel)}
            </DetailField>
            <DetailField label="Merchant Network Size">
              {formatDetailLabel(data.merchantNetworkSize)}
            </DetailField>
            <DetailField label="Monthly Referrals">
              {formatDetailLabel(data.monthlyReferrals)}
            </DetailField>
            <DetailField label="Login Access">
              <AccountStatusBadge status={data.accountStatus} />
            </DetailField>
          </div>
        </InfoCard>

        <InfoCard title="KYC Details" icon={HiIdentification}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="PAN Card">{data.panCard || "—"}</DetailField>
            <DetailField label="Aadhaar / Govt ID">{data.aadhaarId || "—"}</DetailField>
            <DetailField label="GST Certificate">
              <FileLink file={data.gstCertificate} />
            </DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Bank Account" icon={HiBuildingLibrary}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Account Holder">{data.bankAccountHolderName || "—"}</DetailField>
            <DetailField label="Bank Name">{data.bankName || "—"}</DetailField>
            <DetailField label="Account Number">{data.bankAccountNumber || "—"}</DetailField>
            <DetailField label="IFSC">{data.bankIfsc || "—"}</DetailField>
            <DetailField label="Branch">{data.bankBranch || "—"}</DetailField>
            <DetailField label="Account Type">
              {formatDetailLabel(data.bankAccountType)}
            </DetailField>
            <DetailField label="Cancelled Cheque / Bank Proof">
              <FileLink file={data.bankProof} />
            </DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Agreements" icon={HiDocumentText}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Reseller Agreement">
              {formatDetailLabel(data.resellerAgreement)}
            </DetailField>
            <DetailField label="Commission Policy">
              {formatDetailLabel(data.commissionPolicy)}
            </DetailField>
            <DetailField label="Created At">{formatDetailDate(data.createdAt)}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Online Presence" icon={HiGlobeAlt}>
          <DetailField label="Website / LinkedIn Profile">
            {data.website || "Not provided"}
          </DetailField>
        </InfoCard>
      </div>
    </div>
  );
}

export default function ResellerDetailsPage({ params }) {
  const { id } = use(params);
  return <ResellerDetails id={id} />;
}
