import { MerchantTable } from "@/components/dashboard/merchant/merchant-table";
import { StatsCards } from "@/components/dashboard/merchant/stats-cards";
import { merchantStats } from "@/lib/mock-data";

export function MerchantSection() {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
      <StatsCards stats={merchantStats} />
      <MerchantTable variant="full" workTypeFilter="Merchant" />
      </div>
      
    </div>
  );
}
