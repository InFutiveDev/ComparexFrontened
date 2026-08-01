"use client";

import { MerchantSupportTable } from "@/components/dashboard/merchant-support/merchant-support-table";
import { StatsCards } from "@/components/dashboard/merchant-support/stats-cards";
import { SupportFlowFunnelSection } from "@/components/dashboard/merchant-support/support-flow-funnel-section";
import { useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchMerchantSupport } from "@/lib/dashboard-api";
import { mapMerchantSupportListResponse } from "@/lib/dashboard-mappers";

export function MerchantSupportSection() {
  const listState = useDashboardList(fetchMerchantSupport, mapMerchantSupportListResponse);

  return (
    <div className="space-y-4">
      <StatsCards
        rows={listState.data}
        isLoading={listState.isLoading}
        onRefresh={listState.reload}
        isRefreshing={listState.isLoading}
      />
      <SupportFlowFunnelSection rows={listState.data} isLoading={listState.isLoading} />
      <MerchantSupportTable variant="full" listState={listState} />
    </div>
  );
}
