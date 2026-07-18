import { ApiError, apiFetch } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

export async function submitMerchantLead(payload) {
  return apiFetch("/merchant", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMerchantLead(id, payload) {
  return apiFetch(`/merchant/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function submitMerchantPanelLead(payload) {
  const token = getStoredToken();
  if (!token) throw new ApiError("Authentication required", 401);

  return apiFetch("/merchant/lead-submission", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}
