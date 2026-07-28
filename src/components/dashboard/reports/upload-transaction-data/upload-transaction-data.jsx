"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiArrowLeft } from "react-icons/hi2";
import { FileDropzone } from "@/components/dashboard/reports/upload-transaction-data/file-dropzone";
import { PgSelector } from "@/components/dashboard/reports/upload-transaction-data/pg-selector";
import { TemplateHelpPanel } from "@/components/dashboard/reports/upload-transaction-data/template-help-panel";
import { UploadResultSummary } from "@/components/dashboard/reports/upload-transaction-data/upload-result-summary";
import { useUploadTransactionFile } from "@/hooks/use-upload-transaction-file";
import { fetchPaymentGateways } from "@/lib/dashboard-api";
import { pgNameToSlug } from "@/lib/reports-api";
import { fetchAssignablePaymentGateways } from "@/lib/sub-admin";

function mapPgListResponse(data) {
  const list = data?.paymentGateways || data?.items || [];
  return list.map((pg) => {
    const label = pg.companyName || pg.name || pg.slug || "Unknown PG";
    const value = pg.slug || pgNameToSlug(label);
    return { value, label };
  });
}

export function UploadTransactionData({
  backHref = "/dashboard/reports",
  useSubAdminPgList = false,
}) {
  const {
    file,
    pgName,
    setPgName,
    detectedFormat,
    needsPgSelection,
    result,
    error,
    isUploading,
    selectFile,
    clearFile,
    upload,
    retryWithPgName,
    reset,
  } = useUploadTransactionFile();

  const [pgOptions, setPgOptions] = useState([]);
  const [isLoadingPgOptions, setIsLoadingPgOptions] = useState(false);

  const loadPgOptions = useCallback(async () => {
    setIsLoadingPgOptions(true);
    try {
      const fetcher = useSubAdminPgList
        ? fetchAssignablePaymentGateways
        : fetchPaymentGateways;
      const data = await fetcher({ page: 1, limit: 100 });
      setPgOptions(mapPgListResponse(data));
    } catch {
      setPgOptions([]);
    } finally {
      setIsLoadingPgOptions(false);
    }
  }, [useSubAdminPgList]);

  useEffect(() => {
    if (needsPgSelection) {
      loadPgOptions();
    }
  }, [needsPgSelection, loadPgOptions]);

  useEffect(() => {
    if (!needsPgSelection || !detectedFormat || pgName || !pgOptions.length) return;
    const match = pgOptions.find(
      (option) =>
        option.value === detectedFormat ||
        pgNameToSlug(option.label) === pgNameToSlug(detectedFormat),
    );
    if (match) setPgName(match.value);
  }, [needsPgSelection, detectedFormat, pgName, pgOptions, setPgName]);

  const canUpload = Boolean(file) && !isUploading && !needsPgSelection && !result;

  const uploadButtonLabel = useMemo(() => {
    if (isUploading) return "Processing…";
    return "Upload & Process";
  }, [isUploading]);

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2D4CC8] transition hover:text-[#243da8]"
        >
          <HiArrowLeft className="size-4" aria-hidden />
          Back to Reports
        </Link>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Upload Transaction Data
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Upload a PG transaction report to map MIDs, calculate CompareX revenue, and update
          reseller commissions.
        </p>
      </div>

      <TemplateHelpPanel />

      {!result ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FileDropzone
            file={file}
            onFileSelected={selectFile}
            onClear={clearFile}
            disabled={isUploading}
          />

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {needsPgSelection ? (
            <div className="mt-4">
              <PgSelector
                detectedFormat={detectedFormat}
                pgName={pgName}
                pgOptions={pgOptions}
                isLoadingOptions={isLoadingPgOptions}
                isSubmitting={isUploading}
                onPgNameChange={setPgName}
                onRetry={retryWithPgName}
              />
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={reset}
                disabled={isUploading || (!file && !error)}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#13203F] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => upload()}
                disabled={!canUpload}
                className="cursor-pointer rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243da8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadButtonLabel}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <UploadResultSummary result={result} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243da8]"
            >
              Upload another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
