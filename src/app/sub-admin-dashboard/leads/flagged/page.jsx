import { LeadsTableSection } from "@/components/sub-admin/leads-table";

export default function SubAdminFlaggedLeadsPage() {
  return (
    <LeadsTableSection
      title="Flagged for Review"
      description="Leads flagged by Admin or Sub Admin for follow-up. Shared queue for all sub users — open a lead to qualify, assign, or add notes."
      defaultFlaggedOnly
      showAssignCta={false}
    />
  );
}
