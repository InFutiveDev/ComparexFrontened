import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { merchants } from "@/lib/mock-data";

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
  return (
    <CrmDataTable
      data={merchants}
      variant={variant}
      workTypeFilter={workTypeFilter}
      lockWorkTypeFilter={Boolean(workTypeFilter)}
      labels={paymentGatewayLabels}
      searchType="merchant"
      detailsBasePath="/dashboard/payment-gateways"
      detailsWorkType="Payment Gateway"
    />
  );
}
