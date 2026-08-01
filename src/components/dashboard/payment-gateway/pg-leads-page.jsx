"use client";

import Link from "next/link";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi2";
import {
  DetailErrorState,
  DetailLoadingState,
  useDashboardDetail,
} from "@/components/dashboard/shared/record-details";
import { LeadsTableSection } from "@/components/sub-admin/leads-table";
import { fetchPaymentGatewayById } from "@/lib/dashboard-api";
import { pickPaymentGateway } from "@/lib/dashboard-detail-pickers";

export function PgLeadsPage({ id }) {
  const searchParams = useSearchParams();
  const leadView = searchParams.get("leadView") === "tte" ? "tte" : searchParams.get("leadView") === "regular" ? "regular" : "";

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

  const pgName = data.companyName || data.name || "Payment Gateway";

  let leadsTitle = `Leads — ${pgName}`;
  let leadsDescription = `Merchant leads assigned to ${pgName}.`;
  if (leadView === "tte") {
    leadsTitle = `TTE leads — ${pgName}`;
    leadsDescription = `Talk to Expert leads shared with ${pgName}.`;
  } else if (leadView === "regular") {
    leadsTitle = `Regular leads — ${pgName}`;
    leadsDescription = `Regular merchant leads shared with ${pgName}.`;
  }

  return (
    <div className="space-y-5">
      <Link
        href={`/dashboard/payment-gateways/${encodeURIComponent(id)}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#2D4CC8] transition hover:text-[#13203F]"
      >
        <HiArrowLeft className="size-4" aria-hidden />
        Back to profile
      </Link>

      <LeadsTableSection
        title={leadsTitle}
        description={leadsDescription}
        assignedPgId={id}
        showAssignCta={false}
        hideAssignedPgColumn
        leadDetailBasePath="/sub-admin-dashboard/leads"
        leadView={leadView}
      />
    </div>
  );
}

export default function PgLeadsRoutePage({ params }) {
  const { id } = use(params);
  return <PgLeadsPage id={id} />;
}
