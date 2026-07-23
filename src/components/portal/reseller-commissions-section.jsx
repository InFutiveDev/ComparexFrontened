"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { fetchMyResellerCommissions } from "@/lib/reseller";
import {
  StatusBadge,
  commissionStatusTone,
  formatInr,
  formatShortDate,
  inputClass,
} from "@/lib/reseller-finance-ui";

export function ResellerCommissionsSection() {
  const [commissions, setCommissions] = useState([]);
  const [rateSlabs, setRateSlabs] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, paid: 0, total: 0 });
  const [statuses, setStatuses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: "", from: "", to: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCommissions = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyResellerCommissions({
        page,
        limit: 25,
        status: filters.status || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
      });
      setCommissions(data.commissions || []);
      setRateSlabs(data.rateSlabs || []);
      setStats(data.stats || stats);
      setStatuses(data.statuses || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load commissions");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  useEffect(() => {
    loadCommissions();
  }, [loadCommissions]);

  const pages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
            Commission Tracking
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            FR-RS-05 · Commissions from configurable rate slabs. FR-RS-06 · Pending, Approved, and
            Paid states.
          </p>
        </div>
        <Link
          href="/reseller-dashboard/invoices"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#2D4CC8]/30 bg-[#EEF2FC] px-4 py-2.5 text-sm font-semibold text-[#2D4CC8]"
        >
          Invoice & payout claims →
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Pending", stats.pending],
          ["Approved", stats.approved],
          ["Paid", stats.paid],
          ["Total earned", stats.total],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-[#13203F]">{formatInr(value)}</p>
          </div>
        ))}
      </section>

      {rateSlabs.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Active commission slabs
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {rateSlabs.map((slab) => (
              <div key={slab.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-[#13203F]">{slab.name}</p>
                <p className="mt-1 text-xs text-slate-600">{slab.description}</p>
                <p className="mt-2 text-sm font-bold text-[#2D4CC8]">
                  {slab.type === "percent" ? `${slab.value}% of GMV` : formatInr(slab.value)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <select
            className={inputClass}
            value={filters.status}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, status: e.target.value }));
            }}
          >
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
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
        </div>

        <button
          type="button"
          onClick={loadCommissions}
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
                <th className="px-3 py-3">Slab</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && commissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-slate-500">
                    No commissions yet. GMV from referred merchants generates commission entries.
                  </td>
                </tr>
              ) : (
                commissions.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-semibold text-[#13203F]">
                      {item.merchantName || "—"}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{item.rateSlabName}</td>
                    <td className="px-3 py-3 text-slate-700">{formatInr(item.amount)}</td>
                    <td className="px-3 py-3">
                      <StatusBadge
                        label={item.status}
                        tone={commissionStatusTone(item.status)}
                      />
                    </td>
                    <td className="px-3 py-3 text-slate-600">{formatShortDate(item.createdAt)}</td>
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
