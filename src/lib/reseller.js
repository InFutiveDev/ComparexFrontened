import { apiFetch, ApiError } from "@/lib/api";
import { authApiFetch, authApiFormFetch } from "@/lib/auth-fetch";

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

async function authFetch(path, options = {}) {
  return authApiFetch(path, options);
}

export function fetchMyResellerProfile() {
  return authFetch("/reseller/me");
}

export function updateMyResellerProfile(payload) {
  return authFetch("/reseller/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function fetchMyResellerLeads({ page = 1, limit = 25, status, search } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  return authFetch(`/reseller/me/leads?${params.toString()}`);
}

export function fetchMyResellerLead(id) {
  return authFetch(`/reseller/me/leads/${id}`);
}

function buildQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  });
  const query = qs.toString();
  return query ? `?${query}` : "";
}

export function fetchMyResellerGmv({ page = 1, limit = 25, from, to, merchantId } = {}) {
  return authFetch(`/reseller/me/gmv${buildQuery({ page, limit, from, to, merchantId })}`);
}

export function fetchMyResellerCommissions({ page = 1, limit = 25, status, from, to, merchantId } = {}) {
  return authFetch(
    `/reseller/me/commissions${buildQuery({ page, limit, status, from, to, merchantId })}`,
  );
}

export function fetchMyResellerCommissionSlabs() {
  return authFetch("/reseller/me/commission-slabs");
}

export function fetchMyResellerInvoices({ page = 1, limit = 25, status } = {}) {
  return authFetch(`/reseller/me/invoices${buildQuery({ page, limit, status })}`);
}

export function submitMyResellerInvoice(payload) {
  return authFetch("/reseller/me/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function uploadResellerKycFile(file, folder = "reseller-kyc") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const data = await authApiFormFetch("/upload", formData);

  if (!data?.file) {
    throw new ApiError("File upload did not return file metadata", 500);
  }

  return data.file;
}
