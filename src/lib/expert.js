import { apiFetch, ApiError } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

export async function submitExpertBooking(payload) {
  return apiFetch("/expert", {
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

export function fetchExpertBookings({ page = 1, limit = 50 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return authFetch(`/expert?${params.toString()}`);
}

export function fetchExpertBookingById(id) {
  return authFetch(`/expert/${id}`);
}

export function updateExpertBookingStatus(id, status) {
  return authFetch(`/expert/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
