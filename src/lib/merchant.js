import { apiFetch } from "@/lib/api";

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
