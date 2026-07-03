import { MerchantDetails } from "@/components/dashboard/merchant/merchant-details";
import { merchants } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function MerchantDetailsPage({ params }) {
  const { id } = await params;
  const merchant = merchants.find((item) => item.id === id);

  if (!merchant || merchant.workType !== "Merchant") {
    notFound();
  }

  return <MerchantDetails merchant={merchant} />;
}
