import { API_BASE_URL, apiFetch, apiFormFetch, ApiError } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

export async function submitPaymentProvider(payload) {
  return apiFetch("/payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Public list of PGs that nominated a Talk to Expert representative. */
export function fetchTalkToExpertProviders({ search } = {}) {
  const params = new URLSearchParams();
  if (search?.trim()) params.set("search", search.trim());
  const query = params.toString();
  return apiFetch(`/payment/talk-to-expert${query ? `?${query}` : ""}`);
}

export async function updatePaymentProvider(id, payload) {
  return apiFetch(`/payment/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

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

export function fetchMyPaymentProfile() {
  return authFetch("/payment/me");
}

export function updateMyPaymentProfile(payload) {
  return authFetch("/payment/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/** FR-PG-01 — update PG identity, logo, description, and contacts. */
export function updateMyPgProfile(payload) {
  return updateMyPaymentProfile({
    section: "profile",
    ...payload,
  });
}

/** FR-PG-02 — update PG MDR, TAT, settlement, and supported features. */
export function updateMyPgConfiguration(onboarding) {
  return updateMyPaymentProfile({
    section: "config",
    onboarding,
  });
}

/** FR-PG-06 / FR-PG-07 — internal advisors, availability, and Calendly. */
export function fetchMyPgExperts() {
  return authFetch("/payment/me/experts");
}

export function updateMyPgExperts(experts) {
  return authFetch("/payment/me/experts", {
    method: "PUT",
    body: JSON.stringify({ experts }),
  });
}

/** FR-PG-03 — leads assigned by Sub Admin or registered via PG affiliate link. */
export function fetchMyPgLeads({
  page = 1,
  limit = 25,
  status,
  source,
  search,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.set("status", status);
  if (source) params.set("source", source);
  if (search?.trim()) params.set("search", search.trim());
  return authFetch(`/pg/leads?${params.toString()}`);
}

export function fetchMyPgLeadById(id) {
  return authFetch(`/pg/leads/${id}`);
}

/** FR-PG-04 — remarks are required by the API. */
export function updateMyPgLeadStatus(id, { status, remarks }) {
  return authFetch(`/pg/leads/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, remarks }),
  });
}

/** FR-PG-03 — download current filtered lead set as CSV or Excel .xls. */
export async function downloadMyPgLeads({
  format = "csv",
  status,
  source,
  search,
} = {}) {
  const token = getStoredToken();
  if (!token) throw new ApiError("Authentication required", 401);

  const params = new URLSearchParams({ format });
  if (status) params.set("status", status);
  if (source) params.set("source", source);
  if (search?.trim()) params.set("search", search.trim());

  const response = await fetch(`${API_BASE_URL}/pg/leads/export?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch {
      // Non-JSON export error response.
    }
    throw new ApiError(data?.message || "Failed to export leads", response.status);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const fileName =
    disposition.match(/filename="([^"]+)"/)?.[1] || `pg-leads.${format}`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function uploadPgOnboardingFile(file, folder = "pg-onboarding") {
  const token = getStoredToken();
  if (!token) {
    throw new ApiError("Authentication required", 401);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const data = await apiFormFetch("/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.file;
}

/** Normalize file meta before sending JSON onboarding payloads. */
export function serializeOnboardingForApi(form = {}) {
  const payload = { ...form };

  delete payload.merchantSuccessStoriesUrl;
  delete payload.caseStudiesUrl;

  payload.merchantSuccessStoriesUrls = Array.isArray(payload.merchantSuccessStoriesUrls)
    ? payload.merchantSuccessStoriesUrls.map((item) => String(item).trim()).filter(Boolean)
    : [];
  payload.caseStudiesUrls = Array.isArray(payload.caseStudiesUrls)
    ? payload.caseStudiesUrls.map((item) => String(item).trim()).filter(Boolean)
    : [];

  for (const key of ["companyLogo", "onboardingChecklist"]) {
    const value = payload[key];
    if (!value) {
      payload[key] = null;
    } else if (typeof File !== "undefined" && value instanceof File) {
      payload[key] = { fileName: value.name };
    } else if (typeof value === "string") {
      payload[key] = { fileName: value };
    } else if (typeof value === "object") {
      payload[key] = {
        fileName: value.fileName || value.name || null,
        url: value.url || null,
        key: value.key || null,
        mimeType: value.mimeType || null,
        size: value.size || null,
      };
    }
  }

  return payload;
}
