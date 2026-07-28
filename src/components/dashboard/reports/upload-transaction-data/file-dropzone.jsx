"use client";

import { useCallback, useRef, useState } from "react";
import { HiCloudArrowUp, HiXMark } from "react-icons/hi2";

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];
const ACCEPTED_MIME =
  ".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAcceptedFile(file) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function FileDropzone({ file, onFileSelected, onClear, disabled = false }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleFile = useCallback(
    (nextFile) => {
      if (!nextFile) return;
      if (!isAcceptedFile(nextFile)) {
        setValidationMessage("Please upload a CSV or XLS file.");
        return;
      }
      setValidationMessage("");
      onFileSelected(nextFile);
    },
    [onFileSelected],
  );

  function openPicker() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function onKeyDown(event) {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={onKeyDown}
        onClick={openPicker}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          if (disabled) return;
          const dropped = event.dataTransfer.files?.[0];
          if (dropped) handleFile(dropped);
        }}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition outline-none focus-visible:ring-2 focus-visible:ring-[#40C3CF]/30 ${
          dragActive
            ? "border-[#2D4CC8] bg-[#EEF2FC]"
            : "border-slate-200 bg-slate-50 hover:border-[#2D4CC8]/50 hover:bg-[#EEF2FC]/40"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <HiCloudArrowUp className="mx-auto size-10 text-[#2D4CC8]" aria-hidden />
        <p className="mt-3 text-sm font-semibold text-[#13203F]">
          Drag and drop your transaction file here
        </p>
        <p className="mt-1 text-sm text-slate-600">or click to browse</p>
        <p className="mt-2 text-xs text-slate-500">Accepted: CSV, XLS, XLSX</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_MIME}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) handleFile(selected);
            event.target.value = "";
          }}
        />
      </div>

      <div aria-live="polite" className="min-h-[1.25rem] text-sm">
        {validationMessage ? (
          <p className="text-red-700">{validationMessage}</p>
        ) : null}
      </div>

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold text-[#13203F]">{file.name}</p>
            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClear?.();
            }}
            disabled={disabled}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#13203F] disabled:opacity-50"
            aria-label="Remove file"
          >
            <HiXMark className="size-5" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
