"use client";

import { useState } from "react";
import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/talk-to-expert/hero";
import TalkToExpertSection from "@/components/website/talk-to-expert/talk-to-expert-section";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <MarketingPageShell>
      <HeroSection onTalkToExpert={() => setModalOpen(true)} />
      <TalkToExpertSection isOpen={modalOpen} onOpenChange={setModalOpen} />
    </MarketingPageShell>
  );
}
