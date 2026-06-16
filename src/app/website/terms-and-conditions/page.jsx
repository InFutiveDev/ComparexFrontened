import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/terms-and-conditions/hero";
import TermsSection from "@/components/website/terms-and-conditions/terms-section";




export default function Page() {
  return (
    <MarketingPageShell>
      <HeroSection />
      <TermsSection />
    </MarketingPageShell>
  );
}