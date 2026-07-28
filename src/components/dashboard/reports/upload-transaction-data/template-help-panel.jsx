"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

const TEMPLATE_COLUMNS = [
  { name: "Transaction ID", required: true, example: "TXN-00123" },
  { name: "Transaction Date", required: true, example: "22-07-2025 (DD-MM-YYYY)" },
  { name: "PG Name", required: true, example: "Razorpay" },
  { name: "MID", required: true, example: "MID-12345" },
  { name: "Transaction Amount", required: true, example: "100000" },
  { name: "Payment Mode", required: true, example: "UPI" },
  { name: "Merchant Name", required: false, example: "TechStore" },
  { name: "PG Revenue", required: true, example: "0.10%(60%)" },
  { name: "Reseller Revenue", required: true, example: "0.04%(40%)" },
];

export function TemplateHelpPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-[#13203F]">Template requirements</h3>
          <p className="mt-1 text-xs text-slate-600">
            Use the CompareX standard template for multi-PG uploads. Raw PG exports may require
            PG confirmation after upload.
          </p>
        </div>
        <HiChevronDown
          className={`size-5 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-slate-100 px-5 pb-5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4">Column</th>
                  <th className="py-2 pr-4">Required</th>
                  <th className="py-2">Example</th>
                </tr>
              </thead>
              <tbody>
                {TEMPLATE_COLUMNS.map((column) => (
                  <tr key={column.name} className="border-t border-slate-100">
                    <td className="py-2 pr-4 font-medium text-[#13203F]">{column.name}</td>
                    <td className="py-2 pr-4 text-slate-600">{column.required ? "Yes" : "Optional"}</td>
                    <td className="py-2 text-slate-600">{column.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
