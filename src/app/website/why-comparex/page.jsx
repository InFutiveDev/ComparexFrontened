import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/why-comparex/hero";
import WhyCompareXSection from "@/components/website/why-comparex/why-comoarex";

export default function Page() {
  return (
    <MarketingPageShell>
      <HeroSection />
      <WhyCompareXSection />
    </MarketingPageShell>
  );
}
