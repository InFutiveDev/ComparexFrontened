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

/** Parse PG onboarding offers/promotions text for website display. */
export function buildWebsiteOfferFromPg(pg, ratingCount = 0) {
  const text = String(pg?.offersPromotions || "").trim();
  if (text) {
    const firstLine = text.split(/\n/)[0]?.trim() || "Partner Offer";
    const codeMatch = text.match(
      /(?:promo\s*)?(?:code|coupon)\s*[:\-]?\s*([A-Za-z0-9-]+)/i,
    );
    return {
      headline: firstLine.length > 72 ? `${firstLine.slice(0, 69)}…` : firstLine,
      code: codeMatch?.[1]?.toUpperCase() || null,
      description: text,
    };
  }

  if (ratingCount > 0) {
    return {
      headline: "Merchant Rated on CompareX",
      code: null,
      description: "",
    };
  }

  return {
    headline: "Activate via CompareX",
    code: null,
    description: "",
  };
}

export function buildWebsiteOfferCardsFromPg(firm) {
  const text = String(
    firm?.offersPromotions || firm?.offer?.description || firm?._raw?.offersPromotions || "",
  ).trim();

  if (!text) return [];

  const blocks = text.split(/\n\s*\n+/).filter(Boolean);
  const segments = blocks.length > 1 ? blocks : text.split(/\n/).filter(Boolean);

  return segments.map((block, index) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const title = lines[0] || `Offer ${index + 1}`;
    const codeMatch =
      block.match(/(?:promo\s*)?(?:code|coupon)\s*[:\-]?\s*([A-Za-z0-9-]+)/i) ||
      lines.find((line) => /code|coupon/i.test(line))?.match(/[:\s]([A-Za-z0-9-]+)/);

    return {
      id: `offer-${index}`,
      title,
      description: lines.length > 1 ? lines.slice(1).join(" ") : block,
      code: codeMatch?.[1]?.toUpperCase() || null,
      featured: index === 0,
      badge: index === 0 ? "From PG" : null,
    };
  });
}

/** Map `/payment/compare` row into the website compare table shape. */
export function mapPgToWebsiteCompareRow(pg) {
  const name = pg.name || "Payment Gateway";
  const ratingAverage = Number(pg.rating?.average || 0);
  const ratingCount = Number(pg.rating?.count || 0);
  const defaultPricing = formatMdrDisplay(pg.defaultMdr);
  const offer = buildWebsiteOfferFromPg(pg, ratingCount);

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
    offersPromotions: String(pg.offersPromotions || "").trim() || "",
    offer,
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
