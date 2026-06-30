"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  fetchCurrentUser,
  getStoredToken,
  getStoredUser,
  loginAccount,
  registerAccount,
  setAuthSession,
} from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    setUser(storedUser);

    fetchCurrentUser(storedToken)
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        clearAuthSession();
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const applySession = useCallback((session, remember = true) => {
    setAuthSession(session, remember);
    setToken(session.token);
    setUser(session.user);
  }, []);

  const login = useCallback(
    async ({ email, password, remember = true }) => {
      const session = await loginAccount({ email, password });
      applySession(session, remember);
      return session;
    },
    [applySession],
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      const session = await registerAccount({ name, email, password });
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
    }),
    [user, token, isLoading, login, register, logout],
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
