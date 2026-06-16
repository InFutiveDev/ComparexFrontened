import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/privacy-policy/hero";
import PrivacySection from "@/components/website/privacy-policy/privacy-section";



export default function Page() {
  return (
    <MarketingPageShell>
      <HeroSection />
      <PrivacySection />
    </MarketingPageShell>
  );
}