"use client";

import Link from "next/link";
import { useTalkToExpert } from "@/components/website/talk-to-expert/talk-to-expert-provider";

export function SiteFooterLink({ href, label, className }) {
  const { openTalkToExpert } = useTalkToExpert();

  if (href === "/talk-to-expert") {
    return (
      <button type="button" onClick={openTalkToExpert} className={className}>
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
