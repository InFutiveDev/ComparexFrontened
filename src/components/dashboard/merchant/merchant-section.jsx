"use client";

import { MerchantTable } from "@/components/dashboard/merchant/merchant-table";
import { StatsCards } from "@/components/dashboard/merchant/stats-cards";
import { useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchMerchants } from "@/lib/dashboard-api";
import { mapMerchantListResponse } from "@/lib/dashboard-mappers";

export function MerchantSection() {
  const listState = useDashboardList(fetchMerchants, mapMerchantListResponse);

  return (
    <div className="space-y-4">
      <StatsCards rows={listState.data} isLoading={listState.isLoading} />
      <MerchantTable variant="full" workTypeFilter="Merchant" listState={listState} />
    </div>
  );
}
