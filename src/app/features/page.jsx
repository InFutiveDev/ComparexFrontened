import { SiteFooter } from "@/components/website/site-footer";
import { SiteHeader } from "@/components/website/site-header";
import { websiteFeatures } from "@/lib/mock-data";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">Features</h1>
        <p className="mt-3 max-w-2xl text-slate-600">All essential capabilities to run a modern lead-focused workflow.</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {websiteFeatures.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
