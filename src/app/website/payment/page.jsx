import { FrequentlyAskedSection } from "@/components/website/payment/frequently-asked-section";
import { ContactUsSection } from "@/components/website/payment/contact-us-section";
import { PaymentHomeHeroSection } from "@/components/website/payment/home-hero-section";
import { PaymentHowItWorksSection } from "@/components/website/payment/HowItWorksSection";
import { WhyPaymentProvidersSection } from "@/components/website/payment/why-payment-providers-section";
import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import { FadeUp } from "@/components/ui/fade-up";

export default function Page() {
  return (
    <MarketingPageShell>
      <PaymentHomeHeroSection />
      <FadeUp>
        <PaymentHowItWorksSection />
      </FadeUp>
      <FadeUp>
        <WhyPaymentProvidersSection />
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
