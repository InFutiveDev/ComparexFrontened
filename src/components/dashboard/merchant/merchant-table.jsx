"use client";

import { useCallback, useState } from "react";
import {
  HiDocumentText,
  HiEnvelope,
  HiFlag,
  HiUserCircle,
} from "react-icons/hi2";
import { MerchantNotesModal } from "@/components/dashboard/merchant/merchant-action-modals";
import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { ApiError } from "@/lib/api";
import { fetchMerchants, updateMerchantAdmin } from "@/lib/dashboard-api";
import { mapMerchantListResponse } from "@/lib/dashboard-mappers";

const actionItemClass = "text-[#13203F] hover:bg-slate-50";

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

  const [notesRow, setNotesRow] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFlagForReview = useCallback(
    async (row) => {
      if (row.flaggedForReview || row.leadStatus === "in_review") return;

      const label = row.name || "this merchant";
      if (!window.confirm(`Flag ${label} for review?`)) {
        return;
      }

      setIsUpdating(true);
      setActionError("");
      setActionMessage("");

      try {
        const result = await updateMerchantAdmin(row.id, { flaggedForReview: true });
        setActionMessage(result.message || "Merchant flagged for review");
        reload();
      } catch (err) {
        setActionError(
          err instanceof ApiError ? err.message : "Failed to flag merchant for review",
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [reload],
  );

  const getRowActionItems = useCallback(
    (row) => {
      const profileHref = `/dashboard/merchants/${encodeURIComponent(row.id)}`;
      const isFlagged = row.flaggedForReview || row.leadStatus === "in_review";

      return [
        {
          type: "link",
          label: "View Profile",
          icon: HiUserCircle,
          href: profileHref,
          className: actionItemClass,
          iconClassName: "text-[#2D4CC8]",
        },
        {
          type: "button",
          label: "Send Follow Up",
          icon: HiEnvelope,
          disabled: true,
          className: actionItemClass,
          iconClassName: "text-[#40C3CF]",
        },
        {
          type: "button",
          label: isFlagged ? "Flagged for Review" : "Flag for Review",
          icon: HiFlag,
          disabled: isFlagged || isUpdating,
          onClick: () => handleFlagForReview(row),
          className: "text-amber-700 hover:bg-amber-50",
          iconClassName: "text-amber-600",
        },
        {
          type: "button",
          label: "Notes",
          icon: HiDocumentText,
          onClick: () => setNotesRow(row),
          className: actionItemClass,
          iconClassName: "text-violet-600",
        },
      ];
    },
    [handleFlagForReview, isUpdating],
  );

  return (
    <>
      {actionMessage ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {actionMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

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
          getRowActionItems={getRowActionItems}
        />
      </DashboardListState>

      <MerchantNotesModal
        row={notesRow}
        onClose={() => setNotesRow(null)}
        onSaved={(message) => {
          setActionMessage(message);
          setActionError("");
          reload();
        }}
      />
    </>
  );
}
