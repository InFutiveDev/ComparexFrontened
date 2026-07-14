const STORAGE_KEY = "comparex.pg.onboarding.profile";

function sanitizeFileMeta(value) {
  if (!value) return null;
  if (typeof value === "string") {
    return { fileName: value };
  }
  if (typeof File !== "undefined" && value instanceof File) {
    return { fileName: value.name };
  }
  if (typeof value === "object") {
    return {
      fileName: value.fileName || value.name || null,
      url: value.url || null,
      key: value.key || null,
      mimeType: value.mimeType || null,
      size: value.size ?? null,
    };
  }
  return null;
}

function sanitizeForStorage(form) {
  if (!form || typeof form !== "object") return null;

  return {
    ...form,
    companyLogo: sanitizeFileMeta(form.companyLogo),
    onboardingChecklist: sanitizeFileMeta(form.onboardingChecklist),
    updatedAt: new Date().toISOString(),
  };
}

export function savePgOnboardingProfile(form) {
  if (typeof window === "undefined") return null;
  const payload = sanitizeForStorage(form);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function loadPgOnboardingProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPgOnboardingProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
