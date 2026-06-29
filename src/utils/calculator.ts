import pricing from '../pricing.json';
import { CalculatorState, QuoteResult } from '../types';

export const calculateQuote = (state: CalculatorState): QuoteResult => {
  const deviceInfo = pricing.deviceTypes[state.deviceType as keyof typeof pricing.deviceTypes];
  const planInfo = pricing.plans[state.plan as keyof typeof pricing.plans];

  if (!deviceInfo || !planInfo) {
    return {
      monthlyPrice: 0,
      dueToday: 0,
      breakdown: {
        linesCost: 0, deviceCost: 0, monthlyDeviceAddOn: 0,
        planCost: 0, homeInternetCost: 0, autoPayDiscount: 0,
        homeInternetDiscount: 0, subtotal: 0, taxes: 0, processingFee: 0,
      },
    };
  }

  const numLines = state.numberOfLines === '5plus' ? 5 : parseInt(state.numberOfLines);
  const lineCountKey = state.numberOfLines === '5plus' ? '5plus' : state.numberOfLines;
  const planPricing = planInfo.pricing as Record<string, number>;
  const pricePerLine = planPricing[lineCountKey] ?? planPricing['1'];

  const linesCost = pricePerLine * numLines;
  const monthlyDeviceAddOn = deviceInfo.monthlyAddOn * numLines;
  const homeInternetCost = state.homeInternet ? 35 : 0;
  const homeInternetDiscount = 0; // future promo hook
  const autoPayDiscount = state.autoPay ? pricing.autoPay.discount * numLines : 0;
  const deviceCost = deviceInfo.deviceCost * numLines;

  const subtotal = linesCost + monthlyDeviceAddOn + homeInternetCost - homeInternetDiscount - autoPayDiscount;
  const taxes = state.includeTaxes ? Math.round(subtotal * 0.08 * 100) / 100 : 0;
  const monthlyPrice = Math.round((subtotal + taxes) * 100) / 100;
  const dueToday = Math.round((monthlyPrice + deviceCost + pricing.processingFee) * 100) / 100;

  return {
    monthlyPrice,
    dueToday,
    breakdown: {
      linesCost,
      deviceCost,
      monthlyDeviceAddOn,
      planCost: 0,           // included in linesCost; kept for type compat
      homeInternetCost,
      autoPayDiscount,
      homeInternetDiscount,
      subtotal,
      taxes,
      processingFee: pricing.processingFee,
    },
  };
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
