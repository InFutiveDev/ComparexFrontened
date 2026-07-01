import { apiFormFetch } from "@/lib/api";

export async function submitSupportRequest(formData) {
  return apiFormFetch("/support", formData);
}
