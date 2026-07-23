/** Map PG comparison API rows into Write a Review step-1 provider cards. */
export function inferReviewCategory(pg) {
  const haystack = [
    ...(pg.categories || []),
    ...(pg.features || []),
    ...(pg.smartTags || []),
    pg.name,
  ]
    .join(" ")
    .toLowerCase();

  if (/pos|qr|soundbox|offline|terminal/.test(haystack)) return "pos-qr";
  if (/cross.?border|international|export|fx|global/.test(haystack)) return "crossborder";
  if (/payout|disbursement|razorpayx|cashfree payout/.test(haystack)) return "payouts";
  if (/subscription|recurring|billing|chargebee|zoho subscription/.test(haystack)) {
    return "subscription";
  }
  if (/kyc|fraud|verification|identity|signzy|hyperverge/.test(haystack)) return "kyc-fraud";
  if (/infrastructure|aggregator|switch|billdesk/.test(haystack)) return "infrastructure";
  return "online-pg";
}

export function mapPgToReviewProduct(pg) {
  const name = pg.name || "Payment Gateway";

  return {
    id: pg.id,
    paymentProviderId: pg.id,
    name,
    company: pg.companyName || name,
    logo: pg.logoUrl || null,
    initials: pg.initials || name.slice(0, 2).toUpperCase(),
    category: inferReviewCategory(pg),
    categories: pg.categories || [],
    slug: pg.slug || "",
  };
}
