const RS_KEY = "comparex_rs";
const PG_KEY = "comparex_pg";

function readUrlParams() {
  if (typeof window === "undefined") {
    return { pgId: "", resellerId: "" };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    pgId: params.get("pg")?.trim() || "",
    resellerId: params.get("rs")?.trim() || "",
  };
}

/** Persist ?pg= / ?rs= from the landing URL for the rest of the onboarding session. */
export function captureAffiliateParamsFromUrl() {
  const { pgId, resellerId } = readUrlParams();

  if (pgId) {
    sessionStorage.setItem(PG_KEY, pgId);
  }
  if (resellerId) {
    sessionStorage.setItem(RS_KEY, resellerId);
  }

  return { pgId, resellerId };
}

/** Resolve affiliate ids from URL first, then session storage. */
export function getAffiliateParams() {
  const fromUrl = readUrlParams();

  let pgId = fromUrl.pgId;
  let resellerId = fromUrl.resellerId;

  if (typeof window !== "undefined") {
    if (!pgId) {
      pgId = sessionStorage.getItem(PG_KEY)?.trim() || "";
    }
    if (!resellerId) {
      resellerId = sessionStorage.getItem(RS_KEY)?.trim() || "";
    }
  }

  return { pgId, resellerId };
}
