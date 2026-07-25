"use client";

import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchResellers } from "@/lib/dashboard-api";
import { mapResellerListResponse } from "@/lib/dashboard-mappers";

const resellerLabels = {
  search: "Search resellers",
  empty: "No resellers found",
  filterTitle: "Filter Resellers",
  filterDescription: "Refine resellers by status, category, and more",
  upload: "Upload Resellers",
  download: "Download resellers",
  assign: "Assign Reseller",
  delete: "Delete Reseller",
};

export function ResellerTable({
  variant = "overview",
  workTypeFilter = "Reseller",
  listState,
}) {
  const internalListState = useDashboardList(fetchResellers, mapResellerListResponse, {
    enabled: !listState,
  });
  const { data, isLoading, error, reload } = listState ?? internalListState;

  return (
    <DashboardListState
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      emptyMessage="No resellers found"
    >
      <CrmDataTable
        data={data}
        variant={variant}
        workTypeFilter={workTypeFilter}
        lockWorkTypeFilter={Boolean(workTypeFilter)}
        labels={resellerLabels}
        searchType="merchant"
        detailsBasePath="/dashboard/resellers"
        detailsWorkType="Reseller"
        clientColumnLabel="Reseller Name"
        clientSubtext="email"
        contactColumn="qualifiedLead"
        resultLabel="resellers"
        showAccountStatus
        accountStatusResource="reseller"
        onAccountStatusUpdated={reload}
      />
    </DashboardListState>
  );
}
