/** Single master config for PG onboarding — powers form visibility + comparison fields. */

export const SERVICE_TYPES = [
  {
    value: "full-stack-pg",
    label: "Full-Stack Payment Gateway",
    emoji: "💳",
  },
  {
    value: "upi-only-pg",
    label: "UPI-Only Payment Gateway",
    emoji: "🇮🇳",
  },
  {
    value: "pos",
    label: "POS System (Physical + Digital)",
    emoji: "🛒",
  },
  {
    value: "cross-border",
    label: "Cross-Border Payment Solution",
    emoji: "🌍",
  },
  {
    value: "one-click",
    label: "One-Click Checkout Solution",
    emoji: "⚡",
  },
  {
    value: "risk-frm",
    label: "Risk & Fraud Verification Service",
    emoji: "🛡️",
  },
  {
    value: "orchestration",
    label: "Payment Orchestration Platform",
    emoji: "🔄",
  },
];

/** Spec sections shown for each service type */
export const SECTION_VISIBILITY = {
  "full-stack-pg": {
    company: true,
    pricing: true,
    operations: true,
    smartTags: true,
    sortBy: true,
    features: true,
    technical: true,
    merchantExperience: true,
    talkToExpert: true,
  },
  "upi-only-pg": {
    company: true,
    pricing: true,
    operations: true,
    smartTags: true,
    sortBy: true,
    features: true,
    technical: true,
    merchantExperience: true,
    talkToExpert: true,
  },
  pos: {
    company: true,
    pricing: true,
    operations: true,
    smartTags: true,
    sortBy: true,
    features: true,
    technical: true,
    merchantExperience: true,
    talkToExpert: true,
  },
  "cross-border": {
    company: true,
    pricing: true,
    operations: true,
    smartTags: true,
    sortBy: true,
    features: true,
    technical: true,
    merchantExperience: true,
    talkToExpert: true,
  },
  "one-click": {
    company: true,
    pricing: true,
    operations: true,
    smartTags: true,
    sortBy: true,
    features: true,
    technical: true,
    merchantExperience: true,
    talkToExpert: true,
  },
  "risk-frm": {
    company: true,
    pricing: true,
    operations: true,
    smartTags: true,
    sortBy: true,
    features: true,
    technical: true,
    merchantExperience: true,
    talkToExpert: true,
  },
  orchestration: {
    company: true,
    pricing: true,
    operations: true,
    smartTags: true,
    sortBy: true,
    features: true,
    technical: true,
    merchantExperience: true,
    talkToExpert: true,
  },
};

/** Field-level visibility by service type. Omit/empty = always if section shown. */
export const FIELD_VISIBILITY = {
  // Pricing
  upiMdr: ["full-stack-pg", "upi-only-pg", "pos", "one-click", "orchestration"],
  creditCardMdr: ["full-stack-pg", "orchestration"],
  debitCardMdr: ["full-stack-pg", "orchestration"],
  internationalMdr: ["full-stack-pg", "cross-border"],
  walletCharges: ["full-stack-pg", "orchestration"],
  netBankingCharges: ["full-stack-pg", "orchestration"],
  emiBnplCharges: ["full-stack-pg", "one-click"],
  refundFee: ["full-stack-pg", "pos"],
  chargebackFee: ["full-stack-pg", "risk-frm"],
  amcPlatformFees: "all",
  setupFees: "all",
  instantSettlementCharges: ["full-stack-pg", "orchestration"],
  offersPromotions: "all",
  hardwareCost: ["pos"],
  annualMaintenanceContract: ["pos"],
  monthlyRental: ["pos"],
  forexMarkup: ["cross-border"],
  settlementCurrency: ["cross-border"],
  settlementInfrastructure: ["cross-border"],
  multiCurrencyWallet: ["cross-border"],
  perTransactionFee: ["risk-frm"],
  monthlyRetainer: ["risk-frm"],

  // Operations
  onboardingChecklist: "all",
  onboardingTat: "all",
  settlementCycle: ["full-stack-pg", "upi-only-pg", "pos", "cross-border", "one-click", "orchestration"],
  refundSla: ["full-stack-pg", "upi-only-pg", "pos", "cross-border", "one-click", "orchestration"],
  approvalComplexity: "all",
  dedicatedAccountManager: "all",
  merchantSupportAvailability: "all",
  escalationSupport: "all",
  instantSettlementAvailability: ["full-stack-pg", "orchestration"],
  internationalPaymentsSupport: ["full-stack-pg", "cross-border"],
  offlineModeSupport: ["pos"],
  gstBillingSupport: ["pos"],
  averageResponseTime: ["risk-frm"],
  restrictedCategories: "all",
  bestSuitedBusinessTypes: "all",
};

export function isFieldVisible(serviceType, fieldKey) {
  if (!serviceType) return false;
  const rule = FIELD_VISIBILITY[fieldKey];
  if (!rule) return true;
  if (rule === "all") return true;
  return rule.includes(serviceType);
}

export const RBI_PAPG_OPTIONS = [
  { value: "compliant", label: "Compliant" },
  { value: "in-progress", label: "In-Progress" },
  { value: "not-applicable", label: "Not Applicable" },
];

export const PCI_DSS_OPTIONS = [
  { value: "level-1", label: "Level 1" },
  { value: "level-2", label: "Level 2" },
  { value: "not-certified", label: "Not Certified" },
];

export const COUNTRY_OPTIONS = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Singapore",
  "Australia",
  "Canada",
  "Japan",
  "Germany",
  "Others",
];

export const SETTLEMENT_CURRENCY_OPTIONS = [
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SGD",
  "AUD",
  "CAD",
  "JPY",
  "Others",
];

export const SETTLEMENT_INFRASTRUCTURE_OPTIONS = [
  "Local Collection Accounts",
  "Correspondent Banking",
  "Nostro",
  "Vostro",
  "Partner Bank Network",
];

export const ONBOARDING_TAT_OPTIONS = [
  { value: "instant", label: "Instant" },
  { value: "1-2-days", label: "1-2 Days" },
  { value: "3-5-days", label: "3-5 Days" },
  { value: "1-week-plus", label: "1 Week+" },
];

export const SETTLEMENT_CYCLE_OPTIONS = [
  { value: "t+0", label: "T+0" },
  { value: "t+1", label: "T+1" },
  { value: "t+2", label: "T+2" },
  { value: "t+3", label: "T+3" },
  { value: "weekly", label: "Weekly" },
];

export const REFUND_SLA_OPTIONS = [
  { value: "instant", label: "Instant" },
  { value: "2-4-hrs", label: "2-4 Hrs" },
  { value: "24-hrs", label: "24 Hrs" },
  { value: "2-3-days", label: "2-3 Days" },
];

export const APPROVAL_COMPLEXITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const SUPPORT_AVAILABILITY_OPTIONS = [
  { value: "24-7", label: "24/7" },
  { value: "business-hours", label: "Business Hours" },
  { value: "custom", label: "Custom" },
];

export const FRM_RESPONSE_TIME_OPTIONS = [
  { value: "lt-100ms", label: "<100ms" },
  { value: "lt-500ms", label: "<500ms" },
  { value: "lt-1s", label: "<1s" },
];

export const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const SMART_TAG_OPTIONS = [
  { value: "startup-friendly", label: "Startup Friendly", emoji: "🚀" },
  { value: "fast-activation", label: "Fast Activation", emoji: "⚡" },
  { value: "instant-settlement", label: "Instant Settlement", emoji: "💸" },
  { value: "international-ready", label: "International Ready", emoji: "🌍" },
  { value: "d2c-friendly", label: "D2C Friendly", emoji: "🛍️" },
  { value: "merchant-friendly-support", label: "Merchant Friendly Support", emoji: "🤝" },
  { value: "scaling-businesses", label: "Scaling Businesses", emoji: "📈" },
  { value: "developer-friendly", label: "Developer Friendly", emoji: "🔧" },
  { value: "upi-focused", label: "UPI Focused", emoji: "🇮🇳" },
  { value: "low-documentation", label: "Low Documentation", emoji: "🧾" },
  { value: "popular-choice", label: "Popular Choice", emoji: "🏆" },
  { value: "api-first", label: "API First", emoji: "🧠" },
  { value: "marketplace-friendly", label: "Marketplace Friendly", emoji: "📦" },
  { value: "subscription-ready", label: "Subscription Ready", emoji: "🔄" },
  { value: "enterprise-ready", label: "Enterprise Ready", emoji: "⚙️" },
  { value: "mobile-app-friendly", label: "Mobile App Friendly", emoji: "📲" },
  { value: "cross-border-payments", label: "Cross Border Payments", emoji: "🌐" },
  { value: "sme-friendly", label: "SME Friendly", emoji: "💼" },
  { value: "sandbox-ready", label: "Sandbox Ready", emoji: "🧪" },
  { value: "secure-checkout", label: "Secure Checkout", emoji: "🔒" },
];

export const MAX_SMART_TAGS = 5;

export const SORT_BY_OPTIONS = [
  { value: "full-pg-stack", label: "Full PG stack" },
  { value: "one-click-checkout", label: "One Click Checkout" },
  { value: "upi-only", label: "UPI Only" },
  { value: "pos", label: "POS" },
  { value: "cross-border", label: "Cross Border" },
  { value: "fraud-risk-frm", label: "Fraud & Risk (FRM)" },
  { value: "orchestration", label: "Orchestration" },
  { value: "new-pgs", label: "New PGs" },
];

export const FEATURE_REPO = {
  "core-payments": {
    label: "Core Payments",
    features: [
      "UPI Payments",
      "Credit Card",
      "Debit Card",
      "Net Banking",
      "Wallet",
      "QR Payments",
    ],
    shownFor: "all",
  },
  "advanced-payments": {
    label: "Advanced Payments",
    features: [
      "International",
      "Recurring",
      "Subscription",
      "Tokenization",
      "Smart Routing",
      "Dynamic Routing",
      "EMI",
      "BNPL",
    ],
    shownFor: ["full-stack-pg", "orchestration"],
  },
  "business-solutions": {
    label: "Business Solutions",
    features: [
      "Payment Links",
      "Payment Forms",
      "Invoices",
      "Virtual Accounts",
      "Split Settlements",
      "Marketplace",
      "Vendor Payouts",
      "Bulk Payouts",
      "Escrow",
    ],
    shownFor: ["full-stack-pg", "orchestration"],
  },
  "offline-pos": {
    label: "Offline & POS",
    features: ["Soft POS", "Android POS", "Soundbox", "QR Solutions"],
    shownFor: ["pos"],
  },
  "risk-verification": {
    label: "Risk & Verification",
    features: [
      "KYC Verification",
      "Fraud Detection",
      "Risk Engine",
      "Chargeback Management",
      "Identity Verification",
    ],
    shownFor: ["risk-frm", "full-stack-pg"],
  },
  "developer-technical": {
    label: "Developer & Technical",
    features: [
      "APIs",
      "SDKs",
      "Sandbox",
      "Webhooks",
      "Shopify Plugin",
      "WooCommerce Plugin",
      "Magento Plugin",
    ],
    shownFor: "all",
  },
  "cross-border": {
    label: "Cross-Border",
    features: ["FX Management", "Multi-Currency", "Cross-Border Settlements"],
    shownFor: ["cross-border"],
  },
  "one-click-checkout": {
    label: "One-Click Checkout",
    features: [
      "Guest Checkout",
      "Saved Cards",
      "UPI One-Click",
      "Checkout Customisation",
      "Funnel Analytics",
    ],
    shownFor: ["one-click"],
  },
};

export function getFeaturesForServiceType(serviceType) {
  if (!serviceType) return [];
  const list = [];
  for (const group of Object.values(FEATURE_REPO)) {
    const shown =
      group.shownFor === "all" ||
      (Array.isArray(group.shownFor) && group.shownFor.includes(serviceType));
    if (shown) list.push(...group.features);
  }
  return [...new Set(list)];
}

export const SDK_OPTIONS = ["Python", "PHP", "Node.js", "Java", ".NET", "Ruby"];

export const PLUGIN_OPTIONS = [
  "Shopify",
  "WooCommerce",
  "Magento",
  "BigCommerce",
  "PrestaShop",
];

export const MOBILE_SDK_OPTIONS = ["iOS", "Android", "React Native", "Flutter"];

export const BUSINESS_TYPE_OPTIONS = [
  "Ecommerce / D2C",
  "B2B / Manufacturing",
  "SaaS / Subscription",
  "Education / Healthcare",
  "Travel / Bill Payments",
  "Marketplace",
  "SME",
  "Enterprise",
  "High Risk",
  "Other",
];

export const RESTRICTED_CATEGORY_OPTIONS = [
  "Gambling",
  "Adult Content",
  "Cryptocurrency",
  "Tobacco",
  "Firearms",
  "Pharmaceuticals",
  "MLM",
  "Other High Risk",
];

export const ONBOARDING_STEPS = [
  { id: "service-type", label: "Service type", section: "serviceType" },
  { id: "company", label: "Company information", section: "company" },
  { id: "pricing", label: "Pricing & commercials", section: "pricing" },
  { id: "operations", label: "Operational & onboarding", section: "operations" },
  { id: "smart-tags", label: "Smart tags", section: "smartTags" },
  { id: "sort-by", label: "Sort by mapping", section: "sortBy" },
  { id: "features", label: "Product features", section: "features" },
  { id: "technical", label: "Technical integration", section: "technical" },
  { id: "merchant-experience", label: "Merchant experience", section: "merchantExperience" },
  { id: "talk-to-expert", label: "Talk to expert", section: "talkToExpert" },
  { id: "recommendation", label: "Recommendation", section: "recommendation" },
];

export function getVisibleSteps(serviceType) {
  if (!serviceType) {
    return ONBOARDING_STEPS.filter((s) => s.id === "service-type" || s.id === "recommendation");
  }
  const visibility = SECTION_VISIBILITY[serviceType] || {};
  return ONBOARDING_STEPS.filter((step) => {
    if (step.section === "serviceType" || step.section === "recommendation") return true;
    return Boolean(visibility[step.section]);
  });
}

export const initialOnboardingForm = {
  serviceType: "",
  // Company
  legalEntityName: "",
  brandName: "",
  companyLogo: null,
  websiteUrl: "",
  headquartersCountry: "",
  headquartersCity: "",
  yearEstablished: "",
  merchantBaseCount: "",
  countriesSupported: [],
  rbiPapgStatus: "",
  pciDssStatus: "",
  companyOverview: "",
  // Pricing
  upiMdr: "",
  creditCardMdr: "",
  debitCardMdr: "",
  internationalMdr: "",
  walletCharges: "",
  netBankingCharges: "",
  emiBnplCharges: "",
  refundFee: "",
  chargebackFee: "",
  amcPlatformFees: "",
  setupFees: "",
  instantSettlementCharges: "",
  offersPromotions: "",
  hardwareCost: "",
  annualMaintenanceContract: "",
  monthlyRental: "",
  forexMarkup: "",
  settlementCurrency: "",
  settlementInfrastructure: "",
  multiCurrencyWallet: "",
  perTransactionFee: "",
  monthlyRetainer: "",
  // Operations
  onboardingChecklist: null,
  onboardingTat: "",
  settlementCycle: "",
  refundSla: "",
  approvalComplexity: "",
  dedicatedAccountManager: false,
  merchantSupportAvailability: "",
  escalationSupport: false,
  instantSettlementAvailability: false,
  internationalPaymentsSupport: false,
  offlineModeSupport: false,
  gstBillingSupport: false,
  averageResponseTime: "",
  restrictedCategories: [],
  bestSuitedBusinessTypes: [],
  // Discovery
  smartTags: [],
  suggestNewTag: "",
  sortByCategories: [],
  features: [],
  suggestNewFeature: "",
  // Technical
  apiDocumentationUrl: "",
  sdkAvailability: [],
  pluginAvailability: [],
  sandboxAccess: false,
  webhookSupport: false,
  mobileSdkSupport: [],
  // Merchant experience
  merchantSuccessStoriesUrl: "",
  caseStudiesUrl: "",
  // Talk to expert
  talkToExpertEnabled: true,
  expertName: "",
  expertDesignation: "",
  expertEmail: "",
  expertMobile: "",
  expertDescription: "",
  calendarSynced: false,
  availabilitySlots: "",
};

export function validateStep(stepId, form) {
  const st = form.serviceType;
  const show = (key) => isFieldVisible(st, key);

  switch (stepId) {
    case "service-type":
      return Boolean(form.serviceType);
    case "company":
      return Boolean(
        form.legalEntityName.trim() &&
          form.brandName.trim() &&
          form.websiteUrl.trim() &&
          form.headquartersCountry &&
          form.headquartersCity.trim() &&
          form.yearEstablished.trim() &&
          form.pciDssStatus &&
          form.companyOverview.trim()
      );
    case "pricing": {
      if (show("upiMdr") && !form.upiMdr) return false;
      if (show("creditCardMdr") && !form.creditCardMdr) return false;
      if (show("debitCardMdr") && !form.debitCardMdr) return false;
      if (show("hardwareCost") && !form.hardwareCost) return false;
      if (show("forexMarkup") && !form.forexMarkup) return false;
      if (show("settlementCurrency") && !form.settlementCurrency) return false;
      if (show("settlementInfrastructure") && !form.settlementInfrastructure) return false;
      if (show("multiCurrencyWallet") && !form.multiCurrencyWallet) return false;
      if (show("perTransactionFee") && !form.perTransactionFee) return false;
      return true;
    }
    case "operations": {
      if (!form.onboardingTat) return false;
      if (show("settlementCycle") && !form.settlementCycle) return false;
      if (show("averageResponseTime") && !form.averageResponseTime) return false;
      if (!form.restrictedCategories.length) return false;
      if (!form.bestSuitedBusinessTypes.length) return false;
      return true;
    }
    case "smart-tags":
      return form.smartTags.length > 0 && form.smartTags.length <= MAX_SMART_TAGS;
    case "sort-by":
      return form.sortByCategories.length > 0;
    case "features":
      return form.features.length > 0;
    case "technical":
      return Boolean(form.apiDocumentationUrl.trim() && form.pluginAvailability.length > 0);
    case "merchant-experience":
      return true;
    case "talk-to-expert":
      if (!form.talkToExpertEnabled) return true;
      return Boolean(
        form.expertName.trim() &&
          form.expertEmail.trim() &&
          form.expertMobile.trim() &&
          form.expertDescription.trim() &&
          form.calendarSynced
      );
    case "recommendation":
      return true;
    default:
      return false;
  }
}
