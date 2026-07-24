import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import PgDetails from "@/components/website/compare-pg/pg-details";

export default async function Page({ params }) {
  const { slug } = await params;

  return (
    <MarketingPageShell>
      <PgDetails slug={slug} />
    </MarketingPageShell>
  );
}
