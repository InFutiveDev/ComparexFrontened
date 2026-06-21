import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import ToolsHeroSection from "@/components/website/tools/hero";
import Calculator from "@/components/website/tools/calculator";

export default function ToolsPage() {
  return (
    <MarketingPageShell>
      <ToolsHeroSection />
      <section className="bg-[#f2f6fb] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Calculator />
      </section>
    </MarketingPageShell>
  );
}
