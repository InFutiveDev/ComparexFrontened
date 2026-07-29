import { pgNameToSlug } from "@/lib/pg-slug";

const MAX_COMPARE_PG = 3;
export const COMPARE_SIDE_STORAGE_KEY = "comparex-compare-side-pgs";

export function buildCompareSideHref(firms, selectedNames) {
  const selected = selectedNames
    .slice(0, MAX_COMPARE_PG)
    .map((name) => firms.find((item) => item.name === name))
    .filter(Boolean);

  const slugs = selected
    .map((firm) => firm.slug || pgNameToSlug(firm.name))
    .filter(Boolean);

  if (typeof window !== "undefined" && selected.length >= 2) {
    try {
      sessionStorage.setItem(
        COMPARE_SIDE_STORAGE_KEY,
        JSON.stringify(selected),
      );
    } catch {
      // ignore storage failures
    }
  }

  if (slugs.length < 2) return "/compare-pg";
  return `/compare-side?pgs=${encodeURIComponent(slugs.join(","))}`;
}

export function readCompareSideSnapshot() {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(COMPARE_SIDE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
