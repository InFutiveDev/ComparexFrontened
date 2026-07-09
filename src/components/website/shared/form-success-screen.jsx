"use client";

import { HiCheck } from "react-icons/hi2";

function SuccessIllustration() {
  return (
    <div className="relative mx-auto flex h-28 w-28 items-center justify-center" aria-hidden>
      <span className="absolute left-0 top-3 size-10 rotate-12 rounded-2xl bg-[#25a36f]/20" />
      <span className="absolute right-0 top-5 size-8 -rotate-6 rounded-xl bg-[#25a36f]/15" />
      <span className="absolute bottom-2 left-3 size-7 rotate-6 rounded-lg bg-[#25a36f]/25" />
      <span className="absolute bottom-4 right-2 size-9 -rotate-12 rounded-2xl bg-[#25a36f]/18" />
      <div className="relative flex size-16 items-center justify-center rounded-full bg-[#25a36f] text-white shadow-lg shadow-[#25a36f]/30">
        <HiCheck className="size-8" />
      </div>
    </div>
  );
}

export function FormSuccessScreen({ children }) {
  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
      <div className="h-1 bg-gradient-to-r from-[#25a36f] via-[#40C3CF] to-[#25a36f]" aria-hidden />

      <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
        <SuccessIllustration />
        {children}
      </div>
    </div>
  );
}
