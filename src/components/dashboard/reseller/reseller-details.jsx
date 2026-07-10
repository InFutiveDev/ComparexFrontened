"use client";

import { use } from "react";
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
import { fetchResellerById } from "@/lib/dashboard-api";
import { pickReseller } from "@/lib/dashboard-detail-pickers";

export function ResellerDetails({ id }) {
  const { data, isLoading, error, reload } = useDashboardDetail(
    id,
    fetchResellerById,
    pickReseller,
  );

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
          <span
            key="type"
            className="inline-flex rounded-full bg-[#EEF2FC] px-3 py-1 text-xs font-medium text-[#2D4CC8] ring-1 ring-[#2D4CC8]/10"
          >
            {formatDetailLabel(data.partnerType)}
          </span>,
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Partner Type</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatDetailLabel(data.partnerType)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Monthly Businesses</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {formatDetailLabel(data.monthlyBusinessCount)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Form Step</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{data.formStep ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Submitted</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatDetailDate(data.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Partner Profile" icon={HiUserCircle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Full Name">{data.fullName}</DetailField>
            <DetailField label="Business / Company">{data.businessName}</DetailField>
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
            <DetailField label="Website / LinkedIn">
              {data.website ? (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2D4CC8] hover:underline"
                >
                  {data.website}
                </a>
              ) : (
                "—"
              )}
            </DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Business Network" icon={HiTag}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Partner Type">{formatDetailLabel(data.partnerType)}</DetailField>
            <DetailField label="Monthly Business Count">
              {formatDetailLabel(data.monthlyBusinessCount)}
            </DetailField>
            <DetailField label="Business Types">
              {formatDetailLabel(data.businessTypes)}
            </DetailField>
            <DetailField label="Payment Familiarity">
              {formatDetailLabel(data.paymentFamiliarity)}
            </DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Partnership & Access" icon={HiDocumentText}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Consent">{formatDetailLabel(data.consent)}</DetailField>
            <DetailField label="Source">{formatDetailLabel(data.source)}</DetailField>
            <DetailField label="Login Access">
              <AccountStatusBadge status={data.accountStatus} />
            </DetailField>
            <DetailField label="Form Progress">Step {data.formStep ?? 1} of 3</DetailField>
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
