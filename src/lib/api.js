const DEFAULT_API_URL = "http://localhost:3001/api";

export function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (configured) {
    return configured;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/api`;
  }

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, "");
  if (frontendUrl) {
    return `${frontendUrl}/api`;
  }

  return DEFAULT_API_URL;
}

/** @deprecated Prefer getApiBaseUrl() — value can be wrong if env was missing at build time. */
export const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      `Cannot reach API at ${baseUrl}. Make sure the API server is running.`,
      0
    );
  }

  let data = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (response.status === 404
        ? "API route not found. Restart or redeploy the API server with the latest code."
        : `API error: ${response.status}`);
    throw new ApiError(message, response.status);
  }

  return data;
}

export async function apiFormFetch(path, formData, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    ...options,
  }).catch(() => {
    throw new ApiError(
      `Cannot reach API at ${baseUrl}. Make sure the API server is running.`,
      0
    );
  });

  let data = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (response.status === 404
        ? "API route not found. Restart or redeploy the API server with the latest code."
        : `API error: ${response.status}`);
    throw new ApiError(message, response.status);
  }

  return data;
}
