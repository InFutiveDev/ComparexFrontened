import { leads } from "@/lib/mock-data";

function statusClass(status) {
  if (status === "Won") return "bg-emerald-100 text-emerald-700";
  if (status === "Proposal") return "bg-blue-100 text-blue-700";
  if (status === "Qualified") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export function LeadsTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold sm:text-lg">Recent Leads</h2>
        <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-2 py-3 font-medium">Lead</th>
              <th className="px-2 py-3 font-medium">Company</th>
              <th className="px-2 py-3 font-medium">Status</th>
              <th className="px-2 py-3 font-medium">Source</th>
              <th className="px-2 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-2 py-3">
                  <p className="font-medium text-slate-900">{lead.name}</p>
                  <p className="text-xs text-slate-500">{lead.email}</p>
                </td>
                <td className="px-2 py-3 text-slate-700">{lead.company}</td>
                <td className="px-2 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(lead.status)}`}>{lead.status}</span>
                </td>
                <td className="px-2 py-3 text-slate-700">{lead.source}</td>
                <td className="px-2 py-3 font-semibold text-slate-800">{lead.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
