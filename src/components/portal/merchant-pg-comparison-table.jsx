"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HiAdjustmentsHorizontal,
  HiArrowPath,
  HiStar,
} from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { fetchPgComparison } from "@/lib/pg-compare";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const TAT_LABELS = {
  instant: "Instant",
  "1-2-days": "1–2 days",
  "3-5-days": "3–5 days",
  "1-week-plus": "1 week+",
};

const SETTLEMENT_LABELS = {
  "t+0": "T+0",
  "t+1": "T+1",
  "t+2": "T+2",
  "t+3": "T+3",
  weekly: "Weekly",
};

function formatLabel(value) {
  if (!value) return "—";
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function PgLogo({ row }) {
  const [failed, setFailed] = useState(false);
  if (!row.logoUrl || failed) {
    return (
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FC] text-sm font-bold text-[#2D4CC8]">
        {row.initials}
      </div>
    );
  }

  return (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={row.logoUrl}
        alt=""
        className="max-h-full max-w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function MerchantPgComparisonTable() {
  const [rows, setRows] = useState([]);
  const [options, setOptions] = useState({
    categories: [],
    paymentModes: [],
    tatOptions: [],
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    paymentMode: "credit_card",
    tat: "",
    minRating: "",
    maxMdr: "",
    sort: "name_asc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchPgComparison(filters);
      setRows(data.paymentGateways || []);
      setOptions(data.filters || options);
    } catch (err) {
      setRows([]);
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load payment gateway comparison",
      );
    } finally {
      setIsLoading(false);
    }
    // options is only the fallback shape.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const timer = window.setTimeout(load, filters.search ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [load, filters.search]);

  const selectedMode = useMemo(
    () =>
      options.paymentModes.find((mode) => mode.value === filters.paymentMode) || {
        label: "Credit Card",
      },
    [options.paymentModes, filters.paymentMode],
  );

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      search: "",
      category: "",
      paymentMode: "credit_card",
      tat: "",
      minRating: "",
      maxMdr: "",
      sort: "name_asc",
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Dynamic PG Comparison
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Compare all active payment gateways by MDR, onboarding TAT, supported
          categories, features, and merchant ratings.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <HiAdjustmentsHorizontal className="size-5 text-[#2D4CC8]" />
          <h3 className="font-bold text-[#13203F]">Filter and sort · FR-MC-03</h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <input
            className={inputClass}
            placeholder="Search PG, feature, category…"
            value={filters.search}
            onChange={(event) => setFilter("search", event.target.value)}
          />
          <select
            className={inputClass}
            value={filters.paymentMode}
            onChange={(event) => setFilter("paymentMode", event.target.value)}
          >
            {options.paymentModes.length === 0 ? (
              <option value="credit_card">Credit Card</option>
            ) : null}
            {options.paymentModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                MDR mode: {mode.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.1"
            className={inputClass}
            placeholder={`Maximum ${selectedMode.label} MDR %`}
            value={filters.maxMdr}
            onChange={(event) => setFilter("maxMdr", event.target.value)}
          />
          <select
            className={inputClass}
            value={filters.tat}
            onChange={(event) => setFilter("tat", event.target.value)}
          >
            <option value="">All onboarding TAT</option>
            {options.tatOptions.map((tat) => (
              <option key={tat} value={tat}>
                {TAT_LABELS[tat] || formatLabel(tat)}
              </option>
            ))}
          </select>
          <select
            className={inputClass}
            value={filters.category}
            onChange={(event) => setFilter("category", event.target.value)}
          >
            <option value="">All categories</option>
            {options.categories.map((category) => (
              <option key={category} value={category}>
                {formatLabel(category)}
              </option>
            ))}
          </select>
          <select
            className={inputClass}
            value={filters.minRating}
            onChange={(event) => setFilter("minRating", event.target.value)}
          >
            <option value="">All ratings</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
          </select>
          <select
            className={inputClass}
            value={filters.sort}
            onChange={(event) => setFilter("sort", event.target.value)}
          >
            <option value="name_asc">Sort: PG name</option>
            <option value="mdr_asc">Sort: Lowest MDR</option>
            <option value="tat_asc">Sort: Fastest TAT</option>
            <option value="rating_desc">Sort: Highest rating</option>
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
          >
            <HiArrowPath className="size-4" /> Reset filters
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <p className="text-sm font-semibold text-[#13203F]">
            {isLoading ? "Loading active PGs…" : `${rows.length} active PGs`}
          </p>
          {isLoading ? <HiArrowPath className="size-5 animate-spin text-[#2D4CC8]" /> : null}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Payment Gateway</th>
                <th className="px-4 py-3">{selectedMode.label} MDR</th>
                <th className="px-4 py-3">TAT / Settlement</th>
                <th className="px-4 py-3">Supported Categories</th>
                <th className="px-4 py-3">Features</th>
                <th className="px-4 py-3">Ratings</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No active payment gateways match these filters.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <PgLogo row={row} />
                        <div>
                          <p className="font-bold text-[#13203F]">{row.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {row.location || "Location not specified"}
                          </p>
                          {row.website ? (
                            <a
                              href={row.website}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 block text-xs font-semibold text-[#2D4CC8] hover:underline"
                            >
                              Visit website
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-base font-bold text-[#13203F]">
                        {row.mdr?.[filters.paymentMode] || "Not configured"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{selectedMode.label}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <p className="font-semibold text-[#13203F]">
                        {TAT_LABELS[row.onboardingTat] || "Not configured"}
                      </p>
                      <p className="mt-1 text-xs">
                        Settlement:{" "}
                        {SETTLEMENT_LABELS[row.settlementCycle] ||
                          formatLabel(row.settlementCycle)}
                      </p>
                    </td>
                    <td className="max-w-60 px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {row.categories?.length ? (
                          row.categories.slice(0, 5).map((category) => (
                            <span
                              key={category}
                              className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700"
                            >
                              {formatLabel(category)}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="max-w-72 px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {row.features?.length ? (
                          row.features.slice(0, 6).map((feature) => (
                            <span
                              key={feature}
                              className="rounded-full bg-[#EEF2FC] px-2.5 py-1 text-xs font-medium text-[#2D4CC8]"
                            >
                              {formatLabel(feature)}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {row.rating?.count > 0 ? (
                        <div className="flex items-center gap-1 text-amber-500">
                          <HiStar className="size-4" />
                          <span className="font-bold text-[#13203F]">
                            {row.rating.average.toFixed(1)}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({row.rating.count})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-500">No ratings yet</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
