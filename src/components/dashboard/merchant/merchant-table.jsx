"use client";

import { MerchantAssigneeCell } from "@/components/dashboard/merchant/merchant-assignee-cell";
import { MerchantStatusCell } from "@/components/dashboard/merchant/merchant-status-cell";
import { useMerchantLeadActions } from "@/components/dashboard/merchant/use-merchant-lead-actions";
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

export function MerchantTable({
  variant = "overview",
  workTypeFilter = "Merchant",
  listState,
}) {
  const internalListState = useDashboardList(fetchMerchants, mapMerchantListResponse, {
    enabled: !listState,
  });
  const { data, isLoading, error, reload } = listState ?? internalListState;

  const {
    getLeadActionItems,
    actionBanners,
    notesModal,
    setActionMessage,
    setActionError,
  } = useMerchantLeadActions({ onReload: reload });

  return (
    <>
      {actionBanners}

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
          clientSubtext="email"
          contactColumn="source"
          showLeadType
          showWorkTypeColumn={false}
          showAccountStatus
          accountStatusResource="merchant"
          onAccountStatusUpdated={reload}
          getRowActionItems={getLeadActionItems}
          renderAssigneeCell={(row) => (
            <MerchantAssigneeCell
              row={row}
              onAssigned={(message) => {
                setActionMessage(message);
                setActionError("");
                reload();
              }}
            />
          )}
          renderStatusCell={(row) => (
            <MerchantStatusCell
              row={row}
              onUpdated={(message) => {
                setActionMessage(message);
                setActionError("");
                reload();
              }}
            />
          )}
        />
      </DashboardListState>

      {notesModal}
    </>
  );
}
