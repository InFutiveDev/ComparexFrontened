"use client";

export function formatInr(value) {
  if (value == null || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatReportDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return String(value);
}

export function ReportSummaryCards({ items = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-xl border p-4 shadow-sm ${item.tone || "border-slate-200 bg-white text-[#13203F]"}`}
        >
          <p className="text-xs font-medium uppercase tracking-wide opacity-80">{item.label}</p>
          <p className="mt-1 text-2xl font-bold">{item.value}</p>
          {item.hint ? <p className="mt-1 text-xs opacity-70">{item.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function ReportFilters({
  search,
  onSearchChange,
  pgName,
  onPgNameChange,
  from,
  onFromChange,
  to,
  onToChange,
  mid,
  onMidChange,
  showMid = false,
}) {
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <input
        className={inputClass}
        placeholder="Search txn, merchant, PG…"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <input
        className={inputClass}
        placeholder="PG name"
        value={pgName}
        onChange={(event) => onPgNameChange(event.target.value)}
      />
      {showMid ? (
        <input
          className={inputClass}
          placeholder="Reseller MID"
          value={mid}
          onChange={(event) => onMidChange(event.target.value)}
        />
      ) : null}
      <input
        type="date"
        className={inputClass}
        value={from}
        onChange={(event) => onFromChange(event.target.value)}
      />
      <input
        type="date"
        className={inputClass}
        value={to}
        onChange={(event) => onToChange(event.target.value)}
      />
    </div>
  );
}

export function ReportPagination({ page, totalPages, onPageChange, isLoading }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm">
      <p className="text-slate-600">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || isLoading}
          className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages || isLoading}
          className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
