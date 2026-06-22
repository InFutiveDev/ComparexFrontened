import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/reviews/hero";
import ReviewsSection from "@/components/website/reviews/reviews-section";


export default function Page() {
  return (
    <MarketingPageShell>
      
        <HeroSection />
        <ReviewsSection />
    </MarketingPageShell>
  );
}