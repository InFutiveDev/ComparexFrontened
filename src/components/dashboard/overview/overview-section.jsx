import { OverviewBarChart } from "@/components/dashboard/overview/overview-bar-chart";
import { OverviewEntitiesTable } from "@/components/dashboard/overview/overview-entities-table";
import { StatsCards } from "@/components/dashboard/overview/stats-cards";

export function OverviewSection() {
  return (
    <div className="space-y-5">
      <StatsCards />
      <OverviewBarChart />
      <OverviewEntitiesTable />
    </div>
  );
}
