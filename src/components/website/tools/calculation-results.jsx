"use client";

import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const chartColors = ['#2D4CC8', '#40C3CF', '#25a36f', '#13203F'];

const CalculationResults = ({
  results,
  totalSummary,
  mode,
}) => {
  if (results.length === 0) {
    return null;
  }

  const chartData = [
    { name: 'PG Charges', value: totalSummary.pgCharges },
    { name: 'GST on PG', value: totalSummary.gstOnCharges },
    { name: 'Instant Settlement', value: totalSummary.instantSettlementFee },
    { name: 'GST on Settlement', value: totalSummary.gstOnInstantSettlement },
  ].filter((item) => item.value > 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-[#13203F]/8">
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-[#2D4CC8]/10 via-white to-[#40C3CF]/10 px-5 py-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2D4CC8]">
          {mode === 'singleTransaction' ? 'Daily Volume' : 'Monthly Volume'}
        </span>
        <h3 className="mt-1 text-lg font-bold text-[#13203F]">
          {mode === 'singleTransaction' ? 'Transaction Summary' : 'Monthly Volume Summary'}
        </h3>
      </div>

      {chartData.length > 0 && (
        <div className="border-b border-slate-100 bg-[#f8fafc] p-4 sm:p-5">
          <div className="h-56 w-full min-w-0 sm:h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 12, top: 4, bottom: 4 }}>
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} width={90} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="space-y-3 p-5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Total Amount</span>
          <span className="font-semibold text-[#13203F]">{formatCurrency(totalSummary.amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">PG Charges</span>
          <span className="font-medium text-red-600">{formatCurrency(totalSummary.pgCharges)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">GST on PG Charges (18%)</span>
          <span className="font-medium text-red-600">{formatCurrency(totalSummary.gstOnCharges)}</span>
        </div>
        {totalSummary.instantSettlementFee > 0 && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Instant Settlement Fee</span>
              <span className="font-medium text-red-600">{formatCurrency(totalSummary.instantSettlementFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">GST on Settlement Fee</span>
              <span className="font-medium text-red-600">{formatCurrency(totalSummary.gstOnInstantSettlement)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="text-slate-600">Total Deductions</span>
          <span className="font-semibold text-red-600">{formatCurrency(totalSummary.totalDeductions)}</span>
        </div>
        <div className="rounded-2xl border border-[#25a36f]/20 bg-gradient-to-r from-[#25a36f]/10 to-[#40C3CF]/10 px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#13203F]">Final Settlement</span>
            <span className="text-xl font-bold text-[#25a36f] sm:text-2xl">
              {formatCurrency(totalSummary.finalSettlement)}
            </span>
          </div>
        </div>
      </div>

      {results.length > 1 && (
        <div className="border-t border-slate-100 p-4 sm:p-5">
          <h4 className="mb-3 text-sm font-bold text-[#13203F] sm:text-base">Breakdown by Payment Method</h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-[#f4f6fc]">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4">
                    Payment Method
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4">
                    Distribution
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4">
                    Amount
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4">
                    Rate
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4">
                    PG Charges
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4">
                    GST
                  </th>
                  {totalSummary.instantSettlementFee > 0 && (
                    <>
                      <th scope="col" className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4">
                        Settlement Fee
                      </th>
                      <th scope="col" className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4">
                        GST on Fee
                      </th>
                    </>
                  )}
                  <th scope="col" className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#13203F]/70 sm:px-4">
                    Final Settlement
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {results.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td className="px-3 py-3 font-medium text-[#13203F] sm:px-4">
                      {result.paymentMethod.name}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-500 sm:px-4">
                      {formatPercentage(result.paymentMethod.distribution || 0)}
                    </td>
                    <td className="px-3 py-3 text-right text-[#13203F] sm:px-4">
                      {formatCurrency(result.amount)}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-500 sm:px-4">
                      {formatPercentage(result.paymentMethod.customRate !== undefined
                        ? result.paymentMethod.customRate
                        : result.paymentMethod.defaultRate)}
                    </td>
                    <td className="px-3 py-3 text-right text-red-600 sm:px-4">
                      {formatCurrency(result.pgCharges)}
                    </td>
                    <td className="px-3 py-3 text-right text-red-600 sm:px-4">
                      {formatCurrency(result.gstOnCharges)}
                    </td>
                    {totalSummary.instantSettlementFee > 0 && (
                      <>
                        <td className="px-3 py-3 text-right text-red-600 sm:px-4">
                          {formatCurrency(result.instantSettlementFee)}
                        </td>
                        <td className="px-3 py-3 text-right text-red-600 sm:px-4">
                          {formatCurrency(result.gstOnInstantSettlement)}
                        </td>
                      </>
                    )}
                    <td className="px-3 py-3 text-right font-semibold text-[#25a36f] sm:px-4">
                      {formatCurrency(result.finalSettlement)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#f4f6fc]">
                <tr>
                  <td className="px-3 py-3 font-bold text-[#13203F] sm:px-4">Total</td>
                  <td className="px-3 py-3 text-right text-slate-500 sm:px-4">100%</td>
                  <td className="px-3 py-3 text-right font-bold text-[#13203F] sm:px-4">
                    {formatCurrency(totalSummary.amount)}
                  </td>
                  <td className="px-3 py-3 sm:px-4" />
                  <td className="px-3 py-3 text-right font-semibold text-red-600 sm:px-4">
                    {formatCurrency(totalSummary.pgCharges)}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-red-600 sm:px-4">
                    {formatCurrency(totalSummary.gstOnCharges)}
                  </td>
                  {totalSummary.instantSettlementFee > 0 && (
                    <>
                      <td className="px-3 py-3 text-right font-semibold text-red-600 sm:px-4">
                        {formatCurrency(totalSummary.instantSettlementFee)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-red-600 sm:px-4">
                        {formatCurrency(totalSummary.gstOnInstantSettlement)}
                      </td>
                    </>
                  )}
                  <td className="px-3 py-3 text-right font-bold text-[#25a36f] sm:px-4">
                    {formatCurrency(totalSummary.finalSettlement)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationResults;
