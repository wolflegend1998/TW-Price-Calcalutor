import React from 'react';
import { Users, Phone, Smartphone, Package, Wifi, CreditCard, CheckCircle2 } from 'lucide-react';
import { CalculatorState } from '../types';
import pricing from '../pricing.json';

interface InputSectionProps {
  state: CalculatorState;
  onChange: (state: CalculatorState) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ state, onChange }) => {
  const handleLineChange = (lines: string) => {
    onChange({ ...state, numberOfLines: lines });
  };

  const handleCustomerTypeChange = (type: 'portIn' | 'newNumber') => {
    onChange({ ...state, customerType: type });
  };

  const handleDeviceChange = (device: string) => {
    onChange({ ...state, deviceType: device });
  };

  const handlePlanChange = (plan: string) => {
    onChange({ ...state, plan });
  };

  const handleHomeInternetChange = (value: boolean) => {
    onChange({ ...state, homeInternet: value });
  };

  const handleAutoPayChange = (value: boolean) => {
    onChange({ ...state, autoPay: value });
  };

  const handleTaxesChange = (value: boolean) => {
    onChange({ ...state, includeTaxes: value });
  };

  return (
    <div className="space-y-6">
      {/* Number of Lines */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            Number of Lines
          </label>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {['1', '2', '3', '4', '5plus'].map((line) => (
            <button
              key={line}
              onClick={() => handleLineChange(line)}
              className={`py-2 px-1 sm:px-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                state.numberOfLines === line
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {line === '5plus' ? '5+' : line}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Type */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer Type
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleCustomerTypeChange('portIn')}
            className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              state.customerType === 'portIn'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Port In
          </button>
          <button
            onClick={() => handleCustomerTypeChange('newNumber')}
            className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              state.customerType === 'newNumber'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            New Number
          </button>
        </div>
      </div>

      {/* Device Type */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            Device Type
          </label>
        </div>
        <div className="space-y-2">
          {Object.entries(pricing.deviceTypes).map(([key, device]) => (
            <button
              key={key}
              onClick={() => handleDeviceChange(key)}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-left ${
                state.deviceType === key
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{device.name}</span>
                {device.deviceCost > 0 && (
                  <span className="text-sm opacity-80">+${device.deviceCost}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Plan Selection */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            Plan Selection
          </label>
        </div>
        <div className="space-y-2">
          {Object.entries(pricing.plans).map(([key, plan]) => (
            <button
              key={key}
              onClick={() => handlePlanChange(key)}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-left ${
                state.plan === key
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{plan.name}</span>
                <span className="text-sm opacity-80">${plan.monthlyPrice}/mo</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wifi className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            Add-ons
          </label>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={state.homeInternet}
              onChange={(e) => handleHomeInternetChange(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <div className="flex justify-between items-center flex-1">
              <span className="text-gray-900 dark:text-white font-medium">Home Internet</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                $35/mo
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* AutoPay */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            AutoPay
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAutoPayChange(true)}
            className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              state.autoPay
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => handleAutoPayChange(false)}
            className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              !state.autoPay
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Taxes & Fees */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            Options
          </label>
        </div>
        <label className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <input
            type="checkbox"
            checked={state.includeTaxes}
            onChange={(e) => handleTaxesChange(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <span className="text-gray-900 dark:text-white font-medium">Include Taxes & Fees</span>
        </label>
      </div>
    </div>
  );
};
