"use client";

import { useState } from "react";
import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { deleteReview, fetchReviews } from "@/lib/dashboard-api";
import { mapReviewListResponse } from "@/lib/dashboard-mappers";
import { ApiError } from "@/lib/api";

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
  const [actionError, setActionError] = useState("");
  const { data, isLoading, error, reload } = useDashboardList(
    fetchReviews,
    mapReviewListResponse,
    { refreshToken },
  );

  async function handleDeleteRow(row) {
    const label = row.name || "this review";
    if (
      !window.confirm(
        `Delete review from ${label}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setActionError("");
    try {
      await deleteReview(row.id);
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to delete review",
      );
    }
  }

  return (
    <DashboardListState
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      emptyMessage="No reviews found"
    >
      {actionError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}
      <CrmDataTable
        data={data}
        variant={variant}
        labels={reviewLabels}
        searchType="merchant"
        detailsBasePath="/dashboard/reviews-ratings"
        detailsWorkType="Reviews & Ratings"
        hideClientId
        onDeleteRow={handleDeleteRow}
      />
    </DashboardListState>
  );
}
