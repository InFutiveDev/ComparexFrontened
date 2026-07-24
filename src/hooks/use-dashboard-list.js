"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";

export function useDashboardList(fetcher, mapper, { refreshToken = 0 } = {}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const pageSize = 100;
      let page = 1;
      let allRows = [];
      let totalCount = 0;

      while (true) {
        const response = await fetcher({ page, limit: pageSize });
        const items = mapper(response);
        allRows = allRows.concat(items.rows);
        totalCount = items.total ?? allRows.length;

        if (allRows.length >= totalCount || items.rows.length < pageSize) {
          break;
        }

        page += 1;
      }

      setData(allRows);
      setTotal(totalCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load data");
      setData([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, mapper]);

  useEffect(() => {
    reload();
  }, [reload, refreshToken]);

  return { data, total, isLoading, error, reload };
}

export function DashboardListState({ isLoading, error, onRetry, emptyMessage, children }) {
  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white px-5 py-14 text-center">
        <p className="text-sm font-semibold text-[#13203F]">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden rounded-lg border border-red-200 bg-red-50 px-5 py-10 text-center">
        <p className="text-sm font-semibold text-red-700">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2D4CC8] ring-1 ring-[#2D4CC8]/20"
        >
          Try again
        </button>
      </section>
    );
  }

  if (!children) {
    return (
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white px-5 py-14 text-center">
        <p className="text-sm font-semibold text-[#13203F]">{emptyMessage}</p>
      </section>
    );
  }

  return children;
}
