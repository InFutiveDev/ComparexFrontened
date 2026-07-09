import { apiFetch } from "@/lib/api";

export async function submitResellerPartner(payload) {
  return apiFetch("/reseller", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateResellerPartner(id, payload) {
  return apiFetch(`/reseller/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
