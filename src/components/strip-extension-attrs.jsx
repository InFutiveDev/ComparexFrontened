"use client";

import { useLayoutEffect } from "react";

const EXTENSION_ATTRS = new Set([
  "bis_skin_checked",
  "bis_register",
  "bis_id",
  "cz-shortcut-listen",
  "data-new-gr-c-s-check-loaded",
  "data-gr-ext-installed",
]);

function shouldStripAttr(name) {
  if (!name) return false;
  if (EXTENSION_ATTRS.has(name)) return true;
  return name.startsWith("__processed_");
}

function stripExtensionAttrs() {
  try {
    document.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (shouldStripAttr(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
    });
  } catch {
    // ignore
  }
}

export function StripExtensionAttrs() {
  useLayoutEffect(() => {
    stripExtensionAttrs();

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (
          record.type === "attributes" &&
          shouldStripAttr(record.attributeName)
        ) {
          record.target.removeAttribute(record.attributeName);
        }
      });
      stripExtensionAttrs();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
