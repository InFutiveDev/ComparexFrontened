import { LeadsTable } from "@/components/dashboard/leads-table";

export default function LeadsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Leads</h2>
      <p className="text-sm text-slate-600">Manage and track incoming opportunities in one place.</p>
      <LeadsTable />
    </div>
  );
}
