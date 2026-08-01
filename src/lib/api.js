const DEFAULT_API_URL = "http://127.0.0.1:3001/api";

function isLocalDevApiUrl(url) {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return url.includes("localhost") || url.includes("127.0.0.1");
  }
}

/**
 * API base URL for fetch calls.
 * - Dev (browser): always same-origin `/api` → Next.js proxy (works on localhost + LAN IP).
 * - Dev (SSR): loopback through the dev server proxy.
 * - Production: NEXT_PUBLIC_API_URL from env (live server).
 */
export function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const productionApi =
    configured && !isLocalDevApiUrl(configured) ? configured : null;

  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV === "development") {
      return `${window.location.origin}/api`;
    }
    if (productionApi) return productionApi;
    if (configured) return configured;
    return `${window.location.origin}/api`;
  }

  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || "3000";
    return `http://127.0.0.1:${port}/api`;
  }

  if (productionApi) return productionApi;
  if (configured) return configured;

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
        ? "API route not found. If using local ComparexFrontApi, set USE_LOCAL_API=true in .env.local, restart npm run dev, and ensure the API is running on port 3001 (npm run dev in ComparexFrontApi)."
        : status === 500 && !data
          ? "API request failed (500). In dev, ensure npm run dev is running and API_PROXY_TARGET is reachable (or set USE_LOCAL_API=true with ComparexFrontApi on 3001)."
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
      process.env.NODE_ENV === "development"
        ? `Cannot reach API at ${baseUrl}. With USE_LOCAL_API=true, start ComparexFrontApi in another terminal: cd ComparexFrontApi && npm run dev (port 3001). Or set USE_LOCAL_API=false in .env.local to use live API and restart Next.`
        : `Cannot reach API at ${baseUrl}. On another machine, use the dev server Network URL (not localhost) and copy .env.local from .env.example. Ensure API_PROXY_TARGET is reachable from your network.`,
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
      `Cannot reach API at ${baseUrl}. On another machine, use the dev server Network URL (not localhost) and copy .env.local from .env.example. Ensure API_PROXY_TARGET is reachable from your network.`,
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
