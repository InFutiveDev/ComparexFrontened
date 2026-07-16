"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  fetchAdminMdrAudit,
  fetchAdminMdrSettings,
  fetchPaymentGateways,
  updateAdminGlobalMdr,
  updateAdminMdrTiers,
} from "@/lib/dashboard-api";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

const TABS = [
  { id: "global", label: "Global MDR", fr: "FR-MA-07" },
  { id: "tiers", label: "Per-PG Tiers", fr: "FR-MA-08" },
  { id: "audit", label: "Change Log", fr: "FR-MA-09" },
];

function formatUpdatedMeta(updatedAt, updatedBy) {
  if (!updatedAt) return "Not saved yet — defaults applied";
  const when = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(updatedAt));
  const who = updatedBy?.name || updatedBy?.email || "Admin";
  return `Last updated ${when} by ${who}`;
}

function formatLogTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function newTierRow() {
  return {
    id: `tier_${Date.now()}`,
    paymentProviderId: "",
    paymentProviderName: "",
    basis: "volume",
    category: "ecommerce-d2c",
    volumeMin: 0,
    volumeMax: "",
    paymentMode: "upi",
    type: "percent",
    value: 0,
    active: true,
  };
}

export function MdrManagementSection() {
  const [tab, setTab] = useState("global");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [updatedBy, setUpdatedBy] = useState(null);

  const [currency, setCurrency] = useState("INR");
  const [globalRates, setGlobalRates] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [options, setOptions] = useState({
    paymentModes: [],
    categories: [],
    rateTypes: ["percent", "flat"],
    tierBases: ["volume", "category"],
  });
  const [paymentGateways, setPaymentGateways] = useState([]);

  const [auditLogs, setAuditLogs] = useState([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditLoading, setAuditLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [data, pgData] = await Promise.all([
        fetchAdminMdrSettings(),
        fetchPaymentGateways({ page: 1, limit: 100 }),
      ]);
      const mdr = data.mdr || {};
      setCurrency(mdr.currency || "INR");
      setGlobalRates(mdr.globalRates || []);
      setTiers(
        (mdr.tiers || []).map((tier) => ({
          ...tier,
          volumeMax: tier.volumeMax == null ? "" : tier.volumeMax,
        })),
      );
      setOptions(data.options || options);
      setUpdatedAt(data.updatedAt || null);
      setUpdatedBy(data.updatedBy || null);
      setPaymentGateways(pgData.paymentGateways || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load MDR settings");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAudit = useCallback(async () => {
    setAuditLoading(true);
    try {
      const data = await fetchAdminMdrAudit({ page: 1, limit: 50 });
      setAuditLogs(data.logs || []);
      setAuditTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load MDR change log");
    } finally {
      setAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (tab === "audit") loadAudit();
  }, [tab, loadAudit]);

  function updateGlobalRate(index, key, value) {
    setGlobalRates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  }

  function updateTier(index, key, value) {
    setTiers((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, [key]: value };
        if (key === "paymentProviderId") {
          const pg = paymentGateways.find((p) => p.id === value);
          next.paymentProviderName = pg?.companyName || "";
        }
        return next;
      }),
    );
  }

  async function handleSaveGlobal() {
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await updateAdminGlobalMdr({
        currency,
        globalRates: globalRates.map((item) => ({
          ...item,
          value: Number(item.value),
        })),
      });
      setGlobalRates(response.mdr?.globalRates || []);
      setCurrency(response.mdr?.currency || currency);
      setUpdatedAt(response.updatedAt);
      setUpdatedBy(response.updatedBy);
      setMessage(response.message || "Global MDR saved");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save global MDR");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveTiers() {
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await updateAdminMdrTiers({
        tiers: tiers.map((item) => ({
          ...item,
          value: Number(item.value),
          volumeMin: Number(item.volumeMin || 0),
          volumeMax:
            item.volumeMax === "" || item.volumeMax == null
              ? null
              : Number(item.volumeMax),
        })),
      });
      setTiers(
        (response.mdr?.tiers || []).map((tier) => ({
          ...tier,
          volumeMax: tier.volumeMax == null ? "" : tier.volumeMax,
        })),
      );
      setUpdatedAt(response.updatedAt);
      setUpdatedBy(response.updatedBy);
      setMessage(response.message || "Per-PG MDR tiers saved");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save MDR tiers");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 shadow-sm">
        Loading MDR settings…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          MDR Management
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Configure Merchant Discount Rates (MDR) globally and per payment gateway. Every change
          is logged with the responsible admin and timestamp.
        </p>
        <p className="mt-2 text-xs text-slate-500">{formatUpdatedMeta(updatedAt, updatedBy)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setMessage("");
              setError("");
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === item.id
                ? "bg-[#2D4CC8] text-white shadow-md shadow-[#2D4CC8]/25"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/30"
            }`}
            style={tab === item.id ? { color: "#fff" } : undefined}
          >
            {item.label}
            <span className="ml-2 text-[10px] font-bold uppercase tracking-wide opacity-80">
              {item.fr}
            </span>
          </button>
        ))}
      </div>

      {(error || message) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      {tab === "global" ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#13203F]">Global MDR rates</h3>
            <p className="mt-1 text-sm text-slate-600">
              Baseline Merchant Discount Rates applied across all payment gateways.
            </p>
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Currency</label>
            <input
              className={inputClass}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {globalRates.map((rate, index) => (
              <div
                key={rate.id || rate.paymentMode}
                className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-5"
              >
                <div>
                  <label className={labelClass}>Payment mode</label>
                  <p className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-[#13203F]">
                    {rate.label || rate.paymentMode}
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select
                    className={inputClass}
                    value={rate.type}
                    onChange={(e) => updateGlobalRate(index, "type", e.target.value)}
                  >
                    {(options.rateTypes || ["percent", "flat"]).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Value {rate.type === "percent" ? "(%)" : `(${currency})`}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    value={rate.value}
                    onChange={(e) => updateGlobalRate(index, "value", e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 text-sm text-[#13203F]">
                    <input
                      type="checkbox"
                      checked={Boolean(rate.active)}
                      onChange={(e) => updateGlobalRate(index, "active", e.target.checked)}
                    />
                    Active
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveGlobal}
            className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSaving ? "Saving…" : "Save global MDR"}
          </button>
        </section>
      ) : null}

      {tab === "tiers" ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#13203F]">Tiered MDR per payment gateway</h3>
            <p className="mt-1 text-sm text-slate-600">
              Configure MDR by transaction volume band or merchant category for a specific PG.
            </p>
          </div>

          {tiers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No tiered MDR rules yet. Add a tier to override global rates for a PG.
            </p>
          ) : null}

          <div className="space-y-4">
            {tiers.map((tier, index) => (
              <div
                key={tier.id}
                className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className={labelClass}>Payment gateway *</label>
                    <select
                      className={inputClass}
                      value={tier.paymentProviderId}
                      onChange={(e) => updateTier(index, "paymentProviderId", e.target.value)}
                    >
                      <option value="">Choose PG…</option>
                      {paymentGateways.map((pg) => (
                        <option key={pg.id} value={pg.id}>
                          {pg.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Basis *</label>
                    <select
                      className={inputClass}
                      value={tier.basis}
                      onChange={(e) => updateTier(index, "basis", e.target.value)}
                    >
                      <option value="volume">Transaction volume</option>
                      <option value="category">Category</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Payment mode</label>
                    <select
                      className={inputClass}
                      value={tier.paymentMode}
                      onChange={(e) => updateTier(index, "paymentMode", e.target.value)}
                    >
                      {(options.paymentModes || []).map((mode) => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {tier.basis === "category" ? (
                  <div className="max-w-sm">
                    <label className={labelClass}>Category</label>
                    <select
                      className={inputClass}
                      value={tier.category || ""}
                      onChange={(e) => updateTier(index, "category", e.target.value)}
                    >
                      {(options.categories || []).map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Volume min ({currency})</label>
                      <input
                        type="number"
                        min="0"
                        className={inputClass}
                        value={tier.volumeMin}
                        onChange={(e) => updateTier(index, "volumeMin", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Volume max ({currency}, blank = open)</label>
                      <input
                        type="number"
                        min="0"
                        className={inputClass}
                        value={tier.volumeMax}
                        onChange={(e) => updateTier(index, "volumeMax", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Type</label>
                    <select
                      className={inputClass}
                      value={tier.type}
                      onChange={(e) => updateTier(index, "type", e.target.value)}
                    >
                      {(options.rateTypes || ["percent", "flat"]).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>
                      MDR value {tier.type === "percent" ? "(%)" : `(${currency})`}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={inputClass}
                      value={tier.value}
                      onChange={(e) => updateTier(index, "value", e.target.value)}
                    />
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-[#13203F]">
                      <input
                        type="checkbox"
                        checked={Boolean(tier.active)}
                        onChange={(e) => updateTier(index, "active", e.target.checked)}
                      />
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() => setTiers((prev) => prev.filter((_, i) => i !== index))}
                      className="text-sm font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTiers((prev) => [...prev, newTierRow()])}
              className="rounded-full border border-dashed border-[#2D4CC8]/40 bg-[#EEF2FC] px-4 py-2 text-sm font-semibold text-[#2D4CC8]"
            >
              + Add MDR tier
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveTiers}
              className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ color: "#fff" }}
            >
              {isSaving ? "Saving…" : "Save per-PG tiers"}
            </button>
          </div>
        </section>
      ) : null}

      {tab === "audit" ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#13203F]">MDR change log</h3>
              <p className="mt-1 text-sm text-slate-600">
                All MDR updates with timestamps and the responsible admin ({auditTotal} entries).
              </p>
            </div>
            <button
              type="button"
              onClick={loadAudit}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Refresh
            </button>
          </div>

          {auditLoading ? (
            <p className="text-sm text-slate-500">Loading change log…</p>
          ) : auditLogs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No MDR changes recorded yet. Save global rates or tiers to create the first log entry.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">When</th>
                    <th className="px-3 py-2 font-semibold">Admin</th>
                    <th className="px-3 py-2 font-semibold">Scope</th>
                    <th className="px-3 py-2 font-semibold">Action</th>
                    <th className="px-3 py-2 font-semibold">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100">
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                        {formatLogTime(log.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-[#13203F]">
                          {log.actorName || log.actorEmail || "Admin"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {log.actorEmail || "—"}
                          {log.actorRole ? ` · ${log.actorRole}` : ""}
                        </p>
                      </td>
                      <td className="px-3 py-3 capitalize text-slate-600">{log.scope}</td>
                      <td className="px-3 py-3 capitalize text-slate-600">{log.action}</td>
                      <td className="px-3 py-3 text-slate-700">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
