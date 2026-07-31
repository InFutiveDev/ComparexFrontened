import { UploadTransactionData } from "@/components/dashboard/reports/upload-transaction-data/upload-transaction-data";

export default function UploadTransactionDataPage() {
  return (
    <UploadTransactionData backHref="/dashboard/reports" useSubAdminPgList={false} />
  );
}
