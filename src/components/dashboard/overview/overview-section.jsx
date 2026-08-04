import { LeadsTrendSection } from "@/components/dashboard/overview/leads-trend-section";
import { OverviewBarChart } from "@/components/dashboard/overview/overview-bar-chart";
import { StatsCards } from "@/components/dashboard/overview/stats-cards";

export function OverviewSection() {
  return (
    <div className="space-y-5">
      <StatsCards />
      <OverviewBarChart />
      <LeadsTrendSection />
    </div>
  );
}
