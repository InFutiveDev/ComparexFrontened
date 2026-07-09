"use client";

import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchPaymentGateways } from "@/lib/dashboard-api";
import { mapPaymentGatewayListResponse } from "@/lib/dashboard-mappers";

const paymentGatewayLabels = {
  search: "Search payment gateways",
  empty: "No payment gateways found",
  filterTitle: "Filter Payment Gateways",
  filterDescription: "Refine payment gateways by status, category, and more",
  upload: "Upload Payment Gateways",
  download: "Download payment gateways",
  assign: "Assign Payment Gateway",
  delete: "Delete Payment Gateway",
};

export function PaymentGatewayTable({
  variant = "overview",
  workTypeFilter = "Payment Gateway",
}) {
  const { data, isLoading, error, reload } = useDashboardList(
    fetchPaymentGateways,
    mapPaymentGatewayListResponse,
  );

  return (
    <DashboardListState
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      emptyMessage="No payment gateways found"
    >
      <CrmDataTable
        data={data}
        variant={variant}
        workTypeFilter={workTypeFilter}
        lockWorkTypeFilter={Boolean(workTypeFilter)}
        labels={paymentGatewayLabels}
        searchType="merchant"
        detailsBasePath="/dashboard/payment-gateways"
        detailsWorkType="Payment Gateway"
        showAccountStatus
        accountStatusResource="payment"
        onAccountStatusUpdated={reload}
      />
    </DashboardListState>
  );
}
