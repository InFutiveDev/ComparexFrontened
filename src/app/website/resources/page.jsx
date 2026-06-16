import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/resources/hero";
import ResourcesSection from "@/components/website/resources/resources-section";


export default function Page() {
  return (
    <MarketingPageShell>
      <HeroSection />
      <ResourcesSection />
    </MarketingPageShell>
  );
}