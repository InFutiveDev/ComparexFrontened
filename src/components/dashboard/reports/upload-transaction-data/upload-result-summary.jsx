"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { downloadTransactionErrorLog } from "@/lib/reports-api";
import { ProcessedTransactionsTable } from "@/components/dashboard/reports/processed-transactions-table";
import { SkippedRowsTable } from "@/components/dashboard/reports/upload-transaction-data/skipped-rows-table";

function StatCard({ label, value, tone = "neutral" }) {
  const tones = {
    neutral: "border-slate-200 bg-white text-[#13203F]",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${tones[tone] || tones.neutral}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}

export function UploadResultSummary({ result }) {
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  if (!result) return null;

  const {
    batchId,
    detectedFormat,
    totalRows = 0,
    successCount = 0,
    skippedCount = 0,
    nonRevenueCount = 0,
    skippedRowsPreview = [],
    nonRevenueRowsPreview = [],
    downloadErrorLogUrl,
    savedCount = 0,
  } = result;

  async function handleDownloadLog() {
    setDownloadError("");
    setIsDownloading(true);
    try {
      await downloadTransactionErrorLog(downloadErrorLogUrl, batchId);
    } catch (err) {
      setDownloadError(
        err instanceof ApiError ? err.message : "Failed to download error log",
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-5" aria-live="polite">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
        <p className="font-semibold">Upload processed successfully</p>
        <p className="mt-1">
          Reseller dashboards and commission reports will reflect processed transactions.
        </p>
        {savedCount > 0 ? (
          <p className="mt-1 font-medium">
            {savedCount} successful transaction{savedCount === 1 ? "" : "s"} saved to the list below.
          </p>
        ) : null}
        {batchId ? (
          <p className="mt-2 text-xs text-emerald-800">
            Batch ID: <span className="font-mono">{batchId}</span>
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Rows" value={totalRows} />
        <StatCard label="Successful" value={successCount} tone="success" />
        <StatCard label="Skipped — Errors" value={skippedCount} tone="error" />
        <StatCard label="Non-Revenue" value={nonRevenueCount} tone="warning" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-slate-700">
          Processed {totalRows} row{totalRows === 1 ? "" : "s"}: {successCount} succeeded,{" "}
          {skippedCount} skipped due to errors, {nonRevenueCount} non-revenue transaction
          {nonRevenueCount === 1 ? "" : "s"}.
        </p>
        {detectedFormat ? (
          <span className="inline-flex rounded-full bg-[#EEF2FC] px-3 py-1 text-xs font-medium text-[#2D4CC8] ring-1 ring-[#2D4CC8]/10">
            Format: {detectedFormat}
          </span>
        ) : null}
      </div>

      {downloadErrorLogUrl ? (
        <div>
          <button
            type="button"
            onClick={handleDownloadLog}
            disabled={isDownloading}
            className="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#13203F] transition hover:bg-slate-50 disabled:opacity-60"
          >
            {isDownloading ? "Downloading…" : "Download error log"}
          </button>
          {downloadError ? (
            <p className="mt-2 text-sm text-red-700">{downloadError}</p>
          ) : null}
        </div>
      ) : null}

      {skippedCount > 0 ? (
        <SkippedRowsTable
          title="Skipped rows (errors)"
          rows={skippedRowsPreview}
          totalCount={skippedCount}
          variant="error"
        />
      ) : null}

      {nonRevenueCount > 0 ? (
        <SkippedRowsTable
          title="Non-Revenue Transactions (no error — payment was not successful)"
          rows={nonRevenueRowsPreview}
          totalCount={nonRevenueCount}
          variant="info"
        />
      ) : null}

      {batchId && savedCount > 0 ? (
        <ProcessedTransactionsTable
          batchId={batchId}
          title="Saved from this upload"
          refreshToken={savedCount}
        />
      ) : null}
    </div>
  );
}
