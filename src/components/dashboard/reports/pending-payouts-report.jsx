"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi2";
import {
  formatInr,
  formatReportDate,
  ReportFilters,
  ReportPagination,
  ReportSummaryCards,
} from "@/components/dashboard/reports/report-ui";
import { ApiError } from "@/lib/api";
import { fetchPendingPayoutsReport } from "@/lib/reports-api";

export function PendingPayoutsReport({ backHref = "/dashboard/reports" }) {
  const [rows, setRows] = useState([]);
  const [resellerBreakdown, setResellerBreakdown] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pgName, setPgName] = useState("");
  const [mid, setMid] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 15;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchPendingPayoutsReport({
        page,
        limit,
        search: debouncedSearch || undefined,
        pgName: pgName || undefined,
        mid: mid || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setRows(data.rows || []);
      setResellerBreakdown(data.resellerBreakdown || []);
      setSummary(data.summary || null);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load report");
      setRows([]);
      setResellerBreakdown([]);
      setSummary(null);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, from, mid, page, pgName, to]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pgName, mid, from, to]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

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
          Pending Payouts
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Outstanding reseller commissions awaiting payout — grouped by reseller MID with a
          transaction-level detail view.
        </p>
      </div>

      <ReportSummaryCards
        items={[
          {
            label: "Total Pending",
            value: formatInr(summary?.totalPendingPayout),
            tone: "border-amber-200 bg-amber-50 text-amber-900",
          },
          {
            label: "Resellers",
            value: summary?.resellerCount ?? 0,
          },
          {
            label: "Transactions",
            value: summary?.transactionCount ?? 0,
          },
          {
            label: "Avg per Reseller",
            value: formatInr(
              summary?.resellerCount
                ? (summary?.totalPendingPayout || 0) / summary.resellerCount
                : 0,
            ),
          },
        ]}
      />

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-[#13203F]">Pending by reseller</h3>
        </div>
        {resellerBreakdown.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-500">No pending payouts.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Reseller MID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Transactions</th>
                  <th className="px-4 py-3">Pending Payout</th>
                </tr>
              </thead>
              <tbody>
                {resellerBreakdown.map((item) => (
                  <tr key={item.resellerMid || "unknown"} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-[#13203F]">
                      {item.resellerMid || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{item.resellerName || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{item.transactionCount}</td>
                    <td className="px-4 py-3 font-semibold text-amber-800">
                      {formatInr(item.pendingCommission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-4 border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-[#13203F]">Transaction detail</h3>
          <ReportFilters
            search={search}
            onSearchChange={setSearch}
            pgName={pgName}
            onPgNameChange={setPgName}
            mid={mid}
            onMidChange={setMid}
            from={from}
            onFromChange={setFrom}
            to={to}
            onToChange={setTo}
            showMid
          />
        </div>

        {error ? (
          <div className="px-5 py-4 text-sm text-red-700">{error}</div>
        ) : isLoading ? (
          <div className="px-5 py-8 text-sm text-slate-500">Loading report…</div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-500">No pending payout transactions.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Reseller MID</th>
                  <th className="px-4 py-3">Merchant</th>
                  <th className="px-4 py-3">PG</th>
                  <th className="px-4 py-3">Txn Date</th>
                  <th className="px-4 py-3">Commission Due</th>
                  <th className="px-4 py-3">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-[#13203F]">{row.txnId || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{row.resellerMid || row.mid || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{row.merchantName || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{row.pgName || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{row.transactionDate || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-amber-800">
                      {formatInr(row.resellerCommission)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatReportDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ReportPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}
