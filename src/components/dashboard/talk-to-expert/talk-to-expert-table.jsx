"use client";

import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchExpertBookings } from "@/lib/dashboard-api";
import { mapExpertBookingListResponse } from "@/lib/dashboard-mappers";

const expertLabels = {
  search: "Search expert bookings",
  empty: "No expert bookings found",
  emptyHint: "Talk to Expert form submissions will appear here.",
  filterTitle: "Filter Expert Bookings",
  filterDescription: "Refine bookings by status, gateway, and more",
  upload: "Upload Bookings",
  download: "Download bookings",
  assign: "Assign Booking",
  delete: "Delete Booking",
};

export function TalkToExpertTable({ variant = "full", refreshToken = 0 }) {
  const { data, isLoading, error, reload } = useDashboardList(
    fetchExpertBookings,
    mapExpertBookingListResponse,
    { refreshToken },
  );

  return (
    <DashboardListState
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      emptyMessage="No expert bookings found"
    >
      <CrmDataTable
        data={data}
        variant={variant}
        labels={expertLabels}
        searchType="merchant"
        detailsBasePath="/dashboard/talk-to-expert"
        detailsWorkType="Talk to Expert"
      />
    </DashboardListState>
  );
}
