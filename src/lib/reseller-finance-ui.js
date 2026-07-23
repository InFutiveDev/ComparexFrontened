export function formatInr(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function formatShortDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

export { inputClass };

export function StatusBadge({ label, tone = "slate" }) {
  const styles = {
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[tone] || styles.slate}`}
    >
      {label}
    </span>
  );
}

export function commissionStatusTone(status) {
  switch (status) {
    case "approved":
      return "blue";
    case "paid":
      return "emerald";
    default:
      return "amber";
  }
}

export function invoiceStatusTone(status) {
  switch (status) {
    case "paid":
      return "emerald";
    case "approved":
      return "blue";
    case "rejected":
      return "red";
    case "under_review":
      return "violet";
    default:
      return "amber";
  }
}

export function kycStatusTone(status) {
  switch (status) {
    case "verified":
      return "emerald";
    case "rejected":
      return "red";
    case "pending":
      return "amber";
    default:
      return "slate";
  }
}
