import pricing from '../pricing.json';
import { CalculatorState, QuoteResult } from '../types';

export const calculateQuote = (state: CalculatorState): QuoteResult => {
  const customerTypeKey = state.customerType === 'portIn' ? 'portIn' : 'newNumber';
  const linePricing = pricing.linePrices[state.numberOfLines];
  const linePrice = linePricing[customerTypeKey as keyof typeof linePricing];

  const deviceInfo = pricing.deviceTypes[state.deviceType];
  const planInfo = pricing.plans[state.plan];

  // Calculate monthly costs
  let monthlyLinesCost = linePrice * parseInt(state.numberOfLines);
  let monthlyDeviceAddOn = deviceInfo.monthlyAddOn * parseInt(state.numberOfLines);
  let monthlyPlanCost = planInfo.monthlyPrice * parseInt(state.numberOfLines);
  
  let monthlyHomeInternet = 0;
  let homeInternetDiscount = 0;
  
  if (state.homeInternet) {
    monthlyHomeInternet = pricing.homeInternet.monthlyPrice;
    homeInternetDiscount = pricing.homeInternet.discount;
  }

  let autoPayDiscount = 0;
  if (state.autoPay) {
    autoPayDiscount = pricing.autoPay.discount;
  }

  // Calculate subtotal for monthly
  let monthlySubtotal = 
    monthlyLinesCost + 
    monthlyDeviceAddOn + 
    monthlyPlanCost + 
    monthlyHomeInternet - 
    autoPayDiscount - 
    homeInternetDiscount;

  // Calculate taxes
  let monthlyTaxes = 0;
  if (state.includeTaxes) {
    monthlyTaxes = Math.round(monthlySubtotal * pricing.taxRate * 100) / 100;
  }

  const monthlyPrice = monthlySubtotal + monthlyTaxes;

  // Calculate due today (first month + device cost + processing fee)
  const dueToday = 
    monthlyPrice + 
    (deviceInfo.deviceCost * parseInt(state.numberOfLines)) + 
    pricing.processingFee;

  return {
    monthlyPrice: Math.round(monthlyPrice * 100) / 100,
    dueToday: Math.round(dueToday * 100) / 100,
    breakdown: {
      linesCost: monthlyLinesCost,
      deviceCost: deviceInfo.deviceCost * parseInt(state.numberOfLines),
      monthlyDeviceAddOn: monthlyDeviceAddOn,
      planCost: monthlyPlanCost,
      homeInternetCost: monthlyHomeInternet,
      autoPayDiscount: autoPayDiscount,
      homeInternetDiscount: homeInternetDiscount,
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
