import { apiFetch } from "@/lib/api";

const TOKEN_KEY = "comparex_auth_token";
const USER_KEY = "comparex_auth_user";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getStoredToken() {
  if (!canUseStorage()) return null;
  return (
    window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY)
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

export function setAuthSession({ token, user }, remember = true) {
  if (!canUseStorage()) return;

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));

  if (!remember) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } else {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
  }
}

export function clearAuthSession() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
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

export async function fetchCurrentUser(token) {
  return apiFetch("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
