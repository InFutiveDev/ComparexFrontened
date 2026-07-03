export const merchantSupportIndustryOptions = [
  { value: "ecommerce-d2c", label: "Ecommerce / D2C" },
  { value: "b2b-manufacturing", label: "B2B / Manufacturing Businesses" },
  { value: "saas-subscription-platforms", label: "SaaS / Subscription Platforms" },
  { value: "education-healthcare", label: "Education / Healthcare Services" },
  { value: "travel-bill-payments", label: "Travel / Bill Payments" },
  { value: "other-businesses", label: "Freelancers  / Other Businesses" },
];

export const merchantSupportPriorityOptions = [
  { value: "lower-transaction-fees", label: "Lower Transaction Fees" },
  { value: "faster-settlements", label: "Faster Settlements" },
  { value: "easy-onboarding-approval", label: "Easy Onboarding & Approval" },
  { value: "better-success-rates", label: "Better Success Rates" },
  { value: "international-payment-support", label: "International Payment Support" },
  { value: "subscription-recurring-billing", label: "Subscription / Recurring Billing" },
  { value: "better-customer-support", label: "Better Customer Support" },
  { value: "easy-website-app-integration", label: "Easy Website / App Integration" },
];

export function getIndustryLabel(value) {
  return merchantSupportIndustryOptions.find((option) => option.value === value)?.label ?? value;
}

export function getPriorityLabel(value) {
  return merchantSupportPriorityOptions.find((option) => option.value === value)?.label ?? value;
}

export function toMerchantSupportTableRow(submission) {
  return {
    id: submission.id,
    name: submission.businessName,
    company: submission.businessName,
    email: submission.email,
    phone: submission.phone,
    status: submission.status ?? "New",
    source: submission.source ?? "Home Page Form",
    score: 0,
    priority: submission.priorityLabel ?? getPriorityLabel(submission.priority),
    assignee: "Unassigned",
    assigneeInitials: "—",
    assigneeColor: "#94a3b8",
    category: submission.industryLabel ?? getIndustryLabel(submission.industry),
    workType: "Merchant Support",
    submittedAt: submission.submittedAt,
    industry: submission.industry,
    priorityValue: submission.priority,
  };
}
