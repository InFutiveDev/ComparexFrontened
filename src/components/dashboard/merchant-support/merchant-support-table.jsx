"use client";

import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchMerchantSupport } from "@/lib/dashboard-api";
import { mapMerchantSupportListResponse } from "@/lib/dashboard-mappers";

const merchantSupportLabels = {
  search: "Search support requests",
  empty: "No support requests found",
  emptyHint: "Submissions from the merchant support desk will appear here.",
  filterTitle: "Filter Support Requests",
  filterDescription: "Refine requests by status, category, and more",
  upload: "Upload Requests",
  download: "Download requests",
  assign: "Assign Request",
  delete: "Delete Request",
};

export function MerchantSupportTable({ variant = "full", refreshToken = 0 }) {
  const { data, isLoading, error, reload } = useDashboardList(
    fetchMerchantSupport,
    mapMerchantSupportListResponse,
    { refreshToken },
  );

  return (
    <DashboardListState
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      emptyMessage="No support requests found"
    >
      <CrmDataTable
        data={data}
        variant={variant}
        labels={merchantSupportLabels}
        searchType="merchant"
        detailsBasePath="/dashboard/merchant-support"
        detailsWorkType="Merchant Support"
      />
    </DashboardListState>
  );
}
