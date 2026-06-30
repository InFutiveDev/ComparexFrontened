import { LeadsTable } from "@/components/dashboard/leads/leads-table";
import { StatsCards } from "@/components/dashboard/overview/stats-cards";

export function OverviewSection() {
  return (
    <div className="space-y-5">
      <StatsCards />
      <LeadsTable />
    </div>
  );
}
