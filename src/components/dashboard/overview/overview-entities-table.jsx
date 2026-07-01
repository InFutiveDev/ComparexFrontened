import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { leads, merchants } from "@/lib/mock-data";

const overviewLabels = {
  search: "Search leads",
  empty: "No leads found",
  filterTitle: "Filter Leads",
  filterDescription: "Refine by status, category, work type, and more",
  upload: "Upload Leads",
  download: "Download leads",
  assign: "Assign Lead",
  delete: "Delete Lead",
};

const overviewData = [...leads, ...merchants];

export function OverviewEntitiesTable() {
  return (
    <CrmDataTable
      data={overviewData}
      variant="overview"
      labels={overviewLabels}
      searchType="merchant"
    
    />
  );
}
