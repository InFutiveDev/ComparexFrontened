import { HomeFeaturesSection } from "@/components/website/home/home-features-section";
import { HomeHeroSection } from "@/components/website/home/home-hero-section";
import { SiteFooter } from "@/components/website/site-footer";
import { SiteHeader } from "@/components/website/site-header";
import { HoneExploreSection } from "@/components/website/home/hone-Explore-section";
import { HomeComparisonTable } from "@/components/website/home/home-comparison-table";
import { HomeWriteAReview } from "@/components/website/home/home-write-a-review";
import { HowItWorksSection } from "@/components/website/home/how-it-works-section";
import { FrequentlyAskedSection } from "@/components/website/home/frequently-asked-section";
import { ContactUs } from "@/components/website/home/contact-us";
import { FadeUp } from "@/components/ui/fade-up";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50" suppressHydrationWarning>
      <SiteHeader />
      <main>
        <HomeHeroSection />
        <FadeUp>
          <HomeFeaturesSection />
        </FadeUp>
        <FadeUp delayMs={60}>
          <HoneExploreSection />
        </FadeUp>
        <FadeUp delayMs={90}>
          <HomeComparisonTable />
        </FadeUp>
        <FadeUp delayMs={110}>
          <HomeWriteAReview />
        </FadeUp>
        <FadeUp delayMs={140}>
          <HowItWorksSection />
        </FadeUp>
        <FadeUp delayMs={160}>
          <FrequentlyAskedSection />
        </FadeUp>
        <FadeUp delayMs={180}>
          <ContactUs />
        </FadeUp>
      </main>
      <SiteFooter />
    </div>
  );
}
