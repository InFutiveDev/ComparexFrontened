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
import { fetchPaymentGatewayById } from "@/lib/dashboard-api";
import { pickPaymentGateway } from "@/lib/dashboard-detail-pickers";

export function PaymentGatewayDetails({ id }) {
  const { data, isLoading, error, reload } = useDashboardDetail(
    id,
    fetchPaymentGatewayById,
    pickPaymentGateway,
  );

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
          <span
            key="designation"
            className="inline-flex rounded-full bg-[#EEF2FC] px-3 py-1 text-xs font-medium text-[#2D4CC8] ring-1 ring-[#2D4CC8]/10"
          >
            {data.designation || "Payment Provider"}
          </span>,
        ]}
      />

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
          <p className="text-xs font-medium text-slate-500">Form Step</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{data.formStep ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Submitted</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatDetailDate(data.createdAt)}</p>
        </div>
      </div>

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
          </div>
        </InfoCard>

        <InfoCard title="Capabilities" icon={HiTag}>
          <DetailField label="Payment Capabilities">
            {formatDetailLabel(data.paymentCapabilities)}
          </DetailField>
        </InfoCard>

        <InfoCard title="Partnership Goals" icon={HiDocumentText}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Partnership Goals">
              {formatDetailLabel(data.partnershipGoals)}
            </DetailField>
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
          <DetailField label="Company Website">
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
              "Not provided"
            )}
          </DetailField>
        </InfoCard>
      </div>
    </div>
  );
}

export default function PaymentGatewayDetailsPage({ params }) {
  const { id } = use(params);
  return <PaymentGatewayDetails id={id} />;
}
