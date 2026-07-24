import { NextResponse } from "next/server";
import {
  addMerchantSupportSubmission,
  listMerchantSupportSubmissions,
} from "@/lib/merchant-support-store";
import { validateContactFields } from "@/lib/validation";

export async function GET() {
  const submissions = await listMerchantSupportSubmissions();
  return NextResponse.json({ submissions });
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (!payload?.businessName?.trim() || !payload?.email?.trim() || !payload?.phone?.trim()) {
    return NextResponse.json(
      { message: "Business name, email, and phone are required" },
      { status: 400 }
    );
  }

  const contactError = validateContactFields({
    email: payload.email,
    phone: payload.phone,
  });

  if (contactError) {
    return NextResponse.json({ message: contactError }, { status: 400 });
  }

  const submission = await addMerchantSupportSubmission(payload);
  return NextResponse.json({ submission }, { status: 201 });
}
