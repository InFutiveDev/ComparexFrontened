import Link from "next/link";
import { HiArrowUpTray, HiChartBarSquare } from "react-icons/hi2";
import { ProcessedTransactionsTable } from "@/components/dashboard/reports/processed-transactions-table";

const reportCards = [
  {
    title: "CompareX Revenue Report",
    description: "View CompareX markup revenue across payment gateways and merchants.",
    href: "/dashboard/reports/comparex-revenue",
  },
  {
    title: "Reseller Commission Report",
    description: "Track reseller commission accruals and payout eligibility.",
    href: "/dashboard/reports/reseller-commissions",
  },
  {
    title: "Pending Payouts",
    description: "Review outstanding reseller payouts awaiting approval.",
    href: "/dashboard/reports/pending-payouts",
  },
];

export function ReportsSection({
  uploadHref = "/dashboard/reports/upload-transaction-data",
  reportsBasePath = "/dashboard/reports",
}) {
  const cards = reportCards.map((card) => ({
    ...card,
    href: card.href.replace("/dashboard/reports", reportsBasePath),
  }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">Reports</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Revenue and commission reporting powered by uploaded PG transaction data. Upload files to
          map MIDs, calculate CompareX revenue, and update reseller commissions.
        </p>
      </div>

      <div className="rounded-2xl border border-[#2D4CC8]/20 bg-gradient-to-br from-[#EEF2FC] to-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2D4CC8] ring-1 ring-[#2D4CC8]/15">
              <HiArrowUpTray className="size-4" aria-hidden />
              Transaction upload
            </div>
            <h3 className="mt-3 text-lg font-bold text-[#13203F]">Upload Transaction Data</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Upload a CSV or XLS transaction report. The system validates rows, maps PG and MID
              data, calculates revenue and commissions, and updates reseller dashboards.
            </p>
          </div>
          <Link
            href={uploadHref}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243da8]"
          >
            Upload Transaction Data
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((report) => (
          <Link
            key={report.title}
            href={report.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#2D4CC8]/30 hover:shadow-md"
          >
            <HiChartBarSquare className="size-6 text-[#2D4CC8]" aria-hidden />
            <h3 className="mt-3 text-sm font-semibold text-[#13203F]">{report.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{report.description}</p>
            <span className="mt-3 inline-flex rounded-full bg-[#EEF2FC] px-2.5 py-1 text-xs font-medium text-[#2D4CC8]">
              View detailed report
            </span>
          </Link>
        ))}
      </div>

      <ProcessedTransactionsTable title="Successful Transactions" />
    </div>
  );
}
