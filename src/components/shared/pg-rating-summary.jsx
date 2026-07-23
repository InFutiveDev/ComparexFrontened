"use client";

import { HiStar } from "react-icons/hi2";

function formatAverage(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "—";
  return number.toFixed(1);
}

export function PgRatingSummary({
  rating,
  compact = false,
  showReviews = false,
  hideStats = false,
  className = "",
}) {
  const average = Number(rating?.average || 0);
  const count = Number(rating?.count || 0);
  const reviews = Array.isArray(rating?.reviews) ? rating.reviews : [];

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 text-sm ${className}`}>
        <HiStar className="size-4 text-amber-400" aria-hidden />
        <span className="font-semibold text-[#13203F]">
          {count > 0 ? `${formatAverage(average)} / 5` : "No ratings yet"}
        </span>
        {count > 0 ? (
          <span className="text-slate-500">
            ({count} review{count === 1 ? "" : "s"})
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!hideStats ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Average rating
            </p>
            <div className="mt-2 flex items-center gap-2">
              <HiStar className="size-6 text-amber-400" aria-hidden />
              <p className="text-2xl font-bold text-[#13203F]">
                {count > 0 ? `${formatAverage(average)} / 5` : "—"}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total reviews
            </p>
            <p className="mt-2 text-2xl font-bold text-[#13203F]">{count}</p>
            <p className="mt-1 text-xs text-slate-500">Published merchant reviews</p>
          </div>
        </div>
      ) : null}

      {showReviews && count > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold text-[#13203F]">Recent published reviews</p>
          <ul className="mt-3 space-y-3">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#13203F]">
                    {review.title || "Review"}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <HiStar className="size-3.5" aria-hidden />
                    {review.rating}/5
                  </span>
                </div>
                {review.reviewText ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {review.reviewText.length > 180
                      ? `${review.reviewText.slice(0, 180)}…`
                      : review.reviewText}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-slate-500">
                  {review.reviewerName || "Merchant"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {count === 0 ? (
        <p className="text-sm text-slate-500">
          No published reviews yet. Ratings appear here after Admin publishes merchant reviews.
        </p>
      ) : null}
    </div>
  );
}
