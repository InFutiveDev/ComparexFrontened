import { FrequentlyAskedSection } from "@/components/website/merchant/frequently-asked-section";
import { ContactUsSection } from "@/components/website/merchant/contact-us-section";
import { MerchantHomeHeroSection } from "@/components/website/merchant/home-hero-section";
import { MerchantHowItWorksSection } from "@/components/website/merchant/HowItWorksSection";
import { WhyBusinessesSection } from "@/components/website/merchant/why-businesses-section";
import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import { FadeUp } from "@/components/ui/fade-up";

export default function Page() {
  return (
    <MarketingPageShell>
      <MerchantHomeHeroSection />
      <FadeUp>
        <MerchantHowItWorksSection />
      </FadeUp>
      <FadeUp>
        <WhyBusinessesSection />
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
