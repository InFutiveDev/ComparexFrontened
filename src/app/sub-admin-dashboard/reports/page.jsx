import { ReportsSection } from "@/components/dashboard/reports/reports-section";

export default function SubAdminReportsPage() {
  return (
    <ReportsSection
      uploadHref="/sub-admin-dashboard/reports/upload-transaction-data"
      reportsBasePath="/sub-admin-dashboard/reports"
    />
  );
}
