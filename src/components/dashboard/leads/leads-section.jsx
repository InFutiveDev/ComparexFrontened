import { LeadsTable } from "@/components/dashboard/leads/leads-table";

export function LeadsSection() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-[#13203F]">Leads</h2>
        <p className="mt-1 text-sm text-slate-600">Manage and track incoming opportunities in one place.</p>
      </div>
      <LeadsTable />
    </div>
  );
}
