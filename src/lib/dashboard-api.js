import { ApiError, apiFetch } from "@/lib/api";
import { authApiFetch } from "@/lib/auth-fetch";

async function authFetch(path, options = {}) {
  return authApiFetch(path, options);
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

export function fetchResellerGmvSummary({ from, to } = {}) {
  const params = new URLSearchParams();
  if (from) {
    params.set("from", from instanceof Date ? from.toISOString() : String(from));
  }
  if (to) {
    params.set("to", to instanceof Date ? to.toISOString() : String(to));
  }

  const query = params.toString();
  return authFetch(`/reseller/admin/gmv-summary${query ? `?${query}` : ""}`);
}

export function fetchPaymentGateways({ page = 1, limit = 50 } = {}) {
  return authFetch(`/payment?${withPagination({ page, limit })}`);
}

export function fetchPaymentGatewayById(id) {
  return authFetch(`/payment/${id}`);
}

export function fetchPgLeadFunnel({ pgId, leadType = "normal" } = {}) {
  const params = new URLSearchParams();
  params.set("pgId", pgId);
  params.set("leadType", leadType);
  return authFetch(`/payment/admin/pg-lead-funnel?${params.toString()}`);
}

export function fetchPgCommissionSummary({ from, to, model = "revenue" } = {}) {
  const params = new URLSearchParams();
  if (from) params.set("from", from instanceof Date ? from.toISOString() : String(from));
  if (to) params.set("to", to instanceof Date ? to.toISOString() : String(to));
  params.set("model", model);
  return authFetch(`/payment/admin/commission-summary?${params.toString()}`);
}

export function fetchPaymentGatewayCommissionSummary(id, { from, to } = {}) {
  const params = new URLSearchParams();
  if (from) params.set("from", from instanceof Date ? from.toISOString() : String(from));
  if (to) params.set("to", to instanceof Date ? to.toISOString() : String(to));
  const query = params.toString();
  return authFetch(`/payment/${id}/commission-summary${query ? `?${query}` : ""}`);
}

export function fetchMerchantSupport({ page = 1, limit = 50 } = {}) {
  return authFetch(`/support?${withPagination({ page, limit })}`);
}

export function fetchMerchantSupportById(id) {
  return authFetch(`/support/${id}`);
}

export function updateMerchantSupportStatus(id, status) {
  return authFetch(`/support/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function escalateMerchantSupportToPg(id, { paymentGatewayId, notes } = {}) {
  return authFetch(`/support/${id}/escalate`, {
    method: "POST",
    body: JSON.stringify({ paymentGatewayId, notes }),
  });
}

export function fetchExpertBookings({ page = 1, limit = 50 } = {}) {
  return authFetch(`/expert?${withPagination({ page, limit })}`);
}

export function fetchExpertBookingById(id) {
  return authFetch(`/expert/${id}`);
}

export function updateExpertBookingStatus(id, statusOrPayload) {
  const body =
    typeof statusOrPayload === "string"
      ? { status: statusOrPayload }
      : statusOrPayload;
  return authFetch(`/expert/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function updateExpertBooking(id, payload = {}) {
  return authFetch(`/expert/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
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

export function deleteReview(id) {
  return authFetch(`/review/${id}`, {
    method: "DELETE",
  });
}

export function updateMerchantAccountStatus(id, status) {
  return authFetch(`/merchant/${id}/account-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updateMerchantAdmin(id, payload = {}) {
  return authFetch(`/merchant/${id}/admin`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateMerchantPassword(id, password) {
  return authFetch(`/merchant/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
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

export function updateResellerAdmin(id, payload = {}) {
  return authFetch(`/reseller/${id}/admin`, {
    method: "PATCH",
    body: JSON.stringify(payload),
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

export function fetchAdminMdrAudit({ page = 1, limit = 50, scope, status } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (scope) params.set("scope", scope);
  if (status) params.set("status", status);
  return authFetch(`/admin/mdr/audit?${params.toString()}`);
}

export function proposeAdminPgPublicMdr(payload) {
  return authFetch("/admin/mdr/pg-public/propose", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Master Admin — Users & role assignment */
function usersQuery({ page = 1, limit = 10, role, status, search } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (role) params.set("role", role);
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  return params.toString();
}

export function fetchAdminUsers(filters = {}) {
  return authFetch(`/admin/users?${usersQuery(filters)}`);
}

export function createAdminUser(payload) {
  return authFetch("/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminUser(id, payload) {
  return authFetch(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
