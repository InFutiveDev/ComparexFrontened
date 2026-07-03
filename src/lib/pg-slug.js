export function pgNameToSlug(name) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

const KNOWN_PG_NAMES = [
  "Razorpay",
  "Cashfree",
  "PhonePe PG",
  "PayU PG",
  "Paytm PG",
  "GPay PG",
];

const SLUG_TO_NAME = Object.fromEntries(
  KNOWN_PG_NAMES.map((name) => [pgNameToSlug(name), name])
);

export function pgSlugToDisplayName(slug) {
  if (SLUG_TO_NAME[slug]) {
    return SLUG_TO_NAME[slug];
  }

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function isKnownPgSlug(slug) {
  return Boolean(SLUG_TO_NAME[slug]);
}
