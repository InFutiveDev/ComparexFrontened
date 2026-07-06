import { ApiError, apiFetch } from "@/lib/api";
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

function withPagination({ page = 1, limit = 50 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return params.toString();
}

export function fetchMerchants({ page = 1, limit = 50 } = {}) {
  return authFetch(`/merchant?${withPagination({ page, limit })}`);
}

export function fetchResellers({ page = 1, limit = 50 } = {}) {
  return authFetch(`/reseller?${withPagination({ page, limit })}`);
}

export function fetchPaymentGateways({ page = 1, limit = 50 } = {}) {
  return authFetch(`/payment?${withPagination({ page, limit })}`);
}

export function fetchMerchantSupport({ page = 1, limit = 50 } = {}) {
  return authFetch(`/support?${withPagination({ page, limit })}`);
}
