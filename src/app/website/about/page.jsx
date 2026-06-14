import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import AboutSection from "@/components/website/about/about-section";
import HeroSection from "@/components/website/about/hero-section";
import VisionSection from "@/components/website/about/vision-section";
import WhyChooseSection from "@/components/website/about/why-choose-section";
export default function Page() {
  return (
    <MarketingPageShell>
      <HeroSection />
      <AboutSection />
      <VisionSection />
      <WhyChooseSection />
    </MarketingPageShell>
  );
}
