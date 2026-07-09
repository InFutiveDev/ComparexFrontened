const defaultRowMeta = {
  status: "New",
  score: 0,
  assignee: "Unassigned",
  assigneeInitials: "—",
  assigneeColor: "#94a3b8",
};

function formatLabel(value) {
  if (!value) return "—";
  return String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function mapMerchantToTableRow(item) {
  return {
    id: item.id,
    name: item.businessName,
    company: item.businessName,
    email: item.email,
    phone: item.phone,
    source: item.source || "Website",
    priority: formatLabel(item.priority),
    category: formatLabel(item.industry),
    workType: "Merchant",
    userId: item.userId ?? null,
    accountStatus: item.accountStatus ?? "inactive",
    createdAt: item.createdAt,
    ...defaultRowMeta,
  };
}

export function mapResellerToTableRow(item) {
  return {
    id: item.id,
    name: item.fullName,
    company: item.businessName,
    email: item.email,
    phone: item.phone,
    source: item.source || "Reseller Form",
    priority: formatLabel(item.paymentFamiliarity),
    category: formatLabel(item.partnerType),
    workType: "Reseller",
    userId: item.userId ?? null,
    accountStatus: item.accountStatus ?? "inactive",
    createdAt: item.createdAt,
    ...defaultRowMeta,
  };
}

export function mapPaymentGatewayToTableRow(item) {
  return {
    id: item.id,
    name: item.contactPerson,
    company: item.companyName,
    email: item.email,
    phone: item.phone,
    source: item.source || "Payment Form",
    priority: item.partnershipGoals?.[0] ? formatLabel(item.partnershipGoals[0]) : "—",
    category: item.paymentCapabilities?.[0] ? formatLabel(item.paymentCapabilities[0]) : "Payment Provider",
    workType: "Payment Gateway",
    userId: item.userId ?? null,
    accountStatus: item.accountStatus ?? "inactive",
    createdAt: item.createdAt,
    ...defaultRowMeta,
  };
}

export function mapMerchantSupportToTableRow(item) {
  return {
    id: item.id,
    name: item.businessName,
    company: item.businessName,
    email: item.businessEmail,
    phone: item.contactNumber,
    source: item.source || "Merchant Support Desk",
    priority: item.paymentGateway || "—",
    category: item.issueCategory || "—",
    workType: "Merchant Support",
    submittedAt: item.createdAt,
    createdAt: item.createdAt,
    issueDescription: item.issueDescription,
    website: item.website,
    attachments: item.attachments ?? [],
    ...defaultRowMeta,
  };
}

export function mapMerchantListResponse(response) {
  return {
    rows: (response.merchantGateways ?? []).map(mapMerchantToTableRow),
    total: response.total ?? 0,
  };
}

export function mapResellerListResponse(response) {
  return {
    rows: (response.resellers ?? []).map(mapResellerToTableRow),
    total: response.total ?? 0,
  };
}

export function mapPaymentGatewayListResponse(response) {
  return {
    rows: (response.paymentGateways ?? []).map(mapPaymentGatewayToTableRow),
    total: response.total ?? 0,
  };
}

export function mapMerchantSupportListResponse(response) {
  return {
    rows: (response.merchantSupport ?? []).map(mapMerchantSupportToTableRow),
    total: response.total ?? 0,
  };
}
