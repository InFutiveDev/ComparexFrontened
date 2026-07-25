"use client";

import { sanitizePhoneInput } from "@/lib/validation";

export const PHONE_PLACEHOLDER = "10–11 digits";

export function PhoneInput({
  id,
  value,
  onChange,
  required = false,
  className = "",
  placeholder = PHONE_PLACEHOLDER,
  disabled = false,
}) {
  return (
    <input
      id={id}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      maxLength={11}
      required={required}
      disabled={disabled}
      value={value}
      placeholder={placeholder}
      className={className}
      onChange={(event) => onChange(sanitizePhoneInput(event.target.value))}
    />
  );
}
