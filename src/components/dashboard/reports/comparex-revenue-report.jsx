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
import { fetchComparexRevenueReport } from "@/lib/reports-api";

export function ComparexRevenueReport({ backHref = "/dashboard/reports" }) {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pgName, setPgName] = useState("");
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
      const data = await fetchComparexRevenueReport({
        page,
        limit,
        search: debouncedSearch || undefined,
        pgName: pgName || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setRows(data.rows || []);
      setSummary(data.summary || null);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load report");
      setRows([]);
      setSummary(null);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, from, page, pgName, to]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pgName, from, to]);

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
          CompareX Revenue Report
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Detailed CompareX markup revenue from processed PG transactions — PG MDR fee × CompareX
          share per row.
        </p>
      </div>

      <ReportSummaryCards
        items={[
          {
            label: "CompareX Revenue",
            value: formatInr(summary?.totalComparexRevenue),
            tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
          },
          {
            label: "Total PG MDR",
            value: formatInr(summary?.totalPgMdrAmount),
          },
          {
            label: "Transaction Volume",
            value: formatInr(summary?.totalTransactionAmount),
          },
          {
            label: "Transactions",
            value: summary?.transactionCount ?? 0,
            hint: `Avg revenue ${formatInr(summary?.averageComparexRevenue)}`,
          },
        ]}
      />

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-4 border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-[#13203F]">Detailed transactions</h3>
          <ReportFilters
            search={search}
            onSearchChange={setSearch}
            pgName={pgName}
            onPgNameChange={setPgName}
            from={from}
            onFromChange={setFrom}
            to={to}
            onToChange={setTo}
          />
        </div>

        {error ? (
          <div className="px-5 py-4 text-sm text-red-700">{error}</div>
        ) : isLoading ? (
          <div className="px-5 py-8 text-sm text-slate-500">Loading report…</div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-500">
            No revenue data yet. Upload transaction data to populate this report.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">PG</th>
                  <th className="px-4 py-3">Merchant</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">PG MDR</th>
                  <th className="px-4 py-3">CompareX Revenue</th>
                  <th className="px-4 py-3">PG Rev Spec</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Processed</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-[#13203F]">{row.txnId || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{row.transactionDate || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{row.pgName || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{row.merchantName || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{formatInr(row.amount)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatInr(row.pgMdrAmount)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-700">
                      {formatInr(row.comparexRevenue)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.pgRevenue || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{row.paymentMode || "—"}</td>
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
