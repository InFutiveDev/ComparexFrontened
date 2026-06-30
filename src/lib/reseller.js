import { apiFetch } from "@/lib/api";

export async function submitResellerPartner(payload) {
  return apiFetch("/reseller", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
