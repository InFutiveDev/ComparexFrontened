export const PARTNERSHIP_MODEL_OPTIONS = [
  { value: "qualified-opportunity-fee", label: "Qualified Opportunity Fee" },
  { value: "revenue-sharing", label: "Revenue Sharing" },
];

export const YEARS_EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "0–1 years" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10-plus", label: "10+ years" },
];

export const MERCHANT_NETWORK_OPTIONS = [
  { value: "none", label: "No existing network" },
  { value: "1-10", label: "1–10 merchants" },
  { value: "11-50", label: "11–50 merchants" },
  { value: "51-100", label: "51–100 merchants" },
  { value: "100-plus", label: "100+ merchants" },
];

export const MONTHLY_REFERRAL_OPTIONS = [
  { value: "1-5", label: "1–5 referrals" },
  { value: "6-15", label: "6–15 referrals" },
  { value: "16-30", label: "16–30 referrals" },
  { value: "30-plus", label: "30+ referrals" },
];

export const BANK_ACCOUNT_TYPE_OPTIONS = [
  { value: "savings", label: "Savings Account" },
  { value: "current", label: "Current Account" },
];

export function formatVerificationLabel(status) {
  switch (status) {
    case "pending_review":
      return "Pending admin review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return "Incomplete";
  }
}
