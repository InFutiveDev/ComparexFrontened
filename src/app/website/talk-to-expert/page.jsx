"use client";

import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/talk-to-expert/hero";
import { useTalkToExpert } from "@/components/website/talk-to-expert/talk-to-expert-provider";

function TalkToExpertPageContent() {
  const { openTalkToExpert } = useTalkToExpert();
  return <HeroSection onTalkToExpert={openTalkToExpert} />;
}

export default function Page() {
  return (
    <MarketingPageShell>
      <TalkToExpertPageContent />
    </MarketingPageShell>
  );
}
