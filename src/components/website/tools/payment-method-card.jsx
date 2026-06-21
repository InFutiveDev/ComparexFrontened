import React, { useState, useEffect } from 'react';
import { formatPercentage } from '../utils/calculations';

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#13203F] outline-none transition focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20';

const PaymentMethodCard = ({
  method,
  useCustomRates,
  onSelect,
  onCustomRateChange,
  onDistributionChange,
  totalDistribution,
}) => {
  const [customRate, setCustomRate] = useState(
    method.customRate ? String(method.customRate * 100) : String(method.defaultRate * 100)
  );
  const [distribution, setDistribution] = useState(
    method.distribution ? String(method.distribution * 100) : '0'
  );

  useEffect(() => {
    setCustomRate(method.customRate ? String(method.customRate * 100) : String(method.defaultRate * 100));
    setDistribution(method.distribution ? String(method.distribution * 100) : '0');
  }, [method.id, method.customRate, method.distribution, method.defaultRate]);

  const handleCustomRateChange = (e) => {
    const value = e.target.value;
    setCustomRate(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onCustomRateChange(method.id, numValue / 100);
    }
  };

  const handleDistributionChange = (e) => {
    const value = e.target.value;
    const numValue = parseFloat(value);

    if (!isNaN(numValue)) {
      const newDistribution = Math.min(numValue / 100, 1);
      setDistribution(String(newDistribution * 100));
      onDistributionChange(method.id, newDistribution);
    } else {
      setDistribution('0');
      onDistributionChange(method.id, 0);
    }
  };

  const remainingDistribution = Math.max(0, 100 - ((totalDistribution - (method.distribution || 0)) * 100));

  return (
    <div
      className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
        method.selected
          ? 'border-[#2D4CC8] bg-[#2D4CC8]/5 shadow-sm ring-2 ring-[#2D4CC8]/15'
          : 'border-slate-200 bg-white hover:border-[#2D4CC8]/30 hover:shadow-sm'
      }`}
      onClick={() => onSelect(method.id, !method.selected)}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={method.selected || false}
            onChange={() => onSelect(method.id, !method.selected)}
            className="size-4 rounded border-slate-300 text-[#2D4CC8] focus:ring-[#2D4CC8]/30"
            onClick={(e) => e.stopPropagation()}
          />
          <label className="text-sm font-semibold text-[#13203F]">{method.name}</label>
        </div>
        <span className="shrink-0 rounded-full border border-[#2D4CC8]/20 bg-white px-2 py-0.5 text-[11px] font-semibold text-[#2D4CC8]">
          {formatPercentage(method.defaultRate)}
        </span>
      </div>

      {method.selected && (
        <div className="mt-3 space-y-3 border-t border-[#2D4CC8]/10 pt-3">
          {useCustomRates && (
            <div>
              <label htmlFor={`rate-${method.id}`} className="mb-1.5 block text-xs font-medium text-slate-500">
                Custom Rate (%)
              </label>
              <input
                id={`rate-${method.id}`}
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={customRate}
                onChange={handleCustomRateChange}
                onClick={(e) => e.stopPropagation()}
                className={fieldClass}
              />
            </div>
          )}

          <div>
            <label htmlFor={`distribution-${method.id}`} className="mb-1.5 block text-xs font-medium text-slate-500">
              Volume Distribution (%)
            </label>
            <input
              id={`distribution-${method.id}`}
              type="number"
              min="0"
              max={remainingDistribution}
              step="1"
              value={distribution}
              onChange={handleDistributionChange}
              onClick={(e) => e.stopPropagation()}
              className={fieldClass}
            />
            {totalDistribution > 1 && (
              <p className="mt-1 text-xs text-red-500">Total distribution exceeds 100%</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;
