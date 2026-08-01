"use client";

import { useMemo } from "react";
import { PgActivationLeaderboard } from "@/components/dashboard/payment-gateway/pg-activation-leaderboard";
import { PgLeadFunnelChart } from "@/components/dashboard/payment-gateway/pg-lead-funnel-chart";

export function PgInsightsSection({ rows = [], isLoading = false }) {
  const pgOptions = useMemo(
    () =>
      rows.map((row) => ({
        id: row.id,
        name: row.name || row.company || "Payment Gateway",
      })),
    [rows],
  );

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PgLeadFunnelChart pgOptions={pgOptions} isLoadingOptions={isLoading} />
      <PgActivationLeaderboard rows={rows} isLoading={isLoading} />
    </section>
  );
}
