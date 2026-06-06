import { SiteFooter } from "@/components/website/site-footer";
import { SiteHeader } from "@/components/website/site-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">About Comparex</h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
          Comparex helps teams run a clean lead lifecycle from first touch to conversion. This UI is built modern
          website plus responsive admin dashboard foundation using mock data.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
