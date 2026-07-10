export const ACCOUNT_TYPE_TO_ROLE = {
  Merchant: "merchant",
  Reseller: "reseller",
  "Payment Gateway": "payment_provider",
};

export function accountTypeToRole(accountType) {
  return ACCOUNT_TYPE_TO_ROLE[accountType] ?? null;
}
