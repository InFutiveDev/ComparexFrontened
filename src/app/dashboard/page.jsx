import { LeadsTable } from "@/components/dashboard/leads-table";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <StatsCards />
      <LeadsTable />
    </div>
  );
}
