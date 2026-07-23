const DEFAULT_API_URL = "http://localhost:3001/api";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

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
      `Cannot reach API at ${API_BASE_URL}. Make sure the API server is running.`,
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
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    ...options,
  }).catch(() => {
    throw new ApiError(
      `Cannot reach API at ${API_BASE_URL}. Make sure the API server is running.`,
      0,
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
