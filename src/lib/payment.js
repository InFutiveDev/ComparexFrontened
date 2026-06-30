import { apiFetch } from "@/lib/api";

export async function submitPaymentProvider(payload) {
  return apiFetch("/payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
