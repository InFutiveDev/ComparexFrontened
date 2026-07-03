import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { merchants } from "@/lib/mock-data";

const resellerLabels = {
  search: "Search resellers",
  empty: "No resellers found",
  filterTitle: "Filter Resellers",
  filterDescription: "Refine resellers by status, category, and more",
  upload: "Upload Resellers",
  download: "Download resellers",
  assign: "Assign Reseller",
  delete: "Delete Reseller",
};

export function ResellerTable({ variant = "overview", workTypeFilter = "Reseller" }) {
  return (
    <CrmDataTable
      data={merchants}
      variant={variant}
      workTypeFilter={workTypeFilter}
      lockWorkTypeFilter={Boolean(workTypeFilter)}
      labels={resellerLabels}
      searchType="merchant"
      detailsBasePath="/dashboard/resellers"
      detailsWorkType="Reseller"
    />
  );
}
