"use client";

import { useState } from "react";
import { PaymentGatewayTable } from "@/components/dashboard/payment-gateway/payment-gateway-table";
import { PgCommissionSummarySection } from "@/components/dashboard/payment-gateway/pg-commission-summary-section";
import { PgInsightsSection } from "@/components/dashboard/payment-gateway/pg-insights-section";
import { StatsCards } from "@/components/dashboard/payment-gateway/stats-cards";
import { useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchPaymentGateways } from "@/lib/dashboard-api";
import { mapPaymentGatewayListResponse } from "@/lib/dashboard-mappers";

export function PaymentGatewaySection() {
  const [activeRange, setActiveRange] = useState("Month");
  const listState = useDashboardList(fetchPaymentGateways, mapPaymentGatewayListResponse);

  return (
    <div className="space-y-4">
      <StatsCards
        rows={listState.data}
        isLoading={listState.isLoading}
        activeRange={activeRange}
        onRangeChange={setActiveRange}
      />
      <PgInsightsSection rows={listState.data} isLoading={listState.isLoading} />
      <PgCommissionSummarySection activeRange={activeRange} />
      <PaymentGatewayTable
        variant="full"
        workTypeFilter="Payment Gateway"
        listState={listState}
      />
    </div>
  );
}
