"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiChevronLeft,
  HiChevronRight,
  HiEllipsisVertical,
  HiEnvelope,
  HiEye,
  HiFunnel,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiPhone,
  HiSquares2X2,
  HiTableCells,
  HiTrash,
  HiUserPlus,
  HiViewColumns,
} from "react-icons/hi2";
import { AccountStatusCell } from "@/components/dashboard/shared/account-status-cell";
import { useDashboard } from "@/components/dashboard/layout/dashboard-context";

const perPageOptions = [5, 10, 20];

const emptyFilters = {
  status: "",
  category: "",
  workType: "",
  assignee: "",
};

const defaultLabels = {
  search: "Search",
  empty: "No records found",
  emptyHint: "Try a different search term or clear filters.",
  filterTitle: "Filter",
  filterDescription: "Refine records by status, category, and more",
  upload: "Upload",
  download: "Download",
  assign: "Assign",
  delete: "Delete",
};

function getUniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]))].sort();
}

function countActiveFilters(filters) {
  return Object.values(filters).filter(Boolean).length;
}

function matchesRowFilters(row, filters, lockWorkTypeFilter) {
  if (filters.status && row.status !== filters.status) return false;
  if (filters.category && row.category !== filters.category) return false;
  if (!lockWorkTypeFilter && filters.workType && row.workType !== filters.workType) return false;
  if (filters.assignee && row.assignee !== filters.assignee) return false;
  return true;
}

const statusStyles = {
  New: "bg-[#25a36f]/12 text-[#25a36f]",
  "In Review": "bg-amber-100 text-amber-700",
  Qualified: "bg-[#40C3CF]/15 text-[#0f766e]",
  Rejected: "bg-red-100 text-red-700",
  Assigned: "bg-[#2D4CC8]/10 text-[#2D4CC8]",
  "Talk to Expert Booked": "bg-indigo-100 text-indigo-700",
  "Pending Review": "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Incomplete: "bg-slate-100 text-slate-600",
  Published: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Hidden: "bg-slate-100 text-slate-600",
  Contacted: "bg-[#40C3CF]/15 text-[#0f766e]",
  Completed: "bg-[#2D4CC8]/10 text-[#2D4CC8]",
  Cancelled: "bg-red-100 text-red-700",
  Proposal: "bg-amber-100 text-amber-700",
  Won: "bg-[#2D4CC8]/10 text-[#2D4CC8]",
};

function matchesRowSearch(row, query) {
  const haystack = [
    row.id,
    row.name,
    row.company,
    row.email,
    row.phone,
    row.status,
    row.accountStatus,
    row.source,
    row.assignee,
    row.category,
    row.workType,
    String(row.score),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function StatusBadge({ status }) {
  const label = status.toUpperCase();
  const className = statusStyles[status] ?? "bg-slate-100 text-slate-600";

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${className}`}>
      {label}
    </span>
  );
}

function CrmFilterModal({ open, labels, draftFilters, options, lockWorkTypeFilter, onChange, onClear, onApply, onClose }) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const fields = [
    { key: "status", label: "Status", options: options.statuses },
    { key: "category", label: "Category", options: options.categories },
    ...(!lockWorkTypeFilter
      ? [{ key: "workType", label: "Work Type", options: options.workTypes }]
      : []),
    { key: "assignee", label: "Assignee", options: options.assignees },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#13203F]/50 backdrop-blur-[2px]"
        aria-label="Close filter modal"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crm-filter-modal-title"
        className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl shadow-[#13203F]/20"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="crm-filter-modal-title" className="text-lg font-bold text-[#13203F]">
              {labels.filterTitle}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">{labels.filterDescription}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#2D4CC8]/30 hover:text-[#13203F]"
            aria-label="Close"
          >
            <HiOutlineXMark className="size-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {fields.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600">{field.label}</span>
              <select
                value={draftFilters[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20"
              >
                <option value="">All {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-sm font-semibold text-[#2D4CC8] transition hover:text-[#40C3CF]"
          >
            Clear all
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onApply}
              className="cursor-pointer rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-[#2D4CC8]/20 transition hover:brightness-110"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RowActionsMenu({ row, labels, isOpen, onToggle, onClose, detailsHref, onDeleteRow }) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState(null);

  function updateMenuPosition() {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuWidth = menu?.offsetWidth ?? 176;
    const menuHeight = menu?.offsetHeight ?? 220;
    const gap = 6;
    const padding = 8;

    let left = rect.right - menuWidth;
    let top = rect.bottom + gap;

    left = Math.max(padding, Math.min(left, window.innerWidth - menuWidth - padding));

    if (top + menuHeight > window.innerHeight - padding) {
      top = Math.max(padding, rect.top - menuHeight - gap);
    }

    setMenuStyle({ top, left });
  }

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuStyle(null);
      return;
    }

    updateMenuPosition();
    const frame = requestAnimationFrame(() => updateMenuPosition());

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        onClose();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    {
      type: "link",
      label: "Call",
      icon: HiPhone,
      href: `tel:${row.phone}`,
      className: "text-[#13203F] hover:bg-slate-50",
      iconClassName: "text-[#2D4CC8]",
    },
    {
      type: "link",
      label: "Send Email",
      icon: HiEnvelope,
      href: `mailto:${row.email}`,
      className: "text-[#13203F] hover:bg-slate-50",
      iconClassName: "text-[#40C3CF]",
    },
    {
      type: detailsHref ? "link" : "button",
      label: "View Details",
      icon: HiEye,
      href: detailsHref,
      className: "text-[#13203F] hover:bg-slate-50",
      iconClassName: "text-[#2D4CC8]",
    },
    {
      type: "button",
      label: labels.assign,
      icon: HiUserPlus,
      className: "text-[#13203F] hover:bg-slate-50",
      iconClassName: "text-[#25a36f]",
    },
    {
      type: "button",
      label: labels.delete,
      icon: HiTrash,
      className: "text-red-600 hover:bg-red-50",
      iconClassName: "text-red-500",
    },
  ];

  const menuContent = isOpen ? (
    <div
      ref={menuRef}
      role="menu"
      style={menuStyle ? { top: menuStyle.top, left: menuStyle.left } : undefined}
      className={`fixed z-[200] w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10 ${
        menuStyle ? "visible" : "invisible"
      }`}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;

        if (item.type === "link") {
          const className = `flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm transition ${item.className}`;

          if (item.href?.startsWith("/")) {
            return (
              <Link
                key={item.label}
                href={item.href}
                role="menuitem"
                onClick={onClose}
                className={className}
              >
                <Icon className={`size-4 ${item.iconClassName}`} aria-hidden />
                {item.label}
              </Link>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              role="menuitem"
              onClick={onClose}
              className={className}
            >
              <Icon className={`size-4 ${item.iconClassName}`} aria-hidden />
              {item.label}
            </a>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            onClick={() => {
              if (item.label === labels.delete && onDeleteRow) {
                onDeleteRow(row);
              }
              onClose();
            }}
            className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm transition ${item.className}`}
          >
            <Icon className={`size-4 ${item.iconClassName}`} aria-hidden />
            {item.label}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <div className="flex justify-end">
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#2D4CC8]/30 hover:bg-slate-50 hover:text-[#13203F]"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Actions for ${row.name}`}
      >
        <HiEllipsisVertical className="size-5" aria-hidden />
      </button>

      {typeof document !== "undefined" && menuContent
        ? createPortal(menuContent, document.body)
        : null}
    </div>
  );
}

export function CrmDataTable({
  data,
  variant = "overview",
  workTypeFilter,
  lockWorkTypeFilter = false,
  labels: labelsProp,
  searchType = "merchant",
  headerTitle,
  headerTabs,
  detailsBasePath,
  detailsWorkType,
  showAccountStatus = false,
  accountStatusResource,
  onAccountStatusUpdated,
  hideClientId = false,
  onDeleteRow,
}) {
  const labels = { ...defaultLabels, ...labelsProp };
  const { merchantSearch, setMerchantSearch, leadSearch, setLeadSearch } = useDashboard();
  const contextSearch = searchType === "lead" ? leadSearch : merchantSearch;
  const setContextSearch = searchType === "lead" ? setLeadSearch : setMerchantSearch;

  const [localSearch, setLocalSearch] = useState(contextSearch);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(variant === "overview" ? 5 : 10);
  const [viewMode, setViewMode] = useState("list");
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);
  const [draftFilters, setDraftFilters] = useState(emptyFilters);

  const isFullPage = variant === "full";

  const scopedData = useMemo(() => {
    if (!workTypeFilter) return data;
    return data.filter((row) => row.workType === workTypeFilter);
  }, [data, workTypeFilter]);

  const filterOptions = useMemo(
    () => ({
      statuses: getUniqueValues(scopedData, "status"),
      categories: getUniqueValues(scopedData, "category"),
      workTypes: getUniqueValues(scopedData, "workType"),
      assignees: getUniqueValues(scopedData, "assignee"),
    }),
    [scopedData]
  );

  const activeFilterCount = countActiveFilters(
    lockWorkTypeFilter ? { ...filters, workType: "" } : filters
  );

  useEffect(() => {
    setLocalSearch(contextSearch);
  }, [contextSearch]);

  useEffect(() => {
    setPage(1);
    setFilters(emptyFilters);
    setDraftFilters(emptyFilters);
  }, [workTypeFilter]);

  const filteredRows = useMemo(() => {
    const query = (localSearch || contextSearch).trim().toLowerCase();

    return scopedData.filter((row) => {
      if (query && !matchesRowSearch(row, query)) return false;
      return matchesRowFilters(row, filters, lockWorkTypeFilter);
    });
  }, [scopedData, localSearch, contextSearch, filters, lockWorkTypeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / perPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRows.slice(start, start + perPage);
  }, [filteredRows, page, perPage]);

  function handleSearchChange(value) {
    setLocalSearch(value);
    setContextSearch(value);
    setPage(1);
  }

  function handleFilterChange(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function openFilterModal() {
    setOpenActionMenuId(null);
    setDraftFilters(filters);
    setFilterOpen(true);
  }

  function closeFilterModal() {
    setFilterOpen(false);
  }

  function handleDraftFilterChange(key, value) {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  }

  function applyFilters() {
    setFilters(draftFilters);
    setPage(1);
    setFilterOpen(false);
  }

  function clearDraftFilters() {
    setDraftFilters(emptyFilters);
  }

  function getRowDetailsHref(row) {
    if (!detailsBasePath) return undefined;
    if (detailsWorkType && row.workType !== detailsWorkType) return undefined;
    return `${detailsBasePath}/${encodeURIComponent(row.id)}`;
  }

  return (
    <>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {headerTitle ? (
          <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <h3 className="text-lg font-bold text-[#13203F] sm:text-xl">{headerTitle}</h3>
            {headerTabs}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <label className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <span className="sr-only">{labels.search}</span>
              <HiOutlineMagnifyingGlass
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                type="search"
                value={localSearch}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search..."
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20"
              />
            </label>
            <button
              type="button"
              onClick={openFilterModal}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition ${
                activeFilterCount > 0
                  ? "border-[#2D4CC8]/30 bg-[#EEF2FC] text-[#2D4CC8]"
                  : "border-slate-200 bg-white text-[#13203F] hover:border-[#2D4CC8]/30 hover:bg-slate-50"
              }`}
              aria-expanded={filterOpen}
            >
              <HiFunnel className="size-4 text-[#2D4CC8]" aria-hidden />
              Filter
              {activeFilterCount > 0 ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-[#2D4CC8] text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>

          {isFullPage ? (
            <div className="flex flex-wrap items-center gap-2">
              {/* <div className="inline-flex rounded-lg border border-slate-200 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`cursor-pointer rounded-md p-2 transition ${
                    viewMode === "list" ? "bg-[#EEF2FC] text-[#2D4CC8]" : "text-slate-400 hover:text-[#13203F]"
                  }`}
                  aria-label="List view"
                >
                  <HiTableCells className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`cursor-pointer rounded-md p-2 transition ${
                    viewMode === "grid" ? "bg-[#EEF2FC] text-[#2D4CC8]" : "text-slate-400 hover:text-[#13203F]"
                  }`}
                  aria-label="Grid view"
                >
                  <HiSquares2X2 className="size-4" aria-hidden />
                </button>
              </div> */}
              {/* <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#25a36f] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#25a36f]/25 transition hover:brightness-110"
              >
                <HiArrowUpTray className="size-4" aria-hidden />
                {labels.upload}
              </button> */}
              <button
                type="button"
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#2D4CC8]/30 hover:text-[#2D4CC8]"
                aria-label={labels.download}
              >
                <HiArrowDownTray className="size-4" aria-hidden />
              </button>
              {/* <button
                type="button"
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#2D4CC8]/30 hover:text-[#2D4CC8]"
                aria-label="Column settings"
              >
                <HiViewColumns className="size-4" aria-hidden />
              </button> */}
            </div>
          ) : null}
        </div>

        {activeFilterCount > 0 ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2 sm:px-5">
            <span className="text-xs font-medium text-slate-500">Active filters:</span>
            {filters.status ? (
              <button
                type="button"
                onClick={() => handleFilterChange("status", "")}
                className="cursor-pointer rounded-full bg-[#EEF2FC] px-2.5 py-1 text-xs font-medium text-[#2D4CC8]"
              >
                Status: {filters.status} ×
              </button>
            ) : null}
            {filters.category ? (
              <button
                type="button"
                onClick={() => handleFilterChange("category", "")}
                className="cursor-pointer rounded-full bg-[#EEF2FC] px-2.5 py-1 text-xs font-medium text-[#2D4CC8]"
              >
                Category: {filters.category} ×
              </button>
            ) : null}
            {!lockWorkTypeFilter && filters.workType ? (
              <button
                type="button"
                onClick={() => handleFilterChange("workType", "")}
                className="cursor-pointer rounded-full bg-[#EEF2FC] px-2.5 py-1 text-xs font-medium text-[#2D4CC8]"
              >
                Work Type: {filters.workType} ×
              </button>
            ) : null}
            {filters.assignee ? (
              <button
                type="button"
                onClick={() => handleFilterChange("assignee", "")}
                className="cursor-pointer rounded-full bg-[#EEF2FC] px-2.5 py-1 text-xs font-medium text-[#2D4CC8]"
              >
                Assignee: {filters.assignee} ×
              </button>
            ) : null}
          </div>
        ) : null}

        {filteredRows.length === 0 ? (
          <div className="px-4 py-14 text-center sm:px-5">
            <p className="text-sm font-semibold text-[#13203F]">{labels.empty}</p>
            <p className="mt-1 text-sm text-slate-500">{labels.emptyHint}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-[#0a27c9] text-[11px] font-semibold uppercase tracking-wide text-white">
                  <th className="px-4 py-3 sm:px-5">Client</th>
                  <th className="px-3 py-3">Phone Number</th>
                  <th className="px-3 py-3">Email ID</th>
                  <th className="px-3 py-3">Assignee</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Work Type</th>
                  <th className="px-3 py-3">Status</th>
                  {showAccountStatus ? <th className="px-3 py-3">Login Access</th> : null}
                  <th className="px-4 py-3 text-right sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 transition last:border-b-0 hover:bg-[#EEF2FC]/35">
                    <td className="px-4 py-3.5 sm:px-5">
                      <p className="font-semibold text-[#13203F]">{row.name}</p>
                      {!hideClientId ? (
                        <p className="mt-0.5 text-xs text-slate-500">ID: {row.id}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3.5">
                      <a
                        href={`tel:${row.phone}`}
                        className="inline-flex items-center gap-1.5 text-slate-700 transition hover:text-[#2D4CC8]"
                      >
                        <HiPhone className="size-4 shrink-0 text-[#2D4CC8]" aria-hidden />
                        {row.phone}
                      </a>
                    </td>
                    <td className="px-3 py-3.5">
                      <a
                        href={`mailto:${row.email}`}
                        className="inline-flex items-center gap-1.5 text-slate-700 transition hover:text-[#40C3CF]"
                      >
                        <HiEnvelope className="size-4 shrink-0 text-[#40C3CF]" aria-hidden />
                        <span className="max-w-[200px] truncate">{row.email}</span>
                      </a>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: row.assigneeColor }}
                          title={row.assignee}
                        >
                          {row.assigneeInitials}
                        </div>
                        <span className="hidden text-xs text-slate-600 xl:inline">{row.assignee}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="rounded-lg bg-[#EEF2FC] px-2.5 py-1 text-xs font-medium text-[#2D4CC8] ring-1 ring-[#2D4CC8]/10">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-slate-700">{row.workType}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    {showAccountStatus ? (
                      <td className="px-3 py-3.5">
                        <AccountStatusCell
                          row={row}
                          resource={accountStatusResource}
                          onUpdated={onAccountStatusUpdated}
                        />
                      </td>
                    ) : null}
                    <td className="relative overflow-visible px-4 py-3.5 sm:px-5">
                      <RowActionsMenu
                        row={row}
                        labels={labels}
                        isOpen={openActionMenuId === row.id}
                        onToggle={() =>
                          setOpenActionMenuId((current) => (current === row.id ? null : row.id))
                        }
                        onClose={() => setOpenActionMenuId(null)}
                        detailsHref={getRowDetailsHref(row)}
                        onDeleteRow={onDeleteRow}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredRows.length > 0 ? (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Show</span>
              <select
                value={perPage}
                onChange={(event) => {
                  setPerPage(Number(event.target.value));
                  setPage(1);
                }}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20"
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <HiChevronLeft className="size-4" aria-hidden />
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`min-w-8 cursor-pointer rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                    pageNumber === page
                      ? "bg-[#25a36f]/15 text-[#25a36f]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <HiChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <CrmFilterModal
        open={filterOpen}
        labels={labels}
        draftFilters={draftFilters}
        options={filterOptions}
        lockWorkTypeFilter={lockWorkTypeFilter}
        onChange={handleDraftFilterChange}
        onClear={clearDraftFilters}
        onApply={applyFilters}
        onClose={closeFilterModal}
      />
    </>
  );
}
