import { ResellerDetails } from "@/components/dashboard/reseller/reseller-details";
import { merchants } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function ResellerDetailsPage({ params }) {
  const { id } = await params;
  const reseller = merchants.find((item) => item.id === id);

  if (!reseller || reseller.workType !== "Reseller") {
    notFound();
  }

  return <ResellerDetails reseller={reseller} />;
}
