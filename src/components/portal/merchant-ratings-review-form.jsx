"use client";

import { useEffect, useState } from "react";
import {
  HiBuildingStorefront,
  HiCheckCircle,
  HiStar,
} from "react-icons/hi2";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiError } from "@/lib/api";
import { fetchPgComparison } from "@/lib/pg-compare";
import { submitMerchantReview } from "@/lib/review";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

function StarRating({ label, value, onChange, description }) {
  return (
    <fieldset className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <legend className="px-1 text-sm font-bold text-[#13203F]">{label} *</legend>
      {description ? <p className="mb-3 text-xs text-slate-500">{description}</p> : null}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            className={`rounded-lg p-1.5 transition hover:scale-110 ${
              star <= value ? "text-amber-400" : "text-slate-300"
            }`}
          >
            <HiStar className="size-7" />
          </button>
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-600">
          {value ? `${value}/5` : "Select rating"}
        </span>
      </div>
    </fieldset>
  );
}

export function MerchantRatingsReviewForm() {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    paymentProviderId: "",
    businessName: "",
    rating: 0,
    platformRating: 0,
    title: "",
    reviewText: "",
  });
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      businessName: current.businessName || user?.name || "",
    }));
  }, [user]);

  useEffect(() => {
    let active = true;
    fetchPgComparison({ sort: "name_asc" })
      .then((data) => {
        if (active) setProviders(data.paymentGateways || []);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof ApiError ? err.message : "Failed to load payment gateways");
        }
      })
      .finally(() => {
        if (active) setIsLoadingProviders(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.rating || !form.platformRating) {
      setError("Select both the PG rating and platform experience rating");
      return;
    }
    if (form.reviewText.trim().length < 10) {
      setError("Review text must contain at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const data = await submitMerchantReview({
        ...form,
        title: form.title.trim(),
        reviewText: form.reviewText.trim(),
        businessName: form.businessName.trim(),
      });
      setSuccess(data.review);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  }

  function reset() {
    setSuccess(null);
    setError("");
    setForm({
      paymentProviderId: "",
      businessName: user?.name || "",
      rating: 0,
      platformRating: 0,
      title: "",
      reviewText: "",
    });
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <HiCheckCircle className="mx-auto size-14 text-emerald-500" />
        <h2 className="mt-4 text-2xl font-bold text-[#13203F]">
          Review submitted for moderation
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Your PG rating, text review, and platform experience rating were saved.
          The review will appear in the comparison table after an Admin publishes it.
        </p>
        <p className="mt-3 text-xs text-slate-500">Review ID: {success.id}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white"
          style={{ color: "#fff" }}
        >
          Submit another review
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Ratings & Review System
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Rate a payment gateway, share your experience, and rate the overall CompareX
          platform.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
            <HiBuildingStorefront className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#13203F]">Merchant review</h3>
            <p className="text-xs text-slate-500">
              Reviews remain pending until moderated by an Admin.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-600">
            Payment Gateway *
            <select
              required
              disabled={isLoadingProviders}
              className={inputClass}
              value={form.paymentProviderId}
              onChange={(event) => updateField("paymentProviderId", event.target.value)}
            >
              <option value="">
                {isLoadingProviders ? "Loading active PGs…" : "Select payment gateway…"}
              </option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-600">
            Business name *
            <input
              required
              className={inputClass}
              value={form.businessName}
              onChange={(event) => updateField("businessName", event.target.value)}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StarRating
            label="Payment Gateway rating"
            description="Your overall experience with the selected PG."
            value={form.rating}
            onChange={(value) => updateField("rating", value)}
          />
          <StarRating
            label="CompareX platform experience"
            description="Rate your overall experience using the CompareX platform."
            value={form.platformRating}
            onChange={(value) => updateField("platformRating", value)}
          />
        </div>

        <label className="block text-sm font-semibold text-slate-600">
          Review title *
          <input
            required
            maxLength={120}
            className={inputClass}
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Summarize your experience"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-600">
          Text review *
          <textarea
            required
            minLength={10}
            maxLength={2000}
            rows={6}
            className={`${inputClass} resize-y`}
            value={form.reviewText}
            onChange={(event) => updateField("reviewText", event.target.value)}
            placeholder="Describe pricing, onboarding, support, reliability, and anything merchants should know."
          />
          <span className="mt-1 block text-right text-xs text-slate-500">
            {form.reviewText.length}/2000
          </span>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <p className="max-w-xl text-xs leading-relaxed text-slate-500">
            By submitting, you confirm this is a genuine experience and understand that
            the review will be moderated before publication.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingProviders}
            className="rounded-full bg-[#2D4CC8] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSubmitting ? "Submitting…" : "Submit for moderation"}
          </button>
        </div>
      </form>
    </div>
  );
}
