import Link from "next/link";

const cards = [
  {
    href: "/sub-admin-dashboard/leads",
    title: "Lead Qualification",
    description: "Review incoming merchant leads, update status, and view activity history.",
  },
  {
    href: "/sub-admin-dashboard/assign",
    title: "Lead Assignment",
    description: "Assign qualified leads to payment gateways or book Talk to Expert.",
  },
  {
    href: "/sub-admin-dashboard/bulk-upload",
    title: "Bulk Upload",
    description: "Upload a CSV of leads and assign them to a specific payment gateway.",
  },
];

export default function SubAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D4CC8]">
          Module 2 · Sub Admin Panel
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#13203F]">
          Day-to-day lead operations & PG routing
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Qualify merchant leads, assign them to the right payment gateways, and book expert calls.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#2D4CC8]/30 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-[#13203F]">{card.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-[#2D4CC8]">Open →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
