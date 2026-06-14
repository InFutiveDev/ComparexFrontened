import { SiteFooter } from "@/components/website/layout/site-footer";
import { SiteHeader } from "@/components/website/layout/site-header";

export function MarketingPageShell({ children, mainClassName = "", suppressHydrationWarning = false }) {
  return (
    <div className="min-h-screen bg-slate-50" suppressHydrationWarning={suppressHydrationWarning || undefined}>
      <SiteHeader />
      <main className={mainClassName}>{children}</main>
      <SiteFooter />
    </div>
  );
}
