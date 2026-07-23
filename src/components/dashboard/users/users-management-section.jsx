"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiArrowPath, HiEye, HiEyeSlash } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import {
  createAdminUser,
  fetchAdminUsers,
  updateAdminUser,
} from "@/lib/dashboard-api";

const PAGE_SIZE = 10;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function UsersManagementSection() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ role: "", status: "", search: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "sub_admin",
    status: "active",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchAdminUsers({
        page,
        limit: PAGE_SIZE,
        role: filters.role || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      });
      setUsers(data.users || []);
      setRoles(data.roles || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    const timer = window.setTimeout(loadUsers, filters.search ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [loadUsers, filters.search]);

  async function handleCreate(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      await createAdminUser(form);
      setMessage("User created successfully");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "sub_admin",
        status: "active",
      });
      setShowPassword(false);
      await loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create user");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateUser(id, payload) {
    setUpdatingId(id);
    setError("");
    setMessage("");

    try {
      await updateAdminUser(id, payload);
      setMessage("User updated successfully");
      await loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update user");
    } finally {
      setUpdatingId("");
    }
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
            Users & Access
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create platform users and assign roles. Role permissions are configured under{" "}
            <Link href="/dashboard/settings" className="font-semibold text-[#2D4CC8] hover:underline">
              System Settings → Access Rights
            </Link>
            .
          </p>
        </div>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#13203F]">Add user</p>
        <form onSubmit={handleCreate} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            className={inputClass}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            className={inputClass}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <div className="relative">
            <input
              className={`${inputClass} pr-12`}
              type={showPassword ? "text" : "password"}
              minLength={6}
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <HiEyeSlash className="size-5" />
              ) : (
                <HiEye className="size-5" />
              )}
            </button>
          </div>
          <select
            className={inputClass}
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          >
            {roles.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-[#2D4CC8] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSaving ? "Creating…" : "Create user"}
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className={inputClass}
            placeholder="Search name or email"
            value={filters.search}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, search: e.target.value }));
            }}
          />
          <select
            className={inputClass}
            value={filters.role}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, role: e.target.value }));
            }}
          >
            <option value="">All roles</option>
            {roles.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            className={inputClass}
            value={filters.status}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, status: e.target.value }));
            }}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          <HiArrowPath className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Created</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-slate-500">
                    No users match these filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-semibold text-[#13203F]">{user.name}</td>
                    <td className="px-3 py-3 text-slate-600">{user.email}</td>
                    <td className="px-3 py-3">
                      <select
                        className={`${inputClass} min-w-[10rem]`}
                        value={user.role}
                        disabled={updatingId === user.id}
                        onChange={(e) =>
                          handleUpdateUser(user.id, { role: e.target.value })
                        }
                      >
                        {roles.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge active={user.status === "active"} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                      {user.createdAt
                        ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                            new Date(user.createdAt),
                          )
                        : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        disabled={updatingId === user.id}
                        onClick={() =>
                          handleUpdateUser(user.id, {
                            status: user.status === "active" ? "inactive" : "active",
                          })
                        }
                        className="font-semibold text-[#2D4CC8] hover:underline disabled:opacity-50"
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Showing {rangeStart}–{rangeEnd} of {total} user{total === 1 ? "" : "s"} · Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((value) => Math.min(pages, value + 1))}
              className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
