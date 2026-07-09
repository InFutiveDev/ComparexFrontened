"use client";

import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchMerchants } from "@/lib/dashboard-api";
import { mapMerchantListResponse } from "@/lib/dashboard-mappers";

const merchantLabels = {
  search: "Search merchants",
  empty: "No merchants found",
  filterTitle: "Filter Merchants",
  filterDescription: "Refine merchants by status, category, and more",
  upload: "Upload Merchants",
  download: "Download merchants",
  assign: "Assign Merchant",
  delete: "Delete Merchant",
};

export function MerchantTable({ variant = "overview", workTypeFilter = "Merchant" }) {
  const { data, isLoading, error, reload } = useDashboardList(
    fetchMerchants,
    mapMerchantListResponse,
  );

  return (
    <DashboardListState
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      emptyMessage="No merchants found"
    >
      <CrmDataTable
        data={data}
        variant={variant}
        workTypeFilter={workTypeFilter}
        lockWorkTypeFilter={Boolean(workTypeFilter)}
        labels={merchantLabels}
        searchType="merchant"
        detailsBasePath="/dashboard/merchants"
        detailsWorkType="Merchant"
        showAccountStatus
        accountStatusResource="merchant"
        onAccountStatusUpdated={reload}
      />
    </DashboardListState>
  );
}
