import { MerchantSupportDetails } from "@/components/dashboard/merchant-support/merchant-support-details";
import { getMerchantSupportSubmission } from "@/lib/merchant-support-store";
import { notFound } from "next/navigation";

export default async function MerchantSupportDetailsPage({ params }) {
  const { id } = await params;
  const submission = await getMerchantSupportSubmission(id);

  if (!submission) {
    notFound();
  }

  return <MerchantSupportDetails submission={submission} />;
}
