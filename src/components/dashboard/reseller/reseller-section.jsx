"use client";

import { ResellerTable } from "@/components/dashboard/reseller/reseller-table";
import { StatsCards } from "@/components/dashboard/reseller/stats-cards";
import { useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchResellers } from "@/lib/dashboard-api";
import { mapResellerListResponse } from "@/lib/dashboard-mappers";

export function ResellerSection() {
  const listState = useDashboardList(fetchResellers, mapResellerListResponse);

  return (
    <div className="space-y-4">
      <StatsCards rows={listState.data} isLoading={listState.isLoading} />
      <ResellerTable variant="full" workTypeFilter="Reseller" listState={listState} />
    </div>
  );
}
