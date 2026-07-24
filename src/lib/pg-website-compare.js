export const WEBSITE_PAYMENT_MODES = [
  { label: "UPI Payments", apiKey: "upi" },
  { label: "Credit Card", apiKey: "credit_card" },
  { label: "Debit Card", apiKey: "debit_card" },
  { label: "Net Banking", apiKey: "net_banking" },
  { label: "Wallet Payments", apiKey: "wallet" },
  { label: "International", apiKey: "international" },
];

export const WEBSITE_PAYMENT_MODE_LABELS = WEBSITE_PAYMENT_MODES.map(
  (mode) => mode.label,
);

export const TAT_LABELS = {
  instant: "Instant",
  "1-2-days": "1–2 days",
  "3-5-days": "3–5 days",
  "1-week-plus": "1 week+",
};

export const SETTLEMENT_LABELS = {
  "t+0": "T+0",
  "t+1": "T+1",
  "t+2": "T+2",
  "t+3": "T+3",
  weekly: "Weekly",
  instant: "Instant",
};

const TAT_SORT_HOURS = {
  instant: 0,
  "1-2-days": 24,
  "3-5-days": 72,
  "1-week-plus": 168,
};

const SMART_TAG_LABELS = {
  "startup-friendly": "🚀 Startup Friendly",
  "fast-activation": "⚡ Fast Activation",
  "scaling-businesses": "📈 Scaling Businesses",
  "low-documentation": "📄 Low Documentation",
  "subscription-ready": "🔁 Subscription Ready",
  "instant-settlement": "💸 Instant Settlement",
  "dedicated-support": "🤝 Dedicated Support",
  "enterprise-ready": "🏢 Enterprise Ready",
};

function formatLabel(value) {
  if (!value) return "—";
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatMdrDisplay(value) {
  if (!value || value === "Not configured") return "—";
  const str = String(value).trim();
  if (str.includes("%") || str.startsWith("₹")) return str;
  return `${str}%`;
}

function formatSmartTags(tags = []) {
  const formatted = tags
    .map((tag) => SMART_TAG_LABELS[tag] || formatLabel(tag))
    .filter(Boolean);

  return formatted.length ? formatted : ["CompareX Verified PG"];
}

function formatSettlement(cycle) {
  if (!cycle) return "—";
  return SETTLEMENT_LABELS[cycle] || formatLabel(cycle);
}

function formatOnboardingTat(tat) {
  if (!tat) return "—";
  return TAT_LABELS[tat] || formatLabel(tat);
}

function formatOnboardingHours(tat) {
  return TAT_SORT_HOURS[tat] ?? 999;
}

/** Map `/payment/compare` row into the website compare table shape. */
export function mapPgToWebsiteCompareRow(pg) {
  const name = pg.name || "Payment Gateway";
  const ratingAverage = Number(pg.rating?.average || 0);
  const ratingCount = Number(pg.rating?.count || 0);
  const defaultPricing = formatMdrDisplay(pg.defaultMdr);

  return {
    id: pg.id,
    slug: pg.slug || "",
    name,
    logo: pg.initials || name.slice(0, 2).toUpperCase(),
    logoUrl: pg.logoUrl || null,
    website: pg.website || null,
    bestForTags: formatSmartTags(pg.smartTags),
    businessAge: null,
    businessAgeYears: null,
    location: pg.location || "—",
    pricing: defaultPricing,
    mdr: pg.mdr || {},
    settlement: formatSettlement(pg.settlementCycle),
    settlementInstant: String(pg.settlementCycle || "")
      .toLowerCase()
      .includes("instant"),
    onboarding: formatOnboardingTat(pg.onboardingTat),
    onboardingHours: formatOnboardingHours(pg.onboardingTat),
    products:
      Array.isArray(pg.features) && pg.features.length
        ? pg.features.slice(0, 6)
        : ["Payment Gateway"],
    platforms: [],
    platformsExtra: 0,
    offer: {
      headline: ratingCount > 0 ? "Merchant Rated" : "CompareX Offer",
      code: "COMPAREX",
    },
    review: ratingCount > 0 ? ratingAverage.toFixed(1) : "—",
    reviewCount: ratingCount,
    trust: ratingCount > 0 ? (ratingAverage * 2).toFixed(1) : "—",
    featured: ratingAverage >= 4 && ratingCount >= 1,
    tatOrder: pg.tatOrder ?? 99,
    categories: pg.categories || [],
    _raw: pg,
  };
}

export function mapPgCompareListToWebsiteRows(response) {
  return (response?.paymentGateways ?? []).map(mapPgToWebsiteCompareRow);
}

export function getWebsitePricingForMode(firm, modeIndex, _subFilter = null) {
  const mode = WEBSITE_PAYMENT_MODES[modeIndex];
  if (!mode) return firm.pricing || "—";

  const value = firm.mdr?.[mode.apiKey];
  return formatMdrDisplay(value) !== "—"
    ? formatMdrDisplay(value)
    : firm.pricing || "—";
}

export function buildWebsitePricingMap(firm) {
  const map = {};
  for (const mode of WEBSITE_PAYMENT_MODES) {
    map[mode.label] = formatMdrDisplay(firm.mdr?.[mode.apiKey]);
  }
  return map;
}

export function findWebsiteCompareRowBySlug(rows, slug) {
  return rows.find((row) => row.slug === slug) ?? null;
}
