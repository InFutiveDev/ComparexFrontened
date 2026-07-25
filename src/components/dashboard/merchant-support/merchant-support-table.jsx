"use client";

import { useCallback, useState } from "react";
import {
  HiArrowUpTray,
  HiCheckCircle,
  HiEye,
  HiPhone,
} from "react-icons/hi2";
import {
  MerchantSupportContactModal,
  MerchantSupportEscalateModal,
} from "@/components/dashboard/merchant-support/merchant-support-action-modals";
import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { ApiError } from "@/lib/api";
import {
  fetchMerchantSupport,
  updateMerchantSupportStatus,
} from "@/lib/dashboard-api";
import { mapMerchantSupportListResponse } from "@/lib/dashboard-mappers";

const actionItemClass = "text-[#13203F] hover:bg-slate-50";

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

export function MerchantSupportTable({ variant = "full", listState, refreshToken = 0 }) {
  const internalListState = useDashboardList(fetchMerchantSupport, mapMerchantSupportListResponse, {
    enabled: !listState,
    refreshToken,
  });
  const { data, isLoading, error, reload } = listState ?? internalListState;

  const [contactRow, setContactRow] = useState(null);
  const [escalateRow, setEscalateRow] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleResolve = useCallback(
    async (row) => {
      if (row.supportStatus === "resolved") return;

      const label = row.name || "this request";
      if (!window.confirm(`Mark support request from ${label} as resolved?`)) {
        return;
      }

      setIsUpdating(true);
      setActionError("");
      setActionMessage("");

      try {
        const result = await updateMerchantSupportStatus(row.id, "resolved");
        setActionMessage(result.message || "Support request marked as resolved");
        reload();
      } catch (err) {
        setActionError(
          err instanceof ApiError ? err.message : "Failed to resolve support request",
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [reload],
  );

  const getRowActionItems = useCallback(
    (row, { detailsHref }) => [
      {
        type: "link",
        label: "View Details",
        icon: HiEye,
        href: detailsHref,
        className: actionItemClass,
        iconClassName: "text-[#2D4CC8]",
      },
      {
        type: "button",
        label: "Contact",
        icon: HiPhone,
        onClick: () => setContactRow(row),
        className: actionItemClass,
        iconClassName: "text-[#2D4CC8]",
      },
      {
        type: "button",
        label: "Resolve",
        icon: HiCheckCircle,
        disabled: row.supportStatus === "resolved" || isUpdating,
        onClick: () => handleResolve(row),
        className: "text-emerald-700 hover:bg-emerald-50",
        iconClassName: "text-emerald-600",
      },
      {
        type: "button",
        label: "Escalate to PG",
        icon: HiArrowUpTray,
        onClick: () => setEscalateRow(row),
        className: actionItemClass,
        iconClassName: "text-violet-600",
      },
    ],
    [handleResolve, isUpdating],
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
        emptyMessage="No support requests found"
      >
        <CrmDataTable
          data={data}
          variant={variant}
          labels={merchantSupportLabels}
          searchType="merchant"
          detailsBasePath="/dashboard/merchant-support"
          detailsWorkType="Merchant Support"
          showContactColumn={false}
          showAssigneeColumn={false}
          getRowActionItems={getRowActionItems}
        />
      </DashboardListState>

      <MerchantSupportContactModal row={contactRow} onClose={() => setContactRow(null)} />

      <MerchantSupportEscalateModal
        row={escalateRow}
        onClose={() => setEscalateRow(null)}
        onEscalated={(message) => {
          setActionMessage(message);
          setActionError("");
          reload();
        }}
      />
    </>
  );
}
