"use client";

import { ReviewsRatingsTable } from "@/components/dashboard/reviews-ratings/reviews-ratings-table";

export function ReviewsRatingsSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Reviews & Ratings
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Moderate reviews submitted from the website Write a Review form.
        </p>
      </div>
      <ReviewsRatingsTable />
    </div>
  );
}
