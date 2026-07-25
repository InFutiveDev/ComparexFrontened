import { apiFetch, ApiError } from "@/lib/api";

const TOKEN_KEY = "comparex_auth_token";
const REFRESH_TOKEN_KEY = "comparex_auth_refresh_token";
const USER_KEY = "comparex_auth_user";

let refreshPromise = null;

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getStoredToken() {
  if (!canUseStorage()) return null;
  return (
    window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY)
  );
}

export function getStoredRefreshToken() {
  if (!canUseStorage()) return null;
  return (
    window.localStorage.getItem(REFRESH_TOKEN_KEY) ||
    window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
}

export function getStoredUser() {
  if (!canUseStorage()) return null;

  const raw =
    window.localStorage.getItem(USER_KEY) || window.sessionStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isRememberedSession() {
  if (!canUseStorage()) return true;
  return Boolean(window.localStorage.getItem(TOKEN_KEY));
}

export function setAuthSession({ token, refreshToken, user }, remember = true) {
  if (!canUseStorage()) return;

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));

  if (refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (!remember) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } else {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function updateStoredAccessToken({ token, refreshToken, user }, remember = isRememberedSession()) {
  setAuthSession({ token, refreshToken, user: user ?? getStoredUser() }, remember);
}

export function clearAuthSession() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);

  window.dispatchEvent(new CustomEvent("comparex:auth-session-cleared"));
}

export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      throw new ApiError("Authentication required", 401);
    }

    const data = await apiFetch("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    const accessToken = data.token || data.accessToken;
    if (!accessToken) {
      throw new ApiError("Failed to refresh session", 500);
    }

    updateStoredAccessToken({
      token: accessToken,
      refreshToken: data.refreshToken,
      user: getStoredUser(),
    });

    return accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function registerAccount({ name, email, password, accountType }) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, accountType }),
  });
}

export async function loginAccount({ email, password, accountType }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, accountType }),
  });
}

export async function fetchCurrentUser(token = getStoredToken()) {
  if (!token) {
    throw new ApiError("Authentication required", 401);
  }

  return apiFetch("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
