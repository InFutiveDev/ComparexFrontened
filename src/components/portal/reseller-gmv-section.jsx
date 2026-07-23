"use client";

import { useCallback, useEffect, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { fetchMyResellerGmv } from "@/lib/reseller";
import { formatInr, formatShortDate, inputClass } from "@/lib/reseller-finance-ui";

export function ResellerGmvSection() {
  const [records, setRecords] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [totalGmv, setTotalGmv] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ from: "", to: "", merchantId: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGmv = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyResellerGmv({
        page,
        limit: 25,
        from: filters.from || undefined,
        to: filters.to || undefined,
        merchantId: filters.merchantId || undefined,
      });
      setRecords(data.records || []);
      setMerchants(data.merchants || []);
      setTotalGmv(data.totalGmv || 0);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load GMV data");
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadGmv();
  }, [loadGmv]);

  const pages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">GMV Tracking</h2>
        <p className="mt-1 text-sm text-slate-600">
          FR-RS-03 · GMV from referred merchants. FR-RS-04 · Filter by date range and merchant.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total GMV</p>
          <p className="mt-2 text-2xl font-bold text-[#13203F]">{formatInr(totalGmv)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Records</p>
          <p className="mt-2 text-2xl font-bold text-[#13203F]">{total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Merchants</p>
          <p className="mt-2 text-2xl font-bold text-[#13203F]">{merchants.length}</p>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="date"
            className={inputClass}
            value={filters.from}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, from: e.target.value }));
            }}
          />
          <input
            type="date"
            className={inputClass}
            value={filters.to}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, to: e.target.value }));
            }}
          />
          <select
            className={inputClass}
            value={filters.merchantId}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, merchantId: e.target.value }));
            }}
          >
            <option value="">All merchants</option>
            {merchants.map((merchant) => (
              <option key={merchant.id} value={merchant.id}>
                {merchant.businessName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={loadGmv}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          <HiArrowPath className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Merchant</th>
                <th className="px-3 py-3">GMV</th>
                <th className="px-3 py-3">Period</th>
                <th className="px-3 py-3">Recorded</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center text-slate-500">
                    No GMV records for these filters yet.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-semibold text-[#13203F]">{record.merchantName}</td>
                    <td className="px-3 py-3 text-slate-700">{formatInr(record.amount)}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {formatShortDate(record.periodStart)} – {formatShortDate(record.periodEnd)}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{formatShortDate(record.recordedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {page} of {pages} · {total} result{total === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((value) => Math.min(pages, value + 1))}
              className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
