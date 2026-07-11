export const USER_ROLES = {
  MERCHANT: "merchant",
  RESELLER: "reseller",
  PAYMENT_PROVIDER: "payment_provider",
  ADMIN: "admin",
};

export const ACCOUNT_TYPE_TO_ROLE = {
  Merchant: USER_ROLES.MERCHANT,
  Reseller: USER_ROLES.RESELLER,
  "Payment Gateway": USER_ROLES.PAYMENT_PROVIDER,
  Admin: USER_ROLES.ADMIN,
};

const ROLE_LABELS = {
  [USER_ROLES.MERCHANT]: "Merchant",
  [USER_ROLES.RESELLER]: "Reseller",
  [USER_ROLES.PAYMENT_PROVIDER]: "Payment Gateway",
  [USER_ROLES.ADMIN]: "Admin",
};

const DASHBOARD_PATHS = {
  [USER_ROLES.MERCHANT]: "/merchant-dashboard",
  [USER_ROLES.RESELLER]: "/reseller-dashboard",
  [USER_ROLES.PAYMENT_PROVIDER]: "/payment-gateway-dashboard",
  [USER_ROLES.ADMIN]: "/dashboard",
};

export function accountTypeToRole(accountType) {
  return ACCOUNT_TYPE_TO_ROLE[accountType] ?? null;
}

export function formatRoleLabel(role) {
  return ROLE_LABELS[role] ?? "User";
}

export function getDashboardPathForRole(role) {
  return DASHBOARD_PATHS[role] ?? "/dashboard";
}

export function isAdminRole(role) {
  return role === USER_ROLES.ADMIN;
}
