import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";
import PgDetails from "@/components/website/compare-pg/pg-details";
import { isKnownPgSlug } from "@/lib/pg-slug";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = await params;

  if (!isKnownPgSlug(slug)) {
    notFound();
  }

  return (
    <MarketingPageShell>
      <PgDetails slug={slug} />
    </MarketingPageShell>
  );
}
