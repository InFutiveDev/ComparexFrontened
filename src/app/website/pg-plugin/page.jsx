import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import PgPluginHero from "@/components/website/pg-plugin/hero";
import { PgPluginFinder } from "@/components/website/pg-plugin/pg-plugin-finder";

export default function PgPluginPage() {
  return (
    <MarketingPageShell>
      <PgPluginHero />
      <PgPluginFinder />
    </MarketingPageShell>
  );
}