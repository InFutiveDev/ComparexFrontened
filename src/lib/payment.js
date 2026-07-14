import { apiFetch, apiFormFetch, ApiError } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

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
