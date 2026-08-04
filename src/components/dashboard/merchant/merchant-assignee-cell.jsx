"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiChevronDown } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { fetchPaymentGateways, updateMerchantAdmin } from "@/lib/dashboard-api";
import { mapPaymentGatewayListResponse } from "@/lib/dashboard-mappers";
import { assignSubAdminLeadToPg } from "@/lib/sub-admin";

async function loadPaymentGateways() {
  const pageSize = 100;
  let page = 1;
  const allRows = [];
  const seenIds = new Set();
  let totalCount = 0;

  while (page <= 50) {
    const response = await fetchPaymentGateways({ page, limit: pageSize });
    const items = mapPaymentGatewayListResponse(response);
    totalCount = items.total ?? totalCount;

    for (const row of items.rows) {
      if (!row?.id || seenIds.has(row.id)) continue;
      seenIds.add(row.id);
      allRows.push({
        id: row.id,
        name: row.name || row.company || "Payment Gateway",
      });
    }

    if (items.rows.length === 0 || allRows.length >= totalCount || items.rows.length < pageSize) {
      break;
    }
    page += 1;
  }

  return allRows.sort((a, b) => a.name.localeCompare(b.name));
}

async function assignMerchantToPg(row, paymentGatewayId) {
  try {
    return await updateMerchantAdmin(row.id, { paymentGatewayId });
  } catch (err) {
    // Live API may not support paymentGatewayId yet — qualify then use assign endpoint.
    if (!(err instanceof ApiError) || err.status === 401 || err.status === 403) {
      throw err;
    }

    if (row.leadStatus === "rejected") {
      throw new ApiError("Rejected leads cannot be assigned", 400);
    }

    if (row.leadStatus !== "qualified" && row.leadStatus !== "assigned") {
      await updateMerchantAdmin(row.id, { leadStatus: "qualified" });
    }

    return assignSubAdminLeadToPg(row.id, { paymentGatewayId });
  }
}

export function MerchantAssigneeCell({ row, onAssigned }) {
  const isUnassigned = !row.assignedPgId && (!row.assignee || row.assignee === "Unassigned");
  const [open, setOpen] = useState(false);
  const [pgOptions, setPgOptions] = useState([]);
  const [isLoadingPgs, setIsLoadingPgs] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");
  const [menuStyle, setMenuStyle] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;

    async function load() {
      setIsLoadingPgs(true);
      setError("");
      try {
        const options = await loadPaymentGateways();
        if (!cancelled) setPgOptions(options);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load payment gateways");
          setPgOptions([]);
        }
      } finally {
        if (!cancelled) setIsLoadingPgs(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setMenuStyle(null);
      return undefined;
    }

    function updatePosition() {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 240;
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

  async function handleSelect(pg) {
    if (isAssigning) return;
    setIsAssigning(true);
    setError("");

    try {
      const result = await assignMerchantToPg(row, pg.id);
      setOpen(false);
      onAssigned?.(result.message || `Assigned to ${pg.name}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to assign payment gateway");
    } finally {
      setIsAssigning(false);
    }
  }

  if (!isUnassigned) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: row.assigneeColor }}
          title={row.assignee}
        >
          {row.assigneeInitials}
        </div>
        <span className="hidden text-xs text-slate-600 xl:inline">{row.assignee}</span>
      </div>
    );
  }

  if (row.leadStatus === "rejected") {
    return (
      <span className="text-xs font-medium text-slate-400" title="Rejected leads cannot be assigned">
        Unassigned
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={isAssigning}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-[#EEF2FC] hover:text-[#2D4CC8] hover:ring-[#2D4CC8]/25 disabled:cursor-not-allowed disabled:opacity-60"
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Assign to a payment gateway"
      >
        {isAssigning ? "Assigning…" : "Unassigned"}
        <HiChevronDown className={`size-3.5 transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {error && !open ? <p className="mt-1 max-w-[140px] text-[10px] text-red-500">{error}</p> : null}

      {open && menuStyle && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="listbox"
              style={menuStyle}
              className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-[#13203F]/12"
            >
              <p className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Assign to PG
              </p>
              {isLoadingPgs ? (
                <p className="px-3 py-3 text-sm text-slate-500">Loading PGs…</p>
              ) : pgOptions.length === 0 ? (
                <p className="px-3 py-3 text-sm text-slate-500">No payment gateways found</p>
              ) : (
                pgOptions.map((pg) => (
                  <button
                    key={pg.id}
                    type="button"
                    role="option"
                    disabled={isAssigning}
                    onClick={() => handleSelect(pg)}
                    className="flex w-full cursor-pointer items-center px-3 py-2.5 text-left text-sm text-[#13203F] transition hover:bg-[#EEF2FC] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pg.name}
                  </button>
                ))
              )}
              {error ? <p className="border-t border-slate-100 px-3 py-2 text-xs text-red-600">{error}</p> : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
