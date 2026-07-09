import { pgFirms } from "@/lib/pg-catalog";

export const POPULAR_PLATFORMS = [
  "Shopify",
  "WooCommerce",
  "Magento",
  "OpenCart",
  "Wix",
  "WordPress",
  "Zoho Commerce",
  "StoreHippo",
  "Dukaan",
  "Unicommerce",
  "EasyEcom",
  "Odoo",
  "Tally",
  "Custom Website",
  "Other",
];

function normalizePlatformName(value) {
  return value.trim().toLowerCase();
}

function collectPlatformsFromProfiles() {
  const platforms = new Set();

  for (const firm of pgFirms) {
    for (const platform of firm.platforms ?? []) {
      const name = platform.alt?.trim();
      if (name) platforms.add(name);
    }
  }

  return platforms;
}

export function getAllPlatforms() {
  const fromProfiles = collectPlatformsFromProfiles();
  const seen = new Set();
  const merged = [];

  for (const name of [...POPULAR_PLATFORMS, ...fromProfiles]) {
    const key = normalizePlatformName(name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(name);
  }

  return merged.sort((a, b) => a.localeCompare(b));
}

export function searchPlatforms(query) {
  const normalized = normalizePlatformName(query);
  if (!normalized) return getAllPlatforms();

  return getAllPlatforms().filter((platform) =>
    platform.toLowerCase().includes(normalized)
  );
}

export function resolvePlatformName(value) {
  const normalized = normalizePlatformName(value);
  if (!normalized) return "";

  return (
    getAllPlatforms().find((platform) => normalizePlatformName(platform) === normalized) ??
    value.trim()
  );
}

export function getProvidersForPlatform(platformName) {
  const resolved = resolvePlatformName(platformName);
  const normalized = normalizePlatformName(resolved);
  if (!normalized) return [];

  return pgFirms.filter((firm) =>
    (firm.platforms ?? []).some(
      (platform) => normalizePlatformName(platform.alt) === normalized
    )
  );
}
