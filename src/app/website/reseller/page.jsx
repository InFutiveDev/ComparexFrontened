import { FrequentlyAskedSection } from "@/components/website/reseller/frequently-asked-section";
import { ContactUsSection } from "@/components/website/reseller/contact-us-section";
import { ResellerHomeHeroSection } from "@/components/website/reseller/home-hero-section";
import { ResellerHowItWorksSection } from "@/components/website/reseller/HowItWorksSection";
import { WhyResellersSection } from "@/components/website/reseller/why-resellers-section";
import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import { FadeUp } from "@/components/ui/fade-up";

export default function Page() {
  return (
    <MarketingPageShell>
      <ResellerHomeHeroSection />
      <FadeUp>
        <ResellerHowItWorksSection />
      </FadeUp>
      <FadeUp>
        <WhyResellersSection />
      </FadeUp>
      <FadeUp delayMs={90}>
        <FrequentlyAskedSection />
      </FadeUp>
      <FadeUp delayMs={120}>
        <ContactUsSection />
      </FadeUp>
    </MarketingPageShell>
  );
}
