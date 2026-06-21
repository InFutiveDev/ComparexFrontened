"use client";

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PAYMENT_METHODS, DEFAULT_INSTANT_SETTLEMENT_RATE } from '../constants/paymentMethods';
import { calculateCharges, calculateTotal } from '../utils/calculations';
import ToggleSwitch from './toggle-switch';
import PaymentMethodCard from './payment-method-card';
import { IndianRupee } from 'lucide-react';

const CalculationResults = dynamic(() => import('./calculation-results'), { ssr: false });

const Calculator = () => {
  const [amount, setAmount] = useState('10000');
  const [mode, setMode] = useState('singleTransaction');
  const [useCustomRates, setUseCustomRates] = useState(false);
  const [useInstantSettlement, setUseInstantSettlement] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(() =>
    PAYMENT_METHODS.map((method) => ({ ...method }))
  );
  const [customSettlementRate, setCustomSettlementRate] = useState(DEFAULT_INSTANT_SETTLEMENT_RATE);

  const amountValue = parseFloat(amount) || 0;

  const totalDistribution = paymentMethods.reduce(
    (sum, method) => sum + (method.selected && method.distribution ? method.distribution : 0),
    0
  );

  const calculation = useMemo(() => {
    if (amountValue <= 0) {
      return null;
    }

    const selectedMethods = paymentMethods.filter((method) => method.selected);

    if (selectedMethods.length === 0) {
      return null;
    }

    const totalDistributedAmount = selectedMethods.reduce(
      (sum, method) => sum + (method.distribution ? amountValue * method.distribution : 0),
      0
    );

    if (totalDistributedAmount > amountValue) {
      return null;
    }

    const results = selectedMethods.map((method) => {
      const methodAmount = method.distribution
        ? amountValue * method.distribution
        : amountValue / selectedMethods.length;

      return calculateCharges(methodAmount, method, useInstantSettlement, customSettlementRate);
    });

    const totalSummary = calculateTotal(results);

    return {
      amount: amountValue,
      selectedMethods,
      useInstantSettlement,
      instantSettlementRate: customSettlementRate,
      results,
      totalSummary,
      mode,
    };
  }, [amountValue, paymentMethods, useInstantSettlement, mode, customSettlementRate]);

  const handleMethodSelect = (id, selected) => {
    setPaymentMethods((prev) => {
      const currentTotalDistribution = prev.reduce(
        (sum, method) => sum + (method.selected && method.distribution ? method.distribution : 0),
        0
      );

      if (selected && currentTotalDistribution >= 1) {
        alert('Total distribution is already 100%. Cannot select additional methods.');
        return prev;
      }

      const updatedMethods = prev.map((method) =>
        method.id === id ? { ...method, selected, distribution: selected ? method.distribution : 0 } : method
      );
      return [...updatedMethods];
    });
  };

  const handleCustomRateChange = (id, rate) => {
    setPaymentMethods((prev) => {
      const updatedMethods = prev.map((method) =>
        method.id === id ? { ...method, customRate: rate } : method
      );
      return [...updatedMethods];
    });
  };

  const handleDistributionChange = (id, distribution) => {
    setPaymentMethods((prev) => {
      const currentTotal = prev.reduce(
        (sum, method) => sum + (method.id === id ? 0 : method.distribution || 0),
        0
      );

      if (currentTotal + distribution > 1) {
        alert('Total distribution exceeds 100%. Please adjust the distribution percentages.');
        return prev;
      }

      const updatedMethods = prev.map((method) =>
        method.id === id ? { ...method, distribution } : method
      );
      return [...updatedMethods];
    });
  };

  const handleSettlementRateToggle = (isDefault) => {
    if (isDefault) {
      setCustomSettlementRate(DEFAULT_INSTANT_SETTLEMENT_RATE);
    } else {
      setCustomSettlementRate(0);
    }
  };

  const pillBase =
    'flex-1 rounded-full border px-4 py-2.5 text-sm font-semibold leading-none transition';
  const pillActive =
    'border-[#2D4CC8] bg-[#2D4CC8] text-white shadow-md shadow-[#2D4CC8]/20';
  const pillInactive =
    'border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/40 hover:text-[#2D4CC8]';
  const stepCard =
    'rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5';
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-[#13203F] outline-none transition focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20 sm:text-base';

  function StepHeading({ step, title }) {
    return (
      <h3 className="mb-4 flex items-center gap-3 text-sm font-bold text-[#13203F] sm:text-base">
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#2D4CC8] text-xs font-bold text-white">
          {step}
        </span>
        {title}
      </h3>
    );
  }

  return (
    <div className="mx-auto w-full max-w-8xl">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#f8fafc] via-white to-[#eef2fc] shadow-xl shadow-[#13203F]/8">
        <div className="border-b border-slate-200/80 bg-white/90 px-4 py-5 backdrop-blur-sm sm:px-6">
          <h2 className="text-lg font-bold text-[#13203F] sm:text-xl">
            Payment Gateway Charges Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Calculate transaction charges and settlement amounts for online payments
          </p>
        </div>

        <div className="relative p-4 sm:p-6 lg:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            aria-hidden
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.12) 26px, rgba(45,76,200,0.12) 27px)",
            }}
          />
          <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4 sm:space-y-5">
              <div className={stepCard}>
                <StepHeading step="1" title="Select Transaction Type" />
                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    className={`${pillBase} ${mode === 'singleTransaction' ? pillActive : pillInactive}`}
                    onClick={() => setMode('singleTransaction')}
                  >
                    Daily Volume
                  </button>
                  <button
                    type="button"
                    className={`${pillBase} ${mode === 'monthlyVolume' ? pillActive : pillInactive}`}
                    onClick={() => setMode('monthlyVolume')}
                  >
                    Monthly Volume
                  </button>
                </div>
              </div>

              <div className={stepCard}>
                <StepHeading
                  step="2"
                  title={`Enter ${mode === 'singleTransaction' ? 'Transaction Amount' : 'Monthly Volume'}`}
                />
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <IndianRupee size={18} className="text-[#2D4CC8]" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`${inputClass} pl-11 pr-4`}
                    placeholder="Enter amount in INR"
                  />
                </div>
              </div>

              <div className={stepCard}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="flex items-center gap-3 text-sm font-bold text-[#13203F] sm:text-base">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#2D4CC8] text-xs font-bold text-white">
                      3
                    </span>
                    Select Payment Methods
                  </h3>
                  <ToggleSwitch
                    id="custom-rates-toggle"
                    label="Custom Rates"
                    isChecked={useCustomRates}
                    onChange={setUseCustomRates}
                  />
                </div>

                {totalDistribution > 1 && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-xs text-red-600 sm:text-sm">
                      Total distribution ({(totalDistribution * 100).toFixed(0)}%) exceeds 100%. Please
                      adjust the distribution percentages.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      method={method}
                      useCustomRates={useCustomRates}
                      onSelect={handleMethodSelect}
                      onCustomRateChange={handleCustomRateChange}
                      onDistributionChange={(id, distribution) => handleDistributionChange(id, distribution)}
                      totalDistribution={totalDistribution}
                    />
                  ))}
                </div>
              </div>

              <div className={stepCard}>
                <StepHeading step="4" title="Settlement Options" />
                <ToggleSwitch
                  id="instant-settlement-toggle"
                  label="Instant Settlement"
                  isChecked={useInstantSettlement}
                  onChange={setUseInstantSettlement}
                  description="Enable to add 0.25% extra charge or add custom charge for instant settlement"
                />

                {useInstantSettlement && (
                  <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
                    <label className="block text-sm font-semibold text-[#13203F]">Settlement Rate Type</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`${pillBase} !flex-none px-5 ${
                          customSettlementRate === DEFAULT_INSTANT_SETTLEMENT_RATE
                            ? pillActive
                            : pillInactive
                        }`}
                        onClick={() => handleSettlementRateToggle(true)}
                      >
                        Default Rate
                      </button>
                      <button
                        type="button"
                        className={`${pillBase} !flex-none px-5 ${
                          customSettlementRate !== DEFAULT_INSTANT_SETTLEMENT_RATE
                            ? pillActive
                            : pillInactive
                        }`}
                        onClick={() => handleSettlementRateToggle(false)}
                      >
                        Custom Rate
                      </button>
                    </div>

                    {customSettlementRate !== DEFAULT_INSTANT_SETTLEMENT_RATE && (
                      <div>
                        <label htmlFor="custom-settlement-rate" className="mb-1.5 block text-sm font-medium text-slate-600">
                          Custom Settlement Rate (%)
                        </label>
                        <input
                          type="number"
                          id="custom-settlement-rate"
                          min="0"
                          max="100"
                          step="0.01"
                          value={customSettlementRate * 100}
                          onChange={(e) => setCustomSettlementRate(parseFloat(e.target.value) / 100 || 0)}
                          className={inputClass}
                          placeholder="Enter custom settlement rate"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              {calculation ? (
                <CalculationResults
                  results={calculation.results}
                  totalSummary={calculation.totalSummary}
                  mode={calculation.mode}
                />
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#2D4CC8]/25 bg-white/80 p-6 text-center shadow-sm sm:min-h-[400px] sm:p-8">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#2D4CC8]/10 text-[#2D4CC8]">
                    <IndianRupee size={32} />
                  </div>
                  <h3 className="text-base font-bold text-[#13203F] sm:text-lg">
                    No calculation results yet
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                    Enter an amount and select payment methods to see charges, GST, and final settlement.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
