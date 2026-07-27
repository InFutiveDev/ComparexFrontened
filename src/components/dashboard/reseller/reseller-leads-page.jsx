"use client";

import Link from "next/link";
import { use } from "react";
import { HiArrowLeft } from "react-icons/hi2";
import {
  DetailErrorState,
  DetailLoadingState,
  useDashboardDetail,
} from "@/components/dashboard/shared/record-details";
import { LeadsTableSection } from "@/components/sub-admin/leads-table";
import { fetchResellerById } from "@/lib/dashboard-api";
import { pickReseller } from "@/lib/dashboard-detail-pickers";

export function ResellerLeadsPage({ id }) {
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

  const resellerName = data.businessName || data.fullName || "Reseller";

  return (
    <div className="space-y-5">
      <Link
        href={`/dashboard/resellers/${encodeURIComponent(id)}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#2D4CC8] transition hover:text-[#13203F]"
      >
        <HiArrowLeft className="size-4" aria-hidden />
        Back to profile
      </Link>

      <LeadsTableSection
        title={`Leads — ${resellerName}`}
        description={`Merchant leads referred by ${resellerName}.`}
        registeredViaResellerId={id}
        showAssignCta={false}
        leadDetailBasePath="/dashboard/merchants"
      />
    </div>
  );
}

export default function ResellerLeadsRoutePage({ params }) {
  const { id } = use(params);
  return <ResellerLeadsPage id={id} />;
}
