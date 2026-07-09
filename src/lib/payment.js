import { apiFetch } from "@/lib/api";

export async function submitPaymentProvider(payload) {
  return apiFetch("/payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePaymentProvider(id, payload) {
  return apiFetch(`/payment/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
