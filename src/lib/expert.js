import { apiFetch } from "@/lib/api";
import { authApiFetch } from "@/lib/auth-fetch";

export async function submitExpertBooking(payload) {
  return apiFetch("/expert", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function authFetch(path, options = {}) {
  return authApiFetch(path, options);
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
