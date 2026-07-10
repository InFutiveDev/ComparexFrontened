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

export function fetchMerchantById(id) {
  return authFetch(`/merchant/${id}`);
}

export function fetchResellers({ page = 1, limit = 50 } = {}) {
  return authFetch(`/reseller?${withPagination({ page, limit })}`);
}

export function fetchResellerById(id) {
  return authFetch(`/reseller/${id}`);
}

export function fetchPaymentGateways({ page = 1, limit = 50 } = {}) {
  return authFetch(`/payment?${withPagination({ page, limit })}`);
}

export function fetchPaymentGatewayById(id) {
  return authFetch(`/payment/${id}`);
}

export function fetchMerchantSupport({ page = 1, limit = 50 } = {}) {
  return authFetch(`/support?${withPagination({ page, limit })}`);
}

export function fetchMerchantSupportById(id) {
  return authFetch(`/support/${id}`);
}

export function updateMerchantAccountStatus(id, status) {
  return authFetch(`/merchant/${id}/account-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updateResellerAccountStatus(id, status) {
  return authFetch(`/reseller/${id}/account-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updatePaymentAccountStatus(id, status) {
  return authFetch(`/payment/${id}/account-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
