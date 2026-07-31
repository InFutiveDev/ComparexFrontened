import { ApiError, getApiBaseUrl } from "@/lib/api";
import { authApiFetch, authApiRequest } from "@/lib/auth-fetch";
import { getStoredToken } from "@/lib/auth";

export function pgNameToSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function parseDetectedFormatFromError(message) {
  if (!message) return null;
  const quoted = message.match(/"([a-z0-9_-]+)" raw export/i);
  if (quoted?.[1]) return quoted[1];
  const looksLike = message.match(/looks like a "([a-z0-9_-]+)"/i);
  if (looksLike?.[1]) return looksLike[1];
  return null;
}

export function isPgNameRequiredError(message) {
  return /requires the "pgName" field/i.test(message || "");
}

function toApiPath(urlOrPath) {
  if (!urlOrPath) return "";
  if (urlOrPath.startsWith("http")) {
    try {
      const parsed = new URL(urlOrPath);
      const path = parsed.pathname.replace(/^\/api/, "");
      return path.startsWith("/") ? path : `/${path}`;
    } catch {
      return urlOrPath;
    }
  }
  const path = urlOrPath.replace(/^\/api/, "");
  return path.startsWith("/") ? path : `/${path}`;
}

export async function uploadTransactionData({ file, pgName, formatId } = {}) {
  if (!file) {
    throw new ApiError("Please select a file to upload", 400);
  }

  const token = getStoredToken();
  if (!token) {
    throw new ApiError("Authentication required", 401);
  }

  const formData = new FormData();
  formData.append("file", file);
  if (pgName) formData.append("pgName", pgName);
  if (formatId) formData.append("formatId", formatId);

  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/reports/upload-transaction-data`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).catch(() => {
    throw new ApiError(
      `Cannot reach API at ${baseUrl}. Make sure the API server is running.`,
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
      data?.error ||
      data?.message ||
      (response.status === 500
        ? "An unexpected server error occurred. Please try again."
        : `Upload failed (${response.status})`);
    throw new ApiError(message, response.status);
  }

  return data;
}

export async function fetchProcessedTransactions({
  page = 1,
  limit = 25,
  search,
  batchId,
  pgName,
  from,
  to,
  mid,
  payoutStatus,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search?.trim()) params.set("search", search.trim());
  if (batchId) params.set("batchId", batchId);
  if (pgName?.trim()) params.set("pgName", pgName.trim());
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (mid?.trim()) params.set("mid", mid.trim());
  if (payoutStatus) params.set("payoutStatus", payoutStatus);

  return authApiFetch(`/reports/transactions?${params.toString()}`);
}

export function deleteProcessedTransaction(id) {
  return authApiFetch(`/reports/transactions/${id}`, {
    method: "DELETE",
  });
}

function reportParams({
  page = 1,
  limit = 25,
  search,
  pgName,
  from,
  to,
  mid,
  payoutStatus,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search?.trim()) params.set("search", search.trim());
  if (pgName?.trim()) params.set("pgName", pgName.trim());
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (mid?.trim()) params.set("mid", mid.trim());
  if (payoutStatus) params.set("payoutStatus", payoutStatus);
  return params.toString();
}

export function fetchComparexRevenueReport(filters = {}) {
  return authApiFetch(`/reports/comparex-revenue?${reportParams(filters)}`);
}

export function fetchResellerCommissionReport(filters = {}) {
  return authApiFetch(`/reports/reseller-commissions?${reportParams(filters)}`);
}

export function fetchPendingPayoutsReport(filters = {}) {
  return authApiFetch(`/reports/pending-payouts?${reportParams(filters)}`);
}

export async function downloadTransactionErrorLog(downloadUrl, batchId) {
  const path =
    toApiPath(downloadUrl) ||
    (batchId ? `/reports/upload-batches/${batchId}/error-log` : "");

  if (!path) {
    throw new ApiError("Error log is not available for this batch", 400);
  }

  const response = await authApiRequest(path);
  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch {
      // CSV error responses may not be JSON.
    }
    throw new ApiError(
      data?.error || data?.message || "Failed to download error log",
      response.status,
    );
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const fileName =
    disposition.match(/filename="([^"]+)"/)?.[1] ||
    `transaction-upload-errors-${batchId || "batch"}.csv`;
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
