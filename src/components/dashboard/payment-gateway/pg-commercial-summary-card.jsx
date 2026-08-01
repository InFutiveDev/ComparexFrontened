"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HiArrowTopRightOnSquare, HiCurrencyRupee } from "react-icons/hi2";
import { InfoCard } from "@/components/dashboard/shared/record-details";
import { fetchPaymentGatewayCommissionSummary } from "@/lib/dashboard-api";
import { getMerchantTimeRangeBounds } from "@/lib/dashboard-mappers";

function formatInr(value) {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function PgCommercialSummaryCard({ pgId, commercialModel = "revenue" }) {
  const [commission, setCommission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const bounds = useMemo(() => getMerchantTimeRangeBounds("Month"), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchPaymentGatewayCommissionSummary(pgId, {
          from: bounds?.start,
          to: bounds?.end,
        });
        if (!cancelled) {
          setCommission(data.commission ?? null);
        }
      } catch {
        if (!cancelled) {
          setCommission(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (pgId) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [pgId, bounds]);

  const modelLabel =
    commission?.commercialModelLabel ||
    (commercialModel === "per_lead" ? "Per lead" : "Revenue (MDR share)");

  return (
    <InfoCard title="CompareX commercial summary" icon={HiCurrencyRupee}>
      <div className="space-y-3 text-sm">
        <p className="text-slate-600">
          <span className="font-medium text-[#13203F]">Model:</span> {modelLabel} ·{" "}
          <span className="font-medium text-[#13203F]">Period:</span> This month
        </p>

        {isLoading ? (
          <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
        ) : commission ? (
          <>
            <p className="rounded-lg bg-[#EEF2FC] px-3 py-2 text-xs text-[#2D4CC8]">
              {commission.formula}
            </p>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">
                  CompareX {modelLabel.includes("Per") ? "fees" : "revenue"}
                </dt>
                <dd className="text-lg font-bold text-[#13203F]">
                  {formatInr(commission.comparexRevenue)}
                </dd>
              </div>
              {commission.commercialModel === "per_lead" ? (
                <>
                  <div>
                    <dt className="text-xs text-slate-500">Live leads (period)</dt>
                    <dd className="font-semibold text-[#13203F]">{commission.billableLeads ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Fee per lead</dt>
                    <dd className="font-semibold text-[#13203F]">
                      {formatInr(commission.feePerLead)}
                    </dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="text-xs text-slate-500">Transactions</dt>
                    <dd className="font-semibold text-[#13203F]">{commission.transactionCount ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">GMV in uploads</dt>
                    <dd className="font-semibold text-[#13203F]">
                      {formatInr(commission.transactionAmount)}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </>
        ) : (
          <p className="text-slate-500">
            No commission data for this period. Upload transactions (revenue) or onboard leads
            (per-lead).
          </p>
        )}

        <Link
          href="/dashboard/reports/comparex-revenue"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#2D4CC8] hover:underline"
        >
          Open revenue report
          <HiArrowTopRightOnSquare className="size-3.5" aria-hidden />
        </Link>
      </div>
    </InfoCard>
  );
}
