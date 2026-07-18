"use client";

import { use } from "react";
import {
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
import { fetchMerchantById } from "@/lib/dashboard-api";
import { pickMerchantGateway } from "@/lib/dashboard-detail-pickers";

export function MerchantDetails({ id }) {
  const { data, isLoading, error, reload } = useDashboardDetail(
    id,
    fetchMerchantById,
    pickMerchantGateway,
  );

  if (isLoading) return <DetailLoadingState />;
  if (error || !data) {
    return (
      <DetailErrorState
        message={error || "Merchant not found"}
        onRetry={reload}
        backHref="/dashboard/merchants"
        backLabel="Back to Merchants"
      />
    );
  }

  return (
    <div className="space-y-5">
      <DetailHeader
        backHref="/dashboard/merchants"
        backLabel="Back to Merchants"
        title={data.businessName}
        subtitle="Merchant lead"
        initials={getInitials(data.businessName)}
        badges={[
          <AccountStatusBadge key="status" status={data.accountStatus} />,
          <span
            key="industry"
            className="inline-flex rounded-full bg-[#EEF2FC] px-3 py-1 text-xs font-medium text-[#2D4CC8] ring-1 ring-[#2D4CC8]/10"
          >
            {formatDetailLabel(data.industry)}
          </span>,
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Industry</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatDetailLabel(data.industry)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Priority</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatDetailLabel(data.priority)}</p>
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
        <InfoCard title="Contact Information" icon={HiUserCircle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Business Name">{data.businessName}</DetailField>
            <DetailField label="Contact Person">{data.contactName || "—"}</DetailField>
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
          </div>
        </InfoCard>

        <InfoCard title="Business Details" icon={HiTag}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Industry">{formatDetailLabel(data.industry)}</DetailField>
            <DetailField label="Estimated Monthly Volume">
              {data.estimatedMonthlyVolume
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(data.estimatedMonthlyVolume)
                : "—"}
            </DetailField>
            <DetailField label="Priority">{formatDetailLabel(data.priority)}</DetailField>
            <DetailField label="Source">{formatDetailLabel(data.source)}</DetailField>
            <DetailField label="Login Access">
              <AccountStatusBadge status={data.accountStatus} />
            </DetailField>
            <DetailField label="Form Progress">Step {data.formStep ?? 1} of 3</DetailField>
            <DetailField label="Created At">{formatDetailDate(data.createdAt)}</DetailField>
          </div>
        </InfoCard>
      </div>
    </div>
  );
}

export default function MerchantDetailsPage({ params }) {
  const { id } = use(params);
  return <MerchantDetails id={id} />;
}
