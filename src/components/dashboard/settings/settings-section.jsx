"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  fetchAdminSettings,
  updateAdminFeeSettings,
  updateAdminPermissionSettings,
  updateAdminPayoutSettings,
} from "@/lib/dashboard-api";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

const TABS = [
  { id: "fees", label: "Fee Structures", fr: "FR-MA-01" },
  { id: "permissions", label: "Access Rights", fr: "FR-MA-02" },
  { id: "payouts", label: "Payout Rules", fr: "FR-MA-03" },
];

const FEE_APPLIES_OPTIONS = [
  { value: "merchant", label: "Merchant" },
  { value: "reseller", label: "Reseller" },
  { value: "payment_provider", label: "Payment Gateway" },
  { value: "platform", label: "Platform" },
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

function newFeeRow() {
  return {
    id: `fee_${Date.now()}`,
    name: "",
    description: "",
    appliesTo: ["reseller"],
    type: "percent",
    value: 0,
    minAmount: 0,
    maxAmount: "",
    active: true,
  };
}

function newPayoutRule() {
  return {
    id: `rule_${Date.now()}`,
    name: "",
    role: "reseller",
    threshold: 1000,
    active: true,
  };
}

export function SettingsSection() {
  const [tab, setTab] = useState("fees");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [updatedBy, setUpdatedBy] = useState(null);

  const [fees, setFees] = useState({ currency: "INR", structures: [] });
  const [permissions, setPermissions] = useState({
    roles: [],
    availablePermissions: [],
  });
  const [payouts, setPayouts] = useState({
    currency: "INR",
    minPayoutAmount: 1000,
    payoutSchedule: "monthly",
    payoutDayOfMonth: 7,
    holdDaysAfterActivation: 14,
    autoApproveBelow: 25000,
    eligibleStatuses: ["approved", "active"],
    rules: [],
  });

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchAdminSettings();
      const settings = data.settings || {};
      setFees(settings.fees || { currency: "INR", structures: [] });
      setPermissions(
        settings.permissions || { roles: [], availablePermissions: [] }
      );
      setPayouts(
        settings.payouts || {
          currency: "INR",
          minPayoutAmount: 1000,
          payoutSchedule: "monthly",
          payoutDayOfMonth: 7,
          holdDaysAfterActivation: 14,
          autoApproveBelow: 25000,
          eligibleStatuses: ["approved", "active"],
          rules: [],
        }
      );
      setUpdatedAt(settings.updatedAt || null);
      setUpdatedBy(settings.updatedBy || null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function handleSave() {
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      let response;
      if (tab === "fees") {
        response = await updateAdminFeeSettings({
          currency: fees.currency,
          structures: fees.structures.map((item) => ({
            ...item,
            maxAmount:
              item.maxAmount === "" || item.maxAmount == null
                ? null
                : Number(item.maxAmount),
          })),
        });
        setFees(response.fees);
        setUpdatedAt(response.updatedAt);
        setUpdatedBy(response.updatedBy);
      } else if (tab === "permissions") {
        response = await updateAdminPermissionSettings({
          roles: permissions.roles,
        });
        setPermissions(response.permissions);
        setUpdatedAt(response.updatedAt);
        setUpdatedBy(response.updatedBy);
      } else {
        response = await updateAdminPayoutSettings({
          ...payouts,
          eligibleStatuses: String(payouts.eligibleStatusesText ?? payouts.eligibleStatuses.join(", "))
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        });
        setPayouts(response.payouts);
        setUpdatedAt(response.updatedAt);
        setUpdatedBy(response.updatedBy);
      }
      setMessage(response.message || "Settings saved");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  function updateFee(index, key, value) {
    setFees((prev) => ({
      ...prev,
      structures: prev.structures.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function toggleFeeApplies(index, role) {
    setFees((prev) => ({
      ...prev,
      structures: prev.structures.map((item, i) => {
        if (i !== index) return item;
        const exists = item.appliesTo?.includes(role);
        return {
          ...item,
          appliesTo: exists
            ? item.appliesTo.filter((value) => value !== role)
            : [...(item.appliesTo || []), role],
        };
      }),
    }));
  }

  function togglePermission(roleIndex, permissionKey) {
    setPermissions((prev) => ({
      ...prev,
      roles: prev.roles.map((role, index) => {
        if (index !== roleIndex) return role;
        if (role.role === "admin") return role;
        const has = role.permissions.includes(permissionKey);
        return {
          ...role,
          permissions: has
            ? role.permissions.filter((key) => key !== permissionKey)
            : [...role.permissions, permissionKey],
        };
      }),
    }));
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading system settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D4CC8]">
          Master Admin Panel · Global System Settings
        </p>
        <h2 className="mt-1 text-2xl font-bold text-[#13203F]">Settings</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Configure platform-wide fee structures, role access rights, and payout rules for the
          CompareX platform.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {formatUpdatedMeta(updatedAt, updatedBy)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setError("");
                setMessage("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[#2D4CC8] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/30"
              }`}
              style={active ? { color: "#fff" } : undefined}
            >
              {item.label}
              <span className={`ml-2 text-[10px] ${active ? "text-white/80" : "text-slate-400"}`}>
                {item.fr}
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {tab === "fees" ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#13203F]">Platform-wide fee structures</h3>
              <p className="mt-1 text-sm text-slate-600">
                Define CompareX platform fees applied across roles and partner programs.
              </p>
            </div>
            <div className="w-40">
              <label className={labelClass}>Currency</label>
              <input
                className={inputClass}
                value={fees.currency || "INR"}
                onChange={(e) => setFees((prev) => ({ ...prev, currency: e.target.value }))}
              />
            </div>
          </div>

          {fees.structures?.map((fee, index) => (
            <div
              key={fee.id || index}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Fee name</label>
                  <input
                    className={inputClass}
                    value={fee.name}
                    onChange={(e) => updateFee(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select
                    className={inputClass}
                    value={fee.type}
                    onChange={(e) => updateFee(index, "type", e.target.value)}
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="flat">Flat amount</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Value</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    value={fee.value}
                    onChange={(e) => updateFee(index, "value", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Description</label>
                  <input
                    className={inputClass}
                    value={fee.description || ""}
                    onChange={(e) => updateFee(index, "description", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Min amount</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={fee.minAmount ?? 0}
                    onChange={(e) => updateFee(index, "minAmount", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Max amount</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={fee.maxAmount ?? ""}
                    onChange={(e) => updateFee(index, "maxAmount", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applies to
                </p>
                {FEE_APPLIES_OPTIONS.map((option) => (
                  <label key={option.value} className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={fee.appliesTo?.includes(option.value)}
                      onChange={() => toggleFeeApplies(index, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
                <label className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-[#13203F]">
                  <input
                    type="checkbox"
                    checked={Boolean(fee.active)}
                    onChange={(e) => updateFee(index, "active", e.target.checked)}
                  />
                  Active
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFees((prev) => ({
                      ...prev,
                      structures: prev.structures.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-sm font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setFees((prev) => ({
                ...prev,
                structures: [...(prev.structures || []), newFeeRow()],
              }))
            }
            className="rounded-full border border-dashed border-[#2D4CC8]/40 bg-[#EEF2FC] px-4 py-2 text-sm font-semibold text-[#2D4CC8]"
          >
            + Add fee structure
          </button>
        </section>
      ) : null}

      {tab === "permissions" ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#13203F]">User access rights</h3>
            <p className="mt-1 text-sm text-slate-600">
              Define permissions for each platform role. Master Admin always retains full access.
              Create individual users from{" "}
              <a href="/dashboard/users" className="font-semibold text-[#2D4CC8] hover:underline">
                Users & Access
              </a>
              .
            </p>
          </div>

          {permissions.roles?.map((role, roleIndex) => (
            <div
              key={role.role}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[#13203F]">
                    {role.label || role.role}
                  </p>
                  <p className="text-xs text-slate-500">{role.role}</p>
                </div>
                {role.role === "admin" ? (
                  <span className="rounded-full bg-[#EEF2FC] px-3 py-1 text-xs font-semibold text-[#2D4CC8]">
                    Full access (*)
                  </span>
                ) : null}
              </div>

              {role.role === "admin" ? (
                <p className="text-sm text-slate-600">
                  Master Admin permissions are locked to full platform control.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {(permissions.availablePermissions || []).map((permission) => (
                    <label
                      key={`${role.role}-${permission.key}`}
                      className="inline-flex items-start gap-2 rounded-lg bg-white px-3 py-2 text-sm text-[#13203F] ring-1 ring-slate-200"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={role.permissions?.includes(permission.key)}
                        onChange={() => togglePermission(roleIndex, permission.key)}
                      />
                      <span>
                        <span className="font-medium">{permission.label}</span>
                        <span className="mt-0.5 block text-[11px] text-slate-400">
                          {permission.key}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "payouts" ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#13203F]">Payout rules & thresholds</h3>
            <p className="mt-1 text-sm text-slate-600">
              Set minimum payout amounts, schedules, hold periods, and role-specific thresholds.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass}>Currency</label>
              <input
                className={inputClass}
                value={payouts.currency || "INR"}
                onChange={(e) => setPayouts((prev) => ({ ...prev, currency: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Min payout amount</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={payouts.minPayoutAmount}
                onChange={(e) =>
                  setPayouts((prev) => ({ ...prev, minPayoutAmount: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Schedule</label>
              <select
                className={inputClass}
                value={payouts.payoutSchedule}
                onChange={(e) =>
                  setPayouts((prev) => ({ ...prev, payoutSchedule: e.target.value }))
                }
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
                <option value="on_demand">On demand</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Payout day of month</label>
              <input
                type="number"
                min="1"
                max="28"
                className={inputClass}
                value={payouts.payoutDayOfMonth}
                onChange={(e) =>
                  setPayouts((prev) => ({ ...prev, payoutDayOfMonth: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Hold days after activation</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={payouts.holdDaysAfterActivation}
                onChange={(e) =>
                  setPayouts((prev) => ({
                    ...prev,
                    holdDaysAfterActivation: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Auto-approve below</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={payouts.autoApproveBelow}
                onChange={(e) =>
                  setPayouts((prev) => ({ ...prev, autoApproveBelow: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass}>Eligible statuses (comma-separated)</label>
              <input
                className={inputClass}
                value={
                  payouts.eligibleStatusesText ??
                  (Array.isArray(payouts.eligibleStatuses)
                    ? payouts.eligibleStatuses.join(", ")
                    : "")
                }
                onChange={(e) =>
                  setPayouts((prev) => ({
                    ...prev,
                    eligibleStatusesText: e.target.value,
                  }))
                }
                placeholder="approved, active"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#13203F]">Role thresholds</h4>
            {payouts.rules?.map((rule, index) => (
              <div
                key={rule.id || index}
                className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-4"
              >
                <div className="sm:col-span-2">
                  <label className={labelClass}>Rule name</label>
                  <input
                    className={inputClass}
                    value={rule.name}
                    onChange={(e) =>
                      setPayouts((prev) => ({
                        ...prev,
                        rules: prev.rules.map((item, i) =>
                          i === index ? { ...item, name: e.target.value } : item
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <select
                    className={inputClass}
                    value={rule.role || ""}
                    onChange={(e) =>
                      setPayouts((prev) => ({
                        ...prev,
                        rules: prev.rules.map((item, i) =>
                          i === index ? { ...item, role: e.target.value } : item
                        ),
                      }))
                    }
                  >
                    <option value="reseller">Reseller</option>
                    <option value="payment_provider">Payment Gateway</option>
                    <option value="merchant">Merchant</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Threshold</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={rule.threshold}
                    onChange={(e) =>
                      setPayouts((prev) => ({
                        ...prev,
                        rules: prev.rules.map((item, i) =>
                          i === index ? { ...item, threshold: e.target.value } : item
                        ),
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-3 sm:col-span-4">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#13203F]">
                    <input
                      type="checkbox"
                      checked={Boolean(rule.active)}
                      onChange={(e) =>
                        setPayouts((prev) => ({
                          ...prev,
                          rules: prev.rules.map((item, i) =>
                            i === index ? { ...item, active: e.target.checked } : item
                          ),
                        }))
                      }
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPayouts((prev) => ({
                        ...prev,
                        rules: prev.rules.filter((_, i) => i !== index),
                      }))
                    }
                    className="text-sm font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setPayouts((prev) => ({
                  ...prev,
                  rules: [...(prev.rules || []), newPayoutRule()],
                }))
              }
              className="rounded-full border border-dashed border-[#2D4CC8]/40 bg-[#EEF2FC] px-4 py-2 text-sm font-semibold text-[#2D4CC8]"
            >
              + Add payout rule
            </button>
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="rounded-full bg-[#2D4CC8] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ color: "#fff" }}
        >
          {isSaving ? "Saving…" : "Save settings"}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={loadSettings}
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
        >
          Reset / reload
        </button>
      </div>
    </div>
  );
}
