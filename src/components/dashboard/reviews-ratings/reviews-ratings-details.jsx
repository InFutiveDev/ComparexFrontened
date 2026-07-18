"use client";

import { use, useState } from "react";
import {
  HiBuildingStorefront,
  HiDocumentText,
  HiStar,
  HiUserCircle,
} from "react-icons/hi2";
import {
  DetailErrorState,
  DetailField,
  DetailHeader,
  DetailLoadingState,
  formatDetailDate,
  formatDetailLabel,
  getInitials,
  InfoCard,
  useDashboardDetail,
} from "@/components/dashboard/shared/record-details";
import { fetchReviewById, updateReviewStatus } from "@/lib/dashboard-api";
import { pickReview } from "@/lib/dashboard-detail-pickers";
import { ApiError } from "@/lib/api";

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
    hidden: "bg-slate-50 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ${
        styles[status] || styles.pending
      }`}
    >
      {status || "pending"}
    </span>
  );
}

export function ReviewsRatingsDetails({ params }) {
  const { id } = use(params);
  const { data, isLoading, error, reload } = useDashboardDetail(
    id,
    fetchReviewById,
    pickReview,
  );
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatus(status) {
    setIsUpdating(true);
    setActionError("");
    setActionMessage("");
    try {
      const result = await updateReviewStatus(id, status);
      setActionMessage(result.message || "Status updated");
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) return <DetailLoadingState />;
  if (error || !data) {
    return (
      <DetailErrorState
        message={error || "Review not found"}
        onRetry={reload}
        backHref="/dashboard/reviews-ratings"
        backLabel="Back to Reviews"
      />
    );
  }

  const ratings = data.ratings || {};

  return (
    <div className="space-y-5">
      <DetailHeader
        backHref="/dashboard/reviews-ratings"
        backLabel="Back to Reviews"
        title={data.title}
        subtitle={`${data.productName} · ${data.name}`}
        initials={getInitials(data.name)}
        badges={[<StatusBadge key="status" status={data.status} />]}
      />

      {(actionError || actionMessage) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            actionError
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {actionError || actionMessage}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#13203F]">Moderation</h3>
        <p className="mt-1 text-sm text-slate-600">
          Publish approved reviews, or reject/hide ones that need action.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["pending", "published", "rejected", "hidden"].map((status) => (
            <button
              key={status}
              type="button"
              disabled={isUpdating || data.status === status}
              onClick={() => handleStatus(status)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold capitalize text-slate-700 disabled:opacity-50"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Reviewer" icon={HiUserCircle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Name">{data.name}</DetailField>
            <DetailField label="Business">{data.businessName}</DetailField>
            <DetailField label="Email">{data.email}</DetailField>
            <DetailField label="Job Title">{data.jobTitle || "—"}</DetailField>
            <DetailField label="Identity">{formatDetailLabel(data.identityMethod)}</DetailField>
            <DetailField label="Submitted">{formatDetailDate(data.createdAt)}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Provider" icon={HiBuildingStorefront}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Product">{data.productName}</DetailField>
            <DetailField label="Company">{data.productCompany || "—"}</DetailField>
            <DetailField label="Category">{formatDetailLabel(data.productCategory)}</DetailField>
            <DetailField label="Usage Duration">{formatDetailLabel(data.usageDuration)}</DetailField>
            <DetailField label="Monthly Volume">{formatDetailLabel(data.monthlyVolume)}</DetailField>
            <DetailField label="Website">{data.website || "—"}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Ratings" icon={HiStar}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Overall">{data.rating}/5</DetailField>
            <DetailField label="Platform Experience">
              {data.platformRating ? `${data.platformRating}/5` : "—"}
            </DetailField>
            <DetailField label="NPS">{data.recommendNps ?? "—"}/10</DetailField>
            <DetailField label="Onboarding">{ratings.onboardingRating || "—"}</DetailField>
            <DetailField label="Support">{ratings.supportRating || "—"}</DetailField>
            <DetailField label="Pricing">{ratings.pricingRating || "—"}</DetailField>
            <DetailField label="Reliability">{ratings.reliabilityRating || "—"}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Review Content" icon={HiDocumentText}>
          <div className="space-y-4">
            <DetailField label="Title">{data.title}</DetailField>
            <DetailField label="Review">{data.reviewText}</DetailField>
            <DetailField label="Stood Out">
              {Array.isArray(data.stoodOut) && data.stoodOut.length
                ? data.stoodOut.map(formatDetailLabel).join(", ")
                : "—"}
            </DetailField>
            <DetailField label="Ideal For">
              {Array.isArray(data.idealFor) && data.idealFor.length
                ? data.idealFor.map(formatDetailLabel).join(", ")
                : "—"}
            </DetailField>
            <DetailField label="Does Well">{data.doesWell || "—"}</DetailField>
          </div>
        </InfoCard>
      </div>
    </div>
  );
}
