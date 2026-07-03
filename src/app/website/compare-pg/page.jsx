import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/compare-pg/hero";
import ComparePGTable from "@/components/website/compare-pg/compare-pg-table";


export default function Page() {
  return (
    <MarketingPageShell>
      <HeroSection />
      
      <ComparePGTable />
    </MarketingPageShell>
  );
}
