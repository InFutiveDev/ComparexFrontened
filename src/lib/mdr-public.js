/** Maps compare payment modes to onboarding profile fields (public website MDR). */
export const ONBOARDING_MDR_FIELD_BY_MODE = {
  upi: "upiMdr",
  credit_card: "creditCardMdr",
  debit_card: "debitCardMdr",
  international: "internationalMdr",
  wallet: "walletCharges",
  net_banking: "netBankingCharges",
  emi_bnpl: "emiBnplCharges",
};

export function ratesFromPgOnboarding(onboarding = {}) {
  const rates = {};
  for (const [mode, field] of Object.entries(ONBOARDING_MDR_FIELD_BY_MODE)) {
    rates[mode] = String(onboarding[field] || "").trim();
  }
  return rates;
}

export function formatMdrStatus(status) {
  if (!status) return "Applied";
  if (status === "pending") return "Pending PG approval";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return status;
}
