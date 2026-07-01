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

export function RegisterFormSection() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create account");
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
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#25A36F] via-[#2D4CC8] to-[#3B5BDB] p-10 text-white lg:flex">
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
              <h2 className="mt-10 text-3xl font-bold leading-tight">Join CompareX</h2>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-white/90">
                Create your account to compare payment gateways, manage leads, and grow your
                business with expert guidance.
              </p>
            </div>
            <ul className="relative space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white" aria-hidden />
                Free, unbiased payment gateway comparisons
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white" aria-hidden />
                Dashboard access for merchants and partners
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white" aria-hidden />
                Expert support when you need it
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
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
                Create your account
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                Sign up to access your CompareX dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

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
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className={inputClass}
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex h-12 w-fit cursor-pointer items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 font-medium text-white transition hover:bg-[#3B5BDB] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="z-10 pr-2">
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </span>
                  <div className="absolute right-1 inline-flex h-10 w-10 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
                    <div className="mr-3 flex items-center justify-center">
                      <HiArrowRight className="size-5 text-white" />
                    </div>
                  </div>
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#2D4CC8] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
