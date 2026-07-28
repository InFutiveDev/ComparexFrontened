"use client";

const variantStyles = {
  error: {
    section: "border-red-200 bg-red-50/40",
    title: "text-red-900",
    header: "bg-red-50 text-red-800",
  },
  info: {
    section: "border-amber-200 bg-amber-50/40",
    title: "text-amber-900",
    header: "bg-amber-50 text-amber-900",
  },
};

export function SkippedRowsTable({
  title,
  rows = [],
  totalCount = 0,
  variant = "error",
}) {
  if (!totalCount) return null;

  const styles = variantStyles[variant] || variantStyles.error;
  const preview = rows.slice(0, 20);

  return (
    <section className={`rounded-2xl border p-5 ${styles.section}`}>
      <h3 className={`text-sm font-semibold ${styles.title}`}>{title}</h3>
      {totalCount > 20 ? (
        <p className="mt-2 text-xs text-slate-600">
          Showing first 20 of {totalCount} — download the full log below.
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className={`text-xs uppercase tracking-wide ${styles.header}`}>
            <tr>
              <th className="px-4 py-3">Row #</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            {preview.map((row, index) => (
              <tr key={`${row.rowNumber}-${index}`} className="border-t border-slate-100">
                <td className="px-4 py-3 text-[#13203F]">{row.rowNumber ?? "—"}</td>
                <td className="px-4 py-3 text-[#13203F]">{row.txnId || "—"}</td>
                <td className="px-4 py-3 text-slate-700">{row.reason || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
