"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  isPgNameRequiredError,
  parseDetectedFormatFromError,
  uploadTransactionData,
} from "@/lib/reports-api";

export function useUploadTransactionFile() {
  const [file, setFile] = useState(null);
  const [pgName, setPgName] = useState("");
  const [detectedFormat, setDetectedFormat] = useState(null);
  const [needsPgSelection, setNeedsPgSelection] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const clearError = useCallback(() => setError(""), []);

  const selectFile = useCallback((nextFile) => {
    setFile(nextFile);
    setResult(null);
    setError("");
    setNeedsPgSelection(false);
    setDetectedFormat(null);
    setPgName("");
  }, []);

  const clearFile = useCallback(() => {
    selectFile(null);
  }, [selectFile]);

  const upload = useCallback(
    async ({ pgName: pgNameOverride } = {}) => {
      if (!file) {
        setError("Please select a file to upload");
        return null;
      }

      setIsUploading(true);
      setError("");
      setResult(null);

      const effectivePgName = pgNameOverride ?? pgName;

      try {
        const data = await uploadTransactionData({
          file,
          pgName: effectivePgName || undefined,
        });
        setResult(data);
        setNeedsPgSelection(false);
        setDetectedFormat(data.detectedFormat || detectedFormat);
        return data;
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Failed to upload transaction data";

        if (err instanceof ApiError && err.status === 400 && isPgNameRequiredError(message)) {
          const format = parseDetectedFormatFromError(message) || detectedFormat;
          setDetectedFormat(format);
          setNeedsPgSelection(true);
          setError("");
          return null;
        }

        setError(
          err instanceof ApiError && err.status === 500
            ? "An unexpected server error occurred. Please try again."
            : message,
        );
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [file, pgName, detectedFormat],
  );

  const retryWithPgName = useCallback(async () => {
    if (!pgName.trim()) {
      setError("Please select a payment gateway");
      return null;
    }
    return upload({ pgName: pgName.trim() });
  }, [pgName, upload]);

  const reset = useCallback(() => {
    setFile(null);
    setPgName("");
    setDetectedFormat(null);
    setNeedsPgSelection(false);
    setResult(null);
    setError("");
    setIsUploading(false);
  }, []);

  return {
    file,
    pgName,
    setPgName,
    detectedFormat,
    needsPgSelection,
    result,
    error,
    isUploading,
    selectFile,
    clearFile,
    clearError,
    upload,
    retryWithPgName,
    reset,
  };
}
