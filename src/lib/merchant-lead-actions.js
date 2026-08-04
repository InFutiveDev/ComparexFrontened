import { ApiError, apiFetch } from "@/lib/api";
import {
  fetchPaymentGateways,
  updateMerchantAccountStatus,
  updateMerchantAdmin,
} from "@/lib/dashboard-api";
import { mapPaymentGatewayListResponse } from "@/lib/dashboard-mappers";

const EXPERT_INDUSTRY_FALLBACK = "other-businesses";
const EXPERT_PRIORITY_FALLBACK = "easy-onboarding-approval";

const EXPERT_INDUSTRIES = new Set([
  "ecommerce-d2c",
  "b2b-manufacturing",
  "saas-subscription-platforms",
  "education-healthcare",
  "travel-bill-payments",
  "other-businesses",
]);

const EXPERT_PRIORITIES = new Set([
  "lower-transaction-fees",
  "faster-settlements",
  "easy-onboarding-approval",
  "better-success-rates",
  "international-payment-support",
  "subscription-recurring-billing",
]);

function resolveIndustry(row) {
  const key = row.industryKey || row.industry;
  if (key && EXPERT_INDUSTRIES.has(key)) return key;
  return EXPERT_INDUSTRY_FALLBACK;
}

function resolvePriority(row) {
  const key = row.priorityKey || row.priority;
  if (key && EXPERT_PRIORITIES.has(key)) return key;
  return EXPERT_PRIORITY_FALLBACK;
}

async function resolvePaymentGatewayId(row) {
  if (row.assignedPgId) return { id: row.assignedPgId, name: row.assignedPgName || null };

  const response = await fetchPaymentGateways({ page: 1, limit: 50 });
  const { rows } = mapPaymentGatewayListResponse(response);
  const first = rows[0];
  if (!first?.id) {
    throw new ApiError("No payment gateway available to map Talk to Expert", 400);
  }
  return { id: first.id, name: first.name || first.company || null };
}

/** Mark merchant/lead as activated (PG live). */
export async function markMerchantActivated(row) {
  try {
    return await updateMerchantAdmin(row.id, { markActivated: true });
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "";
    if (!/no valid fields|invalid/i.test(message)) {
      throw err;
    }

    // Live API fallback: activate login account when available.
    if (row.userId) {
      await updateMerchantAccountStatus(row.id, "active");
      return { message: "Lead marked as activated" };
    }

    throw new ApiError(
      "Activate is not supported on this API yet. Use local API or deploy the latest backend.",
      400,
    );
  }
}

/** Flag merchant/lead for review. */
export async function flagMerchantForReview(row) {
  return updateMerchantAdmin(row.id, { flaggedForReview: true });
}

/**
 * Map lead into Talk to Expert section (creates expert booking when needed).
 */
export async function mapMerchantToTalkToExpert(row) {
  if (row.expertBookingId || row.leadStatus === "expert_booked") {
    try {
      return await updateMerchantAdmin(row.id, { mapToTalkToExpert: true });
    } catch {
      return { message: "Lead is already under Talk to Expert" };
    }
  }

  try {
    return await updateMerchantAdmin(row.id, { mapToTalkToExpert: true });
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "";
    if (!/no valid fields|invalid/i.test(message)) {
      throw err;
    }

    // Live API fallback: create expert booking + mark lead expert_booked.
    const pg = await resolvePaymentGatewayId(row);
    const booking = await apiFetch("/expert", {
      method: "POST",
      body: JSON.stringify({
        fullName: row.name || row.businessName || "Merchant",
        businessName: row.name || row.businessName || "Merchant",
        email: row.email,
        phone: row.phone,
        industry: resolveIndustry(row),
        priority: resolvePriority(row),
        paymentGatewayId: pg.id,
        paymentGatewayName: pg.name,
        slotId: `admin-map-${row.id}`,
        slotDateLabel: "Admin mapped",
        slotTime: "TBD",
        bookingSource: "manual",
      }),
    });

    try {
      await updateMerchantAdmin(row.id, { leadStatus: "expert_booked" });
    } catch {
      // Booking was created; lead status update is best-effort on older APIs.
    }

    return {
      message: "Lead mapped to Talk to Expert",
      expertBooking: booking.expertBooking,
    };
  }
}

export function normalizeLeadActionRow(lead) {
  return {
    id: lead.id,
    name: lead.name || lead.businessName,
    businessName: lead.businessName || lead.name,
    email: lead.email,
    phone: lead.phone,
    industry: lead.industry,
    industryKey: lead.industryKey || lead.industry,
    priority: lead.priority,
    priorityKey: lead.priorityKey || lead.priority,
    leadStatus: lead.leadStatus,
    pgLeadStatus: lead.pgLeadStatus,
    flaggedForReview: Boolean(lead.flaggedForReview),
    expertBookingId: lead.expertBookingId ?? null,
    assignedPgId: lead.assignedPgId ?? null,
    assignedPgName: lead.assignedPgName ?? null,
    qualificationNotes: lead.qualificationNotes ?? "",
    userId: lead.userId ?? null,
  };
}
