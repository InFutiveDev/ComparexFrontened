import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import CompareSideHero from "@/components/website/compare-side/hero";
import CompareSideBySide from "@/components/website/compare-side/compare-side-by-side";

export default function Page() {
  return (
    <MarketingPageShell>
      <CompareSideHero />
      <CompareSideBySide />
    </MarketingPageShell>
  );
}
