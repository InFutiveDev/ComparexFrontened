"use client";

import { useState } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export function PasswordInput({
  id,
  value,
  onChange,
  required = false,
  minLength,
  placeholder,
  className = "",
  disabled = false,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <HiEyeSlash className="size-5" aria-hidden /> : <HiEye className="size-5" aria-hidden />}
      </button>
    </div>
  );
}
