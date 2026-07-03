import { PaymentGatewayDetails } from "@/components/dashboard/payment-gateway/payment-gateway-details";
import { merchants } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function PaymentGatewayDetailsPage({ params }) {
  const { id } = await params;
  const paymentGateway = merchants.find((item) => item.id === id);

  if (!paymentGateway || paymentGateway.workType !== "Payment Gateway") {
    notFound();
  }

  return <PaymentGatewayDetails paymentGateway={paymentGateway} />;
}
