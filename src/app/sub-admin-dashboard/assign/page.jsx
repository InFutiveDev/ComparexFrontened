import { LeadsTableSection } from "@/components/sub-admin/leads-table";

export default function SubAdminAssignPage() {
  return (
    <LeadsTableSection
      title="Lead Assignment"
      description="FR-SA-04 · Open a qualified lead to assign a payment gateway or book Talk to Expert. Filter by category, location, and PG performance on the lead detail page."
      defaultStatus="qualified"
      showAssignCta={false}
    />
  );
}
