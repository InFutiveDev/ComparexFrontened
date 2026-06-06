import { dashboardStats } from "@/lib/mock-data";

export function StatsCards() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => (
        <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
          <p className="mt-2 text-sm font-medium text-emerald-600">{stat.trend}</p>
        </article>
      ))}
    </section>
  );
}
