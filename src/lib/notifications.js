import { ApiError, apiFetch } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

export function fetchMyNotifications({ page = 1, limit = 50 } = {}) {
  const token = getStoredToken();
  if (!token) throw new ApiError("Authentication required", 401);

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return apiFetch(`/notifications/me?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
