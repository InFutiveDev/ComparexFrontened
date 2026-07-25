"use client";

import { StatsCards } from "@/components/dashboard/talk-to-expert/stats-cards";
import { TalkToExpertTable } from "@/components/dashboard/talk-to-expert/talk-to-expert-table";
import { useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchExpertBookings } from "@/lib/dashboard-api";
import { mapExpertBookingListResponse } from "@/lib/dashboard-mappers";

export function TalkToExpertSection() {
  const listState = useDashboardList(fetchExpertBookings, mapExpertBookingListResponse);

  return (
    <div className="space-y-4">
      <StatsCards rows={listState.data} isLoading={listState.isLoading} />
      <TalkToExpertTable variant="full" listState={listState} />
    </div>
  );
}
