import { authApiFetch } from "@/lib/auth-fetch";

export function fetchMyNotifications({ page = 1, limit = 50 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return authApiFetch(`/notifications/me?${params.toString()}`);
}
