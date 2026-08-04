"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiChevronDown } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { updateMerchantAdmin } from "@/lib/dashboard-api";
import {
  formatMerchantListStatus,
  isMerchantDemoReady,
  stripDemoReadyMarker,
  withDemoReadyMarker,
} from "@/lib/dashboard-mappers";

const STATUS_OPTIONS = [
  { value: "qualified", label: "Qualified" },
  { value: "demo_ready", label: "Demo ready" },
];

const statusStyles = {
  Raw: "bg-slate-100 text-slate-700",
  "Talk to Expert": "bg-[#40C3CF]/15 text-[#0f766e]",
  Qualified: "bg-emerald-100 text-emerald-700",
  "Demo ready": "bg-amber-100 text-amber-800",
  Assigned: "bg-[#2D4CC8]/10 text-[#2D4CC8]",
  Rejected: "bg-red-100 text-red-700",
};

function StatusChip({ label, withChevron = false }) {
  const className = statusStyles[label] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${className}`}
    >
      {String(label).toUpperCase()}
      {withChevron ? <HiChevronDown className="size-3.5 opacity-70" aria-hidden /> : null}
    </span>
  );
}

function isOptionActive(row, optionValue) {
  if (optionValue === "demo_ready") return isMerchantDemoReady(row);
  if (optionValue === "qualified") {
    return row.leadStatus === "qualified" && !isMerchantDemoReady(row);
  }
  return row.leadStatus === optionValue;
}

async function updateMerchantListStatus(row, option) {
  if (option.value === "qualified") {
    return updateMerchantAdmin(row.id, {
      leadStatus: "qualified",
      qualificationNotes: stripDemoReadyMarker(row.qualificationNotes) || null,
    });
  }

  if (option.value === "demo_ready") {
    try {
      return await updateMerchantAdmin(row.id, {
        leadStatus: "demo_ready",
        qualificationNotes: withDemoReadyMarker(row.qualificationNotes),
      });
    } catch (err) {
      // Live API rejects demo_ready — store via in_review + notes marker.
      const message = err instanceof ApiError ? err.message : "";
      if (!/invalid lead status/i.test(message)) {
        throw err;
      }

      return updateMerchantAdmin(row.id, {
        leadStatus: "in_review",
        qualificationNotes: withDemoReadyMarker(row.qualificationNotes),
      });
    }
  }

  return updateMerchantAdmin(row.id, { leadStatus: option.value });
}

export function MerchantStatusCell({ row, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [menuStyle, setMenuStyle] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const label = formatMerchantListStatus(row);
  const canEdit = row.leadStatus !== "rejected";
  const isFlagged = Boolean(row.flaggedForReview);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setMenuStyle(null);
      return undefined;
    }

    function updatePosition() {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 180;
      const left = Math.min(rect.left, window.innerWidth - menuWidth - 8);
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 6,
        left: Math.max(8, left),
        width: menuWidth,
        zIndex: 80,
      });
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (
        triggerRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleSelect(option) {
    if (isUpdating || isOptionActive(row, option.value)) {
      setOpen(false);
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const result = await updateMerchantListStatus(row, option);
      setOpen(false);
      onUpdated?.(result.message || `Status updated to ${option.label}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  }

  if (!canEdit) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusChip label={label} />
        {isFlagged ? (
          <span className="inline-flex rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-700">
            FLAGGED
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          disabled={isUpdating}
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          aria-expanded={open}
          aria-haspopup="listbox"
          title="Update lead status"
        >
          <StatusChip label={isUpdating ? "Updating…" : label} withChevron />
        </button>
        {isFlagged ? (
          <span className="inline-flex rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-700">
            FLAGGED
          </span>
        ) : null}
      </div>

      {error && !open ? <p className="mt-1 max-w-[140px] text-[10px] text-red-500">{error}</p> : null}

      {open && menuStyle && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="listbox"
              style={menuStyle}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-[#13203F]/12"
            >
              <p className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Mark as
              </p>
              {STATUS_OPTIONS.map((option) => {
                const active = isOptionActive(row, option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    disabled={isUpdating}
                    onClick={() => handleSelect(option)}
                    className={`flex w-full cursor-pointer items-center px-3 py-2.5 text-left text-sm transition hover:bg-[#EEF2FC] disabled:cursor-not-allowed disabled:opacity-60 ${
                      active ? "font-semibold text-[#2D4CC8]" : "text-[#13203F]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
              {error ? (
                <p className="border-t border-slate-100 px-3 py-2 text-xs text-red-600">{error}</p>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
