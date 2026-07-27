import { MerchantProfileSection } from "@/components/portal/merchant-profile-section";

export default function MerchantProfilePage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">My Profile</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
          View and update your merchant account details, business information, and password.
        </p>
      </div>
      <MerchantProfileSection />
    </div>
  );
}
