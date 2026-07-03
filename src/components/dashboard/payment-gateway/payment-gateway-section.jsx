import { PaymentGatewayTable } from "@/components/dashboard/payment-gateway/payment-gateway-table";
import { StatsCards } from "@/components/dashboard/payment-gateway/stats-cards";
import { paymentGatewayStats } from "@/lib/mock-data";

export function PaymentGatewaySection() {
  return (
    <div className="space-y-4">
      <StatsCards stats={paymentGatewayStats} />
      <PaymentGatewayTable variant="full" workTypeFilter="Payment Gateway" />
    </div>
  );
}
