"use client";

import { useCallback, useEffect, useState } from "react";
import { MerchantSupportTable } from "@/components/dashboard/merchant-support/merchant-support-table";
import { StatsCards, buildStats } from "@/components/dashboard/merchant-support/stats-cards";
import { ApiError } from "@/lib/api";
import { fetchMerchantSupport } from "@/lib/dashboard-api";
import { mapMerchantSupportListResponse } from "@/lib/dashboard-mappers";

export function MerchantSupportSection() {
  const [stats, setStats] = useState(buildStats([]));
  const [refreshToken, setRefreshToken] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const response = await fetchMerchantSupport({ page: 1, limit: 50 });
      const { rows } = mapMerchantSupportListResponse(response);
      setStats(buildStats(rows));
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) {
        setStats(buildStats([]));
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
