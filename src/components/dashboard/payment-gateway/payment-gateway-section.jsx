"use client";

import { PaymentGatewayTable } from "@/components/dashboard/payment-gateway/payment-gateway-table";
import { StatsCards } from "@/components/dashboard/payment-gateway/stats-cards";
import { useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchPaymentGateways } from "@/lib/dashboard-api";
import { mapPaymentGatewayListResponse } from "@/lib/dashboard-mappers";

export function PaymentGatewaySection() {
  const listState = useDashboardList(fetchPaymentGateways, mapPaymentGatewayListResponse);

  return (
    <div className="space-y-4">
      <StatsCards rows={listState.data} isLoading={listState.isLoading} />
      <PaymentGatewayTable
        variant="full"
        workTypeFilter="Payment Gateway"
        listState={listState}
      />
    </div>
  );
}
