import { ResellerProfileCompletion } from "@/components/portal/reseller-profile-completion";

export default function ResellerProfilePage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Complete your registration
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
          Finish the pending questions below. Once required sections are done, CompareX admin will
          verify and approve your reseller account.
        </p>
      </div>
      <ResellerProfileCompletion />
    </div>
  );
}
