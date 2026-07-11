import { apiFetch, apiFormFetch, ApiError } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

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

export function fetchMyResellerProfile() {
  return authFetch("/reseller/me");
}

export function updateMyResellerProfile(payload) {
  return authFetch("/reseller/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function uploadResellerKycFile(file, folder = "reseller-kyc") {
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
