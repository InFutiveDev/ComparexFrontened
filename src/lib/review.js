import { apiFetch, ApiError } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

export async function submitReview(payload) {
  return apiFetch("/review", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function authFetch(path, options = {}) {
  const token = getStoredToken();
  if (!token) {
    throw new ApiError("Authentication required", 401);
  }

  return apiFetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
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
