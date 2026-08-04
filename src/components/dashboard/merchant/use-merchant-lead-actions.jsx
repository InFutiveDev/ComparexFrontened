"use client";

import { useCallback, useState } from "react";
import {
  HiCalendarDays,
  HiCheckBadge,
  HiDocumentText,
  HiFlag,
  HiOutlineXMark,
} from "react-icons/hi2";
import { MerchantNotesModal } from "@/components/dashboard/merchant/merchant-action-modals";
import { ApiError } from "@/lib/api";
import {
  flagMerchantForReview,
  mapMerchantToTalkToExpert,
  markMerchantActivated,
  normalizeLeadActionRow,
} from "@/lib/merchant-lead-actions";

const actionItemClass = "text-[#13203F] hover:bg-slate-50";

export function useMerchantLeadActions({ onReload } = {}) {
  const [notesRow, setNotesRow] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const runAction = useCallback(
    async (row, actionFn, confirmMessage) => {
      const normalized = normalizeLeadActionRow(row);
      if (confirmMessage && !window.confirm(confirmMessage)) return;

      setIsUpdating(true);
      setActionError("");
      setActionMessage("");

      try {
        const result = await actionFn(normalized);
        setActionMessage(result.message || "Updated successfully");
        onReload?.();
      } catch (err) {
        setActionError(err instanceof ApiError ? err.message : "Action failed");
      } finally {
        setIsUpdating(false);
      }
    },
    [onReload],
  );

  const getLeadActionItems = useCallback(
    (row) => {
      const normalized = normalizeLeadActionRow(row);
      const isFlagged = Boolean(normalized.flaggedForReview);
      const isActivated = normalized.pgLeadStatus === "live";
      const isTalkToExpert =
        Boolean(normalized.expertBookingId) ||
        normalized.leadStatus === "expert_booked";

      return [
        {
          type: "button",
          label: isActivated ? "Activated" : "Mark Activated",
          icon: HiCheckBadge,
          disabled: isActivated || isUpdating || normalized.leadStatus === "rejected",
          onClick: () =>
            runAction(
              normalized,
              markMerchantActivated,
              `Mark ${normalized.name || "this lead"} as activated?`,
            ),
          className: "text-emerald-700 hover:bg-emerald-50",
          iconClassName: "text-emerald-600",
        },
        {
          type: "button",
          label: isFlagged ? "Flagged for Review" : "Flag for Review",
          icon: HiFlag,
          disabled: isFlagged || isUpdating,
          onClick: () =>
            runAction(
              normalized,
              flagMerchantForReview,
              `Flag ${normalized.name || "this lead"} for review?`,
            ),
          className: "text-amber-700 hover:bg-amber-50",
          iconClassName: "text-amber-600",
        },
        {
          type: "button",
          label: isTalkToExpert ? "Under Talk to Expert" : "Talk to Expert",
          icon: HiCalendarDays,
          disabled: isTalkToExpert || isUpdating || normalized.leadStatus === "rejected",
          onClick: () =>
            runAction(
              normalized,
              mapMerchantToTalkToExpert,
              `Map ${normalized.name || "this lead"} under Talk to Expert?`,
            ),
          className: "text-[#0f766e] hover:bg-[#40C3CF]/10",
          iconClassName: "text-[#40C3CF]",
        },
        {
          type: "button",
          label: "Notes",
          icon: HiDocumentText,
          onClick: () => setNotesRow(normalized),
          className: actionItemClass,
          iconClassName: "text-violet-600",
        },
      ];
    },
    [isUpdating, runAction],
  );

  const actionBanners = (
    <>
      {actionMessage ? (
        <div className="relative mb-4 rounded-xl border border-emerald-200 bg-emerald-50 py-3 pl-4 pr-11 text-sm text-emerald-800">
          <button
            type="button"
            onClick={() => setActionMessage("")}
            className="absolute right-3 top-3 inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-emerald-700 transition hover:bg-emerald-100"
            aria-label="Dismiss message"
          >
            <HiOutlineXMark className="size-4" aria-hidden />
          </button>
          {actionMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="relative mb-4 rounded-xl border border-red-200 bg-red-50 py-3 pl-4 pr-11 text-sm text-red-700">
          <button
            type="button"
            onClick={() => setActionError("")}
            className="absolute right-3 top-3 inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-red-600 transition hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <HiOutlineXMark className="size-4" aria-hidden />
          </button>
          {actionError}
        </div>
      ) : null}
    </>
  );

  const notesModal = (
    <MerchantNotesModal
      row={notesRow}
      onClose={() => setNotesRow(null)}
      onSaved={(message) => {
        setActionMessage(message);
        setActionError("");
        onReload?.();
      }}
    />
  );

  return {
    getLeadActionItems,
    actionBanners,
    notesModal,
    isUpdating,
    setActionMessage,
    setActionError,
  };
}
