import { apiFetch } from "@/lib/api";

export async function submitMerchantLead(payload) {
  return apiFetch("/merchant", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
