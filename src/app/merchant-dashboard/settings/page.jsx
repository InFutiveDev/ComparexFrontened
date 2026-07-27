import Link from "next/link";

export default function MerchantSettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">Settings</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
          Account preferences and security settings for your merchant portal.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#13203F]">Account management</h3>
        <p className="mt-2 text-sm text-slate-600">
          Update your profile details, business information, and password from My Profile.
        </p>
        <Link
          href="/merchant-dashboard/profile"
          className="mt-4 inline-flex rounded-full bg-[#2D4CC8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243da8]"
        >
          Go to My Profile
        </Link>
      </div>
    </div>
  );
}
