"use client";

import { useLayoutEffect } from "react";
import { EXTENSION_ATTRS } from "@/lib/strip-extension-attrs";

const EXTENSION_ATTR_SET = new Set(EXTENSION_ATTRS);

function shouldStripAttr(name) {
  if (!name) return false;
  if (EXTENSION_ATTR_SET.has(name)) return true;
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
