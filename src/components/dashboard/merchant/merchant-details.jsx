"use client";

import Link from "next/link";
import { use } from "react";
import {
  HiArrowRight,
  HiTag,
  HiUserCircle,
  HiUserGroup,
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

const LEAD_STATUS_LABELS = {
  new: "New",
  in_review: "In Review",
  qualified: "Qualified",
  rejected: "Rejected",
  assigned: "Assigned",
  expert_booked: "Talk to Expert Booked",
};

const PG_LEAD_STATUS_LABELS = {
  pending: "Pending",
  live: "Live",
  rejected: "Rejected",
};

function formatLeadStatus(value) {
  return LEAD_STATUS_LABELS[value] || formatDetailLabel(value);
}

function formatPgLeadStatus(value) {
  return PG_LEAD_STATUS_LABELS[value] || formatDetailLabel(value);
}

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
            key="lead-status"
            className="inline-flex rounded-full bg-[#EEF2FC] px-3 py-1 text-xs font-medium text-[#2D4CC8] ring-1 ring-[#2D4CC8]/10"
          >
            {formatLeadStatus(data.leadStatus)}
          </span>,
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
          <p className="text-xs font-medium text-slate-500">Lead Status</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatLeadStatus(data.leadStatus)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Assigned PG</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{data.assignedPgName || "Unassigned"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">PG Lead Status</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {formatPgLeadStatus(data.pgLeadStatus)}
          </p>
        </div>
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
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Last Updated</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatDetailDate(data.updatedAt)}</p>
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

        <InfoCard title="Lead Workflow" icon={HiUserGroup}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Lead Status">{formatLeadStatus(data.leadStatus)}</DetailField>
            <DetailField label="Assigned Payment Gateway">
              {data.assignedPgName || "Not assigned"}
            </DetailField>
            <DetailField label="Assigned At">{formatDetailDate(data.assignedAt)}</DetailField>
            <DetailField label="PG Lead Status">{formatPgLeadStatus(data.pgLeadStatus)}</DetailField>
            <DetailField label="PG Remarks">{data.pgRemarks || "—"}</DetailField>
            <DetailField label="PG Status Updated">
              {formatDetailDate(data.pgStatusUpdatedAt)}
            </DetailField>
            <DetailField label="Referred By Reseller">
              {data.referredByResellerName || "—"}
            </DetailField>
            <DetailField label="Registered Via PG ID">
              {data.registeredViaPgId || "—"}
            </DetailField>
            <DetailField label="Registered Via Reseller ID">
              {data.registeredViaResellerId || "—"}
            </DetailField>
            <DetailField label="Expert Booking ID">{data.expertBookingId || "—"}</DetailField>
            <DetailField label="Location">{data.location || "—"}</DetailField>
            <DetailField label="Qualification Notes">{data.qualificationNotes || "—"}</DetailField>
          </div>
          <Link
            href={`/sub-admin-dashboard/leads/${data.id}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2D4CC8] hover:underline"
          >
            Open in Lead Ops
            <HiArrowRight className="size-4" aria-hidden />
          </Link>
        </InfoCard>
      </div>
    </div>
  );
}

export default function MerchantDetailsPage({ params }) {
  const { id } = use(params);
  return <MerchantDetails id={id} />;
}
