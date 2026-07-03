"use client";

import { useCallback, useEffect, useState } from "react";
import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { toMerchantSupportTableRow } from "@/lib/merchant-support-options";

const merchantSupportLabels = {
  search: "Search support requests",
  empty: "No form submissions yet",
  emptyHint: "Submissions from the home page form will appear here.",
  filterTitle: "Filter Support Requests",
  filterDescription: "Refine requests by status, industry, and more",
  upload: "Upload Requests",
  download: "Download requests",
  assign: "Assign Request",
  delete: "Delete Request",
};

export function MerchantSupportTable({ variant = "full", refreshToken = 0 }) {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/merchant-support", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load submissions");
      }

      setRows((data.submissions ?? []).map(toMerchantSupportTableRow));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load submissions");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions, refreshToken]);

  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white px-5 py-14 text-center">
        <p className="text-sm font-semibold text-[#13203F]">Loading support requests...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden rounded-lg border border-red-200 bg-red-50 px-5 py-10 text-center">
        <p className="text-sm font-semibold text-red-700">{error}</p>
        <button
          type="button"
          onClick={loadSubmissions}
          className="mt-3 cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2D4CC8] ring-1 ring-[#2D4CC8]/20"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <CrmDataTable
      data={rows}
      variant={variant}
      labels={merchantSupportLabels}
      searchType="merchant"
      detailsBasePath="/dashboard/merchant-support"
      detailsWorkType="Merchant Support"
    />
  );
}
