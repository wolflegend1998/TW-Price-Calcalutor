import pricing from '../pricing.json';
import { CalculatorState, QuoteResult } from '../types';

export const calculateQuote = (state: CalculatorState): QuoteResult => {
  const deviceInfo = pricing.deviceTypes[state.deviceType as keyof typeof pricing.deviceTypes];
  const planInfo = pricing.plans[state.plan as keyof typeof pricing.plans];
  
  // Get the number of lines
  const numLines = parseInt(state.numberOfLines);
  const lineCountKey = numLines >= 5 ? '5plus' : state.numberOfLines;
  
  // Get the plan price for this number of lines
  const planPricing = planInfo.pricing as Record<string, number>;
  const pricePerLine = planPricing[lineCountKey as keyof typeof planPricing] || planPricing['1'];
  
  // Calculate monthly costs
  let monthlyPlanCost = pricePerLine * numLines;
  let monthlyDeviceAddOn = deviceInfo.monthlyAddOn * numLines;
  
  let monthlyFWA = 0;
  if (state.homeInternet) {
    monthlyFWA = 35; // Add-on FWA pricing
  }

  let autoPayDiscount = 0;
  if (state.autoPay) {
    autoPayDiscount = pricing.autoPay.discount * numLines;
  }

  // Calculate subtotal for monthly
  let monthlySubtotal = 
    monthlyPlanCost + 
    monthlyDeviceAddOn + 
    monthlyFWA - 
    autoPayDiscount;

  // Calculate taxes (8% default)
  let monthlyTaxes = 0;
  if (state.includeTaxes) {
    monthlyTaxes = Math.round(monthlySubtotal * 0.08 * 100) / 100;
  }

  const monthlyPrice = monthlySubtotal + monthlyTaxes;

  // Calculate due today (first month + device cost + processing fee)
  const dueToday = 
    monthlyPrice + 
    (deviceInfo.deviceCost * numLines) + 
    pricing.processingFee;

  return {
    monthlyPrice: Math.round(monthlyPrice * 100) / 100,
    dueToday: Math.round(dueToday * 100) / 100,
    breakdown: {
      planCost: monthlyPlanCost,
      deviceCost: deviceInfo.deviceCost * numLines,
      monthlyDeviceAddOn: monthlyDeviceAddOn,
      fwaCost: monthlyFWA,
      autoPayDiscount: autoPayDiscount,
      subtotal: monthlySubtotal,
      taxes: monthlyTaxes,
      processingFee: pricing.processingFee,
    },
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
