import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import HeroSection from "@/components/website/contact/hero-section";
import ContactForm from "@/components/website/contact/contact-form";
export default function Page() {
  return (
    <MarketingPageShell>
      <HeroSection />
      <ContactForm />
    </MarketingPageShell>
  );
}
