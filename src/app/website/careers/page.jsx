import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/careers/hero";
import CareersSection from "@/components/website/careers/careers-section";

export default function Page() {
  return (
    <MarketingPageShell>
      <HeroSection />
      <CareersSection />
    </MarketingPageShell>
  );
}
