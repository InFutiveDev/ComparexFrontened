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

export function fetchExpertBookings({ page = 1, limit = 50 } = {}) {
  return authFetch(`/expert?${withPagination({ page, limit })}`);
}

export function fetchExpertBookingById(id) {
  return authFetch(`/expert/${id}`);
}

export function updateExpertBookingStatus(id, status) {
  return authFetch(`/expert/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function fetchReviews({ page = 1, limit = 50 } = {}) {
  return authFetch(`/review?${withPagination({ page, limit })}`);
}

export function fetchReviewById(id) {
  return authFetch(`/review/${id}`);
}

export function updateReviewStatus(id, status) {
  return authFetch(`/review/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
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

export function updateResellerVerificationStatus(id, status) {
  return authFetch(`/reseller/${id}/verification-status`, {
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

export function createAdminPaymentGateway(payload) {
  return authFetch("/payment/admin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePaymentVerificationStatus(id, status) {
  return authFetch(`/payment/${id}/verification-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updatePaymentOnboardingDocuments(id, payload) {
  return authFetch(`/payment/${id}/documents`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function createAdminReseller(payload) {
  return authFetch("/reseller/admin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateResellerOnboardingDocuments(id, payload) {
  return authFetch(`/reseller/${id}/documents`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/** Master Admin — Global System Settings (FR-MA-01 / 02 / 03) */
export function fetchAdminSettings() {
  return authFetch("/admin/settings");
}

export function fetchAdminFeeSettings() {
  return authFetch("/admin/settings/fees");
}

export function updateAdminFeeSettings(payload) {
  return authFetch("/admin/settings/fees", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminPermissionSettings() {
  return authFetch("/admin/settings/permissions");
}

export function updateAdminPermissionSettings(payload) {
  return authFetch("/admin/settings/permissions", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminPayoutSettings() {
  return authFetch("/admin/settings/payouts");
}

export function updateAdminPayoutSettings(payload) {
  return authFetch("/admin/settings/payouts", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Master Admin — MDR Management (FR-MA-07 / 08 / 09) */
export function fetchAdminMdrSettings() {
  return authFetch("/admin/mdr");
}

export function updateAdminGlobalMdr(payload) {
  return authFetch("/admin/mdr/global", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateAdminMdrTiers(payload) {
  return authFetch("/admin/mdr/tiers", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminMdrAudit({ page = 1, limit = 50, scope } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (scope) params.set("scope", scope);
  return authFetch(`/admin/mdr/audit?${params.toString()}`);
}
