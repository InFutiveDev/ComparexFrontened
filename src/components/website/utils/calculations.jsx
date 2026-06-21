import { GST_RATE, DEFAULT_INSTANT_SETTLEMENT_RATE } from '../constants/paymentMethods';

export const calculateCharges = (
  amount,
  paymentMethod,
  useInstantSettlement,
  instantSettlementRate = DEFAULT_INSTANT_SETTLEMENT_RATE
) => {
  const rateToApply = paymentMethod.customRate !== undefined
    ? paymentMethod.customRate
    : paymentMethod.defaultRate;

  const pgCharges = amount * rateToApply;
  const gstOnCharges = pgCharges * GST_RATE;
  const instantSettlementFee = useInstantSettlement ? amount * instantSettlementRate : 0;
  const gstOnInstantSettlement = useInstantSettlement ? instantSettlementFee * GST_RATE : 0;
  const totalDeductions = pgCharges + gstOnCharges + instantSettlementFee + gstOnInstantSettlement;
  const finalSettlement = amount - totalDeductions;

  return {
    paymentMethod,
    amount,
    pgCharges,
    gstOnCharges,
    instantSettlementFee,
    gstOnInstantSettlement,
    totalDeductions,
    finalSettlement,
  };
};

export const calculateTotal = (results) => {
  if (results.length === 0) {
    return {
      amount: 0,
      pgCharges: 0,
      gstOnCharges: 0,
      instantSettlementFee: 0,
      gstOnInstantSettlement: 0,
      totalDeductions: 0,
      finalSettlement: 0,
    };
  }

  const amount = results.reduce((sum, item) => sum + item.amount, 0);
  const pgCharges = results.reduce((sum, item) => sum + item.pgCharges, 0);
  const gstOnCharges = results.reduce((sum, item) => sum + item.gstOnCharges, 0);
  const instantSettlementFee = results.reduce((sum, item) => sum + item.instantSettlementFee, 0);
  const gstOnInstantSettlement = results.reduce((sum, item) => sum + item.gstOnInstantSettlement, 0);
  const totalDeductions = results.reduce((sum, item) => sum + item.totalDeductions, 0);
  const finalSettlement = results.reduce((sum, item) => sum + item.finalSettlement, 0);

  return {
    amount,
    pgCharges,
    gstOnCharges,
    instantSettlementFee,
    gstOnInstantSettlement,
    totalDeductions,
    finalSettlement,
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`;
};

export const distributeAmount = (amount, selectedMethods) => {
  const methodsWithoutDistribution = selectedMethods.filter((m) => !m.distribution);
  const totalExplicitDistribution = selectedMethods.reduce(
    (sum, m) => sum + (m.distribution || 0),
    0
  );

  const remainingDistribution = Math.max(0, 1 - totalExplicitDistribution);
  const defaultDistribution = methodsWithoutDistribution.length > 0
    ? remainingDistribution / methodsWithoutDistribution.length
    : 0;

  return selectedMethods.map((method) => ({
    ...method,
    distribution: method.distribution || defaultDistribution,
  }));
};
