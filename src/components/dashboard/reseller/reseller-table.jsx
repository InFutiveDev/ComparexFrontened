"use client";

import { useCallback, useState } from "react";
import {
  HiClipboardDocumentList,
  HiDocumentText,
  HiEnvelope,
  HiUserCircle,
} from "react-icons/hi2";
import { ResellerNotesModal } from "@/components/dashboard/reseller/reseller-action-modals";
import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchResellers } from "@/lib/dashboard-api";
import { mapResellerListResponse } from "@/lib/dashboard-mappers";

const actionItemClass = "text-[#13203F] hover:bg-slate-50";

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

  const [notesRow, setNotesRow] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const getRowActionItems = useCallback((row) => {
    const profileHref = `/dashboard/resellers/${encodeURIComponent(row.id)}`;
    const leadsHref = `/dashboard/resellers/${encodeURIComponent(row.id)}/leads`;

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
        type: "link",
        label: "View Leads",
        icon: HiClipboardDocumentList,
        href: leadsHref,
        className: actionItemClass,
        iconClassName: "text-[#25a36f]",
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
  }, []);

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
          getRowActionItems={getRowActionItems}
        />
      </DashboardListState>

      <ResellerNotesModal
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
