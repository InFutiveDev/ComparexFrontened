"use client";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

export function PgSelector({
  detectedFormat,
  pgName,
  pgOptions,
  isLoadingOptions,
  isSubmitting,
  onPgNameChange,
  onRetry,
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <h3 className="text-sm font-semibold text-amber-900">Payment gateway required</h3>
      <p className="mt-2 text-sm text-amber-800">
        This file is a raw {detectedFormat || "PG"} export — please confirm which Payment Gateway
        it&apos;s from.
      </p>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-amber-900/80">
          Payment Gateway
        </label>
        <select
          className={inputClass}
          value={pgName}
          onChange={(event) => onPgNameChange(event.target.value)}
          disabled={isLoadingOptions || isSubmitting}
        >
          <option value="">
            {isLoadingOptions ? "Loading payment gateways…" : "Select payment gateway"}
          </option>
          {pgOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onRetry}
          disabled={isSubmitting || !pgName || isLoadingOptions}
          className="cursor-pointer rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243da8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Processing…" : "Retry Upload"}
        </button>
      </div>
    </div>
  );
}
