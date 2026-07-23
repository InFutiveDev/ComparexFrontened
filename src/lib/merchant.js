import { ApiError, apiFetch } from "@/lib/api";
import { getAffiliateParams } from "@/lib/affiliate-tracking";
import { getStoredToken } from "@/lib/auth";

function withAffiliateQuery(path, payload = {}) {
  const params = new URLSearchParams();
  const { pgId, resellerId } = getAffiliateParams();

  const effectivePgId = payload.pgId || pgId;
  const effectiveResellerId = payload.resellerId || resellerId;

  if (effectivePgId) params.set("pg", effectivePgId);
  if (effectiveResellerId) params.set("rs", effectiveResellerId);

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export async function submitMerchantLead(payload) {
  return apiFetch(withAffiliateQuery("/merchant", payload), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMerchantLead(id, payload) {
  return apiFetch(withAffiliateQuery(`/merchant/${id}`, payload), {
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
