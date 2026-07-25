import { apiFetch } from "@/lib/api";
import { authApiFetch } from "@/lib/auth-fetch";

export async function submitReview(payload) {
  return apiFetch("/review", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitWebsiteReview(payload) {
  return apiFetch("/review/website", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function authFetch(path, options = {}) {
  return authApiFetch(path, options);
}

export function submitMerchantReview(payload) {
  return authFetch("/review/merchant", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchReviews({ page = 1, limit = 50 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return authFetch(`/review?${params.toString()}`);
}

export function fetchReviewById(id) {
  return authFetch(`/review/${id}`);
}

export function updateReviewStatus(id, status) {
  return authFetch(`/review/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
