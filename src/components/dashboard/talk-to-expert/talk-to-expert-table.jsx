"use client";

import { useCallback, useState } from "react";
import {
  HiCheckBadge,
  HiDocumentText,
  HiEnvelope,
  HiEye,
  HiUserPlus,
} from "react-icons/hi2";
import {
  TalkToExpertAssignModal,
  TalkToExpertNotesModal,
} from "@/components/dashboard/talk-to-expert/talk-to-expert-action-modals";
import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { ApiError } from "@/lib/api";
import {
  fetchExpertBookings,
  updateExpertBookingStatus,
} from "@/lib/dashboard-api";
import { mapExpertBookingListResponse } from "@/lib/dashboard-mappers";

const actionItemClass = "text-[#13203F] hover:bg-slate-50";

const expertLabels = {
  search: "Search expert bookings",
  empty: "No expert bookings found",
  emptyHint: "Talk to Expert form submissions will appear here.",
  filterTitle: "Filter Expert Bookings",
  filterDescription: "Refine bookings by status, gateway, and more",
  upload: "Upload Bookings",
  download: "Download bookings",
  assign: "Assign Booking",
  delete: "Delete Booking",
};

export function TalkToExpertTable({ variant = "full", listState, refreshToken = 0 }) {
  const internalListState = useDashboardList(fetchExpertBookings, mapExpertBookingListResponse, {
    enabled: !listState,
    refreshToken,
  });
  const { data, isLoading, error, reload } = listState ?? internalListState;

  const [assignRow, setAssignRow] = useState(null);
  const [notesRow, setNotesRow] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQualify = useCallback(
    async (row) => {
      if (row.expertStatus === "qualified") return;

      const label = row.name || "this booking";
      if (!window.confirm(`Qualify expert booking for ${label}?`)) {
        return;
      }

      setIsUpdating(true);
      setActionError("");
      setActionMessage("");

      try {
        const result = await updateExpertBookingStatus(row.id, "qualified");
        setActionMessage(result.message || "Booking qualified");
        reload();
      } catch (err) {
        setActionError(err instanceof ApiError ? err.message : "Failed to qualify booking");
      } finally {
        setIsUpdating(false);
      }
    },
    [reload],
  );

  const getRowActionItems = useCallback(
    (row, { detailsHref }) => {
      const followUpSubject = encodeURIComponent("Follow up on your Talk to Expert request");
      const followUpBody = encodeURIComponent(
        `Hi ${row.name || "there"},\n\nWe wanted to follow up regarding your Talk to Expert booking with CompareX.\n\nBest regards,\nCompareX Team`,
      );

      return [
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
          label: "Qualify",
          icon: HiCheckBadge,
          disabled: row.expertStatus === "qualified" || isUpdating,
          onClick: () => handleQualify(row),
          className: "text-emerald-700 hover:bg-emerald-50",
          iconClassName: "text-emerald-600",
        },
        ...(row.email
          ? [
              {
                type: "link",
                label: "Send Follow Up",
                icon: HiEnvelope,
                href: `mailto:${row.email}?subject=${followUpSubject}&body=${followUpBody}`,
                className: actionItemClass,
                iconClassName: "text-[#40C3CF]",
              },
            ]
          : []),
        {
          type: "button",
          label: "Assign",
          icon: HiUserPlus,
          onClick: () => setAssignRow(row),
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
    },
    [handleQualify, isUpdating],
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
        emptyMessage="No expert bookings found"
      >
        <CrmDataTable
          data={data}
          variant={variant}
          labels={expertLabels}
          searchType="merchant"
          detailsBasePath="/dashboard/talk-to-expert"
          detailsWorkType="Talk to Expert"
          showContactColumn={false}
          showAssigneeColumn={false}
          getRowActionItems={getRowActionItems}
        />
      </DashboardListState>

      <TalkToExpertAssignModal
        row={assignRow}
        onClose={() => setAssignRow(null)}
        onSaved={(message) => {
          setActionMessage(message);
          setActionError("");
          reload();
        }}
      />

      <TalkToExpertNotesModal
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
