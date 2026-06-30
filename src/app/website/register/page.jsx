import { RegisterFormSection } from "@/components/website/register/register-form";
import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";

export default function Page() {
  return (
    <MarketingPageShell>
      <RegisterFormSection />
    </MarketingPageShell>
  );
}
