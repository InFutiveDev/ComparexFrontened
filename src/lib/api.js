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

function apiErrorMessage(data, status) {
  return (
    data?.error ||
    data?.message ||
    (status === 502
      ? "Live API returned 502 Bad Gateway — nginx is up but the Node.js API is not running. Restart the API on the server or use local API."
      : status === 404
        ? "API route not found. Restart or redeploy the API server with the latest code."
        : `API error: ${status}`)
  );
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
      `Cannot reach API at ${baseUrl}. Check your network, or if using the live server ensure the API process is running (nginx 502 = backend down).`,
      0
    );
  }

  let data = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new ApiError(apiErrorMessage(data, response.status), response.status);
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
      `Cannot reach API at ${baseUrl}. Check your network, or if using the live server ensure the API process is running (nginx 502 = backend down).`,
      0
    );
  });

  let data = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new ApiError(apiErrorMessage(data, response.status), response.status);
  }

  return data;
}
