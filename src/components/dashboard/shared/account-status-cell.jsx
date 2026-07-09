"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import {
  updateMerchantAccountStatus,
  updatePaymentAccountStatus,
  updateResellerAccountStatus,
} from "@/lib/dashboard-api";

const accountStatusStyles = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

const updateFns = {
  merchant: updateMerchantAccountStatus,
  reseller: updateResellerAccountStatus,
  payment: updatePaymentAccountStatus,
};

function formatStatus(status) {
  return status === "active" ? "Active" : "Inactive";
}

export function AccountStatusCell({ row, resource, onUpdated }) {
  const [status, setStatus] = useState(row.accountStatus ?? "inactive");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    if (!row.userId || isUpdating) return;

    const nextStatus = status === "active" ? "inactive" : "active";
    setIsUpdating(true);
    setError("");

    try {
      await updateFns[resource](row.id, nextStatus);
      setStatus(nextStatus);
      onUpdated?.(row.id, nextStatus);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  }

  if (!row.userId) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isUpdating}
        title={status === "active" ? "Click to deactivate login" : "Click to activate login"}
        className={`inline-flex cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ring-1 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
          accountStatusStyles[status] ?? accountStatusStyles.inactive
        }`}
      >
        {isUpdating ? "Updating..." : formatStatus(status)}
      </button>
      {error ? <p className="text-[10px] text-red-500">{error}</p> : null}
    </div>
  );
}
