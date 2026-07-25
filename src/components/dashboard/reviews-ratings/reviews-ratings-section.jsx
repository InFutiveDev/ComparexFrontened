"use client";

import { StatsCards } from "@/components/dashboard/reviews-ratings/stats-cards";
import { ReviewsRatingsTable } from "@/components/dashboard/reviews-ratings/reviews-ratings-table";
import { useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchReviews } from "@/lib/dashboard-api";
import { mapReviewListResponse } from "@/lib/dashboard-mappers";

export function ReviewsRatingsSection() {
  const listState = useDashboardList(fetchReviews, mapReviewListResponse);

  return (
    <div className="space-y-4">
      <StatsCards rows={listState.data} isLoading={listState.isLoading} />
      <ReviewsRatingsTable variant="full" listState={listState} />
    </div>
  );
}
