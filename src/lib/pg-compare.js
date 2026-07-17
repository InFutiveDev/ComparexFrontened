import { apiFetch } from "@/lib/api";

export function fetchPgComparison(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  }
  const query = params.toString();
  return apiFetch(`/payment/compare${query ? `?${query}` : ""}`);
}
