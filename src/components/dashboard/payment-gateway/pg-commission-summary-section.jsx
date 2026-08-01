"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { fetchPgCommissionSummary } from "@/lib/dashboard-api";
import { getMerchantTimeRangeBounds } from "@/lib/dashboard-mappers";

const modelOptions = [
  { value: "revenue", label: "Revenue (MDR)" },
  { value: "per_lead", label: "Per lead" },
];

function formatInr(value) {
  const amount = Number(value) || 0;
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function PgCommissionSummarySection({ activeRange = "Month" }) {
  const [model, setModel] = useState("revenue");
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const bounds = useMemo(() => getMerchantTimeRangeBounds(activeRange), [activeRange]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchPgCommissionSummary({
          from: bounds?.start,
          to: bounds?.end,
          model,
        });
        if (!cancelled) {
          setSummary(data.summary ?? null);
        }
      } catch {
        if (!cancelled) {
          setSummary(null);
          setError("Could not load commission summary. Ensure local API is running with latest code.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [bounds, model]);

  const totals = summary?.totals ?? {};
  const isPerLead = model === "per_lead";

  const kpiCards = isPerLead
    ? [
        { label: "CompareX fees (period)", value: formatInr(totals.comparexRevenue) },
        { label: "Billable live leads", value: String(totals.billableLeads ?? 0) },
        { label: "Default fee / lead", value: formatInr(totals.feePerLead) },
        { label: "PGs with activity", value: String(totals.partnerCount ?? 0) },
      ]
    : [
        { label: "CompareX revenue (period)", value: formatInr(totals.comparexRevenue) },
        { label: "Transactions", value: String(totals.transactionCount ?? 0) },
        { label: "GMV processed", value: formatInr(totals.transactionAmount) },
        { label: "PGs in data", value: String(totals.partnerCount ?? 0) },
      ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#13203F]">CompareX commission sum-up</h3>
          <p className="mt-1 text-sm text-slate-500">
            Period: <span className="font-medium text-[#13203F]">{activeRange}</span>
            {summary?.formula ? (
              <>
                {" "}
                · <span className="text-slate-600">{summary.formula}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white p-1">
          {modelOptions.map((option) => {
            const active = model === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setModel(option.value)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-white shadow-sm"
                    : "text-[#13203F]/70 hover:bg-slate-50 hover:text-[#13203F]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 px-4 py-6 text-sm text-amber-900">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map((card) => (
              <article
                key={card.label}
                className="rounded-xl border border-slate-100 bg-gradient-to-br from-[#EEF2FC] to-white p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                {isLoading ? (
                  <div className="mt-2 h-8 w-24 animate-pulse rounded bg-slate-200" />
                ) : (
                  <p className="mt-2 text-2xl font-bold text-[#13203F]">{card.value}</p>
                )}
              </article>
            ))}
          </div>

          {!isLoading && (summary?.topPartners?.length ?? 0) > 0 ? (
            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-100">
              <table className="min-w-[640px] w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2.5">PG</th>
                    <th className="px-3 py-2.5">{isPerLead ? "Live leads" : "Txns"}</th>
                    <th className="px-3 py-2.5">CompareX {isPerLead ? "fees" : "revenue"}</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topPartners.map((row) => (
                    <tr key={row.pgName} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-2.5 font-medium text-[#13203F]">{row.pgName}</td>
                      <td className="px-3 py-2.5 text-slate-700">{row.transactionCount}</td>
                      <td className="px-3 py-2.5 font-semibold text-[#25a36f]">
                        {formatInr(row.comparexRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <Link
          href="/dashboard/reports/comparex-revenue"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D4CC8] hover:underline"
        >
          View detailed revenue report
          <HiArrowTopRightOnSquare className="size-4" aria-hidden />
        </Link>
        <span className="text-xs text-slate-400">
          Revenue view uses uploaded transaction data; per-lead view uses live onboarded leads ×
          platform fee.
        </span>
      </div>
    </section>
  );
}
