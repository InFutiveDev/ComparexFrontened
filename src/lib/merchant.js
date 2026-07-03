import { ApiError } from "@/lib/api";

export async function submitMerchantLead(payload) {
  const response = await fetch("/api/merchant-support", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new ApiError(data?.message || `API error: ${response.status}`, response.status);
  }

  return data;
}
