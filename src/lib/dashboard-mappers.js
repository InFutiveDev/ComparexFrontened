const defaultRowMeta = {
  status: "New",
  score: 0,
  assignee: "Unassigned",
  assigneeInitials: "—",
  assigneeColor: "#94a3b8",
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

function formatResellerCommissionType(partnershipModel) {
  if (partnershipModel === "revenue-sharing") return "Revenue";
  if (partnershipModel === "qualified-opportunity-fee") return "Per Lead";
  return "—";
}

export function isTalkToExpertMerchantLead(item = {}) {
  const source = item.sourceKey || item.source;
  return (
    source === "talk-to-expert" ||
    source === "Talk to Expert" ||
    item.leadStatus === "expert_booked" ||
    Boolean(item.expertBookingId)
  );
}

/** Live API may not allow leadStatus=demo_ready yet — persist via notes marker. */
export const DEMO_READY_MARKER = "[pipeline:demo_ready]";

export function hasDemoReadyMarker(notes = "") {
  return String(notes).includes(DEMO_READY_MARKER);
}

export function stripDemoReadyMarker(notes = "") {
  return String(notes)
    .replace(/\[pipeline:demo_ready\]\s*/gi, "")
    .trim();
}

export function withDemoReadyMarker(notes = "") {
  const cleaned = stripDemoReadyMarker(notes);
  return cleaned ? `${DEMO_READY_MARKER}\n${cleaned}` : DEMO_READY_MARKER;
}

export function isMerchantDemoReady(item = {}) {
  return item.leadStatus === "demo_ready" || hasDemoReadyMarker(item.qualificationNotes);
}

/** Admin merchant list status: Raw / Talk to Expert by default, else Qualified / Demo ready. */
export function formatMerchantListStatus(item = {}) {
  const leadStatus = item.leadStatus || "new";

  if (leadStatus === "qualified") return "Qualified";
  if (isMerchantDemoReady(item)) return "Demo ready";
  if (leadStatus === "rejected") return "Rejected";
  if (leadStatus === "assigned") return "Assigned";

  if (isTalkToExpertMerchantLead(item) || leadStatus === "expert_booked") {
    return "Talk to Expert";
  }

  return "Raw";
}

export function mapMerchantToTableRow(item) {
  const leadStatus = item.leadStatus || "new";
  const assignee = item.assignedPgName || "Unassigned";
  const sourceKey = item.source ?? null;

  return {
    ...defaultRowMeta,
    id: item.id,
    name: item.businessName,
    company: item.businessName,
    email: item.email,
    phone: item.phone,
    source: formatMerchantSource(item.source),
    sourceKey,
    industryKey: item.industry ?? null,
    priorityKey: item.priority ?? null,
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
    assignedPgId: item.assignedPgId ?? null,
    assignedPgName: item.assignedPgName ?? null,
    expertBookingId: item.expertBookingId ?? null,
    qualificationNotes: item.qualificationNotes ?? "",
    flaggedForReview: Boolean(item.flaggedForReview),
    status: formatMerchantListStatus({
      leadStatus,
      source: sourceKey,
      sourceKey,
      expertBookingId: item.expertBookingId,
      qualificationNotes: item.qualificationNotes ?? "",
    }),
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
    resellerType: formatResellerCommissionType(item.partnershipModel),
    totalLead: item.totalLeadCount ?? 0,
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
    adminNotes: item.adminNotes ?? "",
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

function formatPgAdminVerificationStatus(verificationStatus) {
  if (verificationStatus === "approved") return "Approved";
  if (verificationStatus === "rejected") return "Query Raised";
  if (verificationStatus === "pending_review" || verificationStatus === "incomplete") {
    return "In Review";
  }
  return formatLabel(verificationStatus);
}

export function mapPaymentGatewayToTableRow(item) {
  const verificationStatus = item.verificationStatus || "incomplete";

  return {
    ...defaultRowMeta,
    id: item.id,
    name: item.companyName || item.contactPerson,
    company: item.companyName,
    email: item.email,
    phone: item.phone,
    comparexRm: item.comparexRm || "—",
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
    totalLeadCount: item.totalLeadCount ?? 0,
    acceptedLeadCount: item.acceptedLeadCount ?? 0,
    onboardedLeadCount: item.onboardedLeadCount ?? 0,
    pendingLeadCount: item.pendingLeadCount ?? 0,
    conversionRate: item.conversionRate ?? 0,
    conversionRateLabel: formatConversionRate(item.conversionRate ?? 0),
    tteLeadCount: item.tteLeadCount ?? 0,
    tteConversionRate: item.tteConversionRate ?? 0,
    tteConversionRateLabel: formatConversionRate(item.tteConversionRate ?? 0),
    commercialModel: item.commercialModel ?? "revenue",
    perLeadFee: item.perLeadFee ?? null,
    status: formatPgAdminVerificationStatus(verificationStatus),
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

/** Admin list: Open | InProgress | Resolved | NA */
export function formatMerchantSupportListStatus(supportStatus) {
  const raw = String(supportStatus || "").toLowerCase();
  if (raw === "in_progress") return "InProgress";
  if (raw === "resolved") return "Resolved";
  if (raw === "new" || raw === "escalated") return "Open";
  return "NA";
}

export function formatMerchantSupportPriority(priority) {
  const raw = String(priority || "medium").toLowerCase();
  if (raw === "low") return "Low";
  if (raw === "high") return "High";
  if (raw === "medium") return "Med";
  return "NA";
}

export function formatMerchantSupportResponseTime(createdAt, firstResponseAt) {
  if (!createdAt || !firstResponseAt) return "—";
  const start = new Date(createdAt);
  const end = new Date(firstResponseAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return "—";
  }
  const diffMs = end.getTime() - start.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (hours < 24) return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return remHours > 0 ? `${days}d ${remHours}h` : `${days}d`;
}

export function mapMerchantSupportToTableRow(item) {
  const supportStatus = item.status ?? "new";
  const assigneeName = item.assigneeName?.trim() || "Unassigned";
  const pgLabel = item.escalatedPgName || item.paymentGateway || "—";
  const ticketPriority = item.priority ?? "medium";

  return {
    ...defaultRowMeta,
    id: item.id,
    ticketId: item.ticketNumber || `MS-${String(item.id).slice(-8).toUpperCase()}`,
    name: item.businessName,
    company: item.businessName,
    email: item.businessEmail,
    phone: item.contactNumber,
    source: item.source || "Merchant Support Desk",
    priority: formatMerchantSupportPriority(ticketPriority),
    supportPriority: ticketPriority,
    category: item.issueCategory || "—",
    workType: "Merchant Support",
    submittedAt: item.createdAt,
    createdAt: item.createdAt,
    firstResponseAt: item.firstResponseAt ?? null,
    responseTimeLabel: formatMerchantSupportResponseTime(
      item.createdAt,
      item.firstResponseAt,
    ),
    issueDescription: item.issueDescription,
    website: item.website,
    attachments: item.attachments ?? [],
    issueCategory: item.issueCategory || "—",
    paymentGateway: item.paymentGateway || "—",
    pgLabel,
    supportStatus,
    escalatedPgName: item.escalatedPgName ?? null,
    escalatedAt: item.escalatedAt ?? null,
    pgResponseAt: item.pgResponseAt ?? null,
    finalStatusAt: item.finalStatusAt ?? null,
    statusUpdatedAt: item.statusUpdatedAt ?? null,
    listStatus: formatMerchantSupportListStatus(supportStatus),
    assignee: assigneeName,
    assigneeInitials: assigneeName === "Unassigned" ? "—" : getInitials(assigneeName),
    assigneeColor: assigneeName === "Unassigned" ? "#94a3b8" : "#2D4CC8",
    status: formatSupportStatus(supportStatus),
  };
}

function formatExpertDemoDateTime(item, slotSummary) {
  if (item.scheduledAt) {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(item.scheduledAt));
  }
  if (slotSummary) return slotSummary;
  if (item.slotDateLabel && item.slotTime) {
    return `${item.slotDateLabel} · ${item.slotTime}`;
  }
  if (item.slotDateLabel) return item.slotDateLabel;
  if (item.bookingSource === "calendly") return "Calendly — see invite";
  return "—";
}

export function formatExpertDemoStatusLabel(demoStatus) {
  const map = {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No show",
    rescheduled: "Rescheduled",
  };
  return map[String(demoStatus || "scheduled")] ?? "Scheduled";
}

export function formatExpertOnboardingStatusLabel(onboardingStatus) {
  const map = {
    yes: "Yes",
    no: "No",
    in_progress: "Inprogress",
    rejected: "Rejected",
  };
  return map[String(onboardingStatus || "no")] ?? "No";
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
  const demoStatus = item.demoStatus ?? "scheduled";
  const onboardingStatus = item.onboardingStatus ?? "no";
  const expertName =
    item.representativeName?.trim() ||
    item.assignee?.trim() ||
    "—";
  const pgName = item.paymentGatewayName || gateway || "—";
  const demoDateTime = formatExpertDemoDateTime(item, slotSummary);

  return {
    ...defaultRowMeta,
    id: item.id,
    bookingId: item.bookingNumber || `TE-${String(item.id).slice(-8).toUpperCase()}`,
    name: item.fullName,
    merchantName: item.businessName || item.fullName,
    company: item.businessName,
    expertName,
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
    merchantLeadId: item.merchantLeadId ?? null,
    scheduledAt: item.scheduledAt ?? null,
    demoStatus,
    onboardingStatus,
    demoStatusLabel: formatExpertDemoStatusLabel(demoStatus),
    onboardingStatusLabel: formatExpertOnboardingStatusLabel(onboardingStatus),
    demoDateTime,
    pgName,
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
  const total = rows.length;
  const active = rows.filter((row) => row.accountStatus === "active").length;

  const acceptedTotal = rows.reduce((sum, row) => sum + (row.acceptedLeadCount ?? 0), 0);
  const onboardedTotal = rows.reduce((sum, row) => sum + (row.onboardedLeadCount ?? 0), 0);
  const leadActivationRate =
    acceptedTotal > 0 ? Math.round((onboardedTotal / acceptedTotal) * 1000) / 10 : 0;

  const pgRates = rows
    .filter((row) => (row.acceptedLeadCount ?? 0) > 0)
    .map((row) => Number(row.conversionRate) || 0);
  const avgLeadActivationRate =
    pgRates.length > 0
      ? Math.round((pgRates.reduce((sum, rate) => sum + rate, 0) / pgRates.length) * 10) / 10
      : 0;

  return {
    total,
    active,
    leadActivationRate,
    avgLeadActivationRate,
  };
}

export function buildPaymentGatewayStatsCards(currentRows = [], previousRows = []) {
  const current = computePaymentGatewayStats(currentRows);
  const previous = computePaymentGatewayStats(previousRows);

  const metrics = [
    {
      key: "total",
      label: "Total PGs",
      cardClass: "from-[#EEF2FC] to-[#f5f8ff]",
      format: (value) => String(value),
    },
    {
      key: "active",
      label: "Total Active PGs",
      cardClass: "from-[#ecfdf9] to-[#f2fcfa]",
      format: (value) => String(value),
    },
    {
      key: "leadActivationRate",
      label: "Lead Activation Rate",
      cardClass: "from-[#ecfdf5] to-[#f3fdf8]",
      format: (value) => formatConversionRate(value),
    },
    {
      key: "avgLeadActivationRate",
      label: "Avg. lead activation rate",
      cardClass: "from-[#eef0f8] to-[#f6f7fc]",
      format: (value) => formatConversionRate(value),
    },
  ];

  return metrics.map(({ key, label, cardClass, format }) => {
    const trend = calculatePercentChange(current[key], previous[key]);

    return {
      label,
      value: format(current[key]),
      trend: formatPercentTrend(trend),
      trendDirection: trend.direction,
      previousLabel: "vs previous period",
      previousValue: format(previous[key]),
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

export function buildPgActivationLeaders(rows = [], limit = 8) {
  return [...rows]
    .sort((a, b) => {
      const liveDiff = (b.onboardedLeadCount ?? 0) - (a.onboardedLeadCount ?? 0);
      if (liveDiff !== 0) return liveDiff;
      return (b.conversionRate ?? 0) - (a.conversionRate ?? 0);
    })
    .slice(0, limit)
    .map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name || row.company || "Payment Gateway",
      activations: row.onboardedLeadCount ?? 0,
      acceptedLeads: row.acceptedLeadCount ?? 0,
      activationRate: row.conversionRateLabel ?? formatConversionRate(row.conversionRate ?? 0),
    }));
}

const PG_BRAND_LOGOS = [
  { match: /razorpay/i, src: "/images/brand-logos/Razorpay_logo.svg" },
  { match: /cashfree/i, src: "/images/brand-logos/cashfree.png" },
  { match: /payu/i, src: "/images/brand-logos/Payu.png" },
  { match: /ccavenue|cc avenue/i, src: "/images/brand-logos/ccavenue.png" },
  { match: /paytm/i, src: "/images/brand-logos/paytm.png" },
  { match: /easebuzz/i, src: "/images/brand-logos/easebuzz.png" },
  { match: /stripe/i, src: "/images/brand-logos/stripe.png" },
  { match: /phonepe|phone pe/i, src: "/images/brand-logos/phonepe.png" },
  { match: /amazon/i, src: "/images/brand-logos/amazon.jpg" },
];

export function resolvePgBrandLogo(name = "") {
  const found = PG_BRAND_LOGOS.find((item) => item.match.test(String(name)));
  return found?.src ?? null;
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDayLabel(date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function isQualifiedLead(row) {
  return ["qualified", "assigned", "expert_booked"].includes(row.leadStatus);
}

function isRejectedLead(row) {
  return row.leadStatus === "rejected" || row.pgLeadStatus === "rejected";
}

function isOnboardedLead(row) {
  return row.pgLeadStatus === "live";
}

function leadMatchesPgFilter(row, pgFilter) {
  if (!pgFilter) return true;
  const pgId = pgFilter.id;
  const pgName = String(pgFilter.name || "").toLowerCase();
  if (row.assignedPgId && pgId && String(row.assignedPgId) === String(pgId)) {
    return true;
  }
  const assignedName = String(row.assignedPgName || row.assignee || "").toLowerCase();
  return Boolean(pgName) && assignedName.includes(pgName);
}

/** Daily Total / Qualified / Rejected / Onboarded series for admin overview chart. */
export function buildLeadsDailyTrend(rows = [], { days = 11, pgFilter = null } = {}) {
  const today = startOfLocalDay(new Date());
  const buckets = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    buckets.push({
      key: dayKey(date),
      date: formatDayLabel(date),
      total: 0,
      qualified: 0,
      rejected: 0,
      onboarded: 0,
    });
  }

  const byKey = Object.fromEntries(buckets.map((bucket) => [bucket.key, bucket]));

  for (const row of rows) {
    if (!leadMatchesPgFilter(row, pgFilter)) continue;
    if (!row.createdAt) continue;
    const created = new Date(row.createdAt);
    if (Number.isNaN(created.getTime())) continue;
    const bucket = byKey[dayKey(startOfLocalDay(created))];
    if (!bucket) continue;

    bucket.total += 1;
    if (isQualifiedLead(row)) bucket.qualified += 1;
    if (isRejectedLead(row)) bucket.rejected += 1;
    if (isOnboardedLead(row)) bucket.onboarded += 1;
  }

  return buckets.map(({ date, total, qualified, rejected, onboarded }) => ({
    date,
    total,
    qualified,
    rejected,
    onboarded,
  }));
}

/** Top PG vendors by total leads (fallback: onboarded). */
export function buildTopPgVendors(rows = [], limit = 5) {
  return [...rows]
    .sort((a, b) => {
      const totalDiff = (b.totalLeadCount ?? 0) - (a.totalLeadCount ?? 0);
      if (totalDiff !== 0) return totalDiff;
      return (b.onboardedLeadCount ?? 0) - (a.onboardedLeadCount ?? 0);
    })
    .slice(0, limit)
    .map((row) => {
      const name = row.name || row.company || "Payment Gateway";
      return {
        id: row.id,
        name,
        logoUrl: resolvePgBrandLogo(name),
        totalLeadCount: row.totalLeadCount ?? 0,
        onboardedLeadCount: row.onboardedLeadCount ?? 0,
      };
    });
}

function getSupportIssueCategory(row) {
  return row.issueCategory || row.category || "";
}

function normalizeSupportStatus(row) {
  const raw = row.supportStatus ?? row.status ?? "new";
  if (typeof raw !== "string") return "new";
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (normalized === "resolved") return "resolved";
  if (normalized === "in_progress" || normalized === "in progress") return "in_progress";
  if (normalized === "escalated") return "escalated";
  if (normalized === "new") return "new";
  return normalized;
}

function isSupportResolved(row) {
  return normalizeSupportStatus(row) === "resolved";
}

function isSupportOpen(row) {
  return !isSupportResolved(row);
}

function computeTopIssueCategory(rows = []) {
  const counts = new Map();
  for (const row of rows) {
    const label = String(getSupportIssueCategory(row) || "").trim();
    if (!label || label === "—") continue;
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  let top = { name: "—", count: 0 };
  for (const [name, count] of counts) {
    if (count > top.count) top = { name, count };
  }
  return top;
}

export function computeMerchantSupportStats(rows = []) {
  const total = rows.length;
  const open = rows.filter(isSupportOpen).length;
  const resolvedCount = rows.filter(isSupportResolved).length;
  const resolvedRate =
    total > 0 ? Math.round((resolvedCount / total) * 1000) / 10 : 0;
  const topIssue = computeTopIssueCategory(rows);

  return {
    total,
    open,
    resolvedRate,
    topIssueCategory: topIssue.name,
    topIssueCount: topIssue.count,
  };
}

export function buildMerchantSupportStatsCards(currentRows = [], previousRows = []) {
  const current = computeMerchantSupportStats(currentRows);
  const previous = computeMerchantSupportStats(previousRows);

  const metrics = [
    {
      key: "total",
      label: "Total Ticket",
      cardClass: "from-[#EEF2FC] to-[#f5f8ff]",
      format: (value) => String(value),
      previousFormat: (value) => String(value),
    },
    {
      key: "open",
      label: "Open Ticket",
      cardClass: "from-[#ecfdf9] to-[#f2fcfa]",
      format: (value) => String(value),
      previousFormat: (value) => String(value),
    },
    {
      key: "resolvedRate",
      label: "Resolved % Rate",
      cardClass: "from-[#ecfdf5] to-[#f3fdf8]",
      format: (value) => formatConversionRate(value),
      previousFormat: (value) => formatConversionRate(value),
    },
    {
      key: "topIssueCategory",
      label: "Top Issue category",
      cardClass: "from-[#eef0f8] to-[#f6f7fc]",
      format: (value) => String(value || "—"),
      previousFormat: (value) => String(value || "—"),
      trendKey: "topIssueCount",
      valueClassName: "text-xl sm:text-2xl leading-snug line-clamp-2",
    },
  ];

  return metrics.map(
    ({ key, label, cardClass, format, previousFormat, trendKey, valueClassName }) => {
      const trendSourceKey = trendKey || key;
      const trend = calculatePercentChange(current[trendSourceKey], previous[trendSourceKey]);

      return {
        label,
        value: format(current[key]),
        valueClassName: valueClassName || "",
        trend: formatPercentTrend(trend),
        trendDirection: trend.direction,
        previousLabel: "vs previous period",
        previousValue: previousFormat(previous[key]),
        cardClass,
      };
    },
  );
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

function countTopLabels(rows, getLabel, limit = 5) {
  const counts = new Map();
  for (const row of rows) {
    const label = String(getLabel(row) || "").trim();
    if (!label || label === "—") continue;
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function isExpertBookingOnboarding(row) {
  if (row.onboardingStatus === "in_progress" || row.onboardingStatus === "yes") {
    return true;
  }
  const status = row.expertStatus ?? row.status ?? "new";
  const normalized =
    typeof status === "string" && status.includes(" ")
      ? status.toLowerCase()
      : String(status).toLowerCase();
  if (normalized === "qualified" || normalized === "contacted") return true;
  if (status === "Qualified" || status === "Contacted") return true;
  if (row.merchantLeadId) return true;
  return false;
}

function expertDisplayName(row) {
  return (
    row.representativeName?.trim() ||
    row.assignee?.trim() ||
    null
  );
}

export function computeExpertBookingStats(rows = []) {
  const total = rows.length;
  const onboarding = rows.filter(isExpertBookingOnboarding).length;
  const topPgs = countTopLabels(
    rows,
    (row) => row.paymentGatewayName || row.category?.split(" · ")?.[0],
    5,
  );
  const topExperts = countTopLabels(rows, expertDisplayName, 5);

  return {
    total,
    onboarding,
    topPgs,
    topExperts,
  };
}

export function buildExpertBookingStatsCards(currentRows = [], previousRows = []) {
  const current = computeExpertBookingStats(currentRows);
  const previous = computeExpertBookingStats(previousRows);

  const metrics = [
    {
      key: "total",
      label: "Total Request",
      cardClass: "from-[#EEF2FC] to-[#f5f8ff]",
      variant: "number",
    },
    {
      key: "onboarding",
      label: "Total Onboarding",
      cardClass: "from-[#ecfdf9] to-[#f2fcfa]",
      variant: "number",
    },
    {
      key: "topPgs",
      label: "Top PG",
      cardClass: "from-[#ecfdf5] to-[#f3fdf8]",
      variant: "rankedList",
      sublabel: "5 names",
    },
    {
      key: "topExperts",
      label: "Top Expert",
      cardClass: "from-[#eef0f8] to-[#f6f7fc]",
      variant: "rankedList",
      sublabel: "5 names",
    },
  ];

  return metrics.map(({ key, label, cardClass, variant, sublabel }) => {
    if (variant === "rankedList") {
      const items = current[key] || [];
      const prevItems = previous[key] || [];
      const trend = calculatePercentChange(items.length, prevItems.length);

      return {
        label,
        sublabel,
        variant,
        items,
        value: items.length ? String(items.length) : "0",
        trend: formatPercentTrend(trend),
        trendDirection: trend.direction,
        previousLabel: "vs previous period",
        previousValue: String(prevItems.length),
        cardClass,
        emptyHint: "No data in this period",
      };
    }

    const trend = calculatePercentChange(current[key], previous[key]);

    return {
      label,
      variant: "number",
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
