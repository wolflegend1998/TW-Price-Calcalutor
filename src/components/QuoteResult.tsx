import React from 'react';
import { DollarSign, TrendingDown, Copy, Download } from 'lucide-react';
import { QuoteResult, CalculatorState } from '../types';
import { formatCurrency } from '../utils/calculator';

interface QuoteResultProps {
  quote: QuoteResult | null;
  state: CalculatorState;
}

export const QuoteResultComponent: React.FC<QuoteResultProps> = ({ quote, state }) => {
  if (!quote) return null;

  const handleCopy = () => {
    const summary = `
Total Wireless Deal Calculator Quote
=====================================
Configuration:
- Lines: ${state.numberOfLines}
- Customer Type: ${state.customerType === 'portIn' ? 'Port In' : 'New Number'}
- AutoPay: ${state.autoPay ? 'Yes' : 'No'}
- Home Internet: ${state.homeInternet ? 'Yes' : 'No'}
- Include Taxes: ${state.includeTaxes ? 'Yes' : 'No'}

Pricing Summary:
- Monthly Price: ${formatCurrency(quote.monthlyPrice)}
- Due Today: ${formatCurrency(quote.dueToday)}

Breakdown:
- Lines Cost: ${formatCurrency(quote.breakdown.linesCost)}
- Device Cost: ${formatCurrency(quote.breakdown.deviceCost)}
- Monthly Device Add-on: ${formatCurrency(quote.breakdown.monthlyDeviceAddOn)}
- Plan Cost: ${formatCurrency(quote.breakdown.planCost)}
- Home Internet: ${formatCurrency(quote.breakdown.homeInternetCost)}
- AutoPay Discount: -${formatCurrency(quote.breakdown.autoPayDiscount)}
- Home Internet Discount: -${formatCurrency(quote.breakdown.homeInternetDiscount)}
- Subtotal: ${formatCurrency(quote.breakdown.subtotal)}
- Taxes: ${formatCurrency(quote.breakdown.taxes)}
- Processing Fee: ${formatCurrency(quote.breakdown.processingFee)}
    `.trim();

    navigator.clipboard.writeText(summary);
    alert('Quote copied to clipboard!');
  };

  const handleDownload = () => {
    const csv = `
Configuration Summary
Lines,${state.numberOfLines}
Customer Type,${state.customerType === 'portIn' ? 'Port In' : 'New Number'}
AutoPay,${state.autoPay ? 'Yes' : 'No'}
Home Internet,${state.homeInternet ? 'Yes' : 'No'}
Include Taxes,${state.includeTaxes ? 'Yes' : 'No'}

Pricing Summary
Monthly Price,${quote.monthlyPrice}
Due Today,${quote.dueToday}

Breakdown
Lines Cost,${quote.breakdown.linesCost}
Device Cost,${quote.breakdown.deviceCost}
Monthly Device Add-on,${quote.breakdown.monthlyDeviceAddOn}
Plan Cost,${quote.breakdown.planCost}
Home Internet,${quote.breakdown.homeInternetCost}
AutoPay Discount,${-quote.breakdown.autoPayDiscount}
Home Internet Discount,${-quote.breakdown.homeInternetDiscount}
Subtotal,${quote.breakdown.subtotal}
Taxes,${quote.breakdown.taxes}
Processing Fee,${quote.breakdown.processingFee}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `tw-quote-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-4">
      {/* Main Quote Box */}
      <div className="card p-6 bg-gradient-to-br from-primary-50 dark:from-primary-900/30 to-transparent border-2 border-primary-200 dark:border-primary-700">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Price</p>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(quote.monthlyPrice)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <TrendingDown className="w-4 h-4" />
              <span>per month</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Due Today</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(quote.dueToday)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span>upfront</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 btn-secondary"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 btn-secondary"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Pricing Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Lines Cost</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(quote.breakdown.linesCost)}
            </span>
          </div>
          {quote.breakdown.planCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Plan Cost</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(quote.breakdown.planCost)}
              </span>
            </div>
          )}
          {quote.breakdown.monthlyDeviceAddOn > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Monthly Device Add-on</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(quote.breakdown.monthlyDeviceAddOn)}
              </span>
            </div>
          )}
          {quote.breakdown.homeInternetCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Home Internet</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(quote.breakdown.homeInternetCost)}
              </span>
            </div>
          )}

          <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
            {quote.breakdown.autoPayDiscount > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">AutoPay Discount</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  -{formatCurrency(quote.breakdown.autoPayDiscount)}
                </span>
              </div>
            )}
            {quote.breakdown.homeInternetDiscount > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Home Internet Discount</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  -{formatCurrency(quote.breakdown.homeInternetDiscount)}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(quote.breakdown.subtotal)}
              </span>
            </div>
            {quote.breakdown.taxes > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Taxes</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(quote.breakdown.taxes)}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3 bg-gray-100 dark:bg-gray-700 rounded p-3">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">Monthly Price</span>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(quote.monthlyPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                First Month + Device + Fee
              </span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(quote.dueToday)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
