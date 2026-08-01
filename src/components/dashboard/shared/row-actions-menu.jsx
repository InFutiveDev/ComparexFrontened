"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiEllipsisVertical,
  HiEnvelope,
  HiEye,
  HiPhone,
  HiTrash,
  HiUserPlus,
} from "react-icons/hi2";

export function buildDefaultRowActionItems({ row, labels, detailsHref }) {
  return [
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
      label: labels?.assign ?? "Assign",
      icon: HiUserPlus,
      className: "text-[#13203F] hover:bg-slate-50",
      iconClassName: "text-[#25a36f]",
    },
    {
      type: "button",
      label: labels?.delete ?? "Delete",
      icon: HiTrash,
      className: "text-red-600 hover:bg-red-50",
      iconClassName: "text-red-500",
    },
  ];
}

export function RowActionsMenu({
  row,
  labels,
  menuItems,
  isOpen,
  onToggle,
  onClose,
  detailsHref,
  onDeleteRow,
}) {
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

  const resolvedMenuItems =
    menuItems ?? buildDefaultRowActionItems({ row, labels, detailsHref });

  const menuContent = isOpen ? (
    <div
      ref={menuRef}
      role="menu"
      style={menuStyle ? { top: menuStyle.top, left: menuStyle.left } : undefined}
      className={`fixed z-[200] min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10 ${
        menuStyle ? "visible" : "invisible"
      }`}
    >
      {resolvedMenuItems.map((item) => {
        const Icon = item.icon;

        if (item.type === "link") {
          if (item.disabled || !item.href) {
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled
                className={`flex w-full cursor-not-allowed items-center gap-2 px-3 py-2.5 text-left text-sm opacity-45 ${item.className}`}
              >
                <Icon className={`size-4 ${item.iconClassName}`} aria-hidden />
                {item.label}
              </button>
            );
          }

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
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              if (item.onClick) {
                item.onClick(row);
              } else if (item.label === labels?.delete && onDeleteRow) {
                onDeleteRow(row);
              }
              onClose();
            }}
            className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition ${
              item.disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"
            } ${item.className}`}
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
