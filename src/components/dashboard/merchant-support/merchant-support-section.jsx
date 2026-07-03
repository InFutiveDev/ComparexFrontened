"use client";

import { useCallback, useEffect, useState } from "react";
import { MerchantSupportTable } from "@/components/dashboard/merchant-support/merchant-support-table";
import { StatsCards, buildStats } from "@/components/dashboard/merchant-support/stats-cards";

export function MerchantSupportSection() {
  const [stats, setStats] = useState(buildStats([]));
  const [refreshToken, setRefreshToken] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const response = await fetch("/api/merchant-support", { cache: "no-store" });
      const data = await response.json();

      if (response.ok) {
        setStats(buildStats(data.submissions ?? []));
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats, refreshToken]);

  function handleRefresh() {
    setRefreshToken((current) => current + 1);
    loadStats();
  }

  return (
    <div className="space-y-4">
      <StatsCards stats={stats} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      <MerchantSupportTable variant="full" refreshToken={refreshToken} />
    </div>
  );
}
