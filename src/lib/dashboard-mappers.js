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
  const verificationStatus = item.verificationStatus || "incomplete";
  const statusLabel =
    verificationStatus === "pending_review"
      ? "Pending Review"
      : verificationStatus === "approved"
        ? "Approved"
        : verificationStatus === "rejected"
          ? "Rejected"
          : "Incomplete";

  return {
    id: item.id,
    name: item.fullName,
    company: item.businessName,
    email: item.email,
    phone: item.phone,
    source: item.source || "Reseller Form",
    priority: formatLabel(item.partnershipModel) || formatLabel(item.paymentFamiliarity),
    category: formatLabel(item.partnerType),
    workType: "Reseller",
    userId: item.userId ?? null,
    accountStatus: item.accountStatus ?? "inactive",
    verificationStatus,
    profileCompletionPercent: item.profileCompletionPercent ?? 0,
    createdAt: item.createdAt,
    ...defaultRowMeta,
    status: statusLabel,
  };
}

export function mapPaymentGatewayToTableRow(item) {
  const verificationStatus = item.verificationStatus || "incomplete";
  const statusLabel =
    verificationStatus === "pending_review"
      ? "Pending Review"
      : verificationStatus === "approved"
        ? "Approved"
        : verificationStatus === "rejected"
          ? "Rejected"
          : "Incomplete";

  return {
    id: item.id,
    name: item.contactPerson,
    company: item.companyName,
    email: item.email,
    phone: item.phone,
    source: item.source || "Payment Form",
    priority: item.partnershipGoals?.[0] ? formatLabel(item.partnershipGoals[0]) : "—",
    category: item.paymentCapabilities?.[0]
      ? formatLabel(item.paymentCapabilities[0])
      : "Payment Provider",
    workType: "Payment Gateway",
    userId: item.userId ?? null,
    accountStatus: item.accountStatus ?? "inactive",
    createdAt: item.createdAt,
    verificationStatus,
    ...defaultRowMeta,
    status: statusLabel,
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

export function mapExpertBookingToTableRow(item) {
  const isCalendly = item.bookingSource === "calendly" || Boolean(item.calendlyEventUri);
  const hasRealDate =
    item.slotDateLabel &&
    !["scheduled via calendly", "see calendly confirmation"].includes(
      String(item.slotDateLabel).trim().toLowerCase(),
    );
  const slotSummary = hasRealDate
    ? [item.slotDateLabel, item.slotTime].filter(Boolean).join(" · ")
    : isCalendly
      ? "Calendly"
      : null;

  const gateway = item.paymentGatewayName || formatLabel(item.industry);

  return {
    id: item.id,
    name: item.fullName,
    company: item.businessName,
    email: item.email,
    phone: item.phone,
    source: item.source || "Talk to Expert",
    priority: formatLabel(item.priority),
    category: [gateway, slotSummary].filter(Boolean).join(" · "),
    workType: "Talk to Expert",
    submittedAt: item.createdAt,
    createdAt: item.createdAt,
    slotDateLabel: item.slotDateLabel,
    slotTime: item.slotTime,
    bookingSource: item.bookingSource || (isCalendly ? "calendly" : "manual"),
    representativeName: item.representativeName,
    verificationStatus: item.status,
    ...defaultRowMeta,
    status:
      item.status === "new"
        ? "New"
        : item.status === "contacted"
          ? "Contacted"
          : item.status === "completed"
            ? "Completed"
            : item.status === "cancelled"
              ? "Cancelled"
              : "New",
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

export function mapExpertBookingListResponse(response) {
  return {
    rows: (response.expertBookings ?? []).map(mapExpertBookingToTableRow),
    total: response.total ?? 0,
  };
}

export function mapReviewToTableRow(item) {
  return {
    id: item.id,
    name: item.name,
    company: item.businessName,
    email: item.email,
    phone: item.productName || "—",
    source: item.source || "Write a Review",
    priority: `${item.rating || 0}/5`,
    category: item.productName || formatLabel(item.productCategory),
    workType: "Reviews & Ratings",
    submittedAt: item.createdAt,
    createdAt: item.createdAt,
    title: item.title,
    reviewText: item.reviewText,
    ...defaultRowMeta,
    status:
      item.status === "published"
        ? "Published"
        : item.status === "rejected"
          ? "Rejected"
          : item.status === "hidden"
            ? "Hidden"
            : "Pending",
  };
}

export function mapReviewListResponse(response) {
  return {
    rows: (response.reviews ?? []).map(mapReviewToTableRow),
    total: response.total ?? 0,
  };
}
