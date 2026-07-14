"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  bulkUploadLeadsToPg,
  fetchAssignablePaymentGateways,
} from "@/lib/sub-admin";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

export default function SubAdminBulkUploadPage() {
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [paymentGatewayId, setPaymentGatewayId] = useState("");
  const [file, setFile] = useState(null);
  const [pgSearch, setPgSearch] = useState("");
  const [pgLocation, setPgLocation] = useState("");
  const [pgCategory, setPgCategory] = useState("");
  const [minSuccessRate, setMinSuccessRate] = useState("");
  const [minSettlementScore, setMinSettlementScore] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const loadPgs = useCallback(async () => {
    try {
      const data = await fetchAssignablePaymentGateways({
        page: 1,
        limit: 100,
        search: pgSearch || undefined,
        location: pgLocation || undefined,
        category: pgCategory || undefined,
        minSuccessRate: minSuccessRate || undefined,
        minSettlementScore: minSettlementScore || undefined,
      });
      setPaymentGateways(data.paymentGateways || []);
    } catch {
      setPaymentGateways([]);
    }
  }, [pgSearch, pgLocation, pgCategory, minSuccessRate, minSettlementScore]);

  useEffect(() => {
    loadPgs();
  }, [loadPgs]);

  async function handleUpload(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!paymentGatewayId) {
      setError("Select a payment gateway first");
      return;
    }
    if (!file) {
      setError("Choose a CSV file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const data = await bulkUploadLeadsToPg({ paymentGatewayId, file });
      setResult(data);
      setFile(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Bulk upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Bulk Upload Leads
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          FR-SA-04 · Upload a CSV and assign all rows to a selected payment gateway. FR-SA-05 ·
          Filter gateways by location, category, and performance before choosing.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#13203F]">Filter payment gateways</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className={inputClass}
            placeholder="Search PG"
            value={pgSearch}
            onChange={(e) => setPgSearch(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Location"
            value={pgLocation}
            onChange={(e) => setPgLocation(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Category"
            value={pgCategory}
            onChange={(e) => setPgCategory(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Min success rate"
            value={minSuccessRate}
            onChange={(e) => setMinSuccessRate(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Min settlement score"
            value={minSettlementScore}
            onChange={(e) => setMinSettlementScore(e.target.value)}
          />
        </div>
      </div>

      <form
        onSubmit={handleUpload}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Target payment gateway
          </label>
          <select
            className={inputClass}
            value={paymentGatewayId}
            onChange={(e) => setPaymentGatewayId(e.target.value)}
            required
          >
            <option value="">Select PG…</option>
            {paymentGateways.map((pg) => (
              <option key={pg.id} value={pg.id}>
                {pg.companyName}
                {pg.location ? ` · ${pg.location}` : ""}
                {` · success ${pg.performance?.successRate ?? 0}%`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            CSV file
          </label>
          <input
            type="file"
            accept=".csv,text/csv"
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#EEF2FC] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#2D4CC8]"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p className="mt-2 text-xs text-slate-500">
            Headers: <code>businessName,email,phone,industry,priority,location</code>
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isUploading}
          className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ color: "#fff" }}
        >
          {isUploading ? "Uploading…" : "Upload & assign"}
        </button>
      </form>

      {result ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          <p className="font-semibold">{result.message}</p>
          <p className="mt-1">
            Created {result.createdCount ?? 0} lead(s)
            {result.errorCount ? ` · ${result.errorCount} row error(s)` : ""}
            {result.paymentGateway?.companyName
              ? ` · assigned to ${result.paymentGateway.companyName}`
              : ""}
          </p>
          {Array.isArray(result.errors) && result.errors.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-red-700">
              {result.errors.slice(0, 10).map((item, index) => (
                <li key={`${item.row}-${index}`}>
                  Row {item.row}: {item.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
