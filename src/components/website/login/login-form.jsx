"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiArrowRight, HiEye, HiEyeSlash } from "react-icons/hi2";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiError } from "@/lib/api";
import { validateEmail } from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20";

const accountTypes = ["Merchant", "Reseller", "Payment Gateway"];

export function LoginFormSection() {
  const router = useRouter();
  const { login } = useAuth();
  const [accountType, setAccountType] = useState("Merchant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password, accountType, remember: rememberMe });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#eff4ff] via-[#e9f2ff] to-[#ecf9f3]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(59,130,246,0.10) 26px, rgba(59,130,246,0.10) 27px)",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-32px_rgba(45,76,200,0.35)] lg:grid-cols-2">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2D4CC8] via-[#3B5BDB] to-[#25A36F] p-10 text-white lg:flex">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              aria-hidden
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(255,255,255,0.15) 26px, rgba(255,255,255,0.15) 27px)",
              }}
            />
            <div className="relative">
              <Link href="/">
                <Image
                  src="/images/logo.svg"
                  alt="CompareX"
                  width={140}
                  height={40}
                  className="h-10 w-auto brightness-0 invert"
                />
              </Link>
              <h2 className="mt-10 text-3xl font-bold leading-tight">
                Welcome back to CompareX
              </h2>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-white/90">
                Access your dashboard to manage leads, track merchant onboarding, and grow your
                partner business — all in one place.
              </p>
            </div>
            <ul className="relative space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white" aria-hidden />
                Merchants, Resellers & Payment Providers
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white" aria-hidden />
                Secure access to your CompareX account
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white" aria-hidden />
                Track leads, activations & commissions
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center p-4 sm:p-4 lg:p-5">
            <div className="lg:hidden">
              <Link href="/">
                <Image
                  src="/images/logo.svg"
                  alt="CompareX"
                  width={120}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </Link>
            </div>

            <div className="mt-6 lg:mt-0">
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                Enter your credentials to access your CompareX dashboard.
              </p>
              <div className="flex justify-center items-center"> 
              <div className="mt-4 inline-flex w-full items-center justify-center flex-wrap rounded-full border border-slate-200 bg-slate-50 p-1 sm:w-fit">
                {accountTypes.map((type) => {
                  const active = accountType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAccountType(type)}
                      className={`flex-1 cursor-pointer rounded-full px-3 py-2 text-center text-xs font-medium transition sm:flex-none sm:px-4 sm:text-sm ${
                        active
                          ? "bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-white shadow-sm"
                          : "text-[#13203F]/70 hover:bg-white hover:text-[#13203F]"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-[#2D4CC8] transition hover:text-[#3B5BDB]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-12`}
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
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="size-4 rounded border-slate-300 text-[#2D4CC8] focus:ring-[#2D4CC8]/30"
                />
                <span className="text-sm text-slate-600">Remember me on this device</span>
              </label>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex h-12 w-fit cursor-pointer items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 font-medium text-white transition hover:bg-[#3B5BDB] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="z-10 pr-2">{isSubmitting ? "Signing in..." : "Sign In"}</span>
                  <div className="absolute right-1 inline-flex h-10 w-10 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
                    <div className="mr-3 flex items-center justify-center">
                      <HiArrowRight className="size-5 text-white" />
                    </div>
                  </div>
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-[#2D4CC8] hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
