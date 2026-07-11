"use client";

import { TalkToExpertTable } from "@/components/dashboard/talk-to-expert/talk-to-expert-table";

export function TalkToExpertSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Talk to Expert
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Review scheduled expert calls submitted from the website Talk to Expert form.
        </p>
      </div>
      <TalkToExpertTable />
    </div>
  );
}
