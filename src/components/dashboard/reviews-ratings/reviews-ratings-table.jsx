"use client";

import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchReviews } from "@/lib/dashboard-api";
import { mapReviewListResponse } from "@/lib/dashboard-mappers";

const reviewLabels = {
  search: "Search reviews",
  empty: "No reviews found",
  emptyHint: "Write a Review form submissions will appear here.",
  filterTitle: "Filter Reviews",
  filterDescription: "Refine reviews by status, provider, and more",
  upload: "Upload Reviews",
  download: "Download reviews",
  assign: "Assign Review",
  delete: "Delete Review",
};

export function ReviewsRatingsTable({ variant = "full", refreshToken = 0 }) {
  const { data, isLoading, error, reload } = useDashboardList(
    fetchReviews,
    mapReviewListResponse,
    { refreshToken },
  );

  return (
    <DashboardListState
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      emptyMessage="No reviews found"
    >
      <CrmDataTable
        data={data}
        variant={variant}
        labels={reviewLabels}
        searchType="merchant"
        detailsBasePath="/dashboard/reviews-ratings"
        detailsWorkType="Reviews & Ratings"
      />
    </DashboardListState>
  );
}
