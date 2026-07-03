import { ResellerTable } from "@/components/dashboard/reseller/reseller-table";
import { StatsCards } from "@/components/dashboard/reseller/stats-cards";
import { resellerStats } from "@/lib/mock-data";

export function ResellerSection() {
  return (
    <div className="space-y-4">
      <StatsCards stats={resellerStats} />
      <ResellerTable variant="full" workTypeFilter="Reseller" />
    </div>
  );
}
