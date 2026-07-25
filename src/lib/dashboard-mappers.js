const defaultRowMeta = {
  status: "New",
  score: 0,
  assignee: "Unassigned",
  assigneeInitials: "—",
  assigneeColor: "#94a3b8",
};

const LEAD_STATUS_LABELS = {
  new: "New",
  in_review: "In Review",
  qualified: "Qualified",
  rejected: "Rejected",
  assigned: "Assigned",
  expert_booked: "Talk to Expert Booked",
};

const MERCHANT_SOURCE_LABELS = {
  merchant: "Website",
  "merchant-portal": "Merchant Portal",
  "pg-affiliate": "PG Affiliate",
  "reseller-affiliate": "Reseller Affiliate",
  "reseller-pg-affiliate": "Reseller + PG Affiliate",
  "bulk-upload": "Bulk Upload",
  "talk-to-expert": "Talk to Expert",
  "pg-compare-detail": "PG Compare Detail",
};

function formatMerchantSource(source) {
  if (!source) return "Website";
  return MERCHANT_SOURCE_LABELS[source] || formatLabel(source);
}

function getInitials(value) {
  const parts = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatLabel(value) {
  if (!value) return "—";
  return String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function mapMerchantToTableRow(item) {
  const leadStatus = item.leadStatus || "new";
  const assignee = item.assignedPgName || "Unassigned";

  return {
    ...defaultRowMeta,
    id: item.id,
    name: item.businessName,
    company: item.businessName,
    email: item.email,
    phone: item.phone,
    source: formatMerchantSource(item.source),
    priority: formatLabel(item.priority),
    leadType: formatLabel(item.priority) || "—",
    category: formatLabel(item.industry),
    workType: "Merchant",
    userId: item.userId ?? null,
    accountStatus: item.accountStatus ?? "inactive",
    lastLoginAt: item.lastLoginAt ?? null,
    createdAt: item.createdAt,
    leadStatus,
    pgLeadStatus: item.pgLeadStatus ?? null,
    assignedPgName: item.assignedPgName ?? null,
    status: LEAD_STATUS_LABELS[leadStatus] || formatLabel(leadStatus),
    assignee,
    assigneeInitials: assignee === "Unassigned" ? "—" : getInitials(assignee),
    assigneeColor: assignee === "Unassigned" ? "#94a3b8" : "#2D4CC8",
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
    qualifiedLead: item.qualifiedLeadCount ?? 0,
    source: item.source || "Reseller Form",
    priority: formatLabel(item.partnershipModel) || formatLabel(item.paymentFamiliarity),
    category: formatLabel(item.partnerType),
    workType: "Reseller",
    userId: item.userId ?? null,
    accountStatus: item.accountStatus ?? "inactive",
    lastLoginAt: item.lastLoginAt ?? null,
    verificationStatus,
    profileCompletionPercent: item.profileCompletionPercent ?? 0,
    createdAt: item.createdAt,
    ...defaultRowMeta,
    status: statusLabel,
  };
}

function formatConversionRate(value) {
  const rate = Number(value);
  if (!Number.isFinite(rate) || rate <= 0) return "0%";
  return `${rate.toFixed(1)}%`;
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
    ...defaultRowMeta,
    id: item.id,
    name: item.companyName || item.contactPerson,
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
    lastLoginAt: item.lastLoginAt ?? null,
    createdAt: item.createdAt,
    verificationStatus,
    profileCompletionPercent: item.profileCompletionPercent ?? 0,
    ratingAverage: item.rating?.count > 0 ? Number(item.rating.average).toFixed(1) : "—",
    ratingCount: item.rating?.count ?? 0,
    acceptedLeadCount: item.acceptedLeadCount ?? 0,
    onboardedLeadCount: item.onboardedLeadCount ?? 0,
    conversionRate: item.conversionRate ?? 0,
    conversionRateLabel: formatConversionRate(item.conversionRate ?? 0),
    status: statusLabel,
  };
}

function formatSupportStatus(status) {
  const labels = {
    new: "New",
    in_progress: "In Progress",
    resolved: "Resolved",
    escalated: "Escalated",
  };

  return labels[status] || "New";
}

export function mapMerchantSupportToTableRow(item) {
  const supportStatus = item.status ?? "new";

  return {
    ...defaultRowMeta,
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
    issueCategory: item.issueCategory || "—",
    paymentGateway: item.paymentGateway || "—",
    supportStatus,
    escalatedPgName: item.escalatedPgName ?? null,
    status: formatSupportStatus(supportStatus),
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
  const assigneeName = item.assignee?.trim() || "Unassigned";
  const expertStatus = item.status ?? "new";

  return {
    ...defaultRowMeta,
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
    paymentGatewayId: item.paymentGatewayId ?? null,
    paymentGatewayName: item.paymentGatewayName ?? null,
    expertId: item.expertId ?? null,
    adminNotes: item.adminNotes ?? "",
    verificationStatus: expertStatus,
    expertStatus,
    assignee: assigneeName,
    assigneeInitials: assigneeName === "Unassigned" ? "—" : getInitials(assigneeName),
    assigneeColor: assigneeName === "Unassigned" ? "#94a3b8" : "#2D4CC8",
    status:
      expertStatus === "qualified"
        ? "Qualified"
        : expertStatus === "new"
          ? "New"
          : expertStatus === "contacted"
            ? "Contacted"
            : expertStatus === "completed"
              ? "Completed"
              : expertStatus === "cancelled"
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

function isOnboardingMerchant(row) {
  if (row.leadStatus === "rejected" || row.pgLeadStatus === "rejected") {
    return false;
  }

  if (row.pgLeadStatus === "live") {
    return false;
  }

  if (row.pgLeadStatus === "pending") {
    return true;
  }

  return ["assigned", "qualified", "in_review"].includes(row.leadStatus);
}

function isDroppedMerchant(row) {
  return row.leadStatus === "rejected" || row.pgLeadStatus === "rejected";
}

export function computeMerchantStats(rows = []) {
  return {
    total: rows.length,
    onboarding: rows.filter(isOnboardingMerchant).length,
    dropped: rows.filter(isDroppedMerchant).length,
    active: rows.filter((row) => row.accountStatus === "active").length,
    inactive: rows.filter((row) => row.accountStatus !== "active").length,
  };
}

export function buildMerchantStatsCards(currentRows = [], previousRows = []) {
  const current = computeMerchantStats(currentRows);
  const previous = computeMerchantStats(previousRows);

  const metrics = [
    { key: "total", label: "Total Merchant", cardClass: "from-[#EEF2FC] to-[#f5f8ff]" },
    {
      key: "onboarding",
      label: "Onboarding Merchant",
      cardClass: "from-[#ecfdf9] to-[#f2fcfa]",
    },
    {
      key: "dropped",
      label: "Dropped Merchant",
      cardClass: "from-[#fff1f2] to-[#fff7f8]",
    },
    { key: "active", label: "Active", cardClass: "from-[#ecfdf5] to-[#f3fdf8]" },
    {
      key: "inactive",
      label: "Inactive Merchant",
      cardClass: "from-[#f8fafc] to-[#f1f5f9]",
    },
  ];

  return metrics.map(({ key, label, cardClass }) => {
    const trend = calculatePercentChange(current[key], previous[key]);

    return {
      label,
      value: String(current[key]),
      trend: formatPercentTrend(trend),
      trendDirection: trend.direction,
      previousLabel: "vs previous period",
      previousValue: String(previous[key]),
      cardClass,
    };
  });
}

function calculatePercentChange(current, previous) {
  if (previous === 0) {
    if (current === 0) {
      return { change: 0, direction: "neutral" };
    }

    return { change: 100, direction: "up" };
  }

  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change * 10) / 10;

  return {
    change: rounded,
    direction: rounded > 0 ? "up" : rounded < 0 ? "down" : "neutral",
  };
}

function formatPercentTrend({ change, direction }) {
  if (direction === "neutral") return "0%";
  const sign = direction === "up" ? "+" : "";
  return `${sign}${change}%`;
}

function getRangeDayCount(range) {
  if (range === "Today") return 1;
  return { Week: 7, Month: 30, "3 Months": 90 }[range] ?? null;
}

export function getMerchantTimeRangeBounds(range) {
  const now = new Date();

  if (range === "Today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { start, end: now };
  }

  const days = getRangeDayCount(range);
  if (!days) return null;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  return { start, end: now };
}

export function getMerchantPreviousTimeRangeBounds(range) {
  const now = new Date();

  if (range === "Today") {
    const end = new Date(now);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);

    const start = new Date(end);
    start.setHours(0, 0, 0, 0);

    return { start, end };
  }

  const days = getRangeDayCount(range);
  if (!days) return null;

  const currentStart = getMerchantTimeRangeBounds(range)?.start;
  if (!currentStart) return null;

  const end = new Date(currentStart);
  end.setMilliseconds(end.getMilliseconds() - 1);

  const start = new Date(end);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  return { start, end };
}

export function filterMerchantsByDateRange(rows = [], start, end) {
  if (!start || !end) return rows;

  return rows.filter((row) => {
    if (!row.createdAt) return false;

    const created = new Date(row.createdAt);
    if (Number.isNaN(created.getTime())) return false;

    return created >= start && created <= end;
  });
}

export function getMerchantTimeRangeStart(range) {
  return getMerchantTimeRangeBounds(range)?.start ?? null;
}

export function filterMerchantsByTimeRange(rows = [], range) {
  const bounds = getMerchantTimeRangeBounds(range);
  if (!bounds) return rows;

  return filterMerchantsByDateRange(rows, bounds.start, bounds.end);
}

export function buildMerchantStatsCardsForRange(rows = [], range) {
  const currentBounds = getMerchantTimeRangeBounds(range);
  const previousBounds = getMerchantPreviousTimeRangeBounds(range);

  const currentRows = filterMerchantsByDateRange(
    rows,
    currentBounds?.start,
    currentBounds?.end,
  );
  const previousRows = filterMerchantsByDateRange(
    rows,
    previousBounds?.start,
    previousBounds?.end,
  );

  return buildMerchantStatsCards(currentRows, previousRows);
}

function formatResellerRevenue(amount) {
  const value = Number(amount) || 0;
  if (value <= 0) return "₹0";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function computeResellerStats(rows = [], totalGmv = 0) {
  const total = rows.length;
  const active = rows.filter((row) => row.accountStatus === "active").length;
  const inactive = rows.filter((row) => row.accountStatus !== "active").length;
  const averageRevenue = total > 0 ? totalGmv / total : 0;

  return { total, active, inactive, averageRevenue, partnerRevenue: totalGmv };
}

export function buildResellerStatsCards(
  currentRows = [],
  previousRows = [],
  currentGmv = 0,
  previousGmv = 0,
) {
  const current = computeResellerStats(currentRows, currentGmv);
  const previous = computeResellerStats(previousRows, previousGmv);

  const metrics = [
    { key: "total", label: "Total Reseller", cardClass: "from-[#EEF2FC] to-[#f5f8ff]" },
    { key: "active", label: "Total Active", cardClass: "from-[#ecfdf9] to-[#f2fcfa]" },
    { key: "inactive", label: "Total Inactive", cardClass: "from-[#ecfdf5] to-[#f3fdf8]" },
    {
      key: "averageRevenue",
      label: "Average Revenue/Reseller",
      cardClass: "from-[#eef0f8] to-[#f6f7fc]",
    },
    {
      key: "partnerRevenue",
      label: "Total Partner Revenue",
      cardClass: "from-[#f5f3ff] to-[#faf8ff]",
    },
  ];

  return metrics.map(({ key, label, cardClass }) => {
    const trend = calculatePercentChange(current[key], previous[key]);
    const formatValue =
      key === "averageRevenue" || key === "partnerRevenue"
        ? formatResellerRevenue
        : (value) => String(value);

    return {
      label,
      value: formatValue(current[key]),
      trend: formatPercentTrend(trend),
      trendDirection: trend.direction,
      previousLabel: "vs previous period",
      previousValue: formatValue(previous[key]),
      cardClass,
    };
  });
}

export function computePaymentGatewayStats(rows = []) {
  return {
    total: rows.length,
    active: rows.filter((row) => row.accountStatus === "active").length,
    applications: rows.filter((row) =>
      ["pending_review", "incomplete"].includes(row.verificationStatus),
    ).length,
    onboardings: rows.reduce((sum, row) => sum + (row.onboardedLeadCount ?? 0), 0),
  };
}

export function buildPaymentGatewayStatsCards(currentRows = [], previousRows = []) {
  const current = computePaymentGatewayStats(currentRows);
  const previous = computePaymentGatewayStats(previousRows);

  const metrics = [
    {
      key: "active",
      label: "Total Active PG Partners",
      cardClass: "from-[#ecfdf9] to-[#f2fcfa]",
    },
    {
      key: "applications",
      label: "Total PG Applications",
      cardClass: "from-[#ecfdf5] to-[#f3fdf8]",
    },
    {
      key: "total",
      label: "Total Payment Gateways",
      cardClass: "from-[#EEF2FC] to-[#f5f8ff]",
    },
    {
      key: "onboardings",
      label: "PG Merchant Onboardings",
      cardClass: "from-[#eef0f8] to-[#f6f7fc]",
    },
  ];

  return metrics.map(({ key, label, cardClass }) => {
    const trend = calculatePercentChange(current[key], previous[key]);

    return {
      label,
      value: String(current[key]),
      trend: formatPercentTrend(trend),
      trendDirection: trend.direction,
      previousLabel: "vs previous period",
      previousValue: String(previous[key]),
      cardClass,
    };
  });
}

export function buildPaymentGatewayStatsCardsForRange(rows = [], range) {
  const currentBounds = getMerchantTimeRangeBounds(range);
  const previousBounds = getMerchantPreviousTimeRangeBounds(range);

  const currentRows = filterMerchantsByDateRange(
    rows,
    currentBounds?.start,
    currentBounds?.end,
  );
  const previousRows = filterMerchantsByDateRange(
    rows,
    previousBounds?.start,
    previousBounds?.end,
  );

  return buildPaymentGatewayStatsCards(currentRows, previousRows);
}

function hasSupportAttachments(row) {
  return Array.isArray(row.attachments) && row.attachments.length > 0;
}

function getSupportIssueCategory(row) {
  return row.issueCategory || row.category || "";
}

export function computeMerchantSupportStats(rows = []) {
  return {
    total: rows.length,
    onboarding: rows.filter((row) => getSupportIssueCategory(row) === "Onboarding Delay").length,
    withAttachments: rows.filter(hasSupportAttachments).length,
    settlement: rows.filter(
      (row) => getSupportIssueCategory(row) === "Settlement & Reconciliation Query",
    ).length,
  };
}

export function buildMerchantSupportStatsCards(currentRows = [], previousRows = []) {
  const current = computeMerchantSupportStats(currentRows);
  const previous = computeMerchantSupportStats(previousRows);

  const metrics = [
    {
      key: "total",
      label: "Total Form Submissions",
      cardClass: "from-[#EEF2FC] to-[#f5f8ff]",
    },
    {
      key: "onboarding",
      label: "Onboarding Issues",
      cardClass: "from-[#ecfdf9] to-[#f2fcfa]",
    },
    {
      key: "withAttachments",
      label: "With Attachments",
      cardClass: "from-[#ecfdf5] to-[#f3fdf8]",
    },
    {
      key: "settlement",
      label: "Settlement Queries",
      cardClass: "from-[#eef0f8] to-[#f6f7fc]",
    },
  ];

  return metrics.map(({ key, label, cardClass }) => {
    const trend = calculatePercentChange(current[key], previous[key]);

    return {
      label,
      value: String(current[key]),
      trend: formatPercentTrend(trend),
      trendDirection: trend.direction,
      previousLabel: "vs previous period",
      previousValue: String(previous[key]),
      cardClass,
    };
  });
}

export function buildMerchantSupportStatsCardsForRange(rows = [], range) {
  const currentBounds = getMerchantTimeRangeBounds(range);
  const previousBounds = getMerchantPreviousTimeRangeBounds(range);

  const currentRows = filterMerchantsByDateRange(
    rows,
    currentBounds?.start,
    currentBounds?.end,
  );
  const previousRows = filterMerchantsByDateRange(
    rows,
    previousBounds?.start,
    previousBounds?.end,
  );

  return buildMerchantSupportStatsCards(currentRows, previousRows);
}

export function computeExpertBookingStats(rows = []) {
  return {
    total: rows.length,
    new: rows.filter((row) => row.expertStatus === "new").length,
    qualified: rows.filter((row) => row.expertStatus === "qualified").length,
    completed: rows.filter((row) => row.expertStatus === "completed").length,
    calendly: rows.filter((row) => row.bookingSource === "calendly").length,
  };
}

export function buildExpertBookingStatsCards(currentRows = [], previousRows = []) {
  const current = computeExpertBookingStats(currentRows);
  const previous = computeExpertBookingStats(previousRows);

  const metrics = [
    {
      key: "total",
      label: "Total Bookings",
      cardClass: "from-[#EEF2FC] to-[#f5f8ff]",
    },
    {
      key: "qualified",
      label: "Qualified Leads",
      cardClass: "from-[#ecfdf9] to-[#f2fcfa]",
    },
    {
      key: "completed",
      label: "Completed Calls",
      cardClass: "from-[#ecfdf5] to-[#f3fdf8]",
    },
    {
      key: "calendly",
      label: "Calendly Bookings",
      cardClass: "from-[#eef0f8] to-[#f6f7fc]",
    },
  ];

  return metrics.map(({ key, label, cardClass }) => {
    const trend = calculatePercentChange(current[key], previous[key]);

    return {
      label,
      value: String(current[key]),
      trend: formatPercentTrend(trend),
      trendDirection: trend.direction,
      previousLabel: "vs previous period",
      previousValue: String(previous[key]),
      cardClass,
    };
  });
}

export function buildExpertBookingStatsCardsForRange(rows = [], range) {
  const currentBounds = getMerchantTimeRangeBounds(range);
  const previousBounds = getMerchantPreviousTimeRangeBounds(range);

  const currentRows = filterMerchantsByDateRange(
    rows,
    currentBounds?.start,
    currentBounds?.end,
  );
  const previousRows = filterMerchantsByDateRange(
    rows,
    previousBounds?.start,
    previousBounds?.end,
  );

  return buildExpertBookingStatsCards(currentRows, previousRows);
}

export function buildResellerStatsCardsForRange(
  rows = [],
  range,
  { currentGmv = 0, previousGmv = 0 } = {},
) {
  const currentBounds = getMerchantTimeRangeBounds(range);
  const previousBounds = getMerchantPreviousTimeRangeBounds(range);

  const currentRows = filterMerchantsByDateRange(
    rows,
    currentBounds?.start,
    currentBounds?.end,
  );
  const previousRows = filterMerchantsByDateRange(
    rows,
    previousBounds?.start,
    previousBounds?.end,
  );

  return buildResellerStatsCards(currentRows, previousRows, currentGmv, previousGmv);
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
  const isWebsite = item.reviewType === "comparex_website";
  const reviewStatus = item.status ?? "pending";

  return {
    ...defaultRowMeta,
    id: item.id,
    name: item.name,
    company: isWebsite ? "CompareX Website" : item.businessName,
    email: item.email,
    phone: isWebsite ? "Website feedback" : item.productName || "—",
    source: item.source || "Write a Review",
    priority: `${item.rating || 0}/5`,
    category: isWebsite ? "CompareX Website" : item.productName || formatLabel(item.productCategory),
    workType: "Reviews & Ratings",
    reviewType: item.reviewType || "pg_review",
    reviewStatus,
    rating: Number(item.rating) || 0,
    platformRating:
      item.platformRating === null || item.platformRating === undefined
        ? null
        : Number(item.platformRating) || 0,
    productName: isWebsite ? "CompareX Website" : item.productName || "—",
    submittedAt: item.createdAt,
    createdAt: item.createdAt,
    title: item.title,
    reviewText: item.reviewText,
    suggestionNotes: item.suggestionNotes || item.reviewText,
    status:
      reviewStatus === "published"
        ? "Published"
        : reviewStatus === "rejected"
          ? "Rejected"
          : reviewStatus === "hidden"
            ? "Hidden"
            : "Pending",
  };
}

function isValidStarRating(value) {
  const rating = Number(value);
  return Number.isFinite(rating) && rating >= 1 && rating <= 5;
}

function averageRating(values = []) {
  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round((total / values.length) * 10) / 10;
}

function formatReviewRatingValue(value) {
  if (!value || value <= 0) return "0/5";
  return `${value.toFixed(1)}/5`;
}

function isPgReviewRow(row) {
  return row.reviewType !== "comparex_website";
}

function getReviewPgRating(row) {
  return isPgReviewRow(row) && isValidStarRating(row.rating) ? Number(row.rating) : null;
}

function getReviewComparexRating(row) {
  if (row.reviewType === "comparex_website") {
    return isValidStarRating(row.rating) ? Number(row.rating) : null;
  }

  if (isValidStarRating(row.platformRating)) {
    return Number(row.platformRating);
  }

  return null;
}

function buildPgRatingSummaries(rows = []) {
  const summaries = new Map();

  rows.forEach((row) => {
    const rating = getReviewPgRating(row);
    if (rating == null) return;

    const name = row.productName?.trim() || row.category?.trim() || "Unknown PG";
    const current = summaries.get(name) || { name, ratings: [] };
    current.ratings.push(rating);
    summaries.set(name, current);
  });

  return [...summaries.values()].map(({ name, ratings }) => ({
    name,
    average: averageRating(ratings),
    count: ratings.length,
  }));
}

function pickTopRatedPg(summaries = []) {
  if (!summaries.length) {
    return { name: "—", average: 0 };
  }

  return [...summaries].sort(
    (left, right) => right.average - left.average || right.count - left.count,
  )[0];
}

function pickLowRatedPg(summaries = []) {
  if (!summaries.length) {
    return { name: "—", average: 0 };
  }

  return [...summaries].sort(
    (left, right) => left.average - right.average || right.count - left.count,
  )[0];
}

function formatTopPgValue(entry) {
  if (!entry?.name || entry.name === "—" || entry.average <= 0) return "—";
  return entry.name;
}

export function computeReviewStats(rows = []) {
  const pgRatings = rows.map(getReviewPgRating).filter((rating) => rating != null);
  const comparexRatings = rows.map(getReviewComparexRating).filter((rating) => rating != null);
  const pgSummaries = buildPgRatingSummaries(rows);
  const topPg = pickTopRatedPg(pgSummaries);
  const lowPg = pickLowRatedPg(pgSummaries);

  return {
    total: rows.length,
    avgPgRating: averageRating(pgRatings),
    avgComparexRating: averageRating(comparexRatings),
    topPgName: topPg.name,
    topPgRating: topPg.average,
    lowPgName: lowPg.name,
    lowPgRating: lowPg.average,
  };
}

export function buildReviewStatsCards(currentRows = [], previousRows = []) {
  const current = computeReviewStats(currentRows);
  const previous = computeReviewStats(previousRows);

  const metrics = [
    {
      key: "total",
      label: "Total Reviews",
      cardClass: "from-[#EEF2FC] to-[#f5f8ff]",
      getValue: () => String(current.total),
      getPreviousValue: () => String(previous.total),
      getTrend: () => calculatePercentChange(current.total, previous.total),
    },
    {
      key: "avgPgRating",
      label: "Average PG Rating",
      cardClass: "from-[#ecfdf9] to-[#f2fcfa]",
      getValue: () => formatReviewRatingValue(current.avgPgRating),
      getPreviousValue: () => formatReviewRatingValue(previous.avgPgRating),
      getTrend: () => calculatePercentChange(current.avgPgRating, previous.avgPgRating),
    },
    {
      key: "avgComparexRating",
      label: "Average CompareX Rating",
      cardClass: "from-[#ecfdf5] to-[#f3fdf8]",
      getValue: () => formatReviewRatingValue(current.avgComparexRating),
      getPreviousValue: () => formatReviewRatingValue(previous.avgComparexRating),
      getTrend: () =>
        calculatePercentChange(current.avgComparexRating, previous.avgComparexRating),
    },
    {
      key: "topPg",
      label: "Top Rated PG",
      cardClass: "from-[#eef0f8] to-[#f6f7fc]",
      getValue: () => formatTopPgValue({ name: current.topPgName, average: current.topPgRating }),
      getPreviousValue: () =>
        previous.topPgName === "—"
          ? "—"
          : `${previous.topPgName} · ${formatReviewRatingValue(previous.topPgRating)}`,
      getTrend: () => ({ change: 0, direction: "neutral" }),
      previousLabel: "Previous top PG",
      subtitle:
        current.topPgName !== "—" && current.topPgRating > 0
          ? `${formatReviewRatingValue(current.topPgRating)} average`
          : null,
    },
    {
      key: "lowPg",
      label: "Low Rated PG",
      cardClass: "from-[#fff7ed] to-[#fffaf5]",
      getValue: () => formatTopPgValue({ name: current.lowPgName, average: current.lowPgRating }),
      getPreviousValue: () =>
        previous.lowPgName === "—"
          ? "—"
          : `${previous.lowPgName} · ${formatReviewRatingValue(previous.lowPgRating)}`,
      getTrend: () => ({ change: 0, direction: "neutral" }),
      previousLabel: "Previous low PG",
      subtitle:
        current.lowPgName !== "—" && current.lowPgRating > 0
          ? `${formatReviewRatingValue(current.lowPgRating)} average`
          : null,
    },
  ];

  return metrics.map(({ key, label, cardClass, getValue, getPreviousValue, getTrend, previousLabel, subtitle }) => {
    const trend = getTrend();

    return {
      key,
      label,
      value: getValue(),
      trend: formatPercentTrend(trend),
      trendDirection: trend.direction,
      previousLabel: previousLabel || "vs previous period",
      previousValue: getPreviousValue(),
      subtitle: subtitle || null,
      cardClass,
    };
  });
}

export function buildReviewStatsCardsForRange(rows = [], range) {
  const currentBounds = getMerchantTimeRangeBounds(range);
  const previousBounds = getMerchantPreviousTimeRangeBounds(range);

  const currentRows = filterMerchantsByDateRange(
    rows,
    currentBounds?.start,
    currentBounds?.end,
  );
  const previousRows = filterMerchantsByDateRange(
    rows,
    previousBounds?.start,
    previousBounds?.end,
  );

  return buildReviewStatsCards(currentRows, previousRows);
}

export function mapReviewListResponse(response) {
  return {
    rows: (response.reviews ?? []).map(mapReviewToTableRow),
    total: response.total ?? 0,
  };
}
