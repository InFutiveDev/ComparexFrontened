"use client";

import {
  HiClipboardDocumentList,
  HiEnvelope,
  HiUserCircle,
} from "react-icons/hi2";
import { CrmDataTable } from "@/components/dashboard/shared/crm-data-table";
import { DashboardListState, useDashboardList } from "@/hooks/use-dashboard-list";
import { fetchPaymentGateways } from "@/lib/dashboard-api";
import { mapPaymentGatewayListResponse } from "@/lib/dashboard-mappers";

const actionItemClass = "text-[#13203F] hover:bg-slate-50";

function buildPaymentGatewayRowActions(row) {
  const profileHref = `/dashboard/payment-gateways/${encodeURIComponent(row.id)}`;
  const leadsHref = `/dashboard/payment-gateways/${encodeURIComponent(row.id)}/leads`;
  const followUpSubject = encodeURIComponent("Follow up from CompareX");
  const followUpBody = encodeURIComponent(
    `Hi ${row.name || "there"},\n\nWe wanted to follow up regarding your payment gateway onboarding with CompareX.\n\nBest regards,\nCompareX Team`,
  );

  return [
    {
      type: "link",
      label: "View Profile",
      icon: HiUserCircle,
      href: profileHref,
      className: actionItemClass,
      iconClassName: "text-[#2D4CC8]",
    },
    ...(row.email
      ? [
          {
            type: "link",
            label: "Send Follow Up",
            icon: HiEnvelope,
            href: `mailto:${row.email}?subject=${followUpSubject}&body=${followUpBody}`,
            className: actionItemClass,
            iconClassName: "text-[#40C3CF]",
          },
        ]
      : []),
    {
      type: "link",
      label: "View Leads",
      icon: HiClipboardDocumentList,
      href: leadsHref,
      className: actionItemClass,
      iconClassName: "text-[#25a36f]",
    },
  ];
}

const paymentGatewayLabels = {
  search: "Search payment gateways",
  empty: "No payment gateways found",
  filterTitle: "Filter Payment Gateways",
  filterDescription: "Refine payment gateways by status, category, and more",
  upload: "Upload Payment Gateways",
  download: "Download payment gateways",
  assign: "Assign Payment Gateway",
  delete: "Delete Payment Gateway",
};

export function PaymentGatewayTable({
  variant = "overview",
  workTypeFilter = "Payment Gateway",
  listState,
}) {
  const internalListState = useDashboardList(fetchPaymentGateways, mapPaymentGatewayListResponse, {
    enabled: !listState,
  });
  const { data, isLoading, error, reload } = listState ?? internalListState;

  return (
    <DashboardListState
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      emptyMessage="No payment gateways found"
    >
      <CrmDataTable
        data={data}
        variant={variant}
        workTypeFilter={workTypeFilter}
        lockWorkTypeFilter={Boolean(workTypeFilter)}
        labels={paymentGatewayLabels}
        searchType="merchant"
        detailsBasePath="/dashboard/payment-gateways"
        detailsWorkType="Payment Gateway"
        clientColumnLabel="PG Name"
        clientSubtext="email"
        showContactColumn={false}
        showAssigneeColumn={false}
        showConversionRate
        resultLabel="payment gateways"
        getRowActionItems={buildPaymentGatewayRowActions}
      />
    </DashboardListState>
  );
}
