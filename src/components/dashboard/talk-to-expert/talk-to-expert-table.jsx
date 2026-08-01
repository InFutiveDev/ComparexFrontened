"use client";

import { useCallback, useState } from "react";
import {
  HiCheckBadge,
  HiDocumentText,
  HiEnvelope,
  HiUserCircle,
  HiUserPlus,
} from "react-icons/hi2";
import {
  TalkToExpertAssignModal,
  TalkToExpertNotesModal,
  TalkToExpertQualifyModal,
} from "@/components/dashboard/talk-to-expert/talk-to-expert-action-modals";
import { TalkToExpertListTable } from "@/components/dashboard/talk-to-expert/talk-to-expert-list-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import {
  fetchExpertBookings,
} from "@/lib/dashboard-api";
import { mapExpertBookingListResponse } from "@/lib/dashboard-mappers";

const actionItemClass = "text-[#13203F] hover:bg-slate-50";

export function TalkToExpertTable({ variant = "full", listState, refreshToken = 0 }) {
  const internalListState = useDashboardList(fetchExpertBookings, mapExpertBookingListResponse, {
    enabled: !listState,
    refreshToken,
  });
  const { data, isLoading, error, reload } = listState ?? internalListState;

  const [qualifyRow, setQualifyRow] = useState(null);
  const [assignRow, setAssignRow] = useState(null);
  const [notesRow, setNotesRow] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const getRowActionItems = useCallback((row, { detailsHref }) => {
    const followUpSubject = encodeURIComponent("Follow up on your Talk to Expert request");
    const followUpBody = encodeURIComponent(
      `Hi ${row.name || "there"},\n\nWe wanted to follow up regarding your Talk to Expert booking with CompareX.\n\nBest regards,\nCompareX Team`,
    );

    const onboardingDone =
      row.onboardingStatus === "in_progress" || row.onboardingStatus === "yes";

    return [
      {
        type: "link",
        label: "View Profile",
        icon: HiUserCircle,
        href: detailsHref,
        className: actionItemClass,
        iconClassName: "text-[#2D4CC8]",
      },
      {
        type: "button",
        label: "Qualify",
        icon: HiCheckBadge,
        disabled: onboardingDone,
        onClick: () => setQualifyRow(row),
        className: "text-emerald-700 hover:bg-emerald-50",
        iconClassName: "text-emerald-600",
      },
      {
        type: row.email ? "link" : "button",
        label: "Send Follow Up",
        icon: HiEnvelope,
        href: row.email
          ? `mailto:${row.email}?subject=${followUpSubject}&body=${followUpBody}`
          : undefined,
        disabled: !row.email,
        className: actionItemClass,
        iconClassName: "text-[#40C3CF]",
      },
      {
        type: "button",
        label: "Assign (PG rep.)",
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
  }, []);

  const table = (
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
        <TalkToExpertListTable
          rows={data}
          isLoading={isLoading}
          getRowActionItems={getRowActionItems}
          detailsBasePath="/dashboard/talk-to-expert"
        />
      </DashboardListState>

      <TalkToExpertQualifyModal
        row={qualifyRow}
        onClose={() => setQualifyRow(null)}
        onSaved={(message) => {
          setActionMessage(message);
          setActionError("");
          reload();
        }}
      />

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

  if (variant === "overview") {
    return (
      <TalkToExpertListTable
        rows={data.slice(0, 5)}
        isLoading={isLoading}
        getRowActionItems={getRowActionItems}
        detailsBasePath="/dashboard/talk-to-expert"
      />
    );
  }

  return table;
}
