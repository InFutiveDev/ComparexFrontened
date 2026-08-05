"use client";

import { ResellerListTable } from "@/components/dashboard/reseller/reseller-list-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchResellers } from "@/lib/dashboard-api";
import { mapResellerListResponse } from "@/lib/dashboard-mappers";

export function ResellerTable({ listState }) {
  const internalListState = useDashboardList(fetchResellers, mapResellerListResponse, {
    enabled: !listState,
  });
  const { data, isLoading, error, reload } = listState ?? internalListState;

  return (
    <DashboardListState
      isLoading={false}
      error={error}
      onRetry={reload}
      emptyMessage="No resellers found"
    >
      <ResellerListTable
        rows={data}
        isLoading={isLoading}
        onAccountStatusUpdated={reload}
        onNotesSaved={reload}
      />
    </DashboardListState>
  );
}
