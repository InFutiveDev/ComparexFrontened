import { SiteFooter } from "@/components/website/layout/site-footer";
import { SiteHeader } from "@/components/website/layout/site-header";
import { TalkToExpertProvider } from "@/components/website/talk-to-expert/talk-to-expert-provider";

export function MarketingPageShell({ children, mainClassName = "", suppressHydrationWarning = false }) {
  return (
    <TalkToExpertProvider>
      <div className="min-h-screen overflow-x-hidden bg-slate-50" suppressHydrationWarning={suppressHydrationWarning || undefined}>
        <SiteHeader />
        <main className={`min-w-0 ${mainClassName}`}>{children}</main>
        <SiteFooter />
      </div>
    </TalkToExpertProvider>
  );
}
