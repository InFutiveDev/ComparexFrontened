import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { merchants } from "@/lib/mock-data";

const merchantLabels = {
  search: "Search merchants",
  empty: "No merchants found",
  filterTitle: "Filter Merchants",
  filterDescription: "Refine merchants by status, category, and more",
  upload: "Upload Merchants",
  download: "Download merchants",
  assign: "Assign Merchant",
  delete: "Delete Merchant",
};

export function MerchantTable({ variant = "overview", workTypeFilter = "Merchant" }) {
  return (
    <CrmDataTable
      data={merchants}
      variant={variant}
      workTypeFilter={workTypeFilter}
      lockWorkTypeFilter={Boolean(workTypeFilter)}
      labels={merchantLabels}
      searchType="merchant"
      detailsBasePath="/dashboard/merchants"
      detailsWorkType="Merchant"
    />
  );
}
