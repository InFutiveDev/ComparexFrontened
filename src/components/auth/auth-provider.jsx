"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  fetchCurrentUser,
  getStoredToken,
  getStoredUser,
  loginAccount,
  refreshAccessToken,
  registerAccount,
  setAuthSession,
} from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function handleSessionCleared() {
      setToken(null);
      setUser(null);
    }

    window.addEventListener("comparex:auth-session-cleared", handleSessionCleared);
    return () => {
      window.removeEventListener("comparex:auth-session-cleared", handleSessionCleared);
    };
  }, []);

  useEffect(() => {
    async function bootstrapSession() {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      setUser(storedUser);

      try {
        const data = await fetchCurrentUser(storedToken);
        setUser(data.user);
      } catch {
        try {
          const refreshedToken = await refreshAccessToken();
          const data = await fetchCurrentUser(refreshedToken);
          setToken(refreshedToken);
          setUser(data.user);
        } catch {
          clearAuthSession();
          setToken(null);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    bootstrapSession();
  }, []);

  const applySession = useCallback((session, remember = true) => {
    setAuthSession(
      {
        token: session.token || session.accessToken,
        refreshToken: session.refreshToken,
        user: session.user,
      },
      remember,
    );
    setToken(session.token || session.accessToken);
    setUser(session.user);
  }, []);

  const login = useCallback(
    async ({ email, password, accountType, remember = true }) => {
      const session = await loginAccount({ email, password, accountType });
      applySession(session, remember);
      return session;
    },
    [applySession],
  );

  const register = useCallback(
    async ({ name, email, password, accountType }) => {
      const session = await registerAccount({ name, email, password, accountType });
      applySession(session, true);
      return session;
    },
    [applySession],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      establishSession: applySession,
    }),
    [user, token, isLoading, login, register, logout, applySession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
