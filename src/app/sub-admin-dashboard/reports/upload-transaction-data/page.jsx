import { UploadTransactionData } from "@/components/dashboard/reports/upload-transaction-data/upload-transaction-data";

export default function SubAdminUploadTransactionDataPage() {
  return (
    <UploadTransactionData
      backHref="/sub-admin-dashboard/reports"
      useSubAdminPgList
    />
  );
}
