import { LoginFormSection } from "@/components/website/login/login-form";
import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";

export default function Page() {
  return (
    <MarketingPageShell>
      <LoginFormSection />
    </MarketingPageShell>
  );
}
