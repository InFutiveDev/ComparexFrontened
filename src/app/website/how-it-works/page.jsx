
import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/how-it-works/hero-section";
import HowItWorks from "@/components/website/how-it-works/how-it-works";


export default function Page() {
  return (
    <MarketingPageShell>
      <HeroSection />
      <HowItWorks />
    </MarketingPageShell>
  );
}
