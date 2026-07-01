"use client";

import { createContext, useContext, useMemo, useState } from "react";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [merchantSearch, setMerchantSearch] = useState("");
  const [leadSearch, setLeadSearch] = useState("");

  const value = useMemo(
    () => ({ merchantSearch, setMerchantSearch, leadSearch, setLeadSearch }),
    [merchantSearch, leadSearch]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
