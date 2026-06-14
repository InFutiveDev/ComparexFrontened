import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import { pricingPlans } from "@/lib/mock-data";

export default function Page() {
  return (
    <MarketingPageShell mainClassName="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Pricing</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Transparent plans for teams at every growth stage.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <article key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-2 text-2xl font-bold text-indigo-600">{plan.price}</p>
            <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {plan.features.map((feature) => (
                <li key={feature}>- {feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </MarketingPageShell>
  );
}
