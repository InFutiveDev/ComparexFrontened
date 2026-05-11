import { SiteFooter } from "@/components/website/site-footer";
import { SiteHeader } from "@/components/website/site-header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">Contact</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Need a custom setup? Reach us and we will help you launch fast.</p>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-700">Email: hello@comparex.io</p>
          <p className="mt-2 text-sm text-slate-700">Phone: +91 90000 00000</p>
          <p className="mt-2 text-sm text-slate-700">Address: Bengaluru, India</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
