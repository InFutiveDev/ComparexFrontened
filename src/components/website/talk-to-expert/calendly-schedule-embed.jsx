"use client";

import { useMemo } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";

const DEFAULT_CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

export function getCalendlyUrl() {
  return (DEFAULT_CALENDLY_URL || "").trim();
}

export function CalendlyScheduleEmbed({
  url,
  prefill,
  onEventScheduled,
}) {
  const calendlyUrl = url || getCalendlyUrl();

  const pageSettings = useMemo(
    () => ({
      backgroundColor: "ffffff",
      hideEventTypeDetails: false,
      hideLandingPageDetails: false,
      primaryColor: "2D4CC8",
      textColor: "13203F",
    }),
    [],
  );

  useCalendlyEventListener({
    onEventScheduled: (event) => {
      onEventScheduled?.(event?.data?.payload || {});
    },
  });

  if (!calendlyUrl) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-sm text-amber-800">
        Calendly is not configured. Add{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-xs">NEXT_PUBLIC_CALENDLY_URL</code>{" "}
        to your env (for example{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-xs">
          https://calendly.com/your-link/30min
        </code>
        ).
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <InlineWidget
        url={calendlyUrl}
        prefill={prefill}
        styles={{ height: "560px", minWidth: "320px" }}
        pageSettings={pageSettings}
      />
    </div>
  );
}
