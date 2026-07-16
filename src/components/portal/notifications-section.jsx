"use client";

import { useCallback, useEffect, useState } from "react";
import { HiBell, HiArrowPath } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { fetchMyNotifications } from "@/lib/notifications";

const notificationsEnabled =
  process.env.NEXT_PUBLIC_NOTIFICATIONS_ENABLED === "true";

export function NotificationsSection() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!notificationsEnabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyNotifications({ page: 1, limit: 50 });
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!notificationsEnabled) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center">
        <h2 className="text-xl font-bold text-[#13203F]">Notifications disabled</h2>
        <p className="mt-2 text-sm text-slate-500">
          In-app notifications are currently unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Lead assignments and payment-gateway status updates.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
        >
          <HiArrowPath className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="space-y-3">
        {!isLoading && notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map((item) => (
            <article
              key={item.id}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
                <HiBell className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-bold text-[#13203F]">{item.title}</h3>
                  <span className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.createdAt))}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.message}</p>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
