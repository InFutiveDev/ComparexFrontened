import { ApiError, apiFetch, apiFormFetch } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

async function authFetch(path, options = {}) {
  const token = getStoredToken();
  if (!token) {
    throw new ApiError("Authentication required", 401);
  }

  return apiFetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function fetchSubAdminOptions() {
  return authFetch("/sub-admin/options");
}

export function fetchSubAdminLeads({
  page = 1,
  limit = 50,
  status,
  industry,
  location,
  assignedPgId,
  search,
} = {}) {
  return authFetch(
    `/sub-admin/leads${toQuery({ page, limit, status, industry, location, assignedPgId, search })}`
  );
}

export function fetchSubAdminLeadById(id) {
  return authFetch(`/sub-admin/leads/${id}`);
}

export function updateSubAdminLeadStatus(id, { status, notes } = {}) {
  return authFetch(`/sub-admin/leads/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, notes }),
  });
}

export function assignSubAdminLeadToPg(id, { paymentGatewayId, notes } = {}) {
  return authFetch(`/sub-admin/leads/${id}/assign`, {
    method: "POST",
    body: JSON.stringify({ paymentGatewayId, notes }),
  });
}

export function bookSubAdminTalkToExpert(id, payload = {}) {
  return authFetch(`/sub-admin/leads/${id}/talk-to-expert`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchAssignablePaymentGateways({
  page = 1,
  limit = 50,
  location,
  category,
  industry,
  minSuccessRate,
  minSettlementScore,
  search,
} = {}) {
  return authFetch(
    `/sub-admin/payment-gateways${toQuery({
      page,
      limit,
      location,
      category,
      industry,
      minSuccessRate,
      minSettlementScore,
      search,
    })}`
  );
}

/** FR-SA-07 / FR-SA-08 — PG experts with Calendly + available slots */
export function fetchRoutableExperts({ search } = {}) {
  return authFetch(`/sub-admin/experts${toQuery({ search })}`);
}

export async function bulkUploadLeadsToPg({ paymentGatewayId, file }) {
  const token = getStoredToken();
  if (!token) {
    throw new ApiError("Authentication required", 401);
  }

  const formData = new FormData();
  formData.append("paymentGatewayId", paymentGatewayId);
  formData.append("file", file);

  return apiFormFetch("/sub-admin/leads/bulk-upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const LEAD_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In Review" },
  { value: "qualified", label: "Qualified" },
  { value: "rejected", label: "Rejected" },
  { value: "assigned", label: "Assigned" },
  { value: "expert_booked", label: "Talk to Expert Booked" },
];

export function formatLeadStatus(status) {
  return LEAD_STATUS_OPTIONS.find((item) => item.value === status)?.label || status || "—";
}
